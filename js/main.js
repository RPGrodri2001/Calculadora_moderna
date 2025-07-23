// Variables globales
let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForOperand = false;
let memory = 0;

// Referencias DOM
const display = document.getElementById('display');
const operationDisplay = document.getElementById('operationDisplay');
const memoryDisplay = document.getElementById('memoryDisplay');
const memoryIndicator = document.getElementById('memoryIndicator');

// Actualizar pantalla
function updateDisplay() {
    display.value = currentInput;
    
    if (operator && previousInput !== null) {
        operationDisplay.textContent = `${previousInput} ${operator}`;
    } else {
        operationDisplay.textContent = '';
    }
    
    memoryDisplay.textContent = `Memoria: ${memory}`;
    memoryIndicator.classList.toggle('active', memory !== 0);
}

// Añadir número
function appendNumber(number) {
    if (waitingForOperand) {
        currentInput = number;
        waitingForOperand = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

// Añadir decimal
function appendDecimal() {
    if (waitingForOperand) {
        currentInput = '0.';
        waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

// Establecer operador
function setOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const newValue = performCalculation(previousInput, inputValue, operator);
        currentInput = String(newValue);
        previousInput = newValue;
    }

    waitingForOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Calcular
function calculate() {
    if (operator && previousInput !== null && !waitingForOperand) {
        const inputValue = parseFloat(currentInput);
        const newValue = performCalculation(previousInput, inputValue, operator);
        
        currentInput = String(newValue);
        previousInput = null;
        operator = null;
        waitingForOperand = true;
        updateDisplay();
        showFeedback('✓');
    }
}

// Realizar cálculo
function performCalculation(firstOperand, secondOperand, operation) {
    switch (operation) {
        case '+': return firstOperand + secondOperand;
        case '-': return firstOperand - secondOperand;
        case '×': return firstOperand * secondOperand;
        case '÷': return secondOperand !== 0 ? firstOperand / secondOperand : 0;
        default: return secondOperand;
    }
}

// Limpiar
function clearDisplay() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForOperand = false;
    updateDisplay();
    showFeedback('Limpiado');
}

// Funciones matemáticas
function sqrt() {
    const value = parseFloat(currentInput);
    if (value >= 0) {
        currentInput = String(Math.sqrt(value));
        waitingForOperand = true;
        updateDisplay();
        showFeedback('√');
    }
}

function power() {
    const value = parseFloat(currentInput);
    currentInput = String(value * value);
    waitingForOperand = true;
    updateDisplay();
    showFeedback('x²');
}

function percentage() {
    const value = parseFloat(currentInput);
    currentInput = String(value / 100);
    waitingForOperand = true;
    updateDisplay();
    showFeedback('%');
}

// Funciones de memoria
function clearMemory() {
    memory = 0;
    updateDisplay();
    showFeedback('MC');
}

function recallMemory() {
    currentInput = String(memory);
    waitingForOperand = true;
    updateDisplay();
    showFeedback('MR');
}

function addToMemory() {
    memory += parseFloat(currentInput);
    updateDisplay();
    showFeedback('M+');
}

function subtractFromMemory() {
    memory -= parseFloat(currentInput);
    updateDisplay();
    showFeedback('M-');
}

// Mostrar feedback
function showFeedback(message) {
    const existing = document.querySelector('.feedback');
    if (existing) existing.remove();
    
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.textContent = message;
    document.querySelector('.calculator').appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 2000);
}

// Modal de ayuda
function toggleHelp() {
    const modal = document.getElementById('helpModal');
    modal.classList.toggle('active');
}

// Cerrar modal al hacer clic fuera
document.getElementById('helpModal').addEventListener('click', function(e) {
    if (e.target === this) toggleHelp();
});

// Soporte de teclado
document.addEventListener('keydown', function(e) {
    const key = e.key;
    
    if (key >= '0' && key <= '9') appendNumber(key);
    else if (key === '.') appendDecimal();
    else if (key === '+') setOperator('+');
    else if (key === '-') setOperator('-');
    else if (key === '*') setOperator('×');
    else if (key === '/') { e.preventDefault(); setOperator('÷'); }
    else if (key === 'Enter' || key === '=') { e.preventDefault(); calculate(); }
    else if (key === 'Escape') clearDisplay();
    else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});

// Inicializar
updateDisplay();
setTimeout(() => showFeedback('¡Lista! 🎮'), 500);