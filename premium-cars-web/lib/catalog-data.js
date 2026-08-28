// ============================================================================
// KATALOG GLOBAL — 1980 s/d sekarang
// ============================================================================
// Satu baris = satu model NYATA. Format pipe, dibaca oleh parse() di bawah.
//
//  merek | model | tahun | kategori | bodi | gerak | bahan bakar | asal |
//  hp | torsi(Nm) | 0-100(s) | top(km/j) | mesin | transmisi | harga(juta IDR) | ringkasan
//
// ATURAN ISI:
//   - Spesifikasi teknis (hp, torsi, akselerasi, mesin) diisi angka NYATA dari
//     model produksi standar. Kalau sebuah angka tidak diketahui pasti, tulis 0
//     dan UI akan menampilkan "—", bukan menebak.
//   - Harga adalah estimasi pasar Indonesia untuk keperluan tampilan katalog,
//     bukan penawaran. Untuk mobil klasik/langka angkanya sangat bergantung
//     kondisi dan kelengkapan surat.
//   - Tahun yang ditulis = tahun model yang speknya dirujuk, bukan rentang
//     produksi penuh.
// ============================================================================

const TABLE = String.raw`
# ─── JERMAN ─────────────────────────────────────────────────────────────────
BMW|M3 E30|1990|Klasik|Coupe|RWD|Bensin|Jerman|215|230|6.7|235|2.3L S14 I4|5MT|1450|Homologasi Grup A yang jadi tolok ukur sedan balap. S14 empat silinder bertenaga tinggi, fender lebar, dan sayap belakang yang kini ikonik.
BMW|M5 E39|2001|Sedan|Sedan|RWD|Bensin|Jerman|400|500|5.3|250|4.9L S62 V8|6MT|850|Sedan eksekutif dengan V8 4.9L bertenaga besar. Banyak yang menyebutnya M5 terbaik yang pernah dibuat.
BMW|M3 E46 CSL|2003|Track|Coupe|RWD|Bensin|Jerman|360|370|4.9|250|3.2L S54 I6|6SMG|2100|Versi ringan E46 dengan atap karbon, intake udara karbon, dan setelan sasis khusus sirkuit. Hanya 1.383 unit.
BMW|335d E90|2009|Sedan|Sedan|RWD|Diesel|Jerman|286|580|6.1|250|3.0L M57 twin-turbo diesel I6|6AT|320|Diesel enam silinder dengan torsi 580 Nm — kombinasi jarang antara konsumsi irit dan akselerasi setara mobil sport.
BMW|1M Coupe|2011|Sports|Coupe|RWD|Bensin|Jerman|340|450|4.9|250|3.0L N54 twin-turbo I6|6MT|1850|Coupe kompak bertenaga besar dengan sasis pendek. Produksi hanya satu tahun, kini jadi buruan kolektor.
BMW|i8|2016|Sports|Coupe|AWD|Hybrid|Jerman|362|570|4.4|250|1.5L turbo I3 + motor listrik|6AT|1650|Sport hybrid dengan bodi serat karbon dan pintu gunting. Tiga silinder di belakang, motor listrik di depan.
BMW|M2 Competition|2019|Sports|Coupe|RWD|Bensin|Jerman|410|550|4.2|280|3.0L S55 twin-turbo I6|6MT|1450|Mesin S55 dari M4 dijejalkan ke bodi terkecil. Salah satu M terakhir yang menawarkan transmisi manual.
BMW|M5 Competition F90|2021|Sedan|Sedan|AWD|Bensin|Jerman|625|750|3.3|305|4.4L S63 twin-turbo V8|8AT|2450|Sedan 625 HP dengan penggerak empat roda yang bisa diubah jadi murni roda belakang.
BMW|iX M60|2023|SUV|SUV|AWD|Listrik|Jerman|619|1015|3.8|250|Dua motor listrik|1-speed|2350|SUV listrik dengan torsi 1.015 Nm dan jangkauan sekitar 560 km.
Mercedes-Benz|190E 2.3-16|1988|Klasik|Sedan|RWD|Bensin|Jerman|185|235|7.5|230|2.3L Cosworth I4|5MT|780|Kepala silinder rancangan Cosworth di bodi W201. Lahir untuk homologasi rally, berakhir sebagai legenda balap turing.
Mercedes-Benz|500E W124|1993|Klasik|Sedan|RWD|Bensin|Jerman|326|480|6.1|250|5.0L M119 V8|4AT|950|Dirakit tangan oleh Porsche. Sedan keluarga dengan V8 5.0L dan fender yang dilebarkan diam-diam.
Mercedes-Benz|300D W123|1985|Klasik|Sedan|RWD|Diesel|Jerman|88|172|17.0|150|3.0L OM617 diesel I5|4AT|210|Diesel lima silinder yang terkenal sanggup menempuh jutaan kilometer. Simbol ketahanan mekanis.
Mercedes-Benz|C63 AMG W204|2011|Sports|Sedan|RWD|Bensin|Jerman|457|600|4.4|250|6.2L M156 V8|7AT|1150|V8 6.2L naturally aspirated terakhir dari AMG sebelum era turbo. Suaranya jadi alasan utama orang membelinya.
Mercedes-Benz|SLS AMG|2011|Supercar|Coupe|RWD|Bensin|Jerman|571|650|3.8|317|6.2L M159 V8|7DCT|5800|Pintu sayap camar modern dengan kap mesin panjang dan V8 6.2L di depan pengemudi.
Mercedes-Benz|G 63 AMG|2023|SUV|SUV|AWD|Bensin|Jerman|585|850|4.5|220|4.0L twin-turbo V8|9AT|6200|Bodi kotak yang nyaris tak berubah sejak 1979, kini dengan V8 585 HP dan tiga kunci diferensial.
Mercedes-Benz|EQS 580|2023|Luxury|Sedan|AWD|Listrik|Jerman|516|855|4.3|210|Dua motor listrik|1-speed|3100|Sedan listrik dengan koefisien hambat 0,20 — terendah di dunia untuk mobil produksi.
Porsche|911 Carrera 3.2 (930)|1987|Klasik|Coupe|RWD|Bensin|Jerman|231|284|6.1|245|3.2L flat-6 air-cooled|5MT|2100|Generasi terakhir 911 berpendingin udara murni sebelum 964. Karakter mesin belakang yang otentik.
Porsche|959|1988|Hypercar|Coupe|AWD|Bensin|Jerman|450|500|3.7|317|2.85L twin-turbo flat-6|6MT|48000|Laboratorium teknologi berjalan: penggerak empat roda aktif, suspensi adaptif, dan turbo bertingkat pada 1986.
Porsche|911 Turbo 993|1997|Klasik|Coupe|AWD|Bensin|Jerman|408|540|4.5|290|3.6L twin-turbo flat-6|6MT|9500|911 berpendingin udara terakhir. Twin-turbo dan penggerak empat roda menjadikannya puncak evolusi generasi itu.
Porsche|Carrera GT|2005|Hypercar|Convertible|RWD|Bensin|Jerman|612|590|3.9|330|5.7L V10|6MT|32000|V10 berakar dari proyek Le Mans, sasis monokok karbon, dan transmisi manual enam percepatan. Terkenal tidak memaafkan kesalahan.
Porsche|Cayenne Turbo|2008|SUV|SUV|AWD|Bensin|Jerman|500|700|5.1|275|4.8L twin-turbo V8|6AT|750|SUV yang menyelamatkan keuangan Porsche dan membuka jalan bagi semua SUV performa yang datang sesudahnya.
Porsche|918 Spyder|2015|Hypercar|Convertible|AWD|Hybrid|Jerman|887|1280|2.6|345|4.6L V10 + 2 motor listrik|7DCT|62000|Salah satu dari trio hypercar hybrid 2013. V10 berbasis balap dipadu dua motor listrik.
Porsche|911 GT3 RS 992|2023|Track|Coupe|RWD|Bensin|Jerman|525|465|3.2|296|4.0L flat-6|7DCT|9800|Aerodinamika aktif berbasis mobil balap dengan sayap belakang DRS. Downforce 860 kg pada 285 km/j.
Porsche|Taycan Turbo S|2023|Luxury|Sedan|AWD|Listrik|Jerman|761|1050|2.8|260|Dua motor listrik|2-speed|3400|Sistem 800 volt dan girboks dua percepatan di poros belakang — akselerasi berulang tanpa penurunan performa.
Audi|Quattro|1985|Klasik|Coupe|AWD|Bensin|Jerman|200|285|7.1|220|2.1L turbo I5|5MT|1750|Mobil yang membuat penggerak empat roda jadi standar di reli. Suara lima silinder yang tak tertukar.
Audi|RS2 Avant|1995|Klasik|Wagon|AWD|Bensin|Jerman|315|410|4.8|262|2.2L turbo I5|6MT|2400|Station wagon hasil kerja sama Audi dan Porsche. Rem, roda, dan spion diambil dari 911.
Audi|RS4 B7|2007|Sports|Sedan|AWD|Bensin|Jerman|420|430|4.8|250|4.2L FSI V8|6MT|780|V8 4.2L yang berputar sampai 8.250 rpm, dipasangkan transmisi manual. Kombinasi yang tidak pernah diulang Audi.
Audi|R8 V10 Plus|2016|Supercar|Coupe|AWD|Bensin|Jerman|610|560|3.2|330|5.2L V10|7DCT|4200|Berbagi basis dengan Huracán tapi dengan karakter yang lebih tenang dan bisa dipakai harian.
Audi|RS6 Avant C8|2023|Sports|Wagon|AWD|Bensin|Jerman|600|800|3.6|305|4.0L twin-turbo V8|8AT|3200|Station wagon 600 HP yang muat keluarga sekaligus mengalahkan banyak mobil sport di lampu merah.
Audi|e-tron GT RS|2023|Luxury|Sedan|AWD|Listrik|Jerman|637|830|3.3|250|Dua motor listrik|2-speed|3000|Berbagi platform dengan Taycan, dengan bahasa desain yang lebih menahan diri.
Volkswagen|Golf GTI Mk2|1989|Klasik|Hatchback|FWD|Bensin|Jerman|139|168|8.1|208|1.8L 16V I4|5MT|280|Generasi yang mematangkan resep hot hatch: ringan, sederhana, dan sangat komunikatif.
Volkswagen|Corrado VR6|1993|Klasik|Coupe|FWD|Bensin|Jerman|190|245|6.4|235|2.9L VR6|5MT|320|Mesin VR6 dengan sudut sempit 15 derajat — enam silinder dalam ruang mesin empat silinder.
Volkswagen|Golf R32 Mk4|2003|Sports|Hatchback|AWD|Bensin|Jerman|241|320|6.6|247|3.2L VR6|6DSG|420|Golf pertama dengan DSG dan penggerak empat roda. Suara VR6 di bodi hatchback kompak.
Volkswagen|Golf GTI Mk8|2023|Hatchback|Hatchback|FWD|Bensin|Jerman|245|370|6.2|250|2.0L TSI I4|7DSG|780|Penerus modern dengan diferensial terkunci elektronik dan sasis yang tetap ramah harian.
Volkswagen|ID.4 Pro|2023|SUV|SUV|RWD|Listrik|Jerman|201|310|8.5|160|Motor listrik tunggal|1-speed|790|SUV listrik terjangkau dengan penggerak roda belakang dan jangkauan sekitar 520 km.
Opel|Astra GSi|1993|Klasik|Hatchback|FWD|Bensin|Jerman|150|196|8.5|215|2.0L 16V I4|5MT|145|Hot hatch Jerman yang sering terlupakan, padahal sasisnya sangat lugas dan harganya masuk akal.
# ─── ITALIA ─────────────────────────────────────────────────────────────────
Ferrari|288 GTO|1985|Hypercar|Coupe|RWD|Bensin|Italia|400|496|4.9|305|2.9L twin-turbo V8|5MT|145000|Dibuat untuk homologasi Grup B yang tak pernah terlaksana. Hanya 272 unit, cikal bakal seluruh garis hypercar Ferrari.
Ferrari|Testarossa|1988|Klasik|Coupe|RWD|Bensin|Italia|390|490|5.2|290|4.9L flat-12|5MT|9500|Sirip samping horizontal yang jadi wajah tahun 80-an. Flat-12 dua belas silinder di tengah.
Ferrari|F40|1990|Hypercar|Coupe|RWD|Bensin|Italia|478|577|4.1|324|2.9L twin-turbo V8|5MT|350000|Ferrari terakhir yang disetujui langsung oleh Enzo Ferrari. Tanpa ABS, tanpa power steering, bodi komposit setipis kertas.
Ferrari|F355 Berlinetta|1997|Klasik|Coupe|RWD|Bensin|Italia|380|363|4.7|295|3.5L V8 5 katup|6MT|6800|Lima katup per silinder dan putaran mesin 8.500 rpm. Banyak dianggap V8 Ferrari terindah secara suara.
Ferrari|F50|1997|Hypercar|Convertible|RWD|Bensin|Italia|520|471|3.9|325|4.7L V12|6MT|420000|V12 turunan langsung dari mesin Formula 1 1990, dibaut sebagai bagian struktural sasis.
Ferrari|Enzo|2004|Hypercar|Coupe|RWD|Bensin|Italia|660|657|3.1|350|6.0L V12|6F1|880000|Hanya 400 unit. Teknologi F1 diterjemahkan ke jalan raya: rem karbon-keramik dan aerodinamika aktif.
Ferrari|F430 Scuderia|2008|Track|Coupe|RWD|Bensin|Italia|510|470|3.6|320|4.3L V8|6F1|4800|Versi ringan F430 dengan bantuan Michael Schumacher dalam pengembangan setelan sasis.
Ferrari|458 Italia|2012|Supercar|Coupe|RWD|Bensin|Italia|570|540|3.4|325|4.5L V8|7DCT|5500|V8 naturally aspirated terakhir Ferrari di kelas mid-engine sebelum era turbo. Redline 9.000 rpm.
Ferrari|LaFerrari|2015|Hypercar|Coupe|RWD|Hybrid|Italia|963|900|2.6|352|6.3L V12 + motor listrik HY-KERS|7DCT|920000|V12 6,3L dipadu motor listrik turunan KERS Formula 1. Total 963 HP tanpa turbo sama sekali.
Ferrari|488 Pista|2019|Track|Coupe|RWD|Bensin|Italia|720|770|2.85|340|3.9L twin-turbo V8|7DCT|9500|Versi sirkuit 488 dengan bobot 90 kg lebih ringan dan aerodinamika turunan mobil balap Challenge.
Ferrari|SF90 Stradale|2022|Hypercar|Coupe|AWD|Hybrid|Italia|986|800|2.5|340|4.0L twin-turbo V8 + 3 motor listrik|8DCT|18500|Ferrari produksi pertama dengan penggerak empat roda listrik di poros depan. Total 986 HP.
Ferrari|296 GTB|2023|Supercar|Coupe|RWD|Hybrid|Italia|830|740|2.9|330|3.0L twin-turbo V6 + motor listrik|8DCT|11500|Kembalinya V6 ke Ferrari jalan raya, dengan sudut bank 120 derajat dan turbo di dalam V.
Lamborghini|Countach LP5000 QV|1988|Klasik|Coupe|RWD|Bensin|Italia|455|500|4.9|295|5.2L V12|5MT|52000|Poster di kamar satu generasi. Sudut tajam, pintu gunting, dan visibilitas belakang yang nyaris nol.
Lamborghini|Diablo SV|1997|Klasik|Coupe|RWD|Bensin|Italia|510|580|3.9|328|5.7L V12|5MT|28000|Diablo dalam wujud paling murni: penggerak roda belakang, tanpa bantuan elektronik, sayap belakang besar.
Lamborghini|Murcielago LP640|2008|Supercar|Coupe|AWD|Bensin|Italia|631|660|3.4|340|6.5L V12|6E-Gear|8500|V12 terakhir Lamborghini yang berakar pada rancangan Bizzarrini dari 1963.
Lamborghini|Gallardo LP560-4|2012|Supercar|Coupe|AWD|Bensin|Italia|552|540|3.7|325|5.2L V10|6E-Gear|4200|Model terlaris Lamborghini sepanjang sejarah dan yang pertama benar-benar bisa dipakai harian.
Lamborghini|Aventador SVJ|2019|Hypercar|Coupe|AWD|Bensin|Italia|770|720|2.8|350|6.5L V12|7ISR|18250|Puncak filosofi naturally aspirated Lamborghini. V12 6,5L dengan aerodinamika aktif ALA 2.0.
Lamborghini|Huracan STO|2022|Track|Coupe|RWD|Bensin|Italia|640|565|3.0|310|5.2L V10|7DCT|9200|Versi jalan raya dari mobil balap Super Trofeo. Kap depan dan fender menyatu jadi satu panel karbon.
Lamborghini|Urus S|2023|SUV|SUV|AWD|Bensin|Italia|666|850|3.5|305|4.0L twin-turbo V8|8AT|7200|SUV yang melipatgandakan volume penjualan Lamborghini dan mengubah profil pembelinya.
Lamborghini|Revuelto|2024|Hypercar|Coupe|AWD|Hybrid|Italia|1015|725|2.5|350|6.5L V12 + 3 motor listrik|8DCT|24000|Penerus Aventador. V12 baru dipadu tiga motor listrik, total 1.015 HP.
Alfa Romeo|155 Q4|1993|Klasik|Sedan|AWD|Bensin|Italia|190|298|7.0|227|2.0L turbo I4|5MT|280|Basis mekanis Lancia Delta Integrale dalam bodi sedan Alfa. Dominan di balap turing awal 90-an.
Alfa Romeo|156 GTA|2003|Klasik|Sedan|FWD|Bensin|Italia|247|300|6.3|250|3.2L Busso V6|6MT|380|Mesin V6 Busso yang sering disebut salah satu mesin paling merdu yang pernah diproduksi massal.
Alfa Romeo|8C Competizione|2009|Supercar|Coupe|RWD|Bensin|Italia|450|470|4.2|292|4.7L V8|6AT|9500|Hanya 500 unit. Bodi serat karbon dengan proporsi yang banyak disebut sebagai desain terbaik dekade itu.
Alfa Romeo|Giulia Quadrifoglio|2023|Sports|Sedan|RWD|Bensin|Italia|510|600|3.9|307|2.9L twin-turbo V6|8AT|1900|V6 dengan akar rancangan Ferrari. Sedan yang mengembalikan Alfa ke percakapan mobil pengemudi.
Maserati|Ghibli II|1994|Klasik|Coupe|RWD|Bensin|Italia|284|365|5.7|270|2.0L twin-turbo V6|6MT|420|Era De Tomaso: coupe kecil dengan tenaga spesifik tertinggi di dunia saat itu per liter.
Maserati|GranTurismo S|2012|GT|Coupe|RWD|Bensin|Italia|440|490|4.9|295|4.7L V8|6AT|1650|Mesin dibuat di pabrik Ferrari Maranello. GT jarak jauh dengan suara knalpot yang khas.
Maserati|MC20|2023|Supercar|Coupe|RWD|Bensin|Italia|630|730|2.9|325|3.0L twin-turbo V6 Nettuno|8DCT|8500|Mesin Nettuno memakai teknologi ruang bakar pra-pembakaran turunan Formula 1.
Pagani|Zonda C12-S|2002|Hypercar|Coupe|RWD|Bensin|Italia|555|750|3.7|335|7.3L Mercedes-AMG V12|6MT|165000|Karya Horacio Pagani dengan obsesi pada detail serat karbon dan empat pipa knalpot di tengah.
Pagani|Huayra BC|2019|Hypercar|Coupe|RWD|Bensin|Italia|791|1100|2.8|383|6.0L twin-turbo Mercedes-AMG V12|7SMT|420000|Aerodinamika aktif dengan empat sirip terpisah yang bergerak sendiri-sendiri sesuai beban.
Lancia|Delta HF Integrale Evo II|1994|Klasik|Hatchback|AWD|Bensin|Italia|215|314|5.7|220|2.0L turbo I4|5MT|1450|Mobil reli tersukses dalam sejarah WRC dengan enam gelar konstruktor beruntun.
De Tomaso|Pantera GT5-S|1990|Klasik|Coupe|RWD|Bensin|Italia|350|450|5.4|260|5.8L Ford V8|5MT|3800|Bodi Italia dengan mesin V8 Ford Cleveland — perpaduan yang membuat perawatannya jauh lebih terjangkau.
# ─── INGGRIS ────────────────────────────────────────────────────────────────
McLaren|F1|1995|Hypercar|Coupe|RWD|Bensin|Inggris|627|651|3.2|386|6.1L BMW S70/2 V12|6MT|3200000|Tiga kursi dengan pengemudi di tengah, ruang mesin berlapis foil emas. Mobil produksi tercepat di dunia selama satu dekade.
McLaren|P1|2015|Hypercar|Coupe|RWD|Hybrid|Inggris|903|900|2.8|350|3.8L twin-turbo V8 + motor listrik|7DCT|780000|Bagian dari trio hypercar hybrid 2013 bersama LaFerrari dan 918 Spyder. Fokusnya paling ke sirkuit.
McLaren|720S|2020|Supercar|Coupe|RWD|Bensin|Inggris|720|770|2.9|341|4.0L twin-turbo V8|7DCT|6200|Monokok karbon Monocage II dengan pilar A tipis yang memberi visibilitas terbaik di kelasnya.
McLaren|Artura|2023|Supercar|Coupe|RWD|Hybrid|Inggris|680|720|3.0|330|3.0L twin-turbo V6 + motor listrik|8DCT|7800|Arsitektur hybrid ringan baru McLaren dengan V6 yang menggantikan V8 lama.
Aston Martin|DB7 Vantage|2001|GT|Coupe|RWD|Bensin|Inggris|420|542|5.0|298|5.9L V12|6MT|1450|V12 pertama Aston Martin modern. Desain Ian Callum yang menyelamatkan merek ini di tahun 90-an.
Aston Martin|Vanquish S|2005|GT|Coupe|RWD|Bensin|Inggris|520|577|4.8|321|5.9L V12|6SMT|2200|Sasis aluminium ikatan lem dan serat karbon, dirakit tangan di Newport Pagnell.
Aston Martin|DB9|2010|GT|Coupe|RWD|Bensin|Inggris|470|600|4.6|306|5.9L V12|6AT|1350|GT jarak jauh dengan proporsi yang bertahan indah lebih dari satu dekade.
Aston Martin|V12 Vantage S|2015|Sports|Coupe|RWD|Bensin|Inggris|573|620|3.9|330|5.9L V12|7SMT|3200|V12 besar dijejalkan ke bodi Vantage terkecil. Kombinasi yang secara teknis tidak seharusnya muat.
Aston Martin|Valkyrie|2023|Hypercar|Coupe|RWD|Hybrid|Inggris|1160|900|2.5|350|6.5L Cosworth V12 + motor listrik|7SMT|3800000|Rancangan Adrian Newey. V12 berputar sampai 11.100 rpm — tertinggi untuk mobil jalan raya.
Jaguar|XJ220|1993|Hypercar|Coupe|RWD|Bensin|Inggris|542|644|3.6|349|3.5L twin-turbo V6|5MT|48000|Sempat jadi mobil produksi tercepat di dunia. Kontroversial karena V12 yang dijanjikan diganti V6.
Jaguar|XKR|2003|GT|Coupe|RWD|Bensin|Inggris|400|553|5.2|250|4.2L supercharged V8|6AT|480|GT bertenaga supercharger dengan karakter mendorong yang lembut namun tak habis-habis.
Jaguar|F-Type R|2020|Sports|Coupe|AWD|Bensin|Inggris|575|700|3.7|300|5.0L supercharged V8|8AT|2400|Salah satu V8 supercharged terakhir yang dijual baru. Terkenal karena letupan knalpotnya.
Jaguar|I-Pace EV400|2022|SUV|SUV|AWD|Listrik|Inggris|400|696|4.8|200|Dua motor listrik|1-speed|1450|SUV listrik pertama dari pabrikan premium Eropa, mendahului rival Jerman beberapa tahun.
Land Rover|Defender 110 Td5|2000|Off-Road|SUV|AWD|Diesel|Inggris|122|300|14.7|132|2.5L Td5 diesel I5|5MT|650|Kerangka tangga dan panel aluminium. Dirancang untuk diperbaiki di tempat, bukan di bengkel resmi.
Land Rover|Range Rover Sport SVR|2019|SUV|SUV|AWD|Bensin|Inggris|575|700|4.5|280|5.0L supercharged V8|8AT|2600|SUV mewah dengan karakter mobil otot Amerika di balik interior kulit Inggris.
Bentley|Continental GT Speed|2022|GT|Coupe|AWD|Bensin|Inggris|659|900|3.6|335|6.0L twin-turbo W12|8DCT|8500|Mesin W12 dengan empat baris silinder — konfigurasi yang hanya dipakai grup Volkswagen.
Bentley|Bentayga EWB|2023|SUV|SUV|AWD|Bensin|Inggris|550|770|4.6|290|4.0L twin-turbo V8|8AT|9500|Sumbu roda diperpanjang dengan kursi belakang yang bisa direbahkan hingga 40 derajat.
Rolls-Royce|Phantom VIII|2023|Luxury|Sedan|RWD|Bensin|Inggris|571|900|5.3|250|6.75L twin-turbo V12|8AT|22000|Suspensi Planar dengan kamera pembaca permukaan jalan. Kabin diklaim sesenyap ruang rekaman.
Rolls-Royce|Ghost Black Badge|2023|Luxury|Sedan|AWD|Bensin|Inggris|592|900|4.5|250|6.75L twin-turbo V12|8AT|15500|Versi lebih tegas dari Ghost, dengan krom yang digelapkan dan respons gas yang dipertajam.
Rolls-Royce|Spectre|2024|Luxury|Coupe|AWD|Listrik|Inggris|584|900|4.5|250|Dua motor listrik|1-speed|18500|Rolls-Royce listrik pertama. Pintu bunuh diri dengan langit-langit berbintang serat optik.
Lotus|Esprit V8|1998|Klasik|Coupe|RWD|Bensin|Inggris|350|400|4.4|282|3.5L twin-turbo V8|5MT|850|Desain baji Giugiaro yang bertahan dua dekade. Bobot hanya 1.380 kg.
Lotus|Elise S2|2005|Sports|Convertible|RWD|Bensin|Inggris|189|181|5.1|241|1.8L Toyota I4|6MT|780|Sasis aluminium ikatan lem seberat 68 kg. Bukti bahwa ringan mengalahkan tenaga.
Lotus|Evija|2024|Hypercar|Coupe|AWD|Listrik|Inggris|2011|1704|2.0|350|Empat motor listrik|1-speed|46000|Salah satu mobil produksi paling bertenaga yang pernah dibuat, dengan terowongan udara menembus bodi belakang.
TVR|Chimaera 500|1996|Klasik|Convertible|RWD|Bensin|Inggris|320|427|4.6|266|5.0L Rover V8|5MT|620|Tanpa ABS, tanpa kontrol traksi, tanpa airbag. Filosofi TVR: pengemudi yang bertanggung jawab.
MG|MGF|1998|Klasik|Convertible|RWD|Bensin|Inggris|145|174|7.6|209|1.8L VVC I4|5MT|175|Roadster mesin tengah terjangkau dengan suspensi Hydragas yang tidak lazim.
Mini|Cooper S R53|2005|Hatchback|Hatchback|FWD|Bensin|Inggris|170|220|7.2|220|1.6L supercharged I4|6MT|280|Generasi supercharged sebelum beralih ke turbo. Suara desing blower yang khas.
# ─── JEPANG ─────────────────────────────────────────────────────────────────
Toyota|AE86 Corolla Levin|1985|Klasik|Coupe|RWD|Bensin|Jepang|130|149|8.4|194|1.6L 4A-GE I4|5MT|420|Penggerak roda belakang ringan yang jadi ikon budaya drift. Bobot hanya 940 kg.
Toyota|MR2 SW20 Turbo|1993|Klasik|Coupe|RWD|Bensin|Jepang|245|304|5.9|250|2.0L 3S-GTE turbo I4|5MT|380|Mesin tengah dengan harga terjangkau. Karakter oversteer generasi awal jadi legenda tersendiri.
Toyota|Supra A80 RZ|1997|Klasik|Coupe|RWD|Bensin|Jepang|280|451|4.6|250|3.0L 2JZ-GTE twin-turbo I6|6MT|2800|Blok besi 2JZ yang sanggup menahan tenaga jauh di atas standar — alasan utama harganya melonjak.
Toyota|Land Cruiser 80 VX|1996|Off-Road|SUV|AWD|Diesel|Jepang|165|380|13.5|165|4.2L 1HD-T turbo diesel I6|4AT|750|Gardan solid depan-belakang dan tiga kunci diferensial. Standar emas kendaraan ekspedisi.
Toyota|Prius NHW20|2006|Sedan|Hatchback|FWD|Hybrid|Jepang|110|142|10.9|170|1.5L I4 + motor listrik|e-CVT|145|Generasi yang membuat hybrid jadi arus utama. Bentuk baji yang seluruhnya ditentukan aerodinamika.
Toyota|Hilux 2.4 G|2023|Pickup|Pickup|AWD|Diesel|Jepang|150|400|12.8|170|2.4L 2GD-FTV turbo diesel I4|6AT|520|Reputasi tak terhancurkan yang dibangun dari medan kerja paling keras di dunia.
Toyota|GR Yaris|2023|Rally|Hatchback|AWD|Bensin|Jepang|261|360|5.5|230|1.6L G16E-GTS turbo I3|6MT|850|Dibuat untuk homologasi WRC. Atap karbon, tiga silinder, dan penggerak empat roda GR-Four.
Toyota|GR Supra A90|2023|Sports|Coupe|RWD|Bensin|Jepang|387|500|4.1|250|3.0L B58 turbo I6|8AT|1950|Hasil kerja sama dengan BMW. Kembalinya nama Supra setelah absen 21 tahun.
Toyota|Alphard 2.5 G|2023|MPV|MPV|FWD|Bensin|Jepang|182|235|10.5|180|2.5L 2AR-FE I4|CVT|1350|MPV mewah yang di Asia Tenggara berfungsi sebagai kendaraan eksekutif dengan kursi kapten.
Toyota|Century|2020|Luxury|Sedan|RWD|Hybrid|Jepang|431|520|6.0|250|5.0L 2UR-FSE V8 + motor listrik|8AT|3800|Sedan negara Jepang. Cat dipoles tangan selama berhari-hari, lambang phoenix diukir manual.
Nissan|Skyline GT-R R32|1993|Klasik|Coupe|AWD|Bensin|Jepang|280|353|4.7|250|2.6L RB26DETT twin-turbo I6|5MT|1650|Dijuluki Godzilla setelah mendominasi balap turing Australia hingga regulasinya diubah.
Nissan|Skyline GT-R R34 V-Spec II|2002|Klasik|Coupe|AWD|Bensin|Jepang|280|392|4.8|250|2.6L RB26DETT twin-turbo I6|6MT|4800|Generasi terakhir RB26 dengan sistem ATTESA E-TS Pro dan layar multifungsi di dasbor.
Nissan|300ZX Twin Turbo Z32|1995|Klasik|Coupe|RWD|Bensin|Jepang|300|384|5.6|250|3.0L VG30DETT twin-turbo V6|5MT|780|Kemewahan teknologi tahun 90-an: kemudi roda belakang Super HICAS dan katup variabel.
Nissan|Silvia S15 Spec-R|2001|Klasik|Coupe|RWD|Bensin|Jepang|250|275|5.5|235|2.0L SR20DET turbo I4|6MT|850|Basis drift paling dicari karena keseimbangan bobot dan ketersediaan suku cadang.
Nissan|GT-R R35 Nismo|2023|Supercar|Coupe|AWD|Bensin|Jepang|600|652|2.7|315|3.8L VR38DETT twin-turbo V6|6DCT|5800|Setiap mesin dirakit tangan oleh satu teknisi Takumi yang namanya dipasang di plakat.
Nissan|Leaf ZE1|2022|Hatchback|Hatchback|FWD|Listrik|Jepang|150|320|7.9|144|Motor listrik tunggal|1-speed|650|Mobil listrik massal terlaris pertama di dunia sebelum gelombang kedua EV datang.
Honda|NSX NA1|1995|Klasik|Coupe|RWD|Bensin|Jepang|280|294|5.7|270|3.0L C30A VTEC V6|5MT|2200|Dikembangkan dengan masukan Ayrton Senna. Supercar pertama yang bisa dikendarai setiap hari.
Honda|Integra Type R DC2|1999|Klasik|Coupe|FWD|Bensin|Jepang|200|186|6.7|235|1.8L B18C VTEC I4|5MT|780|Sering disebut mobil penggerak roda depan terbaik yang pernah dibuat. Sasis dilas tambahan di pabrik.
Honda|S2000 AP1|2003|Klasik|Convertible|RWD|Bensin|Jepang|240|208|6.2|241|2.0L F20C VTEC I4|6MT|980|Redline 9.000 rpm dan tenaga spesifik 120 HP per liter — rekor untuk mesin naturally aspirated produksi.
Honda|Civic Type R FD2|2010|Klasik|Sedan|FWD|Bensin|Jepang|225|215|6.5|235|2.0L K20A VTEC I4|6MT|720|Versi sedan khusus pasar Jepang dengan suspensi belakang multi-link, bukan torsion beam.
Honda|Civic Type R FL5|2023|Hatchback|Hatchback|FWD|Bensin|Jepang|315|420|5.4|275|2.0L K20C1 turbo I4|6MT|1250|Pemegang rekor putaran Nurburgring untuk penggerak roda depan pada masanya.
Honda|Jazz RS|2018|Hatchback|Hatchback|FWD|Bensin|Jepang|120|145|10.8|180|1.5L L15Z I4|CVT|230|Kursi ajaib yang bisa dilipat vertikal berkat tangki bensin di tengah bodi.
Mazda|RX-7 FD3S|1999|Klasik|Coupe|RWD|Bensin|Jepang|280|314|5.3|250|1.3L 13B-REW rotary twin-turbo|5MT|1450|Mesin rotary dengan turbo berurutan. Distribusi bobot nyaris 50:50 dan bodi seberat 1.270 kg.
Mazda|MX-5 NA|1994|Klasik|Convertible|RWD|Bensin|Jepang|130|152|8.6|196|1.8L BP I4|5MT|420|Roadster terlaris sepanjang sejarah. Lampu pop-up dan bobot di bawah satu ton.
Mazda|MX-5 ND|2023|Sports|Convertible|RWD|Bensin|Jepang|181|205|6.5|219|2.0L Skyactiv-G I4|6MT|780|Kembali ke akar: generasi ini justru lebih ringan dari pendahulunya.
Mazda|RX-8|2008|Klasik|Coupe|RWD|Bensin|Jepang|231|211|6.4|235|1.3L 13B-MSP rotary|6MT|320|Empat pintu bunuh diri dengan mesin rotary naturally aspirated berputar hingga 9.000 rpm.
Subaru|Impreza WRX STI GC8|1998|Rally|Sedan|AWD|Bensin|Jepang|280|363|4.9|250|2.0L EJ20 turbo flat-4|5MT|850|Versi jalan raya dari mobil reli Colin McRae. Suara knalpot flat-4 yang tak tertukar.
Subaru|Impreza WRX STI GDB|2005|Rally|Sedan|AWD|Bensin|Jepang|280|392|4.8|250|2.0L EJ20 turbo flat-4|6MT|680|Generasi lampu bulat yang jadi favorit kolektor karena diferensial tengah yang bisa diatur.
Subaru|WRX STI VA|2019|Rally|Sedan|AWD|Bensin|Jepang|300|407|5.2|255|2.5L EJ257 turbo flat-4|6MT|950|EJ terakhir sebelum Subaru menghentikan garis STI. Rem Brembo enam piston standar.
Subaru|BRZ ZD8|2023|Sports|Coupe|RWD|Bensin|Jepang|228|250|6.3|226|2.4L FA24 flat-4|6MT|780|Hasil kerja sama dengan Toyota. Titik berat terendah di antara mobil produksi mana pun.
Mitsubishi|Lancer Evolution VI TME|2000|Rally|Sedan|AWD|Bensin|Jepang|280|373|4.4|250|2.0L 4G63T turbo I4|5MT|1650|Edisi Tommi Makinen dengan turbo titanium dan suspensi yang diturunkan. Hanya 2.500 unit.
Mitsubishi|Lancer Evolution IX MR|2006|Rally|Sedan|AWD|Bensin|Jepang|291|407|4.5|250|2.0L 4G63T turbo I4|6MT|1250|4G63 terakhir sebelum berganti ke 4B11. Diferensial aktif AYC di poros belakang.
Mitsubishi|Lancer Evolution X Final|2015|Rally|Sedan|AWD|Bensin|Jepang|303|414|4.4|250|2.0L 4B11T turbo I4|6MT|1150|Edisi penutup 11 generasi Evo. Penanda berakhirnya era sedan reli homologasi.
Mitsubishi|3000GT VR-4|1996|Klasik|Coupe|AWD|Bensin|Jepang|286|427|5.4|250|3.0L 6G72 twin-turbo V6|6MT|580|Aerodinamika aktif, kemudi empat roda, dan knalpot variabel — teknologi berlebihan khas 90-an.
Mitsubishi|Pajero Exceed|2005|Off-Road|SUV|AWD|Diesel|Jepang|165|373|12.5|170|3.2L 4M41 turbo diesel I4|5AT|420|Juara Dakar berulang kali. Sasis monokok dengan suspensi independen di keempat roda.
Mitsubishi|Xpander Ultimate|2023|MPV|MPV|FWD|Bensin|Jepang|105|141|13.5|170|1.5L 4A91 I4|4AT|280|MPV yang mengubah peta pasar keluarga Indonesia dengan jarak bebas tanah tinggi.
Lexus|LS400|1995|Luxury|Sedan|RWD|Bensin|Jepang|260|353|7.5|250|4.0L 1UZ-FE V8|4AT|280|Mobil yang memaksa Mercedes dan BMW merevisi standar keheningan kabin mereka.
Lexus|IS-F|2010|Sports|Sedan|RWD|Bensin|Jepang|417|505|4.8|270|5.0L 2UR-GSE V8|8AT|780|Sedan V8 dengan knalpot bertumpuk yang dikembangkan bersama tim balap Yamaha.
Lexus|LFA|2012|Hypercar|Coupe|RWD|Bensin|Jepang|560|480|3.7|325|4.8L 1LR-GUE V10|6SMT|68000|V10 rancangan Yamaha yang berpindah dari 0 ke 9.000 rpm dalam 0,6 detik — jarum analog tak sanggup mengikutinya.
Lexus|LC500|2023|GT|Coupe|RWD|Bensin|Jepang|477|540|4.4|270|5.0L 2UR-GSE V8|10AT|3200|Salah satu V8 naturally aspirated terakhir di kelas GT, dengan desain nyaris identik dengan konsepnya.
Suzuki|Jimny JB74|2023|Off-Road|SUV|AWD|Bensin|Jepang|102|130|14.0|145|1.5L K15B I4|4AT|420|Kerangka tangga dan gardan solid dalam dimensi terkecil di dunia. Kemampuan medan berat di bodi mini.
Suzuki|Swift Sport ZC33S|2022|Hatchback|Hatchback|FWD|Bensin|Jepang|140|230|8.1|210|1.4L K14C Boosterjet turbo I4|6MT|380|Bobot hanya 970 kg. Hot hatch yang menang lewat keringanan, bukan tenaga.
Daihatsu|Copen|2015|Sports|Convertible|FWD|Bensin|Jepang|64|92|11.7|150|0.66L KF-VET turbo I3|CVT|280|Kei car atap keras lipat dengan panel bodi yang bisa diganti sendiri oleh pemiliknya.
Isuzu|D-Max V-Cross|2023|Pickup|Pickup|AWD|Diesel|Jepang|190|450|10.5|180|3.0L 4JJ3-TCX turbo diesel I4|6AT|620|Mesin diesel yang di banyak pasar dipakai juga oleh truk ringan — reputasi tahan beban berat.
# ─── AMERIKA SERIKAT ────────────────────────────────────────────────────────
Chevrolet|Corvette C4 ZR-1|1993|Klasik|Coupe|RWD|Bensin|Amerika Serikat|405|522|4.4|291|5.7L LT5 V8|6MT|1450|Mesin LT5 dengan kepala silinder DOHC rancangan Lotus, dirakit oleh Mercury Marine.
Chevrolet|Corvette C5 Z06|2003|Klasik|Coupe|RWD|Bensin|Amerika Serikat|405|542|4.0|275|5.7L LS6 V8|6MT|980|Transaxle di poros belakang memberi distribusi bobot yang jauh lebih seimbang dari pendahulunya.
Chevrolet|Corvette C6 ZR1|2011|Supercar|Coupe|RWD|Bensin|Amerika Serikat|638|819|3.4|330|6.2L LS9 supercharged V8|6MT|2400|Jendela polikarbonat di kap mesin memperlihatkan penutup supercharger. Rem karbon-keramik standar.
Chevrolet|Corvette C8 Z06|2024|Supercar|Coupe|RWD|Bensin|Amerika Serikat|670|623|2.6|312|5.5L LT6 flat-plane V8|8DCT|4200|Corvette mesin tengah pertama dengan V8 flat-plane crank berputar hingga 8.600 rpm.
Chevrolet|Camaro SS 1LE|2020|Sports|Coupe|RWD|Bensin|Amerika Serikat|455|617|4.0|280|6.2L LT1 V8|6MT|1350|Paket 1LE menambah pendingin oli, rem Brembo, dan setelan sasis khusus sirkuit.
Ford|Mustang GT Fox Body|1990|Klasik|Coupe|RWD|Bensin|Amerika Serikat|225|407|6.2|220|5.0L Windsor V8|5MT|420|Bodi ringan dengan V8 pushrod. Basis modifikasi paling terjangkau di Amerika selama puluhan tahun.
Ford|Mustang Cobra R|2000|Klasik|Coupe|RWD|Bensin|Amerika Serikat|385|522|4.8|274|5.4L Modular V8|6MT|1650|Hanya 300 unit, tanpa AC dan tanpa radio. Pembeli wajib menunjukkan lisensi balap.
Ford|GT|2006|Supercar|Coupe|RWD|Bensin|Amerika Serikat|550|678|3.8|330|5.4L supercharged V8|6MT|12500|Penghormatan untuk GT40 yang mengalahkan Ferrari di Le Mans empat kali berturut-turut.
Ford|Mustang Shelby GT500|2022|Sports|Coupe|RWD|Bensin|Amerika Serikat|760|847|3.3|290|5.2L Predator supercharged V8|7DCT|2800|Mustang produksi paling bertenaga sepanjang sejarah dengan supercharger 2,65 liter.
Ford|F-150 Lightning|2023|Pickup|Pickup|AWD|Listrik|Amerika Serikat|580|1051|4.0|177|Dua motor listrik|1-speed|1450|Pikap listrik yang bisa menyalurkan listrik balik ke rumah selama pemadaman.
Ford|Bronco Wildtrak|2023|Off-Road|SUV|AWD|Bensin|Amerika Serikat|335|563|5.9|180|2.7L EcoBoost twin-turbo V6|10AT|1550|Atap dan pintu bisa dilepas tanpa alat. Kembalinya nama yang absen sejak 1996.
Dodge|Viper GTS|1998|Supercar|Coupe|RWD|Bensin|Amerika Serikat|450|664|4.0|301|8.0L V10|6MT|2400|V10 delapan liter tanpa kontrol traksi maupun ABS pada versi awal. Knalpot samping yang membakar betis.
Dodge|Challenger SRT Hellcat|2021|Sports|Coupe|RWD|Bensin|Amerika Serikat|717|881|3.6|327|6.2L HEMI supercharged V8|8AT|1850|Dijual dengan dua kunci: hitam membatasi 500 HP, merah membuka seluruh 717 HP.
Dodge|Charger SRT Hellcat Redeye|2022|Sedan|Sedan|RWD|Bensin|Amerika Serikat|797|959|3.6|327|6.2L HEMI supercharged V8|8AT|2200|Sedan empat pintu produksi paling bertenaga yang pernah dijual.
Jeep|Wrangler Rubicon JL|2023|Off-Road|SUV|AWD|Bensin|Amerika Serikat|272|400|6.9|160|2.0L turbo I4|8AT|1450|Gardan solid Dana 44, kunci diferensial depan-belakang, dan stabilizer depan yang bisa dilepas elektrik.
Jeep|Grand Cherokee Trackhawk|2020|SUV|SUV|AWD|Bensin|Amerika Serikat|707|875|3.5|290|6.2L HEMI supercharged V8|8AT|2400|SUV dengan mesin Hellcat. Sempat jadi SUV produksi tercepat di dunia.
Tesla|Roadster|2010|Sports|Convertible|RWD|Listrik|Amerika Serikat|288|400|3.9|201|Motor listrik tunggal|1-speed|1850|Berbasis sasis Lotus Elise. Mobil produksi pertama dengan baterai lithium-ion dan jangkauan di atas 320 km.
Tesla|Model S P100D|2018|Luxury|Sedan|AWD|Listrik|Amerika Serikat|762|1250|2.5|250|Dua motor listrik|1-speed|1650|Mode Ludicrous yang mengubah persepsi publik tentang performa mobil listrik.
Tesla|Model S Plaid|2023|Luxury|Sedan|AWD|Listrik|Amerika Serikat|1020|1420|2.1|322|Tiga motor listrik|1-speed|2800|Tiga motor dengan rotor berbalut serat karbon. Sempat jadi mobil produksi berakselerasi tercepat.
Tesla|Model 3 Long Range|2023|Sedan|Sedan|AWD|Listrik|Amerika Serikat|498|559|4.4|233|Dua motor listrik|1-speed|1150|Model yang membawa Tesla ke produksi massal dan memicu gelombang EV global.
Tesla|Model Y Performance|2023|SUV|SUV|AWD|Listrik|Amerika Serikat|456|660|3.7|250|Dua motor listrik|1-speed|1250|Kendaraan terlaris di dunia pada 2023, mengalahkan seluruh model bermesin bakar.
Tesla|Cybertruck AWD|2024|Pickup|Pickup|AWD|Listrik|Amerika Serikat|600|1000|4.3|180|Dua motor listrik|1-speed|2200|Bodi stainless steel tanpa cat dengan sistem kelistrikan 48 volt dan kemudi kabel.
Rivian|R1T Quad-Motor|2023|Pickup|Pickup|AWD|Listrik|Amerika Serikat|835|1231|3.0|201|Empat motor listrik|1-speed|2600|Satu motor per roda memungkinkan berputar di tempat. Terowongan penyimpanan melintang di bawah bak.
Lucid|Air Sapphire|2024|Luxury|Sedan|AWD|Listrik|Amerika Serikat|1234|1697|1.9|330|Tiga motor listrik|1-speed|4200|Efisiensi tertinggi di kelasnya berkat motor rancangan sendiri yang sangat padat.
GMC|Hummer EV Edition 1|2023|Pickup|Pickup|AWD|Listrik|Amerika Serikat|1000|1600|3.0|171|Tiga motor listrik|1-speed|3800|Mode CrabWalk yang memutar roda belakang sejajar roda depan untuk bergerak menyamping.
Cadillac|CTS-V Gen 2|2013|Sports|Sedan|RWD|Bensin|Amerika Serikat|564|747|3.9|322|6.2L LSA supercharged V8|6MT|980|Sedan Amerika yang secara serius menantang M5 dan E63 di sirkuit Nurburgring.
Pontiac|Firebird Trans Am WS6|2001|Klasik|Coupe|RWD|Bensin|Amerika Serikat|325|474|5.2|253|5.7L LS1 V8|6MT|520|Model terakhir sebelum merek Pontiac ditutup. Kap mesin dengan dua saluran udara fungsional.
Saleen|S7 Twin Turbo|2006|Hypercar|Coupe|RWD|Bensin|Amerika Serikat|750|949|2.8|399|7.0L twin-turbo V8|6MT|58000|Bodi menghasilkan downforce melebihi bobotnya sendiri pada kecepatan 257 km/j.
# ─── PRANCIS ────────────────────────────────────────────────────────────────
Renault|5 Turbo 2|1985|Klasik|Hatchback|RWD|Bensin|Prancis|160|221|6.6|200|1.4L turbo I4|5MT|2400|Mesin dipindah ke tengah, fender dilebarkan ekstrem. Hatchback kota yang diubah jadi mobil reli Grup B.
Renault|Clio Williams|1994|Klasik|Hatchback|FWD|Bensin|Prancis|150|175|7.8|215|2.0L F7R I4|5MT|480|Hanya 3.800 unit. Sasis lebar khusus dan setelan suspensi yang jadi tolok ukur hot hatch 90-an.
Renault|Megane RS Trophy-R|2020|Track|Hatchback|FWD|Bensin|Prancis|300|420|5.4|262|1.8L turbo I4|6MT|1250|Kursi belakang dibuang, rem karbon-keramik opsional. Pemegang rekor Nurburgring penggerak roda depan.
Alpine|A110 S|2023|Sports|Coupe|RWD|Bensin|Prancis|300|340|4.2|275|1.8L turbo I4|7DCT|1550|Bobot 1.109 kg berkat bodi aluminium penuh. Filosofi ringan yang mengikuti jejak A110 asli 1962.
Peugeot|205 GTI 1.9|1990|Klasik|Hatchback|FWD|Bensin|Prancis|130|161|7.8|205|1.9L XU9JA I4|5MT|420|Sering disebut hot hatch terbaik sepanjang masa. Bobot 880 kg dengan buritan yang sangat hidup.
Peugeot|306 GTI-6|1998|Klasik|Hatchback|FWD|Bensin|Prancis|167|193|7.9|216|2.0L XU10J4RS I4|6MT|280|Transmisi enam percepatan pada hatchback 90-an — masih jarang di kelasnya saat itu.
Peugeot|3008 GT Hybrid4|2023|SUV|SUV|AWD|Hybrid|Prancis|300|520|5.9|240|1.6L turbo I4 + 2 motor listrik|8AT|920|Kokpit i-Cockpit dengan setir kecil dan panel instrumen di atas garis pandang.
Citroen|BX GTI 16V|1992|Klasik|Hatchback|FWD|Bensin|Prancis|160|196|7.7|220|1.9L I4 16 katup|5MT|165|Suspensi hidropneumatik yang bisa mengatur ketinggian bodi — kenyamanan di atas rival sekelasnya.
Citroen|DS3 Racing|2012|Hatchback|Hatchback|FWD|Bensin|Prancis|207|275|6.5|235|1.6L THP turbo I4|6MT|320|Dikembangkan oleh divisi balap Citroen. Trek dilebarkan 30 mm dari model standar.
Bugatti|EB110 GT|1994|Hypercar|Coupe|AWD|Bensin|Prancis|560|611|3.5|342|3.5L quad-turbo V12|6MT|145000|Empat turbo pada V12 dengan penggerak empat roda dan sasis karbon — sangat maju untuk 1991.
Bugatti|Veyron 16.4|2008|Hypercar|Coupe|AWD|Bensin|Prancis|1001|1250|2.5|407|8.0L quad-turbo W16|7DCT|420000|Sepuluh radiator dan empat turbo. Mengubah definisi batas atas mobil jalan raya.
Bugatti|Chiron Super Sport|2023|Hypercar|Coupe|AWD|Bensin|Prancis|1578|1600|2.4|440|8.0L quad-turbo W16|7DCT|980000|Buritan diperpanjang 25 cm demi aerodinamika. W16 terakhir sebelum era hybrid Bugatti.
# ─── SKANDINAVIA ────────────────────────────────────────────────────────────
Volvo|240 Turbo|1985|Klasik|Wagon|RWD|Bensin|Swedia|155|240|9.0|190|2.1L B21FT turbo I4|4MT|280|Station wagon kotak yang mengejutkan dunia dengan menang di balap turing Eropa 1985.
Volvo|850 T-5R|1996|Klasik|Wagon|FWD|Bensin|Swedia|243|350|6.9|250|2.3L B5234T5 turbo I5|4AT|380|Warna kuning krem yang jadi ikon. Station wagon balap yang membuat Volvo terlihat berbahaya.
Volvo|XC90 Recharge T8|2023|SUV|SUV|AWD|Hybrid|Swedia|455|709|5.3|180|2.0L turbo-supercharged I4 + motor listrik|8AT|1750|SUV yang menurut catatan Volvo tidak pernah menyebabkan korban jiwa di Inggris selama 16 tahun.
Polestar|2 Long Range|2023|Sedan|Hatchback|AWD|Listrik|Swedia|421|740|4.5|205|Dua motor listrik|1-speed|1150|Merek terpisah Volvo dengan pendekatan desain minimalis dan interior bebas kulit.
Koenigsegg|CCX|2007|Hypercar|Coupe|RWD|Bensin|Swedia|806|920|3.2|395|4.7L twin-supercharged V8|6MT|420000|Dibangun di bekas hanggar jet tempur. Atap bisa dilepas dan disimpan di kompartemen depan.
Koenigsegg|Jesko Absolut|2023|Hypercar|Coupe|RWD|Bensin|Swedia|1600|1500|2.5|483|5.0L twin-turbo V8|9LST|1850000|Transmisi Light Speed dengan sembilan percepatan dan tujuh kopling — bisa lompat gigi langsung.
Koenigsegg|Gemera|2024|Hypercar|Coupe|AWD|Hybrid|Swedia|1724|3500|1.9|400|2.0L 3-silinder + 3 motor listrik|9LST|1650000|Empat kursi dengan mesin tiga silinder tanpa camshaft. Torsi gabungan 3.500 Nm.
Saab|900 Turbo 16S|1990|Klasik|Hatchback|FWD|Bensin|Swedia|175|273|8.5|215|2.0L B202 turbo I4|5MT|320|Kunci kontak di lantai antara kursi dan kokpit bergaya pesawat — warisan akar Saab di industri penerbangan.
Saab|9-3 Aero|2005|Klasik|Sedan|FWD|Bensin|Swedia|250|350|6.5|250|2.8L turbo V6|6MT|185|Generasi terakhir sebelum Saab tutup. Mode Night Panel mematikan semua instrumen kecuali speedometer.
# ─── KOREA SELATAN ──────────────────────────────────────────────────────────
Hyundai|Genesis Coupe 3.8|2013|Sports|Coupe|RWD|Bensin|Korea Selatan|348|376|5.5|240|3.8L Lambda V6|6MT|420|Upaya serius pertama Korea membuat coupe penggerak roda belakang untuk pasar global.
Hyundai|i30 N Performance|2023|Hatchback|Hatchback|FWD|Bensin|Korea Selatan|280|392|5.9|250|2.0L turbo I4|6MT|780|Dikembangkan oleh mantan kepala divisi BMW M. Diferensial terkunci elektronik standar.
Hyundai|Ioniq 5 N|2024|Sports|SUV|AWD|Listrik|Korea Selatan|650|770|3.4|260|Dua motor listrik|1-speed|1450|EV yang mensimulasikan perpindahan gigi delapan percepatan lengkap dengan hentakan dan suara.
Hyundai|Ioniq 6|2023|Sedan|Sedan|RWD|Listrik|Korea Selatan|228|350|7.4|185|Motor listrik tunggal|1-speed|850|Koefisien hambat 0,21 dengan bentuk streamliner yang mengacu pada mobil rekor tahun 30-an.
Genesis|G80 Electrified|2023|Luxury|Sedan|AWD|Listrik|Korea Selatan|365|700|4.9|200|Dua motor listrik|1-speed|1650|Merek mewah Hyundai dengan interior yang secara material bersaing langsung dengan Jerman.
Kia|Stinger GT|2022|GT|Sedan|RWD|Bensin|Korea Selatan|368|510|4.9|270|3.3L twin-turbo V6|8AT|980|Dirancang oleh Peter Schreyer, disetel oleh Albert Biermann. Sedan liftback penggerak roda belakang.
Kia|EV6 GT|2023|Sports|SUV|AWD|Listrik|Korea Selatan|585|740|3.5|260|Dua motor listrik|1-speed|1350|Arsitektur 800 volt yang bisa mengisi 10 ke 80 persen dalam 18 menit.
# ─── CINA ───────────────────────────────────────────────────────────────────
BYD|Han EV|2023|Sedan|Sedan|AWD|Listrik|Cina|494|700|3.9|180|Dua motor listrik|1-speed|920|Baterai Blade berbasis LFP yang lolos uji tusuk paku tanpa terbakar.
BYD|Seal Performance|2024|Sedan|Sedan|AWD|Listrik|Cina|530|670|3.8|180|Dua motor listrik|1-speed|750|Baterai jadi bagian struktural bodi — teknologi cell-to-body yang menambah kekakuan rangka.
BYD|Atto 3|2023|SUV|SUV|FWD|Listrik|Cina|204|310|7.3|160|Motor listrik tunggal|1-speed|520|Interior bertema alat musik dengan tali pintu yang benar-benar bisa dipetik.
BYD|Yangwang U8|2024|Off-Road|SUV|AWD|Hybrid|Cina|1197|1280|3.6|200|2.0L turbo I4 + 4 motor listrik|1-speed|3200|Empat motor independen memungkinkan berputar di tempat dan mengapung sementara di air.
NIO|ET7|2023|Luxury|Sedan|AWD|Listrik|Cina|644|850|3.8|200|Dua motor listrik|1-speed|1450|Baterai bisa ditukar di stasiun otomatis dalam waktu sekitar tiga menit.
XPeng|G9|2024|SUV|SUV|AWD|Listrik|Cina|551|717|3.9|200|Dua motor listrik|1-speed|1050|Platform 800 volt dengan pengisian 10 ke 80 persen di bawah 20 menit.
Zeekr|001 FR|2024|Sports|Wagon|AWD|Listrik|Cina|1265|768|2.1|280|Empat motor listrik|1-speed|1850|Station wagon listrik dengan empat motor — akselerasi setara hypercar dalam bodi praktis.
Hongqi|H9|2023|Luxury|Sedan|RWD|Bensin|Cina|281|400|8.0|210|2.0L turbo I4|7DCT|1250|Merek kenegaraan Cina sejak 1958. Gril vertikal dengan bendera merah di kap mesin.
Wuling|Air EV|2023|Hatchback|Hatchback|RWD|Listrik|Cina|41|110|17.0|100|Motor listrik tunggal|1-speed|250|EV mikro yang dirakit di Indonesia. Panjang hanya 2,97 meter untuk lalu lintas padat kota.
# ─── TIMUR TENGAH ───────────────────────────────────────────────────────────
W Motors|Lykan HyperSport|2016|Hypercar|Coupe|RWD|Bensin|Uni Emirat Arab|780|960|2.8|385|3.7L twin-turbo flat-6|7DCT|48000|Hypercar Arab pertama. Hanya tujuh unit, dengan lampu depan bertatah batu permata.
W Motors|Fenyr SuperSport|2022|Hypercar|Coupe|RWD|Bensin|Uni Emirat Arab|900|1200|2.7|400|4.0L twin-turbo flat-6|7DCT|32000|Produksi dibatasi 25 unit per tahun. Basis mesin flat-6 yang dikembangkan bersama RUF.
Devel|Sixteen|2023|Hypercar|Coupe|AWD|Bensin|Uni Emirat Arab|2000|2600|1.8|500|12.3L quad-turbo V16|8AT|2400000|Mesin V16 dengan empat turbo. Angka yang diklaim belum pernah diverifikasi secara independen.
# ─── LAINNYA ────────────────────────────────────────────────────────────────
Skoda|Octavia vRS Mk4|2023|Wagon|Wagon|FWD|Bensin|Ceko|245|370|6.7|250|2.0L TSI I4|7DSG|720|Ruang bagasi terbesar di kelasnya dengan mekanik yang sama seperti Golf GTI.
Cupra|Formentor VZ5|2023|SUV|SUV|AWD|Bensin|Spanyol|390|480|4.2|250|2.5L turbo I5|7DSG|1150|Lima silinder dari RS3 dalam bodi crossover. Hanya 7.000 unit di seluruh dunia.
Tata|Nexon EV Max|2023|SUV|SUV|FWD|Listrik|India|143|250|9.0|140|Motor listrik tunggal|1-speed|380|EV terlaris di India, dibangun di atas platform bermesin bakar yang diadaptasi.
Mahindra|Thar 4x4|2023|Off-Road|SUV|AWD|Diesel|India|130|300|10.0|155|2.2L mHawk turbo diesel I4|6AT|480|Turunan langsung Jeep Willys lisensi 1947 yang terus diproduksi dan dimodernkan.
Proton|Satria GTi|2001|Klasik|Hatchback|FWD|Bensin|Malaysia|138|168|8.4|205|1.8L 4G93P I4|5MT|165|Sasis disetel oleh Lotus saat Proton memilikinya. Hot hatch Asia Tenggara yang serius.
Holden|Commodore HSV GTS|2016|Sedan|Sedan|RWD|Bensin|Australia|585|740|4.4|300|6.2L LSA supercharged V8|6MT|1150|Sedan Australia terakhir sebelum seluruh industri otomotif negara itu berhenti berproduksi.
# ─── TAMBAHAN: PASAR INDONESIA & ASIA TENGGARA ──────────────────────────────
Toyota|Avanza Veloz|2023|MPV|MPV|FWD|Bensin|Jepang|106|138|13.0|170|1.5L 2NR-VE I4|CVT|260|MPV terlaris Indonesia selama lebih dari satu dekade. Generasi ini beralih ke penggerak roda depan.
Toyota|Kijang Innova Zenix|2023|MPV|MPV|FWD|Hybrid|Jepang|186|206|9.5|180|2.0L I4 + motor listrik|e-CVT|520|Innova pertama dengan penggerak hybrid dan monokok, meninggalkan sasis tangga yang dipakai sejak 1977.
Toyota|Fortuner GR Sport|2023|SUV|SUV|AWD|Diesel|Jepang|204|500|10.0|180|2.8L 1GD-FTV turbo diesel I4|6AT|750|SUV sasis tangga dengan penyetelan suspensi khusus dari divisi Gazoo Racing.
Toyota|Raize GR Sport|2023|SUV|SUV|FWD|Bensin|Jepang|98|140|11.5|170|1.0L 1KR-VET turbo I3|CVT|300|Crossover kompak bermesin tiga silinder turbo, hasil kembar dengan Daihatsu Rocky.
Toyota|Corolla Cross Hybrid|2023|SUV|SUV|FWD|Hybrid|Jepang|122|142|11.0|180|1.8L I4 + motor listrik|e-CVT|560|Crossover hybrid dengan konsumsi bahan bakar mendekati mobil kota.
Toyota|Camry V6|2005|Sedan|Sedan|FWD|Bensin|Jepang|190|220|8.9|210|3.0L 1MZ-FE V6|5AT|180|Sedan menengah yang membangun reputasi Toyota soal keawetan mesin di pasar Asia.
Honda|Brio RS|2023|Hatchback|Hatchback|FWD|Bensin|Jepang|90|110|12.5|170|1.2L L12B I4|CVT|200|Hatchback kota terlaris di kelasnya, dirakit di Indonesia untuk pasar domestik dan ekspor.
Honda|HR-V RS Turbo|2023|SUV|SUV|FWD|Bensin|Jepang|177|240|8.5|200|1.5L L15B turbo I4|CVT|560|Crossover dengan mesin turbo yang sebelumnya hanya ada di Civic.
Honda|CR-V Turbo|2023|SUV|SUV|FWD|Bensin|Jepang|190|240|9.2|200|1.5L VTEC turbo I4|CVT|760|Salah satu SUV pertama yang memindahkan kelas ini dari sasis tangga ke monokok.
Honda|Accord VTi-L|2008|Sedan|Sedan|FWD|Bensin|Jepang|180|222|9.0|210|2.4L K24 I4|5AT|150|Sedan eksekutif dengan mesin K24 yang terkenal tahan pemakaian jarak jauh.
Honda|City Type Z|2001|Klasik|Sedan|FWD|Bensin|Jepang|105|140|10.5|180|1.5L D15B VTEC I4|5MT|95|Sedan kompak era 2000-an yang jadi favorit modifikasi karena bobot ringan dan mesin VTEC.
Suzuki|Ertiga Hybrid|2023|MPV|MPV|FWD|Hybrid|Jepang|102|138|13.5|170|1.5L K15B I4 + ISG|4AT|265|MPV tujuh kursi dengan sistem hybrid ringan untuk menekan konsumsi di lalu lintas padat.
Suzuki|Katana|1995|Klasik|SUV|AWD|Bensin|Jepang|63|100|20.0|120|1.0L F10A I4|5MT|95|Jip mungil bersasis tangga yang jadi ikon petualangan murah di Indonesia.
Daihatsu|Terios R|2023|SUV|SUV|RWD|Bensin|Jepang|104|136|12.5|170|1.5L 2NR-VE I4|4AT|265|SUV tujuh kursi bersasis tangga dengan jarak bebas tanah tinggi untuk jalan rusak.
Mitsubishi|Pajero Sport Dakar|2023|SUV|SUV|AWD|Diesel|Jepang|181|430|10.5|180|2.4L 4N15 turbo diesel I4|8AT|720|Penerus juara Dakar dengan sistem penggerak Super Select 4WD-II.
Nissan|Livina VL|2023|MPV|MPV|FWD|Bensin|Jepang|104|142|13.0|170|1.5L HR15DE I4|CVT|280|MPV hasil kerja sama aliansi dengan Mitsubishi, berbagi basis dengan Xpander.
Wuling|Almaz RS|2023|SUV|SUV|FWD|Bensin|Cina|140|250|10.5|180|1.5L turbo I4|CVT|400|SUV dengan asisten berkendara semi-otonom di kelas harga yang sebelumnya tidak menawarkannya.
Chery|Omoda 5|2024|SUV|SUV|FWD|Bensin|Cina|145|230|9.5|180|1.5L turbo I4|CVT|420|Crossover Cina yang masuk Indonesia dengan garansi mesin sepuluh tahun.
Hyundai|Creta Prime|2023|SUV|SUV|FWD|Bensin|Korea Selatan|115|144|11.5|180|1.5L Smartstream I4|CVT|420|Dirakit di Cikarang. Crossover pertama Hyundai yang diproduksi di Indonesia.
Hyundai|Stargazer|2023|MPV|MPV|FWD|Bensin|Korea Selatan|115|144|12.5|180|1.5L Smartstream I4|CVT|320|MPV tujuh kursi yang menantang dominasi Jepang di segmen keluarga Indonesia.
# ─── TAMBAHAN: KLASIK & IKON YANG BELUM MASUK ───────────────────────────────
BMW|E28 M5|1988|Klasik|Sedan|RWD|Bensin|Jerman|286|340|6.2|245|3.5L S38 I6|5MT|1250|Sedan produksi tercepat di dunia saat diluncurkan, dirakit tangan di Garching.
BMW|850CSi|1995|Klasik|Coupe|RWD|Bensin|Jerman|380|550|6.0|250|5.6L S70 V12|6MT|1450|Coupe V12 tanpa pilar tengah dengan lampu pop-up — puncak ambisi BMW di era 90-an.
BMW|Z8|2002|Klasik|Convertible|RWD|Bensin|Jerman|400|500|4.7|250|4.9L S62 V8|6MT|9500|Roadster rancangan Henrik Fisker dengan mesin M5 E39. Bodi aluminium penuh.
Mercedes-Benz|W126 560SEL|1990|Klasik|Sedan|RWD|Bensin|Jerman|300|455|6.9|250|5.6L M117 V8|4AT|420|Sedan mewah yang memperkenalkan kantong udara dan ABS ke pasar massal.
Mercedes-Benz|SL 500 R129|1998|Klasik|Convertible|RWD|Bensin|Jerman|320|470|6.5|250|5.0L M119 V8|5AT|780|Atap keras lipat otomatis dan rollbar yang keluar sendiri dalam 0,3 detik saat terdeteksi terguling.
Porsche|944 Turbo|1989|Klasik|Coupe|RWD|Bensin|Jerman|250|350|5.9|260|2.5L turbo I4|5MT|850|Transaxle dengan distribusi bobot nyaris sempurna. Porsche paling seimbang di era itu.
Porsche|Boxster 986|2001|Klasik|Convertible|RWD|Bensin|Jerman|252|305|5.9|260|3.2L flat-6|6MT|620|Roadster mesin tengah yang menyelamatkan Porsche dari krisis keuangan pertengahan 90-an.
Porsche|Cayman GT4 RS|2023|Track|Coupe|RWD|Bensin|Jerman|500|450|3.4|315|4.0L flat-6|7DCT|6800|Mesin GT3 dipasang di bodi Cayman. Saluran udara di belakang kepala pengemudi membuat kabinnya sangat bising — disengaja.
Audi|TT Mk1 Quattro|2002|Klasik|Coupe|AWD|Bensin|Jerman|225|280|6.4|243|1.8L turbo I4|6MT|280|Desain Bauhaus yang nyaris tidak berubah dari mobil konsepnya. Interior aluminium terekspos.
Ferrari|360 Modena|2003|Klasik|Coupe|RWD|Bensin|Italia|400|373|4.5|295|3.6L V8|6MT|4200|Ferrari pertama dengan sasis aluminium penuh. Mesin terlihat lewat kaca belakang.
Ferrari|F12 Berlinetta|2015|Supercar|Coupe|RWD|Bensin|Italia|740|690|3.1|340|6.3L V12|7DCT|8500|V12 depan dengan Aero Bridge — udara dialirkan menembus kap mesin untuk menambah downforce.
Lamborghini|Miura P400 S|1970|Klasik|Coupe|RWD|Bensin|Italia|370|388|6.7|280|3.9L V12 melintang|5MT|280000|Supercar mesin tengah pertama di dunia untuk jalan raya. Mesin dipasang melintang di belakang kabin.
Lamborghini|Espada|1972|Klasik|Coupe|RWD|Bensin|Italia|350|400|7.8|245|3.9L V12|5MT|58000|Coupe empat kursi bermesin V12 dengan panjang lebih dari 4,7 meter — bentuk yang tidak pernah diulang siapa pun.
Alfa Romeo|GTV 916|2000|Klasik|Coupe|FWD|Bensin|Italia|220|289|6.7|250|3.0L Busso V6|6MT|240|Rancangan Pininfarina dengan garis pinggang yang naik tajam. Mesin V6 Busso di bodi coupe kompak.
Lotus|Exige S2|2008|Track|Coupe|RWD|Bensin|Inggris|220|215|4.9|238|1.8L supercharged Toyota I4|6MT|920|Elise beratap dengan downforce nyata. Bobot 930 kg membuat rasio tenaga-bobotnya menyaingi mobil jauh lebih kuat.
Jaguar|E-Type Series 3|1973|Klasik|Convertible|RWD|Bensin|Inggris|272|409|6.4|241|5.3L V12|4MT|3200|Enzo Ferrari menyebutnya mobil terindah yang pernah dibuat. Seri 3 memakai V12 pertama Jaguar.
Mini|Cooper S Classic|1996|Klasik|Hatchback|FWD|Bensin|Inggris|90|123|10.9|150|1.3L I4|4MT|280|Mini asli rancangan Alec Issigonis — mesin melintang dengan transmisi di bak oli, cetak biru semua mobil kota modern.
Ford|Sierra RS Cosworth|1990|Klasik|Sedan|RWD|Bensin|Inggris|224|280|6.2|240|2.0L Cosworth turbo I4|5MT|1650|Sayap belakang raksasa yang dibutuhkan untuk homologasi balap turing. Ikon era Grup A.
Ford|Escort RS Cosworth|1994|Rally|Hatchback|AWD|Bensin|Inggris|227|304|5.7|232|2.0L Cosworth turbo I4|5MT|1850|Bodi Escort di atas sasis Sierra Cosworth yang dipendekkan. Dibuat khusus untuk reli.
Volvo|P1800 ES|1973|Klasik|Wagon|RWD|Bensin|Swedia|125|157|10.5|185|2.0L B20 I4|4MT|680|Shooting brake dengan pintu bagasi kaca penuh tanpa bingkai — solusi desain yang berani untuk masanya.
Chevrolet|Corvette C3 Stingray|1975|Klasik|Coupe|RWD|Bensin|Amerika Serikat|205|365|7.8|200|5.7L V8|4MT|980|Bodi fiberglass dengan panel atap T-top yang bisa dilepas. Salah satu siluet Amerika paling dikenal.
Dodge|Challenger R/T|1971|Klasik|Coupe|RWD|Bensin|Amerika Serikat|375|583|5.6|210|7.2L V8|4MT|2400|Era muscle car sebelum regulasi emisi memangkas tenaga. Mesin 440 kubik inci enam karburator.
Pontiac|GTO Judge|1970|Klasik|Coupe|RWD|Bensin|Amerika Serikat|370|596|6.0|205|6.6L Ram Air V8|4MT|2200|Sering disebut muscle car pertama: mesin besar dijejalkan ke bodi menengah yang ringan.
Toyota|2000GT|1970|Klasik|Coupe|RWD|Bensin|Jepang|150|175|8.6|220|2.0L 3M I6|5MT|180000|Hanya 351 unit. Mobil yang membuktikan Jepang sanggup membuat GT kelas dunia.
Nissan|Fairlady 240Z|1973|Klasik|Coupe|RWD|Bensin|Jepang|151|198|8.0|201|2.4L L24 I6|4MT|1450|Coupe terjangkau yang menghancurkan dominasi harga sport Eropa di pasar Amerika.
Mazda|Cosmo Sport 110S|1970|Klasik|Coupe|RWD|Bensin|Jepang|128|140|8.6|193|1.0L 10A rotary|4MT|3800|Mobil rotary dua rotor produksi pertama di dunia. Hanya 1.176 unit yang pernah dibuat.
Honda|Civic SiR EG6|1995|Klasik|Hatchback|FWD|Bensin|Jepang|170|160|7.2|215|1.6L B16A VTEC I4|5MT|420|Hatchback 170 HP dari mesin 1,6 liter tanpa turbo — angka tenaga spesifik yang mengejutkan pada 1992.
Subaru|Legacy RS|1993|Klasik|Sedan|AWD|Bensin|Jepang|217|290|6.0|235|2.0L EJ20 turbo flat-4|5MT|280|Pendahulu Impreza WRX. Mobil yang membawa Subaru masuk ke reli dunia.
Toyota|Chaser Tourer V|1998|Klasik|Sedan|RWD|Bensin|Jepang|280|363|5.5|250|2.5L 1JZ-GTE turbo I6|5MT|680|Sedan empat pintu bermesin 1JZ turbo — favorit drift karena bodi konservatif menyembunyikan tenaganya.
# ─── TAMBAHAN: LISTRIK & MASA KINI ──────────────────────────────────────────
Porsche|Macan Electric 4S|2025|SUV|SUV|AWD|Listrik|Jerman|516|820|4.1|240|Dua motor listrik|1-speed|2300|SUV listrik pertama Porsche di atas platform PPE 800 volt.
Mercedes-Benz|AMG EQE 53|2024|Sedan|Sedan|AWD|Listrik|Jerman|677|1000|3.5|240|Dua motor listrik|1-speed|2600|Sedan listrik AMG dengan suspensi udara dan kemudi poros belakang sepuluh derajat.
Audi|Q8 e-tron|2024|SUV|SUV|AWD|Listrik|Jerman|408|664|5.6|200|Dua motor listrik|1-speed|1950|Pembaruan besar e-tron dengan baterai lebih rapat dan aerodinamika yang diperbaiki.
Volvo|EX30 Twin|2024|SUV|SUV|AWD|Listrik|Swedia|428|543|3.6|180|Dua motor listrik|1-speed|880|SUV listrik kompak dengan jejak karbon produksi terendah yang pernah dicatat Volvo.
BYD|Sealion 7|2025|SUV|SUV|AWD|Listrik|Cina|530|690|4.5|215|Dua motor listrik|1-speed|780|SUV listrik dengan platform e-Platform 3.0 dan sistem pengelolaan suhu baterai terintegrasi.
Xiaomi|SU7 Max|2024|Sedan|Sedan|AWD|Listrik|Cina|673|838|2.8|265|Dua motor listrik|1-speed|1250|Mobil pertama Xiaomi. Terjual lebih dari 75 ribu unit dalam enam bulan pertama.
Hyundai|Kona Electric|2024|SUV|SUV|FWD|Listrik|Korea Selatan|218|255|7.8|172|Motor listrik tunggal|1-speed|650|Salah satu EV terjangkau pertama dengan jangkauan tembus 450 km.
Ford|Mustang Mach-E GT|2023|SUV|SUV|AWD|Listrik|Amerika Serikat|487|860|3.7|200|Dua motor listrik|1-speed|1350|Keputusan memakai nama Mustang untuk SUV listrik sempat memicu perdebatan panjang di kalangan penggemar.
Porsche|Taycan Cross Turismo 4S|2023|Wagon|Wagon|AWD|Listrik|Jerman|482|650|4.1|240|Dua motor listrik|2-speed|2900|Taycan berbodi shooting brake dengan jarak bebas tanah yang ditinggikan.
Lotus|Emeya R|2025|Luxury|Sedan|AWD|Listrik|Inggris|918|985|2.8|256|Dua motor listrik|2-speed|4200|Sedan listrik Lotus dengan aerodinamika aktif dan pengisian 10 ke 80 persen dalam 14 menit.
`;

// ── Parser ──────────────────────────────────────────────────────────────────

const FIELDS = [
  "brand", "name", "year", "category", "bodyStyle", "drivetrain", "fuel",
  "origin", "hp", "torque", "accel", "topSpeed", "engine", "transmission",
  "priceJt", "summary",
];

const NUMERIC = new Set(["year", "hp", "torque", "accel", "topSpeed", "priceJt"]);

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function era(year) {
  if (year < 1980) return "70-an";
  if (year < 1990) return "80-an";
  if (year < 2000) return "90-an";
  if (year < 2010) return "2000-an";
  if (year < 2020) return "2010-an";
  return "2020-an";
}

// "—" untuk angka yang sengaja dikosongkan (0), supaya UI tidak menampilkan
// nol yang terlihat seperti data asli.
const num = (v, unit) => (v ? `${v} ${unit}` : "—");

function parse(table) {
  const seen = new Set();
  const out = [];

  for (const raw of table.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const parts = line.split("|").map((p) => p.trim());
    if (parts.length !== FIELDS.length) {
      throw new Error(
        `Baris katalog rusak (${parts.length}/${FIELDS.length} kolom): ${line.slice(0, 70)}`
      );
    }

    const r = {};
    FIELDS.forEach((f, i) => {
      r[f] = NUMERIC.has(f) ? Number(parts[i]) : parts[i];
    });

    let slug = slugify(`${r.brand}-${r.name}-${r.year}`);
    if (seen.has(slug)) {
      let n = 2;
      while (seen.has(`${slug}-${n}`)) n++;
      slug = `${slug}-${n}`;
    }
    seen.add(slug);

    out.push({
      slug,
      brand: r.brand,
      name: r.name,
      eyebrow: `${r.origin} · ${r.year}`,
      year: r.year,
      category: r.category,
      bodyStyle: r.bodyStyle,
      drivetrain: r.drivetrain,
      fuel: r.fuel,
      origin: r.origin,
      era: era(r.year),
      hp: r.hp,
      torque: r.torque,
      accel: r.accel,
      topSpeed: r.topSpeed,
      engine: r.engine,
      transmission: r.transmission,
      price: r.priceJt * 1_000_000,
      summary: r.summary,
      specs: [
        { k: "Mesin", v: r.engine },
        { k: "Tenaga", v: num(r.hp, "HP") },
        { k: "Torsi", v: num(r.torque, "Nm") },
        { k: "0–100 km/j", v: r.accel ? `${r.accel} detik` : "—" },
        { k: "Kecepatan Puncak", v: num(r.topSpeed, "km/j") },
        { k: "Transmisi", v: r.transmission },
        { k: "Penggerak", v: r.drivetrain },
        { k: "Bahan Bakar", v: r.fuel },
        { k: "Asal", v: r.origin },
        { k: "Tahun Model", v: String(r.year) },
      ],
    });
  }

  return out;
}

export const catalog = parse(TABLE);
