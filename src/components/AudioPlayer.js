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
  const audioUrl = "/audio/warm-memories.m4a";

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

      {/* Floating Audio Player Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={togglePlay}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[9999] flex items-center gap-2.5 sm:gap-3.5 bg-white/90 sm:bg-white/60 backdrop-blur-xl border border-brand-gold/25 sm:border-white/30 hover:border-brand-gold/50 px-3 py-2 sm:px-4.5 sm:py-2.5 rounded-full shadow-[0_8px_30px_rgba(20,83,45,0.14)] cursor-pointer group select-none transition-all duration-300 gpu-accelerated max-w-[calc(100vw-32px)]"
      >
        {/* Animated Equalizer Waves when playing */}
        <div className="absolute -top-3 left-5 sm:left-6 flex items-end gap-0.5 h-3">
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

        {/* 1. Rotating Vinyl Record */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
          <motion.div
            animate={isPlaying && !shouldReduce ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
            className={`w-full h-full rounded-full bg-[#111e16] border-2 border-brand-gold/40 flex items-center justify-center relative shadow-[0_2px_8px_rgba(0,0,0,0.25)] ${
              isPlaying ? 'ring-2 ring-brand-gold/20' : ''
            }`}
          >
            {/* Vinyl record grooved texture lines */}
            <div className="absolute inset-1 rounded-full border border-white/10 opacity-40 pointer-events-none" />
            
            {/* Center Album Label */}
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-brand-gold/85 flex items-center justify-center border border-[#111e16]">
              <Music size={7} className="text-[#111e16] opacity-90" />
            </div>
          </motion.div>

          {/* Player needle icon */}
          <motion.div
            animate={isPlaying ? { rotate: 0 } : { rotate: -25 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "top right" }}
            className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none z-10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-brand-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              <path d="M19,3 L15,12 L12,14 M12,14 L8,18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        {/* 2. Text Branding */}
        <div className="flex flex-col text-left select-none">
          <span className="font-serif font-extrabold text-[10px] sm:text-[11px] tracking-wider text-brand-green-dark leading-tight group-hover:text-brand-gold transition-colors duration-200">
            {isPlaying ? 'MEMUTAR MUSIK' : 'SUARA PENGABDIAN'}
          </span>
          <span className="font-sans text-[7px] sm:text-[8px] font-bold text-brand-green-dark/50 tracking-widest uppercase leading-none mt-0.5">
            INSTRUMEN LOFI RIAU
          </span>
        </div>

        {/* 3. Control Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-0.5">
          {/* Play/Pause state mini indicator */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-green-dark/5 group-hover:bg-brand-gold/15 flex items-center justify-center text-brand-green-dark group-hover:text-brand-gold-dark transition-all duration-300">
            {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} className="ml-0.5" fill="currentColor" />}
          </div>

          {/* Volume Mute/Unmute toggle button */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-brand-green-dark/10 hover:border-brand-gold/40 flex items-center justify-center text-brand-green-dark/70 hover:text-brand-gold bg-white/80 hover:bg-white transition-all duration-200 cursor-pointer"
          >
            {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
          </button>
        </div>

        {/* 4. Tooltip info on hover */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2.5 bg-[#111e16] text-white py-1.5 px-3 rounded-xl text-[9px] font-sans font-medium tracking-wide shadow-lg border border-white/10 pointer-events-none select-none z-50 flex items-center gap-2 whitespace-nowrap hidden sm:flex"
            >
              <Music size={10} className="text-brand-gold" />
              <span>LesFM — <strong>In The Forest</strong></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AudioPlayer;
