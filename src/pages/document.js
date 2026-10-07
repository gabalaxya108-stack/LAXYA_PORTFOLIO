/**
 * Academic Document & Coursework Page Orchestrator
 */

import "../styles/variables.css";
import "../styles/editorial.css";
import "../styles/document.css";

import profile from "../data/profile.js";
import { initSiteChrome } from "../modules/siteNav.js";

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("document");
  initDocPage();
});

function initDocPage() {
  document.title = `COA Academic Assignment — ${profile.name} (UID: ${profile.uid})`;

  // Fullscreen Handler
  const fullscreenBtn = document.getElementById("docFullscreenBtn");
  const viewer = document.getElementById("docViewerFrame");

  fullscreenBtn?.addEventListener("click", () => {
    if (!viewer) return;
    if (!document.fullscreenElement) {
      viewer.requestFullscreen().catch(() => {});
      fullscreenBtn.textContent = "Exit Fullscreen";
    } else {
      document.exitFullscreen();
      fullscreenBtn.textContent = "Fullscreen ⛶";
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (fullscreenBtn) {
      fullscreenBtn.textContent = document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen ⛶";
    }
  });
}
