// Basic math operators:
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}

function sqrt(a) {
    return Math.sqrt(a);
}

function exponent(a, b) {
    return a**b;
}

// Function to call previous basic operators.
function operate(operator, a, b) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        case "√":
            return sqrt(a);
        case "^":
            return exponent(a, b);
    }
}

// Function to convert a number to Scientific Notation
function convertToScientificNotation(input) {
    let decimal_pos = input.indexOf(".");
    input = input.replace(".", "");
    mantissa = input[0] + "." + input.slice(1, input.length);
    exp = decimal_pos - 1;

    if (exp > 0) {
        // Case where it makes sense to show 10^exp

        // We drop decimals that overflow screen
        if (mantissa.length > 8) {
            mantissa = mantissa.slice(0, 8)
        }
        
        // If exponent is too high, we show error
        if (exp.length > 2) {
            output = "<tenpower>Overflow error<tenpower>";
        } else {
            output = `${mantissa}<tenpower>x10<sup>${exp}<sup><tenpower>`;
        }
    } else {
        // Case where we don't need to show 10^0
        output = mantissa.slice(0, 10)
    }
    return output;
}

// Functions to manage display when pressing keys

function removeTransition(e){
    this.classList.remove('pressed');
}

function clearDisplays() {
    displayupper.textContent = "";
    displaylower.textContent = "0.";
    buffer = "0."
}

function changeSignDisplay() {
    console.log(displayupper.textContent[0])
}

function addNumberToUpperDisplay(input) {
    if ((displayupper.textContent == "")&(input == ".")){
        input = "0."
    }
    if (displayupper.textContent.length < 18){
        displayupper.textContent += input;
    }
    buffer = displayupper.textContent;
}

function deleteLastCharacter() {
    current_content = displayupper.textContent
    displayupper.textContent = current_content.slice(0, current_content.length - 1)
}

function addNumberToLowerDisplay(input) {
    if (!input.includes(".")) {
        input += "."
    }
    if (input.length < 10){
        displaylower.textContent = input;
    } else {
        input_sn = convertToScientificNotation(input);
        displaylower.innerHTML = input_sn;
    }
}

function executeOperation() {
    if (operator === null) {
        addNumberToLowerDisplay(buffer);
    }
}

function manageKey(input) {
    input = input.toLowerCase();
    if (["a", "ac"].includes(input)) {
        clearDisplays();
    }
    if (input == "c") {
        deleteLastCharacter();
    }
    if ((input === ".")&(displayupper.textContent.includes("."))){
        return;
    }
    if (input == "=") {
        executeOperation();
    }
    if (valid_operations.includes(input)) {
        operator = input;
    }
    if (valid_numbers.includes(input)) {
        addNumberToUpperDisplay(input)
    }
}

function pressKey() {
    manageKey(this.textContent)
}

// Define useful arrays
let valid_numbers = [
    "0","1","2","3","4","5","6","7","8","9","."
];
let valid_operations = [
    "+","*","-","/","+","^", "√"
];

// Find elements and add listeners
let displayupper = document.querySelector(".displayupper")
let displaylower = document.querySelector(".displaylower")
let buffer = "0.";
let prev_op = null;
let operator = null;


window.addEventListener('keydown', function(e){
    let match = e.key.toLowerCase();
    if (e.key == "Enter") {
        match = "=";
    }
    if (e.key == "Backspace") {
        match = "c";
    }
    key = document.querySelector(`button[data-key="${match}"]`);
    if (!key) return;
    key.classList.add('pressed');
    manageKey(match);
});

const numbers = document.querySelectorAll('button');
numbers.forEach(key => key.addEventListener('click', pressKey));
numbers.forEach(key => key.addEventListener('transitionend', removeTransition));

