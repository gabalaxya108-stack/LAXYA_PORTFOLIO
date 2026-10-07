/**
 * COA Lab — Number System Conversion Engine
 * Supports Binary (2), Octal (8), Decimal (10), Hexadecimal (16)
 * Generates exact mathematical step-by-step calculations and simple pedagogical explanations.
 */

export const BASES = {
  binary: { id: "binary", name: "Binary", radix: 2, subscript: "₂", prefix: "0b", allowedChars: /^[01]+$/ },
  octal: { id: "octal", name: "Octal", radix: 8, subscript: "₈", prefix: "0o", allowedChars: /^[0-7]+$/ },
  decimal: { id: "decimal", name: "Decimal", radix: 10, subscript: "₁₀", prefix: "", allowedChars: /^[0-9]+$/ },
  hexadecimal: { id: "hexadecimal", name: "Hexadecimal", radix: 16, subscript: "₁₆", prefix: "0x", allowedChars: /^[0-9a-fA-F]+$/ }
};

const HEX_VALS = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
};

const REV_HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Validate input according to source base
 */
export function validateInput(rawInput, sourceBase) {
  const cleaned = (rawInput || "").trim().toUpperCase();
  if (!cleaned) {
    return { isValid: false, message: "Please enter a number to convert." };
  }

  const baseConfig = BASES[sourceBase];
  if (!baseConfig) {
    return { isValid: false, message: "Unknown source number system." };
  }

  if (!baseConfig.allowedChars.test(cleaned)) {
    switch (sourceBase) {
      case "binary":
        return { isValid: false, message: "Binary numbers can only contain 0 and 1." };
      case "octal":
        return { isValid: false, message: "Octal numbers can only contain digits 0 to 7." };
      case "decimal":
        return { isValid: false, message: "Decimal numbers can only contain digits 0 to 9." };
      case "hexadecimal":
        return { isValid: false, message: "Hexadecimal numbers can only contain 0–9 and A–F." };
    }
  }

  if (cleaned.length > 32) {
    return { isValid: false, message: "Input is too long for educational display (maximum 32 digits)." };
  }

  return { isValid: true, sanitized: cleaned };
}

/**
 * Main conversion function
 */
export function convertNumber(rawInput, sourceBase, targetBase) {
  const validation = validateInput(rawInput, sourceBase);
  if (!validation.isValid) {
    return { success: false, error: validation.message };
  }

  const input = validation.sanitized;
  const src = BASES[sourceBase];
  const tgt = BASES[targetBase];

  // Identical bases
  if (sourceBase === targetBase) {
    return {
      success: true,
      input,
      output: input,
      answerText: `${input}${src.subscript} = ${input}${tgt.subscript}`,
      sourceBase,
      targetBase,
      stepsHtml: `
        <div class="coa-calc-step">
          <div class="coa-calc-step-num">STEP 1</div>
          <div class="coa-calc-step-body">
            <strong>Identical Bases:</strong> The number is already in ${src.name} (Base ${src.radix}). No conversion needed.
          </div>
        </div>
      `,
      explanation: {
        whatHappened: `The input ${input} is already in ${src.name}.`,
        how: `Both source and target radices are ${src.radix}, so the digit values remain unchanged.`,
        why: `Direct representation requires no mathematical conversion.`
      }
    };
  }

  try {
    // Parse input to BigInt decimal
    let decimalVal = 0n;
    if (sourceBase === "decimal") {
      decimalVal = BigInt(input);
    } else if (sourceBase === "binary") {
      decimalVal = BigInt("0b" + input);
    } else if (sourceBase === "octal") {
      decimalVal = BigInt("0o" + input);
    } else if (sourceBase === "hexadecimal") {
      decimalVal = BigInt("0x" + input);
    }

    // Convert decimal to target base
    let output = "";
    if (targetBase === "decimal") {
      output = decimalVal.toString(10);
    } else if (targetBase === "binary") {
      output = decimalVal.toString(2);
    } else if (targetBase === "octal") {
      output = decimalVal.toString(8);
    } else if (targetBase === "hexadecimal") {
      output = decimalVal.toString(16).toUpperCase();
    }

    const answerText = `${input}${src.subscript} = ${output}${tgt.subscript}`;

    // Generate tailored step-by-step calculation
    const { stepsHtml, explanation } = generateDetailedCalculation(input, output, decimalVal, sourceBase, targetBase);

    return {
      success: true,
      input,
      output,
      answerText,
      decimalVal: decimalVal.toString(),
      sourceBase,
      targetBase,
      stepsHtml,
      explanation
    };
  } catch (err) {
    return { success: false, error: `Calculation error: ${err.message}` };
  }
}

/**
 * Generate step-by-step arithmetic breakdown based on conversion type
 */
function generateDetailedCalculation(input, output, decimalVal, fromBase, toBase) {
  const src = BASES[fromBase];
  const tgt = BASES[toBase];

  // CASE 1: Any Base → Decimal (Positional expansion using powers of source radix)
  if (toBase === "decimal") {
    const len = input.length;
    const powerTerms = [];
    const calcRows = [];
    let sumParts = [];

    for (let i = 0; i < len; i++) {
      const char = input[i];
      const power = len - 1 - i;
      const digitVal = fromBase === "hexadecimal" ? HEX_VALS[char] : parseInt(char, 10);
      const weight = BigInt(src.radix) ** BigInt(power);
      const termTotal = BigInt(digitVal) * weight;

      powerTerms.push(`${char} × ${src.radix}<sup>${power}</sup>`);
      calcRows.push(`<tr>
        <td><code>${char}</code></td>
        <td>${src.radix}<sup>${power}</sup> = ${weight.toString()}</td>
        <td>${digitVal} × ${weight.toString()}</td>
        <td><strong>${termTotal.toString()}</strong></td>
      </tr>`);
      if (termTotal > 0n || powerTerms.length === 1) {
        sumParts.push(termTotal.toString());
      }
    }

    if (sumParts.length === 0) sumParts = ["0"];

    const stepsHtml = `
      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 1</div>
        <div class="coa-calc-step-body">
          <strong>Assign Powers of ${src.radix}:</strong>
          <p class="coa-calc-sub">Each digit is weighted by ${src.radix} raised to its position index (from right to left, starting at 0):</p>
          <div class="coa-math-formula">${powerTerms.join(" + ")}</div>
        </div>
      </div>

      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 2</div>
        <div class="coa-calc-step-body">
          <strong>Calculate Position Values:</strong>
          <table class="coa-calc-table">
            <thead>
              <tr><th>Digit</th><th>Power (${src.radix}<sup>n</sup>)</th><th>Multiplication</th><th>Value</th></tr>
            </thead>
            <tbody>
              ${calcRows.join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 3</div>
        <div class="coa-calc-step-body">
          <strong>Sum All Values:</strong>
          <div class="coa-math-formula">${sumParts.join(" + ")} = <strong>${output}</strong></div>
        </div>
      </div>

      <div class="coa-calc-step coa-step-final">
        <div class="coa-calc-step-num">STEP 4</div>
        <div class="coa-calc-step-body">
          <strong>Final Answer:</strong>
          <div class="coa-math-highlight">${input}${src.subscript} = ${output}${tgt.subscript}</div>
        </div>
      </div>
    `;

    const explanation = {
      whatHappened: `Converted ${input}${src.subscript} into standard base-10 decimal (${output}₁₀).`,
      how: `Multiplied each digit by its positional power of ${src.radix} and summed the results.`,
      why: `Positional numbering systems evaluate the total magnitude by multiplying digits by powers of the radix.`
    };

    return { stepsHtml, explanation };
  }

  // CASE 2: Decimal → Binary, Octal, or Hexadecimal (Repeated Division)
  if (fromBase === "decimal") {
    let current = decimalVal;
    const radixBig = BigInt(tgt.radix);
    const rows = [];
    const remainders = [];

    if (current === 0n) {
      rows.push(`<tr><td>0</td><td>÷ ${tgt.radix}</td><td>0</td><td>0</td></tr>`);
      remainders.push("0");
    } else {
      while (current > 0n) {
        const quotient = current / radixBig;
        const rem = Number(current % radixBig);
        const remChar = toBase === "hexadecimal" ? REV_HEX[rem] : rem.toString();
        rows.push(`<tr>
          <td>${current.toString()}</td>
          <td>÷ ${tgt.radix}</td>
          <td>${quotient.toString()}</td>
          <td><strong>${remChar}</strong>${rem >= 10 ? ` (${rem})` : ""}</td>
        </tr>`);
        remainders.push(remChar);
        current = quotient;
      }
    }

    const stepsHtml = `
      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 1</div>
        <div class="coa-calc-step-body">
          <strong>Repeated Division by ${tgt.radix}:</strong>
          <p class="coa-calc-sub">Divide the decimal number by ${tgt.radix} repeatedly until the quotient reaches 0. Record each remainder:</p>
          <table class="coa-calc-table">
            <thead>
              <tr><th>Value</th><th>Operation</th><th>Quotient</th><th>Remainder</th></tr>
            </thead>
            <tbody>
              ${rows.join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 2</div>
        <div class="coa-calc-step-body">
          <strong>Read Remainders from Bottom to Top:</strong>
          <p class="coa-calc-sub">The last remainder is the Most Significant Digit (MSD); the first remainder is the Least Significant Digit (LSD):</p>
          <div class="coa-math-formula">
            Remainders: [ ${remainders.slice().reverse().join(", ")} ] ↑ (read upward)
          </div>
        </div>
      </div>

      <div class="coa-calc-step coa-step-final">
        <div class="coa-calc-step-num">STEP 3</div>
        <div class="coa-calc-step-body">
          <strong>Final Answer:</strong>
          <div class="coa-math-highlight">${input}${src.subscript} = ${output}${tgt.subscript}</div>
        </div>
      </div>
    `;

    const explanation = {
      whatHappened: `Converted decimal ${input}₁₀ into ${tgt.name} (${output}${tgt.subscript}).`,
      how: `Repeatedly divided by ${tgt.radix} and assembled the remainders in reverse order (bottom-to-top).`,
      why: `Repeated division peels away the lowest-order radix digits until all magnitude has been accounted for.`
    };

    return { stepsHtml, explanation };
  }

  // CASE 3: Binary → Hexadecimal (Group 4 bits)
  if (fromBase === "binary" && toBase === "hexadecimal") {
    // Pad to multiple of 4
    let padded = input;
    const remainder = padded.length % 4;
    const padCount = remainder === 0 ? 0 : 4 - remainder;
    if (padCount > 0) {
      padded = "0".repeat(padCount) + padded;
    }

    const groups = [];
    const mappingRows = [];
    for (let i = 0; i < padded.length; i += 4) {
      const chunk = padded.slice(i, i + 4);
      const val = parseInt(chunk, 2);
      const hexChar = REV_HEX[val];
      groups.push(chunk);
      mappingRows.push(`<tr>
        <td><code>${chunk}</code></td>
        <td>${val}</td>
        <td><strong>${hexChar}</strong></td>
      </tr>`);
    }

    const stepsHtml = `
      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 1</div>
        <div class="coa-calc-step-body">
          <strong>Group Binary Bits into Nibbles (4-bit groups):</strong>
          <p class="coa-calc-sub">Because 2⁴ = 16, exactly 4 binary bits represent 1 hexadecimal digit. Group from right to left (padded with leading zeros if needed):</p>
          <div class="coa-math-formula">${groups.map(g => `<span class="coa-bit-group">${g}</span>`).join(" ")}</div>
        </div>
      </div>

      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 2</div>
        <div class="coa-calc-step-body">
          <strong>Convert Each 4-bit Group to Hexadecimal:</strong>
          <table class="coa-calc-table">
            <thead>
              <tr><th>4-bit Binary Group</th><th>Decimal Value</th><th>Hexadecimal Digit</th></tr>
            </thead>
            <tbody>
              ${mappingRows.join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="coa-calc-step coa-step-final">
        <div class="coa-calc-step-num">STEP 3</div>
        <div class="coa-calc-step-body">
          <strong>Combine Digits:</strong>
          <div class="coa-math-highlight">${input}${src.subscript} = ${output}${tgt.subscript}</div>
        </div>
      </div>
    `;

    const explanation = {
      whatHappened: `Converted binary ${input}₂ directly to hexadecimal ${output}₁₆ using 4-bit grouping.`,
      how: `Grouped bits into 4-bit sets from right to left, converting each group directly to its hex character.`,
      why: `Since 16 is 2⁴, hex is a compact 4:1 representation of binary without requiring decimal division.`
    };

    return { stepsHtml, explanation };
  }

  // CASE 4: Hexadecimal → Binary (Expand 1 hex digit to 4 bits)
  if (fromBase === "hexadecimal" && toBase === "binary") {
    const expansionRows = [];
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const val = HEX_VALS[char];
      const bin4 = val.toString(2).padStart(4, "0");
      expansionRows.push(`<tr>
        <td><code>${char}</code></td>
        <td>${val}</td>
        <td><strong>${bin4}</strong></td>
      </tr>`);
    }

    const stepsHtml = `
      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 1</div>
        <div class="coa-calc-step-body">
          <strong>Expand Each Hex Digit into 4 Binary Bits:</strong>
          <p class="coa-calc-sub">Each hexadecimal digit corresponds to exactly 4 binary bits (2⁴ = 16):</p>
          <table class="coa-calc-table">
            <thead>
              <tr><th>Hex Digit</th><th>Decimal Value</th><th>4-Bit Binary</th></tr>
            </thead>
            <tbody>
              ${expansionRows.join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="coa-calc-step coa-step-final">
        <div class="coa-calc-step-num">STEP 2</div>
        <div class="coa-calc-step-body">
          <strong>Concatenate Bits (drop leading zeros):</strong>
          <div class="coa-math-highlight">${input}${src.subscript} = ${output}${tgt.subscript}</div>
        </div>
      </div>
    `;

    const explanation = {
      whatHappened: `Expanded hexadecimal ${input}₁₆ into binary ${output}₂.`,
      how: `Replaced each hex character with its 4-bit binary equivalent and joined them.`,
      why: `Computers convert human hex notation back into physical wire signals (4 bits per character).`
    };

    return { stepsHtml, explanation };
  }

  // CASE 5: Binary ↔ Octal (Group 3 bits)
  if (fromBase === "binary" && toBase === "octal") {
    let padded = input;
    const remainder = padded.length % 3;
    const padCount = remainder === 0 ? 0 : 3 - remainder;
    if (padCount > 0) padded = "0".repeat(padCount) + padded;

    const groups = [];
    const rows = [];
    for (let i = 0; i < padded.length; i += 3) {
      const chunk = padded.slice(i, i + 3);
      const val = parseInt(chunk, 2);
      groups.push(chunk);
      rows.push(`<tr><td><code>${chunk}</code></td><td><strong>${val}</strong></td></tr>`);
    }

    const stepsHtml = `
      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 1</div>
        <div class="coa-calc-step-body">
          <strong>Group Binary Bits into 3-Bit Sets:</strong>
          <p class="coa-calc-sub">Since 2³ = 8, each octal digit corresponds to 3 binary bits. Group from right to left:</p>
          <div class="coa-math-formula">${groups.map(g => `<span class="coa-bit-group">${g}</span>`).join(" ")}</div>
        </div>
      </div>

      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 2</div>
        <div class="coa-calc-step-body">
          <strong>Convert Each Group to Octal:</strong>
          <table class="coa-calc-table">
            <thead><tr><th>3-Bit Group</th><th>Octal Digit</th></tr></thead>
            <tbody>${rows.join("")}</tbody>
          </table>
        </div>
      </div>

      <div class="coa-calc-step coa-step-final">
        <div class="coa-calc-step-num">STEP 3</div>
        <div class="coa-calc-step-body">
          <strong>Final Answer:</strong>
          <div class="coa-math-highlight">${input}${src.subscript} = ${output}${tgt.subscript}</div>
        </div>
      </div>
    `;

    const explanation = {
      whatHappened: `Converted binary ${input}₂ to octal ${output}₈.`,
      how: `Grouped bits into 3-bit triplets from right to left.`,
      why: `Octal provides a convenient 3-to-1 compression of binary bits.`
    };

    return { stepsHtml, explanation };
  }

  // CASE 6: Octal → Binary (Expand 1 octal digit to 3 bits)
  if (fromBase === "octal" && toBase === "binary") {
    const rows = [];
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const bin3 = parseInt(char, 10).toString(2).padStart(3, "0");
      rows.push(`<tr><td><code>${char}</code></td><td><strong>${bin3}</strong></td></tr>`);
    }

    const stepsHtml = `
      <div class="coa-calc-step">
        <div class="coa-calc-step-num">STEP 1</div>
        <div class="coa-calc-step-body">
          <strong>Expand Each Octal Digit into 3 Binary Bits (2³ = 8):</strong>
          <table class="coa-calc-table">
            <thead><tr><th>Octal Digit</th><th>3-Bit Binary</th></tr></thead>
            <tbody>${rows.join("")}</tbody>
          </table>
        </div>
      </div>

      <div class="coa-calc-step coa-step-final">
        <div class="coa-calc-step-num">STEP 2</div>
        <div class="coa-calc-step-body">
          <strong>Final Answer:</strong>
          <div class="coa-math-highlight">${input}${src.subscript} = ${output}${tgt.subscript}</div>
        </div>
      </div>
    `;

    const explanation = {
      whatHappened: `Expanded octal ${input}₈ into binary ${output}₂.`,
      how: `Replaced each octal digit with its 3-bit binary equivalent.`,
      why: `Allows direct binary synthesis without requiring intermediate decimal division.`
    };

    return { stepsHtml, explanation };
  }

  // CASE 7: Octal ↔ Hexadecimal (Via Binary intermediary)
  const binaryIntermediary = decimalVal.toString(2);
  const stepsHtml = `
    <div class="coa-calc-step">
      <div class="coa-calc-step-num">STEP 1</div>
      <div class="coa-calc-step-body">
        <strong>Convert ${src.name} to Binary:</strong>
        <p class="coa-calc-sub">${input}${src.subscript} converted to binary equals:</p>
        <div class="coa-math-formula"><code>${binaryIntermediary}₂</code></div>
      </div>
    </div>

    <div class="coa-calc-step">
      <div class="coa-calc-step-num">STEP 2</div>
      <div class="coa-calc-step-body">
        <strong>Convert Binary to ${tgt.name}:</strong>
        <p class="coa-calc-sub">Group binary bits to form the ${tgt.name} value:</p>
        <div class="coa-math-formula"><code>${binaryIntermediary}₂</code> → <strong>${output}${tgt.subscript}</strong></div>
      </div>
    </div>

    <div class="coa-calc-step coa-step-final">
      <div class="coa-calc-step-num">STEP 3</div>
      <div class="coa-calc-step-body">
        <strong>Final Answer:</strong>
        <div class="coa-math-highlight">${input}${src.subscript} = ${output}${tgt.subscript}</div>
      </div>
    </div>
  `;

  const explanation = {
    whatHappened: `Converted ${src.name} ${input}${src.subscript} to ${tgt.name} ${output}${tgt.subscript}.`,
    how: `Converted through binary as the common machine intermediary.`,
    why: `Direct powers-of-two bases (2, 8, 16) transfer cleanly through binary bit groups.`
  };

  return { stepsHtml, explanation };
}
