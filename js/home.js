const menuBtn = document.getElementById("menu-btn");
// Prefer shared nav behavior when available; otherwise fallback to local handlers.
if (window.PC && PC.nav) {
    PC.nav.initMenu("#menu-btn", "#nav-link", "open");
} else {
    const navLink = document.getElementById("nav-link");
    const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;
    const navOpenLabel = "Buka menu";
    const navCloseLabel = "Tutup menu";

    function updateMenuState(isOpen) {
        if (!menuBtn) return;
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute("aria-label", isOpen ? navCloseLabel : navOpenLabel);
        if (menuBtnIcon) {
            menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
        }
    }

    function toggleNav() {
        if (!navLink) return;
        var isOpen = navLink.classList.toggle("open");
        updateMenuState(isOpen);
    }

    if (menuBtn && navLink) {
        menuBtn.setAttribute("aria-expanded", "false");
        updateMenuState(false);
        menuBtn.addEventListener("click", toggleNav);
        menuBtn.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleNav();
            }
        });
        navLink.addEventListener("click", function () {
            navLink.classList.remove("open");
            updateMenuState(false);
        });
    }
}

/* Render featured inventory grid */
function renderFeaturedGrid() {
    const grid = document.getElementById("featured-grid");
    if (!grid) return;
    const cars = (window.PC && PC.featuredCars) ? PC.featuredCars() : [];
    if (!cars.length) {
        grid.innerHTML = '<p class="featured_grid__empty">Tidak ada unit tersedia saat ini.</p>';
        return;
    }
    grid.innerHTML = cars.slice(0, 3).map(function (car) {
        var s = car.specs;
        var price = (window.PC && PC.format) ? PC.format.compactRupiah(car.price) : "—";
        var url = PC.carUrl(car);
        return '<article class="featured_card">' +
            '<div class="featured_card__image">' +
            '<span class="featured_card__badge">' + car.badge + '</span>' +
            '<img src="' + car.image + '" alt="' + car.name + '" loading="lazy" />' +
            '</div>' +
            '<div class="featured_card__body">' +
            '<h3 class="featured_card__name">' + car.name + '</h3>' +
            '<p class="featured_card__brand">' + car.brand + ' · ' + car.year + '</p>' +
            '<div class="featured_card__specs">' +
            '<div class="featured_card__spec"><div class="featured_card__spec-value">' + s.topSpeed + ' <span>km/h</span></div><div class="featured_card__spec-label">Kecepatan</div></div>' +
            '<div class="featured_card__spec"><div class="featured_card__spec-value">' + s.power + ' <span>hp</span></div><div class="featured_card__spec-label">Tenaga</div></div>' +
            '<div class="featured_card__spec"><div class="featured_card__spec-value">' + s.seats + ' <span>kursi</span></div><div class="featured_card__spec-label">Kapasitas</div></div>' +
            '</div>' +
            '<div class="featured_card__price">' + price + '</div>' +
            '<div class="featured_card__actions">' +
            '<a class="btn" href="' + url + '">Detail unit</a>' +
            '<a class="btn btn--ghost" href="penjualan.html">Katalog</a>' +
            '</div>' +
            '</div>' +
            '</article>';
    }).join("");
}

renderFeaturedGrid();

const ScrollRevealOption = {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
};

ScrollReveal().reveal(".range_card", {
    duration: 1000,
    interval: 500,
});


/* Slider unit unggulan — dirender dari PC.featuredCars() (lihat SDD §4) */
const priceEL = document.getElementById("select-price");
const detailEL = document.getElementById("select-detail");
let price = ["225", "455", "275", "625", "395"]; // fallback bila PC tak termuat
let slideCars = [];

function infoCard(icon, value, unit) {
    return '<div class="select_info_card"><span><i class="' + icon + '"></i></span>' +
        '<h4>' + value + ' <span>' + unit + '</span></h4></div>';
}
function formatPrice(p) {
    return (window.PC && PC.format) ? PC.format.compactRupiah(p) : p;
}

if (window.PC && PC.featuredCars) {
    const featured = PC.featuredCars();
    const wrapper = document.querySelector(".swiper .swiper-wrapper");
    if (wrapper && featured.length) {
        wrapper.innerHTML = featured.map((car) => {
            const s = car.specs;
            return '<div class="swiper-slide"><div class="select_card">' +
                '<img src="' + car.image + '" alt="' + car.name + '" loading="lazy" />' +
                '<div class="select_info">' +
                infoCard("ri-speed-up-line", s.topSpeed, "km/h") +
                infoCard("ri-flashlight-line", s.power, "hp") +
                infoCard("ri-user-line", s.seats, "kursi") +
                infoCard("ri-calendar-line", car.year, "tahun") +
                "</div></div></div>";
        }).join("");
        price = featured.map((c) => c.price);
        slideCars = featured;
    }
}

/* "Lihat Detail" menuju halaman unit yang sedang tampil, bukan katalog umum. */
function syncDetailLink(index) {
    if (!detailEL || !slideCars[index]) return;
    detailEL.href = PC.carUrl(slideCars[index]);
    detailEL.setAttribute("aria-label", "Lihat detail " + slideCars[index].name);
}

const selectCards = document.querySelectorAll(".select_card");
if (selectCards[0]) selectCards[0].classList.add("show_info");
if (priceEL) priceEL.innerText = formatPrice(price[0]);
syncDetailLink(0);

function updateSwiperImage(eventName, args) {
    if (eventName === "slideChangeTransitionStart") {
        const index = args && args[0].realIndex;
        if (priceEL) priceEL.innerText = formatPrice(price[index]);
        syncDetailLink(index);
        selectCards.forEach((item) => item.classList.remove("show_info"));
        if (selectCards[index]) selectCards[index].classList.add("show_info");
    }
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const swiper = new Swiper(".swiper", {
    loop: true,
    effect: "coverflow",
    grabCursor: true,
    slidesPerView: "auto",
    keyboard: { enabled: true },
    pagination: {
        el: ".select_pagination",
        clickable: true,
    },
    navigation: {
        prevEl: ".select_nav--prev",
        nextEl: ".select_nav--next",
    },
    a11y: {
        prevSlideMessage: "Slide sebelumnya",
        nextSlideMessage: "Slide berikutnya",
        paginationBulletMessage: "Ke unit nomor {{index}}",
    },
    // Autoplay dinonaktifkan bila pengguna meminta reduced-motion (PRD §8.8)
    autoplay: prefersReducedMotion ? false : {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    coverflowEffect: {
        rotate: 0,
        depth: 500,
        modifier: 1,
        scale: 0.75,
        slideShadows: false,
        stretch: -100,
    },
    onAny(event, ...args) {
        updateSwiperImage(event, args);
    },
});

ScrollReveal().reveal(".story_card", {
    ...ScrollRevealOption,
    interval: 500,
});

const banner = document.querySelector(".banner_wrapper");

const bannerContent = Array.from(banner.children);

bannerContent.forEach((item) => {
    const duplicateNode = item.cloneNode(true);
    duplicateNode.setAttribute("aria-hidden", true);
    banner.appendChild(duplicateNode);
});

ScrollReveal().reveal(".download_image img", {
    ...ScrollRevealOption,
    origin: "right",
});
ScrollReveal().reveal(".dowload_content .section_header12", {
    ...ScrollRevealOption,
    delay: 500,
});
ScrollReveal().reveal(".download_link", {
    ...ScrollRevealOption,
    delay: 1000,
});

/* Validasi form newsletter (butuh js/lib/ui.js + js/components/forms.js) */
if (window.PC && PC.forms) {
    PC.forms.initNewsletter();
}

/* Scroll reveal, progress bar, dan count-up statistik */
if (window.PC && PC.ui) {
    /* Angka band statistik diambil dari data agar tak pernah basi saat
       koleksi bertambah. Kategori dikurangi satu: "Semua" bukan kategori. */
    PC.ui.setCount(PC.ui.$("[data-count-cars]"), PC.cars.length);
    PC.ui.setCount(PC.ui.$("[data-count-brands]"), PC.brands().length);
    PC.ui.setCount(PC.ui.$("[data-count-categories]"), PC.categories.length - 1);

    PC.ui.initReveal();
    PC.ui.initScrollProgress();
    PC.ui.initCounters();
}