/**
 * CPU Instruction Set Simulator Engine (0, 1, 2, 3-Address Architectures)
 * 
 * Based on Laxya Gaba's Computer Organization and Architecture SIMULATOR:
 * git@github.com:gabalaxya108-stack/SIMULATOR.git
 * 
 * Implements:
 * 1. Expression Validation (operands a-z, operators +,-,*,/, balanced parentheses)
 * 2. Infix to Postfix conversion (Shunting-yard algorithm with precedence)
 * 3. 3-Address Code Generation (Three-Address Code with temporary registers t1, t2...)
 * 4. 2-Address Code Generation (Register-memory architecture MOV R1, left; OP R1, right; MOV tn, R1)
 * 5. 1-Address Code Generation (Accumulator architecture LOAD left; OP right; STORE tn)
 * 6. 0-Address Code Generation (Stack machine PUSH a; PUSH b; OP; POP tn)
 * 7. Step-by-Step Cycle Simulation & State Tracking
 * 8. Microarchitecture Comparative Analysis
 */

export function isOperand(char) {
  return char >= 'a' && char <= 'z';
}

export function isOperator(char) {
  return char === '+' || char === '-' || char === '*' || char === '/';
}

export function getPrecedence(op) {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/') return 2;
  return 0;
}

/**
 * Validate arithmetic expression according to COA syntax rules
 */
export function validateExpression(rawExpr) {
  const expr = (rawExpr || "").trim().toLowerCase();
  if (!expr) {
    return { isValid: false, error: "Please enter an arithmetic expression (e.g., a+b*c)." };
  }

  let parenDepth = 0;
  let prevToken = "start"; // start, operand, operator, openParen, closeParen

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];

    if (/\s/.test(ch)) continue; // ignore spaces

    if (isOperand(ch)) {
      if (prevToken === "operand" || prevToken === "closeParen") {
        return { isValid: false, error: `Unexpected operand '${ch}' at position ${i + 1}. Missing operator.` };
      }
      prevToken = "operand";
    } else if (isOperator(ch)) {
      if (prevToken !== "operand" && prevToken !== "closeParen") {
        return { isValid: false, error: `Operator '${ch}' at position ${i + 1} lacks a preceding operand.` };
      }
      prevToken = "operator";
    } else if (ch === '(') {
      if (prevToken === "operand" || prevToken === "closeParen") {
        return { isValid: false, error: `Missing operator before opening parenthesis at position ${i + 1}.` };
      }
      parenDepth++;
      prevToken = "openParen";
    } else if (ch === ')') {
      if (parenDepth === 0 || prevToken === "operator" || prevToken === "openParen" || prevToken === "start") {
        return { isValid: false, error: `Unbalanced or misplaced closing parenthesis at position ${i + 1}.` };
      }
      parenDepth--;
      prevToken = "closeParen";
    } else {
      return { isValid: false, error: `Invalid character '${ch}' at position ${i + 1}. Use only lowercase variables a-z and operators + - * / ( ).` };
    }
  }

  if (parenDepth !== 0) {
    return { isValid: false, error: "Unbalanced parentheses. Ensure all open parentheses are closed." };
  }

  if (prevToken === "operator" || prevToken === "openParen") {
    return { isValid: false, error: "Expression cannot terminate with an operator or opening parenthesis." };
  }

  return { isValid: true, cleanExpression: expr.replace(/\s+/g, "") };
}

/**
 * Extract sorted unique variable names from expression
 */
export function extractVariables(expr) {
  const vars = new Set();
  for (const ch of expr) {
    if (isOperand(ch)) {
      vars.add(ch);
    }
  }
  return Array.from(vars).sort();
}

/**
 * Convert Infix Expression to Postfix using Shunting-Yard
 */
export function infixToPostfix(infix) {
  let postfix = "";
  const stack = [];

  for (const ch of infix) {
    if (isOperand(ch)) {
      postfix += ch;
    } else if (ch === '(') {
      stack.push(ch);
    } else if (ch === ')') {
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        postfix += stack.pop();
      }
      if (stack.length > 0 && stack[stack.length - 1] === '(') {
        stack.pop();
      }
    } else if (isOperator(ch)) {
      while (
        stack.length > 0 &&
        isOperator(stack[stack.length - 1]) &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(ch)
      ) {
        postfix += stack.pop();
      }
      stack.push(ch);
    }
  }

  while (stack.length > 0) {
    if (stack[stack.length - 1] !== '(') {
      postfix += stack.pop();
    } else {
      stack.pop();
    }
  }

  return postfix;
}

function mnemonic(op) {
  switch (op) {
    case '+': return "ADD";
    case '-': return "SUB";
    case '*': return "MUL";
    case '/': return "DIV";
    default: return "";
  }
}

/**
 * Generate 3-Address Instructions
 */
export function generateThreeAddressCode(postfix) {
  const instructions = [];
  const stack = [];
  let tempIdx = 1;

  for (const ch of postfix) {
    if (isOperand(ch)) {
      stack.push(ch);
    } else if (isOperator(ch)) {
      if (stack.length < 2) continue;
      const right = stack.pop();
      const left = stack.pop();
      const temp = `t${tempIdx++}`;
      instructions.push(`${temp} = ${left} ${ch} ${right}`);
      stack.push(temp);
    }
  }

  return instructions;
}

/**
 * Generate 2-Address Instructions (Register R1)
 */
export function generateTwoAddressCode(postfix) {
  const instructions = [];
  const stack = [];
  let tempIdx = 1;

  for (const ch of postfix) {
    if (isOperand(ch)) {
      stack.push(ch);
    } else if (isOperator(ch)) {
      if (stack.length < 2) continue;
      const right = stack.pop();
      const left = stack.pop();
      const temp = `t${tempIdx++}`;

      instructions.push(`MOV R1, ${left}`);
      instructions.push(`${mnemonic(ch)} R1, ${right}`);
      instructions.push(`MOV ${temp}, R1`);
      stack.push(temp);
    }
  }

  return instructions;
}

/**
 * Generate 1-Address Instructions (Accumulator AC)
 */
export function generateOneAddressCode(postfix) {
  const instructions = [];
  const stack = [];
  let tempIdx = 1;

  for (const ch of postfix) {
    if (isOperand(ch)) {
      stack.push(ch);
    } else if (isOperator(ch)) {
      if (stack.length < 2) continue;
      const right = stack.pop();
      const left = stack.pop();
      const temp = `t${tempIdx++}`;

      instructions.push(`LOAD ${left}`);
      instructions.push(`${mnemonic(ch)} ${right}`);
      instructions.push(`STORE ${temp}`);
      stack.push(temp);
    }
  }

  return instructions;
}

/**
 * Generate 0-Address Instructions (Stack Machine)
 */
export function generateZeroAddressCode(postfix) {
  const instructions = [];
  let tempIdx = 1;

  for (const ch of postfix) {
    if (isOperand(ch)) {
      instructions.push(`PUSH ${ch}`);
    } else if (isOperator(ch)) {
      instructions.push(mnemonic(ch));
    }
  }

  instructions.push(`POP t${tempIdx}`);
  return instructions;
}

/**
 * Evaluate arithmetic operation with safe integer division
 */
function applyOp(op, a, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 0 : Math.trunc(a / b);
    default: return 0;
  }
}

/**
 * Simulate all 4 instruction formats step-by-step
 */
export function simulateAllFormats(cleanExpr, postfix, variableValues) {
  // 1. Three-Address Simulation
  const threeInstructions = generateThreeAddressCode(postfix);
  const threeMemory = { ...variableValues };
  const threeSteps = [];

  for (const instr of threeInstructions) {
    // format: t1 = a + b
    const match = instr.match(/^(t\d+)\s*=\s*(\w+)\s*([\+\-\*\/])\s*(\w+)$/);
    if (match) {
      const [_, dest, src1, op, src2] = match;
      const val1 = threeMemory[src1] !== undefined ? threeMemory[src1] : 0;
      const val2 = threeMemory[src2] !== undefined ? threeMemory[src2] : 0;
      const res = applyOp(op, val1, val2);
      threeMemory[dest] = res;

      threeSteps.push({
        instruction: instr,
        result: `${dest} = ${val1} ${op} ${val2} = ${res}`,
        state: Object.entries(threeMemory).map(([k, v]) => ({ name: k, value: v }))
      });
    }
  }
  const lastThreeDest = threeInstructions.length > 0 ? `t${threeInstructions.length}` : null;
  const threeFinal = lastThreeDest ? `${lastThreeDest} = ${threeMemory[lastThreeDest]}` : "0";

  // 2. Two-Address Simulation (Register R1)
  const twoInstructions = generateTwoAddressCode(postfix);
  const twoMemory = { ...variableValues };
  let r1 = 0;
  const twoSteps = [];

  for (const instr of twoInstructions) {
    let resultNote = "";
    if (instr.startsWith("MOV R1,")) {
      const src = instr.replace("MOV R1,", "").trim();
      r1 = twoMemory[src] !== undefined ? twoMemory[src] : 0;
      resultNote = `R1 ← ${src} (${r1})`;
    } else if (instr.startsWith("MOV t")) {
      const dest = instr.split(",")[0].replace("MOV", "").trim();
      twoMemory[dest] = r1;
      resultNote = `${dest} ← R1 (${r1})`;
    } else {
      const parts = instr.split(",");
      const opName = parts[0].replace("R1", "").trim();
      const src = parts[1].trim();
      const srcVal = twoMemory[src] !== undefined ? twoMemory[src] : 0;
      let op = '+';
      if (opName === "SUB") op = '-';
      if (opName === "MUL") op = '*';
      if (opName === "DIV") op = '/';
      const prevR1 = r1;
      r1 = applyOp(op, r1, srcVal);
      resultNote = `R1 ← ${prevR1} ${op} ${srcVal} = ${r1}`;
    }

    twoSteps.push({
      instruction: instr,
      result: resultNote,
      state: [
        { name: "R1", value: r1 },
        ...Object.entries(twoMemory).map(([k, v]) => ({ name: k, value: v }))
      ]
    });
  }
  const lastTwoDest = `t${Math.floor(twoInstructions.length / 3)}`;
  const twoFinal = twoMemory[lastTwoDest] !== undefined ? `${lastTwoDest} = ${twoMemory[lastTwoDest]}` : `R1 = ${r1}`;

  // 3. One-Address Simulation (Accumulator AC)
  const oneInstructions = generateOneAddressCode(postfix);
  const oneMemory = { ...variableValues };
  let ac = 0;
  const oneSteps = [];

  for (const instr of oneInstructions) {
    let resultNote = "";
    if (instr.startsWith("LOAD")) {
      const src = instr.replace("LOAD", "").trim();
      ac = oneMemory[src] !== undefined ? oneMemory[src] : 0;
      resultNote = `AC ← ${src} (${ac})`;
    } else if (instr.startsWith("STORE")) {
      const dest = instr.replace("STORE", "").trim();
      oneMemory[dest] = ac;
      resultNote = `${dest} ← AC (${ac})`;
    } else {
      const [opName, src] = instr.split(" ");
      const srcVal = oneMemory[src] !== undefined ? oneMemory[src] : 0;
      let op = '+';
      if (opName === "SUB") op = '-';
      if (opName === "MUL") op = '*';
      if (opName === "DIV") op = '/';
      const prevAc = ac;
      ac = applyOp(op, ac, srcVal);
      resultNote = `AC ← ${prevAc} ${op} ${srcVal} = ${ac}`;
    }

    oneSteps.push({
      instruction: instr,
      result: resultNote,
      state: [
        { name: "AC", value: ac },
        ...Object.entries(oneMemory).map(([k, v]) => ({ name: k, value: v }))
      ]
    });
  }
  const lastOneDest = `t${Math.floor(oneInstructions.length / 3)}`;
  const oneFinal = oneMemory[lastOneDest] !== undefined ? `${lastOneDest} = ${oneMemory[lastOneDest]}` : `AC = ${ac}`;

  // 4. Zero-Address Simulation (Stack)
  const zeroInstructions = generateZeroAddressCode(postfix);
  const stack = [];
  const zeroMemory = { ...variableValues };
  const zeroSteps = [];

  for (const instr of zeroInstructions) {
    let resultNote = "";
    if (instr.startsWith("PUSH")) {
      const src = instr.replace("PUSH", "").trim();
      const val = zeroMemory[src] !== undefined ? zeroMemory[src] : 0;
      stack.push(val);
      resultNote = `Push ${src} (${val}) to Stack`;
    } else if (instr.startsWith("POP")) {
      const dest = instr.replace("POP", "").trim();
      const val = stack.pop() || 0;
      zeroMemory[dest] = val;
      resultNote = `Pop ${val} into ${dest}`;
    } else {
      const opName = instr.trim();
      const b = stack.pop() || 0;
      const a = stack.pop() || 0;
      let op = '+';
      if (opName === "SUB") op = '-';
      if (opName === "MUL") op = '*';
      if (opName === "DIV") op = '/';
      const res = applyOp(op, a, b);
      stack.push(res);
      resultNote = `Pop ${a}, ${b} → Compute ${a} ${op} ${b} = ${res} → Push ${res}`;
    }

    zeroSteps.push({
      instruction: instr,
      result: resultNote,
      state: [
        { name: "Stack (Top→Bottom)", value: `[ ${[...stack].reverse().join(", ")} ]` },
        ...Object.entries(zeroMemory).map(([k, v]) => ({ name: k, value: v }))
      ]
    });
  }
  const zeroFinal = zeroMemory["t1"] !== undefined ? `t1 = ${zeroMemory["t1"]}` : (stack.length > 0 ? `Top = ${stack[stack.length - 1]}` : "0");

  return {
    postfix,
    variables: Object.keys(variableValues),
    formats: [
      {
        name: "Three-Address Architecture",
        codeType: "3-Address (General Purpose Registers / Memory)",
        instructions: threeInstructions,
        instructionCount: threeInstructions.length,
        hardwareRegisters: "General Purpose (R0, R1... or memory pointers)",
        steps: threeSteps,
        finalResult: threeFinal,
        badge: "RISC / Modern Compiler TAC"
      },
      {
        name: "Two-Address Architecture",
        codeType: "2-Address (Accumulator + Register R1)",
        instructions: twoInstructions,
        instructionCount: twoInstructions.length,
        hardwareRegisters: "Single Temporary Register R1",
        steps: twoSteps,
        finalResult: twoFinal,
        badge: "x86 Style Register-Memory"
      },
      {
        name: "One-Address Architecture",
        codeType: "1-Address (Accumulator Machine)",
        instructions: oneInstructions,
        instructionCount: oneInstructions.length,
        hardwareRegisters: "Accumulator Register (AC)",
        steps: oneSteps,
        finalResult: oneFinal,
        badge: "Classical Accumulator / PDP-8"
      },
      {
        name: "Zero-Address Architecture",
        codeType: "0-Address (Stack Machine)",
        instructions: zeroInstructions,
        instructionCount: zeroInstructions.length,
        hardwareRegisters: "Stack Pointer (SP), Hardware Stack",
        steps: zeroSteps,
        finalResult: zeroFinal,
        badge: "JVM Bytecode / Forth / PostScript"
      }
    ]
  };
}
