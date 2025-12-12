# Debug: Photo Capture & Agent Tool Call Flow

## The Issue

The agent is calling `analyzeArtwork()` tool **before** the photo has been captured, resulting in "no image is ready to analyze" error.

## Expected Timeline

1. **User clicks "Start Speaking"** 
   - Log: `🚀🚀🚀 CONVERSATION STARTING 🚀🚀🚀`
   - Conversation starts, agent waits for input

2. **User starts speaking**
   - Log: `🔄🔄🔄 MODE CHANGE 🔄🔄🔄` → `speaking`
   - Mode: `speaking` (user is talking)

3. **User stops speaking**
   - Log: `🔄🔄🔄 MODE CHANGE 🔄🔄🔄` → `listening`
   - Mode: `listening` (user finished, agent processes)
   - ⏱️ 1-second timer starts for photo capture

4. **Photo capture (after 1s delay)**
   - Log: `🎯🎯🎯 PHOTO CAPTURE STARTING 🎯🎯🎯`
   - Canvas captures video frame
   - Sends to `/api/analyze-artwork`

5. **Analysis & identification**
   - Log: `📤📤📤 ANALYSIS STARTING 📤📤📤`
   - OpenAI identifies artwork
   - Database lookup for details

6. **Artwork context updated**
   - Log: `🎨🎨🎨 ARTWORK IDENTIFIED 🎨🎨🎨`
   - `artworkContext` state is set
   - Agent can now call `analyzeArtwork()` tool

7. **Agent calls tool (should be AFTER step 6)**
   - Log: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
   - Log: `[analyzeArtwork Tool] 🔧 CALLED BY AGENT`
   - Returns artwork details to agent

## The Problem

**Agent is calling the tool too early** - likely during step 3-5, before artwork context is available.

## Why This Happens

The agent doesn't know about the async nature of photo capture. It hears the user ask about an artwork and immediately tries to call the tool.

## Solutions

### Option 1: Agent Instructions (Current)
Update the agent's error message to tell it to wait:
```json
{
  "error": "The artwork photo has not been captured yet. The system automatically captures the photo when the user stops speaking. Please wait a moment for the photo to be taken and processed, then try calling this function again."
}
```

### Option 2: Retry Mechanism
Make the agent automatically retry the tool call after a delay.

### Option 3: First Message
Give the agent a first message when artwork is ready:
```javascript
if (artworkContext) {
  conversationConfig.overrides = {
    agent: {
      firstMessage: `I can see the artwork has been captured. Let me analyze it for you...`
    }
  };
}
```

### Option 4: Don't Start Conversation Until Photo Captured
Change the flow so the user takes the photo first, THEN starts conversation.

## Watch the Logs

When testing, watch for this sequence in the console:

✅ **Good Flow:**
```
🚀 CONVERSATION STARTING
✅ CONNECTED TO ELEVENLABS
🔄 MODE CHANGE → speaking (user talks)
🔄 MODE CHANGE → listening (user stops)
🎯 PHOTO CAPTURE STARTING
📤 ANALYSIS STARTING
🎨 ARTWORK IDENTIFIED
━━ analyzeArtwork Tool CALLED ← Should happen HERE
```

❌ **Bad Flow (Current Issue):**
```
🚀 CONVERSATION STARTING
✅ CONNECTED TO ELEVENLABS
🔄 MODE CHANGE → speaking (user talks)
━━ analyzeArtwork Tool CALLED ← Too early! No artwork yet
🔄 MODE CHANGE → listening
🎯 PHOTO CAPTURE STARTING
📤 ANALYSIS STARTING
🎨 ARTWORK IDENTIFIED
```

## Next Steps

1. Test the app and check console logs
2. Verify the sequence of events
3. If agent is calling too early, we'll implement one of the solutions above
