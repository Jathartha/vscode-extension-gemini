// Sample JavaScript file for testing the AI Code Assistant extension

/**
 * A simple calculator class that demonstrates basic JavaScript functionality
 * This file can be used to test the @filename attachment feature
 */
class Calculator {
    constructor() {
        this.history = [];
    }

    /**
     * Adds two numbers together
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} The sum of a and b
     */
    add(a, b) {
        const result = a + b;
        this.history.push(`${a} + ${b} = ${result}`);
        return result;
    }

    /**
     * Subtracts the second number from the first
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} The difference of a and b
     */
    subtract(a, b) {
        const result = a - b;
        this.history.push(`${a} - ${b} = ${result}`);
        return result;
    }

    /**
     * Multiplies two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} The product of a and b
     */
    multiply(a, b) {
        const result = a * b;
        this.history.push(`${a} * ${b} = ${result}`);
        return result;
    }

    /**
     * Divides the first number by the second
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} The quotient of a and b
     * @throws {Error} When b is zero
     */
    divide(a, b) {
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        const result = a / b;
        this.history.push(`${a} / ${b} = ${result}`);
        return result;
    }

    /**
     * Gets the calculation history
     * @returns {string[]} Array of calculation strings
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clears the calculation history
     */
    clearHistory() {
        this.history = [];
    }
}

// Example usage
const calc = new Calculator();

console.log(calc.add(5, 3));      // Output: 8
console.log(calc.subtract(10, 4)); // Output: 6
console.log(calc.multiply(2, 7));  // Output: 14
console.log(calc.divide(15, 3));   // Output: 5

console.log('Calculation History:', calc.getHistory());

// This file can be used to test the AI Code Assistant extension
// Try asking: "@sample-test.js - Can you review this code and suggest improvements?" 