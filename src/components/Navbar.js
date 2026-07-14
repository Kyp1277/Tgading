"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Compass, Users, Award, Image as ImageIcon, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from './Hero';

const Navbar = ({ currentPage, navigateTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'desa', label: 'Profil Kelurahan', icon: Compass },
    { id: 'struktur', label: 'Struktur', icon: Award },
    { id: 'anggota', label: 'Anggota KKN', icon: Users },
    { id: 'proker', label: 'Proker KKN', icon: BookOpen },
    { id: 'galeri', label: 'Galeri', icon: ImageIcon },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-4 md:px-8 transition-all duration-500 ${isScrolled ? 'py-2.5' : 'py-4'}`}>
      <div className={`max-w-7xl mx-auto transition-all duration-500 rounded-full flex items-center justify-between ${
        isScrolled
          ? 'bg-white/95 border-2 border-brand-gold/25 shadow-[0_10px_35px_rgba(20,83,45,0.08)] px-6 py-2.5'
          : 'bg-white/80 backdrop-blur-md border border-brand-gold/15 shadow-[0_8px_30px_rgba(20,83,45,0.03)] px-6 py-3.5'
      }`}>
        
        {/* Logo and Branding */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => navigateTo('home')}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full border border-brand-gold overflow-hidden flex items-center justify-center bg-white"
          >
            <img 
              src="/logo.png" 
              alt="Logo TG" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-serif font-bold tracking-wider text-brand-green-dark text-sm md:text-base leading-none">
              TG KKN 2026
            </span>
            <span className="font-sans text-brand-gold font-bold text-[9px] uppercase tracking-wider block mt-0.5 leading-none">
              UIN SUSKA RIAU
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelfActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`font-sans text-[15px] font-medium tracking-normal flex items-center gap-2 transition-all duration-300 py-2 px-4 rounded-full relative cursor-pointer ${
                  isSelfActive
                    ? 'text-brand-gold-dark bg-brand-cream font-bold'
                    : 'text-slate-600 hover:text-brand-gold-dark hover:bg-brand-cream/50'
                }`}
              >
                <Icon size={14} />
                {item.label}
                {isSelfActive && (
                  <motion.span 
                    layoutId="activeTabLine"
                    className="absolute bottom-0 left-1/4 right-1/4 h-[2.5px] bg-brand-gold-dark rounded-full" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <MagneticButton 
            onClick={() => navigateTo('desa')}
            className="font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-all duration-300 shadow-[0_4px_15px_rgba(201,162,39,0.1)] cursor-pointer"
          >
            Jelajahi Kelurahan
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brand-green-dark hover:text-brand-gold p-1 transition-colors cursor-pointer"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-2 mx-auto bg-white/95 backdrop-blur-md border border-brand-gold/15 shadow-xl px-4 py-5 flex flex-col gap-2 rounded-2xl"
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelfActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                    setIsOpen(false);
                  }}
                  className={`font-sans text-left text-[15px] font-medium tracking-normal flex items-center gap-3 transition-all duration-300 py-3 px-4 rounded-xl cursor-pointer ${
                    isSelfActive
                      ? 'text-brand-gold-dark bg-brand-cream border-l-[3px] border-brand-gold-dark font-bold'
                      : 'text-slate-600 hover:text-brand-gold-dark hover:bg-brand-cream/50'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
            <div className="h-px bg-brand-gold/10 my-1" />
            <button
              onClick={() => {
                navigateTo('desa');
                setIsOpen(false);
              }}
              className="font-sans text-center text-xs font-bold uppercase tracking-wider py-3 rounded-xl border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-all duration-300 cursor-pointer"
            >
              Jelajahi Kelurahan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
