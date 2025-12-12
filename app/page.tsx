'use client';

import { useState, useRef } from 'react';
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

export default function Home() {
  const [artworkContext, setArtworkContext] = useState<ArtworkContext | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCapturePhoto = async (imageDataUrl: string) => {
    console.log('');
    console.log('📤📤📤 ANALYSIS STARTING 📤📤📤');
    console.log('[Page] Received photo, size:', imageDataUrl.length, 'bytes');
    console.log('[Page] Calling /api/analyze-artwork...');
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: imageDataUrl }),
      });

      const result = await response.json();
      
      console.log('[Page] API response received:', {
        success: result.success,
        identified: result.identified,
        inDatabase: result.inDatabase,
        artworkName: result.artwork?.name || 'N/A'
      });
      
      if (result.success && result.inDatabase && result.artwork) {
        console.log('[Page] ✅ Setting artwork context:', result.artwork.name);
        setArtworkContext(result.artwork);
        console.log('[Page] ✅ Artwork context updated in state');
      } else {
        console.log('[Page] ❌ Artwork not identified or not in database');
        if (result.message) {
          console.log('[Page] Message:', result.message);
        }
      }
    } catch (error) {
      console.error('[Page] ❌ Error analyzing artwork:', error);
    } finally {
      setIsAnalyzing(false);
      console.log('[Page] Analysis complete, isAnalyzing set to false');
      console.log('');
    }
  };

  const handleReset = () => {
    setArtworkContext(null);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-zinc-950">
      <ConversationComponent
        artworkContext={artworkContext}
        onCapturePhoto={handleCapturePhoto}
        onReset={handleReset}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
}
