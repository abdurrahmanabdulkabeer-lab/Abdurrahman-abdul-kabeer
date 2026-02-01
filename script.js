// Simple calculator script
const displayEl = document.getElementById('display');
const keys = document.querySelector('.keys');

let current = ''; // expression string

function updateDisplay(){
  displayEl.textContent = current === '' ? '0' : current;
}

// Append value (digit/operator)
function append(value){
  // prevent multiple dots in a number segment
  if (value === '.') {
    const parts = current.split(/[\+\-\*\/\(\)]/);
    const last = parts[parts.length - 1];
    if (last.includes('.')) return;
  }
  current += value;
  updateDisplay();
}

// Delete last char
function del(){
  current = current.slice(0, -1);
  updateDisplay();
}

// Clear all
function clearAll(){
  current = '';
  updateDisplay();
}

// Evaluate expression safely
function evaluateExpression(){
  if (current.trim() === '') return;
  // allow only digits, operators, parentheses, dot and spaces
  if (!/^[0-9+\-*/().\s]+$/.test(current)) {
    displayEl.textContent = 'Error';
    current = '';
    return;
  }
  try {
    // Use Function to evaluate; still validate above to reduce risk
    const result = Function('"use strict"; return (' + current + ')')();
    current = String(result);
    updateDisplay();
  } catch (e) {
    displayEl.textContent = 'Error';
    current = '';
  }
}

// Handle button clicks
keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === 'clear') clearAll();
  else if (action === 'delete') del();
  else if (action === 'equals') evaluateExpression();
  else if (value) append(value);

  // focus back to document for keyboard events
  document.body.focus();
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  const key = e.key;

  if ((/^[0-9]$/).test(key)) append(key);
  else if (key === '.') append('.');
  else if (key === '+' || key === '-' || key === '*' || key === '/') append(key);
  else if (key === 'Enter' || key === '=') { e.preventDefault(); evaluateExpression(); }
  else if (key === 'Backspace') del();
  else if (key === 'Escape') clearAll();
  else if (key === '(' || key === ')') append(key);
});

// initialize
updateDisplay();