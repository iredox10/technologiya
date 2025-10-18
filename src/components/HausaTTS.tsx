import { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiVolume2, FiLoader, FiAlertCircle } from 'react-icons/fi';
import WaveSurfer from 'wavesurfer.js';

interface HausaTTSProps {
  text: string;
  articleId: string;
  apiKey?: string; // Optional: user can provide their own HF API key
}

export default function HausaTTS({ text, articleId, apiKey }: HausaTTSProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [progress, setProgress] = useState(0);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioBufferRef = useRef<ArrayBuffer | null>(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#60a5fa',
      progressColor: '#2563eb',
      cursorColor: '#1e40af',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      barGap: 2,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on('ready', () => {
      setDuration(wavesurfer.getDuration());
      setIsLoading(false);
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    wavesurfer.on('play', () => {
      setIsPlaying(true);
    });

    wavesurfer.on('pause', () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  // Extract clean text from HTML
  const extractTextFromHTML = (html: string): string => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // Get cached audio from localStorage
  const getCachedAudio = (): ArrayBuffer | null => {
    try {
      const cacheKey = `tts_mms_${articleId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        // Convert base64 back to ArrayBuffer
        const binaryString = atob(cached);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  };

  // Cache audio data to localStorage
  const cacheAudio = (audioBuffer: ArrayBuffer) => {
    const cacheKey = `tts_mms_${articleId}`;
    try {
      // Convert ArrayBuffer to base64
      const bytes = new Uint8Array(audioBuffer);
      const binary = String.fromCharCode(...bytes);
      const base64 = btoa(binary);
      localStorage.setItem(cacheKey, base64);
    } catch (error) {
      console.error('Error caching audio:', error);
      // If localStorage is full, clear old TTS entries
      try {
        const keys = Object.keys(localStorage);
        const ttsKeys = keys.filter(k => k.startsWith('tts_'));
        if (ttsKeys.length > 0) {
          localStorage.removeItem(ttsKeys[0]);
          const bytes = new Uint8Array(audioBuffer);
          const binary = String.fromCharCode(...bytes);
          const base64 = btoa(binary);
          localStorage.setItem(cacheKey, base64);
        }
      } catch (e) {
        console.error('Could not clear cache:', e);
      }
    }
  };

  // Generate Hausa speech using MMS-TTS
  const generateSpeech = async () => {
    if (!wavesurferRef.current) return;

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Check cache first
      const cached = getCachedAudio();
      if (cached) {
        audioBufferRef.current = cached;
        const blob = new Blob([cached], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        await wavesurferRef.current.load(url);
        setAudioGenerated(true);
        setIsLoading(false);
        return;
      }

      // Extract clean text
      const cleanText = extractTextFromHTML(text);
      
      // Limit text length (MMS-TTS works best with shorter texts)
      const maxLength = 500;
      const textToSpeak = cleanText.length > maxLength 
        ? cleanText.substring(0, maxLength) + '...'
        : cleanText;

      setProgress(30);

      // Call Hugging Face Inference API directly
      const API_URL = 'https://api-inference.huggingface.co/models/facebook/mms-tts-hau';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add API key if provided
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inputs: textToSpeak,
        }),
      });

      setProgress(70);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      // Convert response to ArrayBuffer
      const audioBuffer = await response.arrayBuffer();
      audioBufferRef.current = audioBuffer;

      // Cache the audio
      cacheAudio(audioBuffer);

      setProgress(90);

      // Load audio into WaveSurfer
      const blob = new Blob([audioBuffer], { type: 'audio/flac' });
      const url = URL.createObjectURL(blob);
      await wavesurferRef.current.load(url);

      setProgress(100);
      setAudioGenerated(true);
      setIsLoading(false);

    } catch (err) {
      console.error('Error generating speech:', err);
      setError('Ba a iya samar da sauti. Da fatan za a sake gwadawa. ' + (err instanceof Error ? err.message : ''));
      setIsLoading(false);
      setProgress(0);
    }
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (!wavesurferRef.current) return;

    if (!audioGenerated) {
      await generateSpeech();
      // Start playing after generation
      setTimeout(() => {
        wavesurferRef.current?.play();
      }, 100);
    } else {
      wavesurferRef.current.playPause();
    }
  };

  // Handle speed change
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(newSpeed);
    }
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FiVolume2 className="text-2xl text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Fira Code', monospace" }}>
              Kunna Sauti
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Meta MMS-TTS (Hausa)
            </p>
          </div>
        </div>
        
        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sauri:</span>
          <select
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            disabled={isLoading}
            className="px-3 py-1 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <FiAlertCircle className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Waveform */}
      <div ref={waveformRef} className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700" />

      {/* Progress Bar (during generation) */}
      {isLoading && progress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
            Ana samar da sauti... {progress}%
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
          aria-label={isPlaying ? 'Tsai da sauti' : 'Kunna sauti'}
        >
          {isLoading ? (
            <FiLoader className="text-xl animate-spin" />
          ) : isPlaying ? (
            <FiPause className="text-xl" />
          ) : (
            <FiPlay className="text-xl ml-0.5" />
          )}
        </button>

        {/* Time Display */}
        <div className="flex-1">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Bayani:</strong> Ana amfani da Meta's MMS-TTS don samar da sauti na Hausa. 
          Sauti na farko yana ɗaukar ɗan lokaci kaɗan.
          {!audioGenerated && ' Danna maɓallin kunnawa don farawa.'}
        </p>
      </div>
    </div>
  );
}
