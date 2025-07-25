import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Access the global manager (we'll need to expose it)
declare global {
  interface Window {
    __webglManager?: any;
  }
}

const WebGLGlobalStatus: React.FC = () => {
  const [status, setStatus] = useState({
    activeComponent: null as string | null,
    pendingCount: 0,
    contextLossCount: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Expose the manager for debugging
    if (typeof window !== 'undefined') {
      // We'll need to import and expose the manager
      // For now, we'll simulate the status
    }

    if (isMonitoring) {
      const interval = setInterval(() => {
        // This would connect to the actual GlobalWebGLManager
        // For now, we'll simulate some status updates
        setStatus(prev => ({
          ...prev,
          // Simulate some activity
          pendingCount: Math.floor(Math.random() * 3)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const forceReleaseAll = () => {
    // This would call the global manager to release all contexts
    console.log('Force releasing all WebGL contexts...');
    setStatus({
      activeComponent: null,
      pendingCount: 0,
      contextLossCount: 0
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Global WebGL Status
          <Badge variant={status.activeComponent ? "default" : "secondary"}>
            {status.activeComponent ? "Active" : "Idle"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Active Component:</span>
            <Badge variant="outline" className="font-mono text-xs">
              {status.activeComponent ? status.activeComponent.substring(0, 8) + '...' : 'None'}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Pending Queue:</span>
            <Badge variant={status.pendingCount > 0 ? "destructive" : "secondary"}>
              {status.pendingCount}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Context Losses:</span>
            <Badge variant={status.contextLossCount > 0 ? "destructive" : "default"}>
              {status.contextLossCount}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            <p><strong>Strategy:</strong> Only ONE WebGL context allowed globally</p>
            <p><strong>Queue:</strong> Components wait for access in order</p>
            <p><strong>Cleanup:</strong> Automatic context release on unmount</p>
          </div>
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
            onClick={forceReleaseAll}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Force Release
          </Button>
        </div>

        <div className="text-xs space-y-1 text-muted-foreground">
          <div><strong>Expected Behavior:</strong></div>
          <div>• First sphere gets WebGL access immediately</div>
          <div>• Additional spheres show "Waiting for WebGL access..."</div>
          <div>• When first sphere unmounts, next sphere gets access</div>
          <div>• No "Too many active WebGL contexts" warnings</div>
        </div>

        {status.activeComponent && (
          <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
            <strong>Active:</strong> {status.activeComponent}
            <br />
            <span className="text-green-600">WebGL context is active and rendering</span>
          </div>
        )}

        {status.pendingCount > 0 && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <strong>Queue:</strong> {status.pendingCount} component(s) waiting
            <br />
            <span className="text-yellow-600">Using CSS fallback while waiting</span>
          </div>
        )}

        {status.contextLossCount > 0 && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
            <strong>Issues:</strong> {status.contextLossCount} context loss(es)
            <br />
            <span className="text-red-600">Monitor for stability issues</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebGLGlobalStatus;
