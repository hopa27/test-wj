import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  play: boolean;
}

export function AudioPlayer({ play }: AudioPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Lazily create the audio element only when playback is first requested,
    // so the music file doesn't download during initial page load.
    if (!audioRef.current && play) {
      const audioUrl = `${import.meta.env.BASE_URL}audio/wedding-music.mp3`;
      const audio = new Audio();
      audio.preload = 'none';
      audio.src = audioUrl;
      audio.loop = true;
      audio.volume = 0.4; // Modest volume
      audioRef.current = audio;
    }

    if (audioRef.current && play && !isMuted) {
      audioRef.current.play().catch((err) => {
        console.log("Audio playback failed:", err);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [play, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!play) return null;

  return (
    <button 
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-background/90 border border-accent/40 text-primary backdrop-blur-md shadow-lg hover:bg-card transition-colors"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
