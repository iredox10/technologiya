import { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiVolume2, FiLoader } from 'react-icons/fi';
import WaveSurfer from 'wavesurfer.js';

interface HausaTTSProps {
  text: string;
  articleId: string;
}

export default function HausaTTS({ text, articleId }: HausaTTSProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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
      responsive: true,
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on('ready', () => {
      setIsReady(true);
      setDuration(wavesurfer.getDuration());
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  // Get cached audio or generate new one
  const getCachedAudio = async (): Promise<string | null> => {
    const cacheKey = `tts_${articleId}_${speed}_${pitch}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  };

  // Cache audio data
  const cacheAudio = async (audioData: string) => {
    const cacheKey = `tts_${articleId}_${speed}_${pitch}`;
    try {
      localStorage.setItem(cacheKey, audioData);
    } catch (error) {
      console.error('Error caching audio:', error);
      // If localStorage is full, try to clear old TTS entries
      try {
        const keys = Object.keys(localStorage);
        const ttsKeys = keys.filter(k => k.startsWith('tts_'));
        if (ttsKeys.length > 0) {
          localStorage.removeItem(ttsKeys[0]); // Remove oldest
          localStorage.setItem(cacheKey, audioData);
        }
      } catch (e) {
        console.error('Could not clear cache:', e);
      }
    }
  };

  // Generate speech using Web Speech API
  const generateSpeech = async () => {
    setIsLoading(true);

    try {
      // Check cache first
      const cached = await getCachedAudio();
      if (cached && wavesurferRef.current) {
        await wavesurferRef.current.load(cached);
        setIsLoading(false);
        return;
      }

      // Generate new speech
      if (!('speechSynthesis' in window)) {
        alert('Gafarara, wannan browser ba ya goyan bayan karanta rubutu.');
        setIsLoading(false);
        return;
      }

      // Clean text for speech (remove HTML tags)
      const cleanText = text
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 5000); // Limit to 5000 characters

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ha-NG'; // Hausa language code
      utterance.rate = speed;
      utterance.pitch = pitch;

      // Try to find a Hausa voice or fallback to default
      const voices = window.speechSynthesis.getVoices();
      const hausaVoice = voices.find(voice => 
        voice.lang.startsWith('ha') || 
        voice.lang.startsWith('yo') // Yoruba as fallback (similar region)
      );
      
      if (hausaVoice) {
        utterance.voice = hausaVoice;
      }

      utteranceRef.current = utterance;

      // Create audio context for recording
      audioContextRef.current = new AudioContext();
      const destination = audioContextRef.current.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        // Cache the audio
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          cacheAudio(base64);
        };
        reader.readAsDataURL(blob);

        // Load into wavesurfer
        if (wavesurferRef.current) {
          await wavesurferRef.current.load(audioUrl);
        }
        
        setIsLoading(false);
      };

      utterance.onend = () => {
        mediaRecorder.stop();
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setIsLoading(false);
        alert('An kasa samar da sauti. A sake gwadawa.');
      };

      mediaRecorder.start();
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error generating speech:', error);
      setIsLoading(false);
      alert('An samu matsala wajen samar da sauti.');
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!wavesurferRef.current || !isReady) {
      generateSpeech();
      return;
    }

    if (isPlaying) {
      wavesurferRef.current.pause();
      setIsPlaying(false);
    } else {
      wavesurferRef.current.play();
      setIsPlaying(true);
    }
  };

  // Update speed
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (wavesurferRef.current && isReady) {
      wavesurferRef.current.setPlaybackRate(newSpeed);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
          <FiVolume2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-mono font-bold text-gray-900 dark:text-gray-100 tracking-wide">
            Saurari Labarin
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Kunna sauti don sauraron wannan labari
          </p>
        </div>
      </div>

      {/* Waveform Visualizer */}
      <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div ref={waveformRef} className="w-full" />
        
        {/* Time Display */}
        {isReady && (
          <div className="flex justify-between items-center mt-2 text-xs font-mono text-gray-600 dark:text-gray-400 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 font-mono text-gray-700 dark:text-gray-300">
              Ana shirya sauti...
            </span>
          </div>
        )}

        {/* Empty State */}
        {!isReady && !isLoading && (
          <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <p className="font-mono text-sm">
              Danna maballin kunnawa don fara
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-mono font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <FiPause className="w-5 h-5" />
          ) : (
            <FiPlay className="w-5 h-5" />
          )}
          <span>{isPlaying ? 'Tsayar' : 'Kunna'}</span>
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-sm text-gray-700 dark:text-gray-300 font-medium">
            Sauri:
          </label>
          <select
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            disabled={isLoading}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x</option>
          </select>
        </div>

        {/* Pitch Control */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-sm text-gray-700 dark:text-gray-300 font-medium">
            Sautin:
          </label>
          <select
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            disabled={isLoading || isReady}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="0.5">Ƙasa</option>
            <option value="0.75">Dan Ƙasa</option>
            <option value="1">Matsakaici</option>
            <option value="1.25">Dan Sama</option>
            <option value="1.5">Sama</option>
          </select>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-100 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-gray-700">
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong className="font-mono">Lura:</strong> Ana amfani da fasahar karanta rubutu ta zamani. 
          Sauti zai ajiye a memory don saurin amfani nan gaba.
        </p>
      </div>
    </div>
  );
}
