const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===============================
// Typing Animation
// ===============================
(function typingAnimation() {
  const typingText = document.getElementById("typingText");
  if (!typingText) return;

  const words = (typingText.dataset.words || "")
    .split(",")
    .map(w => w.trim())
    .filter(Boolean);

  if (words.length === 0) return;

  if (prefersReducedMotion) {
    typingText.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentWord = words[wordIndex];

    typingText.textContent = isDeleting
      ? currentWord.substring(0, charIndex--)
      : currentWord.substring(0, charIndex++);

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      delay = 1200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }

    setTimeout(tick, delay);
  }

  tick();
})();

// ===============================
// Dark / Light Theme
// ===============================
(function themeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  const root = document.documentElement;
  const STORAGE_KEY = "km-theme";

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light") {
    root.classList.add("light");
    toggleBtn?.setAttribute("aria-pressed", "true");
  }

  toggleBtn?.addEventListener("click", () => {
    const isLight = root.classList.toggle("light");
    toggleBtn.setAttribute("aria-pressed", String(isLight));
    localStorage.setItem(STORAGE_KEY, isLight ? "light" : "dark");
  });
})();

// ===============================
// Mobile Nav Menu
// ===============================
(function mobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
})();

// ===============================
// Footer Year
// ===============================
(function footerYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

// ===============================
// Scroll Reveal Animation
// ===============================
(function scrollReveal() {
  const revealTargets = document.querySelectorAll(
    ".project-card, .about__frame, .about__content, .fact-table__row, .skill-table__group, .console"
  );

  if (revealTargets.length === 0) return;

  if (prefersReducedMotion) {
    revealTargets.forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  revealTargets.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach(el => observer.observe(el));
})();

// ===============================
// Active Nav Link Highlight
// ===============================
(function activeNavHighlight() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__menu a");
  if (sections.length === 0 || navLinks.length === 0) return;

  const linkFor = id => [...navLinks].find(link => link.getAttribute("href") === `#${id}`);

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        link.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
})();

// ===============================
// Button Ripple Effect
// ===============================
(function buttonRipple() {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach(button => {
    button.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");

      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
})();

// ===============================
// Page Load Animation
// ===============================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
