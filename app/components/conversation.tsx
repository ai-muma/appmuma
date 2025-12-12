'use client';

import { useEffect, useRef, useState } from 'react';
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
  onRequestNewArtwork?: () => void;
}

export default function ConversationComponent({
  artworkContext,
  onRequestNewArtwork,
}: ConversationComponentProps) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [status, setStatus] = useState<string>('Ready');
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<Conversation | null>(null);

  // Client tools that the agent can invoke
  const clientTools = {
    analyzeArtwork: async () => {
      // This tool checks if artwork has been uploaded and returns the analysis
      // No parameters needed - it pulls from the already-uploaded artwork context
      
      console.log('[analyzeArtwork Tool] Called by agent');
      console.log('[analyzeArtwork Tool] artworkContext exists:', !!artworkContext);
      
      if (!artworkContext) {
        console.log('[analyzeArtwork Tool] No artwork context - returning error');
        return JSON.stringify({ 
          success: false,
          error: 'No artwork has been uploaded yet. Please ask the user to upload an artwork image first using the upload button on the page.' 
        });
      }
      
      console.log('[analyzeArtwork Tool] Returning artwork:', artworkContext.name);
      
      // Return the existing artwork context
      const response = {
        success: true,
        artwork: {
          name: artworkContext.name,
          artist: artworkContext.artist,
          year: artworkContext.year,
          medium: artworkContext.medium,
          imageUrl: artworkContext.imageUrl4k,
          wikiartUrl: artworkContext.wikiartUrl,
          conversationContext: artworkContext.conversationContext,
        },
        message: `Artwork details: "${artworkContext.name}" by ${artworkContext.artist}${artworkContext.year && artworkContext.year !== 'Unknown' ? ` (${artworkContext.year})` : ''}. ${artworkContext.medium && artworkContext.medium !== 'Unknown' ? `Medium: ${artworkContext.medium}.` : ''}`
      };
      
      console.log('[analyzeArtwork Tool] Response:', response.message);
      return JSON.stringify(response);
    },
    
    logMessage: async ({ message }: { message: string }) => {
      console.log('[Agent Log]:', message);
    },
  };

  const startConversation = async () => {
    try {
      setError(null);
      setStatus('Initializing conversation...');

      const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
      if (!agentId) {
        throw new Error('NEXT_PUBLIC_AGENT_ID not configured');
      }

      console.log('[Conversation] Starting with artworkContext:', !!artworkContext);
      if (artworkContext) {
        console.log('[Conversation] Artwork available:', artworkContext.name, 'by', artworkContext.artist);
      }

      const conversation = await Conversation.startSession({
        agentId,
        clientTools,
        onConnect: () => {
          setStatus('Connected');
          setIsSessionActive(true);
        },
        onDisconnect: () => {
          setStatus('Disconnected');
          setIsSessionActive(false);
        },
        onError: (error: any) => {
          console.error('Conversation error:', error);
          setError(`Error: ${typeof error === 'string' ? error : JSON.stringify(error)}`);
          setStatus('Error');
        },
        onModeChange: (mode: any) => {
          setStatus(`Mode: ${mode.mode}`);
        },
      } as any);

      conversationRef.current = conversation;

      console.log('[Conversation] Session started successfully');
      console.log('[Conversation] Agent should call analyzeArtwork() to get artwork details');

      setStatus('Ready to talk');
    } catch (err) {
      console.error('Failed to start conversation:', err);
      const message = err instanceof Error ? err.message : 'Failed to start conversation';
      setError(message);
      setStatus('Error');
    }
  };

  const endConversation = async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
      setIsSessionActive(false);
      setStatus('Session ended');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
        Art Conversation Agent
      </h2>

      {/* Artwork Context Display */}
      {artworkContext && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Current Artwork
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            <strong>{artworkContext.name}</strong> {artworkContext.year && artworkContext.year !== 'Unknown' && `(${artworkContext.year})`}
          </p>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            by {artworkContext.artist}
          </p>
          {artworkContext.medium && artworkContext.medium !== 'Unknown' && (
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
              {artworkContext.medium}
            </p>
          )}
          {artworkContext.wikiartUrl && (
            <a
              href={artworkContext.wikiartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View on WikiArt →
            </a>
          )}
        </div>
      )}

      {/* Status Display */}
      <div className="mb-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          <strong>Status:</strong> {status}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        {!isSessionActive ? (
          <button
            onClick={startConversation}
            className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            🎙️ Start Conversation
          </button>
        ) : (
          <button
            onClick={endConversation}
            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            🛑 End Conversation
          </button>
        )}
        
        {onRequestNewArtwork && (
          <button
            onClick={onRequestNewArtwork}
            disabled={isSessionActive}
            className="py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🖼️ New Artwork
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          How to use:
        </h3>
        <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
          <li>Upload an artwork image to analyze it</li>
          <li>Click &quot;Start Conversation&quot; to begin talking with the AI agent</li>
          <li>The agent can access artwork details and discuss it naturally with you</li>
          <li>Ask questions about the artwork, artist, techniques, historical context, and more</li>
          <li>Click &quot;New Artwork&quot; to analyze a different piece</li>
        </ul>
      </div>
    </div>
  );
}

