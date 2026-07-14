import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// We dynamically import @vercel/kv to prevent compilation errors if the user hasn't linked it yet.
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

const localFilePath = path.join(process.cwd(), 'src/data/proker.json');

// Helper to read local JSON proker
function getLocalProker() {
  try {
    if (fs.existsSync(localFilePath)) {
      const data = fs.readFileSync(localFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Gagal membaca file lokal proker:", e);
  }
  return defaultProker;
}

// Helper to write local JSON proker
function saveLocalProker(data) {
  try {
    const dir = path.dirname(localFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error("Gagal menyimpan file lokal proker:", e);
    return false;
  }
}

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
      console.warn("Vercel KV is not configured. Falling back to local JSON storage.");
      return NextResponse.json(getLocalProker());
    }
    
    let proker = await kv.get('proker_items');
    if (!proker) {
      // Initialize KV with default data if empty
      const localProker = getLocalProker();
      await kv.set('proker_items', localProker);
      proker = localProker;
    }
    return NextResponse.json(proker);
  } catch (error) {
    console.error("Error fetching proker from Vercel KV:", error);
    return NextResponse.json(getLocalProker());
  }
}

export async function POST(request) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const item = await request.json();

    if (!kv || !process.env.KV_REST_API_URL) {
      console.warn("Vercel KV is not configured. Saving to local JSON storage.");
      let proker = getLocalProker();
      if (item.id) {
        const index = proker.findIndex(p => p.id === Number(item.id));
        if (index !== -1) {
          proker[index] = { ...proker[index], ...item, id: Number(item.id) };
        } else {
          item.id = Number(item.id);
          proker.push(item);
        }
      } else {
        const nextId = proker.length > 0 ? Math.max(...proker.map(p => p.id || 0)) + 1 : 1;
        proker.push({ ...item, id: nextId });
      }
      saveLocalProker(proker);
      return NextResponse.json({ success: true, data: proker });
    }

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
    // Sync to local file too if possible
    saveLocalProker(proker);
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

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    if (!kv || !process.env.KV_REST_API_URL) {
      console.warn("Vercel KV is not configured. Deleting from local JSON storage.");
      let proker = getLocalProker();
      proker = proker.filter(p => p.id !== id);
      saveLocalProker(proker);
      return NextResponse.json({ success: true, data: proker });
    }

    let proker = await kv.get('proker_items') || defaultProker;
    proker = proker.filter(p => p.id !== id);

    await kv.set('proker_items', proker);
    saveLocalProker(proker);
    return NextResponse.json({ success: true, data: proker });
  } catch (error) {
    console.error("Error deleting proker from Vercel KV:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
