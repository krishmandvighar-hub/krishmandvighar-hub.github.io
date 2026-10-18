"use strict";

/* ==========================================
   KRIS MANDVIGHAR — PORTFOLIO JAVASCRIPT
   1. Dark / light theme (saved)
   2. Mobile navigation
   3. Scroll reveal
   4. Footer year
   5. Active nav link
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- 1. THEME ---------- */
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

    try {
        if (localStorage.getItem("theme") === "dark") body.classList.add("dark-theme");
    } catch (e) { /* storage unavailable */ }

    function updateThemeIcon() {
        if (!themeToggle) return;
        const isDark = body.classList.contains("dark-theme");
        if (themeIcon) {
            themeIcon.classList.toggle("fa-sun", isDark);
            themeIcon.classList.toggle("fa-moon", !isDark);
        }
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }
    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-theme");
            try {
                localStorage.setItem("theme", body.classList.contains("dark-theme") ? "dark" : "light");
            } catch (e) { /* ignore */ }
            updateThemeIcon();
        });
    }

    /* ---------- 2. MOBILE MENU ---------- */
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {
        const menuIcon = menuBtn.querySelector("i");

        const setMenu = open => {
            navLinks.classList.toggle("active", open);
            menuBtn.setAttribute("aria-expanded", String(open));
            menuBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
            if (menuIcon) {
                menuIcon.classList.toggle("fa-xmark", open);
                menuIcon.classList.toggle("fa-bars", !open);
            }
        };

        menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("active")));
        navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
        document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
        window.addEventListener("resize", () => { if (window.innerWidth > 768) setMenu(false); });
    }

    /* ---------- 3. SCROLL REVEAL ---------- */
    const revealEls = document.querySelectorAll(".reveal");

    if (revealEls.length) {
        if (reduceMotion || !("IntersectionObserver" in window)) {
            revealEls.forEach(el => el.classList.add("active"));
        } else {
            const revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

            revealEls.forEach(el => revealObserver.observe(el));
        }
    }

    /* ---------- 4. FOOTER YEAR ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 5. ACTIVE NAV LINK ---------- */
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll("#navLinks a[href^='#']");

    if (sections.length && navItems.length && "IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navItems.forEach(link => {
                    if (link.getAttribute("href") === "#" + entry.target.id) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        }, { threshold: 0, rootMargin: "-25% 0px -65% 0px" });

        sections.forEach(s => sectionObserver.observe(s));
    }
});
