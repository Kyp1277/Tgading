"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

const AudioPlayer = () => {
  const shouldReduce = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef(null);

  // Menggunakan lagu instrumen yang di-host secara lokal (bebas CORS & Hotlinking block)
  const audioUrl = "/audio/warm-memories.mp3";

  useEffect(() => {
    // Set volume awal agar tidak terlalu keras (20%)
    if (audioRef.current) {
      audioRef.current.volume = 0.20;
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Audio play blocked by browser autoplay policy:", err);
        // Tampilkan info jika autoplay diblokir browser
      });
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation(); // Mencegah terpicunya play/pause saat klik ikon volume
    if (!audioRef.current) return;
    
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        loop 
        preload="auto"
      />

      {/* Floating Audio Player Widget (Bottom-Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={togglePlay}
        className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3.5 bg-white/35 backdrop-blur-xl border border-white/25 hover:border-brand-gold/45 px-4.5 py-3 rounded-full shadow-[0_12px_40px_rgba(20,83,45,0.12)] cursor-pointer group select-none transition-all duration-300 hover:shadow-[0_15px_45px_rgba(201,162,39,0.18)]"
      >
        {/* Animated Equalizer Waves when playing */}
        <div className="absolute -top-3.5 left-6 flex items-end gap-0.5 h-3">
          {isPlaying && !isMuted && [1, 2, 3, 4].map((bar) => (
            <motion.span
              key={bar}
              animate={{ 
                height: ["3px", bar === 1 ? "12px" : bar === 2 ? "9px" : bar === 3 ? "14px" : "10px", "3px"] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: bar === 1 ? 0.8 : bar === 2 ? 0.6 : bar === 3 ? 1.0 : 0.7,
                ease: "easeInOut"
              }}
              className="w-[2.5px] bg-brand-gold rounded-full"
            />
          ))}
        </div>

        {/* 1. Rotating Vinyl Record (Visual Mockup) */}
        <div className="relative w-10 h-10 shrink-0">
          <motion.div
            animate={isPlaying && !shouldReduce ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
            className={`w-full h-full rounded-full bg-[#111e16] border-2 border-brand-gold/40 flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${
              isPlaying ? 'ring-2 ring-brand-gold/15' : ''
            }`}
          >
            {/* Vinyl record grooved texture lines */}
            <div className="absolute inset-1 rounded-full border border-white/10 opacity-40 pointer-events-none" />
            <div className="absolute inset-2.5 rounded-full border border-white/5 opacity-30 pointer-events-none" />
            
            {/* Center Album Label */}
            <div className="w-4 h-4 rounded-full bg-brand-gold/85 flex items-center justify-center border border-[#111e16]">
              <Music size={8} className="text-[#111e16] opacity-90" />
            </div>
          </motion.div>

          {/* Player needle icon overlays the vinyl when active */}
          <motion.div
            animate={isPlaying ? { rotate: 0 } : { rotate: -25 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "top right" }}
            className="absolute -top-1 -right-1.5 w-4 h-4 pointer-events-none z-10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-brand-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <path d="M19,3 L15,12 L12,14 M12,14 L8,18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        {/* 2. Text Branding / Dynamic Play State */}
        <div className="flex flex-col text-left select-none">
          <span className="font-serif font-extrabold text-[11px] tracking-wider text-brand-green-dark leading-tight group-hover:text-brand-gold transition-colors duration-200">
            {isPlaying ? 'MEMUTAR MUSIK' : 'SUARA PENGABDIAN'}
          </span>
          <span className="font-sans text-[8px] font-bold text-brand-green-dark/45 tracking-widest uppercase leading-none mt-0.5">
            INSTRUMEN LOFI RIAU
          </span>
        </div>

        {/* 3. Control Actions (Play/Pause indicator and volume mute toggle) */}
        <div className="flex items-center gap-2 pl-1">
          {/* Play/Pause state mini indicator */}
          <div className="w-6 h-6 rounded-full bg-brand-green-dark/5 group-hover:bg-brand-gold/15 flex items-center justify-center text-brand-green-dark group-hover:text-brand-gold-dark transition-all duration-300">
            {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} className="ml-0.5" fill="currentColor" />}
          </div>

          {/* Volume Mute/Unmute toggle button */}
          <button
            onClick={toggleMute}
            className="w-6 h-6 rounded-full border border-brand-green-dark/10 hover:border-brand-gold/40 flex items-center justify-center text-brand-green-dark/70 hover:text-brand-gold bg-white/60 hover:bg-white transition-all duration-200 cursor-pointer"
          >
            {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
          </button>
        </div>

        {/* 4. Tooltip info on hover */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full left-0 mb-3 bg-[#111e16] text-white py-2 px-3.5 rounded-xl text-[9px] font-sans font-medium tracking-wide shadow-lg border border-white/5 pointer-events-none select-none z-50 flex items-center gap-2 whitespace-nowrap"
            >
              <Music size={10} className="text-brand-gold" />
              <span>SoundHelix — <strong>Chill Instrumental</strong></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AudioPlayer;
