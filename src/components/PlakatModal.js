"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Calendar, 
  Tag, 
  Search, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Image as ImageIcon 
} from 'lucide-react';
import { plakatData } from '@/data/plakatData';

const PlakatModal = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setLightboxIndex(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const categories = ['Semua', 'Penyerahan RT', 'Penyerahan RW', 'Kebersamaan'];

  const filteredPhotos = plakatData.filter((item) => {
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos]);

  if (!mounted) return null;

  const currentPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="plakat-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-brand-green-dark/85 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Main Modal Container */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[88vh] md:max-h-[90vh] bg-white rounded-3xl md:rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.35)] border-2 border-brand-gold/30 flex flex-col overflow-hidden my-auto"
          >
          {/* Header */}
          <div className="relative px-6 py-5 md:px-8 md:py-6 bg-gradient-to-r from-brand-green-dark via-[#1a4329] to-brand-green-dark text-white flex items-center justify-between border-b border-brand-gold/20 flex-shrink-0">
            <div className="flex items-center gap-3.5 md:gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-[0_0_20px_rgba(201,162,39,0.2)]">
                <Award size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/20 px-2.5 py-0.5 rounded-full border border-brand-gold/30">
                    Dokumentasi Program Kerja
                  </span>
                  <span className="font-sans text-[10px] md:text-xs font-semibold text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 size={12} /> 21 Titik Selesai
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg md:text-2xl text-white mt-1">
                  Penyerahan Plakat Nama RT & RW
                </h3>
                <p className="font-sans text-xs md:text-sm text-slate-300 hidden sm:block">
                  Dokumentasi lengkap serah terima plakat penanda identitas wilayah se-Kelurahan Tanjung Gading
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white hover:text-brand-gold transition-all duration-200 cursor-pointer flex-shrink-0 ml-2"
              title="Tutup Modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sub-Header / Filters & Stats */}
          <div className="p-4 md:p-6 bg-slate-50 border-b border-slate-200 flex-shrink-0 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const count = cat === 'Semua' ? plakatData.length : plakatData.filter(p => p.category === cat).length;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`font-sans text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-brand-green-dark text-brand-gold shadow-sm font-bold border border-brand-gold/30'
                        : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                    }`}
                  >
                    {cat}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-brand-gold text-brand-green-dark font-bold' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative min-w-[220px] md:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari RT, RW, atau foto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm rounded-full border border-slate-300 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-white text-slate-700 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Photo Gallery Grid (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50/50">
            {filteredPhotos.length === 0 ? (
              <div className="py-16 text-center">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-sans text-slate-500 text-sm">Tidak ada foto dokumentasi yang sesuai pencarian.</p>
                <button
                  onClick={() => { setActiveCategory('Semua'); setSearchQuery(''); }}
                  className="mt-3 font-sans text-xs font-bold text-brand-gold hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {filteredPhotos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border-2 border-brand-gold/15 hover:border-brand-gold/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <span className="font-sans text-xs font-semibold text-white flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          <Maximize2 size={13} className="text-brand-gold" /> Klik Perbesar
                        </span>
                        <span className="font-sans text-[11px] font-bold text-brand-gold bg-brand-green-dark/80 px-2 py-0.5 rounded-md border border-brand-gold/30">
                          #{photo.id.toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* Floating Badge */}
                      <span className="absolute top-3 left-3 font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-brand-green-dark shadow-sm backdrop-blur-sm border border-brand-gold/20 flex items-center gap-1">
                        <Tag size={10} className="text-brand-gold" />
                        {photo.category}
                      </span>
                    </div>

                    {/* Content Box */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-gold mb-1.5">
                        <Calendar size={12} />
                        <span>{photo.date}</span>
                      </div>
                      <h4 className="font-serif font-bold text-slate-800 text-base group-hover:text-brand-gold-dark transition-colors duration-200 line-clamp-1 mb-1.5">
                        {photo.title}
                      </h4>
                      <p className="font-sans text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {photo.desc}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-sans text-[11px] font-bold text-slate-400 flex items-center gap-1">
                          <MapPin size={11} className="text-brand-gold" /> Tanjung Gading
                        </span>
                        <span className="font-sans text-xs font-bold text-brand-gold-dark flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                          Detail <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="px-6 py-3.5 bg-brand-cream/30 border-t border-brand-gold/15 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 flex-shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-brand-gold" />
              <span>Program Sinergi Mahasiswa KKN UIN Suska Riau bersama RT & RW Kelurahan Tanjung Gading</span>
            </div>
            <span className="font-semibold text-brand-green-dark">Total: {plakatData.length} Plakat Diserahkan</span>
          </div>
        </motion.div>

        {/* Fullscreen HD Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && currentPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
              className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between p-4 md:p-6"
            >
              {/* Lightbox Topbar */}
              <div className="w-full max-w-6xl flex items-center justify-between text-white py-2 z-10">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-xs md:text-sm font-bold text-brand-gold bg-white/10 px-3 py-1 rounded-full border border-brand-gold/30">
                    {lightboxIndex + 1} / {filteredPhotos.length}
                  </span>
                  <span className="font-sans text-xs md:text-sm text-slate-300 hidden sm:inline">
                    {currentPhoto.category} • {currentPhoto.date}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(null);
                  }}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-brand-gold transition-colors cursor-pointer"
                  title="Tutup Preview"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Lightbox Image & Navigation */}
              <div 
                className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-auto px-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Prev Button */}
                <button
                  onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length)}
                  className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 rounded-full bg-white/15 hover:bg-brand-gold text-white hover:text-brand-green-dark flex items-center justify-center transition-all duration-200 z-20 cursor-pointer shadow-lg backdrop-blur-sm"
                  title="Foto Sebelumnya"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Main HD Image */}
                <motion.div
                  key={currentPhoto.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-full max-h-[68vh] rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-gold/30 bg-black/40 flex items-center justify-center"
                >
                  <img
                    src={currentPhoto.image}
                    alt={currentPhoto.title}
                    className="max-w-full max-h-[68vh] object-contain rounded-2xl"
                  />
                </motion.div>

                {/* Next Button */}
                <button
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)}
                  className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 rounded-full bg-white/15 hover:bg-brand-gold text-white hover:text-brand-green-dark flex items-center justify-center transition-all duration-200 z-20 cursor-pointer shadow-lg backdrop-blur-sm"
                  title="Foto Selanjutnya"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Lightbox Bottom Caption */}
              <div 
                className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-4 md:p-5 text-white text-center mt-3 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-serif font-bold text-base md:text-xl text-brand-gold mb-1">
                  {currentPhoto.title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto">
                  {currentPhoto.desc}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PlakatModal;
