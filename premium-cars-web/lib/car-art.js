/**
 * Ilustrasi studio yang dibuat di sisi kode — bukan foto.
 *
 * 95% katalog tidak punya foto, dan sel itu sebelumnya diisi gradien polos
 * plus nama model berwarna hairline: praktis kosong. Berkas ini menggantinya
 * dengan siluet mobil sesuai bentuk bodi, dipentaskan seperti unit yang
 * disorot lampu di showroom gelap.
 *
 * Semuanya SVG sebaris: nol permintaan jaringan, tidak bisa gagal dimuat,
 * dan tajam di kerapatan piksel berapa pun.
 *
 * Delapan bentuk di bawah menutup 100% katalog:
 *   Coupe 111 · Sedan 52 · SUV 43 · Hatchback 28
 *   Convertible 15 · Wagon 8 · MPV 7 · Pickup 6
 */

// Kanvas 400x300, tanah di y=232.
// Mobil menghadap KIRI: moncong di x kecil, buritan di x besar.
//
// Proporsi tiap tipe diambil dari rasio panjang:tinggi yang membedakannya di
// dunia nyata — coupe ~4:1 (rendah, kap panjang, kabin mundur), SUV ~3:1
// (greenhouse tinggi, atap rata), hatchback pendek tanpa bagasi. Kalau angka
// ini seragam, keempat tipe terbesar tampak kembar di grid katalog.
const GROUND = 232;

/**
 * Tiap entri hanya mendefinisikan garis ATAS bodi: dari sudut bawah-depan,
 * naik melewati kap dan atap, turun ke sudut bawah-belakang.
 *
 * Tepi bawah beserta lengkung spakbornya dihitung di `outline()` dari posisi
 * sumbu roda. Sebelumnya bagian itu ditulis tangan dan radiusnya (40) lebih
 * kecil dari setengah rentang yang diminta (42) — SVG lalu memaksa skala
 * radius naik dan menghasilkan gumpalan di depan dan belakang roda.
 * Menghitungnya membuat kelas kesalahan itu tidak bisa terjadi lagi.
 */
export const SHAPES = {
  // 111 unit — Ferrari, Porsche, Lamborghini. Serendah dan sedramatis mungkin.
  Coupe: {
    axles: [106, 300],
    wheelR: 30,
    sill: 206,
    top:
      "M 18,206 C 17,190 24,180 42,176 L 122,163 C 140,150 164,142 198,140 " +
      "L 246,141 C 288,146 324,158 354,177 L 376,187 C 384,191 386,197 384,206",
    glass: [
      "M 138,161 L 170,145 L 208,143 L 208,161 Z",
      "M 216,143 L 250,145 L 292,163 L 216,163 Z",
    ],
  },
  // Tiga kotak yang tegas: kap, kabin, dan bagasi terbaca terpisah.
  Sedan: {
    axles: [104, 300],
    wheelR: 29,
    sill: 204,
    top:
      "M 20,204 C 19,188 27,178 46,174 L 118,166 C 130,146 150,132 178,128 " +
      "L 252,128 C 276,132 292,146 302,166 L 364,174 C 378,178 382,188 380,204",
    glass: [
      "M 132,164 L 180,134 L 210,133 L 210,164 Z",
      "M 218,133 L 250,134 L 286,164 L 218,164 Z",
    ],
  },
  // Greenhouse tinggi, atap rata, jarak ke tanah besar, buritan tegak.
  SUV: {
    axles: [100, 296],
    wheelR: 33,
    sill: 192,
    top:
      "M 22,192 C 21,166 29,154 48,150 L 112,146 C 118,118 134,102 160,99 " +
      "L 300,99 C 322,102 334,114 338,138 L 348,150 C 354,162 354,178 352,192",
    glass: [
      "M 126,144 L 162,104 L 196,103 L 196,144 Z",
      "M 204,103 L 252,103 L 252,144 L 204,144 Z",
      "M 260,103 L 296,103 L 306,144 L 260,144 Z",
    ],
  },
  // Paling pendek. Tanpa bagasi: pintu belakang curam jatuh tepat di atas roda.
  Hatchback: {
    axles: [112, 274],
    wheelR: 28,
    sill: 202,
    // Buritan harus berakhir sebagai bidang tegak setinggi penuh, dan atasnya
    // wajib DI ATAS puncak lengkung spakbor (sill - radius = 168). Kalau lebih
    // rendah, lengkung itu memotong bumper dan bumpernya tampak terlepas.
    top:
      "M 46,202 C 45,182 53,172 72,168 L 126,160 C 136,140 154,128 180,124 " +
      "L 244,124 C 268,128 288,146 298,164 L 322,168 C 330,173 332,182 330,202",
    glass: [
      "M 140,158 L 182,130 L 208,129 L 208,158 Z",
      "M 216,129 L 244,130 L 276,166 L 216,166 Z",
    ],
  },
  // Tanpa atap: hanya kaca depan pendek, garis pinggang terbuka sampai buritan.
  Convertible: {
    axles: [106, 298],
    wheelR: 30,
    sill: 206,
    // Kokpit terbuka: garis pinggang turun di belakang kaca depan lalu naik
    // sedikit jadi dek belakang — itu yang membedakannya dari coupe beratap.
    top:
      "M 26,204 C 25,188 32,178 50,174 L 132,164 L 156,161 L 182,134 " +
      "L 206,134 L 216,163 L 300,165 C 322,164 340,172 352,186 " +
      "C 358,192 359,199 357,204",
    glass: ["M 164,159 L 186,137 L 202,137 L 210,159 Z"],
  },
  // Atap lurus memanjang sampai ujung buritan, tanpa turun.
  Wagon: {
    axles: [104, 300],
    wheelR: 29,
    sill: 204,
    top:
      "M 20,204 C 19,188 27,178 46,174 L 118,166 C 130,146 150,132 178,128 " +
      "L 320,128 C 342,130 354,138 360,152 L 368,174 C 378,178 382,190 380,204",
    glass: [
      "M 132,164 L 180,134 L 210,133 L 210,164 Z",
      "M 218,133 L 266,133 L 266,164 L 218,164 Z",
      "M 274,133 L 314,133 L 314,164 L 274,164 Z",
    ],
  },
  // Satu kotak: kaca depan landai langsung menyatu jadi atap, kabin jauh maju.
  MPV: {
    axles: [104, 300],
    wheelR: 30,
    sill: 198,
    top:
      "M 24,198 C 23,174 31,162 50,158 L 78,152 C 92,114 116,98 148,95 " +
      "L 292,95 C 322,98 340,112 346,144 L 352,158 C 366,164 370,176 368,198",
    glass: [
      "M 92,150 L 142,102 L 190,101 L 190,150 Z",
      "M 198,101 L 254,101 L 254,150 L 198,150 Z",
      "M 262,101 L 292,102 L 324,150 L 262,150 Z",
    ],
  },
  // Kabin di depan lalu bak terbuka: dinding bak jauh lebih rendah dari atap.
  Pickup: {
    axles: [100, 302],
    wheelR: 32,
    sill: 194,
    top:
      "M 22,194 C 21,172 29,160 48,156 L 104,150 C 112,122 130,106 158,102 " +
      "L 232,102 C 250,108 258,124 260,150 L 260,144 L 356,144 L 356,194",
    glass: [
      "M 122,148 L 162,108 L 196,107 L 196,148 Z",
      "M 204,107 L 230,108 L 246,148 L 204,148 Z",
    ],
  },
};

/**
 * Gabung garis atas dengan tepi bawah + dua lengkung spakbor.
 * Lengkung dibuat sedikit lebih besar dari ban (celah `gap`) supaya ban tidak
 * menyentuh bodi, dan radiusnya PERSIS setengah rentangnya — syarat agar SVG
 * tidak menaikkan skala radius diam-diam.
 */
function outline(shape) {
  const { top, axles, sill } = shape;
  const r = (shape.wheelR || 30) + 6; // radius lengkung = radius ban + celah
  const [front, rear] = axles;
  return (
    `${top} ` +
    `L ${rear + r},${sill} A ${r},${r} 0 0 0 ${rear - r},${sill} ` +
    `L ${front + r},${sill} A ${r},${r} 0 0 0 ${front - r},${sill} Z`
  );
}

// Bentuk bodi di data bisa memakai ejaan lain; petakan ke delapan di atas.
const ALIAS = {
  Sedan: "Sedan",
  Saloon: "Sedan",
  Coupe: "Coupe",
  Coupé: "Coupe",
  Targa: "Coupe",
  Fastback: "Coupe",
  SUV: "SUV",
  Crossover: "SUV",
  Hatchback: "Hatchback",
  Hatch: "Hatchback",
  Convertible: "Convertible",
  Roadster: "Convertible",
  Spider: "Convertible",
  Spyder: "Convertible",
  Cabriolet: "Convertible",
  Wagon: "Wagon",
  Estate: "Wagon",
  Touring: "Wagon",
  MPV: "MPV",
  Minivan: "MPV",
  Van: "MPV",
  Pickup: "Pickup",
  "Pick-up": "Pickup",
  Truck: "Pickup",
};

export function shapeFor(bodyStyle) {
  return SHAPES[ALIAS[String(bodyStyle || "").trim()]] || SHAPES.Coupe;
}

/**
 * Aksen ditentukan dari slug (bukan acak) supaya render server dan klien
 * menghasilkan warna yang sama — kalau tidak, hydration mismatch. Enam warna,
 * semuanya disetel agar duduk berdampingan dengan cognac merek tanpa berkelahi.
 */
const ACCENTS = [
  ["#C58557", "#7E5233"], // cognac — warna merek
  ["#93A0AB", "#566069"], // gunmetal
  ["#B05A40", "#6B3324"], // terracotta
  ["#7F8E70", "#4C5644"], // sage tua
  ["#C0A063", "#786134"], // brass
  ["#7183A0", "#424E62"], // biru baja
];

export function accentFor(seed) {
  let h = 2166136261;
  const s = String(seed || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ACCENTS[Math.abs(h) % ACCENTS.length];
}

const esc = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * SVG lengkap sebagai string.
 *
 * `seed` menentukan warna DAN id di dalam <defs>. Id wajib unik per pemakaian:
 * dua kartu dengan id sama akan memakai gradien yang sama-sama menang terakhir.
 */
export function carArtSvg({
  bodyStyle,
  seed,
  brand = "",
  model = "",
  year = "",
  // "slice" mengisi penuh dan memotong; benar untuk wadah lanskap. Wadah
  // POTRET (mis. kartu koleksi 4:5) harus "meet", kalau tidak mobilnya
  // terpotong habis di kiri dan kanan dan yang tersisa cuma bagian tengah.
  fit = "slice",
}) {
  const shape = shapeFor(bodyStyle);
  const [light, dark] = accentFor(seed);
  const R = shape.wheelR || 30;
  const uid =
    "ca" +
    Math.abs(
      [...String(seed || "x")].reduce((a, c) => (a * 33 + c.charCodeAt(0)) | 0, 7)
    ).toString(36);

  const bodyPath = outline(shape);

  const wheels = shape.axles
    .map(
      (cx) => `
      <circle cx="${cx}" cy="${GROUND - R}" r="${R}" fill="#0A0908"/>
      <circle cx="${cx}" cy="${GROUND - R}" r="${R - 9}" fill="none"
              stroke="${light}" stroke-opacity=".5" stroke-width="2"/>
      <circle cx="${cx}" cy="${GROUND - R}" r="4" fill="${light}" fill-opacity=".75"/>`
    )
    .join("");

  const glass = (shape.glass || [])
    .map(
      (d) =>
        `<path d="${d}" fill="url(#${uid}g)" stroke="${light}" stroke-opacity=".26" stroke-width="1"/>`
    )
    .join("");

  const car = `
    <path d="${bodyPath}" fill="url(#${uid}b)"/>
    <path d="${bodyPath}" fill="none" stroke="${light}" stroke-opacity=".9" stroke-width="1.6"/>
    ${glass}${wheels}`;

  // Ruang kosong di sepertiga atas dipakai sebagai pelat identitas, bukan
  // dibiarkan mati. Ditandai "ilustrasi" supaya tidak dikira foto unitnya.
  const plate = brand
    ? `
  <text x="26" y="46" fill="${light}" fill-opacity=".92"
        font-family="Oswald, Impact, sans-serif" font-size="20"
        letter-spacing="1.6" text-transform="uppercase">${esc(brand).toUpperCase()}</text>
  <text x="26" y="68" fill="#EDE7DE" fill-opacity=".62"
        font-family="Inter, system-ui, sans-serif" font-size="12.5"
        letter-spacing=".4">${esc(model)}</text>
  <line x1="26" y1="80" x2="72" y2="80" stroke="${light}" stroke-opacity=".7" stroke-width="2"/>
  ${year ? `<text x="374" y="46" text-anchor="end" fill="#EDE7DE" fill-opacity=".38"
        font-family="Inter, system-ui, sans-serif" font-size="12" letter-spacing="1.4">${esc(year)}</text>` : ""}
`
    : "";

  // Penanda "ILUSTRASI" TIDAK ditaruh di dalam SVG. Dengan fit "slice", wadah
  // yang lebih lebar dari 4:3 memotong bagian atas dan bawah viewBox — di
  // hero 16:10 penanda pada y=290 hilang, justru di halaman yang paling
  // mungkin disangka foto unit asli. SmartImage menaruhnya sebagai elemen
  // HTML supaya selalu terlihat.

  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"
     preserveAspectRatio="xMidYMid ${fit}" role="img"
     aria-label="Ilustrasi siluet ${esc([brand, model].filter(Boolean).join(" ")) || "mobil"}">
  <defs>
    <radialGradient id="${uid}f" cx="50%" cy="16%" r="80%">
      <stop offset="0%" stop-color="#241F1A"/>
      <stop offset="58%" stop-color="#15120F"/>
      <stop offset="100%" stop-color="#0B0A09"/>
    </radialGradient>
    <linearGradient id="${uid}b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="55%" stop-color="${dark}"/>
      <stop offset="100%" stop-color="#0F0D0B"/>
    </linearGradient>
    <linearGradient id="${uid}g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0908" stop-opacity=".9"/>
      <stop offset="100%" stop-color="${dark}" stop-opacity=".5"/>
    </linearGradient>
    <radialGradient id="${uid}p" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${light}" stop-opacity=".34"/>
      <stop offset="100%" stop-color="${light}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${uid}r" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="${uid}m">
      <rect x="0" y="${GROUND}" width="400" height="60" fill="url(#${uid}r)"/>
    </mask>
  </defs>

  <rect width="400" height="300" fill="url(#${uid}f)"/>
  <g transform="translate(0,-8)">
  <ellipse cx="200" cy="${GROUND + 4}" rx="184" ry="36" fill="url(#${uid}p)"/>
  <line x1="14" y1="${GROUND}" x2="386" y2="${GROUND}"
        stroke="${light}" stroke-opacity=".24" stroke-width="1"/>

  <!-- pantulan di lantai -->
  <g mask="url(#${uid}m)" opacity=".2"
     transform="translate(0,${GROUND * 2}) scale(1,-1)">${car}</g>

  ${car}
  </g>
  ${plate}
</svg>`;
}
