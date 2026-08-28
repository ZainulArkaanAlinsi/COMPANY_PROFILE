// Editorial / company-profile content (journal, brand marquee, milestones, membership).

const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const brandMarquee = [
  "Aston Martin",
  "Ferrari",
  "Lamborghini",
  "Porsche",
  "McLaren",
  "Bentley",
  "Rolls-Royce",
  "Bugatti",
];

export const journal = [
  {
    slug: "internal-combustion-masterpiece",
    kicker: "Engineering",
    date: "24 September 2024",
    title: "The Evolution of the Internal Combustion Masterpiece",
    excerpt:
      "Menelusuri jiwa mekanis powerplant V12 terakhir dan mengapa kemewahan analog tetap tak tergantikan di era digital.",
    image: img("1583121274602-3e2820c69888"),
    featured: true,
  },
  {
    slug: "bespoke-interiors",
    kicker: "Lifestyle",
    date: "18 September 2024",
    title: "Bespoke Interiors: The Art of Craftsmanship",
    excerpt: "Keseimbangan halus antara warisan dan inovasi di dalam kabin.",
    image: img("1503376780353-7e6692767b70"),
  },
  {
    slug: "beyond-electric",
    kicker: "Future",
    date: "10 September 2024",
    title: "Beyond Electric: The Next Decade of Speed",
    excerpt: "Apa yang mendefinisikan hypercar di era elektrifikasi?",
    image: img("1584060622420-0673aad46076"),
  },
  {
    slug: "monaco-grand-prix",
    kicker: "Events",
    date: "02 September 2024",
    title: "Monaco Grand Prix: A Weekend of Pure Excess",
    excerpt: "Pandangan kurasi atas acara paling eksklusif di dunia.",
    image: img("1618843479313-40f8afb4b4d8"),
  },
];

export const milestones = [
  { year: "1998", title: "The Foundation", body: "Premium Cars didirikan di Jakarta sebagai balai lelang privat untuk kolektor terpilih." },
  { year: "2007", title: "Heritage Division", body: "Divisi restorasi kendaraan klasik diluncurkan, menjembatani warisan dan performa modern." },
  { year: "2015", title: "Global Sourcing", body: "Jaringan akuisisi meluas ke Eropa dan Timur Tengah untuk unit langka." },
  { year: "2024", title: "The New Standard", body: "Marketplace digital diluncurkan — kurasi editorial bertemu presisi rekayasa." },
];

// Feed transaksi terkini untuk hub Jual & Tukar (sell_trade design).
// Nama unit dicocokkan dengan foto yang sudah diverifikasi visual.
export const recentTransactions = [
  {
    name: "Ferrari F8 Tributo",
    status: "Sold",
    metric: "Appraised Value",
    value: "Rp 8,2 Miliar",
    time: "3 hari lalu",
    image: img("1592198084033-aade902d1aae"),
  },
  {
    name: "Porsche 911 GT3 Touring",
    status: "Traded",
    metric: "Equity Applied",
    value: "Rp 3,1 Miliar",
    time: "1 minggu lalu",
    image: img("1611821064430-0d40291d0f0b"),
  },
  {
    name: "Porsche Panamera Turbo S",
    status: "Consigned",
    metric: "Target Price",
    value: "Rp 4,2 Miliar",
    time: "Aktif",
    image: img("1503376780353-7e6692767b70"),
  },
];

export const membershipTiers = [
  // Manfaat ditulis sebagai mekanisme yang bisa ditagih — berapa hari, berapa
  // kali, siapa yang mengerjakan. Versi sebelumnya berisi janji kabur seperti
  // "akses awal ke inventaris terbatas", yang tidak bisa dibuktikan dipenuhi
  // maupun dilanggar.
  {
    name: "Associate",
    price: "Rp 25.000.000 / thn",
    ringkas: "Untuk yang membeli satu hingga dua unit dalam setahun.",
    highlight: false,
    perks: [
      "Unit baru diberitahukan 72 jam sebelum tayang di katalog publik",
      "Dua sesi konsultasi teknis per tahun bersama tim inspeksi",
      "Berkas kondisi lengkap untuk unit mana pun, tanpa perlu diminta",
      "Prioritas jadwal test drive pada akhir pekan",
    ],
  },
  {
    name: "Connoisseur",
    price: "Rp 75.000.000 / thn",
    ringkas: "Untuk kolektor aktif yang rutin menambah dan melepas unit.",
    highlight: true,
    perks: [
      "Semua manfaat Associate",
      "Pemberitahuan 14 hari sebelum tayang, dengan hak menahan unit 48 jam",
      "Pencarian unit khusus di jaringan domestik dan lelang internasional",
      "Biaya inspeksi pihak ketiga ditanggung untuk seluruh unit, tanpa batas nilai",
      "Potongan 25 persen biaya konsinyasi saat melepas unit",
      "Laporan pergerakan nilai koleksi Anda setiap kuartal",
    ],
  },
  {
    name: "Collector",
    price: "Atas undangan",
    ringkas: "Untuk koleksi di atas sepuluh unit atau bernilai di atas Rp 50 miliar.",
    highlight: false,
    perks: [
      "Semua manfaat Connoisseur",
      "Satu manajer relasi tetap, bukan tim bergilir",
      "Pencarian global tanpa batas jumlah permintaan",
      "Penyimpanan dan perawatan berkala di fasilitas kami",
      "Penanganan kepabeanan untuk unit impor atas nama Anda",
      "Penilaian ulang koleksi tahunan untuk keperluan asuransi",
    ],
  },
];

// Pertanyaan yang wajar muncul sebelum orang membayar iuran tahunan.
export const membershipFaq = [
  {
    t: "Apakah keanggotaan ini wajib untuk membeli?",
    j: "Tidak. Seluruh katalog terbuka untuk siapa pun, dan berkas kondisi tetap kami berikan kepada pembeli non-anggota sebelum transaksi. Keanggotaan memberi waktu dan prioritas, bukan akses.",
  },
  {
    t: "Apa untungnya dibanding membayar per layanan?",
    j: "Bila Anda membeli satu unit per dua tahun, membayar per layanan lebih masuk akal dan kami akan mengatakannya terus terang. Keanggotaan mulai menguntungkan pada dua transaksi per tahun ke atas, terutama karena potongan biaya konsinyasi dan inspeksi pihak ketiga.",
  },
  {
    t: "Bisa dibatalkan di tengah jalan?",
    j: "Bisa, dengan pengembalian pro rata atas bulan yang belum berjalan, dikurangi layanan yang sudah terpakai. Tidak ada penalti pembatalan.",
  },
];
