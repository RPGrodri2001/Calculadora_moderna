        // Variables globales
        let currentInput = '0';
        let previousInput = null;
        let operator = null;
        let waitingForOperand = false;
        let memory = 0;

        // Referencias al DOM
        const display = document.getElementById('display');
        const operationDisplay = document.getElementById('operationDisplay');
        const memoryDisplay = document.getElementById('memoryDisplay');
        const memoryIndicator = document.getElementById('memoryIndicator');

        // Actualizar pantalla con mejor formato
        function updateDisplay() {
            // Formatear número para mostrar
            const value = parseFloat(currentInput);
            if (!isNaN(value) && value.toString().length > 12) {
                display.value = value.toExponential(6);
            } else {
                display.value = currentInput;
            }

            // Mostrar operación actual
            if (operator && previousInput !== null) {
                operationDisplay.textContent = `${formatNumber(previousInput)} ${operator}`;
            } else {
                operationDisplay.textContent = '';
            }

            // Actualizar memoria
            memoryDisplay.textContent = `Memoria: ${formatNumber(memory)}`;
            memoryIndicator.classList.toggle('active', memory !== 0);
        }

        // Formatear números para mejor legibilidad
        function formatNumber(num) {
            if (Math.abs(num) >= 1000000) {
                return num.toExponential(2);
            } else if (Math.abs(num) >= 1000) {
                return num.toLocaleString('es-ES', { maximumFractionDigits: 6 });
            }
            return num.toString();
        }

        // Añadir número con validación mejorada
        function appendNumber(number) {
            if (waitingForOperand) {
                currentInput = number;
                waitingForOperand = false;
            } else {
                if (currentInput === '0') {
                    currentInput = number;
                } else if (currentInput.length < 12) {
                    currentInput += number;
                }
            }
            updateDisplay();
        }

        // Añadir decimal con validación
        function appendDecimal() {
            if (waitingForOperand) {
                currentInput = '0.';
                waitingForOperand = false;
            } else if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
            }
            updateDisplay();
        }

        // Establecer operador con feedback visual
        function setOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);

            if (previousInput === null) {
                previousInput = inputValue;
            } else if (operator) {
                const currentValue = previousInput || 0;
                const newValue = performCalculation(currentValue, inputValue, operator);

                if (newValue === null) return; // Error en cálculo

                currentInput = String(newValue);
                previousInput = newValue;
                updateDisplay();
            }

            waitingForOperand = true;
            operator = nextOperator;
            updateDisplay();
        }

        // Calcular con mejor manejo de errores
        function calculate() {
            if (operator && previousInput !== null && !waitingForOperand) {
                const inputValue = parseFloat(currentInput);
                const newValue = performCalculation(previousInput, inputValue, operator);
                
                if (newValue === null) return; // Error en cálculo

                // Mostrar feedback visual
                showFeedback('Calculado');
                
                currentInput = String(newValue);
                previousInput = null;
                operator = null;
                waitingForOperand = true;
                updateDisplay();
            }
        }

        // Realizar cálculo con validaciones
        function performCalculation(firstOperand, secondOperand, operation) {
            let result;
            
            switch (operation) {
                case '+':
                    result = firstOperand + secondOperand;
                    break;
                case '-':
                    result = firstOperand - secondOperand;
                    break;
                case '×':
                    result = firstOperand * secondOperand;
                    break;
                case '÷':
                    if (secondOperand === 0) {
                        showError('No se puede dividir por cero');
                        return null;
                    }
                    result = firstOperand / secondOperand;
                    break;
                default:
                    return secondOperand;
            }

            // Validar resultado
            if (!isFinite(result)) {
                showError('Resultado demasiado grande');
                return null;
            }

            // Redondear para evitar errores de punto flotante
            return Math.round((result + Number.EPSILON) * 1e10) / 1e10;
        }

        // Limpiar con animación
        function clearDisplay() {
            currentInput = '0';
            previousInput = null;
            operator = null;
            waitingForOperand = false;
            updateDisplay();
            showFeedback('Limpiado');
        }

        // Funciones matemáticas con validación
        function sqrt() {
            const value = parseFloat(currentInput);
            if (value < 0) {
                showError('No se puede calcular √ de número negativo');
                return;
            }
            currentInput = String(Math.sqrt(value));
            waitingForOperand = true;
            updateDisplay();
            showFeedback('√ calculada');
        }

        function power() {
            const value = parseFloat(currentInput);
            const result = value * value;
            if (!isFinite(result)) {
                showError('Resultado demasiado grande');
                return;
            }
            currentInput = String(result);
            waitingForOperand = true;
            updateDisplay();
            showFeedback('Cuadrado calculado');
        }

        function percentage() {
            const value = parseFloat(currentInput);
            currentInput = String(value / 100);
            waitingForOperand = true;
            updateDisplay();
            showFeedback('% calculado');
        }

        // Funciones de memoria con feedback
        function clearMemory() {
            memory = 0;
            updateDisplay();
            showFeedback('Memoria limpiada');
        }

        function recallMemory() {
            currentInput = String(memory);
            waitingForOperand = true;
            updateDisplay();
            showFeedback('Memoria recuperada');
        }

        function addToMemory() {
            memory += parseFloat(currentInput);
            updateDisplay();
            showFeedback('Sumado a memoria');
        }

        function subtractFromMemory() {
            memory -= parseFloat(currentInput);
            updateDisplay();
            showFeedback('Restado de memoria');
        }

        // Mostrar feedback visual
        function showFeedback(message) {
            const feedback = document.createElement('div');
            feedback.className = 'feedback';
            feedback.textContent = message;
            document.querySelector('.calculator').appendChild(feedback);
            
            setTimeout(() => {
                feedback.remove();
            }, 2000);
        }

        // Mostrar errores
        function showError(message) {
            operationDisplay.textContent = `❌ ${message}`;
            operationDisplay.classList.add('error');
            display.classList.add('error');
            
            setTimeout(() => {
                operationDisplay.classList.remove('error');
                display.classList.remove('error');
                updateDisplay();
            }, 2000);
        }

        // Soporte de teclado mejorado
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            // Prevenir comportamientos por defecto
            if (['/', '*', '-', '+', '=', 'Enter'].includes(key)) {
                event.preventDefault();
            }
            
            if (key >= '0' && key <= '9') {
                appendNumber(key);
            } else if (key === '.' || key === ',') {
                appendDecimal();
            } else if (key === '+') {
                setOperator('+');
            } else if (key === '-') {
                setOperator('-');
            } else if (key === '*') {
                setOperator('×');
            } else if (key === '/') {
                setOperator('÷');
            } else if (key === 'Enter' || key === '=') {
                calculate();
            } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                clearDisplay();
            } else if (key === 'Backspace') {
                if (currentInput.length > 1 && !waitingForOperand) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                updateDisplay();
            } else if (key === '%') {
                percentage();
            }
        });

        // Función para mostrar/ocultar ayuda
        function toggleHelp() {
            const modal = document.getElementById('helpModal');
            modal.classList.toggle('active');
        }

        // Cerrar modal al hacer clic fuera
        document.getElementById('helpModal').addEventListener('click', function(e) {
            if (e.target === this) {
                toggleHelp();
            }
        });

        // Inicializar
        updateDisplay();
        
        // Mensaje de bienvenida
        setTimeout(() => {
            showFeedback('¡Calculadora lista! 🎮');
        }, 500);
