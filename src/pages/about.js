/**
 * About Page Orchestrator — Personal & Technical Engineering Profile
 */

import "../styles/variables.css";
import "../styles/editorial.css";

import profile from "../data/profile.js";
import skillsData from "../data/skills.js";
import { initSiteChrome } from "../modules/siteNav.js";

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("about");
  renderAboutData();
});

function renderAboutData() {
  document.title = `About ${profile.name} — ${profile.heroHeadline}`;

  // 1. Core Domains of Exploration
  const focusContainer = document.getElementById("aboutFocusGrid");
  if (focusContainer && skillsData.interests) {
    focusContainer.innerHTML = skillsData.interests.map(item => `
      <div class="focus-domain-card">
        <div class="focus-domain-num">${item.number} / DOMAIN</div>
        <h3 class="focus-domain-title">${item.title}</h3>
        <p class="focus-domain-desc">${item.description}</p>
      </div>
    `).join("");
  }

  // 2. Structured Capability Matrix
  const progBox = document.getElementById("skillsProg");
  const coreBox = document.getElementById("skillsCore");
  const aiBox = document.getElementById("skillsAI");
  const toolsBox = document.getElementById("skillsTools");

  if (progBox) {
    progBox.innerHTML = [
      { name: "C", note: "Systems Foundations" },
      { name: "C++", note: "Active / DSA Practice" },
      { name: "Java", note: "Learning" },
      { name: "SQL", note: "Relational Queries" }
    ].map(s => `
      <span class="capability-pill">
        <span>${s.name}</span>
        <span class="capability-sub-tag">(${s.note})</span>
      </span>
    `).join("");
  }

  if (coreBox) {
    coreBox.innerHTML = [
      { name: "Data Structures & Algorithms", note: "DSA" },
      { name: "Object-Oriented Programming", note: "OOP" },
      { name: "Computer Organization & Architecture", note: "COA" },
      { name: "Discrete Mathematics", note: "Theory" }
    ].map(s => `
      <span class="capability-pill">
        <span>${s.name}</span>
        <span class="capability-sub-tag">(${s.note})</span>
      </span>
    `).join("");
  }

  if (aiBox) {
    aiBox.innerHTML = [
      { name: "Machine Learning", note: "Foundations" },
      { name: "Deep Learning", note: "Neural Networks" },
      { name: "Natural Language Processing", note: "NLP" },
      { name: "Generative AI", note: "LLMs / Transformers" },
      { name: "Google Gemini API", note: "Multimodal" }
    ].map(s => `
      <span class="capability-pill">
        <span>${s.name}</span>
        <span class="capability-sub-tag">(${s.note})</span>
      </span>
    `).join("");
  }

  if (toolsBox) {
    toolsBox.innerHTML = [
      { name: "Git", note: "Version Control" },
      { name: "GitHub / GitLab", note: "Collaboration" },
      { name: "Microsoft Azure", note: "AZ-900 & AI-900" },
      { name: "Streamlit", note: "Python UI" },
      { name: "VS Code", note: "Development" }
    ].map(s => `
      <span class="capability-pill">
        <span>${s.name}</span>
        <span class="capability-sub-tag">(${s.note})</span>
      </span>
    `).join("");
  }
}

