"use client";

import React from 'react';
import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MapPin, Users, Activity, Leaf, Shield, BookOpen, ExternalLink } from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

// Reusable 3D TiltCard Component for Stats & Potentials
const TiltCard = ({ children, className, shouldReduce, ...props }) => {
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
      className={className}
      {...props}
    >
      <div style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }} className="w-full h-full flex flex-col relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const DesaProfile = () => {
  const shouldReduce = useReducedMotion();

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
          <p className="font-sans text-slate-600 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">
            Kelurahan Tanjung Gading terletak di Kecamatan Pasir Penyu, Kabupaten Indragiri Hulu, Riau. Sebuah kawasan yang asri dengan kehangatan warganya, semangat gotong royong yang tinggi, serta alam perkebunan yang subur.
          </p>
        </motion.div>

        {/* Quick Stats Grid with 3D Tilt Cards (Opsi B) */}
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
              <motion.div key={idx} variants={itemVariants}>
                <TiltCard 
                  shouldReduce={shouldReduce}
                  className="bg-white border-2 border-brand-gold/10 hover:border-brand-gold/30 p-7 md:p-8 text-center rounded-[32px] transition-all duration-300 shadow-sm hover:shadow-[0_15px_35px_rgba(201,162,39,0.12)] cursor-default relative overflow-hidden group"
                >
                  {/* Subtle Glowing Background Accent */}
                  <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-brand-gold/5 group-hover:bg-brand-gold/15 blur-xl transition-all duration-300 pointer-events-none" />
                  
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-3 transition-colors group-hover:bg-brand-gold group-hover:text-white duration-300">
                    <Icon size={18} />
                  </div>
                  <p className="font-sans text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">{stat.label}</p>
                  <p className="font-serif font-bold text-base md:text-lg text-brand-green-dark transition-colors group-hover:text-brand-gold duration-200">{stat.value}</p>
                </TiltCard>
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
            <p className="font-sans text-sm md:text-base text-slate-600 leading-relaxed">
              Secara geografis, Tanjung Gading dikelilingi oleh lanskap alam yang hijau khas Sumatra Tengah. Kecamatan Pasir Penyu sendiri memiliki nilai historis yang kaya di Kabupaten Indragiri Hulu (Inhu), menjadi hub perdagangan serta pusat aktivitas masyarakat di sepanjang aliran Sungai Indragiri.
            </p>
            <p className="font-sans text-sm md:text-base text-slate-600 leading-relaxed">
              Masyarakat kelurahan didominasi oleh suku Melayu, Jawa, dan Minang yang hidup berdampingan secara damai. Kegiatan adat istiadat, pengajian mingguan, dan kerja bakti kebersihan lingkungan merupakan rutinitas yang mempererat tali kekeluargaan antar dusun di Tanjung Gading.
            </p>
            <div className="p-5 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 text-xs md:text-sm text-brand-gold flex items-start gap-3">
              <MapPin className="shrink-0 mt-0.5 text-brand-gold" size={18} />
              <span>
                <strong>Fokus KKN:</strong> Melalui program KKN UIN Suska Riau 2026, kami berfokus membantu administrasi kelurahan berbasis digital, pemetaan potensi wilayah, edukasi anak-anak, serta pendampingan UMKM lokal.
              </span>
            </div>
          </motion.div>

          {/* Right: Embedded Interactive WebGIS Map Card */}
          <motion.div 
            initial={{ opacity: 0, x: shouldReduce ? 0 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 w-full h-[480px] md:h-[520px] bg-white p-5 md:p-6 border-2 border-brand-gold/20 rounded-[32px] flex flex-col justify-between relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="flex justify-between items-center mb-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="font-serif font-bold text-xs md:text-sm tracking-wider text-brand-gold">
                  Peta WebGIS Lokasi Wilayah
                </span>
              </div>
              <a 
                href="https://webgis-sage.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-sans font-bold text-xs text-brand-green-dark hover:text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 px-3 py-1.5 rounded-full transition-all duration-200"
                title="Buka WebGIS di tab baru"
              >
                <span>Buka WebGIS</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Embedded WebGIS Map iframe */}
            <div className="w-full flex-grow relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner bg-slate-50 z-10 min-h-[300px]">
              <iframe 
                src="https://webgis-sage.vercel.app/"
                title="Peta WebGIS Kelurahan Tanjung Gading"
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                allow="geolocation; fullscreen"
              />
            </div>

            {/* Footer Caption & Link */}
            <div className="flex items-center justify-between z-10 font-sans text-xs text-slate-500 font-bold tracking-wide mt-3 pt-1">
              <span>Kelurahan Tanjung Gading, Kec. Pasir Penyu</span>
              <a 
                href="https://webgis-sage.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Peta Penuh</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Potentials Section with 3D Tilt Cards (Opsi B) */}
        <div className="mt-12">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif font-bold text-2xl text-brand-green-dark text-center mb-10"
          >
            Potensi Pengembangan Wilayah
          </motion.h3>
          
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
                <motion.div key={idx} variants={itemVariants}>
                  <TiltCard 
                    shouldReduce={shouldReduce}
                    className="bg-white border-2 border-brand-gold/10 hover:border-brand-gold/30 p-7 md:p-8 rounded-[32px] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(201,162,39,0.12)] text-left relative overflow-hidden group cursor-default"
                  >
                    {/* Subtle Glowing Background Accent */}
                    <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-brand-gold/5 group-hover:bg-brand-gold/15 blur-xl transition-all duration-300 pointer-events-none" />

                    <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 transition-colors group-hover:bg-brand-gold group-hover:text-white duration-300">
                      <Icon size={24} />
                    </div>
                    <h4 className="font-serif font-bold text-lg mb-3 text-brand-green-dark transition-colors group-hover:text-brand-gold duration-200">
                      {item.title}
                    </h4>
                    <p className="font-sans text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </TiltCard>
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
