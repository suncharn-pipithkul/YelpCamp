let backToTopBtn = document.getElementById("btn-back-to-top");
backToTopBtn.addEventListener("click", backToTop);

// scroll up logic
function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Button show only when user scroll down enough
window.addEventListener('scroll', scrollFunction);

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
}