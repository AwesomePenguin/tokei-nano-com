(function () {
  var header = document.querySelector("[data-header]");
  var reveals = document.querySelectorAll(".reveal");
  var countdown = document.querySelector("[data-release-countdown]");

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

  if (countdown) {
    var releaseAt = new Date(countdown.getAttribute("data-release-at")).getTime();
    var countdownValues = countdown.querySelector(".countdown-values");
    var countdownLabel = countdown.querySelector("[data-countdown-label]");
    var releasedLabel = countdown.querySelector("[data-countdown-released]");
    var days = countdown.querySelector("[data-countdown-days]");
    var hours = countdown.querySelector("[data-countdown-hours]");
    var minutes = countdown.querySelector("[data-countdown-minutes]");
    var seconds = countdown.querySelector("[data-countdown-seconds]");
    var releaseLinks = document.querySelectorAll("[data-release-link]");
    var lockedButtons = document.querySelectorAll("[data-release-locked]");
    var countdownTimer;

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function unlockRelease() {
      countdownValues.hidden = true;
      countdownLabel.hidden = true;
      releasedLabel.hidden = false;
      lockedButtons.forEach(function (button) { button.hidden = true; });
      releaseLinks.forEach(function (link) { link.hidden = false; });
      if (countdownTimer) window.clearInterval(countdownTimer);
    }

    function updateCountdown() {
      var remaining = releaseAt - Date.now();

      if (remaining <= 0) {
        unlockRelease();
        return;
      }

      days.textContent = pad(Math.floor(remaining / 86400000));
      hours.textContent = pad(Math.floor((remaining % 86400000) / 3600000));
      minutes.textContent = pad(Math.floor((remaining % 3600000) / 60000));
      seconds.textContent = pad(Math.floor((remaining % 60000) / 1000));
    }

    updateCountdown();
    countdownTimer = window.setInterval(updateCountdown, 1000);
  }
})();