import React, { useState, useEffect } from "react";
import VoiceSphereCanvas from "./components/AnimatedSphere";
import './App.css'

const App = () => {
  const [voiceAmplitude, setVoiceAmplitude] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);

  const startListening = async () => {
    try {
      setMicrophoneError(null);
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsListening(true);

      const getAmplitude = () => {
        if (!isListening) return;

        analyser.getByteFrequencyData(dataArray);
        let total = 0;
        for (let i = 0; i < dataArray.length; i++) {
          total += dataArray[i];
        }
        const average = total / dataArray.length;
        setVoiceAmplitude(average / 128); // Normalize to a scale of 0-1
        requestAnimationFrame(getAmplitude);
      };

      getAmplitude();

      // Store cleanup function
      (window as any).audioCleanup = () => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
        setIsListening(false);
        setVoiceAmplitude(0);
      };

    } catch (error) {
      console.error("Error accessing the microphone:", error);
      setMicrophoneError("Could not access microphone. Please check permissions.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if ((window as any).audioCleanup) {
      (window as any).audioCleanup();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#333333'
    }}>
      <h1 style={{ marginBottom: '40px', fontSize: '2.5rem', color: '#333333' }}>
        Voice AI Fluid Sphere
      </h1>

      <VoiceSphereCanvas
        voiceAmplitude={voiceAmplitude}
        isListening={isListening}
        isSpeaking={isSpeaking}
      />

      <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
        <button
          onClick={startListening}
          disabled={isListening}
          style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            border: '2px solid transparent',
            borderRadius: '30px',
            background: isListening
              ? 'linear-gradient(45deg, #e0e0e0, #bdbdbd)'
              : 'linear-gradient(45deg, #2196f3, #1976d2)',
            color: '#fff',
            cursor: isListening ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isListening
              ? '0 4px 15px rgba(0, 0, 0, 0.1)'
              : '0 6px 20px rgba(33, 150, 243, 0.4)',
            transform: isListening ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          {isListening ? 'Listening...' : 'Start Listening'}
        </button>

        <button
          onClick={stopListening}
          disabled={!isListening}
          style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            border: '2px solid transparent',
            borderRadius: '30px',
            background: !isListening
              ? 'linear-gradient(45deg, #e0e0e0, #bdbdbd)'
              : 'linear-gradient(45deg, #e91e63, #c2185b)',
            color: '#fff',
            cursor: !isListening ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: !isListening
              ? '0 4px 15px rgba(0, 0, 0, 0.1)'
              : '0 6px 20px rgba(233, 30, 99, 0.4)',
            transform: !isListening ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          Stop
        </button>
      </div>

      {microphoneError && (
        <div style={{
          marginTop: '20px',
          color: '#ff6b6b',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          {microphoneError}
        </div>
      )}

      <div style={{
        marginTop: '30px',
        color: '#546e7a',
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: '1.6',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
          Click "Start Listening" to enable real-time microphone input.
        </p>
        <p style={{ fontSize: '16px', marginBottom: '15px' }}>
          The 3D sphere will react to your voice amplitude in real-time!
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '10px'
        }}>
          <span>Voice Amplitude:</span>
          <div style={{
            background: 'linear-gradient(to right, #2196f3, #e91e63)',
            height: '10px',
            width: '200px',
            borderRadius: '5px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '0',
              top: '0',
              height: '100%',
              width: `${voiceAmplitude * 100}%`,
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '5px',
              transition: 'width 0.1s ease'
            }}/>
          </div>
          <strong>{(voiceAmplitude * 100).toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
};

export default App;
