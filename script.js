const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

const premiumModal = document.getElementById("premiumModal");
const closeModal = document.getElementById("closeModal");
const laterBtn = document.getElementById("laterBtn");

let currentExpression = "";

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
  if (currentExpression.trim() === "") {
    return;
  }

  try {
    if (!isValidExpression(currentExpression)) {
      throw new Error("Invalid expression");
    }

    const result = Function(`"use strict"; return (${currentExpression})`)();

    if (!Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    const formattedResult = formatResult(result);

    expressionDisplay.textContent = currentExpression;
    resultDisplay.textContent = formattedResult;
    currentExpression = String(formattedResult);

    showPremiumModal();
  } catch (error) {
    resultDisplay.textContent = "Error";
  }
}

function clearCalculator() {
  currentExpression = "";
  expressionDisplay.textContent = "";
  resultDisplay.textContent = "0";
}

function deleteLastCharacter() {
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

function updateDisplay() {
  expressionDisplay.textContent = currentExpression;
  resultDisplay.textContent = currentExpression || "0";
}

function isOperator(char) {
  return ["+", "-", "*", "/", "%"].includes(char);
}

function isValidExpression(expression) {
  const validCharacters = /^[0-9+\-*/%.() ]+$/;

  if (!validCharacters.test(expression)) {
    return false;
  }

  const lastChar = expression.trim().slice(-1);

  if (["+", "-", "*", "/", "%", "."].includes(lastChar)) {
    return false;
  }

  return true;
}

function formatResult(number) {
  if (Number.isInteger(number)) {
    return number;
  }

  return parseFloat(number.toFixed(8));
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
    hidePremiumModal();
  }
});
