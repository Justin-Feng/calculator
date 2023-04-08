// The calculator class
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    // Clear the records shown on the calculator
    clear() {
        this.previousOperand = '' // the upper line shown in the calculator
        this.currentOperand = '' // the lower line shown in the calculator
        this.operation = undefined
    }

    delete() {
        if(this.currentOperand !== '')
            this.deleteDigit()
        else 
            this.deleteOperation()
    }

    // Delete one digit shown on the currentOperand
    deleteDigit() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    // Delete the operation for operation change
    deleteOperation() {
        if(this.operation == null) return
        else {
            this.operation = undefined
            this.currentOperand = this.previousOperand
            this.previousOperand = ''
        }
    }

    // Add the digit to the current associated with the buttons got clicked
    appendNumber(number) {
        // the number(digit) is '.' while '.' already existed
        if(number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    // Called when a operation button clicked
    chooseOperation(operation) {
        if(this.currentOperand === '') {
            // falsly clicked on operation buttons
            if(operation !== '-') return
            // the number is negetive
            else {
                this.appendNumber('-')
                this.updateDisplay()
                return
            }
        }
        // Check existence of the previous operand, if so, do the computation before the operand choosing
        // ex. 1+1+1= will show 1+ 1 then 2+ 1 then _ 3
        if(this.previousOperand !== '') {
            this.compute()
        }
        // No previousOperand (no calculation before)
        this.operation = operation
        this.previousOperand = this.currentOperand;
        this.currentOperand = ''
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if(isNaN(prev) || isNaN(current)) return
        switch(this.operation) {
            case '+': 
                computation = prev + current
                break
            case '-': 
                computation = prev - current
                break
            case '*': 
                computation = prev * current
                break
            case '/': 
                computation = prev / current
                break
            default: 
                return
        }
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
        this.currentOperand = computation
    }

    // helper function for updateDisplay() below to deal with the 
    // ...Operand string that adds the ',' for the number
    // also allows inputs that starts with '.'
    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if(isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            })
        }
        if(decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    updateDisplay() {
        // udpate currentOperandTextElement.innerText
        if(this.currentOperand !== '-') {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        } else {
            this.currentOperandTextElement.innerText = this.currentOperand
        }
        // udpate previousOperandTextElement.innerText
        if(this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

// calculator object
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Each number button listening for "click"
// Triggered event will append the number to the currentOperand
// and call updateDisplay() function
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})


operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})


