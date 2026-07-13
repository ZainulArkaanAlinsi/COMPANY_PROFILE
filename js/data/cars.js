/* ============================================================
   PREMIUM CARS — Data Layer
   Sumber tunggal data unit. Di-embed (bukan fetch) agar jalan
   di file:// tanpa server. Lihat SDD.md §4.

   PENTING: halaman detail di mobil/*.html digenerate dari file ini.
   Setelah mengubah PC.cars, jalankan: npm run build:cars
   ============================================================ */
window.PC = window.PC || {};

/* `noun` = bentuk kata benda untuk dirangkai dalam kalimat (halaman detail). */
PC.categories = [
  { id: "all",      label: "Semua",     icon: "ri-apps-2-line",        noun: "unit" },
  { id: "hypercar", label: "Hypercar",  icon: "ri-flashlight-line",    noun: "hypercar" },
  { id: "sport",    label: "Sport",     icon: "ri-roadster-line",      noun: "mobil sport" },
  { id: "suv",      label: "SUV",       icon: "ri-suv-line",           noun: "SUV" },
  { id: "family",   label: "Keluarga",  icon: "ri-group-line",         noun: "mobil keluarga" },
  { id: "classic",  label: "Klasik",    icon: "ri-vip-crown-2-line",   noun: "mobil klasik" },
];

/* Paragraf karakter per kategori — dipakai halaman detail unit. */
PC.categoryIntro = {
  hypercar: "Hypercar adalah puncak rekayasa otomotif: tenaga ekstrem, material eksotis, dan jumlah produksi yang sangat terbatas. Unit di kelas ini dirawat sebagai aset, bukan sekadar kendaraan.",
  sport: "Mobil sport menekankan keseimbangan — tenaga yang responsif, sasis yang komunikatif, dan bobot yang terkendali. Cukup nyaman untuk harian, cukup tajam untuk akhir pekan.",
  suv: "SUV memadukan ruang kabin, posisi duduk tinggi, dan ketahanan untuk perjalanan jauh maupun rutinitas harian di kota.",
  family: "Kendaraan keluarga mengutamakan kenyamanan penumpang, kelapangan, dan keamanan — tanpa mengorbankan kesan berkelas saat tiba di tujuan.",
  classic: "Unit klasik dinilai dari orisinalitas, riwayat, dan kondisi. Dirawat dengan benar, mobil di kelas ini cenderung mempertahankan bahkan menaikkan nilainya.",
};

/* ------------------------------------------------------------------
   PC.curated — unit kurasi asli. Masing-masing punya foto transparan
   sendiri, halaman detail STATIS (mobil/<id>.html), dan bisa "featured".
   Perluasan katalog (PC.variants di bawah) dibangun dari daftar ini.
   ------------------------------------------------------------------ */
PC.curated = [
  {
    id: "bugatti-chiron-pur-sport", name: "Bugatti Chiron Pur Sport",
    brand: "Bugatti", category: "hypercar", price: 56000000000, year: 2023,
    image: "image/bu-removebg-preview (1).png", badge: "Hypercar", featured: true,
    tagline: "Chiron dalam wujud paling lincah: rasio gigi lebih pendek, downforce lebih besar, bobot ditekan.",
    specs: { topSpeed: 350, power: 1500, seats: 2, transmission: "Automatic" },
  },
  {
    id: "ferrari-sf90", name: "Ferrari SF90 Stradale",
    brand: "Ferrari", category: "sport", price: 12000000000, year: 2022,
    image: "image/fe-removebg-preview.png", badge: "Hybrid", featured: true,
    tagline: "Berlinetta plug-in hybrid pertama Ferrari — tiga motor listrik menemani V8 twin-turbo.",
    specs: { topSpeed: 340, power: 1000, seats: 2, transmission: "Automatic" },
  },
  {
    id: "mclaren-720s", name: "McLaren 720S",
    brand: "McLaren", category: "sport", price: 7500000000, year: 2021,
    image: "image/mc-removebg-preview.png", badge: "Supercar", featured: false,
    tagline: "Monokok karbon dan aerodinamika aktif dalam paket supercar yang tetap ramah dipakai harian.",
    specs: { topSpeed: 341, power: 720, seats: 2, transmission: "Automatic" },
  },
  {
    id: "w-motors-fenyr-supersport", name: "W Motors Fenyr SuperSport",
    brand: "W Motors", category: "hypercar", price: 42000000000, year: 2020,
    image: "image/w-motors-fenyr.png", badge: "Hypercar", featured: true,
    tagline: "Hypercar rancangan Dubai dengan bodi serat karbon dan produksi sangat terbatas.",
    specs: { topSpeed: 400, power: 800, seats: 2, transmission: "Automatic" },
  },
  {
    id: "lamborghini-sesto-elemento", name: "Lamborghini Sesto Elemento",
    brand: "Lamborghini", category: "hypercar", price: 40000000000, year: 2019,
    image: "image/Lamborghini_Sesto_Elemento-removebg-preview.png", badge: "Track", featured: false,
    tagline: "Studi bobot ekstrem — hampir seluruh sasis dan bodinya serat karbon. Khusus sirkuit.",
    specs: { topSpeed: 340, power: 570, seats: 2, transmission: "Automatic" },
  },
  {
    id: "lamborghini-aventador-svj", name: "Lamborghini Aventador SVJ",
    brand: "Lamborghini", category: "hypercar", price: 13500000000, year: 2021,
    image: "image/lamborghini-aventador-svj.png", badge: "Roadster", featured: true,
    tagline: "V12 tanpa turbo dengan aerodinamika aktif ALA — puncak dari lini Aventador.",
    specs: { topSpeed: 350, power: 770, seats: 2, transmission: "Automatic" },
  },
  {
    id: "pagani-huayra", name: "Pagani Huayra",
    brand: "Pagani", category: "hypercar", price: 38000000000, year: 2021,
    image: "image/agani_Huayra-removebg-preview.png", badge: "Hypercar", featured: true,
    tagline: "Karya seni mekanis: V12 twin-turbo rakitan AMG dan flap aerodinamis aktif di empat sudut.",
    specs: { topSpeed: 383, power: 730, seats: 2, transmission: "Automated Manual" },
  },
  {
    id: "koenigsegg-jesko", name: "Koenigsegg Jesko",
    brand: "Koenigsegg", category: "hypercar", price: 48000000000, year: 2022,
    image: "image/koenigsegg-jesko.png", badge: "Hypercar", featured: true,
    tagline: "Megacar Swedia dengan transmisi LST sembilan percepatan dan V8 twin-turbo.",
    specs: { topSpeed: 480, power: 1600, seats: 2, transmission: "Automatic" },
  },
  {
    id: "rolls-royce-phantom", name: "Rolls-Royce Phantom",
    brand: "Rolls-Royce", category: "family", price: 15000000000, year: 2023,
    image: "image/Rolls-Royce_Phantom-removebg-preview.png", badge: "Luxury", featured: false,
    tagline: "Standar emas limosin mewah: kabin senyap, V12 halus, dan kustomisasi nyaris tanpa batas.",
    specs: { topSpeed: 250, power: 563, seats: 5, transmission: "Automatic" },
  },
  {
    id: "ford-mustang-boss-429", name: "Ford Mustang Boss 429",
    brand: "Ford", category: "classic", price: 4800000000, year: 1969,
    image: "image/Ford_Mustang_Boss_429-removebg-preview.png", badge: "Klasik", featured: false,
    tagline: "Muscle car legendaris akhir 1960-an — salah satu Mustang paling diburu kolektor.",
    specs: { topSpeed: 190, power: 375, seats: 4, transmission: "Manual" },
  },
  {
    id: "ford-mustang-ecoboost", name: "Ford Mustang EcoBoost",
    brand: "Ford", category: "sport", price: 1300000000, year: 2022,
    image: "image/Ford_Mustang_EcoBoost_fastback-removebg-preview.png", badge: "Fastback", featured: false,
    tagline: "Fastback modern bermesin turbo empat silinder — pony car yang lebih ramah dipakai setiap hari.",
    specs: { topSpeed: 250, power: 310, seats: 4, transmission: "Automatic" },
  },
  {
    id: "nissan-skyline-r34", name: "Nissan Skyline GT-R R34",
    brand: "Nissan", category: "classic", price: 2000000000, year: 1999,
    image: "image/Nissan_Skyline_-_R34-removebg-preview.png", badge: "JDM", featured: false,
    tagline: "Ikon JDM dengan mesin RB26DETT dan penggerak empat roda ATTESA E-TS.",
    specs: { topSpeed: 265, power: 280, seats: 4, transmission: "Manual" },
  },
  {
    id: "nissan-skyline-r32", name: "Nissan Skyline GT-R R32",
    brand: "Nissan", category: "classic", price: 900000000, year: 1993,
    image: "image/Nissan_Skyline_-_R32-removebg-preview.png", badge: "JDM", featured: false,
    tagline: "\"Godzilla\" yang mendominasi balap turing Jepang dan Australia di awal 1990-an.",
    specs: { topSpeed: 250, power: 276, seats: 4, transmission: "Manual" },
  },
  {
    id: "mazda-rx7", name: "Mazda RX-7",
    brand: "Mazda", category: "classic", price: 1200000000, year: 1999,
    image: "image/mazda_rx_7-removebg-preview.png", badge: "Rotary", featured: false,
    tagline: "Mesin rotary 13B-REW twin-turbo dalam bodi generasi FD yang tetap memesona.",
    specs: { topSpeed: 250, power: 276, seats: 4, transmission: "Manual" },
  },
  {
    id: "subaru-brz", name: "Subaru BRZ",
    brand: "Subaru", category: "sport", price: 800000000, year: 2022,
    image: "image/Subaru_BRZ-removebg-preview.png", badge: "Coupe", featured: false,
    tagline: "Coupe penggerak roda belakang bermesin boxer — ringan, seimbang, dan komunikatif.",
    specs: { topSpeed: 226, power: 228, seats: 4, transmission: "Manual" },
  },
  {
    id: "bmw-m4", name: "BMW M4 Competition",
    brand: "BMW", category: "sport", price: 2400000000, year: 2023,
    image: "image/BMW_M4-removebg-preview.png", badge: "Coupe", featured: false,
    tagline: "Inline-six twin-turbo S58 dengan sasis yang tajam untuk trek maupun jalan raya.",
    specs: { topSpeed: 290, power: 503, seats: 4, transmission: "Automatic" },
  },
  {
    id: "bmw-430i-coupe", name: "BMW 430i Coupé",
    brand: "BMW", category: "sport", price: 1500000000, year: 2023,
    image: "image/bmw-430i-coupe.png", badge: "Coupe", featured: false,
    tagline: "Coupe empat silinder turbo: proporsi elegan dengan kenyamanan harian yang matang.",
    specs: { topSpeed: 250, power: 258, seats: 4, transmission: "Automatic" },
  },
  {
    id: "toyota-alphard", name: "Toyota Alphard",
    brand: "Toyota", category: "family", price: 1500000000, year: 2024,
    image: "image/Toyota_Alphard-removebg-preview.png", badge: "MPV", featured: true,
    tagline: "MPV premium dengan kabin senyap dan kursi kapten berkelas eksekutif.",
    specs: { topSpeed: 180, power: 280, seats: 7, transmission: "Automatic" },
  },
  {
    id: "mitsubishi-pajero-sport", name: "Mitsubishi Pajero Sport",
    brand: "Mitsubishi", category: "suv", price: 650000000, year: 2024,
    image: "image/pajero_sport-removebg-preview.png", badge: "SUV", featured: false,
    tagline: "SUV bersasis ladder-frame — tangguh untuk medan berat maupun perjalanan panjang.",
    specs: { topSpeed: 180, power: 181, seats: 7, transmission: "Automatic" },
  },
  {
    id: "mazda-cx5", name: "Mazda CX-5",
    brand: "Mazda", category: "suv", price: 700000000, year: 2023,
    image: "image/mazda_cx_5-removebg-preview.png", badge: "SUV", featured: false,
    tagline: "SUV keluarga dengan bahasa desain Kodo dan kualitas kabin di atas kelasnya.",
    specs: { topSpeed: 195, power: 194, seats: 5, transmission: "Automatic" },
  },
  {
    id: "chevrolet-traverse", name: "Chevrolet Traverse 2024",
    brand: "Chevrolet", category: "suv", price: 900000000, year: 2024,
    image: "image/chevrolet-traverse.png", badge: "SUV", featured: false,
    tagline: "SUV tiga baris berkabin lapang — dirancang untuk keluarga besar dan bagasi banyak.",
    specs: { topSpeed: 200, power: 310, seats: 7, transmission: "Automatic" },
  },

  /* --- Koleksi tambahan (gambar transparan tersedia) --- */
  {
    id: "bugatti-chiron-super-sport", name: "Bugatti Chiron Super Sport",
    brand: "Bugatti", category: "hypercar", price: 62000000000, year: 2022,
    image: "image/bugaer2-removebg-preview.png", badge: "Hypercar", featured: false,
    tagline: "Chiron yang dioptimalkan untuk kecepatan puncak: bodi memanjang, aliran udara lebih licin.",
    specs: { topSpeed: 440, power: 1600, seats: 2, transmission: "Automatic" },
  },
  {
    id: "bugatti-chiron", name: "Bugatti Chiron",
    brand: "Bugatti", category: "hypercar", price: 58000000000, year: 2021,
    image: "image/bugati_4-removebg-preview.png", badge: "Hypercar", featured: false,
    tagline: "W16 quad-turbo 8.0 liter — penerus Veyron yang mendefinisikan ulang kelas hypercar.",
    specs: { topSpeed: 420, power: 1500, seats: 2, transmission: "Automatic" },
  },
  {
    id: "ferrari-458-speciale", name: "Ferrari 458 Speciale",
    brand: "Ferrari", category: "sport", price: 6800000000, year: 2015,
    image: "image/ferarriq-removebg-preview.png", badge: "Speciale", featured: false,
    tagline: "Salah satu V8 tanpa turbo Ferrari yang paling dipuja, lengkap dengan Side Slip Control.",
    specs: { topSpeed: 325, power: 605, seats: 2, transmission: "Automatic" },
  },
  {
    id: "lamborghini-aventador-svj-63", name: "Lamborghini Aventador SVJ 63",
    brand: "Lamborghini", category: "hypercar", price: 15000000000, year: 2020,
    image: "image/lambo-removebg-preview.png", badge: "SVJ 63", featured: false,
    tagline: "Edisi terbatas 63 unit — angka yang merayakan tahun berdirinya Lamborghini, 1963.",
    specs: { topSpeed: 350, power: 770, seats: 2, transmission: "Automatic" },
  },
  {
    id: "ford-mustang-gt", name: "Ford Mustang GT",
    brand: "Ford", category: "sport", price: 1500000000, year: 2021,
    image: "image/mus-removebg-preview.png", badge: "Muscle", featured: false,
    tagline: "V8 5.0 liter Coyote — resep muscle car klasik dalam kemasan modern.",
    specs: { topSpeed: 250, power: 460, seats: 4, transmission: "Manual" },
  },
  {
    id: "bmw-m8-gran-coupe", name: "BMW M8 Competition Gran Coupé",
    brand: "BMW", category: "sport", price: 3200000000, year: 2023,
    image: "image/bm_a-removebg-preview.png", badge: "Gran Coupé", featured: false,
    tagline: "Empat pintu bertenaga V8 M TwinPower dengan penggerak M xDrive.",
    specs: { topSpeed: 305, power: 625, seats: 4, transmission: "Automatic" },
  },
  {
    id: "bmw-220i-coupe", name: "BMW 220i Coupé",
    brand: "BMW", category: "sport", price: 900000000, year: 2023,
    image: "image/bmwe-removebg-preview.png", badge: "Coupe", featured: false,
    tagline: "Coupe kompak penggerak roda belakang — pintu masuk paling murni ke jajaran BMW.",
    specs: { topSpeed: 235, power: 184, seats: 4, transmission: "Automatic" },
  },
  {
    id: "mitsubishi-pajero-dakar", name: "Mitsubishi Pajero Sport Dakar",
    brand: "Mitsubishi", category: "suv", price: 720000000, year: 2024,
    image: "image/paje-removebg-preview.png", badge: "SUV", featured: false,
    tagline: "Varian Dakar dengan sentuhan lebih sporty, mengambil nama dari reli lintas gurun legendaris.",
    specs: { topSpeed: 180, power: 181, seats: 7, transmission: "Automatic" },
  },
];

/* ------------------------------------------------------------------
   PC.variants — perluasan katalog. Dari tiap model kurasi dibuat sejumlah
   varian tahun & trim yang masuk akal (harga & tenaga divariasikan),
   memakai ulang foto model tsb — persis seperti dealer memajang beberapa
   trim/tahun dengan satu foto pers. Varian TIDAK punya halaman statis;
   mereka dilayani halaman detail dinamis mobil/unit.html?id=<id>.

   Catatan urutan: cars.js dimuat SEBELUM js/lib/format.js, jadi jangan
   pakai PC.format di sini — slug dibuat lokal.
   ------------------------------------------------------------------ */
function pcSlug(s) {
  return String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

PC.variants = (function () {
  // Trim per kategori — label yang wajar untuk kelasnya.
  var TRIMS = {
    hypercar: ["", "Edizione", "Track Pack", "Carbon Series"],
    sport: ["", "Competition", "S Line", "Black Edition"],
    suv: ["", "AWD", "Signature", "Off-Road"],
    family: ["", "Executive", "Luxury Line"],
    classic: ["Restored", "Original", "Matching Numbers"],
  };
  var YEARS_BACK = 4; // jumlah tahun ke belakang per model
  var out = [];

  PC.curated.forEach(function (base) {
    var trims = TRIMS[base.category] || [""];
    var baseName = base.name.replace(/\s+\d{4}$/, ""); // buang tahun di akhir nama (mis. "... 2024")

    for (var dy = 1; dy <= YEARS_BACK; dy++) {
      var year = base.year - dy;
      if (year < 1960) break;

      trims.forEach(function (trim, ti) {
        // Hindari nama konyol bila base sudah memuat trim tsb.
        if (trim && baseName.indexOf(trim) !== -1) return;

        var name = baseName + (trim ? " " + trim : "");
        var id = base.id + "-" + year + (trim ? "-" + pcSlug(trim) : "");

        // Harga: turun ~7%/tahun, naik sesuai tingkat trim. Bulatkan ke 10 juta.
        var price = Math.round(base.price * Math.pow(0.93, dy) * (1 + ti * 0.06) / 1e7) * 1e7;
        if (price < 1e8) price = 1e8; // lantai Rp 100 jt agar tetap wajar

        var power = Math.max(80, base.specs.power + ti * 15 - dy * 5);

        out.push({
          id: id,
          name: name,
          brand: base.brand,
          category: base.category,
          price: price,
          year: year,
          image: base.image,
          badge: trim || base.badge,
          featured: false,
          variant: true,
          baseId: base.id,
          tagline: base.tagline,
          specs: {
            topSpeed: base.specs.topSpeed,
            power: power,
            seats: base.specs.seats,
            transmission: base.specs.transmission,
          },
        });
      });
    }
  });

  return out;
})();

/* Katalog penuh = kurasi + varian. Dipakai grid katalog, keranjang, getCar.
   Halaman statis & "featured" tetap hanya dari PC.curated. */
PC.cars = PC.curated.concat(PC.variants);

/* Helper akses cepat */
PC.getCar = function (id) {
  return PC.cars.find(function (c) { return c.id === id; }) || null;
};
PC.featuredCars = function () {
  return PC.curated.filter(function (c) { return c.featured; });
};

/** Label kategori manusiawi ("hypercar" -> "Hypercar"). */
PC.categoryLabel = function (id) {
  var cat = PC.categories.find(function (c) { return c.id === id; });
  return cat ? cat.label : id;
};

/** Kata benda kategori untuk kalimat ("suv" -> "SUV"). */
PC.categoryNoun = function (id) {
  var cat = PC.categories.find(function (c) { return c.id === id; });
  return cat ? cat.noun : id;
};

/** Daftar merek unik, urut abjad (atas seluruh katalog). */
PC.brands = function () {
  return PC.cars
    .map(function (c) { return c.brand; })
    .filter(function (b, i, arr) { return arr.indexOf(b) === i; })
    .sort();
};

/** Unit serupa — diambil dari unit KURASI saja agar selalu punya halaman
    detail asli (statis) yang bisa ditautkan. */
PC.relatedCars = function (car, limit) {
  limit = limit || 3;
  var baseId = car.baseId || car.id;
  var others = PC.curated.filter(function (c) { return c.id !== car.id && c.id !== baseId; });
  var same = others.filter(function (c) { return c.category === car.category; });
  var rest = others.filter(function (c) { return c.category !== car.category; });
  return same.concat(rest).slice(0, limit);
};

/** URL halaman detail unit, relatif terhadap root situs.
    Unit kurasi → halaman statis (SEO); varian → detail dinamis. */
PC.carUrl = function (car) {
  var obj = typeof car === "string" ? PC.getCar(car) : car;
  if (obj && obj.variant) return "mobil/unit.html?id=" + encodeURIComponent(obj.id);
  var id = obj ? obj.id : car;
  return "mobil/" + id + ".html";
};
