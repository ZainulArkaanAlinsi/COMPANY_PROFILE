/* ============================================================
   PREMIUM CARS — Data Layer
   Sumber tunggal data unit. Di-embed (bukan fetch) agar jalan
   di file:// tanpa server. Lihat SDD.md §4.
   ============================================================ */
window.PC = window.PC || {};

PC.categories = [
  { id: "all",      label: "Semua",     icon: "ri-apps-2-line" },
  { id: "hypercar", label: "Hypercar",  icon: "ri-flashlight-line" },
  { id: "sport",    label: "Sport",     icon: "ri-roadster-line" },
  { id: "suv",      label: "SUV",       icon: "ri-suv-line" },
  { id: "family",   label: "Keluarga",  icon: "ri-group-line" },
  { id: "electric", label: "Electric",  icon: "ri-battery-charge-line" },
  { id: "classic",  label: "Klasik",    icon: "ri-vip-crown-2-line" },
];

PC.cars = [
  {
    id: "bugatti-chiron-pur-sport", name: "Bugatti Chiron Pur Sport",
    brand: "Bugatti", category: "hypercar", price: 56000000000, year: 2023,
    image: "image/bu-removebg-preview (1).png", badge: "Hypercar", featured: true,
    specs: { topSpeed: 350, power: 1500, seats: 2, transmission: "Automatic" },
  },
  {
    id: "ferrari-sf90", name: "Ferrari SF90 Stradale",
    brand: "Ferrari", category: "sport", price: 12000000000, year: 2022,
    image: "image/fe-removebg-preview.png", badge: "Hybrid", featured: true,
    specs: { topSpeed: 340, power: 1000, seats: 2, transmission: "Automatic" },
  },
  {
    id: "mclaren-720s", name: "McLaren 720S",
    brand: "McLaren", category: "sport", price: 7500000000, year: 2021,
    image: "image/mc-removebg-preview.png", badge: "Supercar", featured: false,
    specs: { topSpeed: 341, power: 720, seats: 2, transmission: "Automatic" },
  },
  {
    id: "lamborghini-aventador-j", name: "Lamborghini Aventador J",
    brand: "Lamborghini", category: "hypercar", price: 45000000000, year: 2020,
    image: "image/Lamborghini_Aventador_J-removebg-preview.png", badge: "Roadster", featured: true,
    specs: { topSpeed: 350, power: 700, seats: 2, transmission: "Automatic" },
  },
  {
    id: "lamborghini-sesto-elemento", name: "Lamborghini Sesto Elemento",
    brand: "Lamborghini", category: "hypercar", price: 40000000000, year: 2019,
    image: "image/Lamborghini_Sesto_Elemento-removebg-preview.png", badge: "Track", featured: false,
    specs: { topSpeed: 340, power: 570, seats: 2, transmission: "Automatic" },
  },
  {
    id: "lamborghini-huracan", name: "Lamborghini Huracán",
    brand: "Lamborghini", category: "sport", price: 6500000000, year: 2022,
    image: "image/Lamborghini_Huracan-removebg-preview.png", badge: "Supercar", featured: true,
    specs: { topSpeed: 325, power: 640, seats: 2, transmission: "Automatic" },
  },
  {
    id: "pagani-huayra", name: "Pagani Huayra",
    brand: "Pagani", category: "hypercar", price: 38000000000, year: 2021,
    image: "image/agani_Huayra-removebg-preview.png", badge: "Hypercar", featured: true,
    specs: { topSpeed: 383, power: 730, seats: 2, transmission: "Automated Manual" },
  },
  {
    id: "lotus-evija", name: "Lotus Evija",
    brand: "Lotus", category: "electric", price: 35000000000, year: 2023,
    image: "image/Lotus_Evija-removebg-preview.png", badge: "Electric", featured: true,
    specs: { topSpeed: 320, power: 2012, seats: 2, transmission: "Single-speed" },
  },
  {
    id: "rolls-royce-phantom", name: "Rolls-Royce Phantom",
    brand: "Rolls-Royce", category: "family", price: 15000000000, year: 2023,
    image: "image/Rolls-Royce_Phantom-removebg-preview.png", badge: "Luxury", featured: false,
    specs: { topSpeed: 250, power: 563, seats: 5, transmission: "Automatic" },
  },
  {
    id: "ford-mustang-boss-429", name: "Ford Mustang Boss 429",
    brand: "Ford", category: "classic", price: 4800000000, year: 1969,
    image: "image/Ford_Mustang_Boss_429-removebg-preview.png", badge: "Klasik", featured: false,
    specs: { topSpeed: 190, power: 375, seats: 4, transmission: "Manual" },
  },
  {
    id: "ford-mustang-ecoboost", name: "Ford Mustang EcoBoost",
    brand: "Ford", category: "sport", price: 1300000000, year: 2022,
    image: "image/Ford_Mustang_EcoBoost_fastback-removebg-preview.png", badge: "Fastback", featured: false,
    specs: { topSpeed: 250, power: 310, seats: 4, transmission: "Automatic" },
  },
  {
    id: "nissan-skyline-r34", name: "Nissan Skyline GT-R R34",
    brand: "Nissan", category: "classic", price: 2000000000, year: 1999,
    image: "image/Nissan_Skyline_-_R34-removebg-preview.png", badge: "JDM", featured: false,
    specs: { topSpeed: 265, power: 280, seats: 4, transmission: "Manual" },
  },
  {
    id: "nissan-skyline-r32", name: "Nissan Skyline GT-R R32",
    brand: "Nissan", category: "classic", price: 900000000, year: 1993,
    image: "image/Nissan_Skyline_-_R32-removebg-preview.png", badge: "JDM", featured: false,
    specs: { topSpeed: 250, power: 276, seats: 4, transmission: "Manual" },
  },
  {
    id: "mazda-rx7", name: "Mazda RX-7",
    brand: "Mazda", category: "classic", price: 1200000000, year: 1999,
    image: "image/mazda_rx_7-removebg-preview.png", badge: "Rotary", featured: false,
    specs: { topSpeed: 250, power: 276, seats: 4, transmission: "Manual" },
  },
  {
    id: "subaru-brz", name: "Subaru BRZ",
    brand: "Subaru", category: "sport", price: 800000000, year: 2022,
    image: "image/Subaru_BRZ-removebg-preview.png", badge: "Coupe", featured: false,
    specs: { topSpeed: 226, power: 228, seats: 4, transmission: "Manual" },
  },
  {
    id: "bmw-m4", name: "BMW M4 Competition",
    brand: "BMW", category: "sport", price: 2400000000, year: 2023,
    image: "image/BMW_M4-removebg-preview.png", badge: "Coupe", featured: false,
    specs: { topSpeed: 290, power: 503, seats: 4, transmission: "Automatic" },
  },
  {
    id: "bmw-320i", name: "BMW 320i",
    brand: "BMW", category: "sport", price: 1100000000, year: 2023,
    image: "image/BMW_320i-removebg-preview.png", badge: "Sedan", featured: false,
    specs: { topSpeed: 235, power: 184, seats: 5, transmission: "Automatic" },
  },
  {
    id: "toyota-alphard", name: "Toyota Alphard",
    brand: "Toyota", category: "family", price: 1500000000, year: 2024,
    image: "image/Toyota_Alphard-removebg-preview.png", badge: "MPV", featured: true,
    specs: { topSpeed: 180, power: 280, seats: 7, transmission: "Automatic" },
  },
  {
    id: "mitsubishi-pajero-sport", name: "Mitsubishi Pajero Sport",
    brand: "Mitsubishi", category: "suv", price: 650000000, year: 2024,
    image: "image/pajero_sport-removebg-preview.png", badge: "SUV", featured: false,
    specs: { topSpeed: 180, power: 181, seats: 7, transmission: "Automatic" },
  },
  {
    id: "mazda-cx5", name: "Mazda CX-5",
    brand: "Mazda", category: "suv", price: 700000000, year: 2023,
    image: "image/mazda_cx_5-removebg-preview.png", badge: "SUV", featured: false,
    specs: { topSpeed: 195, power: 194, seats: 5, transmission: "Automatic" },
  },
  {
    id: "chevrolet-trailblazer", name: "Chevrolet Trailblazer 2024",
    brand: "Chevrolet", category: "suv", price: 600000000, year: 2024,
    image: "image/Chevrolet_Trailblazer_2024-removebg-preview.png", badge: "SUV", featured: false,
    specs: { topSpeed: 190, power: 155, seats: 5, transmission: "Automatic" },
  },
];

/* Helper akses cepat */
PC.getCar = function (id) {
  return PC.cars.find(function (c) { return c.id === id; }) || null;
};
PC.featuredCars = function () {
  return PC.cars.filter(function (c) { return c.featured; });
};
