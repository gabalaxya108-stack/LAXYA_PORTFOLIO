/**
 * Premium Landing / Home Page Orchestrator
 */

import "../styles/variables.css";
import "../styles/editorial.css";
import "../styles/landing.css";

import profile from "../data/profile.js";
import projects from "../data/projects.js";
import achievements from "../data/achievements.js";
import { initSiteChrome } from "../modules/siteNav.js";

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("home");
  renderHomeContent();
  initLaunchButton();
  initBitAnimation();
  initMetricCounterAnimation();
});

function initLaunchButton() {
  const launchBtn = document.getElementById("launchPortfolioBtn");
  launchBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById("portfolioShowcase");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function renderHomeContent() {
  document.title = `${profile.name} — ${profile.heroHeadline}`;

  // 1. Render Featured Projects (Lead: CREST + Sub-grid)
  const projectsContainer = document.getElementById("homeFeaturedProjects");
  if (projectsContainer) {
    const leadProject = projects.find(p => p.id === "crest") || projects[0];
    const subProjects = projects.filter(p => p.id !== leadProject.id).slice(0, 4);

    projectsContainer.innerHTML = `
      <!-- Lead Project: CREST -->
      <article class="project-lead-showcase">
        <div>
          <div class="project-badge-strip">
            <span class="project-category-tag">01 / ${leadProject.category}</span>
            <span class="badge-chip status-${leadProject.statusType}">${leadProject.status}</span>
          </div>

          <h3 class="project-lead-title">${leadProject.name}</h3>
          <div class="project-lead-sub">${leadProject.subtitle}</div>

          <p class="project-lead-desc">
            ${leadProject.description}
          </p>

          <div class="project-key-contribution">
            <strong>Key Contribution:</strong> ${leadProject.keyContribution}
          </div>

          <div class="project-tech-pills">
            ${leadProject.technologies.map(tech => `<span class="tech-pill">${tech}</span>`).join("")}
          </div>

          <div class="project-ctas-row">
            <a href="/projects/" class="btn-editorial btn-editorial-primary" style="padding: 0.75rem 1.4rem; font-size: 0.875rem;">
              <span>Case Breakdown</span>
              <span class="arrow-icon" aria-hidden="true">→</span>
            </a>
            <a href="${leadProject.github}" target="_blank" rel="noopener noreferrer" class="btn-editorial btn-editorial-secondary" style="padding: 0.75rem 1.4rem; font-size: 0.875rem;">
              <span>GitHub / Code</span>
              <span class="arrow-icon" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div class="project-arch-blueprint">
          <div class="arch-blueprint-header">
            <span class="blueprint-tag">SYSTEM ARCHITECTURE BLUEPRINT</span>
            <span>ID: CREST-01</span>
          </div>

          <div class="blueprint-node-grid">
            <div class="blueprint-node">
              <span class="node-layer">01 / INGESTION</span>
              <span class="node-title">Multi-Source Portal</span>
              <span class="node-detail">Email · Web Form · Support Ticket</span>
            </div>

            <div class="blueprint-arrow-connector">↓</div>

            <div class="blueprint-node active-pulse">
              <span class="node-layer">02 / CORE ENGINE</span>
              <span class="node-title">NLP Classification &amp; Sentiment Analysis</span>
              <span class="node-detail">RoBERTa / DistilBERT · Triage &amp; Risk Matrix</span>
            </div>

            <div class="blueprint-arrow-connector">↓</div>

            <div class="blueprint-node">
              <span class="node-layer">03 / DISPATCH</span>
              <span class="node-title">Automated Escalation Dispatcher</span>
              <span class="node-detail">Tier-1 Agent Auto-Draft · Tier-2 Escalation</span>
            </div>
          </div>
        </div>
      </article>

      <!-- Sub-Grid: Additional Engineering Systems -->
      <div class="featured-sub-grid">
        ${subProjects.map((p, idx) => `
          <article class="project-sub-card">
            <div class="project-badge-strip">
              <span class="project-category-tag">0${idx + 2} / ${p.category}</span>
              <span class="badge-chip status-${p.statusType}">${p.status}</span>
            </div>
            <h4 class="project-sub-title">${p.name}</h4>
            <div class="project-sub-role">${p.subtitle}</div>
            <p class="project-sub-desc">${p.description}</p>
            <div class="project-tech-pills">
              ${p.technologies.slice(0, 4).map(t => `<span class="tech-pill">${t}</span>`).join("")}
            </div>
            <div class="project-ctas-row" style="margin-top: auto; padding-top: 1.25rem;">
              <a href="/projects/#${p.id}" class="btn-link-editorial">
                <span>View Project</span>
                <span class="arrow-icon" aria-hidden="true">→</span>
              </a>
              <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn-link-editorial" style="color: var(--text-muted);">
                <span>Code</span>
                <span class="arrow-icon" aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  // 2. Render Achievements Highlights
  const achievementsContainer = document.getElementById("homeAchievementsList");
  if (achievementsContainer) {
    achievementsContainer.innerHTML = achievements.map((ach, idx) => `
      <div class="achievement-editorial-card">
        <div class="achievement-meta-strip">
          <span class="achievement-idx">0${idx + 1} // ${ach.date || "VERIFIED"}</span>
          <span class="badge-chip">${ach.tag || "ACHIEVEMENT"}</span>
        </div>
        <h4 class="achievement-card-title">${ach.title}</h4>
        <div class="achievement-card-org">
          ${ach.link ? `<a href="${ach.link}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">${ach.organization} ↗</a>` : ach.organization}
        </div>
        <p class="achievement-card-desc">${ach.description}</p>
      </div>
    `).join("");
  }
}

/**
 * Sequential Technical Bit Animation for the COA Dark Section Preview
 */
function initBitAnimation() {
  const terminal = document.querySelector(".coa-technical-terminal");
  if (!terminal || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBitsSequence();
        observer.unobserve(terminal);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(terminal);
}

function animateBitsSequence() {
  const bitChips = document.querySelectorAll(".bit-chip");
  const weightsLine = document.getElementById("terminalWeightsMath");
  const finalResult = document.getElementById("terminalFinalResult");

  bitChips.forEach((chip, i) => {
    setTimeout(() => {
      chip.style.opacity = "1";
      chip.style.transform = "translateY(0)";
    }, i * 90);
  });

  setTimeout(() => {
    if (weightsLine) {
      weightsLine.style.opacity = "1";
      weightsLine.style.transform = "translateY(0)";
    }
  }, bitChips.length * 90 + 150);

  setTimeout(() => {
    if (finalResult) {
      finalResult.style.opacity = "1";
      finalResult.style.transform = "scale(1)";
    }
  }, bitChips.length * 90 + 350);
}

/**
 * Animated number reveal for credentials metrics
 */
function initMetricCounterAnimation() {
  const metricCards = document.querySelectorAll(".credential-spec-card, .metric-card");
  if (!metricCards.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("metric-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  metricCards.forEach(card => observer.observe(card));
}
