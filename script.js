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


const selectCards = document.querySelectorAll(".select_card");
selectCards[0].classList.add("show_info");

const price = ["225", "455", "275", "625", "395",];

const priceEL = document.getElementById("select-price");


function updateSwiperImage(eventName, args) {
    if (eventName === "slideChangeTransitionStart") {
        const index = args && args[0].realIndex;
        priceEL.innerText = price[index];
        selectCards.forEach((item) => {
            item.classList.remove("show_info");
        });
        selectCards[index].classList.add("Show_info");
    }
}

const swiper = new Swiper(".swiper", {
    loop: true,
    effect: "overflow",
    grabCursor: true,
    slidesPerView: "auto",
    coverfloweEffect: {
        rotate: 0,
        depth: 500,
        midifier: 1,
        scale: 0.75,
        slidesShadows: false,
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
    delsy: 500,
});
ScrollReveal().reveal(".download_link", {
    ...ScrollRevealOption,
    delay: 1000,
});