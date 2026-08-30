import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

let kv;
try {
  const vercelKv = require('@vercel/kv');
  kv = vercelKv.kv;
} catch (e) {
  kv = null;
}

const defaultPhotos = [
  {
    "id": 1,
    "title": "Pembagian Program MBG & Silaturahmi Awal Kelurahan - Distribusi Nasi Kotak MBG",
    "date": "20 Juli 2026",
    "desc": "Mahasiswa KKN bersama pihak sekolah dan posyandu membagikan makanan bergizi gratis menggunakan wadah stainless steel ramah lingkungan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_1_1.jpg"
  },
  {
    "id": 2,
    "title": "Pembagian Program MBG & Silaturahmi Awal Kelurahan - Pemberian Makanan Sehat untuk Ibu & Warga",
    "date": "20 Juli 2026",
    "desc": "Pelayanan pembagian asupan gizi sehat untuk ibu hamil dan warga masyarakat di lokasi posyandu.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_1_2.jpg"
  },
  {
    "id": 3,
    "title": "Pembagian Program MBG & Silaturahmi Awal Kelurahan - Santap Siang Bersama Tim KKN",
    "date": "20 Juli 2026",
    "desc": "Momen kebersamaan anggota KKN menyantap menu makanan bergizi sehat bersama di sela-sela kegiatan posyandu.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_1_3.jpg"
  },
  {
    "id": 4,
    "title": "Pembagian Program MBG & Silaturahmi Awal Kelurahan - Potret Bersama Kader Posyandu",
    "date": "20 Juli 2026",
    "desc": "Foto bersama para kader posyandu dan tim KKN di bawah pohon rindang tempat posko pembagian gizi.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_1_4.jpg"
  },
  {
    "id": 5,
    "title": "Pembagian Program MBG & Silaturahmi Awal Kelurahan - Penerimaan Perdana di Kantor Lurah",
    "date": "20 Juli 2026",
    "desc": "Sesi foto bersama seluruh anggota KKN UIN Suska bersama jajaran perangkat Kelurahan Tanjung Gading berbusana KORPRI.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_1_5.jpg"
  },
  {
    "id": 6,
    "title": "Pembagian Program MBG & Silaturahmi Awal Kelurahan - Sinergi Bersama Perangkat Kelurahan",
    "date": "20 Juli 2026",
    "desc": "Dokumentasi pose kompak tim KKN bersama staf kantor lurah sebagai tanda dimulainya masa pengabdian.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_1_6.jpg"
  },
  {
    "id": 7,
    "title": "Penyerahan Mahasiswa KKN oleh DPL ke Kelurahan - Pertemuan Koordinasi di Ruang Lurah",
    "date": "21 Juli 2026",
    "desc": "Dosen Pembimbing Lapangan (DPL) mendampingi mahasiswa KKN beraudiensi di ruang kerja Lurah Tanjung Gading.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_2_1.jpg"
  },
  {
    "id": 8,
    "title": "Penyerahan Mahasiswa KKN oleh DPL ke Kelurahan - Arahan dari Ibu Lurah Tanjung Gading",
    "date": "21 Juli 2026",
    "desc": "Ibu Lurah memberikan bimbingan dan arahan terkait situasi wilayah serta prioritas program kerja di kelurahan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_2_2.jpg"
  },
  {
    "id": 9,
    "title": "Penyerahan Mahasiswa KKN oleh DPL ke Kelurahan - Pemaparan Rancangan Pengabdian",
    "date": "21 Juli 2026",
    "desc": "Perwakilan mahasiswa memaparkan garis besar program kerja yang akan dilaksanakan selama masa KKN.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_2_3.jpg"
  },
  {
    "id": 10,
    "title": "Penyerahan Mahasiswa KKN oleh DPL ke Kelurahan - Serah Terima Resmi Mahasiswa KKN",
    "date": "21 Juli 2026",
    "desc": "Foto bersama serah terima mahasiswa KKN mengenakan seragam PDL bersama DPL dan Ibu Lurah di teras kantor.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_2_4.jpg"
  },
  {
    "id": 11,
    "title": "Penyerahan Mahasiswa KKN oleh DPL ke Kelurahan - Dokumentasi Tim Lengkap bersama DPL",
    "date": "21 Juli 2026",
    "desc": "Pose bersama seluruh anggota kelompok KKN UIN Suska Riau bersama DPL sebelum memulai agenda lapangan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_2_5.jpg"
  },
  {
    "id": 12,
    "title": "Penyerahan Mahasiswa KKN oleh DPL ke Kelurahan - Konsolidasi Awal Tim KKN",
    "date": "21 Juli 2026",
    "desc": "Sesi diskusi internal singkat antar mahasiswa usai acara penerimaan resmi oleh pemerintah kelurahan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_2_6.jpg"
  },
  {
    "id": 13,
    "title": "Silaturahmi ke Pengurus Masjid Al-Muslimin & Tokoh - Foto Bersama Aparatur & Babinsa Bhabinkamtibmas",
    "date": "22 Juli 2026",
    "desc": "Dokumentasi bersama seluruh jajaran kelurahan, Babinsa TNI, Bhabinkamtibmas Polri, dan tokoh masyarakat di halaman kantor.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_3_1.jpg"
  },
  {
    "id": 14,
    "title": "Silaturahmi ke Pengurus Masjid Al-Muslimin & Tokoh - Koordinasi Kamtibmas Lingkungan",
    "date": "22 Juli 2026",
    "desc": "Sinergi tim KKN bersama aparat keamanan Babinsa dan Bhabinkamtibmas dalam mendukung keamanan kegiatan warga.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_3_2.jpg"
  },
  {
    "id": 15,
    "title": "Silaturahmi ke Pengurus Masjid Al-Muslimin & Tokoh - Silaturahmi ke Rumah Ketua Pengurus Masjid",
    "date": "22 Juli 2026",
    "desc": "Kunjungan silaturahmi mahasiswa KKN ke kediaman Ketua Pengurus Masjid Al-Muslimin Tanjung Gading.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_3_3.jpg"
  },
  {
    "id": 16,
    "title": "Silaturahmi ke Pengurus Masjid Al-Muslimin & Tokoh - Ramah Tamah Bersama Jemaah & Sesepuh",
    "date": "22 Juli 2026",
    "desc": "Suasana perbincangan hangat dan perkenalan anggota KKN bersama bapak-bapak dan ibu-ibu pengajian di ruang tamu warga.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_3_4.jpg"
  },
  {
    "id": 17,
    "title": "Silaturahmi ke Pengurus Masjid Al-Muslimin & Tokoh - Penyampaian Program Keagamaan",
    "date": "22 Juli 2026",
    "desc": "Pemaparan rencana kegiatan keagamaan dan bimbingan mengaji yang akan dibantu oleh mahasiswa KKN.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_3_5.jpg"
  },
  {
    "id": 18,
    "title": "Silaturahmi ke Pengurus Masjid Al-Muslimin & Tokoh - Doa Bersama untuk Kelancaran KKN",
    "date": "22 Juli 2026",
    "desc": "Momen doa bersama sesepuh masjid mengharapkan keberkahan dan kelancaran selama masa pengabdian di kelurahan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_3_6.jpg"
  },
  {
    "id": 19,
    "title": "Senam Sehat Bugar Bersama Perangkat Kelurahan & Warga - Senam Kebugaran Jasmani di Halaman Kantor",
    "date": "23 Juli 2026",
    "desc": "Gerakan senam sehat bersama perangkat kelurahan dan warga masyarakat di halaman kantor lurah pada pagi hari yang cerah.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_4_1.jpg"
  },
  {
    "id": 20,
    "title": "Senam Sehat Bugar Bersama Perangkat Kelurahan & Warga - Antusiasme Peserta Senam Pagi",
    "date": "23 Juli 2026",
    "desc": "Warga dan mahasiswa KKN mengikuti instruksi senam dengan penuh semangat dan keceriaan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_4_2.jpg"
  },
  {
    "id": 21,
    "title": "Senam Sehat Bugar Bersama Perangkat Kelurahan & Warga - Keceriaan Gerakan Senam Bersama",
    "date": "23 Juli 2026",
    "desc": "Momen penuh tawa dan kebersamaan saat memperagakan variasi gerakan senam aerobik.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_4_3.jpg"
  },
  {
    "id": 22,
    "title": "Senam Sehat Bugar Bersama Perangkat Kelurahan & Warga - Suasana Pagi di Pelataran Kantor Lurah",
    "date": "23 Juli 2026",
    "desc": "Peserta senam memadati pelataran kantor kelurahan Tanjung Gading untuk menjaga kebugaran tubuh.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_4_4.jpg"
  },
  {
    "id": 23,
    "title": "Senam Sehat Bugar Bersama Perangkat Kelurahan & Warga - Pose Kompak Usai Senam Sehat",
    "date": "23 Juli 2026",
    "desc": "Foto bersama para peserta senam dan staf kelurahan usai menyelesaikan seluruh rangkaian gerakan olahraga pagi.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_4_5.jpg"
  },
  {
    "id": 24,
    "title": "Senam Sehat Bugar Bersama Perangkat Kelurahan & Warga - Istirahat & Minum Bersama Warga",
    "date": "23 Juli 2026",
    "desc": "Momen santai dan berbincang akrab dengan masyarakat sambil menikmati hidangan pelepas dahaga pasca senam.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_4_6.jpg"
  },
  {
    "id": 25,
    "title": "Kunjungan & Silaturahmi Tim KKN ke SDN 008 Tanjung Gading - Sarapan Pagi Bersama Warga",
    "date": "24 Juli 2026",
    "desc": "Menikmati sarapan pagi bersama warga dan tokoh masyarakat di kedai setempat sebelum berkunjung ke sekolah.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_5_1.jpg"
  },
  {
    "id": 26,
    "title": "Kunjungan & Silaturahmi Tim KKN ke SDN 008 Tanjung Gading - Bincang Akrab di Kedai Kopi",
    "date": "24 Juli 2026",
    "desc": "Momen kebersamaan mahasiswa KKN dan aparatur desa menjalin keakraban sambil menikmati teh hangat.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_5_2.jpg"
  },
  {
    "id": 27,
    "title": "Kunjungan & Silaturahmi Tim KKN ke SDN 008 Tanjung Gading - Kunjungan Resmi ke SDN 008 Tanjung Gading",
    "date": "24 Juli 2026",
    "desc": "Foto bersama Kepala Sekolah, dewan guru, dan perwakilan siswa di halaman depan SDN 008 Tanjung Gading.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_5_3.jpg"
  },
  {
    "id": 28,
    "title": "Kunjungan & Silaturahmi Tim KKN ke SDN 008 Tanjung Gading - Sambutan Hangat dari Dewan Guru",
    "date": "24 Juli 2026",
    "desc": "Pihak guru dan anak-anak sekolah menyambut kehadiran mahasiswa KKN dengan sukacita di pelataran sekolah.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_5_4.jpg"
  },
  {
    "id": 29,
    "title": "Kunjungan & Silaturahmi Tim KKN ke SDN 008 Tanjung Gading - Koordinasi Program Literasi Pendidikan",
    "date": "24 Juli 2026",
    "desc": "Diskusi bersama guru kelas mengenai jadwal pendampingan belajar dan kegiatan ekstrakurikuler KKN.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_5_5.jpg"
  },
  {
    "id": 30,
    "title": "Kunjungan & Silaturahmi Tim KKN ke SDN 008 Tanjung Gading - Sosialisasi Awal dengan Siswa SD",
    "date": "24 Juli 2026",
    "desc": "Perkenalan kakak-kakak mahasiswa KKN kepada anak-anak sekolah dasar di pelataran SDN 008.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_5_6.jpg"
  },
  {
    "id": 31,
    "title": "Kebersamaan Santai & Potret Ceria Mahasiswi KKN - Potret Estetik Mahasiswi KKN",
    "date": "25 Juli 2026",
    "desc": "Foto anggun mahasiswi KKN berbusana rapi pada momen refreshing akhir pekan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_6_1.jpg"
  },
  {
    "id": 32,
    "title": "Kebersamaan Santai & Potret Ceria Mahasiswi KKN - Kebersamaan Mahasiswi KKN Berbusana Anggun",
    "date": "25 Juli 2026",
    "desc": "Foto bersama mahasiswi KKN mengenakan pakaian terbaik saat menghadiri acara silaturahmi.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_6_2.jpg"
  },
  {
    "id": 33,
    "title": "Kebersamaan Santai & Potret Ceria Mahasiswi KKN - Mirror Selfie Seru & Spontan",
    "date": "25 Juli 2026",
    "desc": "Momen mirror selfie candid penuh keceriaan seluruh anggota tim di sela-sela waktu istirahat.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_6_3.jpg"
  },
  {
    "id": 34,
    "title": "Kebersamaan Santai & Potret Ceria Mahasiswi KKN - Kompak dan Penuh Senyuman",
    "date": "25 Juli 2026",
    "desc": "Potret kebersamaan tim KKN yang semakin solid setelah menjalani pekan pertama kegiatan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_6_4.jpg"
  },
  {
    "id": 35,
    "title": "Kebersamaan Santai & Potret Ceria Mahasiswi KKN - Sesi Santai Melepas Penat",
    "date": "25 Juli 2026",
    "desc": "Canda tawa dan momen relaksasi anggota kelompok KKN untuk mengisi energi menyongsong pekan berikutnya.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_6_5.jpg"
  },
  {
    "id": 36,
    "title": "Kebersamaan Santai & Potret Ceria Mahasiswi KKN - Momen Bahagia Bersama Tim",
    "date": "25 Juli 2026",
    "desc": "Dokumentasi kebersamaan hangat mempererat tali persaudaraan antar anggota pengabdian.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_6_6.jpg"
  },
  {
    "id": 37,
    "title": "Musyawarah Kelurahan & Sosialisasi Program Kerja - Rapat Musyawarah di Aula Kelurahan",
    "date": "26 Juli 2026",
    "desc": "Rapat koordinasi bersama Bu Lurah, sekretaris kelurahan, ketua RT/RW, dan tokoh masyarakat di aula pertemuan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_7_1.jpg"
  },
  {
    "id": 38,
    "title": "Musyawarah Kelurahan & Sosialisasi Program Kerja - Pemaparan Detail Rencana Proker",
    "date": "26 Juli 2026",
    "desc": "Mahasiswa KKN memaparkan rangkaian agenda kerja pengabdian di hadapan forum musyawarah kelurahan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_7_2.jpg"
  },
  {
    "id": 39,
    "title": "Musyawarah Kelurahan & Sosialisasi Program Kerja - Tanggapan & Masukan dari Tokoh Warga",
    "date": "26 Juli 2026",
    "desc": "Sesi tanya jawab dan masukan positif dari para sesepuh desa untuk menyelaraskan program dengan kebutuhan warga.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_7_3.jpg"
  },
  {
    "id": 40,
    "title": "Musyawarah Kelurahan & Sosialisasi Program Kerja - Notulensi & Diskusi Teknis",
    "date": "26 Juli 2026",
    "desc": "Pencatatan poin-poin penting kesepakatan jadwal dan penanggung jawab setiap program kerja desa.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_7_4.jpg"
  },
  {
    "id": 41,
    "title": "Musyawarah Kelurahan & Sosialisasi Program Kerja - Kesepakatan Bersama Aparatur Kelurahan",
    "date": "26 Juli 2026",
    "desc": "Ibu Lurah bersama tokoh menyetujui seluruh rangkaian program KKN yang akan diimplementasikan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_7_5.jpg"
  },
  {
    "id": 42,
    "title": "Musyawarah Kelurahan & Sosialisasi Program Kerja - Foto Bersama Usai Musyawarah",
    "date": "26 Juli 2026",
    "desc": "Dokumentasi kebersamaan peserta rapat musyawarah desa usai mencapai mufakat bersama tim KKN.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_7_6.jpg"
  },
  {
    "id": 43,
    "title": "Bimbingan Belajar & Interaksi Ceria di Sekolah - Gendong Ceria Murid Sekolah",
    "date": "27 Juli 2026",
    "desc": "Momen manis kedekatan mahasiswa KKN menggendong anak murid yang bermanja di sela jam istirahat kelas.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_8_1.jpg"
  },
  {
    "id": 44,
    "title": "Bimbingan Belajar & Interaksi Ceria di Sekolah - Pendampingan Belajar di Kelas",
    "date": "27 Juli 2026",
    "desc": "Mahasiswa membimbing siswa-siswi membaca, berhitung, dan mengerjakan tugas sekolah.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_8_2.jpg"
  },
  {
    "id": 45,
    "title": "Bimbingan Belajar & Interaksi Ceria di Sekolah - Bermain & Belajar Interaktif",
    "date": "27 Juli 2026",
    "desc": "Kuis edukatif dan permainan angka yang memicu antusiasme belajar anak-anak di kelas.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_8_3.jpg"
  },
  {
    "id": 46,
    "title": "Bimbingan Belajar & Interaksi Ceria di Sekolah - Keceriaan Anak-Anak di Bangku Sekolah",
    "date": "27 Juli 2026",
    "desc": "Tawa ceria para siswa saat belajar bersama kakak-kakak mahasiswa KKN UIN Suska.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_8_4.jpg"
  },
  {
    "id": 47,
    "title": "Bimbingan Belajar & Interaksi Ceria di Sekolah - Apresiasi untuk Siswa Aktif",
    "date": "27 Juli 2026",
    "desc": "Pemberian motivasi dan pujian kepada siswa yang berani maju ke depan menjawab pertanyaan.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_8_5.jpg"
  },
  {
    "id": 48,
    "title": "Bimbingan Belajar & Interaksi Ceria di Sekolah - Foto Bersama Anak-Anak Kelas",
    "date": "27 Juli 2026",
    "desc": "Dokumentasi penuh kehangatan bersama para murid di ruang kelas sekolah dasar.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_8_6.jpg"
  },
  {
    "id": 49,
    "title": "Menyambut Tim Evaluasi Kinerja Kecamatan (EKK) - Foto Bersama di Gerbang Penilaian EKK",
    "date": "28 Juli 2026",
    "desc": "Mahasiswa KKN foto bersama di bawah spanduk Selamat Datang Tim Penilai Evaluasi Kinerja Kecamatan (EKK).",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_9_1.jpg"
  },
  {
    "id": 50,
    "title": "Menyambut Tim Evaluasi Kinerja Kecamatan (EKK) - Sinergi Aparatur Kecamatan & Kelurahan",
    "date": "28 Juli 2026",
    "desc": "Dokumentasi kebersamaan staf pemerintah Pasir Penyu dan mahasiswa KKN dalam menyukseskan agenda evaluasi.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_9_2.jpg"
  },
  {
    "id": 51,
    "title": "Menyambut Tim Evaluasi Kinerja Kecamatan (EKK) - Membantu Administrasi Evaluasi",
    "date": "28 Juli 2026",
    "desc": "Mahasiswa turut membantu kesiapan berkas dan penyambutan tim verifikasi kinerja lapangan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_9_3.jpg"
  },
  {
    "id": 52,
    "title": "Menyambut Tim Evaluasi Kinerja Kecamatan (EKK) - Koordinasi Protokoler Acara",
    "date": "28 Juli 2026",
    "desc": "Kesiagaan tim KKN mendampingi jalannya acara penilaian kinerja di kantor pemerintahan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_9_4.jpg"
  },
  {
    "id": 53,
    "title": "Menyambut Tim Evaluasi Kinerja Kecamatan (EKK) - Diskusi dengan Pejabat Kecamatan",
    "date": "28 Juli 2026",
    "desc": "Bincang singkat mahasiswa KKN bersama perwakilan pemerintah daerah mengenai pelayanan publik.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_9_5.jpg"
  },
  {
    "id": 54,
    "title": "Menyambut Tim Evaluasi Kinerja Kecamatan (EKK) - Apresiasi Kinerja Kelurahan",
    "date": "28 Juli 2026",
    "desc": "Momen kebersamaan usai rangkaian visitasi dan penilaian evaluasi kinerja berlangsung sukses.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_9_6.jpg"
  },
  {
    "id": 55,
    "title": "Kegiatan Keagamaan & Silaturahmi Rutin di Masjid - 4-Grid Selfie Anggota KKN di Masjid",
    "date": "29 Juli 2026",
    "desc": "Potret 4-grid ceria mahasiswi KKN mengenakan jilbab motif saat menghadiri acara di masjid.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_10_1.jpg"
  },
  {
    "id": 56,
    "title": "Kegiatan Keagamaan & Silaturahmi Rutin di Masjid - Kehadiran di Pengajian Kaum Ibu",
    "date": "29 Juli 2026",
    "desc": "Mahasiswi KKN berpartisipasi aktif dalam kegiatan majelis taklim dan silaturahmi bersama warga.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_10_2.jpg"
  },
  {
    "id": 57,
    "title": "Kegiatan Keagamaan & Silaturahmi Rutin di Masjid - Menyimak Tausiyah Keagamaan",
    "date": "29 Juli 2026",
    "desc": "Suasana khidmat mendengarkan nasihat agama bersama jemaah masjid lingkungan setempat.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_10_3.jpg"
  },
  {
    "id": 58,
    "title": "Kegiatan Keagamaan & Silaturahmi Rutin di Masjid - Ramah Tamah dengan Jemaah Ibu-Ibu",
    "date": "29 Juli 2026",
    "desc": "Berbincang akrab dan bersalaman dengan ibu-ibu pengajian usai kegiatan taklim selesai.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_10_4.jpg"
  },
  {
    "id": 59,
    "title": "Kegiatan Keagamaan & Silaturahmi Rutin di Masjid - Keceriaan di Serambi Masjid",
    "date": "29 Juli 2026",
    "desc": "Momen candid santai dan senyuman ramah anggota tim KKN di area halaman masjid.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_10_5.jpg"
  },
  {
    "id": 60,
    "title": "Kegiatan Keagamaan & Silaturahmi Rutin di Masjid - Dokumentasi Kompak Mahasiswi KKN",
    "date": "29 Juli 2026",
    "desc": "Pose kompak anggota tim KKN yang selalu siap berbaur dengan seluruh lapisan masyarakat.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_10_6.jpg"
  },
  {
    "id": 61,
    "title": "Wirid Yasinan & Pengajian Malam Bersama Jemaah - Majelis Wirid di Karpet Hijau Masjid",
    "date": "30 Juli 2026",
    "desc": "Suasana khusyuk pembacaan surah Yasin dan doa bersama bapak-bapak dan ibu-ibu di dalam masjid yang megah.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_11_1.jpg"
  },
  {
    "id": 62,
    "title": "Wirid Yasinan & Pengajian Malam Bersama Jemaah - Lantunan Doa Bersama Tokoh Agama",
    "date": "30 Juli 2026",
    "desc": "Jemaah dan mahasiswa KKN larut dalam zikir dan doa mengharap keberkahan untuk warga desa.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_11_2.jpg"
  },
  {
    "id": 63,
    "title": "Wirid Yasinan & Pengajian Malam Bersama Jemaah - Kehangatan Jamaah Laki-Laki & Perempuan",
    "date": "30 Juli 2026",
    "desc": "Partisipasi lengkap mahasiswa dan mahasiswi KKN berbaur bersama masyarakat dalam wirid mingguan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_11_3.jpg"
  },
  {
    "id": 64,
    "title": "Wirid Yasinan & Pengajian Malam Bersama Jemaah - Mendengarkan Ceramah Agama",
    "date": "30 Juli 2026",
    "desc": "Ustadz menyampaikan tausiyah memperkuat ukhuwah islamiyah dan kerukunan warga.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_11_4.jpg"
  },
  {
    "id": 65,
    "title": "Wirid Yasinan & Pengajian Malam Bersama Jemaah - Menikmati Jamuan Ringan Usai Wirid",
    "date": "30 Juli 2026",
    "desc": "Momen santap kue dan teh hangat bersama para jemaah setelah pembacaan doa selesai.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_11_5.jpg"
  },
  {
    "id": 66,
    "title": "Wirid Yasinan & Pengajian Malam Bersama Jemaah - Silaturahmi Penutup Pengajian",
    "date": "30 Juli 2026",
    "desc": "Salaman hangat dan perbincangan akrab antara mahasiswa KKN dengan para tokoh alim ulama.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_11_6.jpg"
  },
  {
    "id": 67,
    "title": "Pertemuan & Sosialisasi Akbar Siswa Madrasah/Pesantren - Foto Akbar Bersama Ratusan Siswa/Santri",
    "date": "31 Juli 2026",
    "desc": "Pose serempak tangan di dada bersama ratusan santri/siswa madrasah di dalam aula serbaguna yang luas.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_12_1.jpg"
  },
  {
    "id": 68,
    "title": "Pertemuan & Sosialisasi Akbar Siswa Madrasah/Pesantren - Antusiasme Seluruh Peserta Sosialisasi",
    "date": "31 Juli 2026",
    "desc": "Riuh semangat para santriwan dan santriwati mengikuti jalannya materi pembinaan karakter.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_12_2.jpg"
  },
  {
    "id": 69,
    "title": "Pertemuan & Sosialisasi Akbar Siswa Madrasah/Pesantren - Penyampaian Materi Motivasi Belajar",
    "date": "31 Juli 2026",
    "desc": "Mahasiswa KKN memberikan motivasi pentingnya melanjutkan pendidikan tinggi dan meraih cita-cita.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_12_3.jpg"
  },
  {
    "id": 70,
    "title": "Pertemuan & Sosialisasi Akbar Siswa Madrasah/Pesantren - Interaksi & Tanya Jawab Santri",
    "date": "31 Juli 2026",
    "desc": "Siswa madrasah antusias mengacungkan tangan menjawab pertanyaan seputar wawasan keilmuan.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_12_4.jpg"
  },
  {
    "id": 71,
    "title": "Pertemuan & Sosialisasi Akbar Siswa Madrasah/Pesantren - Pemberian Cenderamata & Hadiah",
    "date": "31 Juli 2026",
    "desc": "Penyerahan apresiasi kepada peserta yang paling aktif dan berprestasi selama sesi sosialisasi.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_12_5.jpg"
  },
  {
    "id": 72,
    "title": "Pertemuan & Sosialisasi Akbar Siswa Madrasah/Pesantren - Sesi Salam Kompak Penutupan",
    "date": "31 Juli 2026",
    "desc": "Gema yel-yel dan salam penutup mempererat hubungan antara tim KKN dan civitas madrasah.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_12_6.jpg"
  },
  {
    "id": 73,
    "title": "Edukasi Gerakan Gemar Menabung Sejak Dini di SD - Photobooth 'Menabung Itu Keren'",
    "date": "1 Agustus 2026",
    "desc": "Mahasiswa KKN berpose dengan frame photobooth bertema edukasi menabung dan literasi keuangan anak.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_13_1.jpg"
  },
  {
    "id": 74,
    "title": "Edukasi Gerakan Gemar Menabung Sejak Dini di SD - Pengenalan Celengan Kreatif",
    "date": "1 Agustus 2026",
    "desc": "Mengajarkan siswa menyisihkan uang jajan untuk ditabung ke dalam celengan karakter buatan sendiri.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_13_2.jpg"
  },
  {
    "id": 75,
    "title": "Edukasi Gerakan Gemar Menabung Sejak Dini di SD - Pemberian Materi Literasi Keuangan",
    "date": "1 Agustus 2026",
    "desc": "Edukasi sederhana tentang perbedaan kebutuhan vs keinginan kepada murid sekolah dasar.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_13_3.jpg"
  },
  {
    "id": 76,
    "title": "Edukasi Gerakan Gemar Menabung Sejak Dini di SD - Keceriaan Anak-Anak Berfoto di Frame KKN",
    "date": "1 Agustus 2026",
    "desc": "Siswa-siswi bergantian foto di frame 'Sedikit demi sedikit, lama-lama jadi bukit'.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_13_4.jpg"
  },
  {
    "id": 77,
    "title": "Edukasi Gerakan Gemar Menabung Sejak Dini di SD - Praktik Menabung Bersama Murid",
    "date": "1 Agustus 2026",
    "desc": "Simulasi memasukkan koin pertama ke celengan sebagai langkah awal membiasakan budaya hemat.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_13_5.jpg"
  },
  {
    "id": 78,
    "title": "Edukasi Gerakan Gemar Menabung Sejak Dini di SD - Foto Bersama Tim Edukasi Menabung",
    "date": "1 Agustus 2026",
    "desc": "Dokumentasi penutupan program kerja literasi keuangan bersama para guru dan siswa.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_13_6.jpg"
  },
  {
    "id": 79,
    "title": "Pembelajaran Interaktif Berbasis Smart Board di Kelas - Mengajar Menggunakan Layar Digital Smart Board",
    "date": "3 Agustus 2026",
    "desc": "Mahasiswa KKN mengajarkan materi dasar tulisan Arab dan kosakata melalui papan tulis interaktif digital.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_15_1.jpg"
  },
  {
    "id": 80,
    "title": "Pembelajaran Interaktif Berbasis Smart Board di Kelas - Fokus Siswa Menyimak Pembelajaran Visual",
    "date": "3 Agustus 2026",
    "desc": "Anak-anak kelas tampak antusias dan tertib memperhatikan materi interaktif di layar depan kelas.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_15_2.jpg"
  },
  {
    "id": 81,
    "title": "Pembelajaran Interaktif Berbasis Smart Board di Kelas - Praktik Menulis di Smart Board",
    "date": "3 Agustus 2026",
    "desc": "Siswa dipandu maju ke depan untuk mencoba menuliskan kata pada papan digital modern.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_15_3.jpg"
  },
  {
    "id": 82,
    "title": "Pembelajaran Interaktif Berbasis Smart Board di Kelas - Suasana Kelas yang Interaktif dan Hidup",
    "date": "3 Agustus 2026",
    "desc": "Metode belajar visual membuat suasana kelas menjadi menyenangkan dan mudah dipahami siswa.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_15_4.jpg"
  },
  {
    "id": 83,
    "title": "Pembelajaran Interaktif Berbasis Smart Board di Kelas - Evaluasi Pemahaman Materi",
    "date": "3 Agustus 2026",
    "desc": "Tanya jawab cepat menguji daya tangkap murid terhadap materi yang baru dipelajari.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_15_5.jpg"
  },
  {
    "id": 84,
    "title": "Pembelajaran Interaktif Berbasis Smart Board di Kelas - Apresiasi Guru Terhadap Inovasi Belajar",
    "date": "3 Agustus 2026",
    "desc": "Dewan guru mengapresiasi pemanfaatan teknologi digital dalam kegiatan belajar mengajar di SD.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_15_6.jpg"
  },
  {
    "id": 85,
    "title": "Belanja Kebutuhan Logistik Posko di Pasar Tradisional - Memilih Komoditas Bumbu di Lapak Pasar",
    "date": "4 Agustus 2026",
    "desc": "Mahasiswi KKN berbelanja stok bawang putih, bawang merah, dan cabai merah di pasar tradisional.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_16_1.jpg"
  },
  {
    "id": 86,
    "title": "Belanja Kebutuhan Logistik Posko di Pasar Tradisional - Interaksi Hangat dengan Pedagang Pasar",
    "date": "4 Agustus 2026",
    "desc": "Momen tawar-menawar ramah dan perbincangan akrab bersama pedagang sayur setempat.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_16_2.jpg"
  },
  {
    "id": 87,
    "title": "Belanja Kebutuhan Logistik Posko di Pasar Tradisional - Menimbang Belanjaan Dapur Posko",
    "date": "4 Agustus 2026",
    "desc": "Penimbangan bumbu dapur segar untuk kebutuhan konsumsi makan bersama di posko KKN.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_16_3.jpg"
  },
  {
    "id": 88,
    "title": "Belanja Kebutuhan Logistik Posko di Pasar Tradisional - Suasana Keramaian Pasar Pagi",
    "date": "4 Agustus 2026",
    "desc": "Dokumentasi geliat aktivitas ekonomi masyarakat lokal di pasar rakyat Tanjung Gading.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_16_4.jpg"
  },
  {
    "id": 89,
    "title": "Belanja Kebutuhan Logistik Posko di Pasar Tradisional - Membeli Sayuran dan Lauk Segar",
    "date": "4 Agustus 2026",
    "desc": "Memilih sayuran hijau dan bahan makanan bergizi untuk menu masak harian tim pengabdian.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_16_5.jpg"
  },
  {
    "id": 90,
    "title": "Belanja Kebutuhan Logistik Posko di Pasar Tradisional - Membawa Belanjaan Kembali ke Posko",
    "date": "4 Agustus 2026",
    "desc": "Keseruan anggota tim membawa keranjang belanjaan penuh bahan makanan segar siap masak.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_16_6.jpg"
  },
  {
    "id": 91,
    "title": "Pemasangan Umbul-Umbul & Bendera Merah Putih di Jalan - Gotong Royong & Pose Candid Lucu Bersama Warga",
    "date": "5 Agustus 2026",
    "desc": "Foto penuh tawa mahasiswa bermahkota daun nanas bersama Bu Lurah, tokoh warga, dan pemuda di pinggir jalan.",
    "category": "Gotong Royong",
    "url": "/images/galeri/kkn_day_17_1.jpg"
  },
  {
    "id": 92,
    "title": "Pemasangan Umbul-Umbul & Bendera Merah Putih di Jalan - Memasang Tiang Bendera Merah Putih",
    "date": "5 Agustus 2026",
    "desc": "Bahu-membahu mendirikan tiang bambu bendera di sepanjang trotoar jalan utama kelurahan.",
    "category": "Gotong Royong",
    "url": "/images/galeri/kkn_day_17_2.jpg"
  },
  {
    "id": 93,
    "title": "Pemasangan Umbul-Umbul & Bendera Merah Putih di Jalan - Merapikan Umbul-Umbul Kemerdekaan",
    "date": "5 Agustus 2026",
    "desc": "Pemasangan hiasan kain merah putih menyambut hari ulang tahun kemerdekaan Republik Indonesia.",
    "category": "Gotong Royong",
    "url": "/images/galeri/kkn_day_17_3.jpg"
  },
  {
    "id": 94,
    "title": "Pemasangan Umbul-Umbul & Bendera Merah Putih di Jalan - Kebersamaan Warga & Mahasiswa di Pinggir Jalan",
    "date": "5 Agustus 2026",
    "desc": "Semangat gotong royong warga segala usia mempercantik tata jalan lingkungan kelurahan.",
    "category": "Gotong Royong",
    "url": "/images/galeri/kkn_day_17_4.jpg"
  },
  {
    "id": 95,
    "title": "Pemasangan Umbul-Umbul & Bendera Merah Putih di Jalan - Canda Tawa Melepas Lelah",
    "date": "5 Agustus 2026",
    "desc": "Momen istirahat minum es bersama warga dan aparat kelurahan usai memasang deretan umbul-umbul.",
    "category": "Gotong Royong",
    "url": "/images/galeri/kkn_day_17_5.jpg"
  },
  {
    "id": 96,
    "title": "Pemasangan Umbul-Umbul & Bendera Merah Putih di Jalan - Wajah Lingkungan yang Semarak Merah Putih",
    "date": "5 Agustus 2026",
    "desc": "Pemandangan jalan poros desa yang kini semarak dengan kibaran bendera merah putih yang rapi.",
    "category": "Gotong Royong",
    "url": "/images/galeri/kkn_day_17_6.jpg"
  },
  {
    "id": 97,
    "title": "Penyuluhan Remaja & Senam Bersama Siswa SMA/SMK - Foto Akbar Bersama Siswa Kaus Olahraga Biru",
    "date": "6 Agustus 2026",
    "desc": "Pose kompak bersama puluhan siswa-siswi SMA/SMK di depan gedung sekolah bertuliskan running text.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_18_1.jpg"
  },
  {
    "id": 98,
    "title": "Penyuluhan Remaja & Senam Bersama Siswa SMA/SMK - Sosialisasi Perilaku Hidup Bersih & Sehat",
    "date": "6 Agustus 2026",
    "desc": "Penyuluhan edukatif bagi kalangan remaja tentang kesehatan, pergaulan positif, dan anti-bullying.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_18_2.jpg"
  },
  {
    "id": 99,
    "title": "Penyuluhan Remaja & Senam Bersama Siswa SMA/SMK - Olahraga Pagi Bersama Siswa Sekolah Menengah",
    "date": "6 Agustus 2026",
    "desc": "Keseruan pemanasan dan olahraga bersama di lapangan sekolah yang luas.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_18_3.jpg"
  },
  {
    "id": 100,
    "title": "Penyuluhan Remaja & Senam Bersama Siswa SMA/SMK - Tanya Jawab & Sharing Inspirasi Kuliah",
    "date": "6 Agustus 2026",
    "desc": "Sesi berbagi cerita dunia perkuliahan dan kiat memilih jurusan perguruan tinggi bagi siswa kelas akhir.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_18_4.jpg"
  },
  {
    "id": 101,
    "title": "Penyuluhan Remaja & Senam Bersama Siswa SMA/SMK - Apresiasi Siswa Teraktif",
    "date": "6 Agustus 2026",
    "desc": "Pemberian doorprize kecil kepada siswa yang berani berbagi impian dan menjawab kuis motivasi.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_18_5.jpg"
  },
  {
    "id": 102,
    "title": "Penyuluhan Remaja & Senam Bersama Siswa SMA/SMK - Salam Hangat Perpisahan Sesi Sekolah",
    "date": "6 Agustus 2026",
    "desc": "Siswa dan tim KKN saling bersalaman dan berterima kasih atas sesi edukasi yang inspiratif.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_18_6.jpg"
  },
  {
    "id": 103,
    "title": "Sosialisasi Literasi Digital & Anti-Hoaks untuk Ibu-Ibu PKK - Presentasi Materi 'Waspada Pesan Berantai'",
    "date": "7 Agustus 2026",
    "desc": "Mahasiswa KKN memaparkan materi cara mendeteksi penipuan online dan pesan hoaks di depan ibu-ibu PKK berseragam toska.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_19_1.jpg"
  },
  {
    "id": 104,
    "title": "Sosialisasi Literasi Digital & Anti-Hoaks untuk Ibu-Ibu PKK - Antusiasme Ibu-Ibu PKK Menyimak Materi",
    "date": "7 Agustus 2026",
    "desc": "Ibu-ibu kader PKK memperhatikan dengan saksama tips aman bermedia sosial dan transaksi digital.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_19_2.jpg"
  },
  {
    "id": 105,
    "title": "Sosialisasi Literasi Digital & Anti-Hoaks untuk Ibu-Ibu PKK - Bedah Kasus Modus Penipuan WhatsApp",
    "date": "7 Agustus 2026",
    "desc": "Penjelasan studi kasus link phising dan modus penipuan kurir paket atau undangan pernikahan digital.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_19_3.jpg"
  },
  {
    "id": 106,
    "title": "Sosialisasi Literasi Digital & Anti-Hoaks untuk Ibu-Ibu PKK - Tanya Jawab Pengalaman Pribadi Ibu PKK",
    "date": "7 Agustus 2026",
    "desc": "Diskusi interaktif seputar pengalaman warga menerima pesan mencurigakan di smartphone mereka.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_19_4.jpg"
  },
  {
    "id": 107,
    "title": "Sosialisasi Literasi Digital & Anti-Hoaks untuk Ibu-Ibu PKK - Tips Mengamankan Akun dan Data Pribadi",
    "date": "7 Agustus 2026",
    "desc": "Panduan praktis mengaktifkan verifikasi 2 langkah pada aplikasi perpesanan bagi para kader.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_19_5.jpg"
  },
  {
    "id": 108,
    "title": "Sosialisasi Literasi Digital & Anti-Hoaks untuk Ibu-Ibu PKK - Foto Bersama Pengurus PKK Tanjung Gading",
    "date": "7 Agustus 2026",
    "desc": "Dokumentasi kebersamaan tim KKN bersama seluruh jajaran pengurus PKK usai penyuluhan digital selesai.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_19_6.jpg"
  },
  {
    "id": 109,
    "title": "Senam Kemerdekaan Busana Merah Putih Bersama PKK - Senam Pagi Kemerdekaan Bernuansa Merah Putih",
    "date": "8 Agustus 2026",
    "desc": "Ibu-ibu PKK dan mahasiswa KKN berbaris rapi di halaman kantor lurah mengenakan kostum serasi merah putih.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_20_1.jpg"
  },
  {
    "id": 110,
    "title": "Senam Kemerdekaan Busana Merah Putih Bersama PKK - Gerakan Energik Penuh Semangat Pagi",
    "date": "8 Agustus 2026",
    "desc": "Iringan musik senam membakar semangat peserta untuk terus bergerak menjaga kesehatan tubuh.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_20_2.jpg"
  },
  {
    "id": 111,
    "title": "Senam Kemerdekaan Busana Merah Putih Bersama PKK - Kebersamaan Meriah Sambut HUT RI",
    "date": "8 Agustus 2026",
    "desc": "Semarak merah putih menyatu dalam tawa dan keceriaan seluruh elemen masyarakat desa.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_20_3.jpg"
  },
  {
    "id": 112,
    "title": "Senam Kemerdekaan Busana Merah Putih Bersama PKK - Instruktur Senam Memimpin Irama",
    "date": "8 Agustus 2026",
    "desc": "Gerakan senam dipandu dengan enerjik diiringi sorak ceria para peserta di halaman kelurahan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_20_4.jpg"
  },
  {
    "id": 113,
    "title": "Senam Kemerdekaan Busana Merah Putih Bersama PKK - Pose Bersama Usai Senam Kemerdekaan",
    "date": "8 Agustus 2026",
    "desc": "Foto bersama peserta senam merah putih membentuk barisan rapi di depan gedung kantor kelurahan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_20_5.jpg"
  },
  {
    "id": 114,
    "title": "Senam Kemerdekaan Busana Merah Putih Bersama PKK - Pendinginan & Menikmati Kudapan Pagi",
    "date": "8 Agustus 2026",
    "desc": "Suasana santai menikmati bubur kacang hijau dan minuman hangat bersama para ibu kader.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_20_6.jpg"
  },
  {
    "id": 115,
    "title": "Bakti Kesehatan & Kolaborasi Lintas KKN di Puskesmas - Foto Bersama di Depan Gedung Puskesmas",
    "date": "9 Agustus 2026",
    "desc": "Gabungan mahasiswa KKN dan tenaga kesehatan foto bersama di pelataran UPT Puskesmas Air Molek II.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_21_1.jpg"
  },
  {
    "id": 116,
    "title": "Bakti Kesehatan & Kolaborasi Lintas KKN di Puskesmas - Kolaborasi Pelayanan Posyandu & Kesehatan",
    "date": "9 Agustus 2026",
    "desc": "Membantu registrasi, penimbangan berat badan balita, dan edukasi sanitasi lingkungan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_21_2.jpg"
  },
  {
    "id": 117,
    "title": "Bakti Kesehatan & Kolaborasi Lintas KKN di Puskesmas - Pendampingan Pemeriksaan Kesehatan Warga",
    "date": "9 Agustus 2026",
    "desc": "Mahasiswa turut membantu alur antrean lansia dan masyarakat yang datang memeriksakan kesehatan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_21_3.jpg"
  },
  {
    "id": 118,
    "title": "Bakti Kesehatan & Kolaborasi Lintas KKN di Puskesmas - Pertukaran Pengalaman Lintas Kelompok KKN",
    "date": "9 Agustus 2026",
    "desc": "Diskusi hangat dan silaturahmi antar mahasiswa berbagai posko KKN di wilayah Pasir Penyu.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_21_4.jpg"
  },
  {
    "id": 119,
    "title": "Bakti Kesehatan & Kolaborasi Lintas KKN di Puskesmas - Edukasi Pola Hidup Bersih & Sehat (PHBS)",
    "date": "9 Agustus 2026",
    "desc": "Penyampaian pamflet kesehatan pencegahan stunting dan pentingnya imunisasi lengkap.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_21_5.jpg"
  },
  {
    "id": 120,
    "title": "Bakti Kesehatan & Kolaborasi Lintas KKN di Puskesmas - Apresiasi dari Tenaga Medis Puskesmas",
    "date": "9 Agustus 2026",
    "desc": "Pihak pimpinan Puskesmas menyampaikan terima kasih atas kontribusi aktif mahasiswa KKN.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_21_6.jpg"
  },
  {
    "id": 121,
    "title": "Silaturahmi ke Rumah Tokoh Sesepuh Didampingi Bu Lurah - Duduk Bersila Mendengarkan Petuah Tetua",
    "date": "10 Agustus 2026",
    "desc": "Ibu Lurah bersama mahasiswa KKN duduk bersila di atas karpet mendengarkan wejangan dari tokoh sesepuh kelurahan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_22_1.jpg"
  },
  {
    "id": 122,
    "title": "Silaturahmi ke Rumah Tokoh Sesepuh Didampingi Bu Lurah - Menggali Sejarah & Kearifan Lokal Desa",
    "date": "10 Agustus 2026",
    "desc": "Perbincangan hangat mengenai asal-usul, tradisi budaya, dan perkembangan Kelurahan Tanjung Gading.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_22_2.jpg"
  },
  {
    "id": 123,
    "title": "Silaturahmi ke Rumah Tokoh Sesepuh Didampingi Bu Lurah - Sajian Tradisional & Ramah Tamah Keluarga",
    "date": "10 Agustus 2026",
    "desc": "Menikmati buah semangka dan aneka jajanan pasar yang disuguhkan penuh keramahtamahan oleh tuan rumah.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_22_3.jpg"
  },
  {
    "id": 124,
    "title": "Silaturahmi ke Rumah Tokoh Sesepuh Didampingi Bu Lurah - Nasihat Kehidupan untuk Generasi Muda",
    "date": "10 Agustus 2026",
    "desc": "Sesepuh desa memberikan pesan moral dan dorongan semangat bagi mahasiswa dalam menyelesaikan studi.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_22_4.jpg"
  },
  {
    "id": 125,
    "title": "Silaturahmi ke Rumah Tokoh Sesepuh Didampingi Bu Lurah - Penyampaian Rasa Terima Kasih Tim KKN",
    "date": "10 Agustus 2026",
    "desc": "Mahasiswa menghaturkan apresiasi atas penerimaan warga desa yang begitu hangat dan penuh kekeluargaan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_22_5.jpg"
  },
  {
    "id": 126,
    "title": "Silaturahmi ke Rumah Tokoh Sesepuh Didampingi Bu Lurah - Salaman Berkah Menutup Kunjungan",
    "date": "10 Agustus 2026",
    "desc": "Momen berpamitan dengan cium tangan penuh takzim kepada para tetua lingkungan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_22_6.jpg"
  },
  {
    "id": 127,
    "title": "Latihan Senam Kreasi Bersama Warga Sambut 17 Agustus - Latihan Koreografi Senam di Halaman Kelurahan",
    "date": "11 Agustus 2026",
    "desc": "Warga dan mahasiswa giat berlatih variasi gerakan senam kreasi untuk perlombaan menyambut HUT RI.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_23_1.jpg"
  },
  {
    "id": 128,
    "title": "Latihan Senam Kreasi Bersama Warga Sambut 17 Agustus - Irama Musik Senam yang Menggugah Semangat",
    "date": "11 Agustus 2026",
    "desc": "Kekompakan gerakan tangan dan kaki selaras dengan ketukan musik lagu-lagu nasional.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_23_2.jpg"
  },
  {
    "id": 129,
    "title": "Latihan Senam Kreasi Bersama Warga Sambut 17 Agustus - Evaluasi Kekompakan Formasi",
    "date": "11 Agustus 2026",
    "desc": "Memperbaiki formasi barisan agar tampilan senam semakin rapi dan memukau.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_23_3.jpg"
  },
  {
    "id": 130,
    "title": "Latihan Senam Kreasi Bersama Warga Sambut 17 Agustus - Canda Tawa di Sela Waktu Latihan",
    "date": "11 Agustus 2026",
    "desc": "Suasana santai penuh keakraban saat mengulang gerakan yang lucu dan menghibur.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_23_4.jpg"
  },
  {
    "id": 131,
    "title": "Latihan Senam Kreasi Bersama Warga Sambut 17 Agustus - Dukungan Penuh dari Perangkat Kelurahan",
    "date": "11 Agustus 2026",
    "desc": "Staf kelurahan turut memberikan semangat dan fasilitas terbaik demi kesuksesan agenda warga.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_23_5.jpg"
  },
  {
    "id": 132,
    "title": "Latihan Senam Kreasi Bersama Warga Sambut 17 Agustus - Kesiapan Menghadapi Perlombaan Senam",
    "date": "11 Agustus 2026",
    "desc": "Optimisme tim senam kelurahan untuk menampilkan yang terbaik pada puncak perayaan kemerdekaan.",
    "category": "Sosial & Budaya",
    "url": "/images/galeri/kkn_day_23_6.jpg"
  },
  {
    "id": 133,
    "title": "Karya Kostum Karnaval Daur Ulang Ramah Lingkungan SDN 008 - Fitting Gaun Megah Daur Ulang SDN 008",
    "date": "12 Agustus 2026",
    "desc": "Mahasiswi KKN memperagakan mahakarya gaun karnaval bersayap yang terbuat dari bahan daur ulang kardus dan foil.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_24_1.jpg"
  },
  {
    "id": 134,
    "title": "Karya Kostum Karnaval Daur Ulang Ramah Lingkungan SDN 008 - Detail Hiasan Bunga & Mahkota Kertas",
    "date": "12 Agustus 2026",
    "desc": "Kerajinan tangan detail kelopak bunga daur ulang yang dirangkai teliti menjadi mahkota dan sayap artistik.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_24_2.jpg"
  },
  {
    "id": 135,
    "title": "Karya Kostum Karnaval Daur Ulang Ramah Lingkungan SDN 008 - Proses Perancangan Kostum Kreatif di Posko",
    "date": "12 Agustus 2026",
    "desc": "Mahasiswa KKN bersama siswa merangkai lembaran koran, kardus bekas, dan bungkus kopi menjadi pakaian megah.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_24_3.jpg"
  },
  {
    "id": 136,
    "title": "Karya Kostum Karnaval Daur Ulang Ramah Lingkungan SDN 008 - Sentuhan Akhir Pemasangan Selempang SDN 008",
    "date": "12 Agustus 2026",
    "desc": "Menempelkan aksen identitas sekolah SDN 008 pada bagian depan busana karnaval ramah lingkungan.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_24_4.jpg"
  },
  {
    "id": 137,
    "title": "Karya Kostum Karnaval Daur Ulang Ramah Lingkungan SDN 008 - Edukasi Pengelolaan Sampah Jadi Mahakarya",
    "date": "12 Agustus 2026",
    "desc": "Mengajarkan nilai edukasi bahwa barang bekas dapat diubah menjadi karya seni bernilai estetika tinggi.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_24_5.jpg"
  },
  {
    "id": 138,
    "title": "Karya Kostum Karnaval Daur Ulang Ramah Lingkungan SDN 008 - Pose Bangga Tim Kreator Busana Daur Ulang",
    "date": "12 Agustus 2026",
    "desc": "Dokumentasi rasa syukur atas selesainya rancangan kostum yang siap dipakai pada parade kemerdekaan.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_24_6.jpg"
  },
  {
    "id": 139,
    "title": "Persiapan Logistik & Spanduk Publikasi KKN UIN Suska - Mengambil Roll Spanduk KKN UIN Suska",
    "date": "13 Agustus 2026",
    "desc": "Mahasiswa mengambil gulungan banner resmi KKN UIN Suska yang baru selesai dicetak di percetakan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_25_1.jpg"
  },
  {
    "id": 140,
    "title": "Persiapan Logistik & Spanduk Publikasi KKN UIN Suska - Pengecekan Kualitas Cetak & Ukuran Banner",
    "date": "13 Agustus 2026",
    "desc": "Memastikan hasil cetak warna dan teks nama program kerja tercetak jelas dan tajam.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_25_2.jpg"
  },
  {
    "id": 141,
    "title": "Persiapan Logistik & Spanduk Publikasi KKN UIN Suska - Kesiapan Logistik Perlengkapan Acara Puncak",
    "date": "13 Agustus 2026",
    "desc": "Inventarisasi perlengkapan hadiah lomba, tenda, sound system, dan dekorasi panggung penutupan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_25_3.jpg"
  },
  {
    "id": 142,
    "title": "Persiapan Logistik & Spanduk Publikasi KKN UIN Suska - Koordinasi Akhir Panitia Mahasiswa & Pemuda",
    "date": "13 Agustus 2026",
    "desc": "Rapat pematangan rundown acara perayaan kemerdekaan dan malam keakraban perpisahan.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_25_4.jpg"
  },
  {
    "id": 143,
    "title": "Persiapan Logistik & Spanduk Publikasi KKN UIN Suska - Distribusi Undangan untuk Tokoh Masyarakat",
    "date": "13 Agustus 2026",
    "desc": "Menyiapkan surat undangan resmi untuk Ibu Lurah, kepala lingkungan, dan warga Tanjung Gading.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_25_5.jpg"
  },
  {
    "id": 144,
    "title": "Persiapan Logistik & Spanduk Publikasi KKN UIN Suska - Semangat Menjelang Hari Puncak Pengabdian",
    "date": "13 Agustus 2026",
    "desc": "Antusiasme seluruh anggota menyelesaikan tahapan akhir pengabdian dengan hasil terbaik.",
    "category": "Sosialisasi",
    "url": "/images/galeri/kkn_day_25_6.jpg"
  },
  {
    "id": 145,
    "title": "Karnaval Kemerdekaan & Fashion Show Baju Daur Ulang SDN 008 - Parade Kostum Daur Ulang di SDN 008 Tanjung Gading",
    "date": "14 Agustus 2026",
    "desc": "Foto bersama para guru berbusana pink ceria dan siswa-siswi yang mengenakan aneka gaun megah dari botol plastik, koran, dan kardus.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_26_1.jpg"
  },
  {
    "id": 146,
    "title": "Karnaval Kemerdekaan & Fashion Show Baju Daur Ulang SDN 008 - Kreasi Gaun Rok Botol Plastik & Tutup Botol",
    "date": "14 Agustus 2026",
    "desc": "Siswa memperagakan gaun menakjubkan dengan rok bertingkat dari ratusan botol mineral bekas.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_26_2.jpg"
  },
  {
    "id": 147,
    "title": "Karnaval Kemerdekaan & Fashion Show Baju Daur Ulang SDN 008 - Gaun Bunga Koran & Kantong Kresek Cantik",
    "date": "14 Agustus 2026",
    "desc": "Kreativitas tingkat tinggi merangkai koran bekas menjadi gaun mekar anggun layaknya gaun pesta.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_26_3.jpg"
  },
  {
    "id": 148,
    "title": "Karnaval Kemerdekaan & Fashion Show Baju Daur Ulang SDN 008 - Antusiasme Dewan Guru dan Wali Murid",
    "date": "14 Agustus 2026",
    "desc": "Para guru SDN 008 memberikan apresiasi setinggi-tingginya atas bimbingan inovatif mahasiswa KKN.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_26_4.jpg"
  },
  {
    "id": 149,
    "title": "Karnaval Kemerdekaan & Fashion Show Baju Daur Ulang SDN 008 - Pemberian Selempang Juara Kostum Karnaval",
    "date": "14 Agustus 2026",
    "desc": "Momen pengumuman dan penyerahan penghargaan untuk karya busana daur ulang paling unik dan kreatif.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_26_5.jpg"
  },
  {
    "id": 150,
    "title": "Karnaval Kemerdekaan & Fashion Show Baju Daur Ulang SDN 008 - Foto Bersama Seluruh Pemenang & Tim KKN",
    "date": "14 Agustus 2026",
    "desc": "Dokumentasi penuh kebanggaan dan haru mengabadikan momen puncak kreativitas anak bangsa di SDN 008.",
    "category": "Edukasi",
    "url": "/images/galeri/kkn_day_26_6.jpg"
  }
];

async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session && session.value === 'tgading_admin_authorized_token';
  } catch {
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sync = searchParams.get('sync');
  const force = searchParams.get('force');

  if (kv) {
    try {
      let photos = await kv.get('galeri_items');
      
      // Auto update if empty or if force / sync is requested or if defaultPhotos updated
      const needsSync = !photos || photos.length !== defaultPhotos.length || sync === 'true' || force === 'true';
      if (needsSync) {
        // Overwrite or update with latest high-accuracy photo metadata
        await kv.set('galeri_items', defaultPhotos);
        photos = defaultPhotos;
      }
      return NextResponse.json(photos);
    } catch (error) {
      console.error('Vercel KV error in GET /api/galeri:', error);
      return NextResponse.json(defaultPhotos);
    }
  }
  return NextResponse.json(defaultPhotos);
}

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    let currentPhotos = defaultPhotos;

    if (kv) {
      const kvData = await kv.get('galeri_items');
      if (kvData && Array.isArray(kvData)) {
        currentPhotos = kvData;
      }
    }

    const newId = currentPhotos.length > 0 ? Math.max(...currentPhotos.map(p => p.id)) + 1 : 1;
    const newPhoto = {
      id: newId,
      title: body.title,
      date: body.date,
      desc: body.desc,
      category: body.category || 'Lainnya',
      url: body.url
    };

    const updatedPhotos = [newPhoto, ...currentPhotos];

    if (kv) {
      await kv.set('galeri_items', updatedPhotos);
    }

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/galeri:', error);
    return NextResponse.json({ error: 'Failed to create photo item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'), 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    let currentPhotos = defaultPhotos;
    if (kv) {
      const kvData = await kv.get('galeri_items');
      if (kvData && Array.isArray(kvData)) {
        currentPhotos = kvData;
      }
    }

    const updatedPhotos = currentPhotos.filter(p => p.id !== id);

    if (kv) {
      await kv.set('galeri_items', updatedPhotos);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/galeri:', error);
    return NextResponse.json({ error: 'Failed to delete photo item' }, { status: 500 });
  }
}
