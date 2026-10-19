"use strict";
 
/* ==========================================
   PORTFOLIO JAVASCRIPT
   Theme, Navigation, Animations & Utilities
========================================== */
 
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;
 
const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
 
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileNavigation();
    initSmoothScrolling();
    initScrollReveal();
    initActiveNavigation();
    initCurrentYear();
    initExternalLinks();
    initBackToTop();
    initEmailCopy();
});
 
/* ==========================================
   1. DARK / LIGHT THEME
========================================== */
 
function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;
 
    const themeIcon = themeToggle.querySelector("i");
    const root = document.documentElement;
    const STORAGE_KEY = "portfolio-theme";
 
    function applyTheme(theme) {
        const isDark = theme === "dark";
 
        root.setAttribute("data-theme", theme);
        root.classList.toggle("dark-theme", isDark);
        root.classList.toggle("light-theme", !isDark);
 
        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
        themeToggle.setAttribute("aria-pressed", String(isDark));
 
        if (themeIcon) {
            themeIcon.classList.toggle("fa-moon", !isDark);
            themeIcon.classList.toggle("fa-sun", isDark);
        }
    }
 
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        console.warn("Theme preference could not be loaded.");
    }
 
    const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
 
    const initialTheme =
        savedTheme === "dark" || savedTheme === "light"
            ? savedTheme
            : systemPrefersDark
                ? "dark"
                : "light";
 
    applyTheme(initialTheme);
 
    themeToggle.addEventListener("click", () => {
        const nextTheme =
            root.getAttribute("data-theme") === "dark" ? "light" : "dark";
 
        applyTheme(nextTheme);
 
        try {
            localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (error) {
            console.warn("Theme preference could not be saved.");
        }
    });
}
 
/* ==========================================
   2. RESPONSIVE MOBILE NAVIGATION
========================================== */
 
function initMobileNavigation() {
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    if (!menuBtn || !navLinks) return;
 
    const icon = menuBtn.querySelector("i");
 
    function setMenuState(isOpen) {
        navLinks.classList.toggle("active", isOpen);
 
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
 
        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-times", isOpen);
        }
    }
 
    menuBtn.addEventListener("click", () => {
        setMenuState(!navLinks.classList.contains("active"));
    });
 
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });
 
    document.addEventListener("click", (event) => {
        const clickedOutside =
            !navLinks.contains(event.target) &&
            !menuBtn.contains(event.target);
 
        if (navLinks.classList.contains("active") && clickedOutside) {
            setMenuState(false);
        }
    });
 
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenuState(false);
    });
 
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) setMenuState(false);
    });
}
 
/* ==========================================
   3. SMOOTH SCROLLING
========================================== */
 
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") return;
 
            const target = document.querySelector(targetId);
            if (!target) return;
 
            event.preventDefault();
 
            target.scrollIntoView({
                behavior: scrollBehavior,
                block: "start"
            });
 
            history.replaceState(null, "", targetId);
        });
    });
}
 
/* ==========================================
   4. SCROLL REVEAL ANIMATIONS
========================================== */
 
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        ".reveal, .fade-in, .project-card, " +
        ".skill-card, .stat-card, .timeline-item"
    );
 
    if (!revealElements.length) return;
 
    function show(element) {
        element.classList.add("visible", "active");
    }
 
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            show(element);
            element.style.opacity = "1";
            element.style.transform = "none";
        });
        return;
    }
 
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
 
                const element = entry.target;
                show(element);
                currentObserver.unobserve(element);
 
                // Remove the stagger delay afterwards so hover effects stay snappy
                window.setTimeout(() => {
                    element.style.transitionDelay = "";
                }, 900);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );
 
    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${(index % 4) * 70}ms`;
        observer.observe(element);
    });
}
 
/* ==========================================
   5. ACTIVE NAVIGATION HIGHLIGHT
========================================== */
 
function initActiveNavigation() {
    const sections = document.querySelectorAll("main section[id]");
    const navItems = document.querySelectorAll("#navLinks a[href^='#']");
 
    if (!sections.length || !navItems.length) return;
 
    function updateActiveLink() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.3;
        const atBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 4;
 
        let currentSection = "";
 
        sections.forEach((section) => {
            if (scrollPosition >= section.offsetTop) {
                currentSection = section.id;
            }
        });
 
        if (atBottom) {
            currentSection = sections[sections.length - 1].id;
        }
 
        navItems.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentSection}`;
 
            link.classList.toggle("active", isActive);
 
            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }
 
    let ticking = false;
 
    function requestUpdate() {
        if (ticking) return;
        ticking = true;
 
        window.requestAnimationFrame(() => {
            updateActiveLink();
            ticking = false;
        });
    }
 
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
 
    updateActiveLink();
}
 
/* ==========================================
   6. AUTOMATIC COPYRIGHT YEAR
========================================== */
 
function initCurrentYear() {
    const year = new Date().getFullYear();
 
    document
        .querySelectorAll("#year, .current-year, [data-current-year]")
        .forEach((element) => {
            element.textContent = year;
        });
}
 
/* ==========================================
   7. EXTERNAL LINK SECURITY
========================================== */
 
function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        link.rel = "noopener noreferrer";
    });
}
 
/* ==========================================
   8. BACK-TO-TOP BUTTON
   Works when #backToTop exists in HTML.
========================================== */
 
function initBackToTop() {
    const backToTop = document.getElementById("backToTop");
    if (!backToTop) return;
 
    function updateButton() {
        backToTop.classList.toggle("visible", window.scrollY > 400);
    }
 
    window.addEventListener("scroll", updateButton, { passive: true });
 
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: scrollBehavior });
    });
 
    updateButton();
}
 
/* ==========================================
   9. OPTIONAL COPY EMAIL BUTTON
   Add data-copy-email="you@example.com" to a button or link.
========================================== */
 
function initEmailCopy() {
    document.querySelectorAll("[data-copy-email]").forEach((button) => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
 
            const email = button.getAttribute("data-copy-email");
            if (!email) return;
 
            try {
                await navigator.clipboard.writeText(email);
 
                const originalText = button.textContent;
                button.textContent = "Email Copied!";
 
                window.setTimeout(() => {
                    button.textContent = originalText;
                }, 1800);
            } catch (error) {
                window.location.href = `mailto:${email}`;
            }
        });
    });
}
 
/* ==========================================
   END OF PORTFOLIO JAVASCRIPT
========================================== */
 
