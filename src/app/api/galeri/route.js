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
    id: 1,
    title: 'Sosialisasi Administrasi Kelurahan Digital',
    category: 'Sosialisasi',
    date: '15 Juli 2026',
    desc: 'Pemaparan aplikasi pengelolaan arsip digital kepada perangkat Kelurahan Tanjung Gading guna mempermudah pelayanan warga.',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    id: 2,
    title: 'Bimbingan Belajar Ceria Sekolah Dasar',
    category: 'Edukasi',
    date: '17 Juli 2026',
    desc: 'Membimbing adik-adip tingkat SD belajar matematika dengan metode permainan kreatif di posko KKN.',
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    id: 3,
    title: 'Gotong Royong Kebersihan Lingkungan Dusun II',
    category: 'Gotong Royong',
    date: '19 Juli 2026',
    desc: 'Bahu-membahu bersama pemuda setempat membersihkan parit saluran air dan memasang tempat sampah pilah.',
    url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    id: 4,
    title: 'Mengajar Mengaji di TPA Masjid Al-Ikhlas',
    category: 'Edukasi',
    date: '20 Juli 2026',
    desc: 'Pendampingan belajar tajwid dan membaca Iqra untuk anak-anak Kelurahan Tanjung Gading seusai ibadah shalat ashar.',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    id: 5,
    title: 'Pelatihan Pemasaran Digital bagi UMKM Sawit',
    category: 'Sosialisasi',
    date: '22 Juli 2026',
    desc: 'Edukasi mengenai cara pengemasan menarik dan pemasaran lewat platform e-commerce bagi ibu-ibu pengrajin minyak sapu lidi.',
    url: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    id: 6,
    title: 'Pemasangan Plang Batas Wilayah Dusun',
    category: 'Gotong Royong',
    date: '24 Juli 2026',
    desc: 'Pemasangan plang nama jalan dan batas dusun hasil karya mahasiswa teknik sipil KKN di perbatasan kelurahan.',
    url: 'https://images.unsplash.com/photo-1590402421685-65d12a64564c?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    id: 7,
    title: 'Malam Keakraban dengan Warga & Tokoh Masyarakat',
    category: 'Sosial & Budaya',
    date: '26 Juli 2026',
    desc: 'Acara ramah tamah bersama kepala lurah, BPD, dan tokoh adat yang diisi dengan penampilan seni melayu dari anak-anak kelurahan.',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&h=600&q=80',
  },
  {
    id: 8,
    title: 'Eksplorasi Perkebunan Kelapa Sawit Pasir Penyu',
    category: 'Sosial & Budaya',
    date: '28 Juli 2026',
    desc: 'Dokumentasi potensi alam dan geografi Kelurahan Tanjung Gading yang kaya akan perkebunan kelapa sawit produktif.',
    url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&h=600&q=80',
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

export async function GET() {
  try {
    if (!kv || !process.env.KV_REST_API_URL) {
      console.warn("Vercel KV is not configured. Falling back to default static list.");
      return NextResponse.json(defaultPhotos);
    }
    
    let photos = await kv.get('galeri_items');
    if (!photos) {
      await kv.set('galeri_items', defaultPhotos);
      photos = defaultPhotos;
    }
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching galeri from Vercel KV:", error);
    return NextResponse.json(defaultPhotos);
  }
}

export async function POST(request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!kv || !process.env.KV_REST_API_URL) {
      return NextResponse.json({ error: 'Database Vercel KV belum terhubung!' }, { status: 500 });
    }

    const item = await request.json();
    let photos = await kv.get('galeri_items') || defaultPhotos;

    if (item.id) {
      // Update existing
      const index = photos.findIndex(p => p.id === Number(item.id));
      if (index !== -1) {
        photos[index] = {
          ...photos[index],
          ...item,
          id: Number(item.id)
        };
      } else {
        item.id = Number(item.id);
        photos.push(item);
      }
    } else {
      // Create new
      const nextId = photos.length > 0 ? Math.max(...photos.map(p => p.id || 0)) + 1 : 1;
      const newItem = {
        ...item,
        id: nextId
      };
      photos.push(newItem);
    }

    await kv.set('galeri_items', photos);
    return NextResponse.json({ success: true, data: photos });
  } catch (error) {
    console.error("Error saving galeri to Vercel KV:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!kv || !process.env.KV_REST_API_URL) {
      return NextResponse.json({ error: 'Database Vercel KV belum terhubung!' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    let photos = await kv.get('galeri_items') || defaultPhotos;
    photos = photos.filter(p => p.id !== id);

    await kv.set('galeri_items', photos);
    return NextResponse.json({ success: true, data: photos });
  } catch (error) {
    console.error("Error deleting galeri from Vercel KV:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
