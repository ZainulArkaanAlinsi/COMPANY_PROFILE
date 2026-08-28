// ============================================================================
// ISI COMPANY PROFILE
// ============================================================================
// Versi sebelumnya hanya berisi kata sifat: "kurasi", "presisi", "keunggulan".
// Itu tidak memberi calon pembeli satu pun alasan konkret untuk percaya.
//
// Di bisnis kendaraan bekas kelas ini, yang membangun kepercayaan adalah hal
// yang bisa diperiksa: prosedur inspeksi yang bisa disebutkan langkah demi
// langkah, standar yang bisa ditagih, dan jawaban jujur atas pertanyaan yang
// benar-benar ditanyakan orang sebelum mengeluarkan uang miliaran.
// ============================================================================

export const company = {
  nama: "Premium Cars",
  berdiri: 1998,
  kota: "Jakarta",
  kalimatKunci:
    "Kami tidak menjual mobil cepat. Kami menjual kepastian tentang mobil cepat.",
  ringkas:
    "Premium Cars adalah rumah kurasi kendaraan performa tinggi di Jakarta. Sejak 1998 kami menangani akuisisi, konsinyasi, dan pelepasan unit langka untuk kolektor — dengan satu prinsip yang tidak pernah kami tawar: setiap unit yang keluar dari showroom kami sudah kami pahami lebih dalam daripada pemilik sebelumnya.",
};

// ── Cerita: kenapa perusahaan ini ada, ditulis sebagai narasi, bukan slogan ──
export const cerita = [
  {
    kicker: "Asal",
    judul: "Bermula dari satu unit yang salah",
    isi: "Pada 1997 pendiri kami membeli sebuah coupe Jepang impor yang di atas kertas sempurna: kilometer rendah, surat lengkap, harga masuk akal. Delapan bulan kemudian bengkel menemukan sasis depan pernah diluruskan dan nomor rangka telah dipoles ulang. Kerugiannya bukan hanya uang — melainkan keyakinan bahwa dokumen bisa dipercaya. Premium Cars didirikan setahun kemudian dengan asumsi terbalik: dokumen adalah titik awal pemeriksaan, bukan kesimpulannya.",
  },
  {
    kicker: "Prinsip",
    judul: "Kami menolak lebih banyak unit daripada yang kami jual",
    isi: "Dari setiap sepuluh unit yang ditawarkan kepada kami, rata-rata tiga yang kami terima. Penolakan terbanyak bukan karena kondisi mesin, melainkan karena riwayat yang tidak bisa direkonstruksi — periode kepemilikan yang kosong, catatan servis yang loncat, atau nomor rangka yang tidak sinkron dengan dokumen. Mobil bisa diperbaiki; riwayat yang hilang tidak bisa.",
  },
  {
    kicker: "Cara kerja",
    judul: "Harga yang bisa dijelaskan baris per baris",
    isi: "Setiap penawaran kami disertai rincian: nilai dasar model pada kondisi setara, penyesuaian kilometer, penyesuaian kelengkapan dan riwayat, biaya rekondisi yang sudah kami keluarkan, dan margin kami. Pembeli berhak tahu bagian mana dari angka itu yang bisa dinegosiasikan dan bagian mana yang tidak. Kami tidak memakai istilah 'harga khusus hari ini'.",
  },
];

// ── Prosedur inspeksi. Ini bagian paling penting dari seluruh situs: inilah
//    yang dibeli orang sebenarnya. Setiap tahap ditulis konkret — alat apa,
//    diperiksa apa, dan apa yang membuat sebuah unit gugur.
export const inspeksi = [
  {
    no: "01",
    judul: "Verifikasi identitas",
    durasi: "±2 jam",
    isi: "Pencocokan nomor rangka dan nomor mesin terhadap BPKB, STNK, faktur, dan — untuk unit impor — dokumen kepabeanan. Pemeriksaan fisik plat identitas terhadap tanda pengelasan ulang, penggerindaan, atau cat susulan.",
    gugurBila: "Nomor tidak sinkron, atau ada bekas pengerjaan pada plat identitas.",
  },
  {
    no: "02",
    judul: "Pengukuran ketebalan cat",
    durasi: "±3 jam",
    isi: "Pengukuran dengan coating thickness gauge di 60–80 titik pada seluruh panel. Cat pabrik berada di rentang yang konsisten; deviasi tajam pada satu panel menandakan pengecatan ulang, dempul, atau penggantian panel.",
    gugurBila: "Ditemukan dempul struktural pada pilar atau area sasis.",
  },
  {
    no: "03",
    judul: "Geometri sasis",
    durasi: "±4 jam",
    isi: "Pengukuran titik referensi rangka terhadap data pabrik, ditambah pemeriksaan visual pada rail depan, lantai, dan dudukan suspensi untuk mencari lipatan, pengelasan susulan, atau sealer yang tidak asli.",
    gugurBila: "Rangka pernah diluruskan, atau ada pengelasan di luar titik pabrik.",
  },
  {
    no: "04",
    judul: "Mesin dan transmisi",
    durasi: "±5 jam",
    isi: "Uji kompresi dan kebocoran per silinder, analisis oli, pemeriksaan tekanan bahan bakar, dan pembacaan log ECU termasuk kode yang sudah dihapus, jumlah siklus over-rev, dan jam operasi di luar rentang normal.",
    gugurBila: "Riwayat over-rev berat, atau kompresi antar-silinder timpang di luar toleransi pabrik.",
  },
  {
    no: "05",
    judul: "Rekonstruksi riwayat",
    durasi: "1–3 minggu",
    isi: "Penelusuran seluruh periode kepemilikan: catatan servis bengkel resmi, klaim asuransi, riwayat lelang, dan — untuk unit langka — arsip pabrikan mengenai spesifikasi asli saat keluar dari lini produksi.",
    gugurBila: "Ada periode kepemilikan yang tidak bisa dijelaskan sama sekali.",
  },
  {
    no: "06",
    judul: "Uji jalan terukur",
    durasi: "±120 km",
    isi: "Pengujian di jalan kota, tol, dan lintasan tertutup. Yang dicatat bukan kesan, melainkan angka: suhu operasi, tekanan oli pada beban, jarak pengereman berulang, dan getaran pada rentang putaran tertentu.",
    gugurBila: "Ada gejala yang tidak bisa direproduksi dan tidak bisa dijelaskan penyebabnya.",
  },
  {
    no: "07",
    judul: "Berkas kondisi",
    durasi: "±1 hari",
    isi: "Seluruh temuan disusun jadi satu berkas: peta ketebalan cat, hasil uji, foto detail setiap cacat sekecil apa pun, dan estimasi biaya perawatan 24 bulan ke depan. Berkas ini diserahkan ke pembeli sebelum, bukan sesudah, kesepakatan.",
    gugurBila: "—",
  },
];

// ── Standar yang bisa ditagih pembeli ───────────────────────────────────────
export const standar = [
  {
    judul: "Berkas kondisi diserahkan di muka",
    isi: "Seluruh temuan inspeksi — termasuk yang merugikan posisi kami sebagai penjual — diberikan sebelum pembayaran apa pun, termasuk tanda jadi.",
  },
  {
    judul: "Hak inspeksi pihak ketiga",
    isi: "Pembeli boleh membawa unit ke bengkel pilihannya sendiri sebelum transaksi, atas biaya kami untuk unit di atas Rp 2 miliar.",
  },
  {
    judul: "Jaminan keabsahan dokumen",
    isi: "Bila di kemudian hari terbukti ada cacat legal pada dokumen yang tidak kami ungkap, kami membeli kembali unit pada harga transaksi penuh.",
  },
  {
    judul: "Rincian harga terbuka",
    isi: "Setiap penawaran memuat dasar perhitungannya. Kami tidak memakai harga bertekanan waktu.",
  },
  {
    judul: "Tidak ada penggeseran kilometer",
    isi: "Kami menolak seluruh unit yang odometernya menunjukkan tanda intervensi, tanpa kecuali dan tanpa memandang nilainya.",
  },
  {
    judul: "Rekam jejak yang bisa dilacak",
    isi: "Setiap unit yang pernah kami tangani punya nomor berkas permanen yang bisa dirujuk pemilik berikutnya, bahkan bertahun-tahun setelah kami tidak lagi terlibat.",
  },
];

// ── Keahlian: peran nyata, bukan jabatan hiasan ─────────────────────────────
export const keahlian = [
  {
    bidang: "Inspeksi teknis",
    isi: "Teknisi dengan latar belakang bengkel resmi merek Eropa dan Jepang. Menangani pengukuran, pembacaan ECU, dan uji jalan terukur.",
  },
  {
    bidang: "Riwayat & provenance",
    isi: "Penelusuran arsip lelang, catatan pabrikan, dan riwayat kepemilikan lintas negara untuk unit langka.",
  },
  {
    bidang: "Legal & kepabeanan",
    isi: "Verifikasi dokumen, penanganan unit impor, dan pemeriksaan status jaminan fidusia sebelum transaksi.",
  },
  {
    bidang: "Penilaian pasar",
    isi: "Penetapan harga berbasis transaksi pembanding nyata — lelang internasional dan pasar domestik — bukan harga penawaran yang tidak pernah terjadi.",
  },
];

// ── Pertanyaan yang benar-benar ditanyakan, dijawab tanpa berkelit ──────────
export const faq = [
  {
    t: "Apakah harga di katalog bisa ditawar?",
    j: "Sebagian bisa. Setiap penawaran kami memuat rincian komponen harganya, dan kami akan menunjukkan bagian mana yang punya ruang. Yang tidak kami geser adalah biaya rekondisi yang sudah nyata dikeluarkan — menurunkannya berarti kami harus mengurangi pengerjaan, dan itu merugikan Anda sendiri.",
  },
  {
    t: "Kenapa unit tertentu jauh lebih mahal daripada iklan sejenis di tempat lain?",
    j: "Biasanya karena tiga hal: riwayat yang lengkap dan terverifikasi, rekondisi yang sudah selesai dikerjakan, dan status dokumen yang bersih. Unit dengan riwayat kosong memang selalu lebih murah — selisihnya adalah risiko yang berpindah ke pembeli.",
  },
  {
    t: "Boleh membawa mekanik sendiri?",
    j: "Sangat kami anjurkan. Untuk unit di atas Rp 2 miliar, biaya inspeksi pihak ketiga kami tanggung. Kami tidak pernah menolak permintaan ini; penjual yang menolaknya patut Anda curigai.",
  },
  {
    t: "Bagaimana kalau setelah dibeli ternyata ada masalah yang tidak disebut?",
    j: "Bila masalah itu seharusnya terdeteksi dalam prosedur inspeksi kami dan tidak kami ungkap, perbaikannya menjadi tanggungan kami. Bila menyangkut cacat legal pada dokumen, kami membeli kembali unit pada harga transaksi penuh.",
  },
  {
    t: "Berapa lama proses jual atau konsinyasi?",
    j: "Inspeksi 3–5 hari kerja. Rekonstruksi riwayat 1–3 minggu, tergantung ketersediaan arsip. Untuk konsinyasi, rata-rata unit terjual dalam 6–14 minggu; unit dengan riwayat lengkap terjual jauh lebih cepat.",
  },
  {
    t: "Apakah menerima unit yang masih dalam pembiayaan?",
    j: "Ya. Pelunasan ke lembaga pembiayaan kami urus sebagai bagian dari transaksi, dan status jaminan fidusia kami periksa sebelum kesepakatan ditandatangani.",
  },
];

// ── Tonggak: diperluas, dengan konteks, bukan satu baris kosong ─────────────
export const tonggak = [
  {
    tahun: "1998",
    judul: "Balai lelang privat",
    isi: "Dimulai sebagai perantara tertutup untuk sembilan kolektor di Jakarta. Tidak ada showroom; transaksi terjadi di garasi pemilik.",
  },
  {
    tahun: "2003",
    judul: "Prosedur inspeksi pertama",
    isi: "Daftar periksa 40 butir disusun setelah satu transaksi bermasalah. Daftar itu adalah cikal bakal prosedur tujuh tahap yang dipakai sampai sekarang.",
  },
  {
    tahun: "2007",
    judul: "Divisi restorasi",
    isi: "Bengkel sendiri dibuka agar rekondisi tidak lagi bergantung pada pihak luar — dan agar temuan inspeksi bisa langsung dikerjakan, bukan sekadar dilaporkan.",
  },
  {
    tahun: "2012",
    judul: "Arsip berkas permanen",
    isi: "Setiap unit mulai diberi nomor berkas yang bertahan melewati pergantian pemilik. Hari ini arsip itu memuat lebih dari 2.400 unit.",
  },
  {
    tahun: "2015",
    judul: "Sourcing lintas benua",
    isi: "Jaringan akuisisi diperluas ke Eropa, Jepang, dan Timur Tengah, dengan penanganan kepabeanan sendiri.",
  },
  {
    tahun: "2019",
    judul: "Rincian harga terbuka",
    isi: "Kebijakan menampilkan dasar perhitungan harga kepada pembeli mulai diberlakukan untuk seluruh unit, bukan hanya atas permintaan.",
  },
  {
    tahun: "2024",
    judul: "Katalog digital",
    isi: "Seluruh inventaris dan berkas kondisinya dapat ditelusuri daring, dengan data teknis yang sama seperti yang dipegang tim inspeksi.",
  },
];

// ── Angka dengan konteks. Angka telanjang tidak berarti apa-apa. ────────────
export const angka = [
  { n: "27", l: "Tahun beroperasi", k: "Sejak 1998, melewati tiga siklus krisis pasar otomotif." },
  { n: "2.400+", l: "Berkas unit terarsip", k: "Setiap unit yang pernah kami tangani, masih dapat dirujuk." },
  { n: "31%", l: "Unit yang kami terima", k: "Dari seluruh unit yang ditawarkan kepada kami. Sisanya kami tolak." },
  { n: "7", l: "Tahap inspeksi", k: "Rata-rata 19 jam kerja teknisi sebelum sebuah unit boleh ditawarkan." },
];

// ── Rute kontak. Orang menghubungi showroom untuk empat urusan yang sangat
//    berbeda, dan diarahkan ke orang yang salah adalah sumber frustrasi
//    terbesar dalam proses ini.
export const jalurKontak = [
  {
    untuk: "Membeli unit di katalog",
    siapkan: "Nomor unit atau tautan halamannya, dan rentang waktu Anda ingin serah terima.",
    balasan: "Di bawah 4 jam kerja",
    isi: "Kami kirimkan berkas kondisi lengkap unit tersebut sebelum Anda datang — termasuk seluruh temuan yang merugikan posisi kami sebagai penjual.",
  },
  {
    untuk: "Menjual atau konsinyasi",
    siapkan: "Foto keempat sudut, foto odometer, STNK dan BPKB, serta catatan servis bila ada.",
    balasan: "Di bawah 1 hari kerja",
    isi: "Penilaian awal kami berikan berdasarkan berkas Anda, lalu diverifikasi lewat inspeksi fisik. Angka awal dan angka akhir jarang berbeda lebih dari 8 persen bila berkas Anda lengkap.",
  },
  {
    untuk: "Mencari unit tertentu",
    siapkan: "Model, tahun, spesifikasi yang wajib ada, dan batas anggaran.",
    balasan: "Di bawah 2 hari kerja",
    isi: "Kami telusuri jaringan domestik dan lelang internasional. Bila unit yang cocok tidak ada, kami katakan demikian — bukan menawarkan unit yang mendekati.",
  },
  {
    untuk: "Pembiayaan & tukar tambah",
    siapkan: "Unit yang diincar, unit yang akan ditukar, dan perkiraan uang muka.",
    balasan: "Di bawah 1 hari kerja",
    isi: "Kami hitung ekuitas unit lama Anda dan simulasi cicilannya lebih dulu, sebelum ada pembicaraan soal pengajuan ke lembaga pembiayaan.",
  },
];

// ── Apa yang terjadi setelah menghubungi. Ketidakpastian di titik ini adalah
//    alasan paling umum orang berhenti di tengah proses.
export const alurSetelahKontak = [
  { no: "01", judul: "Balasan pertama", isi: "Seorang spesialis — bukan pesan otomatis — membalas dengan pertanyaan spesifik tentang kebutuhan Anda." },
  { no: "02", judul: "Berkas dikirim", isi: "Untuk pembelian: berkas kondisi unit. Untuk penjualan: rentang penilaian awal beserta dasar perhitungannya." },
  { no: "03", judul: "Pertemuan", isi: "Di showroom atau di lokasi Anda. Tidak ada biaya, dan tidak ada kewajiban lanjut." },
  { no: "04", judul: "Keputusan", isi: "Bila Anda melanjutkan, seluruh tahapan dan biayanya kami tuliskan sebelum ada pembayaran apa pun — termasuk tanda jadi." },
];
