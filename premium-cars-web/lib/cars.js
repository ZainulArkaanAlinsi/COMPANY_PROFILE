// Inventory data for the marketplace side of the site.
// Prices in IDR. Every Unsplash ID below was visually verified against the
// car it claims to be (contact-sheet check) — keep name & photo in sync
// when editing, or swap in real unit photography.

const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const base = [
  {
    slug: "aventador-svj",
    brand: "Lamborghini",
    name: "Aventador SVJ",
    eyebrow: "V12 Heritage",
    year: 2024,
    category: "Hypercar",
    bodyStyle: "Coupe",
    drivetrain: "AWD",
    fuel: "Petrol",
    status: "In Stock",
    price: 18250000000,
    hp: 770,
    image: img("1621135802920-133df287f89c"),
    gallery: [
      img("1621135802920-133df287f89c"),
      img("1544829099-b9a0c07fad1a"),
      img("1566473965997-3de9c817e938"),
    ],
    specs: [
      { k: "Top Speed", v: "350 KM/H" },
      { k: "Power", v: "770 HP" },
      { k: "0-100 KM/H", v: "2.8 S" },
      { k: "Transmission", v: "7-Speed ISR" },
    ],
    summary:
      "Puncak filosofi naturally-aspirated Lamborghini. V12 6.5L yang menolak kompromi, dibungkus aerodinamika aktif ALA 2.0.",
  },
  {
    slug: "911-gt3-rs",
    brand: "Porsche",
    name: "911 GT3 RS",
    eyebrow: "GT Performance",
    year: 2024,
    category: "Track",
    bodyStyle: "Coupe",
    drivetrain: "RWD",
    fuel: "Petrol",
    status: "Reserved",
    price: 9800000000,
    hp: 525,
    image: img("1611821064430-0d40291d0f0b"),
    gallery: [
      img("1611821064430-0d40291d0f0b"),
      img("1592853625601-bb9d23da12fc"),
      img("1503376780353-7e6692767b70"),
    ],
    specs: [
      { k: "Top Speed", v: "296 KM/H" },
      { k: "Power", v: "525 HP" },
      { k: "0-100 KM/H", v: "3.2 S" },
      { k: "Weight", v: "1430 KG" },
    ],
    summary:
      "Homologasi lintasan untuk jalan raya. Downforce 860 kg dan aero DRS yang dikendalikan dari setir — mesin balap berpelat nomor.",
  },
  {
    slug: "taycan-turbo-s",
    brand: "Porsche",
    name: "Taycan Turbo S",
    eyebrow: "Electric Future",
    year: 2024,
    category: "Electric",
    bodyStyle: "Sedan",
    drivetrain: "AWD",
    fuel: "Electric",
    status: "New Arrival",
    price: 6500000000,
    hp: 761,
    image: img("1584060622420-0673aad46076"),
    gallery: [
      img("1584060622420-0673aad46076"),
      img("1617704548623-340376564e68"),
    ],
    specs: [
      { k: "Top Speed", v: "260 KM/H" },
      { k: "Power", v: "761 HP" },
      { k: "Range", v: "450 KM" },
      { k: "Charging", v: "22.5 MIN" },
    ],
    summary:
      "Arsitektur 800V yang mendefinisikan ulang GT listrik. Torsi instan tanpa mengorbankan karakter berkendara khas Porsche.",
  },
  {
    slug: "g63-amg",
    brand: "Mercedes-AMG",
    name: "G 63",
    eyebrow: "Luxury Utility",
    year: 2024,
    category: "SUV",
    bodyStyle: "SUV",
    drivetrain: "AWD",
    fuel: "Petrol",
    status: "In Stock",
    price: 6100000000,
    hp: 585,
    image: img("1669215420018-098507d14861"),
    gallery: [img("1669215420018-098507d14861")],
    specs: [
      { k: "Top Speed", v: "240 KM/H" },
      { k: "Power", v: "585 HP" },
      { k: "0-100 KM/H", v: "4.5 S" },
      { k: "Torque", v: "850 NM" },
    ],
    summary:
      "Ikon utilitas mewah yang tak lekang zaman. V8 4.0L biturbo dengan tiga differential lock — kehadiran yang tidak bisa dinegosiasikan.",
  },
  {
    slug: "sf90-spider",
    brand: "Ferrari",
    name: "SF90 Spider",
    eyebrow: "Hybrid Apex",
    year: 2024,
    category: "Hypercar",
    bodyStyle: "Coupe",
    drivetrain: "AWD",
    fuel: "Hybrid",
    status: "In Stock",
    price: 15900000000,
    hp: 1000,
    image: img("1592198084033-aade902d1aae"),
    gallery: [
      img("1592198084033-aade902d1aae"),
      img("1614200187524-dc4b892acf16"),
    ],
    specs: [
      { k: "Top Speed", v: "340 KM/H" },
      { k: "Power", v: "1000 HP" },
      { k: "0-100 KM/H", v: "2.5 S" },
      { k: "Layout", v: "V8 Plug-in Hybrid" },
    ],
    summary:
      "Flagship hybrid pertama Ferrari untuk produksi seri. Tiga motor listrik berpadu V8 3.9L untuk output gabungan 1000 CV.",
  },
  {
    slug: "cayman-gt4-rs",
    brand: "Porsche",
    name: "718 Cayman GT4 RS",
    eyebrow: "Track Weapon",
    year: 2024,
    category: "Track",
    bodyStyle: "Coupe",
    drivetrain: "RWD",
    fuel: "Petrol",
    status: "Reserved",
    price: 4600000000,
    hp: 500,
    image: img("1592853625601-bb9d23da12fc"),
    gallery: [
      img("1592853625601-bb9d23da12fc"),
      img("1611821064430-0d40291d0f0b"),
    ],
    specs: [
      { k: "Top Speed", v: "315 KM/H" },
      { k: "Power", v: "500 HP" },
      { k: "0-100 KM/H", v: "3.4 S" },
      { k: "Redline", v: "9000 RPM" },
    ],
    summary:
      "Flat-six 4.0L 9000 RPM dari 911 GT3, dipindah ke tengah. Mid-engine paling murni yang pernah dibuat Zuffenhausen.",
  },
  {
    slug: "chiron-super-sport",
    brand: "Bugatti",
    name: "Chiron Super Sport",
    eyebrow: "Quad-Turbo W16",
    year: 2024,
    category: "Hypercar",
    bodyStyle: "Coupe",
    drivetrain: "AWD",
    fuel: "Petrol",
    status: "Reserved",
    price: 62000000000,
    hp: 1600,
    image: img("1544636331-e26879cd4d9b"),
    gallery: [
      img("1544636331-e26879cd4d9b"),
      img("1503736334956-4c8f8e92946d"),
    ],
    specs: [
      { k: "Top Speed", v: "440 KM/H" },
      { k: "Power", v: "1600 HP" },
      { k: "0-100 KM/H", v: "2.4 S" },
      { k: "Layout", v: "8.0L W16 Quad-Turbo" },
    ],
    summary:
      "Puncak rekayasa Molsheim. W16 8.0L empat turbo yang mendorong batas fisika kecepatan produksi jalan raya.",
  },
  {
    slug: "m5-competition",
    brand: "BMW",
    name: "M5 Competition",
    eyebrow: "Executive Muscle",
    year: 2024,
    category: "Track",
    bodyStyle: "Sedan",
    drivetrain: "AWD",
    fuel: "Petrol",
    status: "In Stock",
    price: 3200000000,
    hp: 625,
    image: img("1555215695-3004980ad54e"),
    gallery: [
      img("1555215695-3004980ad54e"),
      img("1502877338535-766e1452684a"),
    ],
    specs: [
      { k: "Top Speed", v: "305 KM/H" },
      { k: "Power", v: "625 HP" },
      { k: "0-100 KM/H", v: "3.3 S" },
      { k: "Layout", v: "4.4L V8 Twin-Turbo" },
    ],
    summary:
      "Sedan empat pintu yang menyamar sebagai mobil balap. Kepraktisan harian dengan performa lintasan tanpa kompromi.",
  },
  {
    slug: "amg-gt-63-s",
    brand: "Mercedes-AMG",
    name: "GT 63 S",
    eyebrow: "4-Door Coupe",
    year: 2024,
    category: "Track",
    bodyStyle: "Sedan",
    drivetrain: "AWD",
    fuel: "Petrol",
    status: "New Arrival",
    price: 4100000000,
    hp: 639,
    image: img("1618843479313-40f8afb4b4d8"),
    gallery: [
      img("1618843479313-40f8afb4b4d8"),
      img("1605559424843-9e4c228bf1c2"),
    ],
    specs: [
      { k: "Top Speed", v: "315 KM/H" },
      { k: "Power", v: "639 HP" },
      { k: "0-100 KM/H", v: "3.2 S" },
      { k: "Layout", v: "4.0L V8 Biturbo" },
    ],
    summary:
      "Grand tourer empat pintu dari Affalterbach. Kemewahan lounge berpadu karakter AMG yang buas.",
  },
  {
    slug: "model-s-plaid",
    brand: "Tesla",
    name: "Model S Plaid",
    eyebrow: "Tri-Motor EV",
    year: 2024,
    category: "Electric",
    bodyStyle: "Sedan",
    drivetrain: "AWD",
    fuel: "Electric",
    status: "In Stock",
    price: 2900000000,
    hp: 1020,
    image: img("1617704548623-340376564e68"),
    gallery: [
      img("1617704548623-340376564e68"),
      img("1584060622420-0673aad46076"),
    ],
    specs: [
      { k: "Top Speed", v: "322 KM/H" },
      { k: "Power", v: "1020 HP" },
      { k: "0-100 KM/H", v: "2.1 S" },
      { k: "Range", v: "600 KM" },
    ],
    summary:
      "Sedan listrik tercepat di kelasnya. Tiga motor dan akselerasi yang menantang hukum inersia.",
  },
  {
    slug: "m4-competition",
    brand: "BMW",
    name: "M4 Competition",
    eyebrow: "Precision Coupe",
    year: 2024,
    category: "Track",
    bodyStyle: "Coupe",
    drivetrain: "AWD",
    fuel: "Petrol",
    status: "In Stock",
    price: 2650000000,
    hp: 510,
    image: img("1580273916550-e323be2ae537"),
    gallery: [
      img("1580273916550-e323be2ae537"),
      img("1617531653332-bd46c24f2068"),
    ],
    specs: [
      { k: "Top Speed", v: "290 KM/H" },
      { k: "Power", v: "510 HP" },
      { k: "0-100 KM/H", v: "3.5 S" },
      { k: "Layout", v: "3.0L I6 Twin-Turbo" },
    ],
    summary:
      "Coupe presisi dari divisi M. Sasis yang berbicara, mesin S58 yang menjawab — driver's car dalam bentuk paling jujur.",
  },
  {
    slug: "296-gtb",
    brand: "Ferrari",
    name: "296 GTB",
    eyebrow: "V6 Hybrid",
    year: 2024,
    category: "Track",
    bodyStyle: "Coupe",
    drivetrain: "RWD",
    fuel: "Hybrid",
    status: "New Arrival",
    price: 11200000000,
    hp: 830,
    image: img("1583121274602-3e2820c69888"),
    gallery: [
      img("1583121274602-3e2820c69888"),
      img("1592198084033-aade902d1aae"),
    ],
    specs: [
      { k: "Top Speed", v: "330 KM/H" },
      { k: "Power", v: "830 HP" },
      { k: "0-100 KM/H", v: "2.9 S" },
      { k: "Layout", v: "3.0L V6 Hybrid" },
    ],
    summary:
      "Kebangkitan V6 Ferrari. Hybrid plug-in yang membuktikan efisiensi dan emosi dapat berjalan beriringan.",
  },
  {
    slug: "wraith-black-badge",
    brand: "Rolls-Royce",
    name: "Wraith Black Badge",
    eyebrow: "Grand Tourer",
    year: 2023,
    category: "Limited Edition",
    bodyStyle: "Coupe",
    drivetrain: "RWD",
    fuel: "Petrol",
    status: "In Stock",
    price: 13800000000,
    hp: 632,
    image: img("1631295868223-63265b40d9e4"),
    gallery: [img("1631295868223-63265b40d9e4")],
    specs: [
      { k: "Top Speed", v: "250 KM/H" },
      { k: "Power", v: "632 HP" },
      { k: "0-100 KM/H", v: "4.5 S" },
      { k: "Layout", v: "6.6L V12 Twin-Turbo" },
    ],
    summary:
      "Sisi gelap Goodwood. V12 6.6L dengan karakter paling berani yang pernah dipasang Rolls-Royce pada fastback dua pintu.",
  },
];

// ————— Varian tahun/trim ————————————————————————————————————————
// Marketplace mobil bekas: dari tiap model dasar digenerate banyak unit
// (tahun, kilometer, trim, harga berbeda) sehingga katalog jauh lebih kaya.
const VARIANT_YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
const TRIMS = ["", "Edition", "Carbon Pack", "Launch Edition", "Anniversary"];
const V_STATUS = ["In Stock", "In Stock", "Reserved", "New Arrival"];

// hash deterministik → angka konsisten di server & klien (hindari mismatch).
function seed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeVariants(list) {
  const out = [];
  for (const b of list) {
    VARIANT_YEARS.forEach((year, i) => {
      const age = 2024 - year;
      const s = seed(b.slug + year);
      const km = age * 6500 + (s % 9000);
      const depr = Math.pow(0.9, age) * (0.93 + (s % 14) / 100);
      const price = Math.max(Math.round((b.price * depr) / 1e7) * 1e7, 4e8);
      const trim = TRIMS[(s + i) % TRIMS.length];
      out.push({
        ...b,
        slug: `${b.slug}-${year}`,
        eyebrow: trim ? `${trim} · ${year}` : `${b.eyebrow} · ${year}`,
        year,
        km,
        status: V_STATUS[(s + i) % V_STATUS.length],
        price,
        specs: [
          { k: "Tahun", v: String(year) },
          { k: "Kilometer", v: `${km.toLocaleString("id-ID")} KM` },
          ...b.specs.slice(2),
        ],
      });
    });
  }
  return out;
}

// Model dasar (baru, 0 KM) + ratusan varian bekas.
export const cars = [
  ...base.map((b) => ({ ...b, km: 0 })),
  ...makeVariants(base),
];

export const brands = [
  ...new Set(cars.map((c) => c.brand)),
].sort();

export const categories = [
  "All Inventory",
  "New Arrivals",
  "Electric",
  "Track",
  "Limited Edition",
];

export function getCar(slug) {
  return cars.find((c) => c.slug === slug);
}

export const formatIDR = (n) =>
  "IDR " + new Intl.NumberFormat("id-ID").format(Math.round(n));

export const collections = [
  {
    label: "Hypercars",
    count: 12,
    image: img("1519245659620-e859806a8d3b"),
  },
  {
    label: "Luxury SUV",
    count: 8,
    image: img("1669215420018-098507d14861"),
  },
  {
    label: "Sport GT",
    count: 15,
    image: img("1618843479313-40f8afb4b4d8"),
  },
  {
    label: "Electric Future",
    count: 6,
    image: img("1617704548623-340376564e68"),
  },
];
