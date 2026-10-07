/**
 * Contact Page Orchestrator
 * Real-time direct email dispatch via FormSubmit with instant mailto fallback
 */

import "../styles/variables.css";
import "../styles/editorial.css";

import profile from "../data/profile.js";
import { initSiteChrome } from "../modules/siteNav.js";
import { showToast } from "../modules/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("contact");
  initContactPage();
});

function initContactPage() {
  document.title = `Contact — ${profile.name} | Let's Connect`;

  // Copy email button
  const copyBtn = document.getElementById("copyEmailBtn");
  copyBtn?.addEventListener("click", () => {
    navigator.clipboard.writeText(profile.email).then(() => {
      copyBtn.textContent = "Copied ✓";
      showToast(`Copied ${profile.email} to clipboard`);
      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 2000);
    });
  });

  // Contact Form
  const form = document.getElementById("contactEditorialForm");
  const feedback = document.getElementById("contactFormFeedback");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const submitText = document.getElementById("contactSubmitText");
  const submitArrow = document.getElementById("contactSubmitArrow");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("contactName");
    const emailEl = document.getElementById("contactEmail");
    const subjectEl = document.getElementById("contactSubject");
    const messageEl = document.getElementById("contactMessage");

    const name = nameEl?.value.trim();
    const email = emailEl?.value.trim();
    const subject = subjectEl?.value.trim();
    const message = messageEl?.value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showToast("Please enter a valid email address");
      return;
    }

    // Set loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = "SENDING...";
    if (submitArrow) submitArrow.style.display = "none";
    if (feedback) feedback.innerHTML = "";

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: subject || `Portfolio Inquiry from ${name}`,
          message: message,
          _replyto: email
        })
      });

      const data = await response.json().catch(() => null);

      if (response.ok && (data?.success === "true" || data?.success === true)) {
        // Successful automated dispatch
        if (feedback) {
          feedback.innerHTML = `
            <div style="padding: 1rem 1.25rem; background-color: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; border-radius: var(--radius-sm); font-size: 0.92rem; color: var(--text-primary); line-height: 1.5;">
              <strong style="color: #10b981;">✓ Message Delivered Successfully!</strong>
              <p style="margin: 0.35rem 0 0; color: var(--text-secondary); font-size: 0.88rem;">
                Your message has been dispatched directly to <strong>${profile.email}</strong>. Laxya will respond within 24–48 hours.
              </p>
            </div>
          `;
        }
        form.reset();
        showToast("Message sent to Laxya Gaba!");
      } else if (data?.message && data.message.includes("Activation")) {
        // Needs 1-time activation on FormSubmit
        if (feedback) {
          feedback.innerHTML = `
            <div style="padding: 1rem 1.25rem; background-color: rgba(99, 102, 241, 0.12); border: 1px solid var(--accent); border-radius: var(--radius-sm); font-size: 0.92rem; color: var(--text-primary); line-height: 1.5;">
              <strong style="color: var(--accent);">First-Time Activation Notice:</strong>
              <p style="margin: 0.35rem 0 0.75rem; color: var(--text-secondary); font-size: 0.88rem;">
                FormSubmit has sent a 1-click confirmation email to <strong>${profile.email}</strong> to activate direct delivery. Once clicked, all future submissions arrive automatically.
              </p>
              <a href="mailto:${profile.email}?subject=${encodeURIComponent(subject || 'Portfolio Inquiry — Laxya Gaba')}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}" class="btn-editorial btn-editorial-primary btn-sm" style="display: inline-flex; font-size: 0.8rem; padding: 0.4rem 0.85rem;">
                Open in Email App as Backup ↗
              </a>
            </div>
          `;
        }
        showToast("Activation email sent to Laxya's Gmail");
      } else {
        throw new Error(data?.message || "Gateway response error");
      }
    } catch (err) {
      // Fallback to mailto
      if (feedback) {
        feedback.innerHTML = `
          <div style="padding: 1rem 1.25rem; background-color: rgba(99, 102, 241, 0.1); border: 1px solid var(--accent); border-radius: var(--radius-sm); font-size: 0.9rem; color: var(--text-primary);">
            <strong>Direct Gateway Offline:</strong> Dispatch directly via your default email application:
            <div style="margin-top: 0.75rem;">
              <a href="mailto:${profile.email}?subject=${encodeURIComponent(subject || 'Portfolio Inquiry — Laxya Gaba')}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}" class="btn-editorial btn-editorial-primary btn-sm" style="display: inline-flex;">
                Open in Email Client ↗
              </a>
            </div>
          </div>
        `;
      }
      showToast("Email link prepared");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = "SEND MESSAGE";
      if (submitArrow) submitArrow.style.display = "inline";
    }
  });
}
