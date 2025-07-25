import React, { useRef, useMemo, useEffect, useState, useCallback, ErrorInfo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Error Boundary for WebGL failures
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('WebGL Error caught by boundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Performance Monitor Hook
function usePerformanceMonitor() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameTimeRef = useRef<number[]>([]);
  const lastFrameTime = useRef(performance.now());

  const checkPerformance = useCallback(() => {
    const now = performance.now();
    const frameTime = now - lastFrameTime.current;
    lastFrameTime.current = now;

    frameTimeRef.current.push(frameTime);
    if (frameTimeRef.current.length > 60) { // Check last 60 frames
      frameTimeRef.current.shift();

      const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
      const fps = 1000 / avgFrameTime;

      // Switch to low performance mode if FPS drops below 30
      if (fps < 30 && !isLowPerformance) {
        console.warn('Low performance detected, switching to optimized mode');
        setIsLowPerformance(true);
      }
    }
  }, [isLowPerformance]);

  return { isLowPerformance, checkPerformance };
}

// Global WebGL Context Manager - Ensures ONLY ONE context exists
class GlobalWebGLManager {
  private static instance: GlobalWebGLManager;
  private activeCanvas: HTMLCanvasElement | null = null;
  private activeComponent: string | null = null;
  private contextLossCount = 0;
  private pendingComponents = new Set<string>();

  static getInstance(): GlobalWebGLManager {
    if (!GlobalWebGLManager.instance) {
      GlobalWebGLManager.instance = new GlobalWebGLManager();
    }
    return GlobalWebGLManager.instance;
  }

  requestWebGLAccess(componentId: string): boolean {
    // If this component already has access, allow it
    if (this.activeComponent === componentId) {
      return true;
    }

    // If no active component, grant access
    if (!this.activeComponent) {
      this.activeComponent = componentId;
      console.log(`WebGL access granted to: ${componentId}`);
      return true;
    }

    // Add to pending queue
    this.pendingComponents.add(componentId);
    console.log(`WebGL access queued for: ${componentId} (active: ${this.activeComponent})`);
    return false;
  }

  releaseWebGLAccess(componentId: string): void {
    if (this.activeComponent === componentId) {
      // Force cleanup of current context
      if (this.activeCanvas) {
        this.forceContextLoss(this.activeCanvas);
        this.activeCanvas = null;
      }

      this.activeComponent = null;
      console.log(`WebGL access released by: ${componentId}`);

      // Grant access to next pending component
      if (this.pendingComponents.size > 0) {
        const nextComponent = this.pendingComponents.values().next().value;
        this.pendingComponents.delete(nextComponent);
        this.activeComponent = nextComponent;
        console.log(`WebGL access transferred to: ${nextComponent}`);

        // Trigger re-render of the next component
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('webgl-access-granted', {
            detail: { componentId: nextComponent }
          }));
        }, 100);
      }
    } else {
      // Remove from pending queue
      this.pendingComponents.delete(componentId);
    }
  }

  registerCanvas(componentId: string, canvas: HTMLCanvasElement): void {
    if (this.activeComponent === componentId) {
      this.activeCanvas = canvas;
    }
  }

  private forceContextLoss(canvas: HTMLCanvasElement): void {
    try {
      const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
      if (gl) {
        const loseExt = gl.getExtension('WEBGL_lose_context');
        if (loseExt) {
          loseExt.loseContext();
          console.log('Forced context loss for canvas cleanup');
        }
      }
    } catch (error) {
      console.warn('Failed to force context loss:', error);
    }
  }

  reportContextLoss(): void {
    this.contextLossCount++;
    console.warn(`WebGL context loss #${this.contextLossCount}`);
  }

  getContextLossCount(): number {
    return this.contextLossCount;
  }

  getActiveComponent(): string | null {
    return this.activeComponent;
  }

  getPendingCount(): number {
    return this.pendingComponents.size;
  }
}

// Global WebGL Hook - Ensures only ONE WebGL context exists
function useGlobalWebGL(componentId: string) {
  const [contextLost, setContextLost] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [hasWebGLAccess, setHasWebGLAccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webglManager = useRef(GlobalWebGLManager.getInstance());
  const { isLowPerformance, checkPerformance } = usePerformanceMonitor();

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault();
    webglManager.current.reportContextLoss();
    console.warn(`WebGL context lost (loss #${webglManager.current.getContextLossCount()})`);
    setContextLost(true);

    // Quick recovery attempt
    setTimeout(() => {
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setContextLost(false);
      } else {
        console.warn('Multiple context losses detected, switching to fallback mode');
        setFallbackMode(true);
      }
    }, 100);
  }, [retryCount]);

  const handleContextRestored = useCallback(() => {
    console.log('WebGL context successfully restored');
    setContextLost(false);
    setRetryCount(0);
  }, []);

  const retryContext = useCallback(() => {
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setContextLost(false);
    } else {
      setFallbackMode(true);
    }
  }, [retryCount]);

  // Request WebGL access on mount
  useEffect(() => {
    const hasAccess = webglManager.current.requestWebGLAccess(componentId);
    setHasWebGLAccess(hasAccess);

    // Listen for access granted events
    const handleAccessGranted = (event: CustomEvent) => {
      if (event.detail.componentId === componentId) {
        setHasWebGLAccess(true);
        setFallbackMode(false);
        setRetryCount(0);
      }
    };

    window.addEventListener('webgl-access-granted', handleAccessGranted as EventListener);

    return () => {
      window.removeEventListener('webgl-access-granted', handleAccessGranted as EventListener);
      webglManager.current.releaseWebGLAccess(componentId);
    };
  }, [componentId]);

  // Setup context loss handling when canvas is available
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && hasWebGLAccess) {
      webglManager.current.registerCanvas(componentId, canvas);
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);

      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      };
    }
  }, [handleContextLost, handleContextRestored, hasWebGLAccess, componentId]);

  // Force fallback if no WebGL access
  useEffect(() => {
    if (!hasWebGLAccess) {
      setFallbackMode(true);
    }
  }, [hasWebGLAccess]);

  return {
    contextLost,
    retryCount,
    retryContext,
    canvasRef,
    isLowPerformance,
    checkPerformance,
    fallbackMode: fallbackMode || !hasWebGLAccess,
    hasWebGLAccess
  };
}

// Lightweight CSS Fallback Sphere
const CSSFallbackSphere: React.FC<{
  voiceAmplitude: number;
  isListening: boolean;
  isSpeaking: boolean;
}> = ({ voiceAmplitude, isListening, isSpeaking }) => {
  const scale = 1 + (isListening || isSpeaking ? voiceAmplitude * 0.2 : 0);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className={`relative rounded-full transition-all duration-300 ${
          isSpeaking 
            ? 'bg-gradient-to-br from-pink-500 to-purple-600' 
            : isListening 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
            : 'bg-gradient-to-br from-slate-400 to-slate-600'
        }`}
        style={{
          width: '200px',
          height: '200px',
          transform: `scale(${scale})`,
          boxShadow: `0 0 ${20 + voiceAmplitude * 40}px ${
            isSpeaking ? 'rgba(236, 72, 153, 0.5)' : 
            isListening ? 'rgba(79, 70, 229, 0.5)' : 
            'rgba(100, 116, 139, 0.3)'
          }`,
          animation: isListening || isSpeaking ? 'pulse 2s infinite' : 'none'
        }}
      >
        {/* Simple Eyes */}
        <div className="absolute top-1/3 left-1/4 w-3 h-8 bg-white rounded-full opacity-90"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-8 bg-white rounded-full opacity-90"></div>
        
        {/* Pulsing Ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"
          style={{ animationDuration: '3s' }}
        ></div>
      </div>
    </div>
  );
};

// Enhanced Sphere Components with Full Features
interface SphereProps {
  voiceAmplitude: number;
  isListening: boolean;
  isSpeaking?: boolean;
}

// Custom shader material for wavy energy field effect
const vertexShader = `
  uniform float time;
  uniform float distortionScale;
  uniform float speed;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;
    float noise = sin(pos.x * 4.0 + time * speed) *
                  sin(pos.y * 4.0 + time * speed * 0.8) *
                  sin(pos.z * 4.0 + time * speed * 1.2);

    pos += normal * noise * distortionScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 color;
  uniform float opacity;
  uniform float time;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec3 finalColor = color;
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    finalColor += fresnel * 0.3;

    gl_FragColor = vec4(finalColor, opacity);
  }
`;

// Fluid organic sphere with custom shader material
function FluidSphere({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    distortionScale: { value: 0.2 },
    speed: { value: 1.5 },
    color: { value: new THREE.Color(isSpeaking ? "#ec4899" : "#4f46e5") },
    opacity: { value: 0.8 }
  }), []);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Scale based on voice amplitude or speaking state
      const baseScale = 1.5;
      const amplitudeScale = (isListening || isSpeaking) ? 1 + voiceAmplitude * 0.3 : 1;
      meshRef.current.scale.setScalar(baseScale * amplitudeScale);

      // Faster rotation when speaking
      const rotationSpeed = isSpeaking ? 0.008 : 0.003;
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x += rotationSpeed * 0.3;
      meshRef.current.rotation.z += rotationSpeed * 0.7;

      // Update shader uniforms
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.distortionScale.value = (isListening || isSpeaking) ? 0.4 + voiceAmplitude * 0.6 : 0.2;
      materialRef.current.uniforms.speed.value = isSpeaking ? 2.5 : 1.5;
      materialRef.current.uniforms.color.value.setHex(isSpeaking ? 0xec4899 : 0x4f46e5);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Enhanced Eyes with Mouse Tracking
function StickyEyes({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const leftEyelidRef = useRef<THREE.Mesh>(null);
  const rightEyelidRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [blinkProgress, setBlinkProgress] = useState(0);

  // Mouse position tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = document.body.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Blinking animation
  useEffect(() => {
    const startBlinkCycle = () => {
      const nextBlinkTime = 2000 + Math.random() * 3000;
      setTimeout(() => {
        let progress = 0;
        const closeInterval = setInterval(() => {
          progress += 0.1;
          setBlinkProgress(Math.min(progress, 1));
          if (progress >= 1) {
            clearInterval(closeInterval);
            setTimeout(() => {
              let openProgress = 1;
              const openInterval = setInterval(() => {
                openProgress -= 0.1;
                setBlinkProgress(Math.max(openProgress, 0));
                if (openProgress <= 0) {
                  clearInterval(openInterval);
                  startBlinkCycle();
                }
              }, 15);
            }, 50);
          }
        }, 15);
      }, nextBlinkTime);
    };
    startBlinkCycle();
  }, []);

  useFrame(() => {
    if (leftEyeRef.current && rightEyeRef.current && leftEyelidRef.current && rightEyelidRef.current) {
      // Mouse tracking
      const sensitivityMultiplier = 1.5;
      const amplifiedMouseX = mousePosition.x * sensitivityMultiplier;
      const amplifiedMouseY = mousePosition.y * sensitivityMultiplier;
      const clampedX = Math.max(-1.5, Math.min(1.5, amplifiedMouseX));
      const clampedY = Math.max(-1.5, Math.min(1.5, amplifiedMouseY));

      const vector = new THREE.Vector3(clampedX, clampedY, 0.8);
      vector.unproject(camera);

      const sphereRadius = 1.4;
      const mouseDirection = vector.clone().normalize();
      const eyeOffsetDistance = 0.2;

      // Eye positions
      const leftOffset = new THREE.Vector3(-eyeOffsetDistance, 0, 0);
      const leftTargetDirection = mouseDirection.clone().add(leftOffset).normalize();
      const leftEyePosition = leftTargetDirection.multiplyScalar(sphereRadius);

      const rightOffset = new THREE.Vector3(eyeOffsetDistance, 0, 0);
      const rightTargetDirection = mouseDirection.clone().add(rightOffset).normalize();
      const rightEyePosition = rightTargetDirection.multiplyScalar(sphereRadius);

      leftEyeRef.current.position.lerp(leftEyePosition, 0.1);
      rightEyeRef.current.position.lerp(rightEyePosition, 0.1);

      // Blinking
      const eyeHeight = 0.30;
      const initialCoverage = 0.12;
      const initialEyelidHeight = eyeHeight * initialCoverage;
      const blinkEyelidHeight = eyeHeight + 0.04;
      const currentEyelidHeight = initialEyelidHeight + (blinkProgress * (blinkEyelidHeight - initialEyelidHeight));
      const eyeTopY = eyeHeight / 2;
      const blinkEyelidY = eyeTopY - (currentEyelidHeight / 2);

      leftEyelidRef.current.scale.set(1, currentEyelidHeight / initialEyelidHeight, 1);
      rightEyelidRef.current.scale.set(1, currentEyelidHeight / initialEyelidHeight, 1);
      leftEyelidRef.current.position.y = blinkEyelidY;
      rightEyelidRef.current.position.y = blinkEyelidY;

      // Speaking animation
      const speakingScale = isSpeaking ? 1 + voiceAmplitude * 0.2 : 1;
      leftEyeRef.current.scale.setScalar(speakingScale);
      rightEyeRef.current.scale.setScalar(speakingScale);
    }
  });

  return (
    <group>
      <group ref={leftEyeRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.09, 0.30, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.1}
            emissive={isSpeaking ? "#ff2222" : isListening ? "#2222ff" : "#000000"}
            emissiveIntensity={isSpeaking ? 0.3 : isListening ? 0.2 : 0}
          />
        </mesh>
        <mesh ref={leftEyelidRef} position={[0, 0.114, 0.001]}>
          <boxGeometry args={[0.10, 0.036, 0.025]} />
          <meshStandardMaterial color="#000000" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
      <group ref={rightEyeRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.09, 0.30, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.1}
            emissive={isSpeaking ? "#ff2222" : isListening ? "#2222ff" : "#000000"}
            emissiveIntensity={isSpeaking ? 0.3 : isListening ? 0.2 : 0}
          />
        </mesh>
        <mesh ref={rightEyelidRef} position={[0, 0.114, 0.001]}>
          <boxGeometry args={[0.10, 0.036, 0.025]} />
          <meshStandardMaterial color="#000000" roughness={0.8} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// Inner flowing core - from original AnimatedSphere.tsx
function InnerCore({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    distortionScale: { value: 0.3 },
    speed: { value: 2.5 },
    color: { value: new THREE.Color(isSpeaking ? "#f59e0b" : "#ec4899") },
    opacity: { value: 0.6 }
  }), []);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      // Counter-rotation for dynamic effect, faster when speaking
      const rotationSpeed = isSpeaking ? 0.015 : 0.008;
      meshRef.current.rotation.y -= rotationSpeed;
      meshRef.current.rotation.x += rotationSpeed * 0.5;

      // Scale with voice or speaking
      const scale = 0.6 + ((isListening || isSpeaking) ? voiceAmplitude * 0.4 : 0);
      meshRef.current.scale.setScalar(scale);

      // Update shader
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime() * (isSpeaking ? 2 : 1.5);
      materialRef.current.uniforms.distortionScale.value = (isListening || isSpeaking) ? 0.6 + voiceAmplitude * 0.8 : 0.3;
      materialRef.current.uniforms.speed.value = isSpeaking ? 3.5 : 2.5;
      materialRef.current.uniforms.color.value.setHex(isSpeaking ? 0xf59e0b : 0xec4899);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Energy field around the sphere with wavy animation - from original AnimatedSphere.tsx
function EnergyField({ voiceAmplitude, isListening }: SphereProps) {
  const fieldRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    distortionScale: { value: 0.3 },
    speed: { value: 1.5 },
    color: { value: new THREE.Color(isListening ? "#4f46e5" : "#6366f1") },
    opacity: { value: 0.08 }
  }), []);

  useFrame((state) => {
    if (fieldRef.current && materialRef.current) {
      // Multi-axis rotation for dynamic energy flow
      fieldRef.current.rotation.y += 0.008;
      fieldRef.current.rotation.x += 0.005;
      fieldRef.current.rotation.z += 0.003;

      // Update shader uniforms
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.distortionScale.value = 0.3 + voiceAmplitude * 0.7;
      materialRef.current.uniforms.speed.value = 1.5 + voiceAmplitude * 2.5;
      materialRef.current.uniforms.color.value.setHex(isListening ? 0x4f46e5 : 0x6366f1);
      materialRef.current.uniforms.opacity.value = isListening ? 0.15 + voiceAmplitude * 0.25 : 0.08;
    }
  });

  return (
    <mesh ref={fieldRef}>
      <sphereGeometry args={[2.8, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Enhanced Particle System with Dynamic Behavior
function EnhancedParticles({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 3000;

  const { positions, velocities, originalPositions } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities, originalPositions };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positionAttribute = particlesRef.current.geometry.attributes.position;

      // Dynamic particle movement
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Base wave motion
        const waveX = Math.sin(time * 0.5 + originalPositions[i3] * 0.1) * 0.1;
        const waveY = Math.cos(time * 0.3 + originalPositions[i3 + 1] * 0.1) * 0.1;
        const waveZ = Math.sin(time * 0.7 + originalPositions[i3 + 2] * 0.1) * 0.1;

        // Voice amplitude effect
        const amplitudeEffect = (isListening || isSpeaking) ? voiceAmplitude * 0.5 : 0;
        const pulseEffect = Math.sin(time * 3 + i * 0.1) * amplitudeEffect;

        positionAttribute.array[i3] = originalPositions[i3] + waveX + pulseEffect;
        positionAttribute.array[i3 + 1] = originalPositions[i3 + 1] + waveY + pulseEffect;
        positionAttribute.array[i3 + 2] = originalPositions[i3 + 2] + waveZ + pulseEffect;
      }

      positionAttribute.needsUpdate = true;

      // Overall rotation and scaling
      particlesRef.current.rotation.y += isSpeaking ? 0.003 : 0.001;
      particlesRef.current.rotation.x += 0.0005;

      const scale = 1 + (isListening || isSpeaking ? voiceAmplitude * 0.2 : 0);
      particlesRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Points ref={particlesRef} positions={positions}>
      <PointMaterial
        size={0.015}
        transparent
        opacity={isSpeaking ? 0.9 : isListening ? 0.7 : 0.5}
        color={isSpeaking ? "#ec4899" : isListening ? "#4f46e5" : "#6366f1"}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Energy Ring Effect
function EnergyRings({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (ring1Ref.current && ring2Ref.current && ring3Ref.current) {
      // Rotating rings at different speeds
      ring1Ref.current.rotation.x = time * 0.5;
      ring1Ref.current.rotation.y = time * 0.3;

      ring2Ref.current.rotation.x = time * -0.3;
      ring2Ref.current.rotation.z = time * 0.4;

      ring3Ref.current.rotation.y = time * -0.6;
      ring3Ref.current.rotation.z = time * 0.2;

      // Scale with voice amplitude
      const scale = 1 + (isListening || isSpeaking ? voiceAmplitude * 0.3 : 0);
      ring1Ref.current.scale.setScalar(scale);
      ring2Ref.current.scale.setScalar(scale * 1.1);
      ring3Ref.current.scale.setScalar(scale * 1.2);
    }
  });

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: isSpeaking ? "#ec4899" : "#4f46e5",
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.05, 8, 32]} />
        <primitive object={ringMaterial} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.0, 0.03, 8, 32]} />
        <primitive object={ringMaterial} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.5, 0.02, 8, 32]} />
        <primitive object={ringMaterial} />
      </mesh>
    </group>
  );
}

// Smoke-like particle system that shows motion while speaking - from original AnimatedSphere.tsx
function CloudParticles({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const cloudRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const colorsRef = useRef<Float32Array | null>(null);

  const particleCount = 10000; // Much higher density

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Create dense smoke-like distribution close to the sphere
      const radius = 1.8 + Math.random() * 1.0; // Much tighter distribution (1.8-2.8)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      // Smaller clustering for tighter smoke
      const clusterOffset = (Math.random() - 0.5) * 0.8;

      positions[i * 3] = (radius + clusterOffset) * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (radius + clusterOffset) * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = (radius + clusterOffset) * Math.cos(phi);

      // Smaller random velocities for subtle movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.012;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.012;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.012;

      // Initialize colors (will be updated dynamically)
      colors[i * 3] = 0; // R
      colors[i * 3 + 1] = 0; // G
      colors[i * 3 + 2] = 0; // B
    }

    return { positions, velocities, colors };
  }, []);

  // Store references for animation
  useEffect(() => {
    velocitiesRef.current = velocities;
    originalPositionsRef.current = new Float32Array(positions);
    colorsRef.current = colors;
  }, [positions, velocities, colors]);

  useFrame((state) => {
    if (cloudRef.current && velocitiesRef.current && originalPositionsRef.current && colorsRef.current) {
      const time = state.clock.getElapsedTime();

      // Check if geometry and attributes exist
      if (!cloudRef.current.geometry || !cloudRef.current.geometry.attributes.position || !cloudRef.current.geometry.attributes.color) {
        return;
      }

      const positions = cloudRef.current.geometry.attributes.position.array as Float32Array;
      const colors = cloudRef.current.geometry.attributes.color.array as Float32Array;

      // Slow rotation of the entire cloud
      cloudRef.current.rotation.y += 0.002;
      cloudRef.current.rotation.x += 0.001;

      // Always animate particles for dynamic color changes
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Create flowing smoke motion based on voice amplitude
        const flowIntensity = isSpeaking ? voiceAmplitude * 3 : isListening ? voiceAmplitude * 1.5 : 0.5;

        // Add turbulent wave-like motion for smoke effect
        const waveX = Math.sin(time * 3 + i * 0.05) * flowIntensity * 0.15;
        const waveY = Math.cos(time * 2.5 + i * 0.08) * flowIntensity * 0.12;
        const waveZ = Math.sin(time * 2.2 + i * 0.06) * flowIntensity * 0.1;

        // Add upward drift for smoke-like behavior
        const upwardDrift = isSpeaking ? Math.sin(time + i * 0.1) * 0.02 : 0;

        // Slight outward expansion when speaking
        const expansionFactor = isSpeaking ? 1 + voiceAmplitude * 0.2 : 1;

        positions[i3] = originalPositionsRef.current[i3] * expansionFactor + waveX;
        positions[i3 + 1] = originalPositionsRef.current[i3 + 1] * expansionFactor + waveY + upwardDrift;
        positions[i3 + 2] = originalPositionsRef.current[i3 + 2] * expansionFactor + waveZ;

        // Add subtle random drift for organic smoke feel
        const driftMultiplier = isSpeaking ? 3 : isListening ? 1.5 : 0.8;
        positions[i3] += velocitiesRef.current[i3] * driftMultiplier;
        positions[i3 + 1] += velocitiesRef.current[i3 + 1] * driftMultiplier;
        positions[i3 + 2] += velocitiesRef.current[i3 + 2] * driftMultiplier;

        // Calculate distance from sphere center (0,0,0)
        const particleDistance = Math.sqrt(
          positions[i3] * positions[i3] +
          positions[i3 + 1] * positions[i3 + 1] +
          positions[i3 + 2] * positions[i3 + 2]
        );

        // Define energy field boundaries - tighter constraints
        const minRadius = 1.8; // Inner boundary (close to sphere)
        const maxRadius = 2.8; // Outer boundary (matches energy field sphere)

        // Keep particles within the energy field boundaries - stronger constraints
        if (particleDistance > maxRadius) {
          // Pull particles back towards the field more aggressively
          const pullFactor = 0.92;
          positions[i3] *= pullFactor;
          positions[i3 + 1] *= pullFactor;
          positions[i3 + 2] *= pullFactor;
        } else if (particleDistance < minRadius) {
          // Push particles away from the sphere core
          const pushFactor = 1.03;
          positions[i3] *= pushFactor;
          positions[i3 + 1] *= pushFactor;
          positions[i3 + 2] *= pushFactor;
        }

        // Recalculate distance after boundary corrections
        const correctedDistance = Math.sqrt(
          positions[i3] * positions[i3] +
          positions[i3 + 1] * positions[i3 + 1] +
          positions[i3 + 2] * positions[i3 + 2]
        );

        // Dynamic color based on distance from sphere center
        const sphereRadius = 2.5;
        const isOverSphere = correctedDistance < sphereRadius;

        if (isOverSphere) {
          // White particles over the sphere
          colors[i3] = 1.0;     // R
          colors[i3 + 1] = 1.0; // G
          colors[i3 + 2] = 1.0; // B
        } else {
          // Black particles on white background
          colors[i3] = 0.0;     // R
          colors[i3 + 1] = 0.0; // G
          colors[i3 + 2] = 0.0; // B
        }
      }

      cloudRef.current.geometry.attributes.position.needsUpdate = true;
      cloudRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  // Add color attribute to the geometry after it's created
  useEffect(() => {
    if (cloudRef.current && colors) {
      const geometry = cloudRef.current.geometry;
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
  }, [colors]);

  return (
    <Points ref={cloudRef} positions={positions}>
      <PointMaterial
        size={0.006} // Even smaller for denser smoke effect
        transparent
        opacity={isSpeaking ? 0.9 + voiceAmplitude * 0.1 : isListening ? 0.7 + voiceAmplitude * 0.2 : 0.5}
        sizeAttenuation
        alphaTest={0.001}
        blending={THREE.NormalBlending}
        vertexColors // Enable vertex colors for dynamic color changes
      />
    </Points>
  );
}

// Dense smoke atmosphere particles - from original AnimatedSphere.tsx
function MistyAtmosphere({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const mistRef = useRef<THREE.Points>(null);
  const colorsRef = useRef<Float32Array | null>(null);

  const mistCount = 3000; // Much higher density
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(mistCount * 3);
    const colors = new Float32Array(mistCount * 3);

    for (let i = 0; i < mistCount; i++) {
      // Tighter atmospheric distribution
      const radius = 2.8 + Math.random() * 0.7; // Much tighter (2.8-3.5)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      // Smaller clustering for contained atmosphere
      const clusterFactor = Math.random() < 0.7 ? 0.9 : 1.1;

      positions[i * 3] = radius * clusterFactor * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * clusterFactor * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * clusterFactor * Math.cos(phi);

      // Initialize colors
      colors[i * 3] = 0; // R
      colors[i * 3 + 1] = 0; // G
      colors[i * 3 + 2] = 0; // B
    }
    return { positions, colors };
  }, []);

  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  // Add color attribute to the geometry after it's created
  useEffect(() => {
    if (mistRef.current && colors) {
      const geometry = mistRef.current.geometry;
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
  }, [colors]);

  useFrame(() => {
    if (mistRef.current && colorsRef.current) {

      // Check if geometry and attributes exist
      if (!mistRef.current.geometry || !mistRef.current.geometry.attributes.position || !mistRef.current.geometry.attributes.color) {
        return;
      }

      const positions = mistRef.current.geometry.attributes.position.array as Float32Array;
      const colors = mistRef.current.geometry.attributes.color.array as Float32Array;

      // Slow rotation for atmospheric effect
      mistRef.current.rotation.y += 0.001;
      mistRef.current.rotation.z += 0.0008;

      // Keep consistent scale - no pulsing
      mistRef.current.scale.setScalar(1);

      // Update colors and apply boundary constraints
      for (let i = 0; i < mistCount; i++) {
        const i3 = i * 3;

        // Calculate distance from sphere center
        let particleDistance = Math.sqrt(
          positions[i3] * positions[i3] +
          positions[i3 + 1] * positions[i3 + 1] +
          positions[i3 + 2] * positions[i3 + 2]
        );

        // Define atmospheric energy field boundaries - much tighter
        const minRadius = 2.8; // Inner boundary (outside main cloud)
        const maxRadius = 3.5; // Outer boundary (just outside energy field)

        // Keep atmospheric particles within boundaries - stronger constraints
        if (particleDistance > maxRadius) {
          // Pull particles back towards the field more aggressively
          const pullFactor = 0.94;
          positions[i3] *= pullFactor;
          positions[i3 + 1] *= pullFactor;
          positions[i3 + 2] *= pullFactor;
        } else if (particleDistance < minRadius) {
          // Push particles away from the inner core
          const pushFactor = 1.02;
          positions[i3] *= pushFactor;
          positions[i3 + 1] *= pushFactor;
          positions[i3 + 2] *= pushFactor;
        }

        // Recalculate distance after boundary corrections
        particleDistance = Math.sqrt(
          positions[i3] * positions[i3] +
          positions[i3 + 1] * positions[i3 + 1] +
          positions[i3 + 2] * positions[i3 + 2]
        );

        const sphereRadius = 3.0;
        const isOverSphere = particleDistance < sphereRadius;

        if (isOverSphere) {
          // White particles over the sphere
          colors[i3] = 1.0;     // R
          colors[i3 + 1] = 1.0; // G
          colors[i3 + 2] = 1.0; // B
        } else {
          // Black particles on white background
          colors[i3] = 0.0;     // R
          colors[i3 + 1] = 0.0; // G
          colors[i3 + 2] = 0.0; // B
        }
      }

      mistRef.current.geometry.attributes.position.needsUpdate = true;
      mistRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <Points ref={mistRef} positions={positions}>
      <PointMaterial
        size={0.004} // Very small for fine atmospheric smoke
        transparent
        opacity={isSpeaking ? 0.4 + voiceAmplitude * 0.3 : isListening ? 0.25 + voiceAmplitude * 0.15 : 0.15}
        sizeAttenuation
        alphaTest={0.001}
        blending={THREE.NormalBlending}
        vertexColors // Enable vertex colors for dynamic color changes
      />
    </Points>
  );
}

// Camera controller for dynamic movement - from original AnimatedSphere.tsx
function CameraController({ voiceAmplitude, isListening }: SphereProps) {
  const { camera } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Subtle camera movement
    camera.position.x = Math.sin(time * 0.2) * 0.5;
    camera.position.y = Math.cos(time * 0.15) * 0.3;

    // Zoom in slightly when listening with high amplitude
    const targetZ = 6 - (isListening ? voiceAmplitude * 1.5 : 0);
    camera.position.z += (targetZ - camera.position.z) * 0.02;

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Performance Monitor Component
function PerformanceMonitor({ checkPerformance }: { checkPerformance: () => void }) {
  useFrame(() => {
    checkPerformance();
  });
  return null;
}

// Exact Original Scene Implementation from AnimatedSphere.tsx
const OriginalScene: React.FC<SphereProps & { isLowPerformance: boolean; checkPerformance: () => void }> = ({
  voiceAmplitude,
  isListening,
  isSpeaking,
  isLowPerformance,
  checkPerformance
}) => {
  return (
    <>
      {/* Dramatic lighting for the fluid sphere - exact same as original */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
      />
      <pointLight position={[2, 2, 2]} intensity={1.2} color="#4f46e5" />
      <pointLight position={[-2, -2, -2]} intensity={1.0} color="#ec4899" />
      <pointLight position={[0, 3, -3]} intensity={0.8} color="#06b6d4" />

      {/* Environment for realistic reflections */}
      <Environment preset="studio" />

      {/* Main fluid sphere components - exact same as original */}
      <FluidSphere voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />
      <InnerCore voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />
      <EnergyField voiceAmplitude={voiceAmplitude} isListening={isListening} />

      {/* Sticky rectangular eyes that track mouse - exact same as original */}
      <StickyEyes voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />

      {/* Cloud-like particle systems - exact same as original */}
      <CloudParticles voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />
      <MistyAtmosphere voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />

      <CameraController voiceAmplitude={voiceAmplitude} isListening={isListening} />

      {/* Smooth orbit controls - exact same as original */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        autoRotate={!isListening && !isSpeaking}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.2}
        minPolarAngle={Math.PI / 4}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  );
};

// Main Component with Context Loss Handling
interface RobustAnimatedSphereProps {
  voiceAmplitude: number;
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const RobustAnimatedSphere: React.FC<RobustAnimatedSphereProps> = ({
  voiceAmplitude,
  isListening = false,
  isSpeaking = false,
  className = "",
  style = {}
}) => {
  // Generate unique component ID for WebGL access management
  const componentId = useMemo(() => `sphere-${Math.random().toString(36).substring(2, 9)}`, []);
  const {
    contextLost,
    retryCount,
    retryContext,
    canvasRef,
    isLowPerformance,
    checkPerformance,
    fallbackMode,
    hasWebGLAccess
  } = useGlobalWebGL(componentId);
  const [deviceFallbackMode, setDeviceFallbackMode] = useState(false);

  // Debounce voice amplitude to prevent excessive re-renders
  const [debouncedAmplitude, setDebouncedAmplitude] = useState(voiceAmplitude);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmplitude(voiceAmplitude);
    }, 16); // ~60fps update rate

    return () => clearTimeout(timer);
  }, [voiceAmplitude]);

  // Force device fallback on low-end devices
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      setDeviceFallbackMode(true);
      return;
    }

    // Cast to WebGLRenderingContext to access WebGL-specific methods
    const webglContext = gl as WebGLRenderingContext;

    // Check for limited GPU resources
    const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      if (renderer && typeof renderer === 'string' && renderer.toLowerCase().includes('software')) {
        setDeviceFallbackMode(true);
      }
    }
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Force cleanup of any remaining WebGL resources
      if (canvasRef.current) {
        const gl = canvasRef.current.getContext('webgl') as WebGLRenderingContext | null ||
                   canvasRef.current.getContext('experimental-webgl') as WebGLRenderingContext | null;
        if (gl) {
          const loseContextExt = gl.getExtension('WEBGL_lose_context');
          if (loseContextExt) {
            loseContextExt.loseContext();
          }
        }
      }
    };
  }, []);

  if (fallbackMode || deviceFallbackMode) {
    return (
      <div className={className} style={{ width: '100%', height: '100%', ...style }}>
        <CSSFallbackSphere
          voiceAmplitude={debouncedAmplitude}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />
      </div>
    );
  }

  if (contextLost) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ width: '100%', height: '100%', ...style }}>
        <div className="text-center p-4">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 mb-2">Initializing AI Interface...</p>
          {retryCount < 3 && (
            <button
              onClick={retryContext}
              className="text-xs text-orange-600 hover:text-orange-700 underline"
            >
              Retry ({retryCount}/3)
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show waiting state if no WebGL access
  if (!hasWebGLAccess && !fallbackMode) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ width: '100%', height: '100%', ...style }}>
        <div className="text-center p-4">
          <div className="animate-pulse w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Waiting for WebGL access...</p>
          <p className="text-xs text-gray-500 mt-1">Component: {componentId.substring(0, 8)}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden', ...style }}>
      <WebGLErrorBoundary
        fallback={
          <CSSFallbackSphere
            voiceAmplitude={voiceAmplitude}
            isListening={isListening}
            isSpeaking={isSpeaking}
          />
        }
      >
        {/* Stable container with fixed dimensions to prevent resize issues */}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'transparent',
            minHeight: '200px', // Prevent zero-height issues
            minWidth: '200px'   // Prevent zero-width issues
          }}
        >
          <Canvas
            key={`global-canvas-${componentId}-${retryCount}`}
            camera={{ position: [1, 0, 4], fov: 75 }}
            style={{
              background: 'transparent',
              width: '100%',
              height: '100%'
            }}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping
            }}
            onCreated={(state) => {
              // Store canvas reference for context loss handling
              canvasRef.current = state.gl.domElement;
            }}
          >
            <OriginalScene
              voiceAmplitude={debouncedAmplitude}
              isListening={isListening}
              isSpeaking={isSpeaking}
              isLowPerformance={isLowPerformance}
              checkPerformance={checkPerformance}
            />
          </Canvas>
        </div>
      </WebGLErrorBoundary>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders that could create multiple contexts
export default React.memo(RobustAnimatedSphere, (prevProps, nextProps) => {
  // Only re-render if the essential props change significantly
  return (
    Math.abs(prevProps.voiceAmplitude - nextProps.voiceAmplitude) < 0.1 &&
    prevProps.isListening === nextProps.isListening &&
    prevProps.isSpeaking === nextProps.isSpeaking
  );
});
