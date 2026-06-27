const menuBtn = document.getElementById("menu-btn");
const navLink = document.getElementById("nav-link");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
    navLink.classList.toggle("open");

    const isOpen = navLink.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-class-line" : "ri-menu-line");
});
navLink.addEventListener("click", (e) => {
    navLink.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
});
const ScrollRevealOption = {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
};

ScrollReveal().reveal(".header_container h1", {
    ...ScrollRevealOption,
});
ScrollReveal().reveal(".header_container form", {
    ...ScrollRevealOption,
    delay: 500,
});
ScrollReveal().reveal(".header_container img", {
    ...ScrollRevealOption,
    delay: 1000,
});
ScrollReveal().reveal(".range_card", {
    duration: 1000,
    interval: 500,
});
ScrollReveal().reveal(".location_image img", {
    ...ScrollRevealOption,
    origin: "right",
});
ScrollReveal().reveal(".location_content .section_header", {
    ...ScrollRevealOption,
    delay: "500",
});
ScrollReveal().reveal(".location_content p", {
    ...ScrollRevealOption,
    delay: "1000",
});
ScrollReveal().reveal(".location_content .location_btn", {
    ...ScrollRevealOption,
    delay: "1500",
});


/* Slider unit unggulan — dirender dari PC.featuredCars() (lihat SDD §4) */
const priceEL = document.getElementById("select-price");
let price = ["225", "455", "275", "625", "395"]; // fallback bila PC tak termuat

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
                '<img src="' + car.image + '" alt="' + car.name + '" />' +
                '<div class="select_info">' +
                infoCard("ri-speed-up-line", s.topSpeed, "km/h") +
                infoCard("ri-flashlight-line", s.power, "hp") +
                infoCard("ri-user-line", s.seats, "kursi") +
                infoCard("ri-calendar-line", car.year, "tahun") +
                "</div></div></div>";
        }).join("");
        price = featured.map((c) => c.price);
    }
}

const selectCards = document.querySelectorAll(".select_card");
if (selectCards[0]) selectCards[0].classList.add("show_info");
if (priceEL) priceEL.innerText = formatPrice(price[0]);

function updateSwiperImage(eventName, args) {
    if (eventName === "slideChangeTransitionStart") {
        const index = args && args[0].realIndex;
        if (priceEL) priceEL.innerText = formatPrice(price[index]);
        selectCards.forEach((item) => item.classList.remove("show_info"));
        if (selectCards[index]) selectCards[index].classList.add("show_info");
    }
}

const swiper = new Swiper(".swiper", {
    loop: true,
    effect: "coverflow",
    grabCursor: true,
    slidesPerView: "auto",
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