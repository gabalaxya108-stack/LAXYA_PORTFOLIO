/**
 * COA Lab — Educational CPU Instruction Cycle Simulator Engine
 * Models the clean 4-step von Neumann pipeline:
 * MEMORY → FETCH → CONTROL UNIT (DECODE) → REGISTERS / ALU (EXECUTE) → RESULT (STORE)
 * 
 * Supports both predefined presets and dynamic user-entered custom instructions:
 * - LOAD R1, <number>
 * - ADD R1, <number>
 * - SUB R1, <number>
 * - STORE R1 [or STORE R1, <address>]
 */

export const PRESET_INSTRUCTIONS = [
  "LOAD R1, 5",
  "ADD R1, 3",
  "SUB R1, 2",
  "STORE R1"
];

/**
 * Parse any user-entered instruction string and dynamically generate
 * the exact 4-phase micro-operations, hardware highlights, and pedagogical explanations.
 */
export function parseAndBuildInstruction(rawInput, currentR1 = 0) {
  const cleaned = (rawInput || "").trim().toUpperCase().replace(/\s*,\s*/g, ", ");
  if (!cleaned) {
    return { success: false, error: "Please enter an assembly instruction (e.g. LOAD R1, 5)." };
  }

  // 1. LOAD R1, <value>
  const loadMatch = cleaned.match(/^LOAD\s+R1,\s*(-?\d+)$/i);
  if (loadMatch) {
    const val = parseInt(loadMatch[1], 10);
    return {
      success: true,
      instruction: {
        id: "custom_load",
        label: `LOAD R1, ${val}`,
        assembly: `LOAD R1, ${val}`,
        opcode: "LOAD",
        description: `Load immediate integer ${val} directly into register R1.`,
        initialState: { r1: currentR1, pc: "0x00", ir: "—", status: "Ready to fetch" },
        steps: [
          {
            stepNumber: 1,
            phase: "FETCH",
            label: "01 — FETCH",
            activeComponent: "comp-memory",
            activeArrow: "arrow-fetch",
            state: { r1: currentR1, pc: "0x01", ir: `LOAD R1, ${val}`, status: "Instruction fetched into IR" },
            whatIsHappening: `The CPU retrieves 'LOAD R1, ${val}' from Memory location 0x00 into the Instruction Register (IR). Program Counter increments to 0x01.`,
            why: "The CPU cannot act on code until it reads the opcode bits out of RAM into its internal Instruction Register.",
            result: `IR = 'LOAD R1, ${val}' | PC = 0x01`
          },
          {
            stepNumber: 2,
            phase: "DECODE",
            label: "02 — DECODE",
            activeComponent: "comp-cu",
            activeArrow: "arrow-decode",
            state: { r1: currentR1, pc: "0x01", ir: `LOAD R1, ${val}`, status: "Decoded by Control Unit" },
            whatIsHappening: `The Control Unit interprets opcode 'LOAD'. It identifies destination register R1 and immediate literal value ${val}.`,
            why: "The Control Unit translates binary instruction bits into electrical control signals for registers and buses.",
            result: `Instruction understood: Load immediate literal ${val} into destination R1.`
          },
          {
            stepNumber: 3,
            phase: "EXECUTE",
            label: "03 — EXECUTE",
            activeComponent: "comp-alu",
            activeArrow: "arrow-execute",
            state: { r1: currentR1, pc: "0x01", ir: `LOAD R1, ${val}`, status: `Routing operand ${val}` },
            whatIsHappening: `The internal CPU data path routes the immediate value ${val} toward the register input latches.`,
            why: "In a LOAD immediate instruction, the execution phase routes data directly through the internal CPU bus.",
            result: `Value ${val} is primed on internal bus for register write-back.`
          },
          {
            stepNumber: 4,
            phase: "STORE",
            label: "04 — STORE",
            activeComponent: "comp-reg",
            activeArrow: "arrow-store",
            state: { r1: val, pc: "0x01", ir: `LOAD R1, ${val}`, status: `Completed: R1 = ${val}` },
            whatIsHappening: `Register R1 latches and stores the value ${val}. The instruction execution is now complete.`,
            why: "The destination register holds the updated value ready for subsequent instructions to use.",
            result: `R1 = ${val} (Instruction Cycle Complete)`
          }
        ]
      }
    };
  }

  // 2. ADD R1, <value>
  const addMatch = cleaned.match(/^ADD\s+R1,\s*(-?\d+)$/i);
  if (addMatch) {
    const operand = parseInt(addMatch[1], 10);
    const startR1 = currentR1 === 0 ? 5 : currentR1;
    const finalR1 = startR1 + operand;
    return {
      success: true,
      instruction: {
        id: "custom_add",
        label: `ADD R1, ${operand}`,
        assembly: `ADD R1, ${operand}`,
        opcode: "ADD",
        description: `Add integer literal ${operand} to current value in register R1 (${startR1} + ${operand} = ${finalR1}).`,
        initialState: { r1: startR1, pc: "0x01", ir: "—", status: `Ready to fetch (R1 currently contains ${startR1})` },
        steps: [
          {
            stepNumber: 1,
            phase: "FETCH",
            label: "01 — FETCH",
            activeComponent: "comp-memory",
            activeArrow: "arrow-fetch",
            state: { r1: startR1, pc: "0x02", ir: `ADD R1, ${operand}`, status: "Instruction fetched into IR" },
            whatIsHappening: `The CPU reads 'ADD R1, ${operand}' from Memory location 0x01 into the Instruction Register. Program Counter advances to 0x02.`,
            why: "Every instruction begins with the identical fetch phase to pull machine code out of memory.",
            result: `IR = 'ADD R1, ${operand}' | PC = 0x02`
          },
          {
            stepNumber: 2,
            phase: "DECODE",
            label: "02 — DECODE",
            activeComponent: "comp-cu",
            activeArrow: "arrow-decode",
            state: { r1: startR1, pc: "0x02", ir: `ADD R1, ${operand}`, status: "Decoded by Control Unit" },
            whatIsHappening: `The Control Unit decodes 'ADD'. It directs the register file to feed R1 (${startR1}) and literal ${operand} into the ALU.`,
            why: "The Control Unit configures the ALU multiplexers and sets the operation code to ADD.",
            result: `Operands identified: Input A = R1 (${startR1}), Input B = ${operand}. Operation = Addition.`
          },
          {
            stepNumber: 3,
            phase: "EXECUTE",
            label: "03 — EXECUTE",
            activeComponent: "comp-alu",
            activeArrow: "arrow-execute",
            state: { r1: startR1, pc: "0x02", ir: `ADD R1, ${operand}`, status: `ALU computed: ${startR1} + ${operand} = ${finalR1}` },
            whatIsHappening: `The Arithmetic Logic Unit (ALU) performs integer addition: ${startR1} + ${operand} = ${finalR1}. Flags are updated.`,
            why: "The ALU is the calculation engine containing full adder logic circuits to compute results.",
            result: `ALU Output = ${finalR1}`
          },
          {
            stepNumber: 4,
            phase: "STORE",
            label: "04 — STORE",
            activeComponent: "comp-reg",
            activeArrow: "arrow-store",
            state: { r1: finalR1, pc: "0x02", ir: `ADD R1, ${operand}`, status: `Completed: R1 updated to ${finalR1}` },
            whatIsHappening: `The ALU result (${finalR1}) is written back into register R1, replacing its prior value (${startR1}).`,
            why: "Write-back commits the arithmetic calculation into the processor's register state.",
            result: `R1 = ${finalR1} (Instruction Cycle Complete)`
          }
        ]
      }
    };
  }

  // 3. SUB R1, <value>
  const subMatch = cleaned.match(/^SUB\s+R1,\s*(-?\d+)$/i);
  if (subMatch) {
    const operand = parseInt(subMatch[1], 10);
    const startR1 = currentR1 === 0 ? 10 : currentR1;
    const finalR1 = startR1 - operand;
    return {
      success: true,
      instruction: {
        id: "custom_sub",
        label: `SUB R1, ${operand}`,
        assembly: `SUB R1, ${operand}`,
        opcode: "SUB",
        description: `Subtract integer literal ${operand} from register R1 (${startR1} - ${operand} = ${finalR1}).`,
        initialState: { r1: startR1, pc: "0x01", ir: "—", status: `Ready to fetch (R1 contains ${startR1})` },
        steps: [
          {
            stepNumber: 1,
            phase: "FETCH",
            label: "01 — FETCH",
            activeComponent: "comp-memory",
            activeArrow: "arrow-fetch",
            state: { r1: startR1, pc: "0x02", ir: `SUB R1, ${operand}`, status: "Instruction fetched into IR" },
            whatIsHappening: `The CPU reads 'SUB R1, ${operand}' from Memory location 0x01 into the Instruction Register. Program Counter advances to 0x02.`,
            why: "Every instruction begins with the identical fetch phase to pull machine code out of memory.",
            result: `IR = 'SUB R1, ${operand}' | PC = 0x02`
          },
          {
            stepNumber: 2,
            phase: "DECODE",
            label: "02 — DECODE",
            activeComponent: "comp-cu",
            activeArrow: "arrow-decode",
            state: { r1: startR1, pc: "0x02", ir: `SUB R1, ${operand}`, status: "Decoded by Control Unit" },
            whatIsHappening: `The Control Unit decodes 'SUB'. It directs register R1 (${startR1}) and subtrahend ${operand} into the ALU.`,
            why: "The Control Unit configures the ALU complementer and sets the subtraction operation.",
            result: `Operands identified: Input A = R1 (${startR1}), Input B = ${operand}. Operation = Subtraction.`
          },
          {
            stepNumber: 3,
            phase: "EXECUTE",
            label: "03 — EXECUTE",
            activeComponent: "comp-alu",
            activeArrow: "arrow-execute",
            state: { r1: startR1, pc: "0x02", ir: `SUB R1, ${operand}`, status: `ALU computed: ${startR1} - ${operand} = ${finalR1}` },
            whatIsHappening: `The ALU performs binary integer subtraction: ${startR1} - ${operand} = ${finalR1}.`,
            why: "The ALU performs two's complement negation and addition to execute subtraction.",
            result: `ALU Output = ${finalR1}`
          },
          {
            stepNumber: 4,
            phase: "STORE",
            label: "04 — STORE",
            activeComponent: "comp-reg",
            activeArrow: "arrow-store",
            state: { r1: finalR1, pc: "0x02", ir: `SUB R1, ${operand}`, status: `Completed: R1 updated to ${finalR1}` },
            whatIsHappening: `The ALU result (${finalR1}) is written back into register R1.`,
            why: "Write-back updates the architectural register state to reflect the subtraction outcome.",
            result: `R1 = ${finalR1} (Instruction Cycle Complete)`
          }
        ]
      }
    };
  }

  // 4. STORE R1 [or STORE R1, [addr]]
  const storeMatch = cleaned.match(/^STORE\s+R1(?:\s*,\s*\[?(?:0X)?([0-9A-F]+)\]?)?$/i);
  if (storeMatch) {
    const addr = storeMatch[1] ? `[0x${storeMatch[1]}]` : "[0x0A]";
    const startR1 = currentR1 === 0 ? 8 : currentR1;
    return {
      success: true,
      instruction: {
        id: "custom_store",
        label: `STORE R1`,
        assembly: `STORE R1, ${addr}`,
        opcode: "STORE",
        description: `Write the current value of register R1 (${startR1}) into Memory location ${addr}.`,
        initialState: { r1: startR1, pc: "0x02", ir: "—", status: `Ready to fetch (R1 contains ${startR1})` },
        steps: [
          {
            stepNumber: 1,
            phase: "FETCH",
            label: "01 — FETCH",
            activeComponent: "comp-memory",
            activeArrow: "arrow-fetch",
            state: { r1: startR1, pc: "0x03", ir: `STORE R1, ${addr}`, status: "Instruction fetched into IR" },
            whatIsHappening: `The CPU fetches 'STORE R1, ${addr}' from Memory location 0x02 into the Instruction Register. Program Counter advances to 0x03.`,
            why: "Even memory-write operations must first be fetched as instructions into the CPU core.",
            result: `IR = 'STORE R1, ${addr}' | PC = 0x03`
          },
          {
            stepNumber: 2,
            phase: "DECODE",
            label: "02 — DECODE",
            activeComponent: "comp-cu",
            activeArrow: "arrow-decode",
            state: { r1: startR1, pc: "0x03", ir: `STORE R1, ${addr}`, status: "Decoded by Control Unit" },
            whatIsHappening: `The Control Unit decodes 'STORE'. It configures the Memory Write-Enable line and selects R1 as the data source.`,
            why: "The Control Unit switches the memory bus from Read mode to Write mode.",
            result: `Target configured: Destination = Memory ${addr}, Data Source = R1 (${startR1}).`
          },
          {
            stepNumber: 3,
            phase: "EXECUTE",
            label: "03 — EXECUTE",
            activeComponent: "comp-reg",
            activeArrow: "arrow-execute",
            state: { r1: startR1, pc: "0x03", ir: `STORE R1, ${addr}`, status: `Placing R1 value (${startR1}) on Data Bus` },
            whatIsHappening: `Register R1 outputs its value (${startR1}) onto the internal data bus headed toward memory.`,
            why: "Data travels from internal register flip-flops onto external bus lines.",
            result: `Data Bus = ${startR1} | Target Memory Address = ${addr}`
          },
          {
            stepNumber: 4,
            phase: "STORE",
            label: "04 — STORE",
            activeComponent: "comp-result",
            activeArrow: "arrow-store",
            state: { r1: startR1, pc: "0x03", ir: `STORE R1, ${addr}`, status: `Completed: Memory ${addr} = ${startR1}` },
            whatIsHappening: `Memory location ${addr} latches the value ${startR1}. The data is safely persisted in RAM.`,
            why: "Registers are temporary; storing to memory persists data across program execution.",
            result: `Memory ${addr} = ${startR1} (Instruction Cycle Complete)`
          }
        ]
      }
    };
  }

  return {
    success: false,
    error: `Unsupported instruction '${rawInput}'. Supported format: LOAD R1, <num> | ADD R1, <num> | SUB R1, <num> | STORE R1`
  };
}

/**
 * CPU Simulation State Engine
 */
export class CpuSimulationEngine {
  constructor(initialInstruction = "LOAD R1, 5") {
    this.currentR1 = 0;
    this.loadInstruction(initialInstruction);
  }

  loadInstruction(inputStr) {
    const parseRes = parseAndBuildInstruction(inputStr, this.currentR1);
    if (!parseRes.success) {
      return parseRes;
    }

    this.instruction = parseRes.instruction;
    this.currentStepIndex = -1; // Ready state
    return { success: true, instruction: this.instruction };
  }

  getCurrentState() {
    if (this.currentStepIndex < 0) {
      return {
        stepNumber: 0,
        totalSteps: 4,
        phase: "READY",
        label: "READY",
        activeComponent: null,
        activeArrow: null,
        state: this.instruction.initialState,
        whatIsHappening: `Instruction '${this.instruction.assembly}' is waiting in memory. Click 'Next Step' or 'Play' to begin.`,
        why: "The CPU clock is waiting to start the first Fetch cycle.",
        result: "Ready to run."
      };
    }

    const step = this.instruction.steps[this.currentStepIndex];
    return {
      ...step,
      totalSteps: 4
    };
  }

  nextStep() {
    if (this.currentStepIndex < 3) {
      this.currentStepIndex++;
      // If reached step 4, record updated R1 for next chained instruction
      if (this.currentStepIndex === 3) {
        this.currentR1 = this.instruction.steps[3].state.r1;
      }
      return true;
    }
    return false;
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      return true;
    } else if (this.currentStepIndex === 0) {
      this.currentStepIndex = -1;
      return true;
    }
    return false;
  }

  reset() {
    this.currentStepIndex = -1;
  }

  isComplete() {
    return this.currentStepIndex === 3;
  }
}
