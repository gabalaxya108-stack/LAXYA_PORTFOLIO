/**
 * Floating Capsule Navigation, Theme & Global Scroll Reveal Orchestrator
 */

import profile from "../data/profile.js";
import { initTheme } from "./theme.js";

const NAV_ITEMS = [
  { id: "home", num: "01", label: "Home", href: "/" },
  { id: "about", num: "02", label: "About", href: "/about/" },
  { id: "projects", num: "03", label: "Projects", href: "/projects/" },
  { id: "coa", num: "04", label: "COA Lab", href: "/coa/" },
  { id: "gallery", num: "05", label: "Gallery", href: "/gallery/" },
  { id: "resume", num: "06", label: "Resume", href: "/resume/" },
  { id: "document", num: "07", label: "Document", href: "/document/" },
  { id: "contact", num: "08", label: "Contact", href: "/contact/" }
];

export function initSiteChrome(activePageId) {
  renderNavbarCapsule(activePageId);
  renderFooter();
  initTheme();
  bindScrollEffects();
  bindMobileDrawer();
  initScrollReveals();
}

function renderNavbarCapsule(activePageId) {
  const headerContainer = document.getElementById("siteHeader");
  if (!headerContainer) return;

  const linksHtml = NAV_ITEMS.map(item => {
    const isActive = item.id === activePageId;
    return `
      <li>
        <a href="${item.href}" class="nav-capsule-link ${isActive ? 'active' : ''}" data-nav="${item.id}">
          <span class="nav-num-badge">${item.num}</span>
          <span>${item.label}</span>
        </a>
      </li>
    `;
  }).join("");

  const mobileLinksHtml = NAV_ITEMS.map(item => {
    const isActive = item.id === activePageId;
    return `
      <li>
        <a href="${item.href}" class="mobile-drawer-link ${isActive ? 'active' : ''}">
          <span class="nav-num-badge">${item.num}</span>
          <span>${item.label}</span>
        </a>
      </li>
    `;
  }).join("");

  headerContainer.innerHTML = `
    <nav class="navbar-capsule" aria-label="Main Navigation">
      <!-- Monogram / Personal Brand -->
      <a href="/" class="brand-capsule" aria-label="Home">
        <span class="brand-badge">LG</span>
        <span style="font-weight: 700; letter-spacing: -0.02em;">${profile.name.toUpperCase()}</span>
      </a>

      <!-- Desktop Floating Links Capsule -->
      <ul class="nav-links-wrap" role="menubar">
        ${linksHtml}
      </ul>

      <!-- Action Controls -->
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button type="button" id="themeToggleBtn" class="theme-capsule-btn" aria-label="Toggle theme" title="Toggle theme">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <button type="button" id="mobileNavToggle" class="mobile-capsule-toggle" aria-label="Open navigation menu" aria-expanded="false">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Drawer -->
    <div id="mobileNavDrawer" class="mobile-nav-drawer" aria-label="Mobile Navigation">
      <ul class="mobile-drawer-links">
        ${mobileLinksHtml}
      </ul>
    </div>
  `;
}

function renderFooter() {
  const footerContainer = document.getElementById("siteFooter");
  if (!footerContainer) return;

  const year = new Date().getFullYear();

  footerContainer.innerHTML = `
    <div class="container">
      <div class="footer-main-row">
        <div>
          <div class="footer-big-name">${profile.name}</div>
          <p style="font-size: 1rem; color: var(--text-muted); max-width: 480px; margin-top: 0.4rem; line-height: 1.55;">
            ${profile.primaryPositioning} • ${profile.university} • ${profile.location}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.25rem;">
            <a href="${profile.github}" target="_blank" rel="noopener noreferrer" class="badge-chip">
              <span>GitHub</span>
            </a>
            <a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" class="badge-chip">
              <span>LinkedIn</span>
            </a>
            <a href="mailto:${profile.email}" class="badge-chip">
              <span>${profile.email}</span>
            </a>
          </div>
          <div style="margin-top: 1.5rem;">
            <a href="/contact/" class="btn-editorial-text" style="font-size: 1rem;">
              <span>Let's talk technology & intelligent systems</span>
              <span class="arrow-icon" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div class="footer-nav-columns">
          <div>
            <div class="footer-col-title">Navigation</div>
            <ul class="footer-col-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about/">About</a></li>
              <li><a href="/projects/">Projects</a></li>
              <li><a href="/coa/">COA Lab</a></li>
              <li><a href="/gallery/">Gallery</a></li>
              <li><a href="/resume/">Resume</a></li>
              <li><a href="/document/">Document</a></li>
              <li><a href="/contact/">Contact</a></li>
            </ul>
          </div>
          <div>
            <div class="footer-col-title">Academic & Track</div>
            <ul class="footer-col-links">
              <li><span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">UID: ${profile.uid}</span></li>
              <li><span style="font-size: 0.85rem; color: var(--text-muted);">${profile.branch}</span></li>
              <li><span style="font-size: 0.85rem; color: var(--text-muted);">${profile.year} · ${profile.semester}</span></li>
              <li><span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">CGPA: ${profile.cgpa} · Class of ${profile.graduation}</span></li>
              <li><span style="display:inline-flex; align-items:center; gap:0.4rem; color:var(--color-success); font-size:0.8rem; font-weight:600;"><span class="status-dot-pulse"></span> Active Engineering Track</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom-row">
        <div>© ${year} ${profile.name}. All academic rights reserved.</div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span>UID: ${profile.uid}</span>
          <a href="#top" style="color: var(--text-secondary); text-decoration: none; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.3rem;">Back to top ↑</a>
        </div>
      </div>
    </div>
  `;
}

function bindScrollEffects() {
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  }, { passive: true });
}

function bindMobileDrawer() {
  const toggle = document.getElementById("mobileNavToggle");
  const drawer = document.getElementById("mobileNavDrawer");
  if (!toggle || !drawer) return;

  toggle.addEventListener("click", () => {
    const isOpen = drawer.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.innerHTML = isOpen ? `
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ` : `
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    `;
  });
}

function initScrollReveals() {
  const elements = document.querySelectorAll(".reveal-init");
  if (elements.length === 0 || !("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(el => observer.observe(el));
}
