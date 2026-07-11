import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// We dynamically import @vercel/kv to prevent compilation errors if the user hasn't linked it yet.
// If it fails, we fall back to a local/static cache or default list.
let kv;
try {
  const vercelKv = require('@vercel/kv');
  kv = vercelKv.kv;
} catch (e) {
  kv = null;
}

const defaultProker = [
  {
    id: 1,
    title: 'Penerimaan Kelompok KKN oleh Aparatur Kelurahan',
    date: '10 Juli 2026',
    status: 'Selesai',
    desc: 'Pertemuan resmi perdana bersama Lurah Tanjung Gading, jajaran perangkat kelurahan, dan tokoh pemuda untuk memaparkan program pengabdian KKN.',
  },
  {
    id: 2,
    title: 'Sosialisasi Digitalisasi Administrasi Kelurahan',
    date: '15 Juli 2026',
    status: 'Selesai',
    desc: 'Pelatihan dasar penggunaan platform digital tata kelola surat-menyurat untuk sekretariat kelurahan guna mempercepat layanan administrasi lingkungan.',
  },
  {
    id: 3,
    title: 'Bimbingan Belajar Matematika & Bahasa Inggris Ceria',
    date: '17 Juli - 10 Agustus 2026',
    status: 'Berlangsung',
    desc: 'Program bimbingan belajar gratis pasca sekolah untuk siswa SD dan SMP yang berfokus pada metode belajar interaktif dan edukasi karakter.',
  },
  {
    id: 4,
    title: 'Festival Keagamaan Anak Sholeh se-Tanjung Gading',
    date: '5 Agustus 2026',
    status: 'Direncanakan',
    desc: 'Perlombaan membaca Al-Qur\'an, azan, dan hafalan surah pendek tingkat lingkungan untuk meningkatkan syiar keagamaan anak-anak.',
  },
  {
    id: 5,
    title: 'Pelatihan Branding & Digital Marketing UMKM Sapu Lidi',
    date: '12 Agustus 2026',
    status: 'Direncanakan',
    desc: 'Pendampingan branding produk sapu lidi kreasi warga agar memiliki nilai jual tinggi secara digital serta perluasan kemitraan distribusi.',
  },
  {
    id: 6,
    title: 'Gotong Royong Raya & Perapian Plang Batas Wilayah',
    date: '18 Agustus 2026',
    status: 'Direncanakan',
    desc: 'Aksi kebersihan massal bersama masyarakat setempat sekaligus peresmian gapura/plang pembatas dusun hasil karya teknik sipil.',
  }
];

// Helper to check if request is authenticated
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
      return NextResponse.json(defaultProker);
    }
    
    let proker = await kv.get('proker_items');
    if (!proker) {
      // Initialize KV with default data if empty
      await kv.set('proker_items', defaultProker);
      proker = defaultProker;
    }
    return NextResponse.json(proker);
  } catch (error) {
    console.error("Error fetching proker from Vercel KV:", error);
    return NextResponse.json(defaultProker);
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
    let proker = await kv.get('proker_items') || defaultProker;

    if (item.id) {
      // Update existing
      const index = proker.findIndex(p => p.id === Number(item.id));
      if (index !== -1) {
        proker[index] = {
          ...proker[index],
          ...item,
          id: Number(item.id)
        };
      } else {
        // Fallback: If id specified but not found, push it
        item.id = Number(item.id);
        proker.push(item);
      }
    } else {
      // Create new
      const nextId = proker.length > 0 ? Math.max(...proker.map(p => p.id || 0)) + 1 : 1;
      const newItem = {
        ...item,
        id: nextId
      };
      proker.push(newItem);
    }

    await kv.set('proker_items', proker);
    return NextResponse.json({ success: true, data: proker });
  } catch (error) {
    console.error("Error saving proker to Vercel KV:", error);
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

    let proker = await kv.get('proker_items') || defaultProker;
    proker = proker.filter(p => p.id !== id);

    await kv.set('proker_items', proker);
    return NextResponse.json({ success: true, data: proker });
  } catch (error) {
    console.error("Error deleting proker from Vercel KV:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
