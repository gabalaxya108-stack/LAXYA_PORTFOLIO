/**
 * COA LAB — Interactive Laboratory Orchestrator
 * Connects Simulator 01 (Number Systems) & Simulator 02 (CPU Instruction Cycle)
 */

import "../styles/variables.css";
import "../styles/editorial.css";
import "../styles/coa.css";

import profile from "../data/profile.js";
import { initSiteChrome } from "../modules/siteNav.js";
import { convertNumber } from "../modules/coaConverter.js";
import { CpuSimulationEngine } from "../modules/cpuCycleSimulator.js";
import {
  processExpression,
  isValidExpression,
  collectVariables
} from "../modules/expressionSimulator.js";

document.addEventListener("DOMContentLoaded", () => {
  initSiteChrome("coa");
  initCoaLabPage();
});

function initCoaLabPage() {
  document.title = `COA Lab — Interactive Computer Architecture | ${profile.name}`;

  initNumberSystemConverter();
  initExpressionSimulator();
  initCpuSimulator();
}

/* ==========================================================================
   SIMULATOR 01: NUMBER SYSTEM CONVERTER
   ========================================================================== */
function initNumberSystemConverter() {
  const fromSelect = document.getElementById("numFromBase");
  const toSelect = document.getElementById("numToBase");
  const inputEl = document.getElementById("numInputVal");
  const convertBtn = document.getElementById("numConvertBtn");
  const resetBtn = document.getElementById("numResetBtn");
  const errorBanner = document.getElementById("numErrorBanner");
  const resultPanel = document.getElementById("numResultPanel");
  const answerVal = document.getElementById("numAnswerVal");
  const stepsContainer = document.getElementById("numStepsContainer");
  const whatHappenedEl = document.getElementById("numWhatHappened");
  const howEl = document.getElementById("numHow");
  const whyEl = document.getElementById("numWhy");

  if (!convertBtn || !inputEl) return;

  function runConversion() {
    const rawVal = inputEl.value;
    const fromBase = fromSelect.value;
    const toBase = toSelect.value;

    const res = convertNumber(rawVal, fromBase, toBase);

    if (!res.success) {
      if (errorBanner) {
        errorBanner.textContent = res.error;
        errorBanner.classList.add("active");
      }
      if (resultPanel) {
        resultPanel.classList.remove("active");
      }
      return;
    }

    // Success
    if (errorBanner) {
      errorBanner.classList.remove("active");
      errorBanner.textContent = "";
    }

    if (resultPanel) {
      resultPanel.classList.add("active");
    }

    if (answerVal) {
      answerVal.textContent = res.answerText;
    }

    if (stepsContainer) {
      stepsContainer.innerHTML = res.stepsHtml;
    }

    if (res.explanation) {
      if (whatHappenedEl) whatHappenedEl.textContent = res.explanation.whatHappened;
      if (howEl) howEl.textContent = res.explanation.how;
      if (whyEl) whyEl.textContent = res.explanation.why;
    }
  }

  // Convert trigger
  convertBtn.addEventListener("click", runConversion);

  // Enter key trigger
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runConversion();
    }
  });

  // Reset button
  resetBtn?.addEventListener("click", () => {
    fromSelect.value = "binary";
    toSelect.value = "decimal";
    inputEl.value = "101101";
    runConversion();
  });

  // Preset buttons (scoped to number converter)
  document.querySelectorAll("#sim-numbers .coa-preset-btn, .coa-preset-btn[data-from]").forEach(btn => {
    btn.addEventListener("click", () => {
      const from = btn.getAttribute("data-from");
      const to = btn.getAttribute("data-to");
      const val = btn.getAttribute("data-val");

      if (from) fromSelect.value = from;
      if (to) toSelect.value = to;
      if (val) inputEl.value = val;

      runConversion();
    });
  });

  // Dynamic placeholder on change
  fromSelect.addEventListener("change", () => {
    switch (fromSelect.value) {
      case "binary":
        inputEl.placeholder = "e.g. 101101 (only 0 and 1)";
        break;
      case "decimal":
        inputEl.placeholder = "e.g. 45 (digits 0 to 9)";
        break;
      case "octal":
        inputEl.placeholder = "e.g. 55 (digits 0 to 7)";
        break;
      case "hexadecimal":
        inputEl.placeholder = "e.g. 2D or FF (digits 0-9, A-F)";
        break;
    }
  });

  // Run once initially to display default
  runConversion();
}

/* ==========================================================================
   SIMULATOR 02: COA ARITHMETIC EXPRESSION SIMULATOR (SIMULATOR.git)
   ========================================================================== */
function initExpressionSimulator() {
  const expressionInput = document.getElementById("expression");
  const validateBtn = document.getElementById("validateBtn");
  const generateBtn = document.getElementById("generateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const messageBox = document.getElementById("messageBox");
  const variableSection = document.getElementById("variableSection");
  const variableInputs = document.getElementById("variableInputs");
  const results = document.getElementById("results");
  const postfixValue = document.getElementById("postfixValue");
  const variablesValue = document.getElementById("variablesValue");
  const formatCards = document.getElementById("formatCards");
  const comparisonTableBody = document.getElementById("comparisonTableBody");
  const presetBtns = document.querySelectorAll(".coa-expr-preset-btn");

  if (!expressionInput || !validateBtn) return;

  function showMessage(message, type) {
    if (!messageBox) return;
    messageBox.className = `coa-error-banner alert-${type}`;
    if (type === "danger") {
      messageBox.style.borderColor = "rgba(239, 68, 68, 0.4)";
      messageBox.style.color = "#f87171";
      messageBox.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
    } else {
      messageBox.style.borderColor = "rgba(52, 211, 153, 0.4)";
      messageBox.style.color = "#34d399";
      messageBox.style.backgroundColor = "rgba(16, 185, 129, 0.08)";
    }
    messageBox.textContent = message;
    messageBox.classList.remove("d-none");
  }

  function hideMessage() {
    if (!messageBox) return;
    messageBox.className = "coa-error-banner d-none";
    messageBox.textContent = "";
  }

  function resetForm() {
    expressionInput.value = "";
    if (variableSection) variableSection.classList.add("d-none");
    if (variableInputs) variableInputs.innerHTML = "";
    if (results) results.classList.add("d-none");
    hideMessage();
    presetBtns.forEach(b => b.classList.remove("active"));
  }

  function collectVariableValues() {
    const values = {};
    document.querySelectorAll("[data-variable-input]").forEach((input) => {
      const name = input.dataset.variableInput;
      const value = Number(input.value);
      values[name] = Number.isNaN(value) ? 1 : value;
    });
    return values;
  }

  function renderVariableInputs(variables) {
    if (!variableInputs || !variableSection) return;
    variableInputs.innerHTML = "";
    if (!variables || !variables.length) {
      variableSection.classList.add("d-none");
      return;
    }
    variableSection.classList.remove("d-none");
    variables.forEach((variable) => {
      const box = document.createElement("div");
      box.className = "coa-var-input-box";
      box.innerHTML = `
        <label class="coa-var-input-label" for="var_input_${variable}">${variable} =</label>
        <input type="number" id="var_input_${variable}" class="coa-input" data-variable-input="${variable}" value="1" min="0" style="padding: 0.5rem 0.75rem;" />
      `;
      const inputEl = box.querySelector("input");
      inputEl.addEventListener("input", () => {
        executeSimulationOnly();
      });
      variableInputs.appendChild(box);
    });
  }

  function renderResults(data) {
    if (!data.success) {
      showMessage(data.error, "danger");
      if (results) results.classList.add("d-none");
      return;
    }

    if (postfixValue) postfixValue.textContent = data.postfix || "—";
    if (variablesValue) variablesValue.textContent = data.variables.join(", ") || "None";
    if (formatCards) {
      formatCards.innerHTML = "";
      data.formats.forEach((format) => {
        const card = document.createElement("div");
        card.className = "coa-format-card";
        card.innerHTML = `
          <div class="coa-format-card-header">
            <h3 class="coa-format-title">${format.name}</h3>
            <span class="coa-format-badge">${format.instructionCount} instructions</span>
          </div>
          <div>
            <strong style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase;">Generated Instructions:</strong>
            <pre class="coa-instructions-box">${format.instructions.join("\n")}</pre>
          </div>
          <div>
            <strong style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--font-mono); text-transform: uppercase;">Step-by-Step Simulation:</strong>
            <div class="coa-simulation-steps-wrap" style="margin-top: 0.5rem;">
              ${format.steps.map((step) => `
                <div class="coa-sim-step-item">
                  <span class="coa-sim-step-inst">${step.instruction}</span>
                  <span class="coa-sim-step-res">${step.result}</span>
                  <span class="coa-sim-step-state">${step.state.map((entry) => `${entry.name}=${entry.value}`).join(", ") || "State cleared"}</span>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="coa-format-meta-footer">
            <p><strong>Registers / Stack:</strong> ${format.registers}</p>
            <p><strong>Temporary Variables:</strong> ${format.temporaryVariables.join(", ")}</p>
            <p><strong>Final Result:</strong> <span style="color: #38bdf8; font-weight: 700;">${format.finalResult}</span></p>
          </div>
        `;
        formatCards.appendChild(card);
      });
    }

    if (comparisonTableBody) {
      comparisonTableBody.innerHTML = "";
      data.comparisonRows.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.name}</td>
          <td><span class="coa-format-badge">${row.instructionCount} instructions</span></td>
          <td>${row.registers}</td>
          <td>${row.temporaryVariables}</td>
          <td><strong style="color: #38bdf8;">${row.finalResultType}</strong></td>
        `;
        comparisonTableBody.appendChild(tr);
      });
    }

    if (results) results.classList.remove("d-none");
    showMessage("Expression validated and simulated successfully.", "success");
  }

  function executeSimulationOnly() {
    const expr = expressionInput.value.trim();
    if (!expr) return;
    const values = collectVariableValues();
    const data = processExpression(expr, values);
    if (data.success) {
      renderResults(data);
    }
  }

  function handleProcessExpression(validateOnly = false) {
    const expr = expressionInput.value.trim();
    if (!expr) {
      showMessage("Please enter an expression.", "danger");
      return;
    }

    if (!isValidExpression(expr)) {
      renderVariableInputs([]);
      if (results) results.classList.add("d-none");
      showMessage("Invalid expression. Use lowercase operands a-z, operators + - * /, and balanced parentheses.", "danger");
      return;
    }

    const currentValues = collectVariableValues();
    const vars = collectVariables(expr);
    renderVariableInputs(vars);

    // Retain existing user input values if available
    Object.keys(currentValues).forEach(k => {
      const input = document.querySelector(`[data-variable-input="${k}"]`);
      if (input) input.value = currentValues[k];
    });

    const values = collectVariableValues();
    const data = processExpression(expr, values);

    if (data.success) {
      renderResults(data);
    } else {
      renderVariableInputs([]);
      if (results) results.classList.add("d-none");
      showMessage(data.error, "danger");
    }
  }

  validateBtn?.addEventListener("click", () => handleProcessExpression(true));
  generateBtn?.addEventListener("click", () => handleProcessExpression(false));
  resetBtn?.addEventListener("click", resetForm);

  expressionInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleProcessExpression(false);
    }
  });

  // Expression presets
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const expr = btn.getAttribute("data-expr");
      if (expr) {
        expressionInput.value = expr;
        handleProcessExpression(false);
      }
    });
  });

  // Initial execution of default expression: a+b*(c-d)
  handleProcessExpression(false);
}

/* ==========================================================================
   SIMULATOR 03: CPU / INSTRUCTION SIMULATOR
   ========================================================================== */
function initCpuSimulator() {
  const engine = new CpuSimulationEngine("LOAD R1, 5");
  let playTimer = null;

  // Custom instruction input & presets
  const customInstInput = document.getElementById("customInstInput");
  const loadCustomInstBtn = document.getElementById("loadCustomInstBtn");
  const instErrorBanner = document.getElementById("instErrorBanner");
  const instPresets = document.querySelectorAll("#sim-cpu .coa-preset-btn, .coa-presets-wrap .coa-preset-btn[data-inst]");
  const instDesc = document.getElementById("instDesc");

  // Stepper controls
  const prevBtn = document.getElementById("cpuPrevBtn");
  const nextBtn = document.getElementById("cpuNextBtn");
  const playBtn = document.getElementById("cpuPlayBtn");
  const playIcon = document.getElementById("cpuPlayIcon");
  const playText = document.getElementById("cpuPlayText");
  const resetBtn = document.getElementById("cpuResetBtn");

  // Status badges
  const stepBadge = document.getElementById("cpuStepBadge");
  const phaseName = document.getElementById("cpuPhaseName");

  // Hardware components in diagram
  const compMemory = document.getElementById("comp-memory");
  const compCu = document.getElementById("comp-cu");
  const compReg = document.getElementById("comp-reg");
  const compAlu = document.getElementById("comp-alu");
  const compResult = document.getElementById("comp-result");

  // Arrows in diagram
  const arrowFetch = document.getElementById("arrow-fetch");
  const arrowDecode = document.getElementById("arrow-decode");
  const arrowExecute = document.getElementById("arrow-execute");
  const arrowStore = document.getElementById("arrow-store");

  // Live diagram values
  const valMemInst = document.getElementById("val-mem-inst");
  const chipCuStatus = document.getElementById("chip-cu-status");
  const valCuStatus = document.getElementById("val-cu-status");
  const valR1 = document.getElementById("val-r1");
  const valPc = document.getElementById("val-pc");
  const valIr = document.getElementById("val-ir");
  const valAluStatus = document.getElementById("val-alu-status");
  const valResultStatus = document.getElementById("val-result-status");

  // Snapshot strip values
  const stripPc = document.getElementById("stripPc");
  const stripIr = document.getElementById("stripIr");
  const stripR1 = document.getElementById("stripR1");
  const stripStatus = document.getElementById("stripStatus");

  // Explanation panel
  const whatHappeningEl = document.getElementById("cpuWhatHappening");
  const whyEl = document.getElementById("cpuWhy");
  const resultTextEl = document.getElementById("cpuResultText");

  function renderState() {
    const s = engine.getCurrentState();

    // 1. Badges & Stepper
    if (stepBadge) {
      stepBadge.textContent = s.stepNumber === 0 ? "READY" : `STEP ${s.stepNumber} / 4`;
    }
    if (phaseName) {
      phaseName.textContent = s.phase;
    }

    // 2. Buttons enable/disable
    if (prevBtn) {
      prevBtn.disabled = engine.currentStepIndex < 0;
    }
    if (nextBtn) {
      nextBtn.disabled = engine.isComplete();
      nextBtn.textContent = engine.isComplete() ? "COMPLETE ✓" : "NEXT STEP ▶";
    }

    // 3. Highlight diagram components
    [compMemory, compCu, compReg, compAlu, compResult].forEach(c => c?.classList.remove("active"));
    [arrowFetch, arrowDecode, arrowExecute, arrowStore].forEach(a => a?.classList.remove("active"));

    if (s.activeComponent) {
      const activeEl = document.getElementById(s.activeComponent);
      activeEl?.classList.add("active");
    }
    if (s.activeArrow) {
      const arrowEl = document.getElementById(s.activeArrow);
      arrowEl?.classList.add("active");
    }

    // 4. Update data values in diagram
    if (valMemInst) valMemInst.textContent = engine.instruction.assembly;
    if (valR1) valR1.textContent = s.state.r1;
    if (valPc) valPc.textContent = s.state.pc;
    if (valIr) valIr.textContent = s.state.ir;

    if (valCuStatus) {
      valCuStatus.textContent = s.phase === "DECODE"
        ? `Decoded: ${engine.instruction.opcode} | Ready to route`
        : `Status: ${s.phase === "READY" ? "Idle" : "Active"}`;
    }

    if (valAluStatus) {
      if (s.phase === "EXECUTE") {
        valAluStatus.textContent = s.state.status || "Computing...";
      } else {
        valAluStatus.textContent = "Operation: Ready";
      }
    }

    if (valResultStatus) {
      if (s.phase === "STORE") {
        valResultStatus.textContent = s.state.status || "Completed";
      } else {
        valResultStatus.textContent = "Waiting for execution cycle to complete.";
      }
    }

    // 5. Update snapshot strip
    if (stripPc) stripPc.textContent = s.state.pc;
    if (stripIr) stripIr.textContent = s.state.ir;
    if (stripR1) stripR1.textContent = s.state.r1;
    if (stripStatus) stripStatus.textContent = s.state.status;

    // 6. Update explanation panel
    if (whatHappeningEl) whatHappeningEl.textContent = s.whatIsHappening;
    if (whyEl) whyEl.textContent = s.why;
    if (resultTextEl) resultTextEl.textContent = s.result;
  }

  function pauseAutoPlay() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
    if (playIcon) playIcon.textContent = "▶";
    if (playText) playText.textContent = "PLAY";
  }

  function toggleAutoPlay() {
    if (playTimer) {
      pauseAutoPlay();
    } else {
      if (engine.isComplete()) {
        engine.reset();
        renderState();
      }
      if (playIcon) playIcon.textContent = "⏸";
      if (playText) playText.textContent = "PAUSE";

      playTimer = setInterval(() => {
        const hasNext = engine.nextStep();
        renderState();
        if (!hasNext) {
          pauseAutoPlay();
        }
      }, 1400);
    }
  }

  function applyInstruction(instructionStr) {
    pauseAutoPlay();
    const res = engine.loadInstruction(instructionStr);
    if (!res.success) {
      if (instErrorBanner) {
        instErrorBanner.textContent = res.error;
        instErrorBanner.classList.add("active");
      }
      return false;
    }

    // Success: Clear any error
    if (instErrorBanner) {
      instErrorBanner.classList.remove("active");
      instErrorBanner.textContent = "";
    }

    // Update input box to canonical assembly
    if (customInstInput) {
      customInstInput.value = engine.instruction.assembly;
    }

    // Update preset button active states
    instPresets.forEach(btn => {
      const pInst = (btn.getAttribute("data-inst") || btn.textContent).trim().toUpperCase();
      if (pInst === engine.instruction.assembly.toUpperCase()) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update description text
    if (instDesc && engine.instruction.description) {
      instDesc.textContent = engine.instruction.description;
    }

    renderState();
    return true;
  }

  // Stepper handlers
  nextBtn?.addEventListener("click", () => {
    pauseAutoPlay();
    engine.nextStep();
    renderState();
  });

  prevBtn?.addEventListener("click", () => {
    pauseAutoPlay();
    engine.prevStep();
    renderState();
  });

  playBtn?.addEventListener("click", toggleAutoPlay);

  resetBtn?.addEventListener("click", () => {
    pauseAutoPlay();
    engine.reset();
    renderState();
  });

  // Custom input trigger (button click)
  loadCustomInstBtn?.addEventListener("click", () => {
    if (customInstInput) {
      applyInstruction(customInstInput.value.trim());
    }
  });

  // Custom input trigger (Enter key)
  customInstInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyInstruction(customInstInput.value.trim());
    }
  });

  // Preset button handlers
  instPresets.forEach(btn => {
    btn.addEventListener("click", () => {
      const instStr = btn.getAttribute("data-inst") || btn.textContent.trim();
      applyInstruction(instStr);
    });
  });

  // Initial render
  renderState();
}
