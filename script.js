// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const hamburger = document.getElementById('hamburger');
const closeSidebar = document.getElementById('closeSidebar');

function openSidebar(){
    sidebar?.classList.add('open');
    overlay?.classList.add('show');
    hamburger?.setAttribute('aria-expanded','true');
    sidebar?.setAttribute('aria-hidden','false');
}
function hideSidebar(){
    sidebar?.classList.remove('open');
    overlay?.classList.remove('show');
    hamburger?.setAttribute('aria-expanded','false');
    sidebar?.setAttribute('aria-hidden','true');
}
hamburger?.addEventListener('click',openSidebar);
closeSidebar?.addEventListener('click',hideSidebar);
overlay?.addEventListener('click',hideSidebar);

// Year in footer
const y = document.getElementById('year');
if(y){ y.textContent = new Date().getFullYear(); }

// Intersection observer animations
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if(e.isIntersecting){
            e.target.classList.add('in-view');
            io.unobserve(e.target);
        }
    });
},{threshold:.16});
document.querySelectorAll('[data-animate]').forEach(el=>io.observe(el));

// Countries dropdown (minimal, client-side)
const countries = [
    'India','United States','United Kingdom','United Arab Emirates','Saudi Arabia','Turkey','Chile','Australia','Canada','China','France','Germany','Italy','Japan','Netherlands','Singapore','South Africa','Spain','Sri Lanka','Thailand','Vietnam','Nigeria','Ghana','Côte d\'Ivoire','Kenya','Tanzania','Uganda','Rwanda'
];
const countrySel = document.getElementById('country');
if(countrySel){
    countrySel.innerHTML = '<option value="" disabled selected>Select country</option>' + countries.map(c=>`<option>${c}</option>`).join('');
}

// Contact form handler -> build mailto and open client
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const country = countrySel ? countrySel.value : '';
    const message = document.getElementById('message').value.trim();
    if(!name || !phone || !email || !country || !message){
        alert('Please fill in all fields.');
        return;
    }
    const subject = encodeURIComponent(`New enquiry from ${name} (${country})`);
    const body = encodeURIComponent(`Name: ${name}\nCountry: ${country}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:info@rnsgroups.in?subject=${subject}&body=${body}`;
});

// Globe animation moved to globe.js (Three.js implementation)
// Highlight active nav link
// ====== NAVIGATION ACTIVE LINK DETECTION ======

// Highlight based on current page (for Import / Export / Home)
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
            // When contact section is visible
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("is-active"));
            contactLink.forEach(l => l.classList.add("is-active"));
          } else {
            // When contact section leaves viewport (scroll back up)
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

// ====== SIDEBAR MENU ACTIVE HIGHLIGHT ======
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




