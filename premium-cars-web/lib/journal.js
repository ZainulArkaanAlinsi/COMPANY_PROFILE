// Artikel Journal — dengan ISI, bukan hanya kartu.
//
// Sebelumnya journal berisi empat kartu berjudul bahasa Inggris tanpa badan
// tulisan, dan setiap kartu menaut ke /journal — halaman yang sedang dibuka.
// Diklik, tidak terjadi apa-apa.
//
// Topik dipilih dari pertanyaan yang benar-benar menentukan keputusan
// pembelian di pasar Indonesia, bukan dari kata kunci gaya hidup.

export const journal = [
  {
    slug: "membaca-laporan-ketebalan-cat",
    kicker: "Panduan Pembeli",
    tanggal: "12 Agustus 2026",
    baca: "7 menit",
    judul: "Cara membaca laporan ketebalan cat — dan kapan angka itu berbohong",
    ringkas:
      "Coating thickness gauge adalah alat paling berguna sekaligus paling sering disalahpahami dalam pemeriksaan mobil bekas. Angka tinggi belum tentu buruk; angka normal belum tentu aman.",
    isi: [
      "Cat pabrik pada mobil produksi massal umumnya berada di rentang 90–150 mikron. Angka ini mencakup lapisan dasar, warna, dan bening. Yang penting bukan angka mutlaknya, melainkan konsistensinya: sebuah panel yang terbaca 130 mikron di seluruh permukaannya jauh lebih meyakinkan daripada panel yang berkisar antara 95 dan 240 mikron.",
      "Deviasi tajam pada satu titik hampir selalu berarti dempul. Deviasi merata pada satu panel berarti panel itu dicat ulang seluruhnya — belum tentu masalah, tetapi harus ada penjelasannya. Deviasi merata pada beberapa panel yang bersebelahan, dengan pola yang menyebar dari satu titik, adalah tanda tabrakan.",
      "Ada tiga situasi di mana angka tinggi tidak berarti buruk. Pertama, mobil Eropa tertentu memang keluar pabrik dengan cat lebih tebal, terutama warna metalik berlapis tiga; Porsche dan Mercedes era 90-an sering terbaca di atas 160 mikron dalam kondisi orisinal. Kedua, mobil yang pernah menjalani cat ulang menyeluruh untuk restorasi akan terbaca tinggi dan merata — ini menambah nilai, bukan mengurangi. Ketiga, panel serat karbon atau fiberglass memberi pembacaan yang tidak bisa dibandingkan dengan panel baja sama sekali.",
      "Sebaliknya, ada satu situasi di mana angka normal justru menyesatkan: panel yang diganti dengan panel orisinal baru dari pabrik akan terbaca persis seperti panel asli. Inilah sebabnya pengukuran cat tidak pernah cukup sendirian, dan harus selalu dipasangkan dengan pemeriksaan sealer pabrik di sela panel, pola pengelasan titik, dan geometri rangka.",
      "Yang perlu Anda minta dari penjual bukan kesimpulan 'mobil ini bebas tabrakan', melainkan peta pengukurannya: berapa titik, di panel mana, dan berapa angkanya. Penjual yang punya berkasnya akan memberikannya dalam hitungan menit. Penjual yang tidak punya akan menjawab dengan kata sifat.",
    ],
  },
  {
    slug: "kenapa-harga-jdm-meledak",
    kicker: "Pasar",
    tanggal: "28 Juli 2026",
    baca: "6 menit",
    judul: "Kenapa harga RB26 dan 2JZ meledak — dan apakah masih akan naik",
    ringkas:
      "Skyline R34 yang pada 2010 bisa ditebus di bawah satu miliar kini menyentuh angka lima kali lipat. Kenaikan itu punya sebab struktural, bukan sekadar nostalgia.",
    isi: [
      "Tiga hal terjadi bersamaan. Pertama, aturan impor 25 tahun di Amerika Serikat mulai membuka pintu untuk mobil Jepang era 90-an satu per satu, menciptakan permintaan dari pasar yang sebelumnya tertutup sepenuhnya. R32 lolos pada 2014, R33 pada 2018, R34 pada 2024. Setiap tahun kelolosan menaikkan harga global model bersangkutan.",
      "Kedua, jumlah unit yang layak menyusut cepat. Mesin RB26 dan 2JZ terkenal kuat, dan justru karena itu mayoritas unitnya dimodifikasi berat, dipakai balap, atau ditukar mesinnya. Unit orisinal dengan riwayat lengkap menjadi kategori tersendiri yang tidak lagi bersaing harga dengan unit modifikasi.",
      "Ketiga, generasi yang tumbuh dengan mobil-mobil ini di gim balap dan film kini berada di usia dengan daya beli tertinggi. Ini pola yang berulang di setiap dekade: harga mobil biasanya mencapai puncaknya sekitar 30 tahun setelah produksinya, saat pembeli yang menginginkannya sejak remaja mencapai puncak karier.",
      "Apakah masih akan naik? Untuk unit orisinal berdokumen lengkap, kemungkinan besar ya — pasokannya hanya bisa berkurang. Untuk unit modifikasi tanpa riwayat, tidak selalu; pasar semakin membedakan keduanya, dan selisihnya melebar setiap tahun. Di Indonesia ada faktor tambahan: status dokumen impor lama yang tidak seragam membuat sebagian unit sulit dijual kembali, berapa pun bagus kondisinya.",
      "Saran kami sederhana. Bila membeli untuk dikendarai, kondisi mekanis lebih penting daripada keaslian. Bila membeli sebagai penyimpan nilai, dokumen dan keaslian mengalahkan segalanya — termasuk kilometer rendah.",
    ],
  },
  {
    slug: "diesel-hybrid-listrik-jakarta",
    kicker: "Teknis",
    tanggal: "14 Juli 2026",
    baca: "8 menit",
    judul: "Diesel, hybrid, atau listrik untuk Jakarta — hitungannya, bukan pendapatnya",
    ringkas:
      "Jawabannya berbeda tergantung satu angka yang jarang ditanyakan orang: berapa persen perjalanan Anda terjadi di bawah 20 km/jam.",
    isi: [
      "Mesin diesel modern paling efisien pada beban stabil dan putaran menengah. Itu berarti tol, bukan Sudirman jam enam sore. Pada lalu lintas merayap, filter partikulat diesel tidak mencapai suhu regenerasi dan lama-kelamaan tersumbat — masalah perawatan yang mahal dan sering disalahartikan sebagai kerusakan mesin.",
      "Hybrid bekerja terbalik. Sistem ini paling untung justru pada kecepatan rendah dan berhenti-jalan, karena motor listrik menangani beban ringan sementara mesin bensin mati, dan pengereman regeneratif memanen energi yang pada mobil biasa terbuang jadi panas. Untuk pengguna yang 60 persen perjalanannya di dalam kota, selisih konsumsinya terhadap mesin bensin biasa bisa mencapai 40 persen.",
      "Listrik penuh menang telak pada biaya per kilometer dan pada perawatan — tidak ada oli mesin, tidak ada busi, tidak ada kopling, dan rem jauh lebih awet karena sebagian besar perlambatan ditangani motor. Kendalanya bukan pada mobilnya, melainkan pada tempat parkir Anda. Tanpa pengisian di rumah atau kantor, seluruh keunggulan biayanya hilang tertelan waktu antre di pengisian umum.",
      "Ada satu pertimbangan yang jarang dibahas: nilai jual kembali. Baterai kendaraan listrik generasi awal turun nilainya jauh lebih cepat daripada mesin bakar, karena pembeli kedua membeli sisa umur baterai, bukan mobilnya. Untuk unit di atas lima tahun, minta laporan kesehatan baterai — angkanya tersedia di sistem mobil dan penjual yang serius akan menunjukkannya.",
      "Ringkasnya: mayoritas dalam kota, ambil hybrid. Rutin lintas kota dengan beban berat, diesel masih sulit dikalahkan. Punya pengisian sendiri dan perjalanan harian di bawah 150 km, listrik adalah pilihan dengan biaya kepemilikan terendah — dengan syarat Anda memeriksa kesehatan baterainya, bukan hanya kilometernya.",
    ],
  },
  {
    slug: "matching-numbers",
    kicker: "Kolektor",
    tanggal: "30 Juni 2026",
    baca: "5 menit",
    judul: "Matching numbers: apa artinya, dan kenapa selisihnya bisa miliaran",
    ringkas:
      "Dua unit yang identik secara visual bisa berbeda harga dua kali lipat karena satu hal yang tidak terlihat dari luar.",
    isi: [
      "Matching numbers berarti mesin, transmisi, dan sering kali gardan yang terpasang adalah unit yang sama seperti saat mobil itu keluar dari lini produksi. Pada mobil klasik bernilai tinggi, ini adalah pembeda harga terbesar setelah kondisi — lebih besar daripada warna, kelengkapan, bahkan kilometer.",
      "Alasannya bukan sentimental. Mesin asli adalah satu-satunya bukti fisik yang tidak bisa dipalsukan dengan dokumen bahwa sebuah mobil tidak pernah mengalami peristiwa yang cukup berat untuk memaksa penggantian mesin. Mobil yang mesinnya pernah diganti hampir selalu punya cerita yang tidak tercatat.",
      "Cara memeriksanya berbeda tiap pabrikan. Porsche dan Ferrari menyimpan arsip produksi yang dapat dimintakan sertifikat keaslian, memuat nomor mesin, warna asli, dan opsi yang dipesan pembeli pertama. Pabrikan Jepang umumnya tidak menyediakan layanan setara, sehingga verifikasi bergantung pada plat identitas, cap pada blok mesin, dan catatan servis bengkel resmi.",
      "Yang perlu diwaspadai: penggantian mesin dengan unit sejenis dari donor lain. Secara mekanis mobil itu mungkin sempurna dan bahkan lebih baik, tetapi nilainya berada di kelas berbeda. Penjual yang jujur akan menyebutkannya di awal. Penjual yang tidak menyebutkannya, tetapi menolak menunjukkan nomor mesin, sudah menjawab pertanyaan Anda.",
    ],
  },
  {
    slug: "biaya-sebenarnya-mobil-impor",
    kicker: "Legal",
    tanggal: "16 Juni 2026",
    baca: "6 menit",
    judul: "Biaya sebenarnya sebuah unit impor — yang tidak muncul di harga iklan",
    ringkas:
      "Harga pembelian di negara asal sering kali kurang dari setengah biaya total sampai unit itu sah dikendarai di jalan Indonesia.",
    isi: [
      "Komponen yang selalu muncul: harga unit, biaya pengiriman laut, asuransi pengiriman, bea masuk, PPN, PPnBM untuk kategori tertentu, biaya kepelabuhanan, jasa kepabeanan, dan biaya pengurusan dokumen sampai terbit BPKB. Untuk kendaraan bermesin besar, komponen pajak saja bisa melampaui harga unitnya.",
      "Komponen yang sering terlupa: biaya penyimpanan bila dokumen tertahan, biaya penyesuaian agar memenuhi ketentuan teknis setempat, dan — yang paling mahal — waktu. Sebuah unit yang tertahan tiga bulan di pelabuhan menimbulkan biaya harian yang tidak pernah masuk perhitungan awal siapa pun.",
      "Risiko terbesar bukan pada angkanya, melainkan pada status dokumennya. Unit yang masuk lewat jalur yang tidak sepenuhnya jelas mungkin bisa dikendarai, tetapi akan sangat sulit dijual kembali dan hampir mustahil dibiayai lembaga pembiayaan mana pun. Nilai jual kembalinya bisa turun 40 persen semata-mata karena masalah dokumen, tanpa ada yang salah pada mobilnya.",
      "Karena itu pertanyaan pertama kami pada setiap unit impor bukan 'berapa harganya', melainkan 'boleh lihat dokumen kepabeanannya'. Bila jawabannya berputar, tidak ada angka yang membuat unit itu layak.",
    ],
  },
];

export function getArtikel(slug) {
  return journal.find((a) => a.slug === slug);
}
