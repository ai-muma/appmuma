'use client';

import { useState } from 'react';
import ArtworkUploader from './components/artwork-uploader';
import ConversationComponent from './components/conversation';

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
  artwork?: ArtworkContext;
  message: string;
}

export default function Home() {
  const [artworkContext, setArtworkContext] = useState<ArtworkContext | null>(null);
  const [showUploader, setShowUploader] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleArtworkAnalyzed = (result: AnalysisResult) => {
    setAnalysisResult(result);
    
    if (result.success && result.inDatabase && result.artwork) {
      setArtworkContext(result.artwork);
      setShowUploader(false);
    }
  };

  const handleRequestNewArtwork = () => {
    setShowUploader(true);
    setAnalysisResult(null);
  };

  const handleStartOver = () => {
    setArtworkContext(null);
    setAnalysisResult(null);
    setShowUploader(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                🎨 Artwork Analysis Agent
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                AI-powered artwork identification and conversation
              </p>
            </div>
            {(artworkContext || analysisResult) && (
              <button
                onClick={handleStartOver}
                className="px-4 py-2 text-sm bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                ↻ Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          
          {/* Analysis Result Notification */}
          {analysisResult && !analysisResult.inDatabase && (
            <div className="max-w-2xl mx-auto p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Artwork Identified but Not in Database
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-2">
                <strong>{analysisResult.identification.name}</strong> by {analysisResult.identification.artist}
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                {analysisResult.message} The AI can still discuss this artwork based on general knowledge.
              </p>
            </div>
          )}

          {analysisResult && analysisResult.inDatabase && analysisResult.artwork && (
            <div className="max-w-2xl mx-auto p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ Artwork Successfully Identified!
              </h3>
              <p className="text-green-800 dark:text-green-200 text-sm mb-2">
                <strong>{analysisResult.identification.name}</strong> by {analysisResult.identification.artist}
              </p>
              {analysisResult.identification.year && (
                <p className="text-green-700 dark:text-green-300 text-xs">
                  Year: {analysisResult.identification.year} | Medium: {analysisResult.identification.medium || 'Unknown'}
                </p>
              )}
              <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                Confidence: {analysisResult.identification.confidence.toUpperCase()} | Source: OpenAI Vision API
              </p>
            </div>
          )}

          {/* Artwork Uploader */}
          {showUploader && (
            <ArtworkUploader
              onArtworkAnalyzed={handleArtworkAnalyzed}
              disabled={false}
            />
          )}

          {/* Conversation Component */}
          {!showUploader && artworkContext && (
            <ConversationComponent
              artworkContext={artworkContext}
              onRequestNewArtwork={handleRequestNewArtwork}
            />
          )}

          {/* Welcome Message for First Visit */}
          {!artworkContext && !analysisResult && showUploader && (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Welcome to the Artwork Analysis Agent! 👋
              </h2>
              <div className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
                <p>
                  This AI-powered system can identify artworks and engage in natural conversations about them.
                </p>
                <p className="font-medium mt-4">How it works:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Upload a photo of an artwork or take one with your camera</li>
                  <li>The AI will identify the artwork using OpenAI Vision API</li>
                  <li>Rich contextual information is retrieved from our database</li>
                  <li>Start a conversation with an ElevenLabs voice agent</li>
                  <li>Ask questions and learn about the artwork naturally</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/40 rounded">
                  <p className="font-medium">🎯 Current Mode:</p>
                  <p className="text-xs mt-1">
                    Using OpenAI Vision API to identify artworks in real-time. 
                    The AI agent will discuss the actual artwork identified from your image, 
                    using its knowledge base about art history, artists, and techniques.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                AI Vision
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Powered by OpenAI GPT-4 Vision to accurately identify artworks
              </p>
            </div>
            
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
              <div className="text-3xl mb-2">🗣️</div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                Voice Chat
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Natural voice conversations with ElevenLabs AI agent
              </p>
            </div>
            
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                Rich Context
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Detailed artwork information, history, and interesting facts
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Built with Next.js, OpenAI Vision API, and ElevenLabs Conversational AI
          </p>
        </div>
      </footer>
    </div>
  );
}
