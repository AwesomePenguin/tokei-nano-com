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
    var presaveLinks = document.querySelectorAll("[data-presave-link]");
    var releaseContent = document.querySelectorAll("[data-release-content]");
    var shareButton = document.querySelector("[data-share-release]");
    var previewRequested = new URLSearchParams(window.location.search).get("release-preview") === "1";
    var isLocalPreview = previewRequested && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    var countdownTimer;

    if (isLocalPreview) {
      document.querySelectorAll(".language-nav a").forEach(function (link) {
        var url = new URL(link.href);
        url.searchParams.set("release-preview", "1");
        link.href = url.toString();
      });
    }

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function copyShareContent(text, url) {
      var content = text + "\n" + url;

      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(content);
      }

      var textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      return Promise.resolve();
    }

    function showCopiedLabel() {
      var label = shareButton.querySelector("[data-share-label]");
      label.textContent = shareButton.getAttribute("data-share-copied-label");
      window.setTimeout(function () {
        label.textContent = shareButton.getAttribute("data-share-default-label");
      }, 1800);
    }

    if (shareButton) {
      shareButton.addEventListener("click", async function () {
        var shareData = {
          title: shareButton.getAttribute("data-share-title"),
          text: shareButton.getAttribute("data-share-text"),
          url: shareButton.getAttribute("data-share-url")
        };

        if (navigator.share) {
          try {
            await navigator.share(shareData);
            return;
          } catch (error) {
            if (error.name === "AbortError") return;
          }
        }

        await copyShareContent(shareData.text, shareData.url);
        showCopiedLabel();
      });
    }

    function unlockRelease() {
      countdownValues.hidden = true;
      countdownLabel.hidden = true;
      releasedLabel.hidden = false;
      lockedButtons.forEach(function (button) { button.hidden = true; });
      presaveLinks.forEach(function (link) { link.hidden = true; });
      releaseLinks.forEach(function (link) { link.hidden = false; });
      if (shareButton) shareButton.setAttribute("data-share-text", shareButton.getAttribute("data-share-released-text"));
      releaseContent.forEach(function (section) {
        section.hidden = false;
        section.querySelectorAll(".reveal").forEach(function (element) { element.classList.add("is-visible"); });
      });
      if (countdownTimer) window.clearInterval(countdownTimer);
    }

    function updateCountdown() {
      if (isLocalPreview) {
        unlockRelease();
        return;
      }

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