/**
 * Mock artwork database
 * In production, this would be replaced with actual database queries
 */

export interface ArtworkData {
  id: string;
  name: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl4k: string;
  wikiartUrl: string;
  description: string;
  historicalContext: string;
  technicalDetails: string;
  interestingFacts: string[];
  conversationContext: string;
}

/**
 * Mock database of artworks
 * Currently only contains Father Hidalgo as example
 */
const MOCK_ARTWORKS: Record<string, ArtworkData> = {
  'father-hidalgo': {
    id: 'father-hidalgo-1949',
    name: 'Father Hidalgo',
    artist: 'José Clemente Orozco',
    year: '1949',
    medium: 'Fresco',
    imageUrl4k: 'https://www.wikiart.org/en/jose-clemente-orozco/father-hidalgo-1949',
    wikiartUrl: 'https://www.wikiart.org/en/jose-clemente-orozco/father-hidalgo-1949',
    description:
      'A powerful fresco depicting Miguel Hidalgo y Costilla, the Mexican priest who initiated the Mexican War of Independence in 1810. The painting shows Hidalgo as a fierce, revolutionary figure with bold, expressive brushstrokes characteristic of Orozco\'s style.',
    historicalContext:
      'Created in 1949 at the Palacio de Gobierno in Guadalajara, Mexico, this fresco is part of Orozco\'s larger series depicting Mexican history. Father Miguel Hidalgo (1753-1811) is considered the father of Mexican independence, and this mural captures his revolutionary spirit and the tumultuous period of Mexican history.',
    technicalDetails:
      'Orozco employed the traditional fresco technique, painting on wet plaster to create a durable, permanent work. His bold use of reds, blacks, and dramatic contrasts creates a sense of urgency and passion. The expressionistic style emphasizes emotion over realistic representation.',
    interestingFacts: [
      'José Clemente Orozco was one of "Los Tres Grandes" (The Three Greats) of Mexican muralism, alongside Diego Rivera and David Alfaro Siqueiros',
      'Orozco lost his left hand in a childhood accident involving gunpowder, yet became one of Mexico\'s most celebrated artists',
      'This fresco is located in the Government Palace of Guadalajara, where viewers can see it in its original architectural context',
      'The painting shows Hidalgo with a torch, symbolizing enlightenment and revolutionary fire',
      'Orozco\'s portrayal is notably more expressionistic and darker than other depictions of Hidalgo, reflecting the violence of revolution',
    ],
    conversationContext: `This is José Clemente Orozco's "Father Hidalgo" (1949), a powerful fresco located in the Palacio de Gobierno in Guadalajara, Mexico. 

The artwork depicts Miguel Hidalgo y Costilla, the Mexican priest who sparked the Mexican War of Independence in 1810. Orozco, one of Mexico's "Los Tres Grandes" muralists alongside Diego Rivera and David Alfaro Siqueiros, created this work using traditional fresco technique on wet plaster.

What makes this piece particularly striking is Orozco's expressionistic style - he uses bold reds, blacks, and dramatic contrasts to capture not just Hidalgo's appearance, but his revolutionary spirit and the violent nature of the independence movement. The painting shows Hidalgo wielding a torch, symbolizing enlightenment and revolutionary fire.

The historical context is fascinating: Hidalgo was a priest who, in 1810, rang the church bells and called the people to revolt against Spanish colonial rule. His "Grito de Dolores" (Cry of Dolores) is celebrated as the beginning of Mexican independence.

Orozco painted this in 1949, about 139 years after Hidalgo's revolt and just before Orozco's death. Despite losing his left hand in a childhood gunpowder accident, Orozco became one of Mexico's most celebrated artists. His portrayal of Hidalgo is notably darker and more expressionistic than traditional heroic depictions, reflecting the complex, violent nature of revolution and social change.

The fresco technique ensures this artwork will last for centuries, permanently embedded in the wall of the Government Palace where it continues to inspire visitors today.`,
  },
};

/**
 * Looks up artwork data in the mock database
 * In production, this would query a real database using the artwork name and artist
 * 
 * @param name Artwork name from Vision API
 * @param artist Artist name from Vision API
 * @returns Artwork data or null if not found
 */
export function lookupArtwork(
  name: string,
  artist: string
): ArtworkData | null {
  // For MVP, always return Father Hidalgo
  // In production, this would search the database based on name and artist
  console.log(`[MOCK] Looking up artwork: "${name}" by ${artist}`);
  console.log('[MOCK] Returning Father Hidalgo data (mock database)');
  
  return MOCK_ARTWORKS['father-hidalgo'];
}

/**
 * Gets all available artworks (for testing/admin)
 */
export function getAllArtworks(): ArtworkData[] {
  return Object.values(MOCK_ARTWORKS);
}

