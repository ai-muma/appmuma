# ElevenLabs Agent Tools Configuration

## Available Client Tools

The agent now has **3 client-side tools** available:

### 1. `capturePhoto()`
**Purpose:** Captures a photo of the artwork from the camera

**When to use:** 
- When the user asks about an artwork and no photo has been taken yet
- At the beginning of the conversation when discussing a specific artwork

**Returns:**
```json
{
  "success": true,
  "message": "Photo captured successfully! The artwork is now being analyzed. Wait a moment, then call analyzeArtwork() to get the details."
}
```

**Example flow:**
```
User: "Tell me about this painting"
Agent: [calls capturePhoto()]
Agent: "I'm capturing the artwork now. Let me analyze it for you..."
Agent: [waits 2-3 seconds]
Agent: [calls analyzeArtwork()]
Agent: "This is the Mona Lisa by Leonardo da Vinci..."
```

---

### 2. `analyzeArtwork()`
**Purpose:** Gets the details of the captured and analyzed artwork

**When to use:**
- AFTER `capturePhoto()` has been called and completed
- When you need specific details about the artwork (name, artist, year, etc.)

**Returns:**
```json
{
  "success": true,
  "artwork": {
    "name": "Mona Lisa",
    "artist": "Leonardo da Vinci",
    "year": "1503",
    "medium": "Oil on poplar panel",
    "conversationContext": "Detailed information about the artwork..."
  },
  "message": "Artwork details: \"Mona Lisa\" by Leonardo da Vinci (1503)..."
}
```

**Error if called too early:**
```json
{
  "success": false,
  "error": "No artwork has been captured yet. Please call the capturePhoto() tool first..."
}
```

---

### 3. `logMessage(message: string)`
**Purpose:** Logs debug messages (for development)

**Parameters:**
- `message` (string): Message to log

---

## Recommended Agent Instructions

Add this to your ElevenLabs agent's system prompt:

```
You are an AI art guide that helps users learn about artworks through voice conversation.

IMPORTANT WORKFLOW:
1. When a user asks about an artwork, FIRST call capturePhoto() to take a picture
2. Wait 2-3 seconds for the photo to be analyzed
3. Then call analyzeArtwork() to get the artwork details
4. Use the artwork information to answer the user's questions

TOOLS USAGE:
- capturePhoto(): Call this when the user asks about an artwork and you don't have the details yet
- analyzeArtwork(): Call this AFTER capturePhoto() to get the artwork information
- Always wait a few seconds between capturePhoto() and analyzeArtwork()

Be conversational, enthusiastic, and educational. Share interesting facts about the artwork, artist, historical context, and techniques.
```

---

## Agent Security Settings

Make sure these are enabled in ElevenLabs agent settings:

✅ **Client Tools** - Enabled (allows the agent to call browser-side tools)
✅ **First Message Override** - Enabled (allows dynamic first messages)
✅ **Custom Data** - Enabled (for passing artwork context)

---

## Testing the Flow

### Test 1: Basic Artwork Query
```
User: "What can you tell me about this painting?"

Expected:
1. Agent calls capturePhoto()
2. Agent says something like "Let me capture and analyze that for you..."
3. [2-3 second pause]
4. Agent calls analyzeArtwork()
5. Agent provides information about the artwork
```

### Test 2: Multiple Questions
```
User: "Tell me about this artwork"
Agent: [captures photo, analyzes]
User: "Who painted it?"
Agent: [uses already-captured data, doesn't need to capture again]
```

---

## Troubleshooting

### Agent says "No image ready to analyze"
**Problem:** Agent is calling `analyzeArtwork()` before `capturePhoto()`

**Solution:** Update agent instructions to call `capturePhoto()` first

---

### Photo captures but agent doesn't know about artwork
**Problem:** Agent isn't calling `analyzeArtwork()` after photo capture

**Solution:** Make sure agent waits 2-3 seconds after `capturePhoto()` before calling `analyzeArtwork()`

---

### Agent keeps trying to capture photo
**Problem:** `capturePhoto()` returns success but agent doesn't wait

**Solution:** Add explicit waiting instruction in agent prompt
