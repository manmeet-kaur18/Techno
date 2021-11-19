var mySwiper = new Swiper(".swiper-container", {
    direction: "vertical",
    loop: false,
    pagination: ".swiper-pagination",
    grabCursor: false,
    speed: 3000,
    paginationClickable: true,
    parallax: true,
    autoplay: true,
    effect: "slide",
    mousewheelControl: 1
});
const button1 = document.getElementById('btnbegin');
button1.addEventListener('click', function (e) {
    location.href = '/login';
});