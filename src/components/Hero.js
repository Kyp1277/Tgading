"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Compass, Users, ArrowRight } from 'lucide-react';

// Magnetic Button Component
export const MagneticButton = ({ children, className, onClick, ...props }) => {
  const shouldReduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring configuration for rubbery magnetic suction effect
  const springConfig = { damping: 15, stiffness: 150, mass: 0.12 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate distance from button center to mouse pointer
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Suck button 35% of the distance towards the pointer
    x.set(mouseX * 0.35);
    y.set(mouseY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: shouldReduce ? 0 : springX,
        y: shouldReduce ? 0 : springY,
      }}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Hero = ({ navigateTo }) => {
  const shouldReduce = useReducedMotion();
  
  // Motion values to track mouse coordinate positions inside the Hero area
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smoothing background follower light
  const springConfig = { damping: 35, stiffness: 180, mass: 0.6 };
  const springMouseX = useSpring(mouseX, springConfig);
  const springMouseY = useSpring(mouseY, springConfig);

  // Transform scales mapping mouse coordinates to parallax shift distances
  const parallaxX = useTransform(mouseX, [0, 1920], [-30, 30]);
  const parallaxY = useTransform(mouseY, [0, 1080], [-30, 30]);
  
  const slowParallaxX = useTransform(mouseX, [0, 1920], [-12, 12]);
  const slowParallaxY = useTransform(mouseY, [0, 1080], [-12, 12]);

  const handleMouseMove = (e) => {
    if (shouldReduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-24 pb-16 md:pt-28 md:pb-20 px-6 md:px-8 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-white via-brand-cream/40 to-brand-cream/80"
    >
      
      {/* Background Decorative Parallax/Floating Elements */}
      {/* Floating Gold Sphere */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        style={{ pointerEvents: 'none' }}
        className="absolute top-40 left-[10%] w-72 h-72 bg-brand-gold/5 blur-[80px] rounded-full hidden md:block z-0"
      />
      
      {/* Floating Green Sphere */}
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        style={{ pointerEvents: 'none' }}
        className="absolute top-60 right-[10%] w-80 h-80 bg-brand-green/8 blur-[100px] rounded-full hidden md:block z-0"
      />

      {/* Cursor Light Follower (Opsi 4) */}
      {!shouldReduce && (
        <motion.div
          style={{
            left: springMouseX,
            top: springMouseY,
            transform: "translate(-50%, -50%)",
          }}
          className="absolute w-[450px] h-[450px] bg-brand-gold/[0.08] blur-[100px] rounded-full pointer-events-none z-0 select-none hidden md:block"
        />
      )}

      {/* Large Focal Glow Blob behind the logo */}
      <div className="absolute w-80 h-80 bg-brand-gold/[0.08] blur-[90px] rounded-full -translate-y-12 pointer-events-none select-none z-0" />

      {/* Decorative Palm Silhouette in Top-Right */}
      <div className="absolute -top-12 -right-12 w-80 h-80 text-brand-green/[0.04] rotate-[50deg] pointer-events-none select-none z-0 hidden md:block">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M10,80 Q30,60 60,70 Q40,50 50,20 Q60,40 80,40 Q65,60 85,80 Q55,75 10,80 Z" />
        </svg>
      </div>

      {/* Floating Palm Leaf SVG (Left) with Mouse Parallax */}
      <motion.div
        style={{ 
          x: shouldReduce ? 0 : parallaxX, 
          y: shouldReduce ? 0 : parallaxY,
          pointerEvents: 'none'
        }}
        className="absolute bottom-24 -left-12 w-48 h-48 text-brand-green/10 opacity-30 select-none hidden lg:block z-0"
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M10,80 Q30,60 60,70 Q40,50 50,20 Q60,40 80,40 Q65,60 85,80 Q55,75 10,80 Z" />
        </svg>
      </motion.div>

      {/* Floating Wave Pattern SVG (Right) with Mouse Parallax */}
      <motion.div
        style={{ 
          x: shouldReduce ? 0 : slowParallaxX, 
          y: shouldReduce ? 0 : slowParallaxY,
          pointerEvents: 'none'
        }}
        className="absolute top-40 right-8 w-40 h-40 text-brand-gold/10 opacity-30 select-none hidden lg:block z-0"
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M10,50 C30,40 40,60 60,50 C80,40 90,60 100,50 L100,60 C90,70 80,50 60,60 C40,70 30,50 10,60 Z" />
        </svg>
      </motion.div>

      {/* Logo Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -5, 0]
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.03 }}
        className="relative w-56 h-56 md:w-72 md:h-72 mb-4 p-3 md:p-4 bg-white border border-brand-gold/25 shadow-[0_20px_60px_rgba(20,83,45,0.08)] rounded-[32px] flex items-center justify-center overflow-hidden select-none z-10"
      >
        <img 
          src="/logo.png" 
          alt="Logo KKN Kelurahan Tanjung Gading" 
          className="w-full h-full object-contain rounded-[24px]"
        />
      </motion.div>

      {/* KKN Theme Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/15 px-4.5 py-2.5 rounded-full inline-flex items-center gap-1.5 mb-5 z-10 select-none"
      >
        Tema KKN: Penguatan Masyarakat Berbasis Kearifan Lokal
      </motion.div>

      {/* Hero Content */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="font-serif font-bold text-3xl md:text-5xl lg:text-6xl text-brand-green-dark leading-tight mb-4 tracking-wide max-w-4xl z-10"
      >
        Mengukir Karya Pengabdian <br />
        <span className="bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-dark bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(201,162,39,0.05)]">
          Di Kelurahan Tanjung Gading
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="font-sans text-sm md:text-base text-slate-600 max-w-2xl mb-10 leading-relaxed z-10"
      >
        Selamat datang di gerbang informasi dan karya mahasiswa KKN UIN Suska Riau 2026. Bersama warga Pasir Penyu mewujudkan kolaborasi sosial, pengembangan UMKM sawit-karet, serta digitalisasi administrasi kelurahan.
      </motion.p>

      {/* Call to actions - wrapped with MagneticButton (Opsi 6) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 mb-16 z-10"
      >
        <MagneticButton
          onClick={() => navigateTo('desa')}
          className="font-sans px-8 py-4 rounded-full bg-brand-green text-white font-bold tracking-wide hover:bg-brand-green-dark transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(20,83,45,0.25)] cursor-pointer"
        >
          <Compass size={16} />
          Jelajahi Profil Wilayah
          <ArrowRight size={16} />
        </MagneticButton>
        <MagneticButton
          onClick={() => navigateTo('anggota')}
          className="font-sans px-8 py-4 rounded-full border-2 border-brand-green-dark bg-white hover:bg-brand-green/5 text-brand-green-dark font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Users size={16} />
          Kenali Anggota Tim
        </MagneticButton>
      </motion.div>

      {/* Decorative Thin Wave Line at the bottom area */}
      <div className="absolute bottom-16 left-0 w-full opacity-[0.06] pointer-events-none select-none z-0">
        <svg viewBox="0 0 1200 120" fill="none" stroke="#1b4332" strokeWidth="2" className="w-[200%] h-8 animated-wave-delayed">
          <path d="M0,60 Q300,90 600,60 T1200,60" />
        </svg>
      </div>

      {/* Looping wave animation divider at the bottom of hero */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[200%] h-12 fill-white animated-wave">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>

    </section>
  );
};

export default Hero;
