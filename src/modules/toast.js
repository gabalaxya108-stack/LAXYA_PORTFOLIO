/**
 * Subtle non-intrusive notification toast
 */
let toastTimeout = null;

export function showToast(message, duration = 2500) {
  let toastEl = document.getElementById("toastNotice");
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.id = "toastNotice";
    toastEl.className = "toast-notice";
    document.body.appendChild(toastEl);
  }

  toastEl.textContent = message;
  toastEl.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, duration);
}
