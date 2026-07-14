"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MapPin, Users, Activity, Leaf, Shield, BookOpen, X, Navigation, ExternalLink } from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

const DesaProfile = () => {
  const shouldReduce = useReducedMotion();
  const [activeHotspot, setActiveHotspot] = useState(null);

  const hotspotsData = {
    lurah: {
      name: 'Kantor Lurah Tanjung Gading',
      role: 'Pusat Pemerintahan & Layanan Publik',
      desc: 'Pusat pelayanan administrasi dan birokrasi Kelurahan Tanjung Gading. Di sinilah kami berdiskusi dan menjalankan program kerja digitalisasi kelurahan.',
      gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Lurah+Tanjung+Gading+Pasir+Penyu+Riau',
    },
    posko: {
      name: 'Posko KKN UIN Suska Riau 2026',
      role: 'Markas & Pusat Kegiatan Mahasiswa',
      desc: 'Rumah tinggal sekaligus tempat koordinasi seluruh program pengabdian tim KKN, tempat diskusi bersama masyarakat, dan pusat bimbingan belajar ceria.',
      gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tanjung+Gading+Pasir+Penyu+Indragiri+Hulu+Riau',
    }
  };

  const stats = [
    { label: 'Kecamatan', value: 'Pasir Penyu', icon: MapPin },
    { label: 'Kabupaten', value: 'Indragiri Hulu', icon: Shield },
    { label: 'Potensi Utama', value: 'Sawit & Karet', icon: Leaf },
    { label: 'Kepadatan Penduduk', value: 'Sedang', icon: Users },
  ];

  const potentials = [
    {
      title: 'Perkebunan Kelapa Sawit & Karet',
      desc: 'Sebagian besar wilayah kelurahan didominasi oleh lahan perkebunan produktif yang dikelola secara mandiri oleh warga maupun kemitraan lokal.',
      icon: Leaf,
    },
    {
      title: 'UMKM Kerajinan & Kuliner',
      desc: 'Masyarakat Tanjung Gading kreatif dalam mengolah hasil kebun dan membuat kudapan khas Riau serta kerajinan tangan bernilai ekonomi.',
      icon: Activity,
    },
    {
      title: 'Pendidikan & Keagamaan',
      desc: 'Memiliki basis keagamaan yang kuat dengan sarana masjid/mushola aktif serta antusiasme tinggi dari anak-anak kelurahan untuk belajar.',
      icon: BookOpen,
    },
  ];

  // Stagger container definitions
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-24 md:pb-24 w-full bg-white overflow-hidden min-h-screen">
      
      {/* Reusable consistent background decorations */}
      <BackgroundDecor variant="profile" />

      <div className="max-w-[1360px] mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduce ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full">
            Profil Wilayah KKN
          </span>
          <h2 className="font-serif font-bold text-3xl md:text-5xl lg:text-[44px] text-brand-green-dark mt-4 mb-6 leading-tight">
            Mengenal Lebih Dekat <br />
            <span className="bg-gradient-to-r from-brand-gold via-brand-gold-dark to-brand-gold bg-clip-text text-transparent">
              Kelurahan Tanjung Gading
            </span>
          </h2>
          <p className="font-sans text-brand-green-dark/70 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
            Kelurahan Tanjung Gading terletak di Kecamatan Pasir Penyu, Kabupaten Indragiri Hulu, Riau. Sebuah kawasan yang asri dengan kehangatan warganya, semangat gotong royong yang tinggi, serta alam perkebunan yang subur.
          </p>
        </motion.div>

        {/* Quick Stats Grid - padding 28px and gap 24px */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={shouldReduce ? {} : { y: -6, borderColor: "rgba(201,162,39,0.35)", boxShadow: "0 15px 30px rgba(20,83,45,0.06)" }}
                className="bg-white border-2 border-brand-gold/10 p-7 md:p-8 text-center rounded-[32px] transition-all duration-300 shadow-sm"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-3">
                  <Icon size={18} />
                </div>
                <p className="font-sans text-[10px] text-brand-green-dark/50 uppercase tracking-wider mb-1 font-bold">{stat.label}</p>
                <p className="font-serif font-bold text-base md:text-lg text-brand-green-dark">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Two Column Layout (About and Map Mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left: About Details */}
          <motion.div 
            initial={{ opacity: 0, x: shouldReduce ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <h3 className="font-serif font-bold text-2xl text-brand-green-dark">
              Geografi & Kehidupan Sosial
            </h3>
            <p className="font-sans text-sm md:text-base text-brand-green-dark/70 leading-relaxed">
              Secara geografis, Tanjung Gading dikelilingi oleh lanskap alam yang hijau khas Sumatra Tengah. Kecamatan Pasir Penyu sendiri memiliki nilai historis yang kaya di Kabupaten Indragiri Hulu (Inhu), menjadi hub perdagangan serta pusat aktivitas masyarakat di sepanjang aliran Sungai Indragiri.
            </p>
            <p className="font-sans text-sm md:text-base text-brand-green-dark/70 leading-relaxed">
              Masyarakat kelurahan didominasi oleh suku Melayu, Jawa, dan Minang yang hidup berdampingan secara damai. Kegiatan adat istiadat, pengajian mingguan, dan kerja bakti kebersihan lingkungan merupakan rutinitas yang mempererat tali kekeluargaan antar dusun di Tanjung Gading.
            </p>
            <div className="p-5 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 text-xs md:text-sm text-brand-gold flex items-start gap-3">
              <MapPin className="shrink-0 mt-0.5 text-brand-gold" size={18} />
              <span>
                <strong>Fokus KKN:</strong> Melalui program KKN UIN Suska Riau 2026, kami berfokus membantu administrasi kelurahan berbasis digital, pemetaan potensi wilayah, edukasi anak-anak, serta pendampingan UMKM lokal.
              </span>
            </div>
          </motion.div>

          {/* Right: Interactive Map Card */}
          <motion.div 
            initial={{ opacity: 0, x: shouldReduce ? 0 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 w-full aspect-square bg-white p-6 border-2 border-brand-gold/10 hover:border-brand-gold/25 rounded-[32px] flex flex-col justify-between relative overflow-hidden shadow-sm transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-center mb-2 z-10">
              <span className="font-serif font-bold text-xs tracking-wider text-brand-gold">
                Peta Lokasi Interaktif
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            </div>

            {/* Legend / Quick select tabs */}
            <div className="z-10 text-left mb-2">
              <p className="font-sans text-[10px] text-brand-green-dark/60 font-bold uppercase tracking-wider mb-1.5">
                Pilih pin atau lokasi untuk info detail:
              </p>
              <div className="flex gap-2.5">
                <button 
                  onClick={() => setActiveHotspot(activeHotspot === 'lurah' ? null : 'lurah')}
                  className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                    activeHotspot === 'lurah' 
                      ? 'bg-brand-green text-white border-brand-green shadow-sm' 
                      : 'bg-brand-cream text-brand-green-dark/80 border-brand-gold/10 hover:border-brand-gold'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Kantor Lurah
                </button>
                <button 
                  onClick={() => setActiveHotspot(activeHotspot === 'posko' ? null : 'posko')}
                  className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                    activeHotspot === 'posko' 
                      ? 'bg-brand-gold text-white border-brand-gold shadow-sm' 
                      : 'bg-brand-cream text-brand-green-dark/80 border-brand-gold/10 hover:border-brand-gold'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Posko KKN
                </button>
              </div>
            </div>

            {/* Stylized Map SVG with Interactive Hotspots */}
            <div className="w-full flex-grow flex items-center justify-center my-2 relative">
              <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-[0_4px_15px_rgba(201,162,39,0.12)] z-10">
                {/* Rivers */}
                <path d="M -10,100 Q 40,80 80,110 Q 120,140 210,120" fill="none" stroke="#1b4332" strokeWidth="4" opacity="0.3" />
                <path d="M -10,100 Q 40,80 80,110 Q 120,140 210,120" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.5" strokeDasharray="3 3" />
                {/* Land boundary outline */}
                <path d="M 30,40 C 70,20 150,30 170,60 C 190,90 160,150 140,170 C 110,190 50,170 30,140 C 10,110 20,60 30,40 Z" 
                      fill="rgba(20, 83, 45, 0.04)" stroke="#c9a227" strokeWidth="1.5" />
                {/* Plantation Grid overlay */}
                <path d="M 50,60 Q 80,50 120,65" fill="none" stroke="rgba(20, 83, 45, 0.08)" strokeWidth="1" />
                <path d="M 40,90 Q 90,80 140,100" fill="none" stroke="rgba(20, 83, 45, 0.08)" strokeWidth="1" />
                <path d="M 60,130 Q 100,120 150,135" fill="none" stroke="rgba(20, 83, 45, 0.08)" strokeWidth="1" />

                {/* Hotspot 1: Kantor Lurah */}
                <g 
                  transform="translate(75, 70)" 
                  onClick={() => setActiveHotspot(activeHotspot === 'lurah' ? null : 'lurah')}
                  className="cursor-pointer group/pin"
                >
                  <circle cx="0" cy="0" r="10" fill="rgba(27, 67, 50, 0.15)" className="animate-ping" style={{ animationDuration: '3s' }} />
                  <circle cx="0" cy="0" r="5" className={`transition-colors duration-300 ${activeHotspot === 'lurah' ? 'fill-brand-green' : 'fill-[#1b4332] group-hover/pin:fill-brand-green'}`} />
                  <circle cx="0" cy="0" r="8" stroke="#1b4332" strokeWidth="1.2" fill="none" className="group-hover/pin:scale-110 transition-transform duration-300" />
                  
                  {/* Tooltip text (SVG) */}
                  <g className="opacity-0 group-hover/pin:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <rect x="-45" y="-24" width="90" height="16" rx="4" fill="#1b4332" />
                    <text x="0" y="-13" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      Kantor Lurah
                    </text>
                  </g>
                </g>

                {/* Hotspot 2: Posko KKN */}
                <g 
                  transform="translate(135, 115)" 
                  onClick={() => setActiveHotspot(activeHotspot === 'posko' ? null : 'posko')}
                  className="cursor-pointer group/pin"
                >
                  <circle cx="0" cy="0" r="10" fill="rgba(201, 162, 39, 0.2)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                  <circle cx="0" cy="0" r="5" className={`transition-colors duration-300 ${activeHotspot === 'posko' ? 'fill-brand-gold' : 'fill-[#c9a227] group-hover/pin:fill-brand-gold'}`} />
                  <circle cx="0" cy="0" r="8" stroke="#c9a227" strokeWidth="1.2" fill="none" className="group-hover/pin:scale-110 transition-transform duration-300" />
                  
                  {/* Tooltip text (SVG) */}
                  <g className="opacity-0 group-hover/pin:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <rect x="-40" y="-24" width="80" height="16" rx="4" fill="#c9a227" />
                    <text x="0" y="-13" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                      Posko KKN
                    </text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Details Slide-up Overlay */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="absolute inset-x-0 bottom-0 bg-white border-t border-brand-gold/20 p-5 z-20 rounded-t-[28px] shadow-[0_-8px_25px_rgba(20,83,45,0.08)] flex flex-col justify-between"
                  style={{ height: '65%' }}
                >
                  <div>
                    {/* Header info */}
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="text-left">
                        <span className={`font-sans text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          activeHotspot === 'lurah' 
                            ? 'bg-brand-green/10 text-brand-green-dark border-brand-green/10' 
                            : 'bg-brand-gold/10 text-brand-gold-dark border-brand-gold/10'
                        }`}>
                          {hotspotsData[activeHotspot].role}
                        </span>
                        <h4 className="font-serif font-bold text-sm md:text-base text-brand-green-dark mt-2 leading-tight">
                          {hotspotsData[activeHotspot].name}
                        </h4>
                      </div>
                      
                      {/* Close button */}
                      <button 
                        onClick={() => setActiveHotspot(null)}
                        className="p-1 rounded-full hover:bg-brand-cream text-brand-green-dark/40 hover:text-brand-green-dark transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <p className="font-sans text-xs text-brand-green-dark/70 leading-relaxed text-left">
                      {hotspotsData[activeHotspot].desc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <a
                      href={hotspotsData[activeHotspot].gmapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-grow font-sans text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all text-white cursor-pointer ${
                        activeHotspot === 'lurah' 
                          ? 'bg-brand-green hover:bg-brand-green-dark shadow-[0_4px_12px_rgba(27,67,50,0.15)]' 
                          : 'bg-brand-gold hover:bg-brand-gold-dark shadow-[0_4px_12px_rgba(201,162,39,0.2)]'
                      }`}
                    >
                      <Navigation size={12} />
                      Petunjuk Arah
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center z-10 font-sans text-[10px] text-brand-green-dark/50 font-bold tracking-wide">
              {activeHotspot 
                ? `Menampilkan: ${hotspotsData[activeHotspot].name}`
                : "Klik pin pada peta untuk info detail"}
            </div>
          </motion.div>
        </div>

        {/* Potentials Section */}
        <div className="mt-12">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif font-bold text-2xl text-brand-green-dark text-center mb-10"
          >
            Potensi Pengembangan Wilayah
          </motion.h3>
          
          {/* Potentials Grid - padding 28px and gap 24px */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {potentials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={shouldReduce ? {} : { y: -6, borderColor: "rgba(20,83,45,0.25)", boxShadow: "0 15px 30px rgba(20,83,45,0.06)" }}
                  className="bg-white border-2 border-brand-gold/10 p-7 md:p-8 rounded-[32px] transition-all duration-300 hover:shadow-md text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-serif font-bold text-lg mb-3 text-brand-green-dark">
                    {item.title}
                  </h4>
                  <p className="font-sans text-sm text-brand-green-dark/70 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DesaProfile;
