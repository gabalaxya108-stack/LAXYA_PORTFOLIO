/**
 * Achievements & Verified Credentials Page Orchestrator
 * Full keyboard-accessible lightbox, category cycling, and official certificate assets
 */

import "../styles/variables.css";
import "../styles/editorial.css";
import "../styles/gallery.css";

import profile from "../data/profile.js";
import galleryItems from "../data/gallery.js";
import { initSiteChrome } from "../modules/siteNav.js";

let currentFilteredItems = [];
let currentActiveIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("gallery");
  initGalleryPage();
});

function initGalleryPage() {
  document.title = `Achievements & Credentials | ${profile.name}`;

  currentFilteredItems = [...galleryItems];
  updateFilterCountBadges();
  renderEditorialGrid(currentFilteredItems);
  initFilterControls();
  initLightboxModal();
}

/**
 * Update numbers inside the category pills
 */
function updateFilterCountBadges() {
  const countAll = document.getElementById("countAll");
  const countHack = document.getElementById("countHack");
  const countCred = document.getElementById("countCred");

  if (countAll) countAll.textContent = galleryItems.length;
  if (countHack) countHack.textContent = galleryItems.filter(i => i.category === "HACKATHONS").length;
  if (countCred) countCred.textContent = galleryItems.filter(i => i.category === "CREDENTIALS").length;
}

/**
 * Minimal Blueprint for IDEA 2.0 National Semi-Finalist (Single CREST record)
 */
function getPlaceholderSvg(item) {
  return `
    <svg viewBox="0 0 540 340" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="gallery-card-thumb-svg" style="background:#090d16">
      <rect width="100%" height="100%" fill="#090d16"/>
      <rect x="24" y="24" width="492" height="292" rx="8" fill="#0f1626" stroke="#1e293b" stroke-width="1.2"/>
      <text x="270" y="80" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="1.5" text-anchor="middle">NATIONAL HACKATHON</text>
      <line x1="200" y1="95" x2="340" y2="95" stroke="#1e293b" stroke-width="1"/>
      <text x="270" y="150" fill="#f8fafc" font-size="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" text-anchor="middle">IDEA 2.0 SEMI-FINALIST</text>
      <text x="270" y="185" fill="#a5b4fc" font-size="12" font-family="'JetBrains Mono', monospace" font-weight="600" text-anchor="middle">CREST · Union Bank of India Challenge</text>
      <text x="270" y="245" fill="#64748b" font-size="11" font-family="'Inter', sans-serif" text-anchor="middle">K J Somaiya Institute of Management, Mumbai</text>
    </svg>
  `;
}

/**
 * Render the editorial grid
 */
function renderEditorialGrid(items) {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px dashed var(--border-medium); border-radius: var(--radius-md);">
        <h4 style="margin-bottom: 0.5rem;">No items found in this category</h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Switch filters above to view other verified milestones.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map((item, idx) => {
    const visualHtml = item.image
      ? `<img src="${item.image}" alt="${escapeHtml(item.altText || item.title)}" class="gallery-card-thumb-img" loading="lazy" />`
      : getPlaceholderSvg(item);

    return `
      <article class="gallery-item-card" data-index="${idx}" tabindex="0" role="button" aria-label="View ${escapeHtml(item.title)}">
        <div class="gallery-card-thumb-wrap">
          ${visualHtml}
        </div>
        <div class="gallery-card-body">
          <div class="gallery-card-meta-row">
            <span class="badge-chip" style="font-size: 0.72rem;">${escapeHtml(item.categoryBadge || item.category)}</span>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(item.year)}</span>
          </div>
          <div class="gallery-card-title-row">
            <h3 class="gallery-card-title">${escapeHtml(item.title)}</h3>
            <span class="gallery-arrow-icon" aria-hidden="true">→</span>
          </div>
          <p class="gallery-card-desc">
            ${escapeHtml(item.description)}
          </p>
        </div>
      </article>
    `;
  }).join("");

  // Attach click & enter triggers
  container.querySelectorAll(".gallery-item-card").forEach(card => {
    const idx = parseInt(card.getAttribute("data-index"), 10);
    card.addEventListener("click", () => openModalByIndex(idx));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModalByIndex(idx);
      }
    });
  });
}

/**
 * Filter controls
 */
function initFilterControls() {
  const pills = document.querySelectorAll(".gallery-filter-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-selected", "true");

      const cat = pill.getAttribute("data-category");
      if (cat === "ALL") {
        currentFilteredItems = [...galleryItems];
      } else {
        currentFilteredItems = galleryItems.filter(item => 
          item.category.toUpperCase() === cat
        );
      }
      renderEditorialGrid(currentFilteredItems);
    });
  });
}

/**
 * Full-screen accessible Lightbox Modal
 */
function initLightboxModal() {
  const backdrop = document.getElementById("galleryModalBackdrop");
  const closeBtn = document.getElementById("modalCloseBtn");
  const prevBtn = document.getElementById("modalPrevBtn");
  const nextBtn = document.getElementById("modalNextBtn");

  if (!backdrop) return;

  closeBtn?.addEventListener("click", closeModal);
  prevBtn?.addEventListener("click", prevItem);
  nextBtn?.addEventListener("click", nextItem);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (!backdrop.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowLeft") {
      prevItem();
    } else if (e.key === "ArrowRight") {
      nextItem();
    }
  });

  // Mobile Touch Swipe Handling
  let touchStartX = 0;
  let touchEndX = 0;

  backdrop.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  backdrop.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const deltaX = touchStartX - touchEndX;
    if (deltaX > 45) {
      nextItem();
    } else if (deltaX < -45) {
      prevItem();
    }
  }, { passive: true });
}

function openModalByIndex(idx) {
  if (idx < 0 || idx >= currentFilteredItems.length) return;
  currentActiveIndex = idx;
  updateModalContent();

  const backdrop = document.getElementById("galleryModalBackdrop");
  if (!backdrop) return;

  backdrop.classList.add("active");
  backdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function updateModalContent() {
  const item = currentFilteredItems[currentActiveIndex];
  if (!item) return;

  const counterEl = document.getElementById("modalCounter");
  const modalMetaCat = document.getElementById("modalMetaCategory");
  const modalMetaYear = document.getElementById("modalMetaYear");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const visualHolder = document.getElementById("modalVisualHolder");

  if (counterEl) {
    const padIndex = String(currentActiveIndex + 1).padStart(2, "0");
    const padTotal = String(currentFilteredItems.length).padStart(2, "0");
    counterEl.textContent = `${padIndex} / ${padTotal}`;
  }

  if (modalMetaCat) modalMetaCat.textContent = item.categoryBadge || item.category;
  if (modalMetaYear) modalMetaYear.textContent = item.year;
  if (modalTitle) modalTitle.textContent = item.title;
  if (modalDesc) modalDesc.textContent = item.description;

  if (visualHolder) {
    visualHolder.innerHTML = item.image
      ? `<img src="${item.image}" alt="${escapeHtml(item.altText || item.title)}" />`
      : getPlaceholderSvg(item);
  }
}

function prevItem() {
  if (currentFilteredItems.length <= 1) return;
  currentActiveIndex = (currentActiveIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length;
  updateModalContent();
}

function nextItem() {
  if (currentFilteredItems.length <= 1) return;
  currentActiveIndex = (currentActiveIndex + 1) % currentFilteredItems.length;
  updateModalContent();
}

function closeModal() {
  const backdrop = document.getElementById("galleryModalBackdrop");
  if (!backdrop) return;
  backdrop.classList.remove("active");
  backdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
