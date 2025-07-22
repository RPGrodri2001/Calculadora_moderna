/* ===== CALCULADORA ELEGANTE Y FUNCIONAL ===== */

class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    /* ===== LIMPIAR CALCULADORA ===== */
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    /* ===== ELIMINAR ÚLTIMO DÍGITO ===== */
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    /* ===== AÑADIR NÚMEROS ===== */
    appendNumber(number) {
        // Prevenir múltiples puntos decimales
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Límite de dígitos para prevenir overflow visual
        if (this.currentOperand.length >= 10) return;
        
        // Si el operando actual es '0', reemplazarlo con el nuevo número
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        
        this.updateDisplay();
    }

    /* ===== SELECCIONAR OPERACIÓN ===== */
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    /* ===== REALIZAR CÁLCULO ===== */
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError('No se puede dividir por cero');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        // Manejar resultados muy grandes
        if (computation === Infinity || computation === -Infinity) {
            this.showError('Resultado demasiado grande');
            return;
        }
        
        if (Math.abs(computation) > 999999999) {
            this.showError('Número demasiado grande');
            return;
        }

        // Redondear para evitar errores de punto flotante
        computation = Math.round((computation + Number.EPSILON) * 100000000) / 100000000;
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    /* ===== CAMBIAR SIGNO ===== */
    toggleSign() {
        if (this.currentOperand === '') return;
        
        if (this.currentOperand > 0) {
            this.currentOperand = -this.currentOperand;
        } else {
            this.currentOperand = Math.abs(this.currentOperand);
        }
        
        this.updateDisplay();
    }

    /* ===== MOSTRAR ERRORES ===== */
    showError(message) {
        this.currentOperandTextElement.innerText = 'Error';
        this.previousOperandTextElement.innerText = message;
        
        // Limpiar después de 2 segundos
        setTimeout(() => {
            this.clear();
        }, 2000);
    }

    /* ===== FORMATEAR NÚMEROS PARA MOSTRAR ===== */
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('es', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            // Limitar decimales mostrados para que quepa en pantalla
            const limitedDecimals = decimalDigits.substring(0, 6);
            return `${integerDisplay}.${limitedDecimals}`;
        } else {
            return integerDisplay;
        }
    }

    /* ===== ACTUALIZAR PANTALLA ===== */
    updateDisplay() {
        if (this.currentOperand === '') {
            this.currentOperandTextElement.innerText = '0';
        } else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        }
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

/* ===== INICIALIZACIÓN ===== */
document.addEventListener('DOMContentLoaded', function() {
    const previousOperandTextElement = document.getElementById('previousOperand');
    const currentOperandTextElement = document.getElementById('currentOperand');

    // Crear instancia de la calculadora
    window.calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
});

/* ===== SOPORTE COMPLETO DE TECLADO ===== */
document.addEventListener('keydown', function(event) {
    // Prevenir acciones por defecto
    if (['+', '-', '*', '/', '=', 'Enter', 'Escape'].includes(event.key)) {
        event.preventDefault();
    }
    
    // Números
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
    }
    
    // Punto decimal
    if (event.key === '.') {
        calculator.appendNumber('.');
    }
    
    // Operaciones
    if (event.key === '+') {
        calculator.chooseOperation('+');
    }
    if (event.key === '-') {
        calculator.chooseOperation('-');
    }
    if (event.key === '*') {
        calculator.chooseOperation('×');
    }
    if (event.key === '/') {
        calculator.chooseOperation('÷');
    }
    if (event.key === '%') {
        calculator.chooseOperation('%');
    }
    
    // Igual y Enter
    if (event.key === '=' || event.key === 'Enter') {
        calculator.compute();
    }
    
    // Limpiar
    if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        calculator.clear();
    }
    
    // Borrar
    if (event.key === 'Backspace') {
        calculator.delete();
    }
});

/* ===== PREVENIR ZOOM EN DISPOSITIVOS MÓVILES ===== */
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);