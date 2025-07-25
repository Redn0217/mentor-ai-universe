import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Points, PointMaterial, MeshDistortMaterial, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Using MeshDistortMaterial for wavy energy field effect

// Vertical white eyes that move around sphere surface tracking mouse with realistic eyelid blinking
function StickyEyes({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const leftEyelidRef = useRef<THREE.Mesh>(null);
  const rightEyelidRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [blinkProgress, setBlinkProgress] = useState(0); // 0 = open, 1 = closed

  // Enhanced mouse position tracking with higher precision
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert screen coordinates to normalized device coordinates with enhanced precision
      const rect = document.body.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Apply immediate update for maximum responsiveness
      setMousePosition({ x, y });
    };

    // Use passive: false for immediate response and add more event types for better tracking
    const options = { passive: false, capture: true };

    window.addEventListener('mousemove', handleMouseMove, options);
    window.addEventListener('mouseenter', handleMouseMove, options);
    window.addEventListener('mouseover', handleMouseMove, options);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseMove);
    };
  }, []);

  // Realistic eyelid blinking effect
  useEffect(() => {
    const startBlinkCycle = () => {
      // Random blink timing between 2-5 seconds
      const nextBlinkTime = 2000 + Math.random() * 3000;

      setTimeout(() => {
        // Animate eyelid closing (0 to 1)
        let progress = 0;
        const closeInterval = setInterval(() => {
          progress += 0.1;
          setBlinkProgress(Math.min(progress, 1));

          if (progress >= 1) {
            clearInterval(closeInterval);

            // Start opening after brief pause
            setTimeout(() => {
              let openProgress = 1;
              const openInterval = setInterval(() => {
                openProgress -= 0.1;
                setBlinkProgress(Math.max(openProgress, 0));

                if (openProgress <= 0) {
                  clearInterval(openInterval);
                  startBlinkCycle(); // Start next blink cycle
                }
              }, 15); // Fast opening
            }, 50); // Brief pause at closed position
          }
        }, 15); // Smooth closing animation
      }, nextBlinkTime);
    };

    startBlinkCycle();
  }, []);

  useFrame(() => {
    if (leftEyeRef.current && rightEyeRef.current && leftEyelidRef.current && rightEyelidRef.current) {
      // Enhanced mouse tracking with higher sensitivity
      // Convert mouse position to 3D world coordinates with amplified sensitivity
      const sensitivityMultiplier = 2.5; // Increase tracking sensitivity
      const amplifiedMouseX = mousePosition.x * sensitivityMultiplier;
      const amplifiedMouseY = mousePosition.y * sensitivityMultiplier;

      // Clamp to reasonable bounds to prevent extreme positions
      const clampedX = Math.max(-1.5, Math.min(1.5, amplifiedMouseX));
      const clampedY = Math.max(-1.5, Math.min(1.5, amplifiedMouseY));

      const vector = new THREE.Vector3(clampedX, clampedY, 0.8); // Increased Z for better depth
      vector.unproject(camera);

      // Closer sphere radius for surface positioning
      const sphereRadius = 1.4;

      // Calculate direction from sphere center to mouse with enhanced precision
      const mouseDirection = vector.clone().normalize();

      // Expanded eye offset for greater movement range
      const eyeOffsetDistance = 0.25; // Increased from 0.2 for wider movement range

      // Create two eye positions that move around the sphere surface with enhanced tracking
      // Left eye offset with enhanced movement
      const leftOffset = new THREE.Vector3(-eyeOffsetDistance, 0, 0);
      const leftTargetDirection = mouseDirection.clone().add(leftOffset).normalize();
      const leftEyePosition = leftTargetDirection.multiplyScalar(sphereRadius);

      // Right eye offset with enhanced movement
      const rightOffset = new THREE.Vector3(eyeOffsetDistance, 0, 0);
      const rightTargetDirection = mouseDirection.clone().add(rightOffset).normalize();
      const rightEyePosition = rightTargetDirection.multiplyScalar(sphereRadius);

      // Smooth interpolation for fluid movement (reduced for faster response)
      const lerpFactor = 0.15; // Increased from typical 0.1 for faster response

      // Apply smooth interpolation to current positions for fluid tracking
      leftEyeRef.current.position.lerp(leftEyePosition, lerpFactor);
      rightEyeRef.current.position.lerp(rightEyePosition, lerpFactor);

      // Enhanced orientation tracking - eyes look more directly at mouse
      const enhancedLookDistance = 2.0; // Increased look-ahead distance

      const leftLookTarget = new THREE.Vector3(
        leftEyeRef.current.position.x + leftTargetDirection.x * enhancedLookDistance,
        leftEyeRef.current.position.y + leftTargetDirection.y * enhancedLookDistance,
        leftEyeRef.current.position.z + leftTargetDirection.z * enhancedLookDistance
      );

      const rightLookTarget = new THREE.Vector3(
        rightEyeRef.current.position.x + rightTargetDirection.x * enhancedLookDistance,
        rightEyeRef.current.position.y + rightTargetDirection.y * enhancedLookDistance,
        rightEyeRef.current.position.z + rightTargetDirection.z * enhancedLookDistance
      );

      leftEyeRef.current.lookAt(leftLookTarget);
      rightEyeRef.current.lookAt(rightLookTarget);

      // Enhanced organic movement with faster response
      const time = Date.now() * 0.001;
      const organicIntensity = 0.03; // Slightly increased for more life-like movement
      leftEyeRef.current.rotation.z += Math.sin(time * 0.8) * organicIntensity;
      rightEyeRef.current.rotation.z += Math.sin(time * 1.2) * organicIntensity;

      // Animate eyelids based on blink progress
      // Natural upper eyelid that expands downward during blink

      // Initial state: eyelid covers top 12% of eye (positioned at top edge)
      const eyeHeight = 0.30;
      const initialCoverage = 0.12; // 12% of eye height
      const initialEyelidHeight = eyeHeight * initialCoverage;

      // During blink: eyelid expands to cover full eye
      const blinkEyelidHeight = eyeHeight + 0.04; // Slightly larger than eye for complete coverage

      // Interpolate eyelid height based on blink progress
      const currentEyelidHeight = initialEyelidHeight + (blinkProgress * (blinkEyelidHeight - initialEyelidHeight));

      // Position eyelid so its top edge stays relatively fixed
      const eyeTopY = eyeHeight / 2; // 0.15 (top of eye)

      // During blink: center moves down as eyelid grows
      const blinkEyelidY = eyeTopY - (currentEyelidHeight / 2);

      // Update eyelid scale and position
      leftEyelidRef.current.scale.set(1, currentEyelidHeight / initialEyelidHeight, 1);
      rightEyelidRef.current.scale.set(1, currentEyelidHeight / initialEyelidHeight, 1);

      leftEyelidRef.current.position.y = blinkEyelidY;
      rightEyelidRef.current.position.y = blinkEyelidY;

      // Scale animation when speaking (only affects the eye groups, not eyelids)
      const speakingScale = isSpeaking ? 1 + voiceAmplitude * 0.2 : 1;
      leftEyeRef.current.scale.setScalar(speakingScale);
      rightEyeRef.current.scale.setScalar(speakingScale);
    }
  });

  return (
    <group>
      {/* Left Eye Group */}
      <group ref={leftEyeRef}>
        {/* White eye */}
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

        {/* Black eyelid shutter - initially covers top 12% of eye */}
        <mesh ref={leftEyelidRef} position={[0, 0.114, 0.001]}>
          <boxGeometry args={[0.10, 0.036, 0.025]} />
          <meshStandardMaterial
            color="#000000"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Right Eye Group */}
      <group ref={rightEyeRef}>
        {/* White eye */}
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

        {/* Black eyelid shutter - initially covers top 12% of eye */}
        <mesh ref={rightEyelidRef} position={[0, 0.114, 0.001]}>
          <boxGeometry args={[0.10, 0.036, 0.025]} />
          <meshStandardMaterial
            color="#000000"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

interface SphereProps {
  voiceAmplitude: number;
  isListening: boolean;
  isSpeaking?: boolean;
}

// Fluid organic sphere with iridescent material
function FluidSphere({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

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
      materialRef.current.time = state.clock.getElapsedTime();
      materialRef.current.voiceAmplitude = voiceAmplitude;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 256, 256]}>
      <MeshDistortMaterial
        distort={(isListening || isSpeaking) ? 0.4 + voiceAmplitude * 0.6 : 0.2}
        speed={isSpeaking ? 2.5 : 1.5}
        color={isSpeaking ? "#ec4899" : "#4f46e5"}
        transparent
        opacity={0.8}
        roughness={0.5}
        metalness={0.6}
        clearcoat={1}
        clearcoatRoughness={0.2}
        envMapIntensity={0.5}
      />
    </Sphere>
  );
}

// Inner flowing core
function InnerCore({ voiceAmplitude, isListening, isSpeaking }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

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
      materialRef.current.time = state.clock.getElapsedTime() * (isSpeaking ? 2 : 1.5);
      materialRef.current.voiceAmplitude = voiceAmplitude * 1.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.8, 128, 128]}>
      <MeshDistortMaterial
        distort={(isListening || isSpeaking) ? 0.6 + voiceAmplitude * 0.8 : 0.3}
        speed={isSpeaking ? 3.5 : 2.5}
        color={isSpeaking ? "#f59e0b" : "#ec4899"}
        transparent
        opacity={0.6}
        roughness={0.6}
        metalness={0.2}
        clearcoat={0.3}
        clearcoatRoughness={0.5}
        envMapIntensity={0.3}
      />
    </Sphere>
  );
}

// Energy field around the sphere with wavy animation
function EnergyField({ voiceAmplitude, isListening }: SphereProps) {
  const fieldRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (fieldRef.current) {
      // Multi-axis rotation for dynamic energy flow
      fieldRef.current.rotation.y += 0.008;
      fieldRef.current.rotation.x += 0.005;
      fieldRef.current.rotation.z += 0.003;

      // Keep consistent scale - no dynamic scaling
      fieldRef.current.scale.setScalar(1);
    }
  });

  return (
    <Sphere ref={fieldRef} args={[2.8, 64, 64]}>
      <MeshDistortMaterial
        color={isListening ? "#4f46e5" : "#6366f1"}
        transparent
        opacity={isListening ? 0.15 + voiceAmplitude * 0.25 : 0.08}
        side={THREE.BackSide}
        distort={0.3 + voiceAmplitude * 0.7} // Dynamic wave distortion
        speed={1.5 + voiceAmplitude * 2.5} // Faster waves with voice
        roughness={0.2}
        metalness={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  );
}

// Smoke-like particle system that shows motion while speaking
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

// Dense smoke atmosphere particles
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

// Camera controller for dynamic movement
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

// Main Three.js scene component
interface VoiceSphereCanvasProps {
  voiceAmplitude: number;
  isListening?: boolean;
  isSpeaking?: boolean;
}

const VoiceSphereCanvas: React.FC<VoiceSphereCanvasProps> = ({
  voiceAmplitude,
  isListening = false,
  isSpeaking: externalIsSpeaking = false
}) => {
  const [currentText, setCurrentText] = useState('');
  const [internalIsSpeaking, setInternalIsSpeaking] = useState(false);

  // Use internal speaking state for the speech functionality
  const isSpeaking = internalIsSpeaking || externalIsSpeaking;

  // Dummy responses for the AI
  const dummyResponses = [
    "Hello! I'm your AI assistant. How can I help you today?",
    "I heard you speaking. That's interesting! Tell me more about what you're working on.",
    "Your voice sounds great! I'm processing what you said and thinking of a response.",
    "I'm an AI voice assistant powered by advanced speech recognition. What would you like to know?",
    "Thanks for talking to me! I love having conversations with humans.",
    "I can hear the passion in your voice. That's wonderful! Keep going.",
    "Your voice amplitude is looking good. The microphone is picking you up clearly.",
    "I'm here to help with any questions or just have a friendly chat!"
  ];

  // Text-to-speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setCurrentText(text);
        setInternalIsSpeaking(true);
      };

      utterance.onend = () => {
        setCurrentText('');
        setInternalIsSpeaking(false);
      };

      utterance.onerror = () => {
        setCurrentText('');
        setInternalIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Function to trigger dummy speech
  const triggerDummySpeech = () => {
    const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
    speakText(randomResponse);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{
        width: '600px',
        height: '600px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'transparent',
        flexShrink: 0 // Prevent shrinking
      }}>
        <Canvas
          camera={{ position: [1, 0, 4], fov: 75 }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          {/* Dramatic lighting for the fluid sphere */}
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

          {/* Main fluid sphere components */}
          <FluidSphere voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />
          <InnerCore voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />
          <EnergyField voiceAmplitude={voiceAmplitude} isListening={isListening} />

          {/* Sticky rectangular eyes that track mouse */}
          <StickyEyes voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />

          {/* Cloud-like particle systems */}
          <CloudParticles voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />
          <MistyAtmosphere voiceAmplitude={voiceAmplitude} isListening={isListening} isSpeaking={isSpeaking} />

          <CameraController voiceAmplitude={voiceAmplitude} isListening={isListening} />

          {/* Smooth orbit controls */}
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
        </Canvas>
      </div>

      {/* Speech controls and display */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        {/* Speech text display */}
        {currentText && (
          <div style={{
            padding: '15px 20px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            maxWidth: '500px',
            textAlign: 'center',
            fontSize: '16px',
            color: '#333',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            lineHeight: '1.5'
          }}>
            <strong style={{ color: '#4f46e5' }}>AI Speaking:</strong> {currentText}
          </div>
        )}

        {/* Speech trigger button */}
        <button
          onClick={triggerDummySpeech}
          disabled={isSpeaking}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '25px',
            background: isSpeaking
              ? 'linear-gradient(45deg, #e0e0e0, #bdbdbd)'
              : 'linear-gradient(45deg, #4f46e5, #7c3aed)',
            color: '#fff',
            cursor: isSpeaking ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isSpeaking
              ? '0 2px 8px rgba(0, 0, 0, 0.1)'
              : '0 4px 15px rgba(79, 70, 229, 0.3)',
            transform: isSpeaking ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          {isSpeaking ? 'Speaking...' : 'Test AI Speech'}
        </button>

        {/* Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          color: '#666'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isSpeaking ? '#f59e0b' : isListening ? '#4f46e5' : '#9ca3af',
            boxShadow: isSpeaking || isListening ? '0 0 10px currentColor' : 'none'
          }}></div>
          <span>
            {isSpeaking ? 'AI Speaking...' : isListening ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoiceSphereCanvas;
