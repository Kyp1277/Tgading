"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { anggotaData } from '../data/anggotaData';
import { Search, Filter, Instagram, Linkedin, Mail, Users } from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

const Anggota = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const shouldReduce = useReducedMotion();

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
              filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  variants={cardVariants}
                  layout
                  whileHover={shouldReduce ? {} : { y: -8, scale: 1.02, borderColor: "rgba(201,162,39,0.3)", boxShadow: "0 20px 40px rgba(20,83,45,0.08)" }}
                  className="bg-white border-2 border-brand-gold/10 hover:border-brand-gold/25 rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 shadow-sm"
                >
                  {/* Profile Top Banner */}
                  <div className="h-24 bg-gradient-to-br from-brand-green-dark to-brand-green relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial-gradient from-brand-gold/10 to-transparent" />
                    <div className="absolute top-4 right-4 text-[9px] font-sans font-bold tracking-widest text-brand-gold bg-black/40 px-2.5 py-1 rounded-full border border-brand-gold/15">
                      #{member.id}
                    </div>
                  </div>

                  {/* Avatar position overlaps banner */}
                  <div className="px-8 pb-8 flex-grow flex flex-col items-center -mt-12 relative text-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full border-4 border-white bg-brand-cream shadow-md mb-4 group-hover:scale-105 transition-transform duration-300"
                    />

                    <span className="font-sans text-[9px] font-bold tracking-widest text-brand-gold uppercase mb-1.5">
                      {member.role}
                    </span>

                    <h3 className="font-serif font-bold text-lg text-brand-green-dark mb-1.5 leading-tight group-hover:text-brand-gold transition-colors duration-300">
                      {member.name}
                    </h3>

                    <p className="font-sans text-[10px] text-brand-green-dark/45 font-bold uppercase tracking-wider mb-4">
                      {member.major}
                    </p>

                    <p className="font-sans text-sm text-brand-green-dark/70 leading-relaxed mb-6 flex-grow">
                      {member.bio}
                    </p>

                    <div className="w-full h-px bg-brand-gold/10 mb-5" />

                    {/* Social media icons */}
                    <div className="flex gap-3 justify-center">
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/70 hover:text-brand-gold bg-brand-cream transition-all duration-300"
                      >
                        <Instagram size={14} />
                      </a>
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/70 hover:text-brand-gold bg-brand-cream transition-all duration-300"
                      >
                        <Linkedin size={14} />
                      </a>
                      <a
                        href={member.socials.email.startsWith('mailto:') ? member.socials.email.trim() : `mailto:${member.socials.email.trim()}`}
                        className="w-9 h-9 rounded-full border border-brand-gold/20 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/70 hover:text-brand-gold bg-brand-cream transition-all duration-300"
                      >
                        <Mail size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
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
    </section>
  );
};

export default Anggota;
