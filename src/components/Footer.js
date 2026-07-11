import React from 'react';
import { Instagram, Mail, MapPin, Globe } from 'lucide-react';

const Footer = ({ navigateTo }) => {
  return (
    <footer className="relative bg-brand-cream border-t border-brand-gold/15 pt-16 pb-8 px-6 md:px-8 mt-16 overflow-hidden">
      
      {/* Decorative Wave Divider at the top of footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-4 fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3v80H0V56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        {/* Col 1: Brand & Logo Full Color */}
        <div className="md:col-span-5 flex flex-col items-start gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
            {/* Official Logo Image (Full color version) */}
            <div className="w-12 h-12 rounded-full border-2 border-brand-gold overflow-hidden bg-white flex items-center justify-center shadow-md">
              <img 
                src="/logo.png" 
                alt="Logo Kelurahan Tanjung Gading" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-bold tracking-wider text-brand-green-dark text-base block leading-none">
                KELURAHAN TANJUNG GADING
              </span>
              <span className="font-sans text-brand-gold font-bold text-xs uppercase tracking-widest block mt-1 leading-none">
                KKN UIN SUSKA RIAU 2026
              </span>
            </div>
          </div>
          <p className="font-sans text-sm text-brand-green-dark/70 leading-relaxed max-w-sm">
            Website portofolio dan informasi resmi kelompok Kuliah Kerja Nyata (KKN) UIN Suska Riau di Kelurahan Tanjung Gading, Kec. Pasir Penyu, Kab. Indragiri Hulu.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="md:col-span-3">
          <h4 className="font-serif font-bold text-brand-green-dark text-base mb-4 tracking-wide border-b border-brand-gold/10 pb-2">
            Peta Situs
          </h4>
          <ul className="space-y-2.5">
            {[
              { id: 'home', label: 'Beranda' },
              { id: 'desa', label: 'Profil Kelurahan' },
              { id: 'struktur', label: 'Struktur Organisasi' },
              { id: 'anggota', label: 'Anggota KKN' },
              { id: 'proker', label: 'Program Kerja' },
              { id: 'galeri', label: 'Galeri Foto' }
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => navigateTo(link.id)}
                  className="font-sans text-sm text-brand-green-dark/70 hover:text-brand-gold transition-colors duration-300 cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Address & Info */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <h4 className="font-serif font-bold text-brand-green-dark text-base tracking-wide border-b border-brand-gold/10 pb-2">
            Posko Pengabdian
          </h4>
          <div className="flex gap-3 text-sm text-brand-green-dark/70 font-sans leading-relaxed">
            <MapPin className="shrink-0 text-brand-gold mt-1" size={16} />
            <span>
              Kantor Kelurahan Tanjung Gading,<br />
              Kecamatan Pasir Penyu, Kabupaten Indragiri Hulu,<br />
              Provinsi Riau, Kode Pos 29352.
            </span>
          </div>
          <div className="flex gap-4 mt-2">
            <a 
              href="https://www.instagram.com/kkntanjunggading2026?igsh=ZmNjdWM1dmIzODBw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-brand-gold/25 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/75 hover:text-brand-gold bg-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
            >
              <Instagram size={16} />
            </a>
            <a 
              href="https://www.tiktok.com/@kkn.tg2026?is_from_webapp=1&sender_device=pc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-brand-gold/25 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/75 hover:text-brand-gold bg-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.02.97 2.37 1.61 3.82 1.72v3.83c-1.85-.01-3.61-.73-4.96-2.01-.15-.14-.29-.29-.42-.45V15.5c0 4.69-3.81 8.5-8.5 8.5S0 20.19 0 15.5 3.81 7 8.5 7c.87 0 1.73.13 2.55.39V11.5c-.81-.46-1.74-.7-2.69-.7-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5V.02z" />
              </svg>
            </a>
            <a 
              href="mailto:kordes.tanjunggading@example.com" 
              className="w-9 h-9 rounded-full border border-brand-gold/25 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/75 hover:text-brand-gold bg-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
            >
              <Mail size={16} />
            </a>
            <a 
              href="https://uin-suska.ac.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-brand-gold/25 hover:border-brand-gold flex items-center justify-center text-brand-green-dark/75 hover:text-brand-gold bg-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
            >
              <Globe size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="h-px bg-brand-gold/15 mb-6" />

      {/* Footer Bottom copyright and motto */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
        <p className="font-sans text-xs text-brand-green-dark/60">
          &copy; {new Date().getFullYear()} KKN UIN Suska Riau. Kelurahan Tanjung Gading. All Rights Reserved.
        </p>

        {/* Motto Bersatu Maju Sejahtera with mini turtles */}
        <div className="flex items-center gap-2 select-none">
          <svg viewBox="0 0 100 100" width="16" height="16" className="fill-none stroke-brand-gold">
            <ellipse cx="50" cy="50" rx="30" ry="35" strokeWidth="4" />
            <path d="M 50,15 C 50,5 40,5 50,0 C 60,5 50,5 50,15" strokeWidth="4" />
          </svg>
          <span className="font-sans font-bold text-xs uppercase tracking-widest text-brand-gold">
            Bersatu • Maju • Sejahtera
          </span>
          <svg viewBox="0 0 100 100" width="16" height="16" className="fill-none stroke-brand-gold">
            <ellipse cx="50" cy="50" rx="30" ry="35" strokeWidth="4" />
            <path d="M 50,15 C 50,5 40,5 50,0 C 60,5 50,5 50,15" strokeWidth="4" />
          </svg>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
