/**
 * COA Arithmetic Expression & Multi-Format Instruction Simulator Engine
 * Ported directly from Laxya Gaba's repository:
 * https://github.com/gabalaxya108-stack/SIMULATOR.git
 * 
 * Features:
 * 1. Expression Validation (operands a-z, operators +, -, *, /, balanced parentheses)
 * 2. Infix to Postfix Conversion (Shunting-yard algorithm)
 * 3. Variable Detection
 * 4. Instruction Generation:
 *    - Three-Address Code (TAC)
 *    - Two-Address Code (MOV R1, left; OP R1, right; MOV tX, R1)
 *    - One-Address Code (LOAD left; OP right; STORE tX)
 *    - Zero-Address Code (PUSH left; PUSH right; OP; POP tX)
 * 5. Step-by-Step Simulation & Execution Trace
 * 6. Comparison Table Generation
 */

export function isOperand(ch) {
  return ch >= 'a' && ch <= 'z';
}

export function isOperator(ch) {
  return ch === '+' || ch === '-' || ch === '*' || ch === '/';
}

export function precedence(ch) {
  if (ch === '+' || ch === '-') return 1;
  if (ch === '*' || ch === '/') return 2;
  return 0;
}

/**
 * Validates expression according to C++ ExpressionValidator:
 * - lowercase operands a-z
 * - operators + - * /
 * - balanced parentheses
 * - no consecutive operands, operators at edges, or invalid tokens
 */
export function isValidExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return false;
  }

  // Remove whitespace
  const expr = expression.replace(/\s+/g, '');
  if (expr.length === 0) {
    return false;
  }

  let parenthesisDepth = 0;

  // 0: Start, 1: Operand, 2: Operator, 3: OpenParen, 4: CloseParen
  let previousToken = 0;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];

    if (isOperand(ch)) {
      if (previousToken === 1 || previousToken === 4) {
        return false;
      }
      previousToken = 1;
    } else if (isOperator(ch)) {
      if (previousToken !== 1 && previousToken !== 4) {
        return false;
      }
      previousToken = 2;
    } else if (ch === '(') {
      if (previousToken === 1 || previousToken === 4) {
        return false;
      }
      parenthesisDepth++;
      previousToken = 3;
    } else if (ch === ')') {
      if (parenthesisDepth === 0 || previousToken === 2 || previousToken === 3 || previousToken === 0) {
        return false;
      }
      parenthesisDepth--;
      previousToken = 4;
    } else {
      return false;
    }
  }

  return parenthesisDepth === 0 && previousToken !== 2 && previousToken !== 3 && previousToken !== 0;
}

/**
 * Infix to Postfix converter (matches C++ ExpressionConverter)
 */
export function toPostfix(infix) {
  const expr = infix.replace(/\s+/g, '');
  let postfix = '';
  const stack = [];

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];

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
        precedence(stack[stack.length - 1]) >= precedence(ch)
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

/**
 * Collect unique variables used in expression in alphabetical order
 */
export function collectVariables(expression) {
  const vars = new Set();
  for (let i = 0; i < expression.length; i++) {
    const ch = expression[i];
    if (isOperand(ch)) {
      vars.add(ch);
    }
  }
  return Array.from(vars).sort();
}

function instructionMnemonic(ch) {
  switch (ch) {
    case '+': return 'ADD';
    case '-': return 'SUB';
    case '*': return 'MUL';
    case '/': return 'DIV';
    default: return '';
  }
}

/**
 * Instruction Generators (matching C++ InstructionGenerator)
 */
export function generateThreeAddressCode(postfix) {
  const instructions = [];
  const stack = [];
  let tempIndex = 1;

  for (let i = 0; i < postfix.length; i++) {
    const ch = postfix[i];
    if (isOperand(ch)) {
      stack.push(ch);
    } else if (isOperator(ch)) {
      if (stack.length < 2) continue;
      const right = stack.pop();
      const left = stack.pop();
      const temp = `t${tempIndex++}`;
      instructions.push(`${temp}=${left}${ch}${right}`);
      stack.push(temp);
    }
  }

  return instructions;
}

export function generateTwoAddressCode(postfix) {
  const instructions = [];
  const stack = [];
  let tempIndex = 1;

  for (let i = 0; i < postfix.length; i++) {
    const ch = postfix[i];
    if (isOperand(ch)) {
      stack.push(ch);
    } else if (isOperator(ch)) {
      if (stack.length < 2) continue;
      const right = stack.pop();
      const left = stack.pop();
      instructions.push(`MOV R1,${left}`);
      instructions.push(`${instructionMnemonic(ch)} R1,${right}`);
      const temp = `t${tempIndex++}`;
      instructions.push(`MOV ${temp},R1`);
      stack.push(temp);
    }
  }

  return instructions;
}

export function generateOneAddressCode(postfix) {
  const instructions = [];
  const stack = [];
  let tempIndex = 1;

  for (let i = 0; i < postfix.length; i++) {
    const ch = postfix[i];
    if (isOperand(ch)) {
      stack.push(ch);
    } else if (isOperator(ch)) {
      if (stack.length < 2) continue;
      const right = stack.pop();
      const left = stack.pop();
      const temp = `t${tempIndex++}`;
      instructions.push(`LOAD ${left}`);
      instructions.push(`${instructionMnemonic(ch)} ${right}`);
      instructions.push(`STORE ${temp}`);
      stack.push(temp);
    }
  }

  return instructions;
}

export function generateZeroAddressCode(postfix) {
  const instructions = [];
  let tempIndex = 1;

  for (let i = 0; i < postfix.length; i++) {
    const ch = postfix[i];
    if (isOperand(ch)) {
      instructions.push(`PUSH ${ch}`);
    } else if (isOperator(ch)) {
      instructions.push(instructionMnemonic(ch));
    }
  }

  instructions.push(`POP t${tempIndex}`);
  return instructions;
}

export function collectTemporaryVariables(instructions) {
  const temps = new Set();
  for (const inst of instructions) {
    const matches = inst.match(/\bt\d+\b/g);
    if (matches) {
      matches.forEach(t => temps.add(t));
    }
  }
  return Array.from(temps).sort();
}

/**
 * Resolves a variable or temporary name to its numeric value.
 * If not explicitly supplied, defaults to (char - 'a') + 1.
 */
function resolveValue(token, stateMap, userValues) {
  if (stateMap.has(token)) {
    return stateMap.get(token);
  }
  if (userValues && userValues[token] !== undefined && userValues[token] !== null && userValues[token] !== '') {
    const parsed = Number(userValues[token]);
    return Number.isNaN(parsed) ? 1 : parsed;
  }
  if (token.length === 1 && token >= 'a' && token <= 'z') {
    return (token.charCodeAt(0) - 97) + 1;
  }
  return 0;
}

function stateMapToSortedArray(stateMap) {
  return Array.from(stateMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Builds format result and executes step-by-step trace simulation
 * (exact match to C++ buildFormatResult in WebAppService.cpp)
 */
export function buildFormatResult(name, instructions, values = {}) {
  const result = {
    name,
    instructions,
    instructionCount: instructions.length,
    steps: [],
    temporaryVariables: collectTemporaryVariables(instructions),
    registers: name === 'Two Address' ? 'R1' : name === 'One Address' ? 'AC' : name === 'Zero Address' ? 'Stack' : 'None',
    finalResult: ''
  };

  if (result.temporaryVariables.length === 0) {
    result.temporaryVariables.push('None');
  }

  if (name === 'Three Address') {
    const stateMap = new Map();
    for (const instruction of instructions) {
      const equals = instruction.indexOf('=');
      if (equals === -1) continue;

      const destination = instruction.substring(0, equals);
      const expr = instruction.substring(equals + 1);
      if (expr.length < 3) continue;

      const leftToken = expr[0];
      const operation = expr[1];
      const rightToken = expr.substring(2);

      const leftValue = resolveValue(leftToken, stateMap, values);
      const rightValue = resolveValue(rightToken, stateMap, values);

      let resultValue = 0;
      switch (operation) {
        case '+': resultValue = leftValue + rightValue; break;
        case '-': resultValue = leftValue - rightValue; break;
        case '*': resultValue = leftValue * rightValue; break;
        case '/': resultValue = rightValue === 0 ? 0 : Math.trunc(leftValue / rightValue); break;
      }

      stateMap.set(destination, resultValue);
      const stateArr = stateMapToSortedArray(stateMap);

      result.steps.push({
        instruction,
        result: `${destination} = ${resultValue}`,
        state: stateArr
      });

      if (destination.startsWith('t')) {
        result.finalResult = `${destination} = ${resultValue}`;
      }
    }
  } else if (name === 'Two Address') {
    let registerValue = 0;
    const stateMap = new Map();

    for (const instruction of instructions) {
      const parts = instruction.split(' ');
      const operation = parts[0];
      const operandLine = parts[1] || '';

      if (operation === 'MOV') {
        const comma = operandLine.indexOf(',');
        if (comma === -1) continue;
        const target = operandLine.substring(0, comma);
        const source = operandLine.substring(comma + 1);
        const sourceValue = source === 'R1' ? registerValue : resolveValue(source, stateMap, values);

        if (target === 'R1') {
          registerValue = sourceValue;
        } else {
          stateMap.set(target, sourceValue);
        }
      } else if (operation === 'ADD' || operation === 'SUB' || operation === 'MUL' || operation === 'DIV') {
        const comma = operandLine.indexOf(',');
        if (comma === -1) continue;
        const source = operandLine.substring(comma + 1);
        const sourceValue = source === 'R1' ? registerValue : resolveValue(source, stateMap, values);

        switch (operation) {
          case 'ADD': registerValue += sourceValue; break;
          case 'SUB': registerValue -= sourceValue; break;
          case 'MUL': registerValue *= sourceValue; break;
          case 'DIV': registerValue = sourceValue === 0 ? 0 : Math.trunc(registerValue / sourceValue); break;
        }
      }

      const stateArr = stateMapToSortedArray(stateMap);
      result.steps.push({
        instruction,
        result: `R1 = ${registerValue}`,
        state: stateArr
      });
    }

    if (result.steps.length > 0) {
      result.finalResult = `R1 = ${registerValue}`;
    }
  } else if (name === 'One Address') {
    let accumulatorValue = 0;
    const stateMap = new Map();

    for (const instruction of instructions) {
      const parts = instruction.split(' ');
      const operation = parts[0];
      const operandLine = parts[1] || '';

      if (operation === 'LOAD') {
        accumulatorValue = resolveValue(operandLine, stateMap, values);
      } else if (operation === 'ADD' || operation === 'SUB' || operation === 'MUL' || operation === 'DIV') {
        const operandValue = resolveValue(operandLine, stateMap, values);
        switch (operation) {
          case 'ADD': accumulatorValue += operandValue; break;
          case 'SUB': accumulatorValue -= operandValue; break;
          case 'MUL': accumulatorValue *= operandValue; break;
          case 'DIV': accumulatorValue = operandValue === 0 ? 0 : Math.trunc(accumulatorValue / operandValue); break;
        }
      } else if (operation === 'STORE') {
        stateMap.set(operandLine, accumulatorValue);
      }

      const stateArr = stateMapToSortedArray(stateMap);
      result.steps.push({
        instruction,
        result: `AC = ${accumulatorValue}`,
        state: stateArr
      });
    }

    if (result.steps.length > 0) {
      result.finalResult = `AC = ${accumulatorValue}`;
    }
  } else if (name === 'Zero Address') {
    const stackValues = [];
    const stateMap = new Map();

    for (const instruction of instructions) {
      const parts = instruction.split(' ');
      const operation = parts[0];
      const operandLine = parts[1] || '';

      if (operation === 'PUSH') {
        const val = resolveValue(operandLine, stateMap, values);
        stackValues.push(val);
      } else if (operation === 'POP') {
        if (stackValues.length > 0) {
          const topVal = stackValues.pop();
          stateMap.set(operandLine, topVal);
        }
      } else if (operation === 'ADD' || operation === 'SUB' || operation === 'MUL' || operation === 'DIV') {
        if (stackValues.length >= 2) {
          const rightValue = stackValues.pop();
          const leftValue = stackValues.pop();
          let res = 0;
          switch (operation) {
            case 'ADD': res = leftValue + rightValue; break;
            case 'SUB': res = leftValue - rightValue; break;
            case 'MUL': res = leftValue * rightValue; break;
            case 'DIV': res = rightValue === 0 ? 0 : Math.trunc(leftValue / rightValue); break;
          }
          stackValues.push(res);
        }
      }

      const stateArr = stateMapToSortedArray(stateMap);
      result.steps.push({
        instruction,
        result: `Stack updated: [${stackValues.join(', ')}]`,
        state: stateArr,
        stackSnapshot: [...stackValues]
      });
    }

    if (result.steps.length > 0) {
      result.finalResult = `Stack top = ${stackValues.length > 0 ? stackValues[stackValues.length - 1] : '-'}`;
    }
  }

  return result;
}

/**
 * Main processExpression orchestrator matching C++ WebAppService::processExpression
 */
export function processExpression(rawExpression, values = {}) {
  const expression = (rawExpression || '').trim();

  if (!expression) {
    return {
      success: false,
      error: 'Please enter an expression.'
    };
  }

  if (!isValidExpression(expression)) {
    return {
      success: false,
      error: 'Invalid expression. Use lowercase operands a-z, operators + - * /, and balanced parentheses.'
    };
  }

  const postfix = toPostfix(expression);
  const variables = collectVariables(expression);

  const threeAddress = generateThreeAddressCode(postfix);
  const twoAddress = generateTwoAddressCode(postfix);
  const oneAddress = generateOneAddressCode(postfix);
  const zeroAddress = generateZeroAddressCode(postfix);

  const format3 = buildFormatResult('Three Address', threeAddress, values);
  const format2 = buildFormatResult('Two Address', twoAddress, values);
  const format1 = buildFormatResult('One Address', oneAddress, values);
  const format0 = buildFormatResult('Zero Address', zeroAddress, values);

  const formats = [format3, format2, format1, format0];

  const comparisonRows = [
    {
      name: 'Three Address',
      instructionCount: threeAddress.length,
      registers: 'None',
      temporaryVariables: format3.temporaryVariables.join(', '),
      finalResultType: 'Intermediate variable (tX)'
    },
    {
      name: 'Two Address',
      instructionCount: twoAddress.length,
      registers: 'R1',
      temporaryVariables: format2.temporaryVariables.join(', '),
      finalResultType: 'R1 register'
    },
    {
      name: 'One Address',
      instructionCount: oneAddress.length,
      registers: 'AC',
      temporaryVariables: format1.temporaryVariables.join(', '),
      finalResultType: 'AC register'
    },
    {
      name: 'Zero Address',
      instructionCount: zeroAddress.length,
      registers: 'Stack',
      temporaryVariables: format0.temporaryVariables.join(', '),
      finalResultType: 'Stack top'
    }
  ];

  return {
    success: true,
    expression,
    postfix,
    variables,
    formats,
    comparisonRows
  };
}
