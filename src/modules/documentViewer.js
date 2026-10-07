/**
 * Academic Document & Resume Viewer Manager
 */

import { portfolioData } from "../data/portfolioData.js";
import { showToast } from "./toast.js";

export function initDocumentViewer() {
  const toggleDocBtn = document.getElementById("toggleDocViewerBtn");
  const docViewerContainer = document.getElementById("docViewerContainer");
  const downloadDocBtn = document.getElementById("downloadDocBtn");
  const openNewTabBtn = document.getElementById("openDocNewTabBtn");

  const viewResumeBtn = document.getElementById("viewResumeBtn");
  const downloadResumeBtn = document.getElementById("downloadResumeBtn");
  const resumeModal = document.getElementById("resumeModal");
  const resumeModalClose = document.getElementById("resumeModalClose");

  // Toggle Embedded Document View
  if (toggleDocBtn && docViewerContainer) {
    toggleDocBtn.addEventListener("click", () => {
      const isHidden = docViewerContainer.style.display === "none" || !docViewerContainer.style.display;
      if (isHidden) {
        docViewerContainer.style.display = "block";
        toggleDocBtn.textContent = "Hide Embedded Document";
        docViewerContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        docViewerContainer.style.display = "none";
        toggleDocBtn.textContent = "View Embedded Document";
      }
    });
  }

  // Download Academic Document
  if (downloadDocBtn) {
    downloadDocBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Academic Document PDF download initiated");
      // Simulated academic PDF download blob or external link trigger
      const dummyBlob = new Blob([
        `COA-204 Academic Assignment Submission\nTitle: ${portfolioData.academicDocument.title}\nStudent: ${portfolioData.personalInfo.fullName}\nUID: ${portfolioData.personalInfo.uid}\nUniversity: ${portfolioData.personalInfo.university}\n`
      ], { type: "text/plain" });
      const url = URL.createObjectURL(dummyBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `COA204_Assignment_${portfolioData.personalInfo.uid}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Open Document in New Tab
  if (openNewTabBtn) {
    openNewTabBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Ensure viewer is open and show feedback
      if (docViewerContainer) {
        docViewerContainer.style.display = "block";
        if (toggleDocBtn) toggleDocBtn.textContent = "Hide Embedded Document";
        docViewerContainer.scrollIntoView({ behavior: "smooth" });
      }
      showToast("Document preview opened in dedicated viewport");
    });
  }

  // View Resume Modal
  if (viewResumeBtn && resumeModal) {
    viewResumeBtn.addEventListener("click", () => {
      resumeModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (resumeModalClose && resumeModal) {
    resumeModalClose.addEventListener("click", () => {
      resumeModal.classList.remove("active");
      document.body.style.overflow = "";
    });

    resumeModal.addEventListener("click", (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // Download Resume
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Resume download initiated");
      const dummyBlob = new Blob([
        `RESUME — ${portfolioData.personalInfo.fullName}\nProgram: ${portfolioData.personalInfo.degree}\nEmail: ${portfolioData.personalInfo.email}\nStatus: Student Portfolio Submission\n`
      ], { type: "text/plain" });
      const url = URL.createObjectURL(dummyBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Resume_${portfolioData.personalInfo.fullName.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}
