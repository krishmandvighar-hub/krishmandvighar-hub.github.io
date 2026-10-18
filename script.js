
"use strict";

/* ==========================================
   KRIS MANDVIGHAR — PORTFOLIO JAVASCRIPT
   Features:
   1. Dark / Light Theme
   2. Save Theme Preference
   3. Responsive Mobile Navigation
   4. Scroll Reveal Animations
   5. Automatic Footer Year
   6. Active Navigation Link
   7. Accessibility & Error Handling
========================================== */


/* ==========================================
   1. THEME TOGGLE
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = themeToggle?.querySelector("i");

    // Load saved theme safely
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("theme");
    } catch (error) {
        console.warn("Theme preference could not be loaded.");
    }

    // Apply saved theme
    if (savedTheme === "dark") {
        body.classList.add("dark-theme");
    } else if (savedTheme === "light") {
        body.classList.remove("dark-theme");
    }

    // Update theme icon and accessibility label
    function updateThemeIcon() {
        if (!themeToggle) return;

        const isDark = body.classList.contains("dark-theme");

        if (themeIcon) {
            themeIcon.classList.toggle("fa-sun", isDark);
            themeIcon.classList.toggle("fa-moon", !isDark);
        }

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );

        themeToggle.setAttribute("title", isDark ? "Light Mode" : "Dark Mode");
        themeToggle.setAttribute("aria-pressed", String(isDark));
    }

    updateThemeIcon();

    // Toggle theme on click
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-theme");

            const isDark = body.classList.contains("dark-theme");

            try {
                localStorage.setItem("theme", isDark ? "dark" : "light");
            } catch (error) {
                console.warn("Theme preference could not be saved.");
            }

            updateThemeIcon();
        });
    }
});


/* ==========================================
   2. MOBILE NAVIGATION MENU
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (!menuBtn || !navLinks) return;

    const menuIcon = menuBtn.querySelector("i");

    function openMenu() {
        navLinks.classList.add("active");
        menuBtn.setAttribute("aria-expanded", "true");
        menuBtn.setAttribute("aria-label", "Close navigation menu");

        if (menuIcon) {
            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-xmark");
        }
    }

    function closeMenu() {
        navLinks.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open navigation menu");

        if (menuIcon) {
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }
    }

    // Open / close menu
    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.contains("active");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu after selecting a navigation link
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Close menu using Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Close menu when switching to desktop layout
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});


/* ==========================================
   3. SCROLL REVEAL ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");

    if (revealElements.length === 0) return;

    // Respect reduced-motion accessibility preferences
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(element => {
            element.classList.add("active");
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});


/* ==========================================
   4. AUTOMATIC FOOTER YEAR
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});


/* ==========================================
   5. ACTIVE NAVIGATION LINK
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(
        "section[id], header[id]"
    );

    const navItems = document.querySelectorAll(
        "#navLinks a[href^='#']"
    );

    if (
        sections.length === 0 ||
        navItems.length === 0 ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    const sectionObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const sectionId = entry.target.id;

                navItems.forEach(link => {
                    const isCurrent =
                        link.getAttribute("href") === `#${sectionId}`;

                    if (isCurrent) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            threshold: 0,
            rootMargin: "-25% 0px -65% 0px"
        }
    );

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});


/* ==========================================
   6. EXTERNAL LINKS SAFETY
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const externalLinks = document.querySelectorAll(
        'a[target="_blank"]'
    );

    externalLinks.forEach(link => {
        link.setAttribute("rel", "noopener noreferrer");
    });
});


/* ==========================================
   7. BACK TO TOP SUPPORT
   Works if your HTML has an element with
   id="backToTop".
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const backToTop = document.getElementById("backToTop");

    if (!backToTop) return;

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });
    });
});


/* ==========================================
   END OF PORTFOLIO JAVASCRIPT
========================================== */
