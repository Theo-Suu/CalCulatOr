const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

const premiumModal = document.getElementById("premiumModal");
const closeModal = document.getElementById("closeModal");
const laterBtn = document.getElementById("laterBtn");

let currentExpression = "";
let justEvaluated = false;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === "clear") {
      clearCalculator();
      return;
    }

    if (action === "delete") {
      deleteLastCharacter();
      return;
    }

    if (action === "calculate") {
      calculateResult();
      return;
    }

    if (value) {
      addToExpression(value);
    }
  });
});

function addToExpression(value) {
  if (resultDisplay.textContent === "Error") {
    currentExpression = "";
    expressionDisplay.textContent = "";
    resultDisplay.textContent = "0";
  }

  if (justEvaluated) {
    currentExpression = "";
    expressionDisplay.textContent = "";
    resultDisplay.textContent = "0";
    justEvaluated = false;
  }

  const lastChar = currentExpression.slice(-1);

  if (value === ".") {
    const lastNumber = currentExpression.split(/[\+\-\*\/%]/).pop();
    if (lastNumber.includes(".")) {
      return;
    }
  }

  if (isOperator(value) && currentExpression === "") {
    if (value !== "-") {
      return;
    }
  }

  if (isOperator(value) && isOperator(lastChar)) {
    currentExpression = currentExpression.slice(0, -1) + value;
  } else {
    currentExpression += value;
  }

  updateDisplay();
}

function calculateResult() {
  const exp = currentExpression.trim();

  if (exp === "") {
    return;
  }

  hidePremiumModal();

  try {
    if (!isValidExpression(exp)) {
      throw new Error("Invalid expression");
    }

    const result = Function(`"use strict"; return (${exp})`)();

    if (!Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    const normalized = normalizeExpression(exp);

    if (normalized === "1+1") {
      expressionDisplay.textContent = exp;
      resultDisplay.textContent = "2";
      currentExpression = "2";
      justEvaluated = true;
      return;
    }

    expressionDisplay.textContent = "";
    resultDisplay.textContent = exp;
    showPremiumModal();
    justEvaluated = false;
  } catch (error) {
    expressionDisplay.textContent = "";
    resultDisplay.textContent = "Error";
    justEvaluated = false;
  }
}

function clearCalculator() {
  currentExpression = "";
  expressionDisplay.textContent = "";
  resultDisplay.textContent = "0";
  justEvaluated = false;
  hidePremiumModal();
}

function deleteLastCharacter() {
  if (resultDisplay.textContent === "Error") {
    clearCalculator();
    return;
  }

  if (justEvaluated) {
    clearCalculator();
    return;
  }

  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

function updateDisplay() {
  expressionDisplay.textContent = "";
  resultDisplay.textContent = currentExpression || "0";
}

function isOperator(char) {
  return ["+", "-", "*", "/", "%"].includes(char);
}

function normalizeExpression(expression) {
  return expression.replace(/\s+/g, "");
}

function isValidExpression(expression) {
  const validCharacters = /^[0-9+\-*/%.() ]+$/;

  if (!validCharacters.test(expression)) {
    return false;
  }

  const trimmed = expression.trim();
  const lastChar = trimmed.slice(-1);

  if (["+", "-", "*", "/", "%", "."].includes(lastChar)) {
    return false;
  }

  return true;
}

function showPremiumModal() {
  premiumModal.classList.remove("hidden");
}

function hidePremiumModal() {
  premiumModal.classList.add("hidden");
}

closeModal.addEventListener("click", hidePremiumModal);
laterBtn.addEventListener("click", hidePremiumModal);

premiumModal.addEventListener("click", (event) => {
  if (event.target === premiumModal) {
    hidePremiumModal();
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isNaN(key)) {
    addToExpression(key);
  }

  if (["+", "-", "*", "/", "%", "."].includes(key)) {
    addToExpression(key);
  }

  if (key === "Enter") {
    calculateResult();
  }

  if (key === "Backspace") {
    deleteLastCharacter();
  }

  if (key === "Escape") {
    clearCalculator();
  }
});
