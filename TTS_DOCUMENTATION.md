# Hausa Text-to-Speech (TTS) System Documentation

## Overview

The Technologiya website features an advanced **Hausa Text-to-Speech (TTS) system** powered by **Meta's MMS-TTS (Massively Multilingual Speech)** model. This system converts article text to authentic Hausa speech with professional quality.

## Technology Stack

- **TTS Engine**: Meta's MMS-TTS (`facebook/mms-tts-hau`)
- **API**: Hugging Face Inference API
- **Waveform Visualization**: WaveSurfer.js v7.11.0
- **Framework**: React 19 with TypeScript
- **Caching**: Browser localStorage for audio files

## Key Features

### 1. **Authentic Hausa Speech**
- Uses Meta's MMS-TTS model specifically trained on Hausa language
- Supports 1,100+ languages including proper Hausa pronunciation
- Professional-quality voice synthesis

### 2. **Waveform Visualizer**
- Real-time audio waveform display using WaveSurfer.js
- Visual feedback during playback
- Progress tracking with time display

### 3. **Play/Pause Controls**
- Toggle between play and pause states
- Resume from where you left off
- Automatic reset when audio finishes

### 4. **Speed Adjustment**
- Range: 0.5x to 2x playback speed
- Options: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
- Real-time speed changes without regenerating audio

### 5. **Audio Caching**
- Caches generated audio in localStorage
- Instant playback on subsequent visits
- Automatic cache management when storage is full

### 6. **Loading Indicators**
- Spinner animation during audio generation
- Progress bar showing generation status (0-100%)
- User-friendly loading messages in Hausa

### 7. **Error Handling**
- Clear error messages in Hausa
- Graceful fallback if generation fails
- Retry capability

## Component Structure

### Component: `HausaTTS.tsx`

**Location**: `/src/components/HausaTTS.tsx`

**Props**:
```typescript
interface HausaTTSProps {
  text: string;      // Article content (HTML or plain text)
  articleId: string; // Unique identifier for caching
  apiKey?: string;   // Optional Hugging Face API key
}
```

**State Variables**:
- `isPlaying`: Current playback state
- `isLoading`: Audio generation in progress
- `duration`: Total audio duration
- `currentTime`: Current playback position
- `speed`: Playback speed multiplier
- `error`: Error message if generation fails
- `audioGenerated`: Whether audio has been generated
- `progress`: Generation progress percentage (0-100)

## Technical Implementation

### 1. Hugging Face Client Initialization
```typescript
const hfClient = new HfInference(apiKey);
```

### 2. Audio Generation Flow
1. Check localStorage cache for existing audio
2. If not cached, extract clean text from HTML
3. Limit text to 1000 characters for optimal performance
4. Call MMS-TTS API with `facebook/mms-tts-hau` model
5. Convert response to ArrayBuffer
6. Cache audio as base64 in localStorage
7. Load audio into WaveSurfer for visualization

### 3. Caching Strategy
- **Cache Key**: `tts_mms_${articleId}`
- **Format**: Base64-encoded audio data
- **Storage**: Browser localStorage
- **Auto-cleanup**: Removes oldest entry if storage is full

### 4. Text Processing
- Extracts clean text from HTML using DOM manipulation
- Removes HTML tags and special characters
- Limits text length to 1000 characters (optimal for MMS-TTS)

### 5. Waveform Visualization
```typescript
WaveSurfer.create({
  container: waveformRef.current,
  waveColor: '#60a5fa',
  progressColor: '#2563eb',
  cursorColor: '#1e40af',
  barWidth: 2,
  height: 80,
});
```

## Usage

### Integration in Article Pages

The TTS component is integrated into article detail pages (`/src/pages/articles/[slug].astro`):

```astro
---
import HausaTTS from '../../components/HausaTTS';
---

<HausaTTS 
  text={article.content} 
  articleId={article.id} 
  client:load 
/>
```

### With Custom API Key (Optional)

For production use, you can provide your own Hugging Face API key:

```astro
<HausaTTS 
  text={article.content} 
  articleId={article.id}
  apiKey="your_huggingface_api_key"
  client:load 
/>
```

**Note**: The free Hugging Face Inference API works without an API key but may have rate limits. For production use, get a free API key from [huggingface.co](https://huggingface.co/settings/tokens).

### User Interface Elements

**Hausa Translations**:
- **Kunna Sauti**: Turn on audio
- **Tsai da sauti**: Stop audio  
- **Sauri**: Speed
- **Bayani**: Information
- **Ana samar da sauti...**: Generating audio...
- **Ba a iya samar da sauti**: Cannot generate audio

## Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge 90+ (Best performance)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Requirements
- Modern browser with localStorage support
- Internet connection for first-time audio generation
- ~1-2MB storage per article for cached audio

## API & Model Information

### Hugging Face MMS-TTS Model
- **Model ID**: `facebook/mms-tts-hau`
- **Languages**: 1,100+ languages including Hausa
- **Provider**: Meta AI Research
- **License**: CC-BY-NC 4.0
- **Paper**: [Scaling Speech Technology to 1,000+ Languages](https://arxiv.org/abs/2305.13516)

### Rate Limits
- **Free API**: ~1000 requests/day (without API key)
- **With API Key**: Higher limits based on account tier
- **Recommended**: Use caching to minimize API calls

## Performance Optimization

### 1. Text Length Limiting
- Maximum 1000 characters per generation
- Prevents long generation times
- Maintains quality and naturalness

### 2. Intelligent Caching
- First visit: ~2-5 seconds generation time
- Subsequent visits: Instant playback
- Cache persists across browser sessions

### 3. Progress Indicators
- Real-time progress updates (0-100%)
- User feedback during generation
- Prevents multiple simultaneous requests

## Troubleshooting

### Issue: "Ba a iya samar da sauti" Error

**Possible Causes**:
1. Network connectivity issues
2. Hugging Face API rate limit exceeded
3. Model temporarily unavailable

**Solutions**:
- Check internet connection
- Wait a few minutes and retry
- Provide API key for higher rate limits
- Check browser console for detailed error messages

### Issue: Audio Not Playing

**Possible Causes**:
1. Browser autoplay restrictions
2. Audio generation not completed
3. WaveSurfer not initialized

**Solutions**:
- Click play button after audio generation completes
- Ensure page is fully loaded
- Check browser console for errors

### Issue: Slow Audio Generation

**Possible Causes**:
1. Network speed
2. Server load on Hugging Face
3. Text length too long

**Solutions**:
- Be patient on first load (2-5 seconds normal)
- Subsequent plays use cache (instant)
- Component automatically limits text to 1000 chars

## Future Enhancements

### Planned Features
1. ✅ ~~Authentic Hausa voice synthesis~~ (Implemented with MMS-TTS)
2. 🔄 Download audio file button
3. 🔄 Multiple voice selection (male/female when available)
4. 🔄 Background playback while scrolling
5. 🔄 Keyboard shortcuts (Space to play/pause)
6. 🔄 Audio quality settings
7. 🔄 Server-side caching with Appwrite Storage
8. 🔄 Batch generation for all articles

### Technical Improvements
1. 🔄 Implement server-side audio generation
2. 🔄 CDN distribution for cached audio files
3. 🔄 Progressive audio loading for long articles
4. 🔄 Improved error recovery mechanisms
5. 🔄 Analytics for TTS usage tracking

## Development Notes

### Local Development
```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Test TTS component
# Navigate to any article page (e.g., /articles/quantum-computing-breakthrough)
```

### Testing Checklist
- [ ] Audio generation works on first click
- [ ] Cached audio loads instantly on second visit
- [ ] Play/pause toggles correctly
- [ ] Speed adjustment affects playback
- [ ] Progress bar shows during generation
- [ ] Error messages display properly
- [ ] Waveform visualization renders correctly
- [ ] Mobile responsive layout works

## Security Considerations

### API Key Management
- Never commit API keys to version control
- Use environment variables for production
- Consider server-side proxy for API calls

### Content Security Policy
Ensure CSP allows:
- `connect-src` for Hugging Face API
- `media-src` for blob URLs
- `script-src` for WaveSurfer.js

### Data Privacy
- Audio cached locally in user's browser
- No audio sent to third-party servers after initial generation
- Users control their own cache data

## Credits

- **MMS-TTS**: Meta AI Research
- **WaveSurfer.js**: katspaugh and contributors
- **Hugging Face**: Inference API platform
- **React Icons**: react-icons community

## License

This TTS implementation is part of the Technologiya project. The MMS-TTS model is licensed under CC-BY-NC 4.0 by Meta AI Research.

---

**Last Updated**: October 18, 2025  
**Component Version**: 2.0 (MMS-TTS Implementation)
