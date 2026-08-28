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
  {
    name: "Associate",
    price: "Rp 25.000.000 / thn",
    highlight: false,
    perks: [
      "Akses awal ke inventaris terbatas",
      "Undangan viewing privat",
      "Digest editorial bulanan",
    ],
  },
  {
    name: "Connoisseur",
    price: "Rp 75.000.000 / thn",
    highlight: true,
    perks: [
      "Semua benefit Associate",
      "Concierge akuisisi khusus",
      "Prioritas alokasi unit langka",
      "Akses acara Grand Prix & auction house",
    ],
  },
  {
    name: "Collector",
    price: "By Invitation",
    highlight: false,
    perks: [
      "Semua benefit Connoisseur",
      "Sourcing global tanpa batas",
      "Layanan consignment & appraisal prioritas",
      "Manajer relasi pribadi 24/7",
    ],
  },
];
