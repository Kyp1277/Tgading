"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Loader2, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';
import PlakatModal from './PlakatModal';

// Reusable 3D TiltCard Component for Program Kerja Cards
const TiltCard = ({ children, className, shouldReduce, onMouseEnter, onMouseLeave, ...props }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateXSpring = useSpring(useTransform(y, [-120, 120], [8, -8]), springConfig);
  const rotateYSpring = useSpring(useTransform(x, [-120, 120], [-8, 8]), springConfig);

  const handleMouseMove = (e) => {
    if (shouldReduce || (typeof window !== 'undefined' && window.innerWidth < 768)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    x.set(0);
    y.set(0);
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onMouseEnter}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: shouldReduce ? 0 : rotateXSpring,
        rotateY: shouldReduce ? 0 : rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      className={className}
      {...props}
    >
      <div style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }} className="w-full h-full flex flex-col relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const parseProkerDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return new Date(0);

  let startPart = dateStr.split('-')[0].trim();
  const yearMatch = dateStr.match(/\b(20\d\d)\b/);
  const year = yearMatch ? yearMatch[1] : new Date().getFullYear().toString();

  if (!/\b(20\d\d)\b/.test(startPart)) {
    startPart = `${startPart} ${year}`;
  }

  const months = {
    januari: 0, jan: 0,
    februari: 1, feb: 1,
    maret: 2, mar: 2,
    april: 3, apr: 3,
    mei: 4,
    juni: 5, jun: 5,
    juli: 6, jul: 6,
    agustus: 7, agust: 7, agu: 7, ags: 7,
    september: 8, sep: 8,
    oktober: 9, okt: 9,
    november: 10, nov: 10,
    desember: 11, des: 11
  };

  const parts = startPart.toLowerCase().split(/\s+/);
  
  if (parts.length === 1 && parts[0].includes('-')) {
    const d = new Date(parts[0]);
    if (!isNaN(d.getTime())) return d;
  }

  let day = 1;
  let month = 0;
  let parsedYear = parseInt(year, 10);

  for (const part of parts) {
    if (/^\d{1,2}$/.test(part)) {
      day = parseInt(part, 10);
    } else if (/^\d{4}$/.test(part)) {
      parsedYear = parseInt(part, 10);
    } else if (months[part] !== undefined) {
      month = months[part];
    }
  }

  return new Date(parsedYear, month, day);
};

const Proker = () => {
  const shouldReduce = useReducedMotion();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const [isPlakatModalOpen, setIsPlakatModalOpen] = useState(false);
  const timelineRef = useRef(null);

  // Hook Framer Motion untuk mendeteksi progress scroll pada elemen linimasa
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  useEffect(() => {
    const fetchProker = async () => {
      try {
        const res = await fetch('/api/proker');
        if (res.ok) {
          const data = await res.json();
          const sorted = data.sort((a, b) => parseProkerDate(a.date) - parseProkerDate(b.date));
          setEvents(sorted);
        }
      } catch (e) {
        console.error("Gagal memuat program kerja", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProker();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Selesai':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
          shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
        };
      case 'Berlangsung':
        return {
          icon: AlertCircle,
          color: 'text-brand-gold',
          bg: 'bg-brand-gold/10',
          shadow: 'shadow-[0_0_12px_rgba(201,162,39,0.25)]',
        };
      default:
        return {
          icon: Clock,
          color: 'text-brand-green',
          bg: 'bg-brand-green/10',
          shadow: 'shadow-sm',
        };
    }
  };

  const isPlakatProker = (event) => {
    if (!event) return false;
    const title = (event.title || '').toLowerCase();
    const desc = (event.desc || '').toLowerCase();
    return Boolean(
      event.hasDocumentation ||
      event.docType === 'plakat' ||
      event.id === 6 ||
      title.includes('signage') ||
      title.includes('plakat') ||
      title.includes('plang') ||
      title.includes('identitas') ||
      desc.includes('signage') ||
      desc.includes('plakat') ||
      desc.includes('plang') ||
      desc.includes('papan informasi')
    );
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-24 md:pb-24 w-full bg-white min-h-screen overflow-hidden">
      
      {/* Reusable background decorations */}
      <BackgroundDecor variant="proker" />

      <div className="max-w-[1360px] mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduce ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full inline-flex items-center gap-1.5">
            <BookOpen size={12} />
            Rencana Kerja
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl lg:text-[44px] text-brand-green-dark mt-4 mb-6 leading-tight">
            Program Kerja KKN <br />
            <span className="bg-gradient-to-r from-brand-gold via-brand-gold-dark to-brand-gold bg-clip-text text-transparent">
              Kelurahan Tanjung Gading
            </span>
          </h2>
          <p className="font-sans text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base mb-6">
            Rangkaian timeline kegiatan KKN UIN Suska Riau 2026 di Kelurahan Tanjung Gading. Dirancang secara terukur untuk mewujudkan keberlanjutan potensi wilayah.
          </p>

          {/* Quick Spotlight Banner for Plakat & Signage RT/RW */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 bg-brand-cream/90 border border-brand-gold/40 hover:border-brand-gold py-2 px-4 md:px-5 rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group"
            onClick={() => setIsPlakatModalOpen(true)}
          >
            <div className="flex items-center -space-x-2 overflow-hidden">
              <img src="/images/plakat/plakat_1.jpg" alt="Preview 1" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
              <img src="/images/plakat/plakat_7.jpg" alt="Preview 2" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
              <img src="/images/plakat/plakat_13.jpg" alt="Preview 3" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
            </div>
            <span className="font-sans text-xs md:text-sm font-bold text-brand-green-dark group-hover:text-brand-gold-dark transition-colors flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-gold" />
              Dokumentasi Spesial: Penyerahan Plakat & Signage RT/RW (21 Foto)
              <ArrowRight size={13} className="text-brand-gold group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-gold animate-spin mb-4" />
            <p className="font-sans text-slate-500 text-sm">Memuat linimasa program...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center bg-brand-cream/5 rounded-3xl border border-brand-gold/10 max-w-2xl mx-auto">
            <p className="font-sans text-sm text-slate-500">Belum ada program kerja yang terdaftar saat ini.</p>
          </div>
        ) : (
          /* Timeline Layout Container */
          <div ref={timelineRef} className="relative pl-10 md:pl-0">
            
            {/* 1. Background static timeline line */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-brand-gold/15" />
            
            {/* 2. Scroll-linked glowing progress line */}
            {!shouldReduce && (
              <motion.div 
                style={{ 
                  scaleY: scrollYProgress,
                  transformOrigin: "top"
                }}
                className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-brand-gold shadow-[0_0_12px_rgba(201,162,39,0.7)]"
              />
            )}
            
            {events.map((event, idx) => {
              const isEven = idx % 2 === 0;
              const isOngoing = event.status === 'Berlangsung';
              const isHovered = hoveredEventId === event.id;
              const styles = getStatusStyles(event.status);
              const StatusIcon = styles.icon;
              const hasDoc = isPlakatProker(event);

              return (
                <div key={event.id} className="relative mb-8 md:mb-12 flex flex-col md:flex-row items-stretch overflow-hidden">
                  
                  {/* Timeline Center Bullet Pin with dynamic scale & glow */}
                  <motion.div 
                    animate={{
                      scale: isHovered ? 1.35 : 1,
                      borderColor: isHovered ? "#c9a227" : "rgba(201, 162, 39, 1)",
                      boxShadow: isHovered ? "0 0 15px rgba(201, 162, 39, 0.85)" : "0 2px 4px rgba(0,0,0,0.05)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute left-1 top-0 md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10"
                  >
                    {(isOngoing || isHovered) && (
                      <span className="absolute inset-0 rounded-full bg-brand-gold/45 animate-ping z-0 pointer-events-none" />
                    )}
                    <svg viewBox="0 0 100 100" className="w-2.5 h-2.5 fill-brand-gold z-10 transition-transform duration-300" style={{ transform: isHovered ? "scale(1.2)" : "scale(1)" }}>
                      <ellipse cx="50" cy="50" rx="30" ry="35" />
                      <path d="M 50,15 C 50,5 40,5 50,0 C 60,5 50,5 50,15" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </motion.div>

                  {/* Grid content alignment (Even cards on left on desktop) */}
                  <div className="w-full md:w-1/2 flex items-center justify-end pr-0 md:pr-10 md:text-right select-none order-2 md:order-1">
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: shouldReduce ? 0 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-xl md:max-w-[480px] lg:max-w-[520px]"
                      >
                        <TiltCard 
                          shouldReduce={shouldReduce}
                          onMouseEnter={() => setHoveredEventId(event.id)}
                          onMouseLeave={() => setHoveredEventId(null)}
                          className={`w-full bg-white border-2 border-brand-gold/15 hover:border-brand-gold/40 border-l-4 border-l-transparent hover:border-l-brand-gold p-6 md:p-8 rounded-3xl transition-all duration-300 text-left cursor-default relative overflow-hidden group ${styles.shadow}`}
                        >
                          {/* Subtle Gold Glow on Hover */}
                          <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-brand-gold/5 group-hover:bg-brand-gold/15 blur-xl transition-all duration-300 pointer-events-none" />
                          
                          <div className="flex items-center justify-between md:justify-start gap-3 mb-3.5 relative z-10">
                            <span className="font-sans text-xs font-bold text-brand-gold flex items-center gap-1.5 order-2 md:order-1">
                              <Calendar size={12} />
                              {event.date}
                            </span>
                            <span className={`font-sans text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${styles.bg} ${styles.color} border border-brand-gold/10 order-1 md:order-2 flex items-center gap-1`}>
                              <StatusIcon size={10} />
                              {event.status}
                            </span>
                          </div>
                          
                          <h3 className="font-serif font-bold text-xl md:text-[22px] text-brand-green-dark mb-2.5 leading-tight relative z-10 transition-colors group-hover:text-brand-gold duration-200">
                            {event.title}
                          </h3>
                          
                          <p className="font-sans text-sm md:text-[15px] text-slate-600 leading-relaxed relative z-10">
                            {event.desc}
                          </p>

                          {/* Documentation Showcase Button for Plakat RT/RW */}
                          {hasDoc && (
                            <div className="mt-5 pt-4 border-t border-brand-gold/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center -space-x-2.5 overflow-hidden">
                                  <img 
                                    src="/images/plakat/plakat_1.jpg" 
                                    alt="Plakat 1" 
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                                  />
                                  <img 
                                    src="/images/plakat/plakat_7.jpg" 
                                    alt="Plakat 7" 
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                                  />
                                  <img 
                                    src="/images/plakat/plakat_13.jpg" 
                                    alt="Plakat 13" 
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                                  />
                                </div>
                                <span className="font-sans text-[11px] font-bold text-brand-green-dark bg-brand-gold/20 px-2 py-0.5 rounded-full border border-brand-gold/30">
                                  21 Foto Dokumentasi
                                </span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPlakatModalOpen(true);
                                }}
                                className="font-sans text-xs font-bold text-white bg-brand-green-dark hover:bg-brand-gold-dark hover:text-white px-4 py-2.5 rounded-full border border-brand-gold/30 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                              >
                                <ImageIcon size={14} className="text-brand-gold group-hover/btn:text-white transition-colors" />
                                <span>Lihat Dokumentasi Lengkap</span>
                                <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          )}
                        </TiltCard>
                      </motion.div>
                    )}
                  </div>

                  {/* Spacer on desktop */}
                  <div className="hidden md:block w-0.5" />

                  {/* Right column (Odd cards on right on desktop) */}
                  <div className="w-full md:w-1/2 flex items-center justify-start pl-0 md:pl-10 order-3">
                    {!isEven && (
                      <motion.div 
                        initial={{ opacity: 0, x: shouldReduce ? 0 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-xl md:max-w-[480px] lg:max-w-[520px]"
                      >
                        <TiltCard 
                          shouldReduce={shouldReduce}
                          onMouseEnter={() => setHoveredEventId(event.id)}
                          onMouseLeave={() => setHoveredEventId(null)}
                          className={`w-full bg-white border-2 border-brand-gold/15 hover:border-brand-gold/40 border-l-4 border-l-transparent hover:border-l-brand-gold p-6 md:p-8 rounded-3xl transition-all duration-300 text-left cursor-default relative overflow-hidden group ${styles.shadow}`}
                        >
                          {/* Subtle Gold Glow on Hover */}
                          <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-brand-gold/5 group-hover:bg-brand-gold/15 blur-xl transition-all duration-300 pointer-events-none" />

                          <div className="flex items-center justify-between gap-3 mb-3.5 relative z-10">
                            <span className="font-sans text-xs font-bold text-brand-gold flex items-center gap-1.5">
                              <Calendar size={12} />
                              {event.date}
                            </span>
                            <span className={`font-sans text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${styles.bg} ${styles.color} border border-brand-gold/10 flex items-center gap-1`}>
                              <StatusIcon size={10} />
                              {event.status}
                            </span>
                          </div>
                          
                          <h3 className="font-serif font-bold text-xl md:text-[22px] text-brand-green-dark mb-2.5 leading-tight relative z-10 transition-colors group-hover:text-brand-gold duration-200">
                            {event.title}
                          </h3>
                          
                          <p className="font-sans text-sm md:text-[15px] text-slate-600 leading-relaxed relative z-10">
                            {event.desc}
                          </p>

                          {/* Documentation Showcase Button for Plakat RT/RW */}
                          {hasDoc && (
                            <div className="mt-5 pt-4 border-t border-brand-gold/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center -space-x-2.5 overflow-hidden">
                                  <img 
                                    src="/images/plakat/plakat_1.jpg" 
                                    alt="Plakat 1" 
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                                  />
                                  <img 
                                    src="/images/plakat/plakat_7.jpg" 
                                    alt="Plakat 7" 
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                                  />
                                  <img 
                                    src="/images/plakat/plakat_13.jpg" 
                                    alt="Plakat 13" 
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                                  />
                                </div>
                                <span className="font-sans text-[11px] font-bold text-brand-green-dark bg-brand-gold/20 px-2 py-0.5 rounded-full border border-brand-gold/30">
                                  21 Foto Dokumentasi
                                </span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPlakatModalOpen(true);
                                }}
                                className="font-sans text-xs font-bold text-white bg-brand-green-dark hover:bg-brand-gold-dark hover:text-white px-4 py-2.5 rounded-full border border-brand-gold/30 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer group/btn"
                              >
                                <ImageIcon size={14} className="text-brand-gold group-hover/btn:text-white transition-colors" />
                                <span>Lihat Dokumentasi Lengkap</span>
                                <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          )}
                        </TiltCard>
                      </motion.div>
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* Interactive Plakat Documentation Modal */}
      <PlakatModal
        isOpen={isPlakatModalOpen}
        onClose={() => setIsPlakatModalOpen(false)}
      />
    </section>
  );
};

export default Proker;
