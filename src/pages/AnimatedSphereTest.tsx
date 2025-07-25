import React, { useState, useEffect } from 'react';
import VoiceSphereCanvas from '@/components/AnimatedSphere';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Eye, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';

const AnimatedSphereTest: React.FC = () => {
  // Sphere control states
  const [voiceAmplitude, setVoiceAmplitude] = useState(0.3);
  const [isListening, setIsListening] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoAmplitude, setAutoAmplitude] = useState(true);
  const [sphereSize, setSphereSize] = useState(400);

  // Auto-animate voice amplitude for demo purposes
  useEffect(() => {
    if (!autoAmplitude) return;

    const interval = setInterval(() => {
      if (isSpeaking) {
        // Higher amplitude when speaking
        setVoiceAmplitude(0.6 + Math.random() * 0.4);
      } else if (isListening) {
        // Moderate amplitude when listening
        setVoiceAmplitude(0.2 + Math.random() * 0.3);
      } else {
        // Low amplitude when idle
        setVoiceAmplitude(0.1 + Math.random() * 0.2);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [autoAmplitude, isSpeaking, isListening]);

  const handleReset = () => {
    setVoiceAmplitude(0.3);
    setIsListening(true);
    setIsSpeaking(false);
    setAutoAmplitude(true);
    setSphereSize(400);
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking) {
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Animated Sphere Test
          </h1>
          <p className="text-lg text-gray-600">
            Interactive testing environment for the 3D animated AI sphere
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Sphere Display */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Eye className="w-6 h-6 text-blue-600" />
                  Animated Sphere Canvas
                  <Badge variant="outline" className="ml-auto">
                    {sphereSize}x{sphereSize}px
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="flex justify-center">
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-lg p-4"
                    style={{ 
                      width: `${sphereSize}px`, 
                      height: `${sphereSize}px`,
                      minWidth: '300px',
                      minHeight: '300px'
                    }}
                  >
                    <VoiceSphereCanvas
                      voiceAmplitude={voiceAmplitude}
                      isListening={isListening}
                      isSpeaking={isSpeaking}
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        borderRadius: '12px'
                      }}
                    />
                  </div>
                </div>

                {/* Status Display */}
                <div className="mt-6 flex justify-center">
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium border-2 ${
                    isSpeaking 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : isListening 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      isSpeaking 
                        ? 'bg-red-500 animate-pulse' 
                        : isListening 
                        ? 'bg-blue-500 animate-pulse' 
                        : 'bg-gray-500'
                    }`}></div>
                    {isSpeaking ? 'AI Speaking' : isListening ? 'Listening' : 'Idle'}
                    <Badge variant="secondary" className="ml-2">
                      Amplitude: {voiceAmplitude.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* State Controls */}
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  State Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Speaking Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Speaking Mode
                    </label>
                    <Switch
                      checked={isSpeaking}
                      onCheckedChange={toggleSpeaking}
                    />
                  </div>
                  <Button
                    onClick={toggleSpeaking}
                    variant={isSpeaking ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4 mr-2" />
                        Stop Speaking
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Start Speaking
                      </>
                    )}
                  </Button>
                </div>

                <Separator />

                {/* Listening Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Listening Mode
                    </label>
                    <Switch
                      checked={isListening}
                      onCheckedChange={toggleListening}
                    />
                  </div>
                  <Button
                    onClick={toggleListening}
                    variant={isListening ? "secondary" : "outline"}
                    className="w-full"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Listening
                      </>
                    )}
                  </Button>
                </div>

                <Separator />

                {/* Voice Amplitude Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Voice Amplitude
                    </label>
                    <Badge variant="outline">
                      {voiceAmplitude.toFixed(2)}
                    </Badge>
                  </div>
                  <Slider
                    value={[voiceAmplitude]}
                    onValueChange={(value) => {
                      setVoiceAmplitude(value[0]);
                      setAutoAmplitude(false);
                    }}
                    max={1}
                    min={0}
                    step={0.01}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Auto Amplitude
                    </label>
                    <Switch
                      checked={autoAmplitude}
                      onCheckedChange={setAutoAmplitude}
                    />
                  </div>
                </div>

                <Separator />

                {/* Size Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Canvas Size
                    </label>
                    <Badge variant="outline">
                      {sphereSize}px
                    </Badge>
                  </div>
                  <Slider
                    value={[sphereSize]}
                    onValueChange={(value) => setSphereSize(value[0])}
                    max={600}
                    min={300}
                    step={50}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Reset Button */}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </CardContent>
            </Card>

            {/* Information Panel */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="text-lg">Sphere Features</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Mouse-tracking eyes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Realistic blinking animation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Dynamic particle systems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Voice amplitude response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>State-based color changes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>3D rotation and scaling</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSphereTest;
