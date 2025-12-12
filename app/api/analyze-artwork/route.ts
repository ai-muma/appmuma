import { NextRequest, NextResponse } from 'next/server';
import { identifyArtwork } from '@/lib/openai';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds for Vision API

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData } = body;

    // Validate input
    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: imageData is required and must be a base64 string' },
        { status: 400 }
      );
    }

    // Validate image size (rough check - base64 is ~33% larger than binary)
    const estimatedSizeMB = (imageData.length * 0.75) / (1024 * 1024);
    if (estimatedSizeMB > 10) {
      return NextResponse.json(
        { error: 'Image too large. Please upload an image smaller than 10MB.' },
        { status: 400 }
      );
    }

    console.log('[Analyze Artwork] Starting artwork identification...');

    // Use OpenAI Vision to identify the artwork
    const identification = await identifyArtwork(imageData);
    console.log('[Analyze Artwork] ✅ OpenAI Vision identified:', {
      name: identification.name,
      artist: identification.artist,
      year: identification.year,
      medium: identification.medium,
      confidence: identification.confidence,
    });
    console.log('[Analyze Artwork] 📝 Full Vision API response:', identification.rawResponse);

    // Build conversation context from Vision API data
    const conversationContext = `This artwork is "${identification.name}" by ${identification.artist}${identification.year ? `, created in ${identification.year}` : ''}${identification.medium ? `, using ${identification.medium}` : ''}. 

Based on the image analysis: ${identification.rawResponse}

Discuss this artwork naturally with the user, sharing your knowledge about the piece, the artist, the historical context, and answering any questions they may have.`;

    console.log('[Analyze Artwork] ✅ Using real identification data (no database)');

    return NextResponse.json({
      success: true,
      identified: true,
      inDatabase: true,
      identification: {
        name: identification.name,
        artist: identification.artist,
        year: identification.year,
        medium: identification.medium,
        confidence: identification.confidence,
      },
      artwork: {
        id: `${identification.name.toLowerCase().replace(/\s+/g, '-')}-${identification.year || 'unknown'}`,
        name: identification.name,
        artist: identification.artist,
        year: identification.year || 'Unknown',
        medium: identification.medium || 'Unknown',
        imageUrl4k: '', // No database URL
        wikiartUrl: '', // No database URL
        description: identification.rawResponse,
        conversationContext: conversationContext,
      },
      message: 'Artwork successfully identified using OpenAI Vision.',
    });
  } catch (error) {
    console.error('[Analyze Artwork] Error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'Server configuration error. Please ensure OPENAI_API_KEY is set.',
            details: error.message 
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Failed to analyze artwork', 
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'analyze-artwork',
    timestamp: new Date().toISOString(),
  });
}

