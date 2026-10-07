/**
 * Main Application Orchestrator
 */

import "./styles/variables.css";
import "./styles/main.css";
import "./styles/coa.css";
import "./styles/gallery.css";
import "./styles/components.css";

import { portfolioData } from "./data/portfolioData.js";
import { initTheme } from "./modules/theme.js";
import { initNavigation } from "./modules/navigation.js";
import { initCoaTool } from "./modules/coaUi.js";
import { initGallery } from "./modules/gallery.js";
import { initDocumentViewer } from "./modules/documentViewer.js";
import { initContact } from "./modules/contact.js";

document.addEventListener("DOMContentLoaded", () => {
  renderDynamicData();
  initTheme();
  initNavigation();
  initCoaTool();
  initGallery();
  initDocumentViewer();
  initContact();
});

/**
 * Populate dynamic fields from portfolioData into the DOM
 */
function renderDynamicData() {
  const p = portfolioData.personalInfo;

  // Set document title & metadata
  document.title = `${p.fullName} | Student Portfolio & Academic Showcase`;

  // Hero section identity
  setText("heroEyebrow", p.eyebrow);
  setText("heroName", p.headline);
  setText("heroProgram", p.subheadline);
  setText("heroTagline", p.tagline);
  setText("heroCardName", p.fullName);
  setText("heroCardRole", p.subheadline);
  setText("brandName", p.fullName);
  setText("brandMonogram", p.initials);
  setText("heroAvatarInitials", p.avatarPlaceholder);

  // Structured Personal Info Grid
  setText("infoUid", p.uid);
  setText("infoProgram", p.degree);
  setText("infoCollege", p.college);
  setText("infoUniversity", p.university);
  setText("infoTerm", `${p.year} / ${p.semester}`);
  setText("infoEmail", p.email);
  setText("infoLocation", p.location);

  // Contact section fields
  setText("contactEmailVal", p.email);
  setText("contactCollegeVal", p.college);
  setText("contactLocationVal", p.location);
  const emailCopyBtn = document.getElementById("copyEmailBtn");
  if (emailCopyBtn) emailCopyBtn.setAttribute("data-copy", p.email);

  // Footer identity
  setText("footerName", p.fullName);
  setText("footerMeta", `${p.degree} • UID: ${p.uid} • ${p.college}`);
  setText("footerCopyrightYear", new Date().getFullYear().toString());
  setText("footerCopyrightName", p.fullName);

  // Currently Focused On
  const focusContainer = document.getElementById("focusGrid");
  if (focusContainer) {
    focusContainer.innerHTML = portfolioData.currentlyFocused.map(f => `
      <div class="focus-card">
        <div class="focus-header">
          <span class="focus-tag">${f.tag}</span>
          <span class="focus-code">${f.code}</span>
        </div>
        <h3 class="focus-title">${f.title}</h3>
        <p class="focus-desc">${f.description}</p>
      </div>
    `).join("");
  }

  // Academic Metrics Row
  const metricsContainer = document.getElementById("metricsRow");
  if (metricsContainer) {
    metricsContainer.innerHTML = portfolioData.academicMetrics.map(m => `
      <div class="metric-item">
        <div class="metric-val">${m.value}</div>
        <div class="metric-label">${m.label}</div>
        <div class="metric-note">${m.note}</div>
      </div>
    `).join("");
  }

  // About Narrative
  setText("aboutIntro", portfolioData.aboutMe.introduction);
  setText("aboutSecondary", portfolioData.aboutMe.secondaryParagraph);

  // Academic Interests
  const interestsContainer = document.getElementById("interestsGrid");
  if (interestsContainer) {
    interestsContainer.innerHTML = portfolioData.aboutMe.academicInterests.map(item => `
      <div class="interest-card">
        <div class="interest-icon-box">
          ${getInterestIcon(item.icon)}
        </div>
        <div>
          <h4 class="interest-title">${item.title}</h4>
          <p class="interest-desc">${item.description}</p>
        </div>
      </div>
    `).join("");
  }

  // Future Goals
  const goalsContainer = document.getElementById("goalsList");
  if (goalsContainer) {
    goalsContainer.innerHTML = portfolioData.aboutMe.futureGoals.map(g => `
      <div class="goal-item">
        <div class="goal-badge">${g.period}</div>
        <h4 class="goal-title">${g.title}</h4>
        <p class="goal-desc">${g.description}</p>
      </div>
    `).join("");
  }

  // Education Timeline
  const eduContainer = document.getElementById("educationTimeline");
  if (eduContainer) {
    eduContainer.innerHTML = portfolioData.education.map(e => `
      <div class="education-card ${e.isCurrent ? 'current' : ''}">
        <div class="edu-header">
          <div>
            <h3 class="edu-institution">${e.institution}</h3>
            <div class="edu-degree">${e.degree}</div>
          </div>
          <span class="edu-years">${e.years}</span>
        </div>
        <div class="edu-status">${e.status} • ${e.university}</div>
        <div class="edu-highlights">${e.highlights}</div>
      </div>
    `).join("");
  }

  // Skills Section (Categorized chips)
  renderSkills();

  // Academic Document metadata
  const doc = portfolioData.academicDocument;
  setText("docTitle", doc.title);
  setText("docSummary", doc.summary);
  setText("docCourseCode", doc.courseCode);
  setText("docInstructor", doc.instructor);
  setText("docSemester", doc.semester);
  setText("docPageCount", doc.pageCount);
  setText("docFormat", doc.documentFormat);

  // Paper preview metadata
  setText("paperTitle", doc.title);
  setText("paperCourse", `${doc.courseCode} — ${doc.courseName}`);
  setText("paperAuthor", `Author: ${p.fullName} (UID: ${p.uid})`);
  setText("paperDate", `Academic Term: ${doc.submissionDate} | Faculty Evaluator: ${doc.instructor}`);

  // Resume card metadata
  const res = portfolioData.resume;
  setText("resumeTitle", res.title);
  setText("resumeSub", `${res.targetRole} • Updated ${res.lastUpdated}`);
}

function renderSkills() {
  const progContainer = document.getElementById("skillsProgramming");
  const csContainer = document.getElementById("skillsCs");
  const toolsContainer = document.getElementById("skillsTools");

  if (progContainer) {
    progContainer.innerHTML = portfolioData.skills.programming.map(s => `
      <span class="skill-chip">
        <span>${s.name}</span>
        <span class="skill-badge-level">${s.level}</span>
      </span>
    `).join("");
  }

  if (csContainer) {
    csContainer.innerHTML = portfolioData.skills.computerScience.map(s => `
      <span class="skill-chip">
        <span>${s.name}</span>
        <span class="skill-badge-level">${s.level}</span>
      </span>
    `).join("");
  }

  if (toolsContainer) {
    toolsContainer.innerHTML = portfolioData.skills.developmentTools.map(s => `
      <span class="skill-chip">
        <span>${s.name}</span>
        <span class="skill-badge-level">${s.level}</span>
      </span>
    `).join("");
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) {
    el.textContent = text;
  }
}

function getInterestIcon(type) {
  switch (type) {
    case "cpu":
      return `
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      `;
    case "binary":
      return `
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="10" y1="13" x2="14" y2="13"></line>
          <line x1="10" y1="17" x2="14" y2="17"></line>
        </svg>
      `;
    case "git-branch":
      return `
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="6" y1="3" x2="6" y2="15"></line>
          <circle cx="18" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <path d="M18 9a9 9 0 0 1-9 9"></path>
        </svg>
      `;
    case "code":
    default:
      return `
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      `;
  }
}
