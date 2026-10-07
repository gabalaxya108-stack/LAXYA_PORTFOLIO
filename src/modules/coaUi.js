/**
 * COA Learning Tool UI Controller
 * 
 * Manages dashboard tab switching, converter interactions,
 * real-time mathematical rendering, history and quick reference matrix.
 */

import {
  BASES,
  performConversion,
  getConversionHistory,
  saveConversionToHistory,
  clearConversionHistory,
  getQuickReferenceData
} from "./coaConverter.js";
import { showToast } from "./toast.js";

export function initCoaTool() {
  initDashboardTabs();
  initConverterForm();
  initQuickReferenceTable();
  renderHistoryList();
}

/**
 * COA Dashboard Tabs switching
 */
function initDashboardTabs() {
  const tabButtons = document.querySelectorAll(".coa-tab-btn");
  const panes = document.querySelectorAll(".coa-pane");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetPaneId = btn.getAttribute("data-tab");
      
      tabButtons.forEach(b => b.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add("active");
      }

      // If user navigated to history, refresh it
      if (targetPaneId === "coaPaneHistory") {
        renderHistoryList();
      }
    });
  });
}

/**
 * Converter Form Controls
 */
function initConverterForm() {
  const sourceSelect = document.getElementById("coaSourceBase");
  const targetSelect = document.getElementById("coaTargetBase");
  const swapBtn = document.getElementById("coaSwapBtn");
  const inputEl = document.getElementById("coaInputValue");
  const convertBtn = document.getElementById("coaConvertBtn");
  const resetBtn = document.getElementById("coaResetBtn");
  const copyBtn = document.getElementById("coaCopyResultBtn");
  const validationEl = document.getElementById("coaValidationMsg");
  const resultCard = document.getElementById("coaResultCard");
  const resultDisplay = document.getElementById("coaResultDisplay");
  const explanationCard = document.getElementById("coaExplanationCard");
  const explanationContainer = document.getElementById("coaExplanationSteps");

  let currentResultText = "";

  // Helper to clear errors
  function clearError() {
    inputEl.classList.remove("input-error");
    validationEl.classList.remove("visible");
    validationEl.innerHTML = "";
  }

  // Helper to show errors
  function showError(msg) {
    inputEl.classList.add("input-error");
    validationEl.innerHTML = `
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${msg}</span>
    `;
    validationEl.classList.add("visible");
  }

  // Clear error on user typing
  inputEl.addEventListener("input", () => {
    clearError();
  });

  // Enter key trigger
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runConversion();
    }
  });

  // Swap Bases Button
  swapBtn.addEventListener("click", () => {
    const prevSrc = sourceSelect.value;
    const prevTgt = targetSelect.value;
    sourceSelect.value = prevTgt;
    targetSelect.value = prevSrc;
    clearError();

    // If there's an input or existing result, convert
    if (currentResultText && !inputEl.value.trim()) {
      inputEl.value = currentResultText;
    }
    if (inputEl.value.trim()) {
      runConversion();
    }
  });

  // Main Conversion Action
  function runConversion() {
    clearError();
    const rawVal = inputEl.value;
    const src = sourceSelect.value;
    const tgt = targetSelect.value;

    const outcome = performConversion(rawVal, src, tgt);

    if (!outcome.success) {
      showError(outcome.error);
      resultCard.classList.remove("visible");
      explanationCard.style.display = "none";
      return;
    }

    currentResultText = outcome.output;

    // Display formatted result
    const srcCfg = outcome.sourceConfig;
    const tgtCfg = outcome.targetConfig;

    resultDisplay.innerHTML = `
      <span><code>${outcome.input}</code><sub>${srcCfg.radix}</sub></span>
      <span class="coa-hist-arrow">=</span>
      <span class="coa-result-val"><code>${outcome.output}</code><sub>${tgtCfg.radix}</sub></span>
    `;

    resultCard.classList.add("visible");

    // Render step-by-step mathematical derivation
    if (outcome.explanation) {
      explanationContainer.innerHTML = outcome.explanation.stepsHtml;
      explanationCard.style.display = "block";
    } else {
      explanationCard.style.display = "none";
    }

    // Save record to history
    saveConversionToHistory({
      input: outcome.input,
      sourceBase: src,
      targetBase: tgt,
      output: outcome.output,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    renderHistoryList();
  }

  convertBtn.addEventListener("click", runConversion);

  // Reset Button
  resetBtn.addEventListener("click", () => {
    inputEl.value = "";
    clearError();
    resultCard.classList.remove("visible");
    explanationCard.style.display = "none";
    currentResultText = "";
    inputEl.focus();
  });

  // Copy Result Button
  copyBtn.addEventListener("click", () => {
    if (!currentResultText) return;

    navigator.clipboard.writeText(currentResultText).then(() => {
      copyBtn.classList.add("copied");
      copyBtn.innerHTML = `
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Copied ✓</span>
      `;
      showToast(`Copied ${currentResultText} to clipboard`);

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.innerHTML = `
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy Result</span>
        `;
      }, 2000);
    }).catch(() => {
      showToast("Unable to copy to clipboard");
    });
  });

  // Run a default sample conversion on first view for immediate wow factor & educational demonstration
  inputEl.value = "101101";
  sourceSelect.value = "binary";
  targetSelect.value = "decimal";
  runConversion();
}

/**
 * Quick Reference Table rendering and live search
 */
function initQuickReferenceTable() {
  const tbody = document.getElementById("coaRefTableBody");
  const searchInput = document.getElementById("coaRefSearch");
  if (!tbody) return;

  const refData = getQuickReferenceData();

  function renderRows(items) {
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">No matching entries found.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(row => `
      <tr class="${row.isMilestone ? 'milestone-row' : ''}">
        <td><strong>${row.decimal}</strong></td>
        <td><code>${row.binary}</code></td>
        <td><code>${row.octal}</code></td>
        <td><code>${row.hexadecimal}</code></td>
        <td><small>${row.note}</small></td>
      </tr>
    `).join("");
  }

  renderRows(refData);

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderRows(refData);
        return;
      }
      const filtered = refData.filter(item => 
        item.decimal.includes(q) ||
        item.binary.includes(q) ||
        item.octal.includes(q) ||
        item.hexadecimal.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q)
      );
      renderRows(filtered);
    });
  }
}

/**
 * History List rendering and interaction
 */
function renderHistoryList() {
  const listContainer = document.getElementById("coaHistoryList");
  const countBadge = document.getElementById("coaHistCount");
  const clearBtn = document.getElementById("coaClearHistoryBtn");
  if (!listContainer) return;

  const history = getConversionHistory();

  if (countBadge) {
    countBadge.textContent = history.length.toString();
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      clearConversionHistory();
      renderHistoryList();
      showToast("Conversion history cleared");
    };
  }

  if (history.length === 0) {
    listContainer.innerHTML = `
      <div class="coa-empty-state">
        <svg class="coa-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <p>No conversions recorded yet. Perform conversions in the converter tab to see your history here.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = history.map((item, idx) => `
    <div class="coa-history-item" data-idx="${idx}" title="Click to reload this conversion into the converter">
      <div class="coa-hist-conv">
        <span><code>${item.input}</code><sub>${BASES[item.sourceBase]?.radix || item.sourceBase}</sub></span>
        <span class="coa-hist-arrow">→</span>
        <span><strong><code>${item.output}</code><sub>${BASES[item.targetBase]?.radix || item.targetBase}</sub></strong></span>
      </div>
      <div class="coa-hist-meta">
        <span>${item.timestamp}</span>
      </div>
    </div>
  `).join("");

  // Attach reload listeners to history items
  listContainer.querySelectorAll(".coa-history-item").forEach(el => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.getAttribute("data-idx"), 10);
      const record = history[idx];
      if (!record) return;

      const sourceSelect = document.getElementById("coaSourceBase");
      const targetSelect = document.getElementById("coaTargetBase");
      const inputEl = document.getElementById("coaInputValue");
      const convertBtn = document.getElementById("coaConvertBtn");

      if (sourceSelect && targetSelect && inputEl && convertBtn) {
        sourceSelect.value = record.sourceBase;
        targetSelect.value = record.targetBase;
        inputEl.value = record.input;

        // Switch to converter tab
        const converterTabBtn = document.querySelector('.coa-tab-btn[data-tab="coaPaneConverter"]');
        converterTabBtn?.click();

        // Run conversion
        convertBtn.click();
        showToast("Loaded conversion from history");
      }
    });
  });
}
