/**
 * Resume Page Orchestrator
 */

import "../styles/variables.css";
import "../styles/editorial.css";

import profile from "../data/profile.js";
import { initSiteChrome } from "../modules/siteNav.js";

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("resume");
  initResumePage();
});

function initResumePage() {
  document.title = `Resume — ${profile.name} | ${profile.primaryPositioning}`;

  // Print button
  document.getElementById("printResumeBtn")?.addEventListener("click", () => {
    window.print();
  });
}
