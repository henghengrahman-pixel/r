const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

const defaults = {
  'settings.json': {
    siteName: 'OMTOGEL',
    siteTagline: 'Portal Informasi, Aplikasi, dan Update Brand',
    siteDescription: 'Pusat informasi resmi dengan berita bola, jadwal pertandingan, pembaruan aplikasi, dan pencarian cepat.',
    baseUrl: '',
    logoUrl: '/images/logo.svg',
    faviconUrl: '/images/favicon.svg',
    heroTitle: 'OMTOGEL Portal',
    heroSubtitle: 'Cari update, berita bola, prediksi pertandingan, panduan aplikasi, dan informasi brand dalam satu halaman yang rapi.',
    adminPath: '/pinktiger8008',
    loginUrl: '#',
    daftarUrl: '#',
    livechatUrl: '#',
    whatsappUrl: '#',
    apkUrl: '/apk',
    tickerText: 'Update informasi terbaru tersedia setiap hari melalui portal resmi.',
    footerText: '© OMTOGEL. Semua informasi disusun untuk kemudahan pengguna.',
    theme: 'dark'
  },
  'articles.json': [
    {
      id: 'art-001',
      title: 'Panduan Menggunakan Portal OMTOGEL Dengan Lebih Mudah',
      slug: 'panduan-menggunakan-portal-omtogel',
      category: 'Panduan',
      author: 'Redaksi',
      excerpt: 'Ringkasan fitur utama portal, mulai dari pencarian cepat, berita bola, update aplikasi, hingga halaman bantuan.',
      content: '<p>Portal ini dibuat untuk membantu pengguna menemukan informasi brand, update aplikasi, berita bola, dan halaman penting secara cepat.</p><p>Gunakan kolom pencarian untuk menemukan panduan, jadwal, artikel, atau informasi aplikasi yang tersedia.</p>',
      coverUrl: '/images/default-cover.svg',
      publishedAt: '2026-05-24T00:00:00.000Z',
      status: 'published',
      tags: ['omtogel', 'portal', 'panduan']
    },
    {
      id: 'art-002',
      title: 'Update Jadwal Bola dan Prediksi Pertandingan Pilihan',
      slug: 'update-jadwal-bola-dan-prediksi-pertandingan-pilihan',
      category: 'Berita Bola',
      author: 'Redaksi Bola',
      excerpt: 'Pantau jadwal pertandingan, ringkasan performa tim, dan catatan prediksi yang disusun dengan tampilan ringkas.',
      content: '<p>Halaman berita bola menampilkan ringkasan pertandingan pilihan, jadwal penting, dan update informasi sepak bola yang mudah dibaca di perangkat mobile.</p>',
      coverUrl: '/images/default-cover.svg',
      publishedAt: '2026-05-24T00:00:00.000Z',
      status: 'published',
      tags: ['berita bola', 'jadwal bola', 'prediksi']
    }
  ],
  'search.json': [
    { id: 's-001', title: 'OMTOGEL Portal Resmi', url: '/', type: 'Brand', description: 'Halaman utama untuk mencari informasi brand, berita, aplikasi, dan update terbaru.', keywords: ['omtogel', 'portal', 'resmi', 'home'], priority: 10 },
    { id: 's-002', title: 'Download Aplikasi OMTOGEL', url: '/apk', type: 'Aplikasi', description: 'Informasi versi aplikasi, panduan install, dan pembaruan terbaru.', keywords: ['apk', 'android', 'aplikasi', 'download omtogel'], priority: 9 },
    { id: 's-003', title: 'Berita Bola Terbaru', url: '/berita', type: 'Media', description: 'Kumpulan artikel sepak bola, prediksi pertandingan, dan jadwal pilihan.', keywords: ['berita bola', 'prediksi bola', 'jadwal bola'], priority: 8 }
  ],
  'pages.json': [
    { slug: 'omtogel', title: 'OMTOGEL Portal Brand', description: 'Pusat informasi brand, aplikasi, berita bola, dan halaman pencarian cepat.', body: 'OMTOGEL menghadirkan portal ringkas untuk membantu pengguna menemukan informasi utama dalam satu tempat.', keywords: ['omtogel', 'portal omtogel', 'omtogel resmi'] },
    { slug: 'omtogel-apk', title: 'OMTOGEL APK dan Update Aplikasi', description: 'Informasi halaman aplikasi, pembaruan versi, dan panduan penggunaan.', body: 'Halaman APK berisi informasi versi, catatan pembaruan, dan panduan akses aplikasi.', keywords: ['omtogel apk', 'apk omtogel', 'aplikasi omtogel'] },
    { slug: 'omtogel-login', title: 'OMTOGEL Login dan Akses Portal', description: 'Panduan akses halaman portal, bantuan navigasi, dan informasi link resmi.', body: 'Gunakan halaman portal untuk menemukan tombol akses, informasi aplikasi, dan bantuan navigasi.', keywords: ['omtogel login', 'login omtogel', 'akses omtogel'] }
  ],
  'apk.json': {
    version: '1.0.0',
    androidUrl: '#',
    changelog: ['Tampilan portal lebih rapi', 'Pencarian internal lebih cepat', 'Halaman SEO dan sitemap sudah tersedia'],
    updatedAt: '2026-05-24T00:00:00.000Z'
  },
  'trending.json': ['omtogel', 'omtogel apk', 'berita bola', 'prediksi bola', 'jadwal bola', 'portal omtogel'],
  'seo.json': {
    homeTitle: 'OMTOGEL - Portal Informasi Brand, Berita Bola, dan Aplikasi',
    homeDescription: 'OMTOGEL menghadirkan portal informasi brand, berita bola, prediksi pertandingan, pencarian internal, dan pembaruan aplikasi dalam tampilan cepat dan rapi.'
  }
};

function ensureDir() { fs.mkdirSync(DATA_DIR, { recursive: true }); }
function filePath(file) { return path.join(DATA_DIR, file); }
function ensureDataFiles() {
  ensureDir();
  for (const [file, value] of Object.entries(defaults)) {
    const p = filePath(file);
    if (!fs.existsSync(p)) writeJson(file, value);
  }
}
function readJson(file, fallback = null) {
  ensureDir();
  const p = filePath(file);
  if (!fs.existsSync(p)) return fallback !== null ? fallback : defaults[file];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback !== null ? fallback : defaults[file]; }
}
function writeJson(file, data) {
  ensureDir();
  const p = filePath(file);
  const tmp = `${p}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, p);
  return data;
}
module.exports = { DATA_DIR, ensureDataFiles, readJson, writeJson };
