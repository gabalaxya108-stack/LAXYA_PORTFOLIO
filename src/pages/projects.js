/**
 * Projects Page Orchestrator — Case-Study Archive & Engineering Systems
 */

import "../styles/variables.css";
import "../styles/editorial.css";

import profile from "../data/profile.js";
import projects from "../data/projects.js";
import { initSiteChrome } from "../modules/siteNav.js";

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("projects");
  initProjectsPage();
});

let currentFilter = "all";

function initProjectsPage() {
  document.title = `Projects — ${profile.name} | AI & LLM Engineering`;
  renderProjectsList();
  setupFilterHandlers();
}

function renderProjectsList() {
  const container = document.getElementById("projectsArchiveContainer");
  if (!container) return;

  const filtered = projects.filter(p => {
    if (currentFilter === "all") return true;
    if (currentFilter === "ai") return p.category.toLowerCase().includes("ai") || p.category.toLowerCase().includes("hackathon");
    if (currentFilter === "genai") return p.category.toLowerCase().includes("generative") || p.category.toLowerCase().includes("rag");
    if (currentFilter === "dl") return p.category.toLowerCase().includes("deep") || p.category.toLowerCase().includes("cv") || p.category.toLowerCase().includes("scientific");
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; color: var(--text-muted); font-family: var(--font-mono);">
        No systems found matching this domain filter.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    if (p.id === "crest") {
      return renderFeaturedCrestCard(p);
    } else {
      return renderStandardProjectCard(p);
    }
  }).join("");

  // Attach toggle handler for CREST collapsible case study
  setupCrestToggle();
}

/**
 * 01 / CREST: Primary Featured Case Study
 */
function renderFeaturedCrestCard(p) {
  return `
    <article class="project-case-card project-featured-case" id="${p.id}">
      <div class="case-header-bar">
        <span class="case-category-tag">01 / ${p.category} · ENTERPRISE GRIEVANCE TRIAGE</span>
        <span class="case-status-indicator status-semi">
          <span>●</span>
          <span>${p.status} · IDEA 2.0 (K J SOMAIYA, MUMBAI)</span>
        </span>
      </div>

      <div class="case-main-grid">
        <!-- Left: Narrative & Contribution -->
        <div>
          <h2 class="case-title">${p.name}</h2>
          <div class="case-subtitle">${p.subtitle}</div>

          <div class="case-role-line">
            ROLE: <strong>${p.role}</strong> · PARTNER CONTEXT: <strong>Union Bank of India</strong>
          </div>

          <p class="case-desc">
            An AI-assisted complaint resolution and escalation system developed for Union Bank of India during the IDEA 2.0 Hackathon. Automatically categorizes incoming customer grievances, measures escalation risk, and routes them to appropriate bank resolution tiers with minimal turnaround latency.
          </p>

          <div class="case-contribution-callout">
            <strong>Key Contribution:</strong> ${p.keyContribution}
          </div>

          <div class="case-tech-strip">
            ${p.technologies.map(t => `<span class="tech-pill">${t}</span>`).join("")}
            <span class="tech-pill" style="border-style: dashed;">Union Bank of India Context</span>
          </div>

          <div class="case-actions-row">
            <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn-editorial btn-editorial-primary" style="padding: 0.75rem 1.4rem;">
              <span>GitHub Repository</span>
              <span class="arrow-icon" aria-hidden="true">↗</span>
            </a>
            <button type="button" class="case-study-toggle-btn" id="crestToggleBtn" aria-expanded="false">
              <span>View Case Breakdown</span>
              <span class="toggle-icon">▾</span>
            </button>
          </div>
        </div>

        <!-- Right: Technical Snapshot Panel -->
        <div class="case-spec-sidebar">
          <div class="spec-sidebar-header">
            <span>SYSTEM DOSSIER // CREST-01</span>
          </div>
          <div class="case-spec-row">
            <span class="case-spec-k">COMPETITION VENUE</span>
            <span class="case-spec-v">IDEA 2.0 Hackathon (K J Somaiya Institute of Management, Mumbai)</span>
          </div>
          <div class="case-spec-row">
            <span class="case-spec-k">TARGET PROBLEM</span>
            <span class="case-spec-v">High-volume customer grievance sorting &amp; escalation delays</span>
          </div>
          <div class="case-spec-row">
            <span class="case-spec-k">VERIFIED OUTCOME</span>
            <span class="case-spec-v" style="color: var(--accent);">National Semi-Finalist</span>
          </div>
          <div class="case-spec-highlight">
            // End-to-end NLP triage architecture designed to minimize initial resolution turnaround.
          </div>
        </div>
      </div>

      <!-- Collapsible Detailed Case Study Breakdown -->
      <div class="case-study-collapsible">
        <div class="case-study-expanded-content" id="crestCaseStudyContent">
          <div class="case-study-deep-grid">
            <div class="case-deep-item">
              <span class="case-deep-num">01 / THE CHALLENGE</span>
              <h4 class="case-deep-title">Grievance Sorting Latency</h4>
              <p class="case-deep-body">
                Banking operations receive thousands of complaints across online and branch channels. Manual categorization creates resolution bottlenecks and risks delaying time-critical disputes.
              </p>
            </div>

            <div class="case-deep-item">
              <span class="case-deep-num">02 / TECHNICAL APPROACH</span>
              <h4 class="case-deep-title">Multi-Tier NLP Pipeline</h4>
              <p class="case-deep-body">
                Text parsing pipeline extracts core banking entities, scores urgency and emotional severity, and routes grievances directly to the appropriate bank resolution tier.
              </p>
            </div>

            <div class="case-deep-item">
              <span class="case-deep-num">03 / ARCHITECTURAL ROLE</span>
              <h4 class="case-deep-title">Triage Engine Design</h4>
              <p class="case-deep-body">
                Architected the core categorization rules, sentiment heuristics, and multi-department escalation dispatch tree to handle diverse incoming customer dispute types.
              </p>
            </div>

            <div class="case-deep-item">
              <span class="case-deep-num">04 / VERIFIED OUTCOME</span>
              <h4 class="case-deep-title">National Recognition</h4>
              <p class="case-deep-body">
                Recognized as Semi-Finalist at IDEA 2.0 Hackathon (Mumbai), evaluated by academic faculty and banking domain evaluators for practical viability.
              </p>
            </div>

            <div class="case-deep-item">
              <span class="case-deep-num">05 / ENGINEERING LEARNING</span>
              <h4 class="case-deep-title">Real-World Constraints</h4>
              <p class="case-deep-body">
                Learned that applying NLP in financial operations requires disciplined handling of edge cases, deterministic escalation rules, and low classification latency.
              </p>
            </div>

            <div class="case-deep-item">
              <span class="case-deep-num">06 / CODE &amp; ARTIFACTS</span>
              <h4 class="case-deep-title">Open Repositories</h4>
              <p class="case-deep-body">
                Core system architecture, data flow diagrams, and triage prototypes are open and verifiable on GitHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Standard Engineering Project Card
 */
function renderStandardProjectCard(p) {
  const statusClass = p.statusType === "success" ? "status-completed" : "status-progress";
  return `
    <article class="project-case-card" id="${p.id}">
      <div class="case-header-bar">
        <span class="case-category-tag">${p.number} / ${p.category}</span>
        <span class="case-status-indicator ${statusClass}">
          <span>●</span>
          <span>${p.status}</span>
        </span>
      </div>

      <div class="case-main-grid">
        <!-- Left: Narrative & Contribution -->
        <div>
          <h2 class="case-title">${p.name}</h2>
          <div class="case-subtitle">${p.subtitle}</div>

          <div class="case-role-line">
            ROLE: <strong>${p.role}</strong>
          </div>

          <p class="case-desc">
            ${p.description}
          </p>

          <div class="case-contribution-callout">
            <strong>Key Contribution:</strong> ${p.keyContribution}
          </div>

          <div class="case-tech-strip">
            ${p.technologies.map(t => `<span class="tech-pill">${t}</span>`).join("")}
          </div>

          <div class="case-actions-row">
            <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn-editorial btn-editorial-primary" style="padding: 0.75rem 1.4rem;">
              <span>GitHub Repository</span>
              <span class="arrow-icon" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <!-- Right: Technical Snapshot Panel -->
        <div class="case-spec-sidebar">
          <div class="spec-sidebar-header">
            <span>SYSTEM DOSSIER // ${p.id.toUpperCase()}</span>
          </div>
          <div class="case-spec-row">
            <span class="case-spec-k">CORE DOMAIN</span>
            <span class="case-spec-v">${p.category}</span>
          </div>
          <div class="case-spec-row">
            <span class="case-spec-k">LEAD CONTRIBUTION</span>
            <span class="case-spec-v">${p.role}</span>
          </div>
          <div class="case-spec-row">
            <span class="case-spec-k">VERIFIED STATUS</span>
            <span class="case-spec-v" style="color: #38bdf8;">${p.highlight}</span>
          </div>
          <div class="case-spec-highlight">
            // ${p.keyContribution}
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Filter Buttons Group Logic
 */
function setupFilterHandlers() {
  const filterBtns = document.querySelectorAll("#projectFilterGroup .filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter") || "all";
      renderProjectsList();
    });
  });
}

/**
 * Interactive Toggle for CREST Case Study Breakdown
 */
function setupCrestToggle() {
  const toggleBtn = document.getElementById("crestToggleBtn");
  const content = document.getElementById("crestCaseStudyContent");
  if (!toggleBtn || !content) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = content.classList.contains("is-open");
    if (isOpen) {
      content.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.innerHTML = `<span>View Case Breakdown</span> <span class="toggle-icon">▾</span>`;
    } else {
      content.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.innerHTML = `<span>Hide Case Breakdown</span> <span class="toggle-icon">▴</span>`;
    }
  });
}

