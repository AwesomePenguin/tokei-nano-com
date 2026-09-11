(function () {
  var header = document.querySelector("[data-header]");
  var reveals = document.querySelectorAll(".reveal");

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 32);
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (element) { observer.observe(element); });
  } else {
    reveals.forEach(function (element) { element.classList.add("is-visible"); });
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();