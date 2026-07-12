"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { anggotaData } from '../data/anggotaData';
import { Instagram, Linkedin, Mail, X, Award } from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

const Struktur = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const shouldReduce = useReducedMotion();

  // BPH mapping
  const ketua = anggotaData.find(m => m.id === 1);
  const bphMembers = anggotaData.filter(m => [2, 3, 4].includes(m.id)); // Lisa, Nur Annisa, Tasya

  // Division mappings (Coordinator + Staff)
  const divisions = [
    {
      name: 'Divisi Humas',
      kordiv: anggotaData.find(m => m.id === 5), // Rifky
      staff: [anggotaData.find(m => m.id === 6)] // Wardi
    },
    {
      name: 'Divisi PDD',
      kordiv: anggotaData.find(m => m.id === 7), // Walfajri
      staff: [anggotaData.find(m => m.id === 8)] // Nadira
    },
    {
      name: 'Divisi Acara',
      kordiv: anggotaData.find(m => m.id === 9), // Anisa
      staff: [anggotaData.find(m => m.id === 10)] // Namira
    },
    {
      name: 'Divisi Logistik',
      kordiv: anggotaData.find(m => m.id === 11), // Dian
      staff: [] // No staff
    }
  ];

  const MemberNode = ({ member }) => {
    if (!member) return null;
    return (
      <motion.div 
        onClick={() => setSelectedMember(member)}
        whileHover={shouldReduce ? {} : { y: -6, scale: 1.02, boxShadow: "0 15px 35px rgba(20,83,45,0.08)" }}
        whileTap={{ scale: 0.98 }}
        className="relative bg-white border-2 border-brand-gold/15 hover:border-brand-gold p-7 md:p-8 rounded-3xl w-64 sm:w-72 text-center flex flex-col items-center cursor-pointer shadow-sm group select-none transition-all duration-300 z-10"
      >
        <span className="absolute top-4 right-5 font-sans text-[9px] font-bold text-brand-gold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Detail
        </span>
        <img 
          src={member.fotoStruktur || member.avatar} 
          alt={member.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = member.avatar;
          }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-brand-gold bg-brand-cream mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300"
        />
        <h4 className="font-serif font-bold text-sm md:text-base text-brand-green-dark leading-tight mb-1.5 truncate w-full">
          {member.name}
        </h4>
        <p className="font-sans text-[10px] md:text-xs text-brand-gold font-bold tracking-wide uppercase">
          {member.division.startsWith('Divisi') ? member.division : member.role}
        </p>
        <p className="font-sans text-[10px] md:text-xs text-brand-green-dark/50 mt-1">
          {member.major}
        </p>
      </motion.div>
    );
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-24 md:pb-24 w-full bg-[#F5F8F5] min-h-screen overflow-hidden">
      
      {/* Background decorations */}
      <BackgroundDecor variant="struktur" />

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
            <Award size={12} />
            Struktur Organisasi
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl lg:text-[44px] text-brand-green-dark mt-4 mb-6 leading-tight">
            Bagan Kepengurusan KKN <br />
            <span className="bg-gradient-to-r from-brand-gold via-brand-gold-dark to-brand-gold bg-clip-text text-transparent">
              Kelurahan Tanjung Gading
            </span>
          </h2>
          <p className="font-sans text-brand-green-dark/70 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Sinergi antar divisi dalam Badan Pengurus Harian dan unit divisi teknis di lapangan untuk memastikan keberhasilan seluruh program pengabdian. Klik pada kartu anggota untuk melihat profil lengkap.
          </p>
        </motion.div>

        {/* Chart Layout */}
        <div className="flex flex-col items-center gap-8 overflow-x-auto py-8 scrollbar-thin">
          
          {/* Level 1: Ketua */}
          <motion.div 
            initial={{ opacity: 0, y: shouldReduce ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center relative"
          >
            <MemberNode member={ketua} />
            {/* Animated Connector Line going straight down */}
            {!shouldReduce && (
              <svg className="w-1 h-8 absolute -bottom-8 left-1/2 -translate-x-1/2 overflow-visible pointer-events-none">
                <motion.line 
                  x1="2" y1="0" x2="2" y2="32" 
                  stroke="#c9a227" strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </svg>
            )}
          </motion.div>

          {/* Level 2: BPH (Lisa, Nur Annisa, Tasya) */}
          <motion.div 
            initial={{ opacity: 0, y: shouldReduce ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: shouldReduce ? 0 : 0.2 }}
            className="pt-8 relative w-full flex flex-col items-center"
          >
            {/* Thicker Horizontal connecting bridge across 3 cards */}
            {!shouldReduce && (
              <>
                <svg className="hidden md:block absolute top-0 left-[20%] right-[20%] h-[3px] w-[60%] overflow-visible pointer-events-none">
                  <motion.line 
                    x1="0" y1="1.5" x2="100%" y2="1.5" 
                    stroke="#c9a227" strokeWidth="3" opacity="0.35"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </svg>
                {/* 3 drops: Left drop */}
                <svg className="hidden md:block absolute top-0 left-[20%] w-1 h-8 overflow-visible pointer-events-none">
                  <motion.line x1="2" y1="0" x2="2" y2="32" stroke="#c9a227" strokeWidth="3" opacity="0.35"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.4 }} />
                </svg>
                {/* Center drop */}
                <svg className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 overflow-visible pointer-events-none">
                  <motion.line x1="2" y1="0" x2="2" y2="32" stroke="#c9a227" strokeWidth="3" opacity="0.35"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.4 }} />
                </svg>
                {/* Right drop */}
                <svg className="hidden md:block absolute top-0 right-[20%] w-1 h-8 overflow-visible pointer-events-none">
                  <motion.line x1="2" y1="0" x2="2" y2="32" stroke="#c9a227" strokeWidth="3" opacity="0.35"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.4 }} />
                </svg>
              </>
            )}

            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 pt-4 md:pt-8">
              {bphMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center">
                  <MemberNode member={member} />
                </div>
              ))}
            </div>

            {/* Central drop line to Kordivs */}
            {!shouldReduce && (
              <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 overflow-visible pointer-events-none">
                <motion.line 
                  x1="2" y1="0" x2="2" y2="32" 
                  stroke="#c9a227" strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </svg>
            )}
          </motion.div>

          {/* Level 3: Divisions (Coordinator + Staff branches) */}
          <motion.div 
            initial={{ opacity: 0, y: shouldReduce ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: shouldReduce ? 0 : 0.4 }}
            className="pt-8 relative w-full flex flex-col items-center"
          >
            {/* Horizontal line connecting divisions */}
            {!shouldReduce && (
              <svg className="hidden lg:block absolute top-0 left-[12.5%] right-[12.5%] h-[3px] w-[75%] overflow-visible pointer-events-none">
                <motion.line 
                  x1="0" y1="1.5" x2="100%" y2="1.5" 
                  stroke="#c9a227" strokeWidth="3" opacity="0.25"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
              </svg>
            )}
            
            <div className="flex flex-col lg:flex-row justify-center items-start gap-12 lg:gap-6 w-full">
              {divisions.map((div, idx) => (
                <div key={idx} className="flex flex-col items-center relative pt-4 lg:pt-8 w-full lg:w-auto">
                  
                  {/* Top-bridge drop to Coordinator */}
                  {!shouldReduce && (
                    <svg className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 overflow-visible pointer-events-none">
                      <motion.line 
                        x1="2" y1="0" x2="2" y2="32" 
                        stroke="#c9a227" strokeWidth="3" opacity="0.25"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                      />
                    </svg>
                  )}

                  {/* Division Column Content */}
                  <div className="flex flex-col items-center">
                    {/* Coordinator Node */}
                    <MemberNode member={div.kordiv} />
                    
                    {/* Staff Nodes if available */}
                    {div.staff.map((staffMember, staffIdx) => (
                      <React.Fragment key={staffMember.id}>
                        {/* Connector Line between Coordinator and Staff */}
                        {!shouldReduce && (
                          <svg className="w-1 h-8 overflow-visible pointer-events-none my-1">
                            <motion.line 
                              x1="2" y1="0" x2="2" y2="32" 
                              stroke="#c9a227" strokeWidth="3" opacity="0.35"
                              initial={{ pathLength: 0 }}
                              whileInView={{ pathLength: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                          </svg>
                        )}
                        <MemberNode member={staffMember} />
                      </React.Fragment>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-green-dark/80 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white max-w-lg w-full rounded-3xl overflow-hidden border border-brand-gold/30 shadow-[0_20px_50px_rgba(201,162,39,0.15)] relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 text-brand-green-dark/60 hover:text-brand-gold p-2 rounded-full bg-brand-cream/60 border border-brand-gold/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Profile Info */}
              <div className="p-8 flex flex-col items-center text-center">
                <img 
                  src={selectedMember.fotoStruktur || selectedMember.avatar} 
                  alt={selectedMember.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = selectedMember.avatar;
                  }}
                  className="w-24 h-24 rounded-full border-2 border-brand-gold bg-brand-cream mb-4 shadow-sm"
                />
                <span className="font-sans text-[10px] font-bold tracking-widest text-brand-gold uppercase px-3.5 py-1.5 rounded-full border border-brand-gold/15 bg-brand-gold/5 mb-2">
                  {selectedMember.division}
                </span>
                <h3 className="font-serif font-bold text-xl text-brand-green-dark mb-1">
                  {selectedMember.name}
                </h3>
                <p className="font-sans text-sm text-brand-green-dark/70 font-semibold mb-3">
                  {selectedMember.role}
                </p>
                <p className="font-sans text-xs text-brand-green-dark/50 mb-6 italic">
                  Program Studi: {selectedMember.major}
                </p>
                
                <div className="h-px w-full bg-brand-gold/15 mb-6" />
                
                <p className="font-sans text-sm text-brand-green-dark/75 leading-relaxed mb-8">
                  {selectedMember.bio}
                </p>

                {/* Social links */}
                <div className="flex gap-4">
                  <a 
                    href={selectedMember.socials.instagram} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-brand-gold/25 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream transition-all duration-300 shadow-sm"
                  >
                    <Instagram size={16} />
                  </a>
                  <a 
                    href={selectedMember.socials.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-brand-gold/25 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream transition-all duration-300 shadow-sm"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a 
                    href={selectedMember.socials.email.startsWith('mailto:') ? selectedMember.socials.email.trim() : `mailto:${selectedMember.socials.email.trim()}`}
                    className="w-10 h-10 rounded-full border border-brand-gold/25 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/80 hover:text-brand-gold bg-brand-cream transition-all duration-300 shadow-sm"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Struktur;
