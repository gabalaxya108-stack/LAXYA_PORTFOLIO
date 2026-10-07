/**
 * Dedicated Landing Page Orchestrator
 */

import "../styles/variables.css";
import "../styles/editorial.css";
import "../styles/landing.css";

import profile from "../data/profile.js";
import { initSiteChrome } from "../modules/siteNav.js";

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("");
  document.title = `${profile.name} — Welcome Portal · AI & LLM Engineer`;
});
