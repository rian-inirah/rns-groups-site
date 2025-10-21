// script.js - Updated complete file
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
    // Focus the close button for accessibility
    document.getElementById('closeSidebar')?.focus();
}

function hideSidebar() {
    // Return focus to the hamburger for accessibility
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
   Country code mapping data
   (kept small here; you already have a full list)
   ---------------------------- */
const countryCodeData = [
    { name: 'India', code: '+91' }, { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' }, { name: 'United Arab Emirates', code: '+971' },
    { name: 'Saudi Arabia', code: '+966' }, { name: 'Australia', code: '+61' },
    { name: 'Singapore', code: '+65' }, { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' }, { name: 'Japan', code: '+81' }
];

const countrySel = document.getElementById('country');
const countryCodeHidden = document.getElementById('countryCodeHidden');
const countryCodeDisplay = document.getElementById('countryCodeDisplay');

// On DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Set default country if present in the select
    const defaultCountry = 'India';
    if (countrySel && countrySel.querySelector(`option[value="${defaultCountry}"]`)) {
        countrySel.value = defaultCountry;
        updateCountryCodeDisplay(defaultCountry);
    }

    // Auto-open sidebar details if a sub-link is active
    const detailsElement = document.querySelector('.sidebar-nav details');
    if (detailsElement) {
        const activeSubLink = detailsElement.querySelector('.sub-link.is-active');
        if (activeSubLink) detailsElement.open = true;
    }

    // Make globe canvas accessible (if present)
    const globeCanvas = document.querySelector('#globe-3d');
    if (globeCanvas) {
        globeCanvas.setAttribute('tabindex', '0');
        globeCanvas.setAttribute('role', 'img');
        if (!globeCanvas.getAttribute('aria-label')) {
            globeCanvas.setAttribute('aria-label', 'Interactive 3D globe. Use touch or mouse to rotate.');
        }
    }

    // Call mobile reposition once on load if the helper was attached below
    if (typeof window.__moveGlobeForMobile === 'function') {
        try { window.__moveGlobeForMobile(); } catch (err) { /* ignore */ }
    }
});

// Public: update displayed country code (called from onchange in HTML)
window.updateCountryCodeDisplay = function(countryName) {
    const data = countryCodeData.find(c => c.name === countryName);
    const code = data ? data.code : 'Code';
    if (countryCodeDisplay) countryCodeDisplay.textContent = code;
    if (countryCodeHidden) countryCodeHidden.value = data ? data.code : '';
};

/* ----------------------------
   Contact Form
   ---------------------------- */
function validateEmail(email) {
    // minimal check for '@'
    return typeof email === 'string' && email.includes('@');
}

const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';
    const country = countrySel?.value.trim() || '';
    const countryCode = countryCodeHidden?.value.trim() || '';

    // Required check
    if (!name || !phone || !email || !country || !countryCode || !message) {
        alert('Please fill in all fields before sending the message.');
        return;
    }

    // HTML validity checks (pattern etc.)
    if (nameInput && !nameInput.checkValidity()) {
        alert(nameInput.title || 'Invalid name format.');
        return;
    }
    if (phoneInput && !phoneInput.checkValidity()) {
        alert(phoneInput.title || 'Invalid phone format.');
        return;
        
    }
    // Using a more robust check for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert(emailInput?.title || 'Please enter a valid email address.');
        return;
    }

    const fullPhone = `${countryCode} ${phone}`;
    const subject = encodeURIComponent(`New enquiry from ${name} (${country})`);
    const body = encodeURIComponent(`Name: ${name}\nCountry: ${country}\nPhone: ${fullPhone}\nEmail: ${email}\n\nMessage:\n${message}`);

    // Mailto fallback (keeps behavior from original)
    window.location.href = `mailto:info@rnsgroups.in?subject=${subject}&body=${body}`;
});

/* ----------------------------
   Nav link active highlight & contact scroll behavior
   ---------------------------- */
const currentPage = window.location.pathname.split("/").pop();

// Function to set the active state on the correct link
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
                    // Contact section is visible
                    setActiveLink(contactLink);
                } else if (rect.top > 0) {
                    // User is scrolling *up* and the contact section is out of view (above 0)
                    // If the top of the contact section is above the viewport (i.e. we scrolled past it)
                    // we don't change anything, the previous logic handles that.
                    
                    // If the contact section is below a certain point of the viewport (e.g. 60% of screen height) 
                    // AND not intersecting, assume we're back in the "Home" or previous sections.
                    if (rect.top > window.innerHeight * 0.6) {
                         setActiveLink(homeLink);
                    }
                }
            });
        }, { 
            root: null, 
            threshold: [0, 0.4] // Observe when it enters/leaves completely (0) and when it's 40% visible (0.4)
        });
        
        observer.observe(contactSection);

        // Initial check to set home if we aren't in contact section on load
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
            // Close sidebar after click on mobile
            if (window.innerWidth <= 900) hideSidebar();
        }
    });
});

/* ===============================
   MOBILE GLOBE REPOSITIONING (EXPOSED API)
   - This function is attached to window.__moveGlobeForMobile
   - It moves the .globe-container (or .globe-wrap) below the header/search area on small screens
   - Restores it to original parent on larger screens
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

        // save original position once
        if (!originalLocations.has(globe)) {
            originalLocations.set(globe, { parent: globe.parentNode, next: globe.nextSibling });
        }

        if (isMobile) {
            // Try to find the header-search or fallback to site-header
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
                // fallback: put before hero or as first child of body
                const hero = document.querySelector('.hero');
                if (hero) hero.insertBefore(globe, hero.firstChild);
                else document.body.insertBefore(globe, document.body.firstChild);
            }

            globe.classList.add('globe-container--moved');
        } else {
            // restore original parent/position
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

    // expose function for other scripts to call and to avoid undefined errors
    window.__moveGlobeForMobile = moveGlobeForMobile;

    // run on resize and orientation change (debounced)
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

/* End of script.js */