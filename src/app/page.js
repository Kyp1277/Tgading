"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DesaProfile from '@/components/DesaProfile';
import Struktur from '@/components/Struktur';
import Anggota from '@/components/Anggota';
import Proker from '@/components/Proker';
import Galeri from '@/components/Galeri';
import Footer from '@/components/Footer';
import TransitionOverlay from '@/components/TransitionOverlay';
import AudioPlayer from '@/components/AudioPlayer';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    // Initial mount splash loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (page) => {
    if (page === currentPage || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Snappy transitions: switch halfway through (600ms)
    const midPoint = shouldReduce ? 50 : 600;
    const endPoint = shouldReduce ? 100 : 1200;

    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }, midPoint);

    setTimeout(() => {
      setIsTransitioning(false);
    }, endPoint);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero navigateTo={navigateTo} />;
      case 'desa':
        return <DesaProfile />;
      case 'struktur':
        return <Struktur />;
      case 'anggota':
        return <Anggota />;
      case 'proker':
        return <Proker />;
      case 'galeri':
        return <Galeri />;
      default:
        return <Hero navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Splash Loading Screen */}
      <AnimatePresence>
        {isLoading && !shouldReduce && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-brand-green-dark flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Pulsing Logo */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-40 h-40 md:w-48 md:h-48 p-4 bg-white rounded-3xl border-2 border-brand-gold/30 shadow-[0_20px_50px_rgba(201,162,39,0.15)] flex items-center justify-center mb-8"
            >
              <img 
                src="/logo.png" 
                alt="Logo TG" 
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Title */}
            <h1 className="font-serif font-bold text-lg md:text-xl text-white tracking-widest uppercase mb-1">
              KELURAHAN TANJUNG GADING
            </h1>
            <p className="font-sans text-[10px] md:text-xs text-brand-gold font-bold tracking-widest uppercase mb-8">
              KKN UIN SUSKA RIAU 2026
            </p>

            {/* Gold Loading bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 h-full bg-brand-gold rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Layout */}
      {!isLoading && (
        <>
          {/* Navigation */}
          <Navbar currentPage={currentPage} navigateTo={navigateTo} />
          
          {/* Dynamic Content Area with key to force Framer Motion animate on mount */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduce ? 0 : -30 }}
                transition={{ 
                  type: "spring",
                  stiffness: 120,
                  damping: 17,
                  mass: 0.7,
                  opacity: { duration: 0.35, ease: "easeOut" }
                }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <Footer navigateTo={navigateTo} />

          {/* Floating Audio Player widget */}
          <AudioPlayer />

          {/* Custom Animated Turtle Page Transition Overlay */}
          <TransitionOverlay isActive={isTransitioning} />
        </>
      )}
    </div>
  );
}
