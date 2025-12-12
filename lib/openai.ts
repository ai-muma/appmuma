import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ArtworkIdentification {
  name: string;
  artist: string;
  year?: string;
  medium?: string;
  confidence: 'high' | 'medium' | 'low';
  rawResponse: string;
}

/**
 * Analyzes an image using OpenAI Vision API to identify artwork
 * @param imageData Base64 encoded image data (with or without data URI prefix)
 * @returns Artwork identification details
 */
export async function identifyArtwork(
  imageData: string
): Promise<ArtworkIdentification> {
  // Ensure proper base64 format
  const base64Image = imageData.startsWith('data:')
    ? imageData
    : `data:image/jpeg;base64,${imageData}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o', // Using gpt-4o which supports vision
    messages: [
      {
        role: 'system',
        content: `You are an expert art historian specializing in identifying artworks. 
When shown an image of an artwork, identify it by providing:
1. The exact name of the artwork
2. The artist's full name
3. The year it was created (if known)
4. The medium (e.g., oil on canvas, fresco, sculpture)

Format your response as:
Name: [exact artwork name]
Artist: [artist full name]
Year: [year or "Unknown"]
Medium: [medium or "Unknown"]
Confidence: [high/medium/low]

If you cannot identify the specific artwork, provide your best assessment and mark confidence as low.`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Please identify this artwork with as much detail as possible.',
          },
          {
            type: 'image_url',
            image_url: {
              url: base64Image,
              detail: 'high',
            },
          },
        ],
      },
    ],
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content || '';

  // Parse the response
  const nameMatch = content.match(/Name:\s*(.+?)(?:\n|$)/i);
  const artistMatch = content.match(/Artist:\s*(.+?)(?:\n|$)/i);
  const yearMatch = content.match(/Year:\s*(.+?)(?:\n|$)/i);
  const mediumMatch = content.match(/Medium:\s*(.+?)(?:\n|$)/i);
  const confidenceMatch = content.match(/Confidence:\s*(high|medium|low)/i);

  return {
    name: nameMatch?.[1]?.trim() || 'Unknown',
    artist: artistMatch?.[1]?.trim() || 'Unknown',
    year: yearMatch?.[1]?.trim(),
    medium: mediumMatch?.[1]?.trim(),
    confidence: (confidenceMatch?.[1]?.toLowerCase() as ArtworkIdentification['confidence']) || 'low',
    rawResponse: content,
  };
}

