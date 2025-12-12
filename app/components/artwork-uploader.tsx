'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ArtworkData {
  id: string;
  name: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl4k: string;
  wikiartUrl: string;
  description: string;
  conversationContext: string;
}

interface AnalysisResult {
  success: boolean;
  identified: boolean;
  inDatabase: boolean;
  identification: {
    name: string;
    artist: string;
    year?: string;
    medium?: string;
    confidence: 'high' | 'medium' | 'low';
  };
  artwork?: ArtworkData;
  message: string;
}

interface ArtworkUploaderProps {
  onArtworkAnalyzed: (result: AnalysisResult) => void;
  disabled?: boolean;
}

export default function ArtworkUploader({
  onArtworkAnalyzed,
  disabled = false,
}: ArtworkUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);

  // Auto-start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setError(null);
      stopCamera(); // Stop camera when image is selected
      analyzeArtwork(result); // Auto-analyze uploaded image
    };
    reader.readAsDataURL(file);
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      setPreview(imageData);
      stopCamera();
      analyzeArtwork(imageData); // Auto-analyze captured photo
    }
  };

  const analyzeArtwork = async (imageData?: string) => {
    const dataToAnalyze = imageData || preview;
    if (!dataToAnalyze) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: dataToAnalyze }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze artwork');
      }

      onArtworkAnalyzed(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze artwork';
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleVoiceListening = () => {
    setIsListening(!isListening);
    // TODO: Implement voice recognition
    // For now, just toggle the visual state
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Camera View - Always rendered, full screen */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      
      <canvas ref={canvasRef} className="hidden" />

      {/* Analyzing Overlay */}
      {analyzing && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Analyzing artwork...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 p-4 bg-red-500/90 backdrop-blur-sm rounded-lg z-10">
          <p className="text-white text-sm text-center">{error}</p>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 pb-safe">
        <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-20 pb-8 px-6">
          <div className="flex items-center justify-between max-w-md mx-auto">
            
            {/* Gallery Button - Left */}
            <button
              onClick={openGallery}
              disabled={disabled || analyzing}
              className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Open gallery"
            >
              <svg 
                className="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </button>

            {/* Capture Button - Center */}
            <button
              onClick={capturePhoto}
              disabled={!streaming || disabled || analyzing}
              className="w-20 h-20 rounded-full bg-white border-4 border-white/30 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              aria-label="Capture photo"
            >
              <div className="w-full h-full rounded-full bg-white"></div>
            </button>

            {/* Voice Button - Right */}
            <button
              onClick={toggleVoiceListening}
              disabled={disabled || analyzing}
              className={`w-14 h-14 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening 
                  ? 'bg-red-500/80 border-red-400/50 animate-pulse' 
                  : 'bg-white/20 border-white/30 hover:bg-white/30'
              }`}
              aria-label="Voice activation"
            >
              <svg 
                className="w-7 h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                />
              </svg>
            </button>
          </div>

          {/* Voice Listening Indicator */}
          {isListening && (
            <div className="mt-4 text-center">
              <p className="text-white text-sm font-medium">🎤 Listening... Say "Which painting is this?"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

