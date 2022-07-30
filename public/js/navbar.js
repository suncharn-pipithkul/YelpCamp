/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (lastScrollY < window.scrollY) {
    navbar.style.cssText = "transform: translateY(-100%); transition: all 0.2s ease-in-out;";
  } else {
    navbar.style.cssText = "transform: translateY(0%); transition: all 0.2s ease-in-out;";
  }

  lastScrollY = window.scrollY;
});