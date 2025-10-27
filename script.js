// script.js - Final Robust Version
// Purpose: page UI behavior, contact form, country code mapping, sidebar, and mobile globe repositioning API

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const hamburger = document.getElementById('hamburger');
const closeSidebar = document.getElementById('closeSidebar');

function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('show');
    hamburger?.setAttribute('aria-expanded', 'true');
    sidebar?.setAttribute('aria-hidden', 'false');
    document.getElementById('closeSidebar')?.focus();
}

function hideSidebar() {
    hamburger?.focus();
    sidebar?.classList.remove('open');
    overlay?.classList.remove('show');
    hamburger?.setAttribute('aria-expanded', 'false');
    sidebar?.setAttribute('aria-hidden', 'true');
}

hamburger?.addEventListener('click', openSidebar);
closeSidebar?.addEventListener('click', hideSidebar);
overlay?.addEventListener('click', hideSidebar);

// Footer year auto-update
const y = document.getElementById('year');
if (y) { y.textContent = new Date().getFullYear(); }

// Intersection observer for reveal animations
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.16 });
document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));


/* ----------------------------
    AUTO-ALIGN
    ---------------------------- */
function alignImportToExportOnce() {
    try {
      const tickers = document.querySelectorAll('.products-ticker-section .ticker');
      if (!tickers || tickers.length < 2) {
        console.log('align: tickers not found or less than 2');
        return;
      }
      const importTicker = tickers[0];
      const exportTicker = tickers[1];
    
      setTimeout(() => {
        try {
          const impRect = importTicker.getBoundingClientRect();
          const expRect = exportTicker.getBoundingClientRect();
          const diff = Math.round(expRect.left - impRect.left);
    
          console.log('align: impLeft=', impRect.left, 'expLeft=', expRect.left, 'diff=', diff);
    
          if (Math.abs(diff) > 1) {
            importTicker.style.setProperty('margin-left', diff + 'px', 'important');
            importTicker.setAttribute('data-auto-adjust', 'margin');
            if (importTicker.getAttribute('data-auto-adjust') === 'transform') {
              importTicker.style.removeProperty('transform');
            }
            console.log('align: set margin-left to', diff + 'px');
            return;
          }
    
          if (importTicker.getAttribute('data-auto-adjust')) {
            console.log('align: already adjusted previously; keeping inline margin');
            const currentInline = importTicker.style.marginLeft || '(none)';
            console.log('align: current inline marginLeft =', currentInline);
          } else {
            console.log('align: negligible diff and no previous auto adjustment');
          }
    
        } catch (innerErr) {
          console.warn('align inner err', innerErr);
        }
      }, 220);
    } catch (err) {
      console.warn('alignImportToExportOnce error', err);
    }
  }
    
  window.addEventListener('load', alignImportToExportOnce);
  document.addEventListener('DOMContentLoaded', () => setTimeout(alignImportToExportOnce, 260));
    
  let __alignTimer;
  window.addEventListener('resize', () => {
    clearTimeout(__alignTimer);
    __alignTimer = setTimeout(alignImportToExportOnce, 160);
  });
  window.addEventListener('orientationchange', () => {
    clearTimeout(__alignTimer);
    __alignTimer = setTimeout(alignImportToExportOnce, 220);
  });

/* ----------------------------
    Contact Form
    ---------------------------- */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Replace the old input retrieval line:
// const countrySel = document.getElementById('country');

// ...

// Lines 129 onwards in the event listener:
const nameInput = document.getElementById('name');
const countryInput = document.getElementById('countryname'); // <-- NEW NAME USED HERE
const countryCodeInput = document.getElementById('countryCode');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Lines 135 onwards (the value assignments):
const name = nameInput?.value?.trim() || '';
const phone = phoneInput?.value?.trim() || '';
const email = emailInput?.value?.trim() || '';
const message = messageInput?.value?.trim() || '';
const country = countryInput?.value?.trim() || ''; // <-- USE NEW NAME HERE
const countryCode = countryCodeInput?.value?.trim() || '';

// ...

// Lines 150 onwards (the validation checks):


    // --- START VALIDATION ---
    console.log('Form submission attempted.');
    console.log('Values:', { name, country, countryCode, phone, email, message });

    // 1. Required Check (If this fails, it means one variable is an empty string "")
    if (!name || !phone || !email || !country || !countryCode || !message) {
        console.error('Validation Failed: Missing required field.');
        alert('Please fill in all fields before sending the message.');
        return;
    }
    
    // 2. HTML validity checks (Native pattern checks)
    if (nameInput && !nameInput.checkValidity()) {
        console.error('Validation Failed: Invalid name format.');
        alert(nameInput.title || 'Invalid name format.');
        return;
    }
    if (phoneInput && !phoneInput.checkValidity()) {
        console.error('Validation Failed: Invalid phone format. Phone value:', phone);
        alert(phoneInput.title || 'Invalid phone format.');
        return;
    }
    if (countryInput && !countryInput.checkValidity()) {
        console.error('Validation Failed: Invalid country name format. Country value:', country);
        alert(country.title || 'Invalid country name format.');
        return;
    }
    if (countryCodeInput && !countryCodeInput.checkValidity()) {
        console.error('Validation Failed: Invalid country code format. Code value:', countryCode);
        alert(countryCodeInput.title || 'Invalid country code format.');
        return;
    }

    // 3. Custom Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error('Validation Failed: Invalid email regex match. Email value:', email);
        alert(emailInput?.title || 'Please enter a valid email address.');
        return;
    }

    // 4. Processing & Mailto
    let normalizedCode = countryCode;
    if (!normalizedCode.startsWith('+')) {
        normalizedCode = '+' + normalizedCode.replace(/[^0-9]/g, '');
    }

    const fullPhone = `${normalizedCode} ${phone}`;
    const subject = encodeURIComponent(`New enquiry from ${name} (${country})`);
    const body = encodeURIComponent(`Name: ${name}\nCountry: ${country}\nPhone: ${fullPhone}\nEmail: ${email}\n\nMessage:\n${message}`);

    console.log('Validation Passed. Attempting mailto...');
    
    window.location.href = `mailto:23b141@psgitech.ac.in?subject=${subject}&body=${body}`;
});

/* ----------------------------
    Nav link active highlight & contact scroll behavior
    ---------------------------- */
const currentPage = window.location.pathname.split("/").pop();

function setActiveLink(linkElements) {
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("is-active"));
    linkElements.forEach(l => l.classList.add("is-active"));
}

document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    link.classList.remove("is-active");

    if (
        (currentPage === "" && href.includes("index.html")) ||
        currentPage === href ||
        (currentPage.includes("index") && href.includes("index.html")) ||
        (currentPage.includes("imports") && href.includes("imports.html")) ||
        (currentPage.includes("exports") && href.includes("exports.html"))
    ) {
        link.classList.add("is-active");
    }
});

// Scroll tracker to mark contact nav active on homepage
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    const contactSection = document.querySelector("#contact");
    const homeLink = document.querySelectorAll('.nav-link[href="index.html"], .nav-link[href="./index.html"], .nav-link[href="/"]');
    const contactLink = document.querySelectorAll('.nav-link[href*="#contact"]');

    if (contactSection && contactLink.length && homeLink.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const rect = contactSection.getBoundingClientRect();
                
                if (entry.isIntersecting) {
                    setActiveLink(contactLink);
                } else if (rect.top > 0) {
                    if (rect.top > window.innerHeight * 0.6) {
                            setActiveLink(homeLink);
                    }
                }
            });
        }, { 
            root: null, 
            threshold: [0, 0.4]
        });
        
        observer.observe(contactSection);

        const rect = contactSection.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
            setActiveLink(homeLink);
        }
    }
}

// Smooth scroll for contact anchors on the homepage
document.querySelectorAll('.nav-link[href*="#contact"]').forEach(link => {
    link.addEventListener("click", e => {
        const target = document.querySelector("#contact");
        if (target && (window.location.pathname.includes("index.html") || window.location.pathname === "/")) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
            setActiveLink(document.querySelectorAll('.nav-link[href*="#contact"]'));
            if (window.innerWidth <= 900) hideSidebar();
        }
    });
});

/* ===============================
    MOBILE GLOBE REPOSITIONING
    =============================== */
(function() {
    const MOBILE_MAX = 768;
    const globeSelector = '.globe-container, .globe-wrap';
    const originalLocations = new WeakMap();

    function insertAfter(newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode) {
            if (referenceNode.nextSibling) referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
            else referenceNode.parentNode.appendChild(newNode);
        } else {
            document.body.appendChild(newNode);
        }
    }

    function moveGlobeForMobile() {
        const globe = document.querySelector(globeSelector);
        if (!globe) return;
        const isMobile = window.innerWidth <= MOBILE_MAX;

        if (!originalLocations.has(globe)) {
            originalLocations.set(globe, { parent: globe.parentNode, next: globe.nextSibling });
        }

        if (isMobile) {
            const searchCandidates = [
                '.site-header .search-bar', '.site-header .header-search', '.site-header #search',
                '.site-header .search-input', '.search-bar', '#search', '.header-search'
            ];
            let anchor = null;
            for (const sel of searchCandidates) {
                const el = document.querySelector(sel);
                if (el) { anchor = el; break; }
            }
            if (!anchor) anchor = document.querySelector('.site-header');

            if (anchor) {
                insertAfter(globe, anchor);
            } else {
                const hero = document.querySelector('.hero');
                if (hero) hero.insertBefore(globe, hero.firstChild);
                else document.body.insertBefore(globe, document.body.firstChild);
            }

            globe.classList.add('globe-container--moved');
        } else {
            const info = originalLocations.get(globe);
            if (info && info.parent) {
                if (info.next && info.next.parentNode === info.parent) {
                    info.parent.insertBefore(globe, info.next);
                } else {
                    info.parent.appendChild(globe);
                }
            }
            globe.classList.remove('globe-container--moved');
        }
    }

    window.__moveGlobeForMobile = moveGlobeForMobile;

    let t;
    function debouncedMove() {
        clearTimeout(t);
        t = setTimeout(() => {
            try { moveGlobeForMobile(); } catch (err) { /* ignore */ }
        }, 120);
    }
    window.addEventListener('resize', debouncedMove);
    window.addEventListener('orientationchange', debouncedMove);
})();

/* ------------------------------
    Mobile: contact padding adjust
    ------------------------------ */
    (function mobileContactPaddingAdjust() {
    const MOBILE_MAX = 640;

    function applyContactPadding() {
        try {
            const contactEl = document.querySelector('.contact');
            const headerEl = document.querySelector('.site-header');
            if (!contactEl || !headerEl) return;

            const w = window.innerWidth || document.documentElement.clientWidth;
            if (w > MOBILE_MAX) {
                contactEl.style.paddingTop = '';
                return;
            }

            const headerRect = headerEl.getBoundingClientRect();
            const buffer = 20;
            const computedTop = Math.ceil(headerRect.height + buffer);

            contactEl.style.paddingTop = computedTop + 'px';

            const fab = document.querySelector('.whatsapp-fab');
            if (fab) {
                fab.style.bottom = '12px';
                fab.style.zIndex = 110;
            }
        } catch (err) {
            console.warn('contact padding adjust err', err);
        }
    }

    let t;
    function debouncedApply() {
        clearTimeout(t);
        t = setTimeout(applyContactPadding, 80);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        applyContactPadding();
    } else {
        document.addEventListener('DOMContentLoaded', applyContactPadding);
    }
    window.addEventListener('resize', debouncedApply, { passive: true });
    window.addEventListener('orientationchange', debouncedApply);
})();

/* End of script.js */