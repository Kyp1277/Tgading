"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Calendar, CheckCircle2, AlertCircle, Clock, BookOpen, Loader2 } from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

// Reusable 3D TiltCard Component for Program Kerja Cards
const TiltCard = ({ children, className, shouldReduce, onMouseEnter, onMouseLeave, ...props }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateXSpring = useSpring(useTransform(y, [-120, 120], [8, -8]), springConfig);
  const rotateYSpring = useSpring(useTransform(x, [-120, 120], [-8, 8]), springConfig);

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
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onMouseEnter}
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

const Proker = () => {
  const shouldReduce = useReducedMotion();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEventId, setHoveredEventId] = useState(null);
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
          setEvents(data);
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
          className="text-center mb-16 md:mb-20"
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
          <p className="font-sans text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Rangkaian timeline kegiatan KKN UIN Suska Riau 2026 di Kelurahan Tanjung Gading. Dirancang secara terukur untuk mewujudkan keberlanjutan potensi wilayah.
          </p>
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
          <div ref={timelineRef} className="relative pl-8 md:pl-0">
            
            {/* 1. Background static timeline line */}
            <div className="absolute left-[1.5px] md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-brand-gold/15" />
            
            {/* 2. Scroll-linked glowing progress line */}
            {!shouldReduce && (
              <motion.div 
                style={{ 
                  scaleY: scrollYProgress,
                  transformOrigin: "top"
                }}
                className="absolute left-[1.5px] md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-brand-gold shadow-[0_0_12px_rgba(201,162,39,0.7)]"
              />
            )}
            
            {events.map((event, idx) => {
              const isEven = idx % 2 === 0;
              const isOngoing = event.status === 'Berlangsung';
              const isHovered = hoveredEventId === event.id;
              const styles = getStatusStyles(event.status);
              const StatusIcon = styles.icon;

              return (
                <div key={event.id} className="relative mb-8 md:mb-10 flex flex-col md:flex-row items-stretch overflow-hidden">
                  
                  {/* Timeline Center Bullet Pin with dynamic scale & glow (Opsi F) */}
                  <motion.div 
                    animate={{
                      scale: isHovered ? 1.35 : 1,
                      borderColor: isHovered ? "#c9a227" : "rgba(201, 162, 39, 1)",
                      boxShadow: isHovered ? "0 0 15px rgba(201, 162, 39, 0.85)" : "0 2px 4px rgba(0,0,0,0.05)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute -left-[43px] top-0 md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10"
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
                        className="w-full max-w-xl md:max-w-[460px] lg:max-w-[500px]"
                      >
                        <TiltCard 
                          shouldReduce={shouldReduce}
                          onMouseEnter={() => setHoveredEventId(event.id)}
                          onMouseLeave={() => setHoveredEventId(null)}
                          className={`w-full bg-white border-2 border-brand-gold/10 hover:border-brand-gold/25 border-l-4 border-l-transparent hover:border-l-brand-gold p-8 rounded-3xl transition-all duration-300 text-left cursor-default relative overflow-hidden group ${styles.shadow}`}
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
                        className="w-full max-w-xl md:max-w-[460px] lg:max-w-[500px]"
                      >
                        <TiltCard 
                          shouldReduce={shouldReduce}
                          onMouseEnter={() => setHoveredEventId(event.id)}
                          onMouseLeave={() => setHoveredEventId(null)}
                          className={`w-full bg-white border-2 border-brand-gold/10 hover:border-brand-gold/25 border-l-4 border-l-transparent hover:border-l-brand-gold p-8 rounded-3xl transition-all duration-300 text-left cursor-default relative overflow-hidden group ${styles.shadow}`}
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
    </section>
  );
};

export default Proker;
