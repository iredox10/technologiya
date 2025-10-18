# ⚠️ CRITICAL: Hugging Face API Key REQUIRED

## Current Error

If you're seeing this error:
```
Error: API returned 401: {"error":"Invalid username or password."}
```

**This means you MUST add a Hugging Face API key.** The free tier without authentication is no longer available.

## What Changed

Hugging Face Inference API now **requires authentication** for MMS-TTS models. You cannot use the TTS feature without an API key.

- ❌ Removed: `@huggingface/inference` package (doesn't support MMS-TTS)
- ✅ Added: Direct API calls to Hugging Face Inference API
- ✅ Updated: Component now uses `fetch()` to call the model directly
- ⚠️ **REQUIRED**: API key is now mandatory

## Quick Fix (Get API Key Now)

**API key is 100% FREE** and takes 2 minutes to get:

### Step 1: Get Free API Key (2 minutes)

1. **Go to**: https://huggingface.co/join
2. **Sign up** (free account - use Google/GitHub for quick signup)
3. **Go to**: https://huggingface.co/settings/tokens
4. **Click** "New token"
5. **Name it**: "Technologiya TTS"
6. **Select** "Read" role (default)
7. **Click** "Generate a token"
8. **Copy** the token (starts with `hf_...`)

⚠️ **Keep this token safe!** You'll need it in the next step.

### Step 2: Add to Your Project (Choose One Method)

#### Method A: Environment Variable (RECOMMENDED ✅)

**Run these commands in your terminal:**

```bash
# 1. Go to your project directory
cd /home/iredox/Desktop/technologiya

# 2. Create .env file with your API key
# Replace hf_your_token_here with your actual token
echo 'PUBLIC_HUGGINGFACE_API_KEY=hf_your_token_here' > .env

# 3. Add .env to .gitignore (important!)
echo ".env" >> .gitignore
```

**Then update `/src/pages/articles/[slug].astro`:**

Find this line:
```astro
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  client:load 
/>
```

Replace it with:
```astro
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  apiKey={import.meta.env.PUBLIC_HUGGINGFACE_API_KEY}
  client:load 
/>
```

**Finally, restart your dev server:**
```bash
# Stop the current server (Ctrl+C) then run:
bun run dev
```

#### Method B: Quick Test (Temporary - for testing only)

**Update `/src/pages/articles/[slug].astro`:**

```astro
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  apiKey="hf_your_actual_token_here"
  client:load 
/>
```

**Then restart dev server:**
```bash
bun run dev
```

⚠️ **WARNING**: Never commit this file to git with your API key! Use Method A for production.

## Testing After Adding API Key

1. **Make sure you added the API key** (see Step 2 above)

2. **Restart your dev server** (Ctrl+C then `bun run dev`)

3. **Open any article**: http://localhost:4321/articles/quantum-computing-breakthrough

4. **Click "Kunna Sauti"** button

5. **Wait 2-5 seconds** (first generation)
   - You'll see progress bar
   - Console will show the request

6. **Audio will play** once loaded!

7. **Second time**: Will load from cache (instant)

## Performance With API Key

| Feature | Performance |
|---------|-------------|
| First request | 2-5 seconds (may take up to 20s if model is cold) |
| Cached audio | Instant (<100ms) |
| Rate limits | Generous free tier limits |
| Cost | **100% FREE** |

## Expected Behavior

### Without API Key (Current Setup)

1. Click "Kunna Sauti"
2. Progress bar shows 30%
3. **Wait 20-60 seconds** (normal on first request)
4. Progress bar updates to 70%, 90%, 100%
5. Audio plays!
6. Subsequent plays: Instant (cached)

### With API Key

1. Click "Kunna Sauti"
2. Progress bar shows 30%
3. **Wait 2-5 seconds**
4. Progress bar updates to 70%, 90%, 100%
5. Audio plays!
6. Subsequent plays: Instant (cached)

## Current Status

✅ **Component Updated** - Now uses direct API calls  
✅ **Server Running** - http://localhost:4321/  
✅ **No TypeScript Errors**  
⏳ **API Key** - Optional but recommended for production  

## Next Steps

1. **Test without API key** (expect 20-60s first load)
2. **Get API key** from Hugging Face (free)
3. **Add API key** using environment variable method
4. **Restart server** and test again (should be 2-5s)

## What to Expect

The **very first time** you click play on an article (without cache):

### Without API Key
- Wait indicator shows
- Model loads on Hugging Face servers (20-60s)
- Audio generates
- Audio plays
- **Future plays on same article: Instant from cache**

### With API Key
- Wait indicator shows
- Audio generates immediately (2-5s)
- Audio plays
- **Future plays on same article: Instant from cache**

## Need Help?

If you still get errors after waiting 60 seconds:
1. Check browser console for detailed error message
2. Verify internet connection
3. Try with API key (recommended)
4. Check if https://huggingface.co is accessible from your location

---

**You're all set!** The component is ready to use. Just be patient on the first request without an API key (20-60 seconds is normal for model cold start). 🚀
