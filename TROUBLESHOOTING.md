# Troubleshooting Guide

## Common Issues and Solutions

### Issue: Agent doesn't start speaking automatically about the artwork

**Symptoms:**
- Artwork is analyzed successfully
- Conversation starts automatically
- But the agent waits for you to speak first instead of talking about the artwork

**Root Cause:**
The "First message" override is not enabled in your ElevenLabs agent settings.

**Solution:**

1. Go to your ElevenLabs dashboard
2. Open your agent's settings
3. Navigate to the **"Security"** tab
4. Find the **"Overrides"** section
5. Enable the **"First message"** override checkbox
6. Save your agent settings
7. Restart the conversation in your app

**Why this is needed:**
The app sends a dynamic first message telling the agent exactly what artwork was just captured. Without this override enabled, ElevenLabs will ignore the custom message and wait for user input.

---

### Issue: Agent asks to upload artwork even though it's already uploaded

**Symptoms:**
- Artwork analysis works (you see logs showing identification)
- You click "Start Conversation"
- Agent says "Please upload an artwork" or similar

**Root Cause:**
The agent is not calling the `analyzeArtwork` tool, or the tool is not configured correctly in ElevenLabs.

**Solution Steps:**

#### 1. Check Browser Console Logs

When you start the conversation and the agent speaks, look for these logs:

```
[Conversation] Starting with artworkContext: true
[Conversation] Artwork available: Mona Lisa by Leonardo da Vinci
[Conversation] Session started successfully
[analyzeArtwork Tool] Called by agent
[analyzeArtwork Tool] artworkContext exists: true
[analyzeArtwork Tool] Returning artwork: Mona Lisa
```

**If you see these logs:** Tool is working! Issue is with agent configuration.

**If you DON'T see `[analyzeArtwork Tool] Called by agent`:** Agent is not calling the tool.

---

#### 2. Update Your ElevenLabs Agent System Prompt

Your agent needs to know to call the tool immediately. Update the system prompt in your ElevenLabs dashboard:

**Critical section to add:**
```
IMPORTANT: At the start of every conversation, IMMEDIATELY call the analyzeArtwork tool to check if an artwork has been uploaded and get its details. Do this before your first response to the user.

If analyzeArtwork returns success=true with artwork data:
- Greet the user and mention the specific artwork by name and artist
- Share an interesting fact or observation about the piece

If analyzeArtwork returns success=false (no artwork):
- Politely ask the user to upload an artwork
```

---

#### 3. Verify Tool is Registered

In your ElevenLabs dashboard:
1. Go to your agent settings
2. Find "Client Tools" section
3. Confirm `analyzeArtwork` is listed
4. Check that it has:
   - **Name:** `analyzeArtwork` (exact spelling, case-sensitive)
   - **Type:** Client Tool
   - **Parameters:** None

---

#### 4. Test the Tool Manually

Add this to your agent's system prompt temporarily for testing:

```
When the user says "test tool", immediately call analyzeArtwork and tell the user exactly what the tool returned.
```

Then:
1. Upload artwork
2. Start conversation
3. Say "test tool"
4. Agent should call the tool and tell you what it got back

---

#### 5. Check Artwork Context is Available

Look at the conversation component logs:

```
[Conversation] Starting with artworkContext: true   ← Should be true
[Conversation] Artwork available: [name]            ← Should show artwork name
```

If these show `false` or are missing:
- Artwork didn't upload properly
- UI flow issue
- Check earlier logs for upload errors

---

### Issue: Tool returns "No artwork uploaded" error

**Check these logs:**
```
[analyzeArtwork Tool] Called by agent
[analyzeArtwork Tool] artworkContext exists: false  ← Problem!
[analyzeArtwork Tool] No artwork context - returning error
```

**Solutions:**

1. **Make sure you upload artwork BEFORE starting conversation**
   - Upload image first
   - Wait for green success message
   - THEN click "Start Conversation"

2. **Check the page flow:**
   - After upload, does the conversation component appear?
   - Do you see the blue box showing artwork details?
   - If not, check browser console for errors

3. **Verify API response:**
   Look for these logs after upload:
   ```
   [Analyze Artwork] ✅ OpenAI Vision identified: { name: ... }
   ```

---

### Issue: Agent doesn't understand tool response

**Symptoms:**
- Tool is called (you see logs)
- But agent still says "no artwork" or gives wrong information

**Solution:**

Check your agent's configuration:
- Make sure it's set to use client tools
- Verify the tool response format is being parsed
- Try simplifying your system prompt
- Test with basic instructions first

---

### Issue: NEXT_PUBLIC_AGENT_ID not configured

**Error message:**
```
Error: NEXT_PUBLIC_AGENT_ID not configured
```

**Solution:**
1. Open `.env.local` in root directory
2. Add: `NEXT_PUBLIC_AGENT_ID=your_agent_id_here`
3. Get your Agent ID from ElevenLabs dashboard
4. Restart dev server: `npm run dev`

---

### Issue: OpenAI Vision identification fails

**Check logs for:**
```
[Analyze Artwork] Error: [some error message]
```

**Common causes:**
1. **Invalid API key**
   - Check `OPENAI_API_KEY` in `.env.local`
   - Verify it starts with `sk-`
   - Test it on OpenAI platform

2. **No API credits**
   - Check your OpenAI account balance
   - Add payment method if needed

3. **Image too large**
   - Error: "Image too large"
   - Compress image or use smaller file
   - Max size: 10MB

4. **Invalid image format**
   - Use JPEG, PNG, or WebP
   - Check file isn't corrupted

---

### Issue: ElevenLabs connection fails

**Check:**
1. **API Key:** Valid ELEVENLABS_API_KEY in `.env.local`
2. **Agent ID:** Correct NEXT_PUBLIC_AGENT_ID
3. **Network:** Browser console for connection errors
4. **Credits:** ElevenLabs account has available credits

---

## Debug Checklist

When things aren't working, go through this checklist:

### Before Upload
- [ ] `.env.local` exists with all 3 API keys
- [ ] Dev server is running (`npm run dev`)
- [ ] No errors in terminal

### During Upload
- [ ] Image file is valid (JPEG/PNG/WebP, < 10MB)
- [ ] See "Analyzing..." loading state
- [ ] Console shows Vision API logs
- [ ] Green success message appears

### After Upload
- [ ] Conversation component is visible
- [ ] Blue box shows artwork details
- [ ] "Start Conversation" button is enabled

### During Conversation
- [ ] Browser asks for microphone permission (grant it)
- [ ] Console shows: `[Conversation] Starting with artworkContext: true`
- [ ] Console shows: `[analyzeArtwork Tool] Called by agent`
- [ ] Console shows: `[analyzeArtwork Tool] Returning artwork: [name]`
- [ ] Agent mentions the correct artwork name

---

## Getting More Help

### 1. Check Console Logs

Always look at browser console (F12 → Console tab) for detailed logs showing:
- What the Vision API identified
- Whether artwork context is available
- If/when the tool is called
- What the tool returns

### 2. Check Terminal Logs

The terminal where `npm run dev` is running shows:
- API endpoint calls
- Server-side errors
- Build issues

### 3. Test Step by Step

1. **Test Vision API only:**
   - Upload image
   - Check logs for identification
   - Don't start conversation yet

2. **Test Conversation only:**
   - After successful upload
   - Start conversation
   - Check if tool is called

3. **Test Tool only:**
   - Use "test tool" command in system prompt
   - Manually trigger tool call
   - See what it returns

---

## Example of Working Flow

### Expected Console Output:

```
# After uploading Mona Lisa:
[Analyze Artwork] Starting artwork identification...
[Analyze Artwork] ✅ OpenAI Vision identified: {
  name: 'Mona Lisa',
  artist: 'Leonardo da Vinci',
  year: 'c. 1503–1506',
  confidence: 'high'
}
[Analyze Artwork] ✅ Using real identification data (no database)

# After clicking "Start Conversation":
[Conversation] Starting with artworkContext: true
[Conversation] Artwork available: Mona Lisa by Leonardo da Vinci
[Conversation] Session started successfully

# When agent speaks first message (should automatically call tool):
[analyzeArtwork Tool] Called by agent
[analyzeArtwork Tool] artworkContext exists: true
[analyzeArtwork Tool] Returning artwork: Mona Lisa
[analyzeArtwork Tool] Response: Artwork details: "Mona Lisa" by Leonardo da Vinci...

# Agent should say something like:
"Hello! I can see you've uploaded Leonardo da Vinci's Mona Lisa..."
```

If you see all these logs but agent still asks to upload, the issue is in the ElevenLabs agent configuration, not in the code.

---

## Still Having Issues?

1. **Verify ElevenLabs System Prompt** - Must tell agent to call tool immediately
2. **Check Tool Registration** - Tool must be named exactly `analyzeArtwork`
3. **Test API Keys** - All three must be valid
4. **Clear Cache** - Try restarting browser
5. **Check Account Credits** - Both OpenAI and ElevenLabs need credits

---

Last Updated: 2025-12-11

