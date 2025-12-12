# Quick Start Guide

Get your Artwork Analysis Agent running in 5 minutes!

## 1. Install Dependencies ✅

```bash
npm install
```

Already done! ✅ Installed:
- `openai` - OpenAI Vision API
- `@elevenlabs/client` - ElevenLabs Conversational AI

## 2. Configure API Keys 🔑

Create `.env.local` in the project root:

```bash
OPENAI_API_KEY=sk-your-key-here
ELEVENLABS_API_KEY=your-key-here
NEXT_PUBLIC_AGENT_ID=your-agent-id-here
```

### Where to get API keys:

**OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)  
**ElevenLabs**: [elevenlabs.io/app/conversational-ai](https://elevenlabs.io/app/conversational-ai)

## 3. Run the App 🚀

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Test It Out 🎨

1. **Upload an artwork image** (or take a photo)
2. Click **"Analyze Artwork"**
3. Click **"Start Conversation"**
4. **Talk to the AI** about the artwork!

## Current Mode

The app uses **OpenAI Vision API** to identify any artwork you upload. The AI agent will discuss the actual artwork identified from your image using its knowledge base about art history and artists.

## What's Built

✅ **Backend API** (`/api/analyze-artwork`)
- OpenAI Vision integration
- Real-time artwork identification
- Context builder from Vision results

✅ **Frontend Components**
- Artwork uploader (file + camera)
- ElevenLabs conversation UI
- Beautiful, responsive design

✅ **Full Flow**
1. Image upload/capture
2. AI vision identification
3. Context built from Vision API
4. Voice conversation about actual artwork

## Project Structure

```
muma/
├── lib/
│   ├── openai.ts              # OpenAI Vision client
│   └── mock-artwork-data.ts   # Mock database
├── app/
│   ├── api/analyze-artwork/   # Backend API
│   ├── components/
│   │   ├── artwork-uploader.tsx
│   │   └── conversation.tsx
│   └── page.tsx               # Main UI
└── .env.local                 # Your API keys (create this!)
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Missing API key error | Create `.env.local` with your keys |
| Camera not working | Grant permissions or use file upload |
| Agent won't connect | Check ElevenLabs Agent ID is correct |
| Vision API error | Verify OpenAI key and credits |

## Next Steps

1. ✅ Set up your API keys
2. ✅ Test with sample artwork images
3. ✅ Have conversations with the AI
4. 🔄 Replace mock database with real one (future)
5. 🔄 Add more artworks to database (future)

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions and troubleshooting.

---

**Ready?** Just add your API keys to `.env.local` and run `npm run dev`! 🎉

