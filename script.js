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
    // Set focus on the first interactive element (or the close button) for accessibility
    document.getElementById('closeSidebar')?.focus();
}

function hideSidebar() {
    // FIX: Move focus OUT of the sidebar before setting aria-hidden="true"
    // Move focus back to the hamburger button that opened the menu
    hamburger?.focus(); 

    sidebar?.classList.remove('open');
    overlay?.classList.remove('show');
    hamburger?.setAttribute('aria-expanded', 'false');
    sidebar?.setAttribute('aria-hidden', 'true');
}

hamburger?.addEventListener('click', openSidebar);
closeSidebar?.addEventListener('click', hideSidebar);
overlay?.addEventListener('click', hideSidebar);

// Year in footer
const y = document.getElementById('year');
if (y) { y.textContent = new Date().getFullYear(); }

// Intersection observer animations
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
        }
    });
}, { threshold: .16 });
document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));


// --- Country Data for Code Lookup ---
// Note: Country list is now in HTML, this array is only for mapping Country Name to Code.
const countryCodeData = [
    { name: 'India', code: '+91' }, { name: 'United States', code: '+1' }, { name: 'United Kingdom', code: '+44' }, { name: 'United Arab Emirates', code: '+971' }, { name: 'Saudi Arabia', code: '+966' }, { name: 'Turkey', code: '+90' }, { name: 'Chile', code: '+56' }, { name: 'Australia', code: '+61' }, { name: 'Canada', code: '+1' }, { name: 'China', code: '+86' }, { name: 'France', code: '+33' }, { name: 'Germany', code: '+49' }, { name: 'Italy', code: '+39' }, { name: 'Japan', code: '+81' }, { name: 'Netherlands', code: '+31' }, { name: 'Singapore', code: '+65' }, { name: 'South Africa', code: '+27' }, { name: 'Spain', code: '+34' }, { name: 'Sri Lanka', code: '+94' }, { name: 'Thailand', code: '+66' }, { name: 'Vietnam', code: '+84' }, { name: 'Nigeria', code: '+234' }, { name: 'Ghana', code: '+233' }, { name: 'Côte d\'Ivoire', code: '+225' }, { name: 'Kenya', code: '+254' }, { name: 'Tanzania', code: '+255' }, { name: 'Uganda', code: '+256' }, { name: 'Rwanda', code: '+250' }, { name: 'Afghanistan', code: '+93' }, { name: 'Albania', code: '+355' }, { name: 'Algeria', code: '+213' }, { name: 'American Samoa', code: '+1684' }, { name: 'Angola', code: '+244' }, { name: 'Antigua and Barbuda', code: '+1268' }, { name: 'Argentina', code: '+54' }, { name: 'Armenia', code: '+374' }, { name: 'Aruba', code: '+297' }, { name: 'Austria', code: '+43' }, { name: 'Azerbaijan', code: '+994' }, { name: 'Bahamas', code: '+1242' }, { name: 'Bahrain', code: '+973' }, { name: 'Bangladesh', code: '+880' }, { name: 'Barbados', code: '+1246' }, { name: 'Belarus', code: '+375' }, { name: 'Belgium', code: '+32' }, { name: 'Belize', code: '+501' }, { name: 'Benin', code: '+229' }, { name: 'Bhutan', code: '+975' }, { name: 'Bolivia', code: '+591' }, { name: 'Bosnia and Herzegovina', code: '+387' }, { name: 'Botswana', code: '+267' }, { name: 'Brazil', code: '+55' }, { name: 'Brunei Darussalam', code: '+673' }, { name: 'Bulgaria', code: '+359' }, { name: 'Burkina Faso', code: '+226' }, { name: 'Burundi', 'code': '+257' }, { name: 'Cambodia', code: '+855' }, { name: 'Cameroon', code: '+237' }, { name: 'Cape Verde', code: '+238' }, { name: 'Cayman Islands', code: '+1345' }, { name: 'Central African Republic', code: '+236' }, { name: 'Chad', code: '+235' }, { name: 'Colombia', code: '+57' }, { name: 'Comoros', code: '+269' }, { name: 'Republic of Congo', code: '+242' }, { name: 'Croatia', code: '+385' }, { name: 'Cuba', code: '+53' }, { name: 'Curaçao', code: '+599' }, { name: 'Cyprus', code: '+357' }, { name: 'Czech Republic', code: '+420' }, { name: 'Democratic Republic of the Congo', code: '+243' }, { name: 'Denmark', code: '+45' }, { name: 'Djibouti', code: '+253' }, { name: 'Dominica', code: '+1767' }, { name: 'Dominican Republic', code: '+1809' }, { name: 'Ecuador', code: '+593' }, { name: 'Egypt', code: '+20' }, { name: 'El Salvador', code: '+503' }, { name: 'Equatorial Guinea', code: '+240' }, { name: 'Eritrea', code: '+291' }, { name: 'Estonia', code: '+372' }, { name: 'Ethiopia', code: '+251' }, { name: 'Faeroe Islands', code: '+298' }, { name: 'Falkland Islands', code: '+500' }, { name: 'Federated States of Micronesia', code: '+691' }, { name: 'Fiji', code: '+679' }, { name: 'Finland', code: '+358' }, { name: 'French Guiana', code: '+594' }, { name: 'French Polynesia', code: '+689' }, { name: 'Gabon', code: '+241' }, { name: 'The Gambia', code: '+220' }, { name: 'Georgia', code: '+995' }, { name: 'Greece', code: '+30' }, { name: 'Greenland', code: '+299' }, { name: 'Grenada', code: '+1473' }, { name: 'Guadeloupe', code: '+590' }, { name: 'Guam', code: '+1671' }, { name: 'Guatemala', code: '+502' }, { name: 'Guinea', code: '+224' }, { name: 'Guinea-Bissau', code: '+245' }, { name: 'Guyana', code: '+592' }, { name: 'Haiti', code: '+509' }, { name: 'Honduras', code: '+504' }, { name: 'Hungary', code: '+36' }, { name: 'Iceland', code: '+354' }, { name: 'Indonesia', code: '+62' }, { name: 'Iran', code: '+98' }, { name: 'Iraq', code: '+964' }, { name: 'Ireland', code: '+353' }, { name: 'Israel', code: '+972' }, { name: 'Italy', code: '+39' }, { name: 'Jamaica', code: '+1876' }, { name: 'Jordan', code: '+962' }, { name: 'Kazakhstan', code: '+7' }, { name: 'Kosovo', code: '+383' }, { name: 'Kuwait', code: '+965' }, { name: 'Kyrgyzstan', code: '+996' }, { name: 'Lao PDR', code: '+856' }, { name: 'Latvia', code: '+371' }, { name: 'Lebanon', code: '+961' }, { name: 'Lesotho', code: '+266' }, { name: 'Liberia', code: '+231' }, { name: 'Libya', code: '+218' }, { name: 'Lithuania', code: '+370' }, { name: 'Luxembourg', code: '+352' }, { name: 'Macedonia', code: '+389' }, { name: 'Madagascar', code: '+261' }, { name: 'Malawi', code: '+265' }, { name: 'Malaysia', code: '+60' }, { name: 'Mali', code: '+223' }, { name: 'Malta', code: '+356' }, { name: 'Martinique', code: '+596' }, { name: 'Mauritania', code: '+222' }, { name: 'Mauritius', code: '+230' }, { name: 'Mexico', code: '+52' }, { name: 'Micronesia', code: '+691' }, { name: 'Moldova', code: '+373' }, { name: 'Monaco', code: '+377' }, { name: 'Mongolia', code: '+976' }, { name: 'Montenegro', code: '+382' }, { name: 'Morocco', code: '+212' }, { name: 'Mozambique', code: '+258' }, { name: 'Myanmar', code: '+95' }, { name: 'Namibia', code: '+264' }, { name: 'Nepal', code: '+977' }, { name: 'New Caledonia', code: '+687' }, { name: 'New Zealand', code: '+64' }, { name: 'Nicaragua', code: '+505' }, { name: 'Niger', code: '+227' }, { name: 'Northern Mariana Islands', code: '+1670' }, { name: 'Norway', code: '+47' }, { name: 'Oman', code: '+968' }, { name: 'Pakistan', code: '+92' }, { name: 'Palau', code: '+680' }, { name: 'Palestine', code: '+970' }, { name: 'Panama', code: '+507' }, { name: 'Papua New Guinea', code: '+675' }, { name: 'Paraguay', code: '+595' }, { name: 'Peru', code: '+51' }, { name: 'Philippines', code: '+63' }, { name: 'Poland', code: '+48' }, { name: 'Portugal', code: '+351' }, { name: 'Puerto Rico', code: '+1787' }, { name: 'Qatar', code: '+974' }, { name: 'Reunion', code: '+262' }, { name: 'Romania', code: '+40' }, { name: 'Russian Federation', code: '+7' }, { name: 'Saint Lucia', code: '+1758' }, { name: 'Saint Vincent and the Grenadines', code: '+1784' }, { name: 'Samoa', code: '+685' }, { name: 'San Marino', code: '+378' }, { name: 'São Tomé and Principe', code: '+239' }, { name: 'Serbia', code: '+381' }, { name: 'Seychelles', code: '+248' }, { name: 'Sierra Leone', code: '+232' }, { name: 'Solomon Islands', code: '+677' }, { name: 'Somalia', code: '+252' }, { name: 'South Sudan', code: '+211' }, { name: 'Sudan', code: '+249' }, { name: 'Suriname', code: '+597' }, { name: 'Swaziland', code: '+268' }, { name: 'Sweden', code: '+46' }, { name: 'Switzerland', code: '+41' }, { name: 'Syria', code: '+963' }, { name: 'Taiwan', code: '+886' }, { name: 'Tajikistan', code: '+992' }, { name: 'Timor-Leste', code: '+670' }, { name: 'Togo', code: '+228' }, { name: 'Tonga', code: '+676' }, { name: 'Trinidad and Tobago', code: '+1868' }, { name: 'Tunisia', code: '+216' }, { name: 'Turkmenistan', code: '+993' }, { name: 'Turks and Caicos Islands', code: '+1649' }, { name: 'Ukraine', code: '+380' }, { name: 'Uruguay', code: '+598' }, { name: 'Uzbekistan', code: '+998' }, { name: 'Vanuatu', code: '+678' }, { name: 'Venezuela', code: '+58' }, { name: 'Western Sahara', code: '+212' }, { name: 'Yemen', code: '+967' }, { name: 'Zambia', code: '+260' }, { name: 'Zimbabwe', code: '+263' }
];

const countrySel = document.getElementById('country');
const countryCodeHidden = document.getElementById('countryCodeHidden');
const countryCodeDisplay = document.getElementById('countryCodeDisplay');

// Initialization function for country dropdown and code
document.addEventListener('DOMContentLoaded', () => {
    // Set a default selected value (e.g., India) and immediately update the code display
    const defaultCountry = 'India';
    if (countrySel && countrySel.querySelector(`option[value="${defaultCountry}"]`)) {
        countrySel.value = defaultCountry;
        updateCountryCodeDisplay(defaultCountry);
    }
    
    // Auto-open 'Products' dropdown if on imports/exports sub-page
    const detailsElement = document.querySelector('.sidebar-nav details');
    if (detailsElement) {
        const activeSubLink = detailsElement.querySelector('.sub-link.is-active');
        if (activeSubLink) {
            detailsElement.open = true;
        }
    }
});

// Function to auto-select and display country code (exposed globally for HTML onchange)
window.updateCountryCodeDisplay = function(countryName) {
    const data = countryCodeData.find(c => c.name === countryName);
    const code = data ? data.code : 'Code';
    
    // Update the visual display element
    if (countryCodeDisplay) {
        countryCodeDisplay.textContent = code;
    }
    
    // Update the hidden input for form submission
    if (countryCodeHidden) {
        countryCodeHidden.value = data ? data.code : '';
    }
}

// --- Validation Functions ---

function validateEmail(email) {
    // Email validation check for existence of '@' symbol
    return email.includes('@');
}


// Contact form handler -> build mailto and open client
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Field references
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const countryInput = countrySel;
    
    // Gather values (using trimmed value for required check)
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const country = countryInput ? countryInput.value.trim() : '';
    const countryCode = countryCodeHidden ? countryCodeHidden.value.trim() : '';
    const message = messageInput.value.trim();
    
    // --- 1. Mandatory Field Check (Required Fields) ---
    if (!name || !phone || !email || !country || !countryCode || !message) {
        alert('Please fill in all fields before sending the message.');
        return;
    }

    // --- 2. Input Integrity Check (Validation) ---
    
    // a) Name/Phone Pattern Check (using checkValidity for visual feedback)
    if (!nameInput.checkValidity()) {
        alert(nameInput.title); // Show the HTML pattern title
        return;
    }
    if (!phoneInput.checkValidity()) {
        alert(phoneInput.title); // Show the HTML pattern title
        return;
    }
    
    // b) Email '@' Symbol Check
    if (!validateEmail(email)) {
        alert(emailInput.title);
        return;
    }
    
    // All checks passed, proceed to send.
    const fullPhone = `${countryCode} ${phone}`; 
    const subject = encodeURIComponent(`New enquiry from ${name} (${country})`);
    const body = encodeURIComponent(`Name: ${name}\nCountry: ${country}\nPhone: ${fullPhone}\nEmail: ${email}\n\nMessage:\n${message}`);

    // Send data to company's email address via mailto link
    window.location.href = `mailto:info@rnsgroups.in?subject=${subject}&body=${body}`;
});

// Globe animation moved to globe.js (Three.js implementation)
// Highlight active nav link
// ====== NAVIGATION ACTIVE LINK DETECTION ======

const currentPage = window.location.pathname.split("/").pop();
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

// ====== CONTACT SECTION SCROLL TRACKER ======
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    const contactSection = document.querySelector("#contact");
    const homeLink = document.querySelectorAll('.nav-link[href="index.html"], .nav-link[href="./index.html"]');
    const contactLink = document.querySelectorAll('.nav-link[href*="#contact"]');

    if (contactSection && contactLink.length) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("is-active"));
                        contactLink.forEach(l => l.classList.add("is-active"));
                    } else {
                        const rect = contactSection.getBoundingClientRect();
                        if (rect.top > window.innerHeight * 0.6) {
                            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("is-active"));
                            homeLink.forEach(l => l.classList.add("is-active"));
                        }
                    }
                });
            },
            { root: null, threshold: 0.4 }
        );
        observer.observe(contactSection);
    }
}

// ====== SMOOTH SCROLL TO CONTACT ======
document.querySelectorAll('.nav-link[href*="#contact"]').forEach(link => {
    link.addEventListener("click", e => {
        const target = document.querySelector("#contact");
        if (target && window.location.pathname.includes("index.html")) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("is-active"));
            link.classList.add("is-active");
        }
    });
});

// ====== SIDEBAR MENU ACTIVE HIGHLIGHT & DROPDOWN AUTO-OPEN (NO CHANGES NEEDED HERE AS IT WAS ADDED TO DOMContentLoaded) ======
const sidebarLinks = document.querySelectorAll(".sidebar-nav .nav-link");
sidebarLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (currentPage.includes("imports") && href.includes("imports.html")) {
        link.classList.add("is-active");
    } else if (currentPage.includes("exports") && href.includes("exports.html")) {
        link.classList.add("is-active");
    } else if ((currentPage === "" || currentPage.includes("index")) && href.includes("index.html")) {
        link.classList.add("is-active");
    }
});