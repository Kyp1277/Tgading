"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, CheckCircle2, AlertCircle, Clock, BookOpen } from 'lucide-react';
import BackgroundDecor from './BackgroundDecor';

const Proker = () => {
  const shouldReduce = useReducedMotion();

  const events = [
    {
      id: 1,
      title: 'Penerimaan Kelompok KKN oleh Aparatur Kelurahan',
      date: '10 Juli 2026',
      status: 'Selesai',
      desc: 'Pertemuan resmi perdana bersama Lurah Tanjung Gading, jajaran perangkat kelurahan, dan tokoh pemuda untuk memaparkan program pengabdian KKN.',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      id: 2,
      title: 'Sosialisasi Digitalisasi Administrasi Kelurahan',
      date: '15 Juli 2026',
      status: 'Selesai',
      desc: 'Pelatihan dasar penggunaan platform digital tata kelola surat-menyurat untuk sekretariat kelurahan guna mempercepat layanan administrasi lingkungan.',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      id: 3,
      title: 'Bimbingan Belajar Matematika & Bahasa Inggris Ceria',
      date: '17 Juli - 10 Agustus 2026',
      status: 'Berlangsung',
      desc: 'Program bimbingan belajar gratis pasca sekolah untuk siswa SD dan SMP yang berfokus pada metode belajar interaktif dan edukasi karakter.',
      icon: AlertCircle,
      color: 'text-brand-gold',
      bg: 'bg-brand-gold/10',
    },
    {
      id: 4,
      title: 'Festival Keagamaan Anak Sholeh se-Tanjung Gading',
      date: '5 Agustus 2026',
      status: 'Direncanakan',
      desc: 'Perlombaan membaca Al-Qur\'an, azan, dan hafalan surah pendek tingkat lingkungan untuk meningkatkan syiar keagamaan anak-anak.',
      icon: Clock,
      color: 'text-brand-green',
      bg: 'bg-brand-green/10',
    },
    {
      id: 5,
      title: 'Pelatihan Branding & Digital Marketing UMKM Sapu Lidi',
      date: '12 Agustus 2026',
      status: 'Direncanakan',
      desc: 'Pendampingan branding produk sapu lidi kreasi warga agar memiliki nilai jual tinggi secara digital serta perluasan kemitraan distribusi.',
      icon: Clock,
      color: 'text-brand-green',
      bg: 'bg-brand-green/10',
    },
    {
      id: 6,
      title: 'Gotong Royong Raya & Perapian Plang Batas Wilayah',
      date: '18 Agustus 2026',
      status: 'Direncanakan',
      desc: 'Aksi kebersihan massal bersama masyarakat setempat sekaligus peresmian gapura/plang pembatas dusun hasil karya teknik sipil.',
      icon: Clock,
      color: 'text-brand-green',
      bg: 'bg-brand-green/10',
    }
  ];

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
          <p className="font-sans text-brand-green-dark/70 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Rangkaian timeline kegiatan KKN UIN Suska Riau 2026 di Kelurahan Tanjung Gading. Dirancang secara terukur untuk mewujudkan keberlanjutan potensi wilayah.
          </p>
        </motion.div>

        {/* Timeline Layout */}
        <div className="relative border-l-[3px] border-brand-gold/25 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:h-full md:before:w-[3px] md:before:bg-brand-gold/25 pl-8 md:pl-0">
          
          {events.map((event, idx) => {
            const isEven = idx % 2 === 0;
            const isOngoing = event.status === 'Berlangsung';

            return (
              <div key={event.id} className="relative mb-8 md:mb-10 flex flex-col md:flex-row items-stretch overflow-hidden">
                
                {/* Timeline Center Bullet Pin */}
                <div className="absolute -left-[43px] top-0 md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full border-2 border-brand-gold bg-white flex items-center justify-center shadow-md z-10">
                  {isOngoing && (
                    <span className="absolute inset-0 rounded-full bg-brand-gold/45 animate-ping z-0 pointer-events-none" />
                  )}
                  <svg viewBox="0 0 100 100" className="w-2.5 h-2.5 fill-brand-gold z-10">
                    <ellipse cx="50" cy="50" rx="30" ry="35" />
                    <path d="M 50,15 C 50,5 40,5 50,0 C 60,5 50,5 50,15" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </div>

                {/* Grid content alignment */}
                <div className="w-full md:w-1/2 flex items-center justify-end pr-0 md:pr-10 md:text-right select-none order-2 md:order-1">
                  {isEven && (
                    <motion.div 
                      initial={{ opacity: 0, x: shouldReduce ? 0 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6 }}
                      className="w-full max-w-xl md:max-w-[460px] lg:max-w-[500px] bg-white border-2 border-brand-gold/10 hover:border-brand-gold/25 border-l-4 border-l-transparent hover:border-l-brand-gold p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 text-left"
                    >
                      <div className="flex items-center justify-between md:justify-start gap-3 mb-3.5">
                        <span className="font-sans text-xs font-bold text-brand-gold flex items-center gap-1.5 order-2 md:order-1">
                          <Calendar size={12} />
                          {event.date}
                        </span>
                        <span className={`font-sans text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${event.bg} ${event.color} border border-brand-gold/10 order-1 md:order-2`}>
                          {event.status}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-xl md:text-[22px] text-brand-green-dark mb-2.5 leading-tight">
                        {event.title}
                      </h3>
                      <p className="font-sans text-sm md:text-[15px] text-brand-green-dark/70 leading-relaxed">
                        {event.desc}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Spacer on desktop */}
                <div className="hidden md:block w-0.5" />

                {/* Right column (Opposite align) */}
                <div className="w-full md:w-1/2 flex items-center justify-start pl-0 md:pl-10 order-3">
                  {!isEven && (
                    <motion.div 
                      initial={{ opacity: 0, x: shouldReduce ? 0 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6 }}
                      className="w-full max-w-xl md:max-w-[460px] lg:max-w-[500px] bg-white border-2 border-brand-gold/10 hover:border-brand-gold/25 border-l-4 border-l-transparent hover:border-l-brand-gold p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 text-left"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3.5">
                        <span className="font-sans text-xs font-bold text-brand-gold flex items-center gap-1.5">
                          <Calendar size={12} />
                          {event.date}
                        </span>
                        <span className={`font-sans text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${event.bg} ${event.color} border border-brand-gold/10`}>
                          {event.status}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-xl md:text-[22px] text-brand-green-dark mb-2.5 leading-tight">
                        {event.title}
                      </h3>
                      <p className="font-sans text-sm md:text-[15px] text-brand-green-dark/70 leading-relaxed">
                        {event.desc}
                      </p>
                    </motion.div>
                  )}
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Proker;
