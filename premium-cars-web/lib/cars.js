// Katalog marketplace.
//
// Sumber data: lib/catalog-data.js — 211 model NYATA dari 1985 sampai 2024,
// 15 negara, empat jenis penggerak. Spesifikasi teknis diisi angka produksi
// standar; harga adalah estimasi pasar Indonesia untuk tampilan katalog.
//
// Sebelumnya berkas ini berisi 13 mobil yang dikembangbiakkan jadi 299 "unit"
// oleh generator varian. Generator itu menyalin spesifikasi induk ke setiap
// tahun, sehingga menghasilkan hal mustahil seperti Aventador SVJ 2015 (SVJ
// baru ada 2018). Generator dibuang; jumlah unit sekarang mencerminkan model
// yang benar-benar pernah dibuat.

import { catalog } from "./catalog-data";

const img = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Foto Unsplash yang sudah diverifikasi cocok dengan mobilnya (cek contact
// sheet). Hanya model di daftar ini yang menampilkan foto; sisanya memakai
// fallback SmartImage — lebih jujur daripada memasang foto mobil yang salah.
const PHOTOS = {
  "lamborghini-aventador-svj-2019": ["1621135802920-133df287f89c", "1544829099-b9a0c07fad1a", "1566473965997-3de9c817e938"],
  "porsche-911-gt3-rs-992-2023": ["1611821064430-0d40291d0f0b", "1592853625601-bb9d23da12fc", "1503376780353-7e6692767b70"],
  "porsche-taycan-turbo-s-2023": ["1584060622420-0673aad46076", "1617704548623-340376564e68"],
  "mercedes-benz-g-63-amg-2023": ["1669215420018-098507d14861"],
  "ferrari-sf90-stradale-2022": ["1592198084033-aade902d1aae", "1614200187524-dc4b892acf16"],
  "bugatti-chiron-super-sport-2023": ["1544636331-e26879cd4d9b", "1503736334956-4c8f8e92946d"],
  "bmw-m5-competition-f90-2021": ["1555215695-3004980ad54e", "1502877338535-766e1452684a"],
  "tesla-model-s-plaid-2023": ["1617704548623-340376564e68", "1584060622420-0673aad46076"],
  "ferrari-296-gtb-2023": ["1583121274602-3e2820c69888", "1592198084033-aade902d1aae"],
  "porsche-carrera-gt-2005": ["1503376780353-7e6692767b70"],
  "mclaren-720s-2020": ["1580273916550-e323be2ae537", "1617531653332-bd46c24f2068"],
  "rolls-royce-ghost-black-badge-2023": ["1631295868223-63265b40d9e4"],
  "mercedes-benz-sls-amg-2011": ["1618843479313-40f8afb4b4d8", "1605559424843-9e4c228bf1c2"],
};

// Status stok deterministik — hash slug, bukan Math.random(), supaya render
// server dan klien menghasilkan nilai yang sama (menghindari hydration error).
const STATUS = ["In Stock", "In Stock", "In Stock", "Reserved", "New Arrival"];

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const THIS_YEAR = 2025;

export const cars = catalog.map((c) => {
  const h = hash(c.slug);
  const age = Math.max(0, THIS_YEAR - c.year);
  const photos = PHOTOS[c.slug];

  return {
    ...c,
    status: age === 0 ? "New Arrival" : STATUS[h % STATUS.length],
    // Odometer diperkirakan dari umur mobil (rata-rata pemakaian koleksi
    // ~4.500 km/tahun) plus sebaran deterministik. Unit tahun berjalan = 0 km.
    km: age === 0 ? 0 : age * 4500 + (h % 9000),
    image: photos ? img(photos[0]) : "",
    gallery: photos ? photos.map((p) => img(p)) : [],
    hasPhoto: Boolean(photos),
  };
});

const uniq = (key) => [...new Set(cars.map((c) => c[key]))].sort();

export const brands = uniq("brand");
export const origins = uniq("origin");
export const bodyStyles = uniq("bodyStyle");
export const fuels = uniq("fuel");
export const drivetrains = uniq("drivetrain");
export const eras = ["70-an", "80-an", "90-an", "2000-an", "2010-an", "2020-an"];

// `id` tetap bahasa Inggris karena dipakai sebagai nilai ?kategori= di URL dan
// sebagai kunci pencocokan; hanya `label` yang tampil ke pengunjung.
export const categories = [
  { id: "All Inventory", label: "Semua Unit" },
  { id: "New Arrivals", label: "Baru Masuk" },
  { id: "Electric", label: "Mobil Listrik" },
  { id: "Track", label: "Sirkuit" },
  { id: "Limited Edition", label: "Edisi Terbatas" },
];

export function getCar(slug) {
  return cars.find((c) => c.slug === slug);
}

export const formatIDR = (n) =>
  "IDR " + new Intl.NumberFormat("id-ID").format(Math.round(n));

// Koleksi di beranda — jumlahnya dihitung dari data, bukan ditulis tangan,
// supaya tidak pernah berbohong saat katalog bertambah.
const countBy = (fn) => cars.filter(fn).length;

export const collections = [
  {
    label: "Hypercar",
    count: countBy((c) => c.category === "Hypercar"),
    image: img("1519245659620-e859806a8d3b"),
    href: "/katalog?kategori=Hypercar",
  },
  {
    label: "Ikon 80–90an",
    count: countBy((c) => c.year < 2000),
    image: img("1503736334956-4c8f8e92946d"),
    href: "/katalog?era=90-an",
  },
  {
    label: "Listrik",
    count: countBy((c) => c.fuel === "Listrik"),
    image: img("1617704548623-340376564e68"),
    href: "/katalog?bahanBakar=Listrik",
  },
  {
    label: "JDM",
    count: countBy((c) => c.origin === "Jepang"),
    image: img("1618843479313-40f8afb4b4d8"),
    href: "/katalog?asal=Jepang",
  },
];
