# 🎨 Artwork Analysis Agent

An AI-powered multi-modal art analysis system that uses OpenAI GPT-4 Vision to identify artworks and enables natural voice conversations about art through ElevenLabs conversational AI.

## Features

- **🔍 AI Vision Recognition**: Identify artworks using OpenAI GPT-4 Vision API
- **🗣️ Voice Conversations**: Natural voice chat with ElevenLabs AI agent
- **📚 Rich Context**: Detailed artwork information including history, technique, and interesting facts
- **📸 Multiple Input Methods**: Upload files or capture images directly from your camera
- **🎯 Client Tools**: Agent can request additional artwork analysis during conversations
- **🤖 Real-time Analysis**: Uses actual Vision API identification results for conversations

## Architecture

```
User → Image Upload → /api/analyze-artwork → OpenAI Vision API
                                          ↓
                                    Build Context from Vision Results
                                          ↓
                            ElevenLabs Conversation Agent
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **AI Vision**: OpenAI GPT-4o Vision API
- **Voice AI**: ElevenLabs Conversational AI SDK
- **Language**: TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API Key for Vision API
OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs API Keys
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_AGENT_ID=your_elevenlabs_agent_id_here
```

### 3. Get Your API Keys

**OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env.local`

**ElevenLabs API Key & Agent ID:**
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Navigate to your profile/API settings
4. Copy your API key
5. Create a conversational agent and copy the Agent ID
6. Paste both into `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload an Artwork**: Use the file upload or camera capture to select an artwork image
2. **Analysis**: The system identifies the artwork using OpenAI Vision API
3. **Rich Context**: Retrieves detailed information from the database (currently mocked)
4. **Start Conversation**: Click to begin a voice conversation with the ElevenLabs agent
5. **Natural Chat**: Ask questions about the artwork, artist, history, technique, etc.

## Current Mode

The system uses OpenAI Vision API to identify artworks in real-time:

- OpenAI Vision API analyzes your uploaded image
- Real identification results are used for the conversation
- No database required - works with any artwork
- ElevenLabs agent discusses the actual identified artwork using its knowledge base

## File Structure

```
muma/
├── app/
│   ├── api/
│   │   └── analyze-artwork/
│   │       └── route.ts          # Backend API endpoint
│   ├── components/
│   │   ├── artwork-uploader.tsx  # Image upload/camera component
│   │   └── conversation.tsx      # ElevenLabs conversation component
│   ├── page.tsx                  # Main page
│   ├── layout.tsx                # App layout
│   └── globals.css               # Global styles
├── lib/
│   ├── openai.ts                 # OpenAI client utility
│   └── mock-artwork-data.ts      # Mock database
├── .env.local                    # Environment variables (create this)
└── package.json
```

## API Endpoints

### POST /api/analyze-artwork

Analyzes an uploaded artwork image.

**Request:**
```json
{
  "imageData": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "identified": true,
  "inDatabase": true,
  "identification": {
    "name": "Father Hidalgo",
    "artist": "José Clemente Orozco",
    "year": "1949",
    "medium": "Fresco",
    "confidence": "high"
  },
  "artwork": {
    "id": "father-hidalgo-1949",
    "name": "Father Hidalgo",
    "artist": "José Clemente Orozco",
    "year": "1949",
    "medium": "Fresco",
    "imageUrl4k": "https://www.wikiart.org/...",
    "wikiartUrl": "https://www.wikiart.org/...",
    "description": "...",
    "conversationContext": "..."
  }
}
```

### GET /api/analyze-artwork

Health check endpoint.

## Future Enhancements

- [ ] Replace mock database with real database (PostgreSQL, MongoDB, etc.)
- [ ] Add more artworks to the database
- [ ] Implement database search and matching logic
- [ ] Add user authentication
- [ ] Save conversation history
- [ ] Support for multiple languages
- [ ] Image similarity search for unidentified artworks
- [ ] Export conversation transcripts
- [ ] Mobile app version

## Troubleshooting

**"Missing OPENAI_API_KEY environment variable"**
- Make sure `.env.local` exists and contains your OpenAI API key
- Restart the dev server after adding environment variables

**"Unable to access camera"**
- Grant camera permissions in your browser
- Use HTTPS or localhost (camera requires secure context)

**"NEXT_PUBLIC_AGENT_ID not configured"**
- Add your ElevenLabs Agent ID to `.env.local`
- Ensure the variable name starts with `NEXT_PUBLIC_` for client-side access

## Contributing

This is a demonstration project. To extend it:

1. Replace `lib/mock-artwork-data.ts` with real database queries
2. Add more artworks to your database
3. Implement fuzzy matching for artwork identification
4. Enhance the conversation agent with more capabilities

## License

MIT

## Credits

- Built with [Next.js](https://nextjs.org/)
- AI Vision by [OpenAI](https://openai.com/)
- Voice AI by [ElevenLabs](https://elevenlabs.io/)
- Example artwork: "Father Hidalgo" by José Clemente Orozco ([WikiArt](https://www.wikiart.org/en/jose-clemente-orozco/father-hidalgo-1949))
