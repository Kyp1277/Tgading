"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calendar, Tag, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

const Galeri = () => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const shouldReduce = useReducedMotion();

  const categories = ['Semua', 'Edukasi', 'Sosialisasi', 'Gotong Royong', 'Sosial & Budaya'];

  const photos = [
    {
      id: 1,
      title: 'Sosialisasi Administrasi Kelurahan Digital',
      category: 'Sosialisasi',
      date: '15 Juli 2026',
      desc: 'Pemaparan aplikasi pengelolaan arsip digital kepada perangkat Kelurahan Tanjung Gading guna mempermudah pelayanan warga.',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      id: 2,
      title: 'Bimbingan Belajar Ceria Sekolah Dasar',
      category: 'Edukasi',
      date: '17 Juli 2026',
      desc: 'Membimbing adik-adik tingkat SD belajar matematika dengan metode permainan kreatif di posko KKN.',
      url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      id: 3,
      title: 'Gotong Royong Kebersihan Lingkungan Dusun II',
      category: 'Gotong Royong',
      date: '19 Juli 2026',
      desc: 'Bahu-membahu bersama pemuda setempat membersihkan parit saluran air dan memasang tempat sampah pilah.',
      url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      id: 4,
      title: 'Mengajar Mengaji di TPA Masjid Al-Ikhlas',
      category: 'Edukasi',
      date: '20 Juli 2026',
      desc: 'Pendampingan belajar tajwid dan membaca Iqra untuk anak-anak Kelurahan Tanjung Gading seusai ibadah shalat ashar.',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      id: 5,
      title: 'Pelatihan Pemasaran Digital bagi UMKM Sawit',
      category: 'Sosialisasi',
      date: '22 Juli 2026',
      desc: 'Edukasi mengenai cara pengemasan menarik dan pemasaran lewat platform e-commerce bagi ibu-ibu pengrajin minyak sapu lidi.',
      url: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      id: 6,
      title: 'Pemasangan Plang Batas Wilayah Dusun',
      category: 'Gotong Royong',
      date: '24 Juli 2026',
      desc: 'Pemasangan plang nama jalan dan batas dusun hasil karya mahasiswa teknik sipil KKN di perbatasan kelurahan.',
      url: 'https://images.unsplash.com/photo-1590402421685-65d12a64564c?auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      id: 7,
      title: 'Malam Keakraban dengan Warga & Tokoh Masyarakat',
      category: 'Sosial & Budaya',
      date: '26 Juli 2026',
      desc: 'Acara ramah tamah bersama kepala lurah, BPD, dan tokoh adat yang diisi dengan penampilan seni melayu dari anak-anak kelurahan.',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      id: 8,
      title: 'Eksplorasi Perkebunan Kelapa Sawit Pasir Penyu',
      category: 'Sosial & Budaya',
      date: '28 Juli 2026',
      desc: 'Dokumentasi potensi alam dan geografi Kelurahan Tanjung Gading yang kaya akan perkebunan kelapa sawit produktif.',
      url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&h=600&q=80',
    }
  ];

  const filteredPhotos = photos.filter(
    (photo) => activeCategory === 'Semua' || photo.category === activeCategory
  );

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

  // Bento grid mapping helper
  const getBentoClasses = (index) => {
    if (index === 0) return "md:col-span-2 md:row-span-2 h-64 sm:h-80 md:h-full";
    if (index === 1 || index === 4) return "md:col-span-2 md:row-span-1 h-64 md:h-full";
    return "md:col-span-1 md:row-span-1 h-64 md:h-full";
  };

  // Stagger variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-24 md:pb-24 w-full bg-[#F5F8F5] min-h-screen overflow-hidden">
      
      {/* Reusable background decorations */}
      <BackgroundDecor variant="galeri" />

      <div className="max-w-[1360px] mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduce ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full inline-flex items-center gap-1.5">
            <ImageIcon size={12} />
            Dokumentasi KKN
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl lg:text-[44px] text-brand-green-dark mt-4 mb-6 leading-tight">
            Galeri Kegiatan Pengabdian <br />
            <span className="bg-gradient-to-r from-brand-gold via-brand-gold-dark to-brand-gold bg-clip-text text-transparent">
              Kelurahan Tanjung Gading
            </span>
          </h2>
          <p className="font-sans text-brand-green-dark/70 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Kumpulan momen kebersamaan, kerja keras, dan dedikasi tim KKN UIN Suska Riau dalam menjalankan program kerja di Kelurahan Tanjung Gading.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12 relative z-10">
          <div className="bg-white border border-brand-gold/15 p-1.5 flex gap-2 overflow-x-auto max-w-full scrollbar-none rounded-full shadow-sm">
            {categories.map((category) => {
              const isSelected = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`font-sans text-xs font-bold px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-brand-gold text-white shadow-[0_4px_12px_rgba(201,162,39,0.2)]'
                      : 'bg-transparent text-brand-green-dark/70 hover:text-brand-green-dark'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Grid with layout transition & stagger reveal */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:auto-rows-[228px] relative z-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => openLightbox(index)}
                className={`bg-white border border-brand-gold/15 rounded-[32px] overflow-hidden cursor-pointer relative flex flex-col group shadow-sm hover:border-brand-gold/30 ${getBentoClasses(index)}`}
              >
                {/* Image (with slight zoom-in on hover) */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                />
                
                {/* Overlay description on hover (with subtle backdrop blur) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex flex-col justify-end p-8">
                  <span className="font-sans text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Tag size={10} className="text-brand-gold" />
                    {photo.category}
                  </span>
                  <h4 className="font-serif font-bold text-base md:text-lg text-white leading-tight mb-2">
                    {photo.title}
                  </h4>
                  <p className="font-sans text-xs md:text-sm text-white/80 leading-relaxed mb-4 line-clamp-3">
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

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col justify-between p-4 bg-black/98"
              onClick={closeLightbox}
            >
              {/* Header controls */}
              <div className="flex justify-between items-center p-4">
                <span className="font-sans text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-brand-gold/10 px-3 py-1.5 rounded-full border border-brand-gold/15">
                  {filteredPhotos[lightboxIndex].category}
                </span>
                <button
                  onClick={closeLightbox}
                  className="text-white/60 hover:text-white p-2 rounded-full bg-white/5 border border-white/10 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Central Image and Arrows */}
              <div className="flex-grow flex items-center justify-center relative max-h-[70vh]">
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white z-10 transition-all hover:scale-105 cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>

                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={filteredPhotos[lightboxIndex].url}
                  alt={filteredPhotos[lightboxIndex].title}
                  className="max-w-full max-h-full object-contain rounded-2xl border border-white/10 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  onClick={nextPhoto}
                  className="absolute right-4 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white z-10 transition-all hover:scale-105 cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Bottom details */}
              <div className="p-6 max-w-2xl mx-auto text-center" onClick={(e) => e.stopPropagation()}>
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
