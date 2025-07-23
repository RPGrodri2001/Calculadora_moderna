// Variables globales
let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForOperand = false;
let memory = 0;

// Referencias DOM
let display, operationDisplay, memoryDisplay, memoryIndicator;

// Función para renderizar la calculadora
function renderCalculator() {
    document.querySelector('.calculator').innerHTML = `
        <h1 class="title">Calculadora de RPG ❤</h1>
        <p class="subtitle">Fácil, rápida y profesional</p>
        
        <div class="memory-section">
            <div class="memory-display" id="memoryDisplay">Memoria: 0</div>
            <div class="memory-indicator" id="memoryIndicator"></div>
        </div>
        
        <div class="display-container">
            <div class="operation-display" id="operationDisplay"></div>
            <input type="text" class="display" id="display" value="0" readonly>
        </div>

        <div class="buttons">
            <button class="btn btn-memory" onclick="clearMemory()">MC</button>
            <button class="btn btn-memory" onclick="recallMemory()">MR</button>
            <button class="btn btn-memory" onclick="addToMemory()">M+</button>
            <button class="btn btn-memory" onclick="subtractFromMemory()">M-</button>

            <button class="btn btn-function" onclick="sqrt()">√</button>
            <button class="btn btn-function" onclick="power()">x²</button>
            <button class="btn btn-function" onclick="percentage()">%</button>
            <button class="btn btn-clear" onclick="clearDisplay()">C</button>

            <button class="btn btn-number" onclick="appendNumber('7')">7</button>
            <button class="btn btn-number" onclick="appendNumber('8')">8</button>
            <button class="btn btn-number" onclick="appendNumber('9')">9</button>
            <button class="btn btn-operator" onclick="setOperator('÷')">÷</button>

            <button class="btn btn-number" onclick="appendNumber('4')">4</button>
            <button class="btn btn-number" onclick="appendNumber('5')">5</button>
            <button class="btn btn-number" onclick="appendNumber('6')">6</button>
            <button class="btn btn-operator" onclick="setOperator('×')">×</button>

            <button class="btn btn-number" onclick="appendNumber('1')">1</button>
            <button class="btn btn-number" onclick="appendNumber('2')">2</button>
            <button class="btn btn-number" onclick="appendNumber('3')">3</button>
            <button class="btn btn-operator" onclick="setOperator('-')">-</button>

            <button class="btn btn-number btn-zero" onclick="appendNumber('0')">0</button>
            <button class="btn btn-number" onclick="appendDecimal()">.</button>
            <button class="btn btn-operator" onclick="setOperator('+')">+</button>

            <button class="btn btn-equals" onclick="calculate()">=</button>
        </div>
    `;

    // Añadir botón de ayuda y modal
    document.body.insertAdjacentHTML('beforeend', `
        <button class="help-button" onclick="toggleHelp()">?</button>

        <div class="help-modal" id="helpModal">
            <div class="help-content">
                <div class="help-header">
                    <h2>📚 Guía de la Calculadora</h2>
                    <button class="close-button" onclick="toggleHelp()">×</button>
                </div>

                <div class="help-section">
                    <h3>🧠 Funciones de Memoria</h3>
                    <div class="memory-grid">
                        <div class="memory-item">
                            <div class="memory-button">MC</div>
                            <div>Limpiar memoria</div>
                        </div>
                        <div class="memory-item">
                            <div class="memory-button">MR</div>
                            <div>Recuperar memoria</div>
                        </div>
                        <div class="memory-item">
                            <div class="memory-button">M+</div>
                            <div>Sumar a memoria</div>
                        </div>
                        <div class="memory-item">
                            <div class="memory-button">M-</div>
                            <div>Restar de memoria</div>
                        </div>
                    </div>
                    <p><em>💡 La memoria guarda números para usar después</em></p>
                </div>

                <div class="help-section">
                    <h3>⌨️ Atajos de Teclado</h3>
                    <div class="keyboard-shortcuts">
                        <div class="shortcut-item">
                            <span>Números</span>
                            <span class="shortcut-key">0-9</span>
                        </div>
                        <div class="shortcut-item">
                            <span>Operaciones</span>
                            <span class="shortcut-key">+ - * /</span>
                        </div>
                        <div class="shortcut-item">
                            <span>Calcular</span>
                            <span class="shortcut-key">Enter</span>
                        </div>
                        <div class="shortcut-item">
                            <span>Limpiar</span>
                            <span class="shortcut-key">Esc</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Obtener referencias DOM
    display = document.getElementById('display');
    operationDisplay = document.getElementById('operationDisplay');
    memoryDisplay = document.getElementById('memoryDisplay');
    memoryIndicator = document.getElementById('memoryIndicator');

    // Configurar eventos del modal
    document.getElementById('helpModal').addEventListener('click', function(e) {
        if (e.target === this) toggleHelp();
    });
}

// Funciones de la calculadora
function updateDisplay() {
    if (!display) return;
    
    display.value = currentInput;
    
    if (operator && previousInput !== null) {
        operationDisplay.textContent = `${previousInput} ${operator}`;
    } else {
        operationDisplay.textContent = '';
    }
    
    memoryDisplay.textContent = `Memoria: ${memory}`;
    memoryIndicator.classList.toggle('active', memory !== 0);
}

function appendNumber(number) {
    if (waitingForOperand) {
        currentInput = number;
        waitingForOperand = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (waitingForOperand) {
        currentInput = '0.';
        waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

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

function performCalculation(firstOperand, secondOperand, operation) {
    switch (operation) {
        case '+': return firstOperand + secondOperand;
        case '-': return firstOperand - secondOperand;
        case '×': return firstOperand * secondOperand;
        case '÷': return secondOperand !== 0 ? firstOperand / secondOperand : 0;
        default: return secondOperand;
    }
}

function clearDisplay() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForOperand = false;
    updateDisplay();
    showFeedback('Limpiado');
}

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

// Feedback visual
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
    if (modal) {
        modal.classList.toggle('active');
    }
}

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

// Inicialización
function init() {
    renderCalculator();
    updateDisplay();
    setTimeout(() => showFeedback('¡Lista! 🎮'), 500);
}

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}