# New Conversation Flow

## Overview
The app now uses a voice-first approach where the conversation starts before capturing the artwork photo.

## User Flow

1. **Camera Active**
   - App opens with fullscreen camera view
   - User points camera at artwork
   - UI shows "Start Speaking" button

2. **Start Conversation**
   - User clicks "Start Speaking"
   - ElevenLabs conversation starts immediately (no artwork context yet)
   - UI prompts: "Speak to the agent"

3. **User Speaks**
   - User talks to the agent (e.g., "Tell me about this painting")
   - System detects user is speaking
   - Status shows: "👂 Listening to you..."

4. **Auto-Capture on Pause**
   - When user stops speaking (detected via `onModeChange` event)
   - System waits 1 second
   - Automatically captures photo from camera
   - Status shows: "📸 Capturing artwork..."

5. **Analysis**
   - Photo is sent to `/api/analyze-artwork`
   - OpenAI identifies the artwork
   - If found in database, artwork context is loaded
   - Green card appears with artwork details

6. **Continue Conversation**
   - Artwork context is now available to the agent
   - Agent can call `analyzeArtwork()` client tool to get details
   - User can continue asking questions
   - Status shows: "🎨 [Artwork Name] - Continue talking!"

7. **Reset/New Artwork**
   - User clicks "Clear" button on artwork card
   - Resets for capturing a new artwork
   - Conversation continues if active

8. **End Conversation**
   - User clicks "End Conversation"
   - WebSocket closes
   - Returns to initial state

## Key Technical Changes

### page.tsx
- Simplified to just manage artwork state
- No more modal overlay approach
- Passes `onCapturePhoto` handler to conversation component

### conversation.tsx
- Integrates camera view directly
- Fullscreen video background with UI overlay
- Detects when user stops speaking via `onModeChange`
- Auto-captures photo after 1-second delay
- No auto-start on mount - user must click button
- Handles React Strict Mode properly with cleanup functions

## Benefits

✅ **Voice-first UX**: More natural conversation flow
✅ **Automatic capture**: No manual photo button needed
✅ **Single screen**: Everything on one interface
✅ **Better context**: Agent can be primed before seeing artwork
✅ **Cleaner code**: No complex modal state management
