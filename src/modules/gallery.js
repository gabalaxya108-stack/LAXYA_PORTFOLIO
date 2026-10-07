/**
 * Gallery, Lightbox Modal & Achievements Manager
 */

import { portfolioData } from "../data/portfolioData.js";

let currentFilteredItems = [];
let currentModalIndex = 0;

export function initGallery() {
  currentFilteredItems = [...portfolioData.galleryItems];
  renderGalleryGrid(currentFilteredItems);
  initCategoryFilters();
  initLightboxModal();
  renderProjects();
  renderAchievements();
}

/**
 * Generate technical SVG illustrations for clean, unbroken placeholder visuals
 */
function getSvgIllustration(type, title) {
  switch (type) {
    case "coa-diagram":
      return `
        <svg viewBox="0 0 400 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect x="40" y="40" width="120" height="60" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
          <text x="100" y="75" fill="#f8fafc" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">INPUT: 101101₂</text>
          
          <path d="M 160 70 L 220 70" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)" />
          
          <rect x="220" y="30" width="140" height="80" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
          <text x="290" y="65" fill="#10b981" font-size="11" font-family="monospace" text-anchor="middle">∑ (d_i × 2^i)</text>
          <text x="290" y="85" fill="#f8fafc" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">OUTPUT: 45₁₀</text>

          <rect x="40" y="130" width="320" height="70" rx="6" fill="#172033" stroke="#334155" stroke-width="1.5"/>
          <text x="60" y="155" fill="#94a3b8" font-size="11" font-family="monospace">RADIX CONVERSION ENGINE</text>
          <text x="60" y="175" fill="#38bdf8" font-size="10" font-family="monospace">Base 2 (Binary) ⇄ Base 8 ⇄ Base 10 ⇄ Base 16</text>
        </svg>
      `;

    case "academic-sheet":
      return `
        <svg viewBox="0 0 400 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#1e293b">
          <rect width="100%" height="100%" fill="#0f172a" />
          <rect x="70" y="25" width="260" height="190" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
          <rect x="95" y="45" width="130" height="12" fill="#0f172a" rx="2"/>
          <rect x="95" y="65" width="210" height="6" fill="#94a3b8" rx="2"/>
          <rect x="95" y="78" width="180" height="6" fill="#cbd5e1" rx="2"/>
          <line x1="95" y1="98" x2="305" y2="98" stroke="#e2e8f0" stroke-width="2"/>
          <rect x="95" y="110" width="90" height="8" fill="#2563eb" rx="2"/>
          <rect x="95" y="126" width="210" height="5" fill="#cbd5e1" rx="2"/>
          <rect x="95" y="138" width="190" height="5" fill="#cbd5e1" rx="2"/>
          <rect x="95" y="150" width="160" height="5" fill="#cbd5e1" rx="2"/>
          <circle cx="275" cy="175" r="20" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
          <text x="275" y="179" fill="#2563eb" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">VERIFIED</text>
        </svg>
      `;

    case "certificate":
      return `
        <svg viewBox="0 0 400 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a">
          <rect x="30" y="20" width="340" height="200" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
          <rect x="40" y="30" width="320" height="180" rx="4" fill="none" stroke="#334155" stroke-dasharray="4 4"/>
          <text x="200" y="70" fill="#f59e0b" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle" letter-spacing="2">CERTIFICATE OF RECOGNITION</text>
          <text x="200" y="95" fill="#94a3b8" font-size="11" font-family="sans-serif" text-anchor="middle">DEPARTMENT OF COMPUTER SCIENCE</text>
          <line x1="120" y1="110" x2="280" y2="110" stroke="#f59e0b" stroke-width="1"/>
          <text x="200" y="135" fill="#f8fafc" font-size="13" font-family="sans-serif" font-weight="600" text-anchor="middle">Computer Architecture & Systems</text>
          <text x="200" y="155" fill="#64748b" font-size="10" font-family="sans-serif" text-anchor="middle">Academic Evaluation Demonstration</text>
          <circle cx="200" cy="185" r="14" fill="#f59e0b" opacity="0.2"/>
          <text x="200" y="189" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">★</text>
        </svg>
      `;

    case "hackathon":
      return `
        <svg viewBox="0 0 400 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0b0f19">
          <rect width="100%" height="100%" fill="#0b0f19" />
          <path d="M 60 120 L 120 60 L 280 60 L 340 120 L 280 180 L 120 180 Z" fill="#131c31" stroke="#3b82f6" stroke-width="2"/>
          <text x="200" y="115" fill="#f8fafc" font-size="18" font-family="sans-serif" font-weight="bold" text-anchor="middle">&lt;HACK /&gt;</text>
          <text x="200" y="140" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">SYSTEMS & TOOLS TRACK</text>
        </svg>
      `;

    case "event":
    default:
      return `
        <svg viewBox="0 0 400 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a">
          <rect width="100%" height="100%" fill="#0f172a"/>
          <circle cx="200" cy="90" r="45" fill="#1e293b" stroke="#818cf8" stroke-width="2"/>
          <path d="M 185 85 L 200 100 L 225 75" fill="none" stroke="#818cf8" stroke-width="3" stroke-linecap="round"/>
          <text x="200" y="160" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="600" text-anchor="middle">${title}</text>
          <text x="200" y="180" fill="#94a3b8" font-size="11" font-family="sans-serif" text-anchor="middle">Academic Presentation & Showcase</text>
        </svg>
      `;
  }
}

/**
 * Render Gallery Grid
 */
function renderGalleryGrid(items) {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-gallery-state">
        <svg class="empty-gallery-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <div class="empty-gallery-title">No items in this category</div>
        <p class="empty-gallery-sub">Items for this section will be added during coursework progression.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((item, index) => `
    <article class="gallery-card" data-index="${index}" tabindex="0" role="button" aria-label="View details for ${item.title}">
      <div class="gallery-thumbnail">
        ${getSvgIllustration(item.svgPlaceholderType, item.title)}
        <div class="gallery-thumb-overlay">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <span>View Details</span>
        </div>
      </div>
      <div class="gallery-info">
        <div class="gallery-header-row">
          <span class="gallery-category-badge">${item.category}</span>
          <span class="gallery-date">${item.date}</span>
        </div>
        <h3 class="gallery-title">${item.title}</h3>
        <p class="gallery-desc">${item.description}</p>
      </div>
    </article>
  `).join("");

  // Attach card click handlers for modal
  container.querySelectorAll(".gallery-card").forEach(card => {
    const handleOpen = () => {
      const idx = parseInt(card.getAttribute("data-index"), 10);
      openLightbox(idx);
    };

    card.addEventListener("click", handleOpen);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
    });
  });
}

/**
 * Filter Tabs
 */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");
      if (category === "ALL") {
        currentFilteredItems = [...portfolioData.galleryItems];
      } else {
        currentFilteredItems = portfolioData.galleryItems.filter(item => item.category === category);
      }

      renderGalleryGrid(currentFilteredItems);
    });
  });
}

/**
 * Lightbox Modal
 */
function initLightboxModal() {
  const modal = document.getElementById("galleryModal");
  const closeBtn = document.getElementById("galleryModalClose");
  const prevBtn = document.getElementById("galleryModalPrev");
  const nextBtn = document.getElementById("galleryModalNext");

  if (!modal) return;

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn?.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (currentFilteredItems.length === 0) return;
    currentModalIndex = (currentModalIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length;
    updateModalContent(currentFilteredItems[currentModalIndex]);
  });

  nextBtn?.addEventListener("click", () => {
    if (currentFilteredItems.length === 0) return;
    currentModalIndex = (currentModalIndex + 1) % currentFilteredItems.length;
    updateModalContent(currentFilteredItems[currentModalIndex]);
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowLeft") {
      prevBtn?.click();
    } else if (e.key === "ArrowRight") {
      nextBtn?.click();
    }
  });
}

function openLightbox(index) {
  const modal = document.getElementById("galleryModal");
  if (!modal || !currentFilteredItems[index]) return;

  currentModalIndex = index;
  updateModalContent(currentFilteredItems[currentModalIndex]);

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function updateModalContent(item) {
  const titleEl = document.getElementById("galleryModalTitle");
  const imageBox = document.getElementById("galleryModalImage");
  const catEl = document.getElementById("galleryModalCategory");
  const dateEl = document.getElementById("galleryModalDate");
  const descEl = document.getElementById("galleryModalDesc");
  const metaEl = document.getElementById("galleryModalMeta");

  if (titleEl) titleEl.textContent = item.title;
  if (imageBox) imageBox.innerHTML = getSvgIllustration(item.svgPlaceholderType, item.title);
  if (catEl) catEl.textContent = item.category;
  if (dateEl) dateEl.textContent = item.date;
  if (descEl) descEl.textContent = item.description;
  if (metaEl) metaEl.textContent = item.meta || "";
}

/**
 * Render Projects Showcase
 */
function renderProjects() {
  const container = document.getElementById("projectsGrid");
  if (!container) return;

  const projects = portfolioData.projects;
  if (!projects || projects.length === 0) {
    container.innerHTML = `
      <div class="empty-gallery-state">
        <p class="empty-gallery-title">Projects will be added here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(p => `
    <article class="project-card">
      <div class="project-header">
        <span class="project-category">${p.category}</span>
        <span class="project-status">${p.status}</span>
      </div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-tagline">${p.tagline}</p>

      <div class="project-section-block">
        <div class="project-label">Problem Addressed</div>
        <p class="project-text">${p.problemSolved}</p>
      </div>

      <div class="project-section-block">
        <div class="project-label">Key Architecture & Features</div>
        <ul class="project-features-list">
          ${p.keyFeatures.map(f => `<li>${f}</li>`).join("")}
        </ul>
      </div>

      <div class="project-tech-chips">
        ${p.technologies.map(t => `<span class="project-tech-chip">${t}</span>`).join("")}
      </div>

      <div class="project-actions">
        ${p.liveUrl ? `<a href="${p.liveUrl}" class="btn btn-primary btn-sm">Explore Feature</a>` : ""}
        ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Source Code</a>` : `<span class="badge badge-neutral" style="font-size: 0.75rem;">Source on University Portal</span>`}
      </div>
    </article>
  `).join("");
}

/**
 * Render Achievements
 */
function renderAchievements() {
  const container = document.getElementById("achievementsGrid");
  if (!container) return;

  const achievements = portfolioData.achievements;
  if (!achievements || achievements.length === 0) {
    container.innerHTML = `
      <div class="empty-gallery-state">
        <p class="empty-gallery-title">Achievements will be added here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = achievements.map(a => `
    <div class="achievement-card">
      <div class="achievement-badge-row">
        <span class="badge badge-accent">${a.category}</span>
        <span class="gallery-date">${a.date}</span>
      </div>
      <h3 class="achievement-title">${a.title}</h3>
      <div class="achievement-issuer">${a.issuer}</div>
      <p class="achievement-desc">${a.description}</p>
    </div>
  `).join("");
}
