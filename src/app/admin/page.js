"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, LogOut, Upload, Calendar, 
  Tag, Loader2, Lock, PlusCircle, Check, X, FileText, Image as ImageIcon,
  Home, Search, AlertTriangle, Info, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Date translation helpers
const formatToIndonesianDate = (isoDateStr) => {
  if (!isoDateStr) return '';
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const parts = isoDateStr.split('-');
  if (parts.length !== 3) return isoDateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${months[monthIndex]} ${year}`;
};

const parseIndonesianToIsoDate = (indoDateStr) => {
  if (!indoDateStr) return '';
  const months = {
    januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
    juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12'
  };
  const parts = indoDateStr.toLowerCase().split(' ');
  if (parts.length !== 3) {
    try {
      const d = new Date(indoDateStr);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch {}
    return '';
  }
  const day = parts[0].padStart(2, '0');
  const month = months[parts[1]] || '01';
  const year = parts[2];
  return `${year}-${month}-${day}`;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data states
  const [proker, setProker] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [activeTab, setActiveTab] = useState('proker');
  const [loadingData, setLoadingData] = useState(false);

  // Search filter states
  const [prokerSearch, setProkerSearch] = useState('');
  const [galeriSearch, setGaleriSearch] = useState('');

  // Toast notification state
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  // Custom confirm delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, type: '' });

  // Form states - Proker
  const [prokerId, setProkerId] = useState(null);
  const [prokerTitle, setProkerTitle] = useState('');
  const [prokerDate, setProkerDate] = useState('');
  const [prokerStatus, setProkerStatus] = useState('Direncanakan');
  const [prokerDesc, setProkerDesc] = useState('');
  const [prokerSubmitLoading, setProkerSubmitLoading] = useState(false);

  // Form states - Galeri
  const [galeriId, setGaleriId] = useState(null);
  const [galeriTitle, setGaleriTitle] = useState('');
  const [galeriCategory, setGaleriCategory] = useState('Sosialisasi');
  const [galeriDate, setGaleriDate] = useState('');
  const [galeriDesc, setGaleriDesc] = useState('');
  const [galeriFile, setGaleriFile] = useState(null);
  const [galeriPreview, setGaleriPreview] = useState('');
  const [galeriSubmitLoading, setGaleriSubmitLoading] = useState(false);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
  };
  const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

  // Auto hide toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Check auth session on load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth');
      if (res.ok) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [prokerRes, galeriRes] = await Promise.all([
        fetch('/api/proker'),
        fetch('/api/galeri')
      ]);
      if (prokerRes.ok) {
        const prokerData = await prokerRes.json();
        setProker(prokerData.sort((a, b) => b.id - a.id));
      }
      if (galeriRes.ok) {
        const galeriData = await galeriRes.json();
        setGaleri(galeriData.sort((a, b) => b.id - a.id));
      }
    } catch (e) {
      console.error("Gagal mengambil data", e);
      showToast('Gagal memuat data dari database.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        showToast('Berhasil masuk dashboard admin.', 'success');
        fetchData();
      } else {
        const err = await res.json();
        setLoginError(err.message || 'Password salah!');
        showToast(err.message || 'Password salah!', 'error');
      }
    } catch (err) {
      setLoginError('Terjadi kesalahan jaringan.');
      showToast('Terjadi kesalahan jaringan.', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      setPassword('');
      showToast('Berhasil keluar sesi admin.', 'info');
    } catch (e) {
      console.error(e);
      showToast('Gagal keluar sesi.', 'error');
    }
  };

  // Proker actions
  const handleProkerSubmit = async (e) => {
    e.preventDefault();
    setProkerSubmitLoading(true);
    try {
      const res = await fetch('/api/proker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: prokerId,
          title: prokerTitle,
          date: formatToIndonesianDate(prokerDate),
          status: prokerStatus,
          desc: prokerDesc
        })
      });
      if (res.ok) {
        showToast(prokerId ? 'Program kerja berhasil diperbarui.' : 'Program kerja berhasil dipublish.', 'success');
        resetProkerForm();
        fetchData();
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal menyimpan program kerja.', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan.', 'error');
    } finally {
      setProkerSubmitLoading(false);
    }
  };

  const triggerDeleteConfirm = (id, type) => {
    setDeleteConfirm({ isOpen: true, id, type });
  };

  const executeDelete = async () => {
    const { id, type } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, id: null, type: '' });
    
    try {
      if (type === 'proker') {
        const res = await fetch(`/api/proker?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('Program kerja berhasil dihapus.', 'success');
          fetchData();
        } else {
          const err = await res.json();
          showToast(err.error || 'Gagal menghapus program kerja.', 'error');
        }
      } else if (type === 'galeri') {
        const res = await fetch(`/api/galeri?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('Foto galeri berhasil dihapus.', 'success');
          fetchData();
        } else {
          const err = await res.json();
          showToast(err.error || 'Gagal menghapus foto.', 'error');
        }
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan.', 'error');
    }
  };

  const handleProkerEdit = (item) => {
    setProkerId(item.id);
    setProkerTitle(item.title);
    setProkerDate(parseIndonesianToIsoDate(item.date));
    setProkerStatus(item.status);
    setProkerDesc(item.desc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Mode Edit: Silakan sesuaikan form program kerja.', 'info');
  };

  const resetProkerForm = () => {
    setProkerId(null);
    setProkerTitle('');
    setProkerDate('');
    setProkerStatus('Direncanakan');
    setProkerDesc('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 2 MB limit (2097152 bytes)
      if (file.size > 2097152) {
        showToast('Ukuran foto terlalu besar! Maksimal 2 MB agar hemat kuota. Silakan kompres foto dahulu di tinypng.com', 'error');
        e.target.value = ''; // Reset file input
        return;
      }
      setGaleriFile(file);
      setGaleriPreview(URL.createObjectURL(file));
      showToast('Foto berhasil dimuat. Siap diunggah.', 'success');
    }
  };

  const handleGaleriSubmit = async (e) => {
    e.preventDefault();
    if (!galeriId && !galeriFile) {
      showToast('Silakan pilih foto terlebih dahulu!', 'error');
      return;
    }
    setGaleriSubmitLoading(true);

    try {
      let finalUrl = '';

      if (galeriFile) {
        // Step 1: Upload file to Vercel Blob
        const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(galeriFile.name)}`, {
          method: 'POST',
          body: galeriFile
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || 'Gagal mengunggah foto ke penyimpanan Vercel Blob.');
        }
        const blobData = await uploadRes.json();
        finalUrl = blobData.url;
      } else {
        // Keeping the old url when editing details
        const existing = galeri.find(g => g.id === galeriId);
        finalUrl = existing ? existing.url : '';
      }

      // Step 2: Save metadata to Vercel KV / Local JSON
      const res = await fetch('/api/galeri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: galeriId,
          title: galeriTitle,
          category: galeriCategory,
          date: formatToIndonesianDate(galeriDate),
          desc: galeriDesc,
          url: finalUrl
        })
      });

      if (res.ok) {
        showToast(galeriId ? 'Informasi foto berhasil diperbarui.' : 'Foto berhasil diunggah dan dipublish.', 'success');
        resetGaleriForm();
        fetchData();
      } else {
        const err = await res.json();
        showToast(err.error || 'Gagal menyimpan data galeri.', 'error');
      }
    } catch (e) {
      showToast(e.message || 'Terjadi kesalahan jaringan.', 'error');
    } finally {
      setGaleriSubmitLoading(false);
    }
  };

  const handleGaleriEdit = (item) => {
    setGaleriId(item.id);
    setGaleriTitle(item.title);
    setGaleriCategory(item.category);
    setGaleriDate(parseIndonesianToIsoDate(item.date));
    setGaleriDesc(item.desc);
    setGaleriPreview(item.url);
    setGaleriFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Mode Edit: Silakan sesuaikan detail info foto.', 'info');
  };

  const resetGaleriForm = () => {
    setGaleriId(null);
    setGaleriTitle('');
    setGaleriCategory('Sosialisasi');
    setGaleriDate('');
    setGaleriDesc('');
    setGaleriFile(null);
    setGaleriPreview('');
  };

  // Filtered List computations
  const filteredProker = proker.filter(item => 
    item.title.toLowerCase().includes(prokerSearch.toLowerCase()) ||
    item.desc.toLowerCase().includes(prokerSearch.toLowerCase()) ||
    item.status.toLowerCase().includes(prokerSearch.toLowerCase())
  );

  const filteredGaleri = galeri.filter(item => 
    item.title.toLowerCase().includes(galeriSearch.toLowerCase()) ||
    item.desc.toLowerCase().includes(galeriSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(galeriSearch.toLowerCase())
  );

  if (authChecking) {
    return (
      <div className="min-h-screen bg-brand-sand flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-gold animate-spin mb-4" />
        <p className="font-sans text-slate-500 text-sm">Memeriksa sesi admin...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-sand flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 border border-brand-gold/15 shadow-xl"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-bold text-2xl text-brand-green-dark mb-1">
              Admin KKN
            </h1>
            <p className="font-sans text-slate-500 text-xs">
              Portal Kelola Program Kerja & Galeri Kelurahan Tanjung Gading
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-sans text-xs font-bold text-brand-green-dark uppercase tracking-wider mb-2">
                Kata Sandi Admin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                required
                className="w-full px-4 py-3 rounded-xl border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/10 outline-none text-brand-green-dark transition-all duration-300 font-sans"
              />
              {loginError && (
                <p className="text-red-500 font-sans text-xs mt-2 font-semibold flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-brand-green hover:bg-brand-green-dark text-white font-sans text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer"
            >
              {loginLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Masuk Dashboard'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-sand py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-brand-gold/15 gap-4">
          <div>
            <h1 className="font-serif font-bold text-3xl text-brand-green-dark mb-1.5">
              Dashboard Kelola Website
            </h1>
            <p className="font-sans text-slate-500 text-sm">
              Kelola kemajuan Program Kerja, dan dokumentasi Galeri Foto.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm border border-slate-200 w-1/2 md:w-auto text-center"
            >
              <Home size={14} />
              Lihat Website
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm border border-red-200 w-1/2 md:w-auto cursor-pointer"
            >
              <LogOut size={14} />
              Keluar Sesi
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-brand-gold/10 shadow-sm mb-8 w-fit">
          <button
            onClick={() => setActiveTab('proker')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'proker' 
                ? 'bg-brand-green text-white shadow-sm' 
                : 'text-slate-500 hover:text-brand-green-dark hover:bg-brand-cream/30'
            }`}
          >
            <FileText size={14} />
            Program Kerja
          </button>
          <button
            onClick={() => setActiveTab('galeri')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'galeri' 
                ? 'bg-brand-green text-white shadow-sm' 
                : 'text-slate-500 hover:text-brand-green-dark hover:bg-brand-cream/30'
            }`}
          >
            <ImageIcon size={14} />
            Galeri Foto
          </button>
        </div>

        {/* Main Grid: Form Left, List Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Area */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-md">
            {activeTab === 'proker' ? (
              <form onSubmit={handleProkerSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-brand-cream">
                  <h2 className="font-serif font-bold text-lg text-brand-green-dark flex items-center gap-2">
                    <PlusCircle size={18} className="text-brand-gold" />
                    {prokerId ? 'Edit Program Kerja' : 'Tambah Program Kerja'}
                  </h2>
                  {prokerId && (
                    <button 
                      type="button" 
                      onClick={resetProkerForm}
                      className="text-xs text-brand-gold font-bold hover:underline cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                    Nama Program Kerja
                  </label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={prokerTitle}
                      onChange={(e) => setProkerTitle(e.target.value)}
                      placeholder="Contoh: Bimbingan Belajar Ceria"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 outline-none text-brand-green-dark text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                      Tanggal / Waktu
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        value={prokerDate}
                        onChange={(e) => setProkerDate(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 outline-none text-brand-green-dark text-xs font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                      Status Progres
                    </label>
                    <div className="relative">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={prokerStatus}
                        onChange={(e) => setProkerStatus(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 outline-none text-brand-green-dark text-xs font-sans"
                      >
                        <option value="Selesai">Selesai</option>
                        <option value="Berlangsung">Berlangsung</option>
                        <option value="Direncanakan">Direncanakan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    value={prokerDesc}
                    onChange={(e) => setProkerDesc(e.target.value)}
                    rows={4}
                    placeholder="Tulis ringkasan kegiatan KKN ini..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 outline-none text-brand-green-dark text-sm font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={prokerSubmitLoading}
                  className="w-full py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {prokerSubmitLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {prokerId ? <Check size={14} /> : <Plus size={14} />}
                      {prokerId ? 'Simpan Perubahan' : 'Publish Program Kerja'}
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleGaleriSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-brand-cream">
                  <h2 className="font-serif font-bold text-lg text-brand-green-dark flex items-center gap-2">
                    <PlusCircle size={18} className="text-brand-gold" />
                    {galeriId ? 'Edit Info Foto' : 'Unggah Foto Baru'}
                  </h2>
                  {galeriId && (
                    <button 
                      type="button" 
                      onClick={resetGaleriForm}
                      className="text-xs text-brand-gold font-bold hover:underline cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                    Judul Kegiatan Foto
                  </label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={galeriTitle}
                      onChange={(e) => setGaleriTitle(e.target.value)}
                      placeholder="Contoh: Mengajar Mengaji di Masjid"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 outline-none text-brand-green-dark text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                      Tanggal Kegiatan
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        value={galeriDate}
                        onChange={(e) => setGaleriDate(e.target.value)}
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 outline-none text-brand-green-dark text-xs font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                      Kategori Kegiatan
                    </label>
                    <div className="relative">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={galeriCategory}
                        onChange={(e) => setGaleriCategory(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 outline-none text-brand-green-dark text-xs font-sans"
                      >
                        <option value="Sosialisasi">Sosialisasi</option>
                        <option value="Edukasi">Edukasi</option>
                        <option value="Gotong Royong">Gotong Royong</option>
                        <option value="Sosial & Budaya">Sosial & Budaya</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                    Keterangan Foto
                  </label>
                  <textarea
                    value={galeriDesc}
                    onChange={(e) => setGaleriDesc(e.target.value)}
                    rows={2}
                    placeholder="Contoh: Adik-adik antusias menyimak dongeng..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-brand-green-dark/15 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 outline-none text-brand-green-dark text-sm font-sans resize-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-brand-green-dark uppercase tracking-wider mb-1.5">
                    File Foto
                  </label>
                  <div className="relative border-2 border-dashed border-brand-gold/20 hover:border-brand-gold rounded-xl p-4 text-center cursor-pointer transition-all duration-300 bg-brand-cream/5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {galeriPreview ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={galeriPreview} 
                          alt="Preview" 
                          className="h-32 object-cover rounded-lg mb-2 shadow-sm"
                        />
                        <p className="font-sans text-[10px] text-slate-500">
                          Klik untuk mengganti foto
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <Upload className="w-8 h-8 text-brand-gold mb-2" />
                        <span className="font-sans text-xs font-bold text-brand-green-dark">Pilih / Drag Foto Kelompok</span>
                        <span className="font-sans text-[9px] text-slate-400 mt-1">Format JPG, PNG, WEBP (Maksimal 2MB)</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={galeriSubmitLoading}
                  className="w-full py-3 bg-brand-gold hover:bg-brand-gold-dark text-white font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {galeriSubmitLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {galeriId ? <Check size={14} /> : <Plus size={14} />}
                      {galeriId ? 'Simpan Perubahan Info' : 'Upload & Publish Foto'}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right List Area */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search filter input */}
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'proker' ? 'Cari judul, deskripsi, atau status program kerja...' : 'Cari judul, keterangan, atau kategori foto...'}
                value={activeTab === 'proker' ? prokerSearch : galeriSearch}
                onChange={(e) => activeTab === 'proker' ? setProkerSearch(e.target.value) : setGaleriSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-gold/15 focus:border-brand-gold bg-white outline-none text-brand-green-dark font-sans text-sm shadow-sm transition-all"
              />
              {(activeTab === 'proker' ? prokerSearch : galeriSearch) && (
                <button
                  onClick={() => activeTab === 'proker' ? setProkerSearch('') : setGaleriSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <h2 className="font-serif font-bold text-lg text-brand-green-dark pb-2 border-b border-brand-gold/10">
              Daftar Konten Terbit ({activeTab === 'proker' ? filteredProker.length : filteredGaleri.length})
            </h2>

            {loadingData ? (
              <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-brand-gold/15">
                <Loader2 className="w-8 h-8 text-brand-gold animate-spin mb-2" />
                <p className="font-sans text-xs text-slate-500">Memuat konten...</p>
              </div>
            ) : activeTab === 'proker' ? (
              filteredProker.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-brand-gold/15">
                  <p className="font-sans text-sm text-slate-500">Tidak ada program kerja yang ditemukan.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                  {filteredProker.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white p-5 rounded-2xl border border-brand-gold/10 hover:border-brand-gold/20 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all duration-300"
                    >
                      <div className="space-y-1.5 w-full sm:max-w-[80%]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-sans text-[9px] font-bold bg-brand-cream text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded-full">
                            ID #{item.id}
                          </span>
                          <span className={`font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.status === 'Selesai' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : item.status === 'Berlangsung'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-brand-green/10 text-brand-green border border-brand-green/20'
                          }`}>
                            {item.status}
                          </span>
                          <span className="font-sans text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar size={11} className="text-slate-400" />
                            {item.date}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-brand-green-dark">
                          {item.title}
                        </h3>
                        <p className="font-sans text-xs text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-start border-t border-brand-cream sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleProkerEdit(item)}
                          className="p-2 hover:bg-brand-cream/50 text-slate-400 hover:text-brand-gold rounded-lg transition-colors duration-300 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm(item.id, 'proker')}
                          className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors duration-300 cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              filteredGaleri.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-brand-gold/15">
                  <p className="font-sans text-sm text-slate-500">Tidak ada foto galeri yang ditemukan.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                  {filteredGaleri.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-brand-gold/10 hover:border-brand-gold/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 w-full sm:max-w-[80%]">
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-16 h-16 object-cover rounded-lg border border-brand-gold/10 shadow-sm flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-sans text-[8px] font-bold bg-brand-cream text-brand-gold px-1.5 py-0.5 rounded-full">
                              ID #{item.id}
                            </span>
                            <span className="font-sans text-[8px] font-bold bg-brand-green/10 text-brand-green border border-brand-green/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              {item.category}
                            </span>
                            <span className="font-sans text-[9px] text-slate-500">
                              {item.date}
                            </span>
                          </div>
                          <h3 className="font-serif font-bold text-sm text-brand-green-dark leading-tight">
                            {item.title}
                          </h3>
                          <p className="font-sans text-[11px] text-slate-500 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto border-t border-brand-cream sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleGaleriEdit(item)}
                          className="p-2 hover:bg-brand-cream/50 text-slate-400 hover:text-brand-gold rounded-lg transition-colors duration-300 cursor-pointer"
                          title="Edit Info"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm(item.id, 'galeri')}
                          className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors duration-300 cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

        </div>
      </div>

      {/* Toast Notification System */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border font-sans text-sm font-semibold ${
              toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {toast.type === 'success' && <Check size={18} className="text-emerald-600 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle size={18} className="text-red-600 shrink-0" />}
            {toast.type === 'info' && <Info size={18} className="text-blue-600 shrink-0" />}
            <span>{toast.message}</span>
            <button 
              onClick={closeToast}
              className="ml-2 hover:opacity-75 transition-opacity cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Delete Dialog */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 border border-brand-gold/15 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="font-serif font-bold text-lg text-brand-green-dark">
                  Konfirmasi Hapus Konten
                </h3>
              </div>
              <p className="font-sans text-sm text-slate-600 leading-relaxed mb-6">
                Apakah Anda yakin ingin menghapus {deleteConfirm.type === 'proker' ? 'program kerja' : 'foto galeri'} ini? Tindakan ini bersifat permanen dan data yang dihapus tidak dapat dipulihkan.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, id: null, type: '' })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-sans text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
