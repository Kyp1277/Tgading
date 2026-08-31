"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Calendar, 
  Tag, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Loader2, 
  Sparkles, 
  Grid, 
  Layers,
  Maximize2,
  RotateCw,
  Shuffle
} from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

// Shimmer effect using Framer Motion
const ShimmerOverlay = () => (
  <motion.div
    initial={{ x: "-100%" }}
    animate={{ x: "100%" }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent z-10"
  />
);

// Card loader skeleton
const SkeletonCard = () => (
  <div className="bg-white border-2 border-brand-gold/10 rounded-[32px] p-6 h-[380px] flex flex-col relative overflow-hidden shadow-sm">
    <div className="w-full h-48 rounded-2xl bg-brand-green-dark/5 relative overflow-hidden mb-4">
      <ShimmerOverlay />
    </div>
    <div className="w-20 h-5 rounded-full bg-brand-green-dark/5 relative overflow-hidden mb-3">
      <ShimmerOverlay />
    </div>
    <div className="w-3/4 h-6 rounded-md bg-brand-green-dark/5 relative overflow-hidden mb-2">
      <ShimmerOverlay />
    </div>
    <div className="w-1/2 h-6 rounded-md bg-brand-green-dark/5 relative overflow-hidden mb-4">
      <ShimmerOverlay />
    </div>
    <div className="flex justify-between items-center mt-auto">
      <div className="w-24 h-4 rounded-md bg-brand-green-dark/5 relative overflow-hidden">
        <ShimmerOverlay />
      </div>
      <div className="w-6 h-6 rounded-full bg-brand-green-dark/5 relative overflow-hidden">
        <ShimmerOverlay />
      </div>
    </div>
  </div>
);

const Galeri = () => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [layoutMode, setLayoutMode] = useState('scrapbook'); // 'scrapbook' | 'grid' | 'carousel'
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const shouldReduce = useReducedMotion();
  const constraintsRef = useRef(null);

  // States to manage z-indices of draggable polaroids
  const [zIndices, setZIndices] = useState({});
  const [maxZ, setMaxZ] = useState(10);

  // Scrapbook page state (9 polaroids per page)
  const [scrapbookPage, setScrapbookPage] = useState(0);

  // Grid display limit (initially show 16, load more by 16)
  const [gridLimit, setGridLimit] = useState(16);

  // Detect mobile screen for layout styling
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3D Coverflow Carousel active slide index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Reset indices on category change
  useEffect(() => {
    setCarouselIndex(0);
    setScrapbookPage(0);
    setGridLimit(16);
  }, [activeCategory]);

  const categories = [
    'Semua', 
    'Pendidikan', 
    'Kesehatan', 
    'Lingkungan', 
    'Pemerintahan', 
    'Keagamaan', 
    'Kebudayaan', 
    'Kreativitas', 
    'Sosial', 
    'Kebersamaan'
  ];

  useEffect(() => {
    const fetchGaleri = async () => {
      try {
        const res = await fetch('/api/galeri');
        if (res.ok) {
          const resData = await res.json();
          const list = Array.isArray(resData) ? resData : (resData?.data || []);
          const normalized = (Array.isArray(list) ? list : []).map((item, idx) => ({
            id: item.id || idx + 1,
            day: item.day || 1,
            date: item.date || '',
            image: item.image || item.url || '',
            url: item.url || item.image || '',
            title: item.title || '',
            desc: item.desc || '',
            category: item.category || 'Kegiatan'
          }));
          setPhotos(normalized);
        }
      } catch (e) {
        console.error("Gagal memuat galeri foto", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGaleri();
  }, []);

  const parseIndonesianDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const months = {
      januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
      juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11
    };
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length !== 3) {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? new Date(0) : d;
    }
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]] !== undefined ? months[parts[1]] : 0;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const safePhotos = Array.isArray(photos) ? photos : [];

  const sortedPhotos = [...safePhotos].sort((a, b) => {
    if (a.day && b.day && a.day !== b.day) return a.day - b.day;
    return (a.id || 0) - (b.id || 0);
  });

  const filteredPhotos = sortedPhotos.filter(
    (photo) => activeCategory === 'Semua' || photo.category === activeCategory
  );

  // Scrapbook pagination calculations (Optimized for mobile DOM performance)
  const scrapbookItemsPerPage = isMobile ? 6 : 9;
  const totalScrapbookPages = Math.ceil(filteredPhotos.length / scrapbookItemsPerPage);
  const displayedScrapbookPhotos = filteredPhotos.slice(
    scrapbookPage * scrapbookItemsPerPage, 
    (scrapbookPage + 1) * scrapbookItemsPerPage
  );

  const displayedGridPhotos = filteredPhotos.slice(0, gridLimit);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  // Bring clicked/dragged photo to front
  const bringToFront = (id) => {
    const nextZ = maxZ + 1;
    setZIndices((prev) => ({ ...prev, [id]: nextZ }));
    setMaxZ(nextZ);
  };

  // Bento grid mapping helper for Classic Grid mode
  const getBentoClasses = (index) => {
    const mod = index % 6;
    if (mod === 0) return "md:col-span-2 md:row-span-2 h-64 sm:h-80 md:h-full";
    if (mod === 1 || mod === 4) return "md:col-span-2 md:row-span-1 h-64 md:h-full";
    return "md:col-span-1 md:row-span-1 h-64 md:h-full";
  };

  // Pre-configured positions for Polaroid cards in Scrapbook mode (Desktop)
  const initialPositions = [
    { top: '6%', left: '6%', rotate: -5 },
    { top: '3%', left: '38%', rotate: 4 },
    { top: '8%', left: '70%', rotate: -3 },
    { top: '34%', left: '3%', rotate: 5 },
    { top: '32%', left: '35%', rotate: -4 },
    { top: '35%', left: '68%', rotate: 3 },
    { top: '64%', left: '10%', rotate: -3 },
    { top: '62%', left: '42%', rotate: 5 },
    { top: '60%', left: '72%', rotate: -4 },
  ];

  // Helper to color-code washi tape based on category
  const getWashiTapeClass = (category) => {
    switch (category) {
      case 'Pendidikan':
        return 'bg-amber-400/35 border-amber-500/40 text-amber-900/80';
      case 'Kesehatan':
        return 'bg-emerald-400/35 border-emerald-500/40 text-emerald-900/80';
      case 'Lingkungan':
        return 'bg-teal-400/35 border-teal-500/40 text-teal-900/80';
      case 'Pemerintahan':
        return 'bg-blue-400/35 border-blue-500/40 text-blue-900/80';
      case 'Keagamaan':
        return 'bg-green-400/35 border-green-500/40 text-green-900/80';
      case 'Kebudayaan':
      case 'Kreativitas':
        return 'bg-purple-400/35 border-purple-500/40 text-purple-900/80';
      case 'Sosial':
        return 'bg-cyan-400/35 border-cyan-500/40 text-cyan-900/80';
      case 'Kebersamaan':
        return 'bg-rose-400/35 border-rose-500/40 text-rose-900/80';
      default:
        return 'bg-brand-gold/35 border-brand-gold/40 text-yellow-950/80';
    }
  };

  const getPinColor = (index) => {
    const pinColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    return pinColors[index % pinColors.length];
  };

  // Stagger variants for Grid mode
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.05
      }
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-24 md:pb-24 w-full bg-brand-sand min-h-screen overflow-hidden">
      
      {/* Reusable background decorations */}
      <BackgroundDecor variant="galeri" />

      <div className="max-w-[1360px] mx-auto px-6 md:px-8 relative z-10">
        
        {/* Layout Switcher & Header */}
        <div className="flex flex-col items-center mb-8">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full inline-flex items-center gap-1.5 mb-4">
            <Sparkles size={12} className="animate-pulse" />
            Galeri Interaktif ({filteredPhotos.length} Foto)
          </span>

          {/* Triple Toggle for Scrapbook vs Grid vs 3D Carousel (Responsive Layout) */}
          <div className="bg-white border border-brand-gold/15 p-1 flex flex-wrap justify-center rounded-2xl md:rounded-full shadow-sm relative z-20 mb-6 w-full max-w-sm md:w-fit mx-auto gap-0.5 md:gap-0">
             <button
              onClick={() => setLayoutMode('scrapbook')}
              className={`font-sans text-[10px] md:text-xs font-bold px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-full transition-all duration-300 flex items-center gap-1.5 md:gap-2 cursor-pointer ${
                layoutMode === 'scrapbook'
                  ? 'bg-brand-gold text-white shadow-[0_3px_8px_rgba(201,162,39,0.25)]'
                  : 'bg-transparent text-slate-500 hover:text-brand-green-dark'
              }`}
            >
              <Layers size={12} className="md:w-3.5 md:h-3.5" />
              Buku Tempel
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`font-sans text-[10px] md:text-xs font-bold px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-full transition-all duration-300 flex items-center gap-1.5 md:gap-2 cursor-pointer ${
                layoutMode === 'grid'
                  ? 'bg-brand-gold text-white shadow-[0_3px_8px_rgba(201,162,39,0.25)]'
                  : 'bg-transparent text-slate-500 hover:text-brand-green-dark'
              }`}
            >
              <Grid size={12} className="md:w-3.5 md:h-3.5" />
              Grid Modern
            </button>
            <button
              onClick={() => setLayoutMode('carousel')}
              className={`font-sans text-[10px] md:text-xs font-bold px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-full transition-all duration-300 flex items-center gap-1.5 md:gap-2 cursor-pointer ${
                layoutMode === 'carousel'
                  ? 'bg-brand-gold text-white shadow-[0_3px_8px_rgba(201,162,39,0.25)]'
                  : 'bg-transparent text-slate-500 hover:text-brand-green-dark'
              }`}
            >
              <RotateCw size={12} className="md:w-3.5 md:h-3.5" />
              3D Carousel
            </button>
          </div>

          {/* Header Typography based on Selected Mode */}
          <AnimatePresence mode="wait">
            {layoutMode === 'scrapbook' ? (
              <motion.div
                key="scrapbook-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <h2 className="font-serif font-black text-4xl md:text-[52px] text-bevel-green tracking-wide uppercase leading-tight mb-2">
                  Kisah KKN Tanjung Gading
                </h2>
                <p className="font-handwritten text-2xl text-brand-gold-dark/95 max-w-2xl mx-auto leading-relaxed">
                  "Geser dan tata foto-foto kegiatan kami di papan tempel kenangan..."
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <h2 className="font-serif font-bold text-3xl md:text-5xl lg:text-[44px] text-brand-green-dark mt-2 mb-3 leading-tight">
                  Galeri Kegiatan Pengabdian <br />
                  <span className="bg-gradient-to-r from-brand-gold via-brand-gold-dark to-brand-gold bg-clip-text text-transparent">
                    Kelurahan Tanjung Gading
                  </span>
                </h2>
                <p className="font-sans text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                  Dokumentasi autentik 26 hari pengabdian mahasiswa KKN UIN Suska Riau di Kelurahan Tanjung Gading, Pasir Penyu.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 relative z-20">
          <div className="bg-white border border-brand-gold/15 p-1.5 flex gap-1.5 overflow-x-auto max-w-full scrollbar-none rounded-full shadow-sm">
            {categories.map((category) => {
              const isSelected = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`font-sans text-[11px] md:text-xs font-bold px-4 md:px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-brand-gold text-white shadow-[0_4px_12px_rgba(201,162,39,0.2)]'
                      : 'bg-transparent text-slate-500 hover:text-brand-green-dark'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-20 text-center bg-brand-cream/5 rounded-3xl border border-brand-gold/10 max-w-2xl mx-auto">
            <p className="font-sans text-sm text-slate-500">Tidak ada foto kegiatan untuk kategori ini.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {layoutMode === 'scrapbook' ? (
              /* =================== AESTHETIK SCRAPBOOK LAYOUT =================== */
              <motion.div
                key="scrapbook-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                ref={constraintsRef}
                className="relative w-full min-h-[600px] md:h-[820px] bg-[#fbfbf9] rounded-[36px] border-2 border-brand-gold/15 p-4 md:p-8 overflow-hidden shadow-inner dotted-canvas flex flex-col justify-between"
              >
                {/* SVG doodles behind the polaroid cards */}
                <div className="absolute inset-0 pointer-events-none select-none opacity-20">
                  <svg className="absolute top-10 left-[15%] w-24 h-24 text-brand-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M50,10 C20,20 10,50 30,80 C50,100 90,90 90,60 C90,30 60,10 40,20" strokeDasharray="3,3" />
                  </svg>
                  
                  <svg className="absolute top-[48%] left-[45%] w-36 h-20 text-brand-green hidden md:block" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10,80 Q100,20 180,50" strokeDasharray="6,6" />
                    <path d="M165,40 L180,50 L168,65" />
                  </svg>

                  <svg className="absolute top-16 right-[20%] w-12 h-12 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
                  </svg>

                  <svg className="absolute bottom-20 left-[8%] w-16 h-16 text-rose-400" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50,30 C50,10 20,10 20,35 C20,60 50,80 50,80 C50,80 80,60 80,35 C80,10 50,10 50,30 Z" />
                  </svg>

                  <div className="absolute bottom-6 right-10 border border-brand-gold/30 bg-brand-cream/40 px-4 py-2 font-handwritten text-lg text-brand-green-dark rotate-3 rounded-md">
                    📚 Tanjung Gading 2026
                  </div>
                </div>

                {/* Cards Container */}
                <div 
                  className={isMobile ? "flex flex-col items-center gap-8 py-4 w-full" : "w-full h-full relative flex-grow"}
                >
                  <AnimatePresence mode="popLayout">
                    {displayedScrapbookPhotos.map((photo, index) => {
                      const pos = initialPositions[index % initialPositions.length];
                      const washiColor = getWashiTapeClass(photo.category);
                      const pinColor = getPinColor(index);
                      const globalIndex = filteredPhotos.findIndex(p => p.id === photo.id);

                      return (
                        <motion.div
                          layout
                          key={photo.id}
                          drag={!isMobile}
                          dragConstraints={constraintsRef}
                          dragTransition={{ power: 0.15, bounceStiffness: 220, bounceDamping: 22 }}
                          whileHover={{ 
                            scale: isMobile ? 1 : 1.05, 
                            rotate: 0,
                            boxShadow: "0px 20px 40px rgba(27,67,50,0.14)",
                            zIndex: 50
                          }}
                          whileDrag={{ 
                            scale: 1.08, 
                            boxShadow: "0px 30px 60px rgba(27,67,50,0.22)",
                            rotate: 0,
                            zIndex: 60
                          }}
                          onDragStart={() => bringToFront(photo.id)}
                          onTapStart={() => bringToFront(photo.id)}
                          style={{
                            position: isMobile ? 'relative' : 'absolute',
                            top: isMobile ? 'auto' : pos.top,
                            left: isMobile ? 'auto' : pos.left,
                            zIndex: zIndices[photo.id] || 10,
                            transform: isMobile ? `rotate(${pos.rotate * 0.5}deg)` : undefined,
                          }}
                          initial={{ 
                            opacity: 0, 
                            scale: 0.9, 
                            rotate: isMobile ? pos.rotate * 0.5 : pos.rotate * 1.5 
                          }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            rotate: isMobile ? pos.rotate * 0.5 : pos.rotate 
                          }}
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className={`w-64 sm:w-72 md:w-[275px] bg-white p-3.5 pb-6 sm:pb-7 rounded-sm border border-stone-200/80 shadow-md select-none cursor-grab active:cursor-grabbing flex flex-col group relative gpu-accelerated`}
                        >
                          {/* Jagged Washi Tape Ribbon */}
                          <div 
                            className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6.5 border-l border-r border-dashed mix-blend-multiply flex items-center justify-center font-handwritten text-[10px] tracking-widest font-bold uppercase select-none z-10 ${washiColor}`}
                            style={{
                              clipPath: "polygon(0% 8%, 4% 1%, 10% 8%, 15% 0%, 22% 8%, 28% 1%, 35% 8%, 40% 0%, 47% 8%, 53% 1%, 60% 8%, 66% 0%, 73% 8%, 79% 1%, 86% 8%, 92% 0%, 98% 8%, 100% 2%, 100% 92%, 96% 99%, 90% 92%, 84% 100%, 77% 92%, 71% 100%, 64% 92%, 58% 100%, 52% 92%, 46% 100%, 39% 92%, 33% 100%, 26% 92%, 20% 100%, 13% 92%, 7% 100%, 0% 91%)"
                            }}
                          >
                            {photo.category}
                          </div>

                          {/* Push Pin */}
                          <svg 
                            style={{ color: pinColor }}
                            className="absolute -top-2 left-6 w-5.5 h-5.5 z-20 drop-shadow-[1.5px_3px_2px_rgba(0,0,0,0.3)] pointer-events-none" 
                            viewBox="0 0 24 24" 
                            fill="none"
                          >
                            <circle cx="12" cy="7" r="5" fill="currentColor" />
                            <path d="M12,12 L12,21" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M9,12 L15,12" stroke="currentColor" strokeWidth="1.5" />
                          </svg>

                          {/* Inner photo container */}
                          <div 
                            className="relative overflow-hidden bg-stone-100 border border-stone-200 aspect-[4/3] rounded-sm group-hover:border-brand-gold/30 transition-colors duration-300 cursor-pointer"
                            onClick={() => openLightbox(globalIndex >= 0 ? globalIndex : index)}
                          >
                            <motion.img
                              layoutId={`gallery-img-${photo.id}`}
                              src={photo.image || photo.url}
                              alt={photo.title}
                              className="w-full h-full object-cover select-none pointer-events-none"
                            />
                            
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                              <div className="p-2 rounded-full bg-white/80 text-brand-green-dark shadow">
                                <Maximize2 size={16} />
                              </div>
                            </div>
                          </div>

                          {/* Polaroid Handwritten Text Caption */}
                          <h4 className="font-handwritten text-[18px] sm:text-[20px] text-stone-800 leading-tight text-center mt-3 tracking-wide select-none filter drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.12)] line-clamp-2">
                            {photo.title}
                          </h4>

                          {/* Tiny date marker at bottom */}
                          <div className="flex items-center justify-end gap-1 text-[11px] text-stone-400 font-handwritten mt-1 px-1 select-none">
                            <Calendar size={10} />
                            {photo.date}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Scrapbook Pagination / Navigation Controls (Desktop & Mobile) */}
                {totalScrapbookPages > 1 && (
                  <div className="relative z-30 flex items-center justify-center gap-2 sm:gap-3 pt-3 md:pt-4 border-t border-brand-gold/15 bg-white/80 md:bg-white/60 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-2 w-fit mx-auto shadow-sm mt-4">
                    <button
                      onClick={() => setScrapbookPage(p => Math.max(0, p - 1))}
                      disabled={scrapbookPage === 0}
                      className="p-2 rounded-full bg-white border border-brand-gold/20 text-brand-green-dark hover:bg-brand-gold/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                      title="Halaman Sebelumnya"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span className="font-handwritten text-base sm:text-lg font-bold text-brand-green-dark px-2 sm:px-3">
                      Halaman {scrapbookPage + 1} dari {totalScrapbookPages}
                    </span>

                    <button
                      onClick={() => setScrapbookPage(p => Math.min(totalScrapbookPages - 1, p + 1))}
                      disabled={scrapbookPage === totalScrapbookPages - 1}
                      className="p-2 rounded-full bg-white border border-brand-gold/20 text-brand-green-dark hover:bg-brand-gold/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                      title="Halaman Berikutnya"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : layoutMode === 'grid' ? (
              /* =================== CLASSIC BENTO GRID LAYOUT =================== */
              <div className="space-y-8">
                <motion.div 
                  key="grid-view"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  layout 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:auto-rows-[228px] relative z-10"
                >
                  <AnimatePresence mode="popLayout">
                    {displayedGridPhotos.map((photo, index) => (
                      <motion.div
                        layout
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.35 }}
                        onClick={() => openLightbox(index)}
                        className={`bg-white border border-brand-gold/15 rounded-[32px] overflow-hidden cursor-pointer relative flex flex-col group shadow-sm hover:border-brand-gold/30 ${getBentoClasses(index)}`}
                      >
                        {/* Image */}
                        <motion.img
                          layoutId={`gallery-img-${photo.id}`}
                          src={photo.image || photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                        />
                        
                        {/* Hover detail overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex flex-col justify-end p-6 md:p-8 z-10">
                          <span className="font-sans text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Tag size={10} className="text-brand-gold" />
                            {photo.category}
                          </span>
                          <h4 className="font-serif font-bold text-base md:text-lg text-white leading-tight mb-2">
                            {photo.title}
                          </h4>
                          <p className="font-sans text-xs md:text-sm text-white/80 leading-relaxed mb-3 line-clamp-3">
                            {photo.desc}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-bold uppercase tracking-wider">
                            <Calendar size={12} className="text-white/50" />
                            {photo.date}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More Button for Grid */}
                {gridLimit < filteredPhotos.length && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setGridLimit(prev => prev + 16)}
                      className="font-sans text-xs md:text-sm font-bold px-8 py-3.5 bg-brand-gold text-white rounded-full hover:bg-brand-gold-dark transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={16} />
                      Tampilkan Foto Lainnya ({filteredPhotos.length - gridLimit} Tersisa)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* =================== 3D COVERFLOW CAROUSEL LAYOUT =================== */
              <motion.div
                key="carousel-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full h-[540px] md:h-[620px] flex flex-col items-center justify-center overflow-hidden bg-white/40 backdrop-blur-sm rounded-[36px] border-2 border-brand-gold/15 shadow-inner px-4"
                style={{ perspective: "1000px" }}
              >
                {/* 3D Container */}
                <div className="relative w-full max-w-sm h-[320px] md:h-[390px] flex items-center justify-center">
                  {filteredPhotos.map((photo, index) => {
                    const diff = index - carouselIndex;
                    const isCenter = diff === 0;
                    const isVisible = Math.abs(diff) <= 2;

                    if (!isVisible) return null;

                    let rotateY = 0;
                    let x = 0;
                    let scale = 1;
                    let zIndex = 10;
                    let opacity = 1;

                    if (diff === -1) {
                      rotateY = 35;
                      x = isMobile ? -70 : -180;
                      scale = 0.82;
                      zIndex = 5;
                      opacity = 0.7;
                    } else if (diff === 1) {
                      rotateY = -35;
                      x = isMobile ? 70 : 180;
                      scale = 0.82;
                      zIndex = 5;
                      opacity = 0.7;
                    } else if (diff === -2) {
                      rotateY = 45;
                      x = isMobile ? -120 : -320;
                      scale = 0.65;
                      zIndex = 3;
                      opacity = 0.35;
                    } else if (diff === 2) {
                      rotateY = -45;
                      x = isMobile ? 120 : 320;
                      scale = 0.65;
                      zIndex = 3;
                      opacity = 0.35;
                    }

                    return (
                      <motion.div
                        key={photo.id}
                        className="absolute w-60 md:w-[275px] bg-white p-3.5 pb-8 rounded-sm border border-stone-200 shadow-xl cursor-pointer flex flex-col"
                        style={{
                          transformStyle: "preserve-3d",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          originX: 0.5,
                          originY: 0.5
                        }}
                        animate={{
                          x,
                          scale,
                          rotateY,
                          zIndex,
                          opacity
                        }}
                        transition={{ type: "spring", damping: 20, stiffness: 120 }}
                        onClick={() => {
                          if (isCenter) {
                            openLightbox(index);
                          } else {
                            setCarouselIndex(index);
                          }
                        }}
                      >
                        {/* Washi Tape Accent */}
                        <div 
                          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 border-l border-r border-dashed bg-amber-100/60 text-brand-gold/70 border-brand-gold/20 mix-blend-multiply flex items-center justify-center font-handwritten text-[9px] tracking-widest font-bold uppercase select-none z-10"
                          style={{
                            clipPath: "polygon(0% 8%, 4% 1%, 10% 8%, 15% 0%, 22% 8%, 28% 1%, 35% 8%, 40% 0%, 47% 8%, 53% 1%, 60% 8%, 66% 0%, 73% 8%, 79% 1%, 86% 8%, 92% 0%, 98% 8%, 100% 2%, 100% 92%, 96% 99%, 90% 92%, 84% 100%, 77% 92%, 71% 100%, 64% 92%, 58% 100%, 52% 92%, 46% 100%, 39% 92%, 33% 100%, 26% 92%, 20% 100%, 13% 92%, 7% 100%, 0% 91%)"
                          }}
                        >
                          {photo.category}
                        </div>

                        {/* Photo container */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border border-stone-200 rounded-sm">
                          <motion.img 
                            layoutId={`gallery-img-${photo.id}`}
                            src={photo.image || photo.url} 
                            alt={photo.title} 
                            className="w-full h-full object-cover select-none pointer-events-none"
                          />
                          {isCenter && (
                            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                              <div className="p-2 rounded-full bg-white/85 text-brand-green-dark shadow-md">
                                <Maximize2 size={15} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Polaroid handwritten caption */}
                        <h4 className="font-handwritten text-lg md:text-xl text-stone-800 text-center mt-4.5 leading-tight tracking-wide select-none line-clamp-2">
                          {photo.title}
                        </h4>

                        {/* Date info */}
                        <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400 font-handwritten mt-1.5 px-1 select-none">
                          <Calendar size={10} />
                          {photo.date}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-8 z-20">
                  <button
                    onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                    disabled={carouselIndex === 0}
                    className="p-3 rounded-full bg-white border border-brand-gold/15 text-brand-green hover:bg-brand-cream/50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-sans text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest bg-brand-cream/80 px-4 py-1.5 border border-brand-gold/10 rounded-full shadow-sm">
                    {carouselIndex + 1} / {filteredPhotos.length}
                  </span>
                  <button
                    onClick={() => setCarouselIndex(prev => Math.min(filteredPhotos.length - 1, prev + 1))}
                    disabled={carouselIndex === filteredPhotos.length - 1}
                    className="p-3 rounded-full bg-white border border-brand-gold/15 text-brand-green hover:bg-brand-cream/50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Lightbox Modal with Seamless Morphing Image */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex flex-col justify-between p-6 bg-black/98 overflow-y-auto backdrop-blur-md"
              onClick={closeLightbox}
            >
              {/* Header controls */}
              <div className="flex justify-between items-center p-4 md:p-6 flex-shrink-0 z-10">
                <span className="font-sans text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-3 py-1.5 rounded-full border border-brand-gold/15">
                  {filteredPhotos[lightboxIndex].category}
                </span>
                <button
                  onClick={closeLightbox}
                  className="text-white/60 hover:text-white p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Central Image and Arrows */}
              <div className="flex-grow flex items-center justify-center relative max-h-[58vh] md:max-h-[65vh] my-4 flex-shrink-0 z-10">
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white z-20 transition-all hover:scale-105 cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Morphing Image via layoutId */}
                <motion.img
                  layoutId={`gallery-img-${filteredPhotos[lightboxIndex].id}`}
                  key={lightboxIndex}
                  src={filteredPhotos[lightboxIndex].image || filteredPhotos[lightboxIndex].url}
                  alt={filteredPhotos[lightboxIndex].title}
                  className="max-w-full max-h-full object-contain rounded-2xl border border-white/10 shadow-2xl z-10"
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  onClick={nextPhoto}
                  className="absolute right-4 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white z-20 transition-all hover:scale-105 cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Bottom details */}
              <div className="pt-4 pb-12 px-6 max-w-2xl mx-auto text-center flex-shrink-0 z-10" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-serif font-bold text-lg md:text-xl text-white mb-2">
                  {filteredPhotos[lightboxIndex].title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-white/70 leading-relaxed mb-3">
                  {filteredPhotos[lightboxIndex].desc}
                </p>
                <span className="font-sans text-[10px] text-white/50 font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <Calendar size={12} />
                  Dokumentasi Tanggal: {filteredPhotos[lightboxIndex].date}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Galeri;
