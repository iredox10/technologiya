# Hausa Text-to-Speech (TTS) System Documentation

## Overview
This document describes the Hausa Text-to-Speech system implemented in the Technologiya website. The system allows users to listen to articles in Hausa using browser-based speech synthesis.

## Features

### 1. **Audio Playback with Waveform Visualization**
- Real-time waveform display using WaveSurfer.js
- Visual feedback of audio progress
- Interactive waveform (users can click to seek)
- Smooth animations and transitions

### 2. **Play/Pause Controls**
- Large, accessible play/pause button
- Visual feedback of current state
- Keyboard-friendly interface
- Loading spinner during audio generation

### 3. **Audio Caching System**
- Automatic caching of generated audio in localStorage
- Cache key based on: `articleId`, `speed`, and `pitch`
- Prevents regeneration of identical audio
- Automatic cache cleanup when storage is full
- Improves performance and reduces API calls

### 4. **Speed Adjustment**
- 7 speed options: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x
- Real-time playback speed change
- Cached separately per speed setting
- Accessible via dropdown menu

### 5. **Pitch Control**
- 5 pitch levels with Hausa labels:
  - Ƙasa (0.5 - Low)
  - Dan Ƙasa (0.75 - Slightly Low)
  - Matsakaici (1.0 - Normal)
  - Dan Sama (1.25 - Slightly High)
  - Sama (1.5 - High)
- Must regenerate audio when pitch changes
- Helps with accessibility and user preference

### 6. **Loading States**
- Animated spinner during audio generation
- Clear status messages in Hausa
- Disabled controls during loading
- User-friendly error messages

## Technical Implementation

### Component: `HausaTTS.tsx`

#### Props
```typescript
interface HausaTTSProps {
  text: string;      // Article HTML content
  articleId: string; // Unique identifier for caching
}
```

#### Key Technologies
- **React Hooks**: useState, useEffect, useRef
- **WaveSurfer.js v7.11.0**: Audio waveform visualization
- **Web Speech API**: Browser-native text-to-speech
- **localStorage**: Client-side audio caching
- **MediaRecorder API**: Recording synthesized speech

#### State Management
```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [duration, setDuration] = useState(0);
const [currentTime, setCurrentTime] = useState(0);
const [speed, setSpeed] = useState(1);
const [pitch, setPitch] = useState(1);
const [isReady, setIsReady] = useState(false);
```

### Audio Generation Flow

1. **Check Cache**
   - Generate cache key: `tts_${articleId}_${speed}_${pitch}`
   - Check localStorage for existing audio
   - If found, load directly into WaveSurfer

2. **Generate New Audio** (if not cached)
   - Clean HTML tags from article content
   - Limit text to 5000 characters
   - Create `SpeechSynthesisUtterance` with Hausa locale (`ha-NG`)
   - Set speed and pitch parameters
   - Try to find Hausa or Yoruba voice (regional fallback)
   - Record audio using MediaRecorder
   - Convert to Blob and create object URL

3. **Cache Audio**
   - Convert Blob to base64 string
   - Store in localStorage with cache key
   - Handle storage quota errors gracefully
   - Remove oldest TTS cache if storage full

4. **Load into WaveSurfer**
   - Load audio URL into waveform visualizer
   - Display duration and enable controls
   - Allow playback and seeking

### Caching Strategy

#### Cache Key Format
```
tts_${articleId}_${speed}_${pitch}
```

#### Example Cache Keys
- `tts_1_1_1` - Article 1, normal speed, normal pitch
- `tts_2_1.5_1` - Article 2, 1.5x speed, normal pitch
- `tts_1_1_0.75` - Article 1, normal speed, low pitch

#### Cache Management
- Stored as base64-encoded audio data
- Automatic cleanup on quota exceeded
- Removes oldest TTS entries first (FIFO)
- Separate cache per speed/pitch combination

### Browser Compatibility

#### Required APIs
- ✅ Web Speech API (speechSynthesis)
- ✅ MediaRecorder API
- ✅ AudioContext
- ✅ localStorage
- ✅ Blob and FileReader

#### Supported Browsers
- Chrome/Edge: Full support
- Safari: Full support (iOS 14.5+)
- Firefox: Full support
- Opera: Full support

#### Fallbacks
- Shows alert if Web Speech API not available
- Yoruba voice used if Hausa voice not found
- System default voice as final fallback

## User Interface

### Visual Design
- Gradient background: Blue/Indigo in light mode, Gray in dark mode
- Prominent icon and heading in Hausa
- Clean, modern controls with monospace fonts
- Responsive layout for mobile devices

### Hausa Translations
- **Saurari Labarin** - Listen to Article
- **Kunna** - Play
- **Tsayar** - Pause
- **Sauri** - Speed
- **Sautin** - Pitch (Voice)
- **Ana shirya sauti...** - Preparing audio...
- **Danna maballin kunnawa don fara** - Press play button to start
- **Lura** - Note/Attention

### Accessibility
- ARIA labels for icon buttons
- Keyboard navigation support
- High contrast colors
- Clear loading states
- Error messages in Hausa

## Usage in Article Pages

### Integration
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

### Placement
- Positioned after article header
- Before main article content
- Prominent but not intrusive
- Easy to skip for users who don't need it

## Performance Considerations

### Optimizations
1. **Lazy Loading**: Component loads only when needed
2. **Text Limiting**: Max 5000 characters prevents long generation times
3. **Caching**: Reduces redundant API calls and generation
4. **Efficient State**: Minimal re-renders with proper hooks
5. **Audio Cleanup**: Proper disposal of audio contexts

### Memory Usage
- WaveSurfer instance destroyed on unmount
- Audio blobs cleaned up properly
- localStorage cache managed efficiently
- Old cache entries removed when needed

## Future Enhancements

### Potential Features
1. **Cloud TTS Integration**: Use Azure/Google Cloud for better Hausa voices
2. **Offline Support**: Service worker for offline audio playback
3. **Playlist Mode**: Auto-play related articles
4. **Download Audio**: Allow users to download MP3 files
5. **Bookmarks**: Save playback position across sessions
6. **Keyboard Shortcuts**: Space to play/pause, arrow keys to seek
7. **Transcript Highlighting**: Highlight currently spoken text
8. **Multiple Voices**: Let users choose from available voices
9. **Background Playback**: Continue playing when scrolling
10. **Analytics**: Track TTS usage and popular articles

### Appwrite Integration (Future)
When Appwrite backend is integrated:
- Store generated audio files in Appwrite Storage
- Serve cached audio from CDN
- Track TTS usage statistics
- Pre-generate audio for popular articles
- Admin dashboard for TTS analytics

## Troubleshooting

### Common Issues

#### 1. Audio Not Playing
- **Cause**: Browser doesn't support Web Speech API
- **Solution**: Check browser compatibility, update browser

#### 2. No Hausa Voice
- **Cause**: System doesn't have Hausa voices installed
- **Solution**: System uses default voice, consider cloud TTS

#### 3. Cache Not Working
- **Cause**: localStorage disabled or full
- **Solution**: Component handles gracefully, regenerates audio

#### 4. Slow Generation
- **Cause**: Long article text (>5000 chars)
- **Solution**: Text automatically truncated to 5000 characters

#### 5. Pitch Not Changing
- **Cause**: Need to regenerate audio for pitch changes
- **Solution**: Click play again after changing pitch

## Code Maintenance

### File Locations
- Component: `/src/components/HausaTTS.tsx`
- Integration: `/src/pages/articles/[slug].astro`
- Documentation: `/TTS_DOCUMENTATION.md`

### Dependencies
```json
{
  "wavesurfer.js": "^7.11.0",
  "react": "^19.2.0",
  "react-icons": "^5.5.0"
}
```

### Testing Checklist
- [ ] Play/pause functionality works
- [ ] Waveform displays correctly
- [ ] Speed adjustment takes effect
- [ ] Pitch changes regenerate audio
- [ ] Caching works (check localStorage)
- [ ] Loading states display properly
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Dark mode styling correct
- [ ] Hausa translations accurate

## License & Credits

### Libraries Used
- **WaveSurfer.js**: BSD-3-Clause License
- **React Icons**: MIT License
- **Web Speech API**: W3C Standard (browser-native)

### Acknowledgments
Built for Technologiya - Hausa Language Tech News Platform
