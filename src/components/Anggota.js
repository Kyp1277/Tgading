"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { anggotaData } from '../data/anggotaData';
import { Search, Filter, Instagram, Linkedin, Mail, Users, Github, Facebook, Globe, X, Award, RefreshCw } from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

const Tiktok = ({ size = 16, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// 3D Double-Sided Polaroid Flip Card Component with Parallax Depth (Opsi C)
const FlipCard = ({ member, isBPH, shouldReduce, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-10, 10]), springConfig);

  // Opposite translations for 3D depth parallax
  const avatarX = useSpring(useTransform(mouseX, [-150, 150], [8, -8]), springConfig);
  const avatarY = useSpring(useTransform(mouseY, [-150, 150], [8, -8]), springConfig);

  const bannerX = useSpring(useTransform(mouseX, [-150, 150], [6, -6]), springConfig);
  const bannerY = useSpring(useTransform(mouseY, [-150, 150], [4, -4]), springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = e.clientX - rect.left - width / 2;
    const yVal = e.clientY - rect.top - height / 2;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    if (!shouldReduce) {
      setIsFlipped(false);
    }
  };

  const customQuotes = {
    1: "Memimpin dengan hati, mengabdi dengan aksi nyata untuk Tanjung Gading.",
    2: "Kelancaran administrasi adalah fondasi kesuksesan seluruh program kerja.",
    3: "Ketelitian dalam pencatatan menjaga keharmonisan kerja tim pengabdian.",
    4: "Transparansi dan ketepatan alokasi dana memastikan efektivitas pengabdian.",
    5: "Membangun jembatan komunikasi yang kokoh antara mahasiswa dan warga.",
    6: "Kolaborasi masyarakat adalah kunci keberlanjutan program pembangunan.",
    7: "Mengabadikan setiap senyum pengabdian lewat lensa visual dan karya digital.",
    8: "Desain visual yang kreatif menyampaikan pesan pengabdian secara luas.",
    9: "Edukasi adalah kunci membuka potensi masa depan anak-anak Tanjung Gading.",
    10: "Menciptakan ruang belajar ceria demi menumbuhkan minat belajar adik-adik.",
    11: "Kesiapan logistik dan perlengkapan menjamin kelancaran aksi di lapangan."
  };
  const quote = customQuotes[member.id] || "Mengabdi dengan ikhlas, bekerja dengan cerdas untuk kemajuan Tanjung Gading.";

  return (
    <div 
      className="w-full h-[380px] cursor-pointer relative select-none"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !shouldReduce && setIsFlipped(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ 
          transformStyle: "preserve-3d",
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* FRONT SIDE */}
        <div 
          className={`absolute inset-0 w-full h-full bg-white border-2 rounded-3xl overflow-hidden flex flex-col group shadow-sm transition-all duration-300 ${
            isBPH 
              ? 'border-brand-gold/35 shadow-[0_4px_20px_rgba(201,162,39,0.12)]' 
              : 'border-brand-gold/10'
          }`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Profile Top Banner */}
          <div className="h-24 bg-gradient-to-br from-brand-green-dark to-brand-green relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-brand-gold/15 blur-xl pointer-events-none" />
            
            {/* Parallax Background Motif (Layer 1) */}
            <motion.div 
              style={{ x: bannerX, y: bannerY, scale: 1.1 }}
              className="absolute inset-0 w-full h-full"
            >
              <svg className="w-full h-full text-brand-gold/[0.08] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`pucukRebung-${member.id}`} width="20" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 10,2 L 2,22 L 18,22 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M 10,2 L 10,22" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
                    <path d="M 6,13 L 10,9 L 14,13" fill="none" stroke="currentColor" strokeWidth="0.6" />
                    <path d="M 4,18 L 10,13 L 16,18" fill="none" stroke="currentColor" strokeWidth="0.6" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#pucukRebung-${member.id})`} />
              </svg>
            </motion.div>
            
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
              {isBPH && (
                <span className="text-[8px] font-sans font-extrabold tracking-widest text-white bg-brand-gold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)] flex items-center gap-0.5 border border-white/10">
                  <Award size={8} />
                  BPH
                </span>
              )}
              <span className="text-[9px] font-sans font-bold tracking-widest text-brand-gold bg-black/40 px-2.5 py-1 rounded-full border border-brand-gold/15">
                #{member.id}
              </span>
            </div>
          </div>

          {/* Avatar Position overlap (Layer 2 Parallax Image) */}
          <div className="px-6 pb-6 flex-grow flex flex-col items-center -mt-12 relative text-center">
            {/* Parallax Container */}
            <div className="w-24 h-24 rounded-full border-4 border-white bg-brand-cream shadow-md mb-3 overflow-hidden relative">
              <motion.img
                src={member.fotoAnggota || member.avatar}
                alt={member.name}
                style={{ 
                  x: shouldReduce ? 0 : avatarX, 
                  y: shouldReduce ? 0 : avatarY,
                  scale: 1.15
                }}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = member.avatar;
                }}
              />
            </div>

            <span className="font-sans text-[9px] font-bold tracking-widest uppercase mb-1 text-slate-500">
              {member.role}
            </span>

            <h3 className="font-serif font-bold text-base text-brand-green-dark mb-1 leading-tight group-hover:text-brand-gold transition-colors duration-300">
              {member.name}
            </h3>

            <p className="font-sans text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-3">
              {member.major}
            </p>

            <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
              {member.bio}
            </p>
            
            <div className="text-[10px] font-sans font-bold text-brand-gold flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300 mt-auto">
              <span>Ketuk untuk Balik</span>
              <RefreshCw size={10} className="animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div 
          className={`absolute inset-0 w-full h-full bg-white border-2 rounded-3xl overflow-hidden flex flex-col p-6 text-center shadow-md ${
            isBPH 
              ? 'border-brand-gold/35 shadow-[0_4px_20px_rgba(201,162,39,0.12)]' 
              : 'border-brand-gold/10'
          }`}
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="flex flex-col items-center flex-grow justify-between h-full">
            {/* Slogan Quote */}
            <div className="my-auto">
              <span className="font-serif text-3xl text-brand-gold/45 font-bold leading-none">“</span>
              <p className="font-serif italic text-xs md:text-sm text-brand-green-dark/95 px-1 leading-relaxed -mt-1.5">
                {quote}
              </p>
              <span className="font-serif text-3xl text-brand-gold/45 font-bold leading-none">”</span>
            </div>

            {/* Division Detail */}
            <div className="w-full space-y-3.5 mt-auto">
              <div className="bg-brand-cream/80 py-2 px-3.5 rounded-xl border border-brand-gold/10">
                <p className="font-sans text-[8px] font-bold text-brand-gold uppercase tracking-widest mb-0.5">Divisi KKN</p>
                <p className="font-sans text-[11px] font-bold text-brand-green-dark leading-tight">{member.division}</p>
              </div>

              {/* Social Media Link Icons */}
              <div className="flex justify-center gap-2.5">
                {member.socials?.instagram && (
                  <a 
                    href={member.socials.instagram} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-slate-550 hover:text-brand-gold bg-brand-sand hover:bg-white transition-all duration-300"
                  >
                    <Instagram size={14} />
                  </a>
                )}
                {member.socials?.linkedin && (
                  <a 
                    href={member.socials.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-slate-550 hover:text-brand-gold bg-brand-sand hover:bg-white transition-all duration-300"
                  >
                    <Linkedin size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Action button to open full bio modal */}
            <button 
              className="mt-5 w-full py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Buka Detail Profil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Anggota = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filters = [
    'Semua',
    'BPH (Badan Pengurus Harian)',
    'Divisi Humas',
    'Divisi PDD',
    'Divisi Acara',
    'Divisi Logistik',
  ];

  const filteredMembers = anggotaData.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'Semua' || member.division === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Stagger variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-24 md:pb-24 w-full bg-[#FDFBF5] min-h-screen overflow-hidden">
      
      {/* Reusable background decorations */}
      <BackgroundDecor variant="anggota" />

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
            <Users size={12} />
            Daftar Anggota KKN
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl lg:text-[44px] text-brand-green-dark mt-4 mb-6 leading-tight">
            Kenali Tim Pengabdian <br />
            <span className="bg-gradient-to-r from-brand-gold via-brand-gold-dark to-brand-gold bg-clip-text text-transparent">
              UIN Suska Riau
            </span>
          </h2>
          <p className="font-sans text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            11 mahasiswa penuh semangat dari UIN Suska Riau dengan latar belakang keilmuan yang beragam, berkolaborasi membaktikan diri untuk kemajuan Kelurahan Tanjung Gading.
          </p>
        </motion.div>

        {/* Search and Filters Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12 bg-white border border-brand-gold/15 p-4 rounded-2xl shadow-sm z-10 relative">
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green-dark/40" />
            <input
              type="text"
              placeholder="Cari nama anggota atau prodi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-sand border border-brand-gold/10 hover:border-brand-gold focus:border-brand-gold text-brand-green-dark pl-12 pr-4 py-3 rounded-xl outline-none font-sans text-sm transition-all placeholder:text-brand-green-dark/40"
            />
          </div>

          {/* Filters Select */}
          <div className="w-full lg:w-auto overflow-x-auto lg:overflow-x-visible py-1 scrollbar-none">
            <div className="flex gap-2 flex-nowrap lg:flex-wrap">
              {filters.map((filter) => {
                const isSelected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`font-sans text-xs font-semibold px-4 py-2.5 rounded-full border transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-brand-gold text-white border-brand-gold font-bold shadow-[0_4px_12px_rgba(201,162,39,0.2)]'
                        : 'bg-transparent text-slate-600 border-brand-gold/10 hover:border-brand-gold hover:text-brand-green-dark'
                    }`}
                  >
                    {filter.replace('Divisi ', '')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Members Grid with stagger entry animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 z-10 relative"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const isBPH = member.division === 'BPH (Badan Pengurus Harian)';
                return (
                  <motion.div
                    key={member.id}
                    variants={cardVariants}
                    layout
                  >
                    <FlipCard
                      member={member}
                      isBPH={isBPH}
                      shouldReduce={shouldReduce}
                      onClick={() => setSelectedMember(member)}
                    />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full bg-white p-12 text-center border border-brand-gold/15 rounded-2xl shadow-sm"
              >
                <p className="font-sans text-sm text-slate-600">
                  Tidak ada anggota yang cocok dengan pencarian atau filter Anda.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('Semua');
                  }}
                  className="mt-4 font-sans text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Responsive Slide Drawer (Desktop: Right Side, Mobile: Bottom Sheet) */}
      <AnimatePresence>
        {selectedMember && (
          <>
            {/* Backdrop overlay with blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-brand-green-dark/60 backdrop-blur-md"
              onClick={() => setSelectedMember(null)}
            />
            
            {/* Slide-out Panel */}
            <motion.div
              initial={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
              animate={{ x: 0, y: 0 }}
              exit={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="fixed z-[999] bg-white shadow-[0_-15px_50px_rgba(20,83,45,0.12)] flex flex-col overflow-hidden
                bottom-0 right-0 
                w-full h-[85vh] rounded-t-[32px] border-t border-brand-gold/15
                md:w-[460px] md:h-screen md:rounded-l-[32px] md:rounded-tr-none md:border-l md:border-t-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-5 right-5 text-brand-green-dark/60 hover:text-brand-gold p-2.5 rounded-full bg-brand-cream/80 border border-brand-gold/10 hover:border-brand-gold/30 transition-all cursor-pointer z-50"
              >
                <X size={18} />
              </button>

              {/* Drawer Content */}
              <div className="flex-grow overflow-y-auto p-8 flex flex-col items-center text-center scrollbar-thin">
                {/* Profile Top Decoration Banner */}
                <div className="w-32 h-32 rounded-full border-4 border-brand-gold/25 p-1 mb-5 relative bg-white shrink-0 shadow-md mt-6">
                  <img 
                    src={selectedMember.fotoAnggota || selectedMember.avatar} 
                    alt={selectedMember.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = selectedMember.avatar;
                    }}
                    className="w-full h-full rounded-full object-cover"
                  />
                  {selectedMember.division === 'BPH (Badan Pengurus Harian)' && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-sans font-extrabold tracking-widest text-white bg-brand-gold px-3 py-1 rounded-full shadow-md flex items-center gap-0.5 border border-white">
                      <Award size={9} />
                      BPH
                    </span>
                  )}
                </div>

                <span className="font-sans text-[10px] font-bold tracking-widest text-brand-gold uppercase px-4 py-1.5 rounded-full border border-brand-gold/15 bg-brand-gold/5 mb-3.5 shadow-sm">
                  {selectedMember.division}
                </span>

                <h3 className="font-serif font-bold text-2xl text-brand-green-dark mb-1.5 leading-tight">
                  {selectedMember.name}
                </h3>
                
                <p className="font-sans text-sm text-slate-600 font-semibold mb-1">
                  {selectedMember.role}
                </p>
                
                <p className="font-sans text-xs text-slate-500 mb-6 italic font-medium">
                  Program Studi: {selectedMember.major}
                </p>
                
                <div className="h-0.5 w-24 bg-brand-gold/20 mb-6 shrink-0" />
                
                <p className="font-sans text-sm text-slate-600 leading-relaxed mb-8 flex-grow">
                  {selectedMember.bio}
                </p>

                {/* Social media footer */}
                <div className="mt-auto w-full">
                  <p className="font-sans text-[10px] text-brand-green-dark/40 font-bold uppercase tracking-widest mb-4">Hubungi Anggota:</p>
                  <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {selectedMember.socials?.instagram && (
                      <a 
                        href={selectedMember.socials.instagram} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <Instagram size={16} />
                      </a>
                    )}
                    {selectedMember.socials?.tiktok && (
                      <a 
                        href={selectedMember.socials.tiktok} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <Tiktok size={16} />
                      </a>
                    )}
                    {selectedMember.socials?.linkedin && (
                      <a 
                        href={selectedMember.socials.linkedin} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                    {selectedMember.socials?.github && (
                      <a 
                        href={selectedMember.socials.github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {selectedMember.socials?.facebook && (
                      <a 
                        href={selectedMember.socials.facebook} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <Facebook size={16} />
                      </a>
                    )}
                    {selectedMember.socials?.website && (
                      <a 
                        href={selectedMember.socials.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <Globe size={16} />
                      </a>
                    )}
                    {selectedMember.socials?.email && (
                      <a 
                        href={selectedMember.socials.email.startsWith('mailto:') ? selectedMember.socials.email.trim() : `mailto:${selectedMember.socials.email.trim()}`}
                        className="w-10 h-10 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream hover:bg-white transition-all duration-300 shadow-sm"
                      >
                        <Mail size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Anggota;
