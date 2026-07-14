"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { anggotaData } from '../data/anggotaData';
import { Search, Filter, Instagram, Linkedin, Mail, Users, Github, Facebook, Globe, X, Award } from 'lucide-react';
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

// 3D Parallax Tilt Card Component
const TiltCard = ({ children, className, onClick, shouldReduce, ...props }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateXSpring = useSpring(useTransform(y, [-120, 120], [10, -10]), springConfig);
  const rotateYSpring = useSpring(useTransform(x, [-120, 120], [-10, 10]), springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldReduce ? 0 : rotateXSpring,
        rotateY: shouldReduce ? 0 : rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      onClick={onClick}
      className={className}
      {...props}
    >
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="w-full h-full flex flex-col">
        {children}
      </div>
    </motion.div>
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
          <p className="font-sans text-brand-green-dark/70 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
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
                        : 'bg-transparent text-brand-green-dark/70 border-brand-gold/10 hover:border-brand-gold hover:text-brand-green-dark'
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
                  <TiltCard
                    key={member.id}
                    variants={cardVariants}
                    layout
                    shouldReduce={shouldReduce}
                    onClick={() => setSelectedMember(member)}
                    className={`bg-white border-2 rounded-3xl overflow-hidden flex flex-col group shadow-sm transition-all duration-300 cursor-pointer ${
                      isBPH 
                        ? 'border-brand-gold/35 shadow-[0_4px_20px_rgba(201,162,39,0.12)] hover:border-brand-gold/50' 
                        : 'border-brand-gold/10 hover:border-brand-gold/25'
                    }`}
                  >
                    {/* Profile Top Banner */}
                    <div className="h-24 bg-gradient-to-br from-brand-green-dark to-brand-green relative overflow-hidden">
                      <div className="absolute inset-0 bg-radial-gradient from-brand-gold/10 to-transparent" />
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

                    {/* Avatar position overlaps banner */}
                    <div className="px-8 pb-6 flex-grow flex flex-col items-center -mt-12 relative text-center" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                      <img
                        src={member.fotoAnggota || member.avatar}
                        alt={member.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = member.avatar;
                        }}
                        className="w-24 h-24 rounded-full border-4 border-white bg-brand-cream shadow-md mb-4 object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ transform: "translateZ(10px)" }}
                      />

                      <span className={`font-sans text-[9px] font-bold tracking-widest uppercase mb-1.5 ${isBPH ? 'text-brand-gold-dark' : 'text-brand-green-dark/60'}`}>
                        {member.role}
                      </span>

                      <h3 className="font-serif font-bold text-lg text-brand-green-dark mb-1.5 leading-tight group-hover:text-brand-gold transition-colors duration-300">
                        {member.name}
                      </h3>

                      <p className="font-sans text-[10px] text-brand-green-dark/45 font-bold uppercase tracking-wider mb-4">
                        {member.major}
                      </p>

                      <p className="font-sans text-sm text-brand-green-dark/70 leading-relaxed line-clamp-3 mb-4">
                        {member.bio}
                      </p>
                      
                      <div className="text-[10px] font-sans font-bold text-brand-gold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-auto">
                        Lihat Profil Detail &rarr;
                      </div>
                    </div>
                  </TiltCard>
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
                <p className="font-sans text-sm text-brand-green-dark/70">
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
                
                <p className="font-sans text-sm text-brand-green-dark/70 font-semibold mb-1">
                  {selectedMember.role}
                </p>
                
                <p className="font-sans text-xs text-brand-green-dark/50 mb-6 italic font-medium">
                  Program Studi: {selectedMember.major}
                </p>
                
                <div className="h-0.5 w-24 bg-brand-gold/20 mb-6 shrink-0" />
                
                <p className="font-sans text-sm text-brand-green-dark/75 leading-relaxed mb-8 flex-grow">
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
