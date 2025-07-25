import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WebGLContextInfo {
  activeContexts: number;
  contextLossCount: number;
  maxContexts: number;
  webglSupported: boolean;
  renderer: string;
  vendor: string;
}

const WebGLContextMonitor: React.FC = () => {
  const [contextInfo, setContextInfo] = useState<WebGLContextInfo>({
    activeContexts: 0,
    contextLossCount: 0,
    maxContexts: 2,
    webglSupported: false,
    renderer: 'Unknown',
    vendor: 'Unknown'
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Get WebGL info
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      setContextInfo(prev => ({
        ...prev,
        webglSupported: true,
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown'
      }));
    }

    // Monitor context changes
    if (isMonitoring) {
      const interval = setInterval(() => {
        // This would need to be connected to the WebGLContextManager
        // For now, we'll simulate the monitoring
        setContextInfo(prev => ({
          ...prev,
          activeContexts: Math.floor(Math.random() * 3) // Simulated
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const simulateContextLoss = () => {
    // Find all canvas elements and try to lose their contexts
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
      if (gl) {
        const loseExt = gl.getExtension('WEBGL_lose_context');
        if (loseExt) {
          console.log('Simulating context loss for canvas:', canvas);
          loseExt.loseContext();
          
          // Restore after 2 seconds
          setTimeout(() => {
            loseExt.restoreContext();
            console.log('Context restored for canvas:', canvas);
          }, 2000);
        }
      }
    });
  };

  const getStatusColor = (count: number, max: number) => {
    if (count === 0) return 'bg-gray-500';
    if (count < max * 0.5) return 'bg-green-500';
    if (count < max * 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          WebGL Monitor
          <Badge variant={contextInfo.webglSupported ? "default" : "destructive"}>
            {contextInfo.webglSupported ? "Supported" : "Not Supported"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {contextInfo.activeContexts}
            </div>
            <div className="text-xs text-muted-foreground">Active Contexts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {contextInfo.contextLossCount}
            </div>
            <div className="text-xs text-muted-foreground">Context Losses</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Context Usage:</span>
            <Badge variant="outline">
              {contextInfo.activeContexts}/{contextInfo.maxContexts}
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(contextInfo.activeContexts, contextInfo.maxContexts)}`}
              style={{ width: `${(contextInfo.activeContexts / contextInfo.maxContexts) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="text-xs space-y-1">
          <div><strong>Renderer:</strong> {contextInfo.renderer}</div>
          <div><strong>Vendor:</strong> {contextInfo.vendor}</div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
            className="flex-1"
          >
            {isMonitoring ? "Stop Monitor" : "Start Monitor"}
          </Button>
          
          <Button 
            onClick={simulateContextLoss}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Test Context Loss
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>Green:</strong> Normal usage (&lt;50%)</p>
          <p><strong>Yellow:</strong> High usage (50-80%)</p>
          <p><strong>Red:</strong> Critical usage (&gt;80%)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebGLContextMonitor;
