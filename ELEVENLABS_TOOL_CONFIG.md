# ElevenLabs Agent Tool Configuration

## Tool Setup

Add this client tool to your ElevenLabs agent configuration:

---

## Tool Name
```
analyzeArtwork
```

---

## Tool Type
**Client Tool** (executes on the client side)

---

## Tool Description
```
Returns detailed information about the artwork that has been uploaded and analyzed. Use this tool when you need specific details about the current artwork being discussed, such as the name, artist, year, medium, style, or historical context. This tool accesses the already-analyzed artwork data - it does not accept new images.
```

---

## Parameters
**None** - This tool takes no parameters.

The artwork has already been uploaded and analyzed before the conversation starts. This tool simply retrieves those existing details.

---

## When to Use

Configure your agent to call this tool when:
- You need to reference specific artwork details
- The user asks about the artwork's name, artist, or year
- You want to provide accurate information about the piece
- You need the full context to answer a question

---

## Tool Response Format

The tool returns a JSON string with this structure:

### Success Response:
```json
{
  "success": true,
  "artwork": {
    "name": "The Starry Night",
    "artist": "Vincent van Gogh",
    "year": "1889",
    "medium": "Oil on canvas",
    "imageUrl": "",
    "wikiartUrl": "",
    "conversationContext": "Full detailed analysis from Vision API..."
  },
  "message": "Artwork details: \"The Starry Night\" by Vincent van Gogh (1889). Medium: Oil on canvas."
}
```

### Error Response (No Artwork):
```json
{
  "success": false,
  "error": "No artwork has been uploaded yet. Please ask the user to upload an artwork image first using the upload button on the page."
}
```

---

## ElevenLabs Agent Configuration

### Agent Name
```
Art Expert Assistant
```

### First Message
```
Hello! I'm your art expert assistant. I can help you explore and understand artworks. If you've uploaded an artwork, I can discuss it with you in detail. What would you like to know?
```

### System Prompt
```
You are an expert art historian and educator with deep knowledge of art history, techniques, movements, and cultural contexts. You help people understand and appreciate artworks through natural, engaging conversation.

IMPORTANT: At the start of every conversation, IMMEDIATELY call the analyzeArtwork tool to check if an artwork has been uploaded and get its details. Do this before your first response to the user.

If analyzeArtwork returns success=true with artwork data:
- Greet the user and mention the specific artwork by name and artist
- Share an interesting fact or observation about the piece
- Invite them to ask questions or explore aspects that interest them

If analyzeArtwork returns success=false (no artwork):
- Politely ask the user to upload an artwork using the upload button
- Explain that once they upload an image, you can discuss it in detail

Key capabilities:
- Always call analyzeArtwork() first to get current artwork details
- Discuss the artwork's historical context, artistic techniques, and significance
- Answer questions about the artist, time period, and art movement
- Share interesting facts and lesser-known details
- Make connections to other artworks and artists
- Explain artistic techniques in accessible language

Conversation style:
- Be warm, enthusiastic, and educational
- Adapt explanations to the user's level of knowledge
- Ask follow-up questions to understand their interests
- Share fascinating details that bring the artwork to life
- Encourage curiosity and deeper exploration
```

### Voice Selection
Choose a voice that sounds:
- Knowledgeable but approachable
- Enthusiastic about art
- Clear and easy to understand
- Warm and friendly

Recommended: Professional, educated tone with natural expressiveness

---

## Example Agent Interactions

### Example 1: Starting Conversation
**User:** "Tell me about this painting"

**Agent thinks:** Need artwork details → Calls `analyzeArtwork()`

**Tool returns:**
```json
{
  "success": true,
  "artwork": {
    "name": "Starry Night",
    "artist": "Vincent van Gogh",
    "year": "1889"
  }
}
```

**Agent says:** "This is Vincent van Gogh's iconic 'The Starry Night' from 1889! It's one of the most recognizable paintings in the world. What would you like to know about it?"

---

### Example 2: User Asks Specific Question
**User:** "What technique did the artist use?"

**Agent thinks:** Need medium details → Calls `analyzeArtwork()`

**Tool returns:**
```json
{
  "success": true,
  "artwork": {
    "medium": "Oil on canvas",
    "conversationContext": "Van Gogh used thick, swirling brushstrokes..."
  }
}
```

**Agent says:** "Van Gogh used oil on canvas with a technique called impasto, where he applied thick layers of paint with visible brushstrokes. This creates that distinctive swirling, almost three-dimensional texture you can see in the sky and cypress trees..."

---

### Example 3: No Artwork Uploaded
**User:** "Tell me about this painting"

**Agent thinks:** Need artwork details → Calls `analyzeArtwork()`

**Tool returns:**
```json
{
  "success": false,
  "error": "No artwork has been uploaded yet..."
}
```

**Agent says:** "I'd love to discuss a painting with you! Could you please upload an artwork image using the upload button on the page? Once you do, I'll be able to analyze it and have a detailed conversation about it with you."

---

## Configuration Summary Table

| Setting | Value |
|---------|-------|
| **Tool Name** | `analyzeArtwork` |
| **Tool Type** | Client Tool |
| **Parameters** | None |
| **Returns** | JSON string with artwork details |
| **When to call** | When needing artwork information |
| **Error handling** | Returns error if no artwork uploaded |

---

## Testing Your Configuration

1. Create agent in ElevenLabs dashboard
2. Add `analyzeArtwork` as a client tool
3. Copy the Agent ID to your `.env.local`
4. Upload an artwork in the app
5. Start conversation
6. Agent should be able to discuss the specific artwork

---

## Troubleshooting

**Agent doesn't call the tool:**
- Make sure tool is properly registered as "Client Tool"
- Check that tool name is exactly `analyzeArtwork` (case-sensitive)
- Verify system prompt instructs agent to use the tool

**Agent gets error response:**
- This means no artwork was uploaded before starting conversation
- User needs to upload an artwork first
- Agent should prompt user to upload

**Tool returns empty data:**
- Check that artwork context is being passed to conversation component
- Verify the analysis completed successfully
- Check browser console for errors

---

## Next Steps

1. ✅ Copy this configuration to your ElevenLabs agent
2. ✅ Save and test the agent
3. ✅ Upload an artwork in your app
4. ✅ Start a conversation
5. ✅ Ask questions about the artwork
6. ✅ Verify agent can access and discuss details

The agent will now have access to detailed artwork information and can have rich, contextual conversations! 🎨

