import React, { useState } from 'react';
import RobustAnimatedSphere from '@/components/RobustAnimatedSphere';
import WebGLContextMonitor from '@/components/WebGLContextMonitor';
import WebGLGlobalStatus from '@/components/WebGLGlobalStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WebGLContextTest: React.FC = () => {
  const [sphereCount, setSphereCount] = useState(1);
  const [voiceAmplitude, setVoiceAmplitude] = useState(0.5);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const addSphere = () => {
    if (sphereCount < 8) {
      setSphereCount(prev => prev + 1);
    }
  };

  const removeSphere = () => {
    if (sphereCount > 0) {
      setSphereCount(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>WebGL Context Management Test</CardTitle>
            <p className="text-sm text-muted-foreground">
              This page tests the WebGL context management system. Browser limit is typically 8-16 contexts.
              Our system limits to 4 contexts and falls back to CSS spheres when exceeded.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center mb-4">
              <Button onClick={addSphere} disabled={sphereCount >= 8}>
                Add Sphere ({sphereCount}/8)
              </Button>
              <Button onClick={removeSphere} disabled={sphereCount <= 0} variant="outline">
                Remove Sphere
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsListening(!isListening)} 
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                >
                  {isListening ? "Stop Listening" : "Start Listening"}
                </Button>
                <Button 
                  onClick={() => setIsSpeaking(!isSpeaking)} 
                  variant={isSpeaking ? "default" : "outline"}
                  size="sm"
                >
                  {isSpeaking ? "Stop Speaking" : "Start Speaking"}
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Voice Amplitude: {voiceAmplitude.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceAmplitude}
                onChange={(e) => setVoiceAmplitude(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <WebGLContextMonitor />
          </div>
          <div className="lg:col-span-1">
            <WebGLGlobalStatus />
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Global Strategy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p><strong>NEW:</strong> Only ONE WebGL context allowed globally.</p>
                <p className="mt-2">First sphere gets WebGL access, others wait in queue and use CSS fallback.</p>
                <p className="mt-2">When active sphere unmounts, next in queue gets access automatically.</p>
                <p className="mt-2"><strong>Result:</strong> Zero "Too many active WebGL contexts" warnings.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: sphereCount }, (_, index) => (
            <Card key={index} className="aspect-square">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sphere {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full h-48">
                  <RobustAnimatedSphere
                    voiceAmplitude={voiceAmplitude}
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sphereCount === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No spheres active. Click "Add Sphere" to test WebGL context management.</p>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Expected Behavior</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p><strong>Sphere 1:</strong> Gets WebGL access immediately, renders with full animations</p>
            <p><strong>Spheres 2+:</strong> Show "Waiting for WebGL access..." then use CSS fallback</p>
            <p><strong>Console:</strong> Shows "WebGL access granted/queued" messages</p>
            <p><strong>Unmounting:</strong> When sphere 1 is removed, sphere 2 gets WebGL access</p>
            <p><strong>Memory:</strong> ZERO "Too many active WebGL contexts" warnings</p>
            <p><strong>Performance:</strong> Only one WebGL context active at any time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebGLContextTest;
