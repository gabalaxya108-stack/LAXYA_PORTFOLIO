/**
 * Contact Channels & Validation Controller
 */

import { showToast } from "./toast.js";

export function initContact() {
  // Clipboard copy buttons
  const copyButtons = document.querySelectorAll(".contact-copy-btn");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const origText = btn.textContent;
        btn.textContent = "Copied ✓";
        showToast(`Copied ${textToCopy} to clipboard`);
        setTimeout(() => {
          btn.textContent = origText;
        }, 2000);
      }).catch(() => {
        showToast("Unable to copy to clipboard");
      });
    });
  });

  // Contact form submission
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("contactFormFeedback");

  if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contactName")?.value.trim();
      const email = document.getElementById("contactEmail")?.value.trim();
      const subject = document.getElementById("contactSubject")?.value.trim();
      const message = document.getElementById("contactMessage")?.value.trim();

      if (!name || !email || !message) {
        showToast("Please fill in all required fields");
        return;
      }

      // Simple email pattern check
      if (!email.includes("@") || !email.includes(".")) {
        showToast("Please enter a valid email address");
        return;
      }

      formFeedback.innerHTML = `
        <strong>Message prepared!</strong> As this is an academic portfolio demonstration without an active email server, your message was formatted successfully.
        <div style="margin-top: 0.5rem;">
          <a href="mailto:student@university.edu?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}" class="btn btn-primary btn-sm" style="display:inline-flex;">
            Send via Mail Client
          </a>
        </div>
      `;
      formFeedback.className = "form-feedback success";

      contactForm.reset();
      showToast("Message formatted successfully!");
    });
  }
}
