"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const BackgroundDecor = ({ variant = 'home' }) => {
  const shouldReduce = useReducedMotion();

  // Floating accent configurations depending on page variant
  const getAccents = () => {
    switch (variant) {
      case 'home':
        return [
          { top: '22%', left: '4%', size: 'w-3 h-3', color: 'bg-brand-gold opacity-30', delay: 0 },
          { top: '65%', right: '12%', size: 'w-4 h-4', color: 'bg-brand-green/30 opacity-40', delay: 1.5 },
          { top: '45%', right: '5%', size: 'w-2.5 h-2.5', color: 'bg-brand-gold opacity-30', delay: 0.8 },
          { top: '80%', left: '8%', size: 'w-3.5 h-3.5', color: 'bg-brand-gold/55 opacity-40', delay: 2.2 },
        ];
      case 'profile':
        return [
          { top: '15%', right: '9%', size: 'w-3 h-3', color: 'bg-brand-gold opacity-30', delay: 0.5 },
          { top: '45%', left: '5%', size: 'w-4 h-4', color: 'bg-brand-green/30 opacity-40', delay: 1.8 },
          { top: '75%', right: '7%', size: 'w-2.5 h-2.5', color: 'bg-brand-gold opacity-30', delay: 1.2 },
          { top: '85%', left: '10%', size: 'w-4 h-4', color: 'bg-brand-green/25 opacity-30', delay: 2.5 },
        ];
      case 'struktur':
        return [
          { top: '20%', left: '6%', size: 'w-3.5 h-3.5', color: 'bg-brand-gold/45 opacity-35', delay: 0.2 },
          { top: '50%', right: '7%', size: 'w-2.5 h-2.5', color: 'bg-brand-gold opacity-30', delay: 1.4 },
          { top: '80%', left: '8%', size: 'w-3 h-3', color: 'bg-brand-gold opacity-30', delay: 0.9 },
          { top: '90%', right: '9%', size: 'w-4 h-4', color: 'bg-brand-green/30 opacity-40', delay: 2.1 },
        ];
      case 'anggota':
        return [
          { top: '15%', right: '8%', size: 'w-2.5 h-2.5', color: 'bg-brand-gold opacity-30', delay: 0.4 },
          { top: '35%', left: '5%', size: 'w-4 h-4', color: 'bg-brand-green/25 opacity-30', delay: 1.7 },
          { top: '65%', right: '7%', size: 'w-3.5 h-3.5', color: 'bg-brand-gold/45 opacity-35', delay: 1.1 },
          { top: '85%', left: '9%', size: 'w-3 h-3', color: 'bg-brand-gold opacity-30', delay: 2.4 },
        ];
      case 'proker':
        return [
          { top: '20%', left: '6%', size: 'w-2.5 h-2.5', color: 'bg-brand-gold opacity-30', delay: 0.3 },
          { top: '40%', right: '8%', size: 'w-4 h-4', color: 'bg-brand-green/25 opacity-30', delay: 1.6 },
          { top: '70%', left: '5%', size: 'w-3 h-3', color: 'bg-brand-gold opacity-30', delay: 1.0 },
          { top: '90%', right: '10%', size: 'w-3.5 h-3.5', color: 'bg-brand-gold/45 opacity-35', delay: 2.3 },
        ];
      case 'galeri':
        return [
          { top: '15%', right: '6%', size: 'w-4 h-4', color: 'bg-brand-green/35 opacity-40', delay: 0.6 },
          { top: '45%', left: '8%', size: 'w-2.5 h-2.5', color: 'bg-brand-gold opacity-30', delay: 1.9 },
          { top: '70%', right: '7%', size: 'w-3 h-3', color: 'bg-brand-gold opacity-30', delay: 1.3 },
          { top: '85%', left: '9%', size: 'w-3.5 h-3.5', color: 'bg-brand-gold/45 opacity-35', delay: 2.6 },
        ];
      default:
        return [];
    }
  };

  const accents = getAccents();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      
      {/* 1. Dotted Canvas Pattern Overlay (opacity 4-5%) */}
      <div 
        style={{ 
          backgroundImage: 'radial-gradient(rgba(20, 83, 45, 0.06) 1.2px, transparent 1.2px)', 
          backgroundSize: '28px 28px' 
        }} 
        className="absolute inset-0 w-full h-full opacity-100" 
      />

      {/* 2. Page-specific Radial Glow Blobs (More prominent opacity 10-12%) */}
      {variant === 'home' && (
        <>
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-brand-gold/12 blur-[100px] rounded-full" />
          <div className="absolute bottom-40 right-[10%] w-[450px] h-[450px] bg-brand-green/10 blur-[130px] rounded-full" />
        </>
      )}
      {variant === 'profile' && (
        <>
          <div className="absolute top-40 right-[8%] w-96 h-96 bg-brand-green/10 blur-[110px] rounded-full" />
          <div className="absolute bottom-20 left-[8%] w-96 h-96 bg-brand-gold/10 blur-[110px] rounded-full" />
        </>
      )}
      {variant === 'struktur' && (
        <>
          <div className="absolute top-20 left-[15%] w-[450px] h-[450px] bg-brand-gold/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-10 right-[15%] w-96 h-96 bg-brand-green/10 blur-[100px] rounded-full" />
        </>
      )}
      {variant === 'anggota' && (
        <>
          <div className="absolute top-60 right-[10%] w-96 h-96 bg-brand-green/10 blur-[110px] rounded-full" />
          <div className="absolute bottom-40 left-[10%] w-96 h-96 bg-brand-gold/12 blur-[120px] rounded-full" />
        </>
      )}
      {variant === 'proker' && (
        <>
          <div className="absolute top-30 left-[10%] w-[450px] h-[450px] bg-brand-gold/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-60 right-[10%] w-96 h-96 bg-brand-green/9 blur-[100px] rounded-full" />
        </>
      )}
      {variant === 'galeri' && (
        <>
          <div className="absolute top-40 right-[12%] w-96 h-96 bg-brand-green/10 blur-[110px] rounded-full" />
          <div className="absolute bottom-30 left-[12%] w-96 h-96 bg-brand-gold/12 blur-[110px] rounded-full" />
        </>
      )}

      {/* 3. Reusable Big Silhouette Elements (Leaf left, Wave right/bottom - Opacity 8% to make it visible!) */}
      {/* Left Palm Leaf Silhouette */}
      <div 
        className={`absolute w-80 h-80 md:w-[480px] md:h-[480px] text-brand-green opacity-[0.08] pointer-events-none transition-all duration-700 ${
          variant === 'home' ? 'top-10 -left-16 rotate-12' :
          variant === 'profile' ? 'top-60 -left-20 -rotate-12' :
          variant === 'struktur' ? 'top-32 -left-12 rotate-45' :
          variant === 'anggota' ? 'top-[35%] -left-20 rotate-[60deg]' :
          variant === 'proker' ? 'top-[20%] -left-16 rotate-[15deg]' :
          'top-48 -left-12 rotate-12' // galeri
        }`}
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M10,80 Q30,60 60,70 Q40,50 50,20 Q60,40 80,40 Q65,60 85,80 Q55,75 10,80 Z" />
        </svg>
      </div>

      {/* Right Wave / Water Silhouette */}
      <div 
        className={`absolute w-72 h-72 md:w-[400px] md:h-[400px] text-brand-gold opacity-[0.08] pointer-events-none transition-all duration-700 ${
          variant === 'home' ? 'top-[45%] -right-12 -rotate-12' :
          variant === 'profile' ? 'top-[25%] -right-8 rotate-[40deg]' :
          variant === 'struktur' ? 'bottom-32 -right-16 -rotate-45' :
          variant === 'anggota' ? 'top-[15%] -right-12 rotate-[15deg]' :
          variant === 'proker' ? 'bottom-[25%] -right-8 rotate-12' :
          'bottom-12 -right-12 -rotate-12' // galeri
        }`}
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M10,50 C30,40 40,60 60,50 C80,40 90,60 100,50 L100,60 C90,70 80,50 60,60 C40,70 30,50 10,60 Z" />
        </svg>
      </div>

      {/* Second Palm Leaf silhouette in opposite side to avoid blank spaces */}
      <div 
        className={`absolute w-72 h-72 md:w-[400px] md:h-[400px] text-brand-green opacity-[0.06] pointer-events-none transition-all duration-700 ${
          variant === 'home' ? 'bottom-16 right-6 rotate-[120deg]' :
          variant === 'profile' ? 'bottom-32 right-8 rotate-[160deg]' :
          variant === 'struktur' ? 'top-16 right-10 rotate-[130deg]' :
          variant === 'anggota' ? 'bottom-20 right-6 rotate-[200deg]' :
          variant === 'proker' ? 'top-8 right-8 rotate-[110deg]' :
          'top-16 right-8 rotate-[140deg]' // galeri
        }`}
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M10,80 Q30,60 60,70 Q40,50 50,20 Q60,40 80,40 Q65,60 85,80 Q55,75 10,80 Z" />
        </svg>
      </div>

      {/* 4. Desktop-only Elegant Margins Watermarks (left-[3%] / right-[3%]) */}
      <div className="hidden xl:block absolute top-[25%] left-[2.5%] w-24 h-48 opacity-[0.14] text-brand-green">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col gap-8 items-center"
        >
          {/* Outline Leaf */}
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-14 h-14">
            <path d="M50,90 Q40,60 50,10 Q60,60 50,90 M50,50 L20,40 M50,60 L25,52 M50,40 L15,28 M50,50 L80,40 M50,60 L75,52 M50,40 L85,28" />
          </svg>
          <div className="w-2 h-2 rounded-full bg-brand-gold" />
          {/* Outline wave line */}
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-14 h-6">
            <path d="M10,50 C30,30 40,70 60,50 C80,30 90,70 100,50" />
          </svg>
        </motion.div>
      </div>

      <div className="hidden xl:block absolute top-[38%] right-[2.5%] w-24 h-48 opacity-[0.16] text-brand-gold">
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="flex flex-col gap-8 items-center"
        >
          {/* Outline Turtle */}
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-14 h-14">
            <ellipse cx="50" cy="50" rx="30" ry="35" />
            <path d="M 50,15 C 50,5 40,5 50,0 C 60,5 50,5 50,15" />
            <path d="M 20,40 C 5,35 -5,15 5,5" />
            <path d="M 80,40 C 95,35 105,15 95,5" />
          </svg>
          <div className="w-2 h-2 rounded-full bg-brand-green" />
          {/* Outline Leaf */}
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-14 h-14">
            <path d="M50,90 Q40,60 50,10 Q60,60 50,90 M50,50 L20,40 M50,60 L25,52 M50,40 L15,28 M50,50 L80,40 M50,60 L75,52 M50,40 L85,28" />
          </svg>
        </motion.div>
      </div>

      {/* 5. Floating Accents (Dots & Outline Icons) with infinite floats */}
      {!shouldReduce && accents.map((accent, idx) => (
        <motion.div
          key={idx}
          style={{
            position: 'absolute',
            top: accent.top,
            left: accent.left,
            right: accent.right,
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 5 + (idx % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: accent.delay
          }}
          className={`${accent.size} ${accent.color} rounded-full`}
        />
      ))}

      {/* Outline Turtle floating watermark (Lower page section) */}
      {!shouldReduce && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: variant === 'struktur' || variant === 'proker' ? '4%' : '88%',
          }}
          animate={{ y: [0, 8, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 text-brand-gold opacity-[0.18] hidden md:block"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
            <ellipse cx="50" cy="50" rx="30" ry="35" />
            <path d="M 50,15 C 50,5 40,5 50,0 C 60,5 50,5 50,15" />
            <path d="M 20,40 C 5,35 -5,15 5,5" />
            <path d="M 80,40 C 95,35 105,15 95,5" />
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default BackgroundDecor;
