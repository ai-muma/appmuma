# Setup Guide - Artwork Analysis Agent

Follow these steps to get your artwork analysis agent up and running.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API account
- ElevenLabs account

## Step-by-Step Setup

### 1. Clone and Install

```bash
cd muma
npm install
```

### 2. Get OpenAI API Key

1. Visit [https://platform.openai.com/](https://platform.openai.com/)
2. Sign in or create an account
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (it starts with `sk-`)
6. **Save it securely** - you won't be able to see it again!

### 3. Set Up ElevenLabs

#### Create Account and Get API Key

1. Visit [https://elevenlabs.io/](https://elevenlabs.io/)
2. Sign up for an account
3. Go to your profile settings
4. Navigate to API section
5. Copy your API key

#### Create a Conversational Agent

1. In ElevenLabs dashboard, go to "Conversational AI"
2. Click "Create New Agent"
3. Configure your agent:
   - **Name**: Art Expert Assistant
   - **Voice**: Choose a knowledgeable, friendly voice
   - **System Prompt**: 
     ```
     You are an expert art historian and educator. You help people understand and appreciate artworks through natural conversation. When provided with artwork context, discuss it enthusiastically and answer questions with depth and clarity. Be conversational, engaging, and educational.
     ```
   - **First Message**: "Hello! I'm ready to discuss art with you. What artwork are we looking at today?"
4. Save the agent and copy the **Agent ID**

### 4. Create Environment File

Create a file named `.env.local` in the root directory:

```bash
# OpenAI API Key for Vision API
OPENAI_API_KEY=sk-your-actual-openai-key-here

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
NEXT_PUBLIC_AGENT_ID=your-agent-id-here
```

**Important Notes:**
- Replace the placeholder values with your actual keys
- Never commit `.env.local` to version control
- The `NEXT_PUBLIC_` prefix is required for client-side environment variables

### 5. Verify Installation

Check that all dependencies are installed:

```bash
npm list openai @elevenlabs/client next react
```

You should see:
- openai@^4.x.x
- @elevenlabs/client@^0.x.x
- next@16.0.10
- react@19.2.1

### 6. Start Development Server

```bash
npm run dev
```

The app should start at [http://localhost:3000](http://localhost:3000)

### 7. Test the Application

#### Test API Endpoint

1. Open your browser's developer console
2. Visit [http://localhost:3000/api/analyze-artwork](http://localhost:3000/api/analyze-artwork)
3. You should see a JSON response with status "ok"

#### Test Image Analysis

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click "Upload File" or "Use Camera"
3. Select an image of an artwork
4. Click "Analyze Artwork"
5. You should see identification results

#### Test Voice Conversation

1. After analyzing an artwork
2. Click "Start Conversation"
3. Allow microphone access when prompted
4. Speak to the agent about the artwork
5. The agent should respond with voice

## Troubleshooting

### Error: "Missing OPENAI_API_KEY environment variable"

**Solution:**
1. Make sure `.env.local` file exists in the root directory
2. Verify the variable is named exactly `OPENAI_API_KEY`
3. Check that there are no extra spaces or quotes
4. Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Error: "NEXT_PUBLIC_AGENT_ID not configured"

**Solution:**
1. Verify your `.env.local` has `NEXT_PUBLIC_AGENT_ID`
2. The variable name must start with `NEXT_PUBLIC_`
3. Make sure the Agent ID is correct (copy from ElevenLabs dashboard)
4. Restart the dev server

### Camera Not Working

**Solution:**
1. Make sure you're using HTTPS or localhost
2. Grant camera permissions in your browser
3. Check browser console for specific error messages
4. Try using file upload instead

### Voice Conversation Not Starting

**Solution:**
1. Verify `ELEVENLABS_API_KEY` is correct
2. Check that your ElevenLabs account has sufficient credits
3. Make sure the Agent ID matches your created agent
4. Check browser console for error messages
5. Verify microphone permissions are granted

### OpenAI Vision API Errors

**Solution:**
1. Verify your OpenAI account has GPT-4 Vision access
2. Check your OpenAI account has available credits
3. Ensure image is under 10MB
4. Try with a different image

## Testing with Sample Images

For testing, you can use these public domain artwork images:

1. Search for famous artworks on [WikiArt](https://www.wikiart.org/)
2. Download images of well-known paintings
3. Test with different art styles and periods

Remember: The current version uses a mock database that returns "Father Hidalgo" data. The Vision API will still analyze your actual image, but you'll see the same artwork information.

## Next Steps

Once everything is working:

1. Test with multiple different artwork images
2. Try both file upload and camera capture
3. Have full conversations with the agent
4. Check the console logs to see identification results
5. When ready, replace the mock database with a real one

## Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Check the terminal where `npm run dev` is running
3. Verify all API keys are correct
4. Make sure you're using Node.js 18+
5. Try clearing Next.js cache: `rm -rf .next` then `npm run dev`

## API Key Safety

**Important Security Notes:**

- Never commit `.env.local` to Git
- Never share your API keys publicly
- Rotate keys if they're accidentally exposed
- Monitor your usage on OpenAI and ElevenLabs dashboards
- Set usage limits to avoid unexpected charges

## Resource Links

- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [ElevenLabs Documentation](https://elevenlabs.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [WikiArt - Public Domain Artworks](https://www.wikiart.org/)

## Success Checklist

- [ ] Dependencies installed successfully
- [ ] `.env.local` file created with all keys
- [ ] Dev server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Image upload/camera capture works
- [ ] Artwork analysis returns results
- [ ] Voice conversation starts successfully
- [ ] Agent responds to voice input
- [ ] No console errors

Congratulations! Your artwork analysis agent is now ready to use! 🎨

