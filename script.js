
"use strict";

/* ==========================================
   KRISH MANDVIGHAR — PORTFOLIO JAVASCRIPT
   Theme, Navigation, Animations & Utilities
========================================== */

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
        savedTheme = localStorage.getItem("portfolio-theme");
    } catch (error) {
        console.warn("Theme preference could not be loaded.");
    }

    const initialTheme =
        savedTheme === "dark" || savedTheme === "light"
            ? savedTheme
            : window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";

    applyTheme(initialTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("portfolio-theme", nextTheme);
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

    function setMenuState(isOpen) {
        navLinks.classList.toggle("active", isOpen);

        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-times", isOpen);
        }
    }

    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.contains("active");
        setMenuState(!isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMenuState(false);
        });
    });

    document.addEventListener("click", (event) => {
        if (
            navLinks.classList.contains("active") &&
            !navLinks.contains(event.target) &&
            !menuBtn.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            setMenuState(false);
        }
    });
}

/* ==========================================
   3. SMOOTH SCROLLING
========================================== */

function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            if (targetId.length > 1) {
                history.replaceState(null, "", targetId);
            }
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

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("visible", "active");
            element.style.opacity = "1";
            element.style.transform = "none";
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible", "active");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element, index) => {
        element.style.transitionDelay =
            `${Math.min(index % 4, 3) * 70}ms`;

        observer.observe(element);
    });
}

/* ==========================================
   5. ACTIVE NAVIGATION HIGHLIGHT
========================================== */

function initActiveNavigation() {
    const sections = document.querySelectorAll("main section[id]");
    const navItems = document.querySelectorAll(
        "#navLinks a[href^='#']"
    );

    if (!sections.length || !navItems.length) return;

    function updateActiveLink() {
        let currentSection = "";

        const scrollPosition =
            window.scrollY + window.innerHeight * 0.3;

        sections.forEach((section) => {
            if (scrollPosition >= section.offsetTop) {
                currentSection = section.id;
            }
        });

        navItems.forEach((link) => {
            const isActive =
                link.getAttribute("href") === `#${currentSection}`;

            if (isActive) {
                link.classList.add("active");
                link.setAttribute("aria-current", "location");
            } else {
                link.classList.remove("active");
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

    window.addEventListener("scroll", requestUpdate, {
        passive: true
    });

    window.addEventListener("resize", requestUpdate);

    updateActiveLink();
}

/* ==========================================
   6. AUTOMATIC COPYRIGHT YEAR
========================================== */

function initCurrentYear() {
    const yearElements = document.querySelectorAll(
        "#year, .current-year, [data-current-year]"
    );

    const currentYear = new Date().getFullYear();

    yearElements.forEach((element) => {
        element.textContent = currentYear;
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
        const shouldShow = window.scrollY > 400;

        backToTop.classList.toggle("visible", shouldShow);
        backToTop.setAttribute("aria-hidden", String(!shouldShow));
    }

    window.addEventListener("scroll", updateButton, {
        passive: true
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });
    });

    updateButton();
}

/* ==========================================
   9. OPTIONAL COPY EMAIL BUTTON
   Add data-copy-email to a button or link.
========================================== */

function initEmailCopy() {
    const copyButtons = document.querySelectorAll(
        "[data-copy-email]"
    );

    copyButtons.forEach((button) => {
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
