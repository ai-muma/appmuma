'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Conversation } from '@elevenlabs/client';

interface ArtworkContext {
  id: string;
  name: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl4k: string;
  wikiartUrl: string;
  conversationContext: string;
}

interface ConversationComponentProps {
  artworkContext: ArtworkContext | null;
  onCapturePhoto: (imageDataUrl: string) => Promise<void>;
  onReset: () => void;
  isAnalyzing: boolean;
}

export default function ConversationComponent({
  artworkContext,
  onCapturePhoto,
  onReset,
  isAnalyzing,
}: ConversationComponentProps) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [status, setStatus] = useState<string>('Point camera at artwork');
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const conversationRef = useRef<Conversation | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const artworkContextRef = useRef<ArtworkContext | null>(artworkContext);
  
  // Keep ref in sync with state
  useEffect(() => {
    artworkContextRef.current = artworkContext;
  }, [artworkContext]);

  // Initialize camera
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('[Camera] Failed to initialize:', err);
        setError('Failed to access camera');
      }
    };

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture photo from video stream
  const handleCaptureClick = async () => {
    if (!videoRef.current) {
      console.log('[Camera] ❌ Cannot capture - video ref not ready');
      setError('Camera not ready');
      return;
    }
    
    if (isAnalyzing || artworkContext) {
      console.log('[Camera] ⏭️ Skipping - already processing or has artwork');
      return;
    }
    
    setStatus('📸 Capturing photo...');
    
    console.log('');
    console.log('🎯🎯🎯 PHOTO CAPTURE STARTING 🎯🎯🎯');
    console.log('[Camera] 📸 Capturing photo from video stream...');
    console.log('[Camera] 📐 Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      console.log('[Camera] ✅ Photo captured, size:', imageDataUrl.length, 'bytes');
      console.log('[Camera] 📸 Storing captured image for display');
      
      // Store the captured image to display it
      setCapturedImage(imageDataUrl);
      setStatus('🔍 Analyzing artwork...');
      
      console.log('[Camera] 🚀 Sending to analysis API...');
      
      try {
        await onCapturePhoto(imageDataUrl);
        console.log('[Camera] ✅ Analysis complete');
      } catch (error) {
        console.error('[Camera] ❌ Analysis failed:', error);
        setError('Failed to analyze artwork');
        setStatus('Error - Try again');
        setCapturedImage(null); // Clear image on error
      }
    } else {
      console.log('[Camera] ❌ Failed to get canvas context');
      setError('Failed to capture photo');
      setStatus('Error - Try again');
    }
  };

  // Client tools that the agent can invoke
  const clientTools = {
    analyzeArtwork: async () => {
      // This tool checks if artwork has been uploaded and returns the analysis
      // No parameters needed - it pulls from the already-uploaded artwork context
      
      // Use ref to get the LATEST artwork context value
      const currentArtwork = artworkContextRef.current;
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('[analyzeArtwork Tool] 🔧 CALLED BY AGENT');
      console.log('[analyzeArtwork Tool] 📊 Timestamp:', new Date().toISOString());
      console.log('[analyzeArtwork Tool] 📊 artworkContext exists:', !!currentArtwork);
      console.log('[analyzeArtwork Tool] 📊 isAnalyzing:', isAnalyzing);
      
      if (currentArtwork) {
        console.log('[analyzeArtwork Tool] ✅ Artwork data available:', {
          name: currentArtwork.name,
          artist: currentArtwork.artist,
          year: currentArtwork.year,
          id: currentArtwork.id
        });
      } else {
        console.log('[analyzeArtwork Tool] ❌ No artwork context available!');
      }
      
      if (!currentArtwork) {
        console.log('[analyzeArtwork Tool] ⚠️ Returning error to agent - no artwork context');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        return JSON.stringify({ 
          success: false,
          error: 'Error: No artwork data available. Please make sure you captured an artwork before starting the conversation.' 
        });
      }
      
      console.log('[analyzeArtwork Tool] ✅ Returning artwork data to agent:', currentArtwork.name);
      
      // Return the existing artwork context
      const response = {
        success: true,
        artwork: {
          name: currentArtwork.name,
          artist: currentArtwork.artist,
          year: currentArtwork.year,
          medium: currentArtwork.medium,
          imageUrl: currentArtwork.imageUrl4k,
          wikiartUrl: currentArtwork.wikiartUrl,
          conversationContext: currentArtwork.conversationContext,
        },
        message: `Artwork details: "${currentArtwork.name}" by ${currentArtwork.artist}${currentArtwork.year && currentArtwork.year !== 'Unknown' ? ` (${currentArtwork.year})` : ''}. ${currentArtwork.medium && currentArtwork.medium !== 'Unknown' ? `Medium: ${currentArtwork.medium}.` : ''}`
      };
      
      console.log('[analyzeArtwork Tool] 📤 Response message:', response.message);
      console.log('[analyzeArtwork Tool] 📤 Full context being sent:', currentArtwork.conversationContext.substring(0, 200) + '...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return JSON.stringify(response);
    },
    
    logMessage: async ({ message }: { message: string }) => {
      console.log('[Agent Log]:', message);
    },
  };

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      setStatus('Connecting...');

      const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
      if (!agentId) {
        throw new Error('NEXT_PUBLIC_AGENT_ID not configured');
      }

      console.log('');
      console.log('🚀🚀🚀 CONVERSATION STARTING 🚀🚀🚀');
      console.log('[Conversation] Agent ID:', agentId);
      console.log('[Conversation] Artwork available:', !!artworkContext);
      if (artworkContext) {
        console.log('[Conversation] Artwork:', artworkContext.name, 'by', artworkContext.artist);
      }
      console.log('[Conversation] 🔧 Client tools registered:');
      console.log('[Conversation]   1. analyzeArtwork() - Returns artwork details');
      console.log('[Conversation]   2. logMessage() - Logs debug messages');
      console.log('');

      const conversationConfig: any = {
        agentId,
        clientTools,
        onConnect: () => {
          console.log('');
          console.log('✅✅✅ CONNECTED TO ELEVENLABS ✅✅✅');
          console.log('[Conversation] WebSocket connection established');
          console.log('[Conversation] Agent is ready to receive voice input');
          console.log('');
          setStatus('Connected - Listening...');
          setIsSessionActive(true);
        },
        onDisconnect: () => {
          console.log('[Conversation] ❌ Disconnected from ElevenLabs');
          setStatus('Disconnected');
          setIsSessionActive(false);
        },
        onError: (error: any) => {
          console.error('[Conversation] ⚠️ Error:', error);
          setError(`Error: ${typeof error === 'string' ? error : JSON.stringify(error)}`);
          setStatus('Error');
        },
        onModeChange: (mode: any) => {
          console.log('');
          console.log('🔄🔄🔄 MODE CHANGE 🔄🔄🔄');
          console.log('[Conversation] Mode:', mode.mode);
          const currentArtwork = artworkContextRef.current;
          console.log('[Conversation] Has artwork?:', !!currentArtwork);
          
          // Update status based on mode
          if (mode.mode === 'speaking') {
            console.log('[Conversation] 🎤 USER IS SPEAKING');
            setStatus('👂 Listening to you...');
          } else if (mode.mode === 'listening') {
            console.log('[Conversation] 👂 AGENT IS LISTENING');
            if (currentArtwork) {
              setStatus(`🎨 ${currentArtwork.name} - Continue talking!`);
            } else {
              setStatus('🎤 Ready - Agent is processing...');
            }
          }
        },
        onMessage: (message: any) => {
          console.log('[Conversation] 💬 Message:', message);
        },
        onStatusChange: (status: any) => {
          console.log('[Conversation] 📊 Status:', status);
        },
      };

      const conversation = await Conversation.startSession(conversationConfig);
      conversationRef.current = conversation;

      console.log('[Conversation] ✅ Session started successfully');
      setStatus('🎤 Speak to the agent...');
    } catch (err) {
      console.error('[Conversation] ❌ Failed to start conversation:', err);
      const message = err instanceof Error ? err.message : 'Failed to start conversation';
      setError(message);
      setStatus('Error');
    }
  }, [artworkContext, clientTools]);

  const endConversation = async () => {
    console.log('[Conversation] 🛑 Ending conversation...');
    
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
        console.log('[Conversation] ✅ Session ended successfully');
      } catch (error) {
        console.error('[Conversation] ⚠️ Error ending session:', error);
      }
      conversationRef.current = null;
      setIsSessionActive(false);
      setStatus('Session ended');
    } else {
      console.log('[Conversation] ⚠️ No active session to end');
    }
  };

  const handleReset = async () => {
    console.log('[Conversation] 🔄 Resetting for new artwork...');
    
    // End conversation if active
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
        console.log('[Conversation] ✅ Session ended for reset');
      } catch (error) {
        console.error('[Conversation] ⚠️ Error ending session:', error);
      }
      conversationRef.current = null;
    }
    
    setIsSessionActive(false);
    setCapturedImage(null); // Clear captured image
    setStatus('Point camera at new artwork');
    onReset();
  };

  // Log when artwork is identified
  useEffect(() => {
    if (artworkContext && !isSessionActive) {
      console.log('');
      console.log('🎨🎨🎨 ARTWORK IDENTIFIED 🎨🎨🎨');
      console.log('[Conversation] Name:', artworkContext.name);
      console.log('[Conversation] Artist:', artworkContext.artist);
      console.log('[Conversation] Year:', artworkContext.year);
      console.log('[Conversation] 👆 Ready to start conversation - click the button');
      console.log('');
      setStatus('✅ Artwork identified - Ready to talk!');
    }
  }, [artworkContext, isSessionActive]);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera Feed - Fullscreen Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top Bar - Status */}
        <div className="p-6">
          <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-white text-lg font-medium">{status}</p>
            {isAnalyzing && (
              <p className="text-white/70 text-sm mt-1">🔍 Analyzing artwork...</p>
            )}
          </div>
        </div>

        {/* Center - Captured Image & Artwork Info */}
        {capturedImage && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 overflow-auto">
            <div className="w-full max-w-md space-y-4">
              {/* Captured Image */}
              <div className="relative rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <img 
                  src={capturedImage} 
                  alt="Captured artwork" 
                  className="w-full h-auto object-contain max-h-64"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2 animate-pulse">🔍</div>
                      <p className="text-white font-semibold">Analyzing...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Artwork Info (when identified) */}
              {artworkContext && (
                <div className="bg-emerald-500/90 backdrop-blur-md rounded-2xl p-6 border border-emerald-400 shadow-2xl animate-fade-in">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-white text-2xl font-bold mb-1">
                        {artworkContext.name}
                      </h2>
                      <p className="text-white/90 text-lg">
                        by {artworkContext.artist}
                      </p>
                      {artworkContext.year && artworkContext.year !== 'Unknown' && (
                        <p className="text-white/80 text-sm mt-1">{artworkContext.year}</p>
                      )}
                      {artworkContext.medium && artworkContext.medium !== 'Unknown' && (
                        <p className="text-white/80 text-sm">{artworkContext.medium}</p>
                      )}
                    </div>
                    <button
                      onClick={handleReset}
                      className="ml-4 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      ✕ Clear
                    </button>
                  </div>
                  {artworkContext.wikiartUrl && (
                    <a
                      href={artworkContext.wikiartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm text-white/90 hover:text-white underline"
                    >
                      View on WikiArt →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial state - no photo captured yet */}
        {!capturedImage && (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="text-white/60 text-lg mb-2">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-xl font-semibold">Point camera at artwork</p>
                <p className="text-sm mt-2">Then tap the capture button below</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar - Controls */}
        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-500/90 backdrop-blur-md rounded-lg p-4 border border-red-400">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-4">
            {!artworkContext && !isAnalyzing && (
              <button
                onClick={handleCaptureClick}
                className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg"
              >
                📸 Capture Artwork
              </button>
            )}
            
            {isAnalyzing && (
              <button
                disabled
                className="flex-1 py-4 px-6 bg-emerald-600/50 text-white rounded-xl font-bold text-lg cursor-not-allowed shadow-lg"
              >
                🔍 Analyzing...
              </button>
            )}
            
            {artworkContext && !isSessionActive && (
              <button
                onClick={startConversation}
                className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg"
              >
                🎙️ Start Conversation
              </button>
            )}
            
            {isSessionActive && (
              <button
                onClick={endConversation}
                className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg"
              >
                🛑 End Conversation
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-white/80 text-sm text-center">
              {!artworkContext && !isAnalyzing && (
                "Point your camera at an artwork and tap 'Capture Artwork' to begin analysis."
              )}
              {isAnalyzing && (
                "Analyzing the artwork... Please wait a moment while we identify it."
              )}
              {artworkContext && !isSessionActive && (
                "Artwork identified! Tap 'Start Conversation' to begin talking with the AI about it."
              )}
              {isSessionActive && (
                "Have a conversation with the AI about the artwork. Ask questions, learn about the artist, technique, history, and more!"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

