'use client';

import { useState, useRef } from 'react';
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
  const [captureMode, setCaptureMode] = useState<'file' | 'camera'>('file');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
        setCaptureMode('camera');
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
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setPreview(imageData);
      stopCamera();
    }
  };

  const analyzeArtwork = async () => {
    if (!preview) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: preview }),
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

  const reset = () => {
    setPreview(null);
    setError(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
        Upload Artwork
      </h2>

      {/* Mode Selection */}
      {!preview && !streaming && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setCaptureMode('file')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              captureMode === 'file'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            disabled={disabled}
          >
            📁 Upload File
          </button>
          <button
            onClick={() => {
              setCaptureMode('camera');
              startCamera();
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              captureMode === 'camera'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            disabled={disabled}
          >
            📷 Use Camera
          </button>
        </div>
      )}

      {/* File Upload */}
      {captureMode === 'file' && !preview && !streaming && (
        <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            Select Image
          </button>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            or drag and drop an image here
          </p>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            Supports JPEG, PNG, WebP (max 10MB)
          </p>
        </div>
      )}

      {/* Camera View */}
      {streaming && (
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            playsInline
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={capturePhoto}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              📸 Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 py-3 px-4 bg-zinc-600 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview and Analysis */}
      {preview && (
        <div className="space-y-4">
          <div className="relative w-full h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
            <Image
              src={preview}
              alt="Artwork preview"
              fill
              className="object-contain"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={analyzeArtwork}
              disabled={analyzing || disabled}
              className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? '🔍 Analyzing...' : '🔍 Analyze Artwork'}
            </button>
            <button
              onClick={reset}
              disabled={analyzing || disabled}
              className="py-3 px-4 bg-zinc-600 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

