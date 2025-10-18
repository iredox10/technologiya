# 🚨 URGENT: Add API Key to Fix TTS

## The Problem

You're getting this error:
```
Error: API returned 401: {"error":"Invalid username or password."}
```

**This means the TTS component needs a Hugging Face API key to work.**

---

## Quick Fix (5 Minutes)

### Step 1: Get Free API Key (2 minutes)

1. Open: https://huggingface.co/join
2. Sign up (free - use Google/GitHub for quick signup)
3. Go to: https://huggingface.co/settings/tokens
4. Click "New token"
5. Name: "Technologiya TTS"
6. Role: "Read" (default)
7. Click "Generate a token"
8. **COPY the token** (starts with `hf_...`)

### Step 2: Add API Key (3 minutes)

#### Option A: Environment Variable (Best Practice)

**1. Create `.env` file in your project root:**

```bash
cd /home/iredox/Desktop/technologiya
nano .env
```

**2. Add this line (replace with your actual token):**

```
PUBLIC_HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

**3. Save and exit** (Ctrl+X, then Y, then Enter)

**4. Add `.env` to `.gitignore`:**

```bash
echo ".env" >> .gitignore
```

**5. Update `/src/pages/articles/[slug].astro`:**

Find line 163-167:
```astro
<!-- Text-to-Speech Component -->
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  client:load 
/>
```

Change to:
```astro
<!-- Text-to-Speech Component -->
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  apiKey={import.meta.env.PUBLIC_HUGGINGFACE_API_KEY}
  client:load 
/>
```

**6. Restart dev server:**

Press `Ctrl+C` to stop the current server, then:
```bash
bun run dev
```

---

#### Option B: Quick Test (Faster but less secure)

**1. Update `/src/pages/articles/[slug].astro`:**

Find line 163-167:
```astro
<!-- Text-to-Speech Component -->
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  client:load 
/>
```

Change to (replace with your actual token):
```astro
<!-- Text-to-Speech Component -->
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  apiKey="hf_your_actual_token_here"
  client:load 
/>
```

**2. Restart dev server:**

Press `Ctrl+C` to stop the current server, then:
```bash
bun run dev
```

⚠️ **WARNING**: Don't commit this file to git! Use Option A for production.

---

### Step 3: Test It

1. Go to: http://localhost:4321/articles/quantum-computing-breakthrough
2. Click "Kunna Sauti" button
3. Wait 2-5 seconds
4. Enjoy authentic Hausa speech! 🎉

---

## Why This Happened

Hugging Face changed their API policy. Models now require authentication for access. The good news:

✅ API keys are **100% FREE**  
✅ Takes only 2 minutes to get  
✅ Generous rate limits for free tier  
✅ Once audio is cached, it loads instantly  

---

## Need Help?

If you still get errors after adding the API key:

1. **Double-check your API key**:
   - Must start with `hf_`
   - Copy the entire token
   - No extra spaces

2. **Verify environment variable** (if using Option A):
   ```bash
   cat .env
   ```
   Should show: `PUBLIC_HUGGINGFACE_API_KEY=hf_...`

3. **Restart dev server** after any changes:
   ```bash
   # Stop server (Ctrl+C)
   bun run dev
   ```

4. **Check browser console** for detailed errors

---

## What You Get

Once the API key is added:

- ✅ Authentic Hausa pronunciation
- ✅ 2-5 seconds first generation
- ✅ Instant replay from cache
- ✅ Speed control (0.5x - 2x)
- ✅ Waveform visualization
- ✅ All 100% FREE

**Get your API key now and start using authentic Hausa TTS!** 🚀
