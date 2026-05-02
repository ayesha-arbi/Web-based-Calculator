// Get display element
const display = document.getElementById("display");

// Append values to display
function append(value) {
  const current = display.innerText;
  const lastChar = current.slice(-1);

  // Prevent multiple operators in a row
  if ("+-*/%".includes(value) && "+-*/%".includes(lastChar)) {
    return;
  }

  // Prevent multiple decimals in a number
  if (value === "." && getLastNumber().includes(".")) {
    return;
  }

  // Replace initial 0
  if (current === "0") {
    display.innerText = value;
  } else {
    display.innerText += value;
  }
}

// Get last number segment
function getLastNumber() {
  return display.innerText.split(/[\+\-\*\/%]/).pop();
}

// Clear display
function clearDisplay() {
  display.innerText = "0";
}

// Delete last character
function deleteLast() {
  let current = display.innerText;
  display.innerText = current.slice(0, -1) || "0";
}

// Main calculation function
function calculate() {
  try {
    let expression = display.innerText;

    // ✅ Allow only valid characters
    if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
      throw new Error("Invalid characters");
    }

    // ✅ Prevent incomplete expressions
    if ("+-*/%".includes(expression.slice(-1))) {
      throw new Error("Incomplete expression");
    }

    // ✅ Safe evaluation (instead of eval)
    let result = Function('"use strict"; return (' + expression + ')')();

    // ✅ Handle division by zero or Infinity
    if (!isFinite(result)) {
      throw new Error("Math error");
    }

    display.innerText = result;

  } catch (error) {
    showError();
  }
}

// Show error and auto reset
function showError() {
  display.innerText = "Error";
  setTimeout(() => {
    display.innerText = "0";
  }, 1500);
}

// =====================
// ⌨️ Keyboard Support
// =====================
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Numbers & operators
  if (!isNaN(key) || "+-*/.".includes(key)) {
    append(key);
  }

  // Enter = calculate
  else if (key === "Enter") {
    e.preventDefault();
    calculate();
  }

  // Backspace = delete
  else if (key === "Backspace") {
    deleteLast();
  }

  // Escape = clear
  else if (key === "Escape") {
    clearDisplay();
  }
});
