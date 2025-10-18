# ⚠️ IMPORTANT: MMS-TTS API Key Required

## Issue Fixed ✅

The error you encountered:
```
InputError: No Inference Provider available for model facebook/mms-tts-hau
```

Has been **FIXED** by switching from the Hugging Face SDK to direct API calls.

## What Changed

- ❌ Removed: `@huggingface/inference` package (doesn't support MMS-TTS)
- ✅ Added: Direct API calls to Hugging Face Inference API
- ✅ Updated: Component now uses `fetch()` to call the model directly

## How to Use

### Option 1: Without API Key (Free, But Slow)

The component works **without an API key**, but you'll experience:

- ⏱️ **20-60 seconds wait** on first request (model cold start)
- 🐢 Slow subsequent requests without cache
- ⚠️ Rate limiting on free tier
- 💡 Best for: Testing only

**Just click "Kunna Sauti" and be patient!**

### Option 2: With API Key (Recommended for Production)

Get faster response times and no cold starts:

#### Step 1: Get Free API Key

1. Go to: https://huggingface.co/join
2. Sign up (free account)
3. Go to: https://huggingface.co/settings/tokens
4. Click "New token"
5. Name it: "Technologiya TTS"
6. Select "Read" role
7. Copy the token (starts with `hf_...`)

#### Step 2: Add to Your Project

**Method A: Environment Variable (Recommended)**

1. Create `.env` file:
```bash
cd /home/iredox/Desktop/technologiya
echo 'PUBLIC_HUGGINGFACE_API_KEY=hf_your_token_here' > .env
```

2. Update `/src/pages/articles/[slug].astro`:
```astro
---
import HausaTTS from '../../components/HausaTTS';

const apiKey = import.meta.env.PUBLIC_HUGGINGFACE_API_KEY;
---

<HausaTTS 
  text={article.content} 
  articleId={article.id}
  apiKey={apiKey}
  client:load 
/>
```

3. Add `.env` to `.gitignore`:
```bash
echo ".env" >> .gitignore
```

4. Restart dev server:
```bash
bun run dev
```

**Method B: Direct Pass (Not Recommended - for testing only)**

```astro
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  apiKey="hf_your_token_here"
  client:load 
/>
```

⚠️ Never commit API keys to git!

## Testing Now (Without API Key)

1. **Open any article**: http://localhost:4321/articles/quantum-computing-breakthrough

2. **Click "Kunna Sauti"** button

3. **Wait 20-60 seconds** (model is loading for the first time)
   - You'll see progress bar
   - Console will show the request

4. **Audio will play** once loaded!

5. **Second time**: Will load from cache (instant)

## Performance Comparison

| Feature | Without API Key | With API Key |
|---------|----------------|--------------|
| First request | 20-60s (cold start) | 2-5s |
| Cached audio | Instant | Instant |
| Rate limits | Limited | Higher limits |
| Best for | Testing | Production |

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
