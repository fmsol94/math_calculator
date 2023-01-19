// Basic math operators:
function get_decimals(a) {
    let decimals_a = 0;
    if (a.includes(".")) {
        decimals_a = a.length - a.indexOf(".") - 1;
    }
    return decimals_a;
}

function round(num, n_decimals) {
    let factor = 100**n_decimals;
    return Math.round(num * factor) / factor;
}

function add(a, b) {
    let decimals_a = get_decimals(a);
    a = parseFloat(a);
    
    let decimals_b = get_decimals(b);
    b = parseFloat(b);
    
    let c = a + b;
    c = round(c, Math.max(decimals_a, decimals_b)).toString();
    return c
}

function subtract(a, b) {
    let decimals_a = get_decimals(a);
    a = parseFloat(a);
    
    let decimals_b = get_decimals(b);
    b = parseFloat(b);
    
    let c = a - b;
    c = round(c, Math.max(decimals_a, decimals_b)).toString();
    return c
}

function multiply(a, b) {
    let decimals_a = get_decimals(a);
    a = parseFloat(a);
    
    let decimals_b = get_decimals(b);
    b = parseFloat(b);
    
    let c = a * b;
    c = round(c, decimals_a + decimals_b).toString();
    return c
}

function divide(a, b) {
    return (a / b).toString();
}

function sqrt(a) {
    return Math.sqrt(a).toString();
}

function exponent(a, b) {
    return (a**b).toString();
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

function clearUpperDisplay() {
    displayupper.textContent = "";
}

function clearLowerDisplay() {
    displaylower.textContent = "0.";
}

function resetCalc(clear_upper=1, clear_lower=1) {
    if (clear_upper) {clearUpperDisplay()};
    if (clear_lower) {clearLowerDisplay()};
    buffers = [null, null];
    operator = null;
    buff_idx = 0;
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
    buffers[buff_idx] = displayupper.textContent;
}

function deleteLastCharacter() {
    current_content = displayupper.textContent
    displayupper.textContent = current_content.slice(0, current_content.length - 1)
    buffers[buff_idx] = displayupper.textContent;
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
    if ((operator === null)|(buffers.includes(null))) {
        let index = (buffers[buff_idx] === null)? +!buff_idx: buff_idx;
        addNumberToLowerDisplay(buffers[index]);
    } else {
        result = operate(operator, buffers[0], buffers[1]);
        addNumberToLowerDisplay(result);
        buffers[0] = result;
        buffers[1] = null;
        buff_idx = 1;
    }
}

function executeSqrtOperation() {
    buffers[buff_idx] = sqrt(buffers[buff_idx]);
    displayupper.textContent = "√" + displayupper.textContent;
    addNumberToLowerDisplay(buffers[buff_idx]);
}

function changeSign() {
    let index = (buffers[buff_idx] === null)? +!buff_idx: buff_idx;
    buffers[index] = (-1 * parseFloat(buffers[index])).toString();
    clearUpperDisplay();
    clearLowerDisplay();
    addNumberToUpperDisplay(buffers[index]);
    addNumberToLowerDisplay(buffers[index]);
}

function manageKey(input) {
    console.log(input)
    console.log(buffers)
    if (buffers.includes("Infinity")|buffers.includes("NaN")) {
        resetCalc(1, 0);
    }

    if ((buffers[0] == null)&(buffers[1] != null)) {
        buffers = [buffers[1], null];
    }

    if (clear_upper_next) {
        clearUpperDisplay();
        clear_upper_next = false;
    }

    input = input.toLowerCase();
    if (["a", "ac"].includes(input)) {
        resetCalc();
    }

    if ((input == "+/-") & ((buffers[0] !== null) | (buffers[1] !== null))) {
        changeSign();
    }

    if ((input == "sqrt") & (buffers[buff_idx] !== null)) {
        executeSqrtOperation();
    }

    if (input == "c") {
        deleteLastCharacter();
    }

    if ((input === ".")&(displayupper.textContent.includes("."))){
        return;
    }

    if (input == "=") {
        executeOperation();
        clear_upper_next = true;
    }

    if (valid_operations.includes(input)) {
        if ((buffers[0] !== null)&(buffers[1] !== null)) {
            executeOperation();
            operator = input;
            clear_upper_next = true;
        } else {
            if (buffers[0] !== null) {
                operator = input;
                buff_idx = Math.min(1, buff_idx+2);
                clear_upper_next = true;
            }
        }
    }

    if (valid_numbers.includes(input)) {
        addNumberToUpperDisplay(input)
    }
}

function pressKey() {
    let match = this.textContent;
    match = (match == "÷")? "/": match;
    match = (match == "x")? "*": match;
    match = (match == "√")? "sqrt": match;
    manageKey(match)
}

// Define useful arrays
let valid_numbers = [
    "0","1","2","3","4","5","6","7","8","9","."
];
let valid_operations = [
    "+","*","-","/","+","^", 
];

// Find elements and add listeners
let displayupper = document.querySelector(".displayupper")
let displaylower = document.querySelector(".displaylower")
let buffers = [null, null];
let buff_idx = 0;
let clear_upper_next = false;
let operator = null;


window.addEventListener('keydown', function(e){
    let match = e.key.toLowerCase();
    if (e.key == "Enter") {
        match = "=";
    }
    if (e.key == "Backspace") {
        match = "c";
    }
    if (e.key.toLowerCase() == "e") {
        match = "^";
    }
    if (e.key.toLowerCase() == "s") {
        match = "sqrt";
    }
    key = document.querySelector(`button[data-key="${match}"]`);
    if (!key) return;
    key.classList.add('pressed');
    manageKey(match);
});

const numbers = document.querySelectorAll('button');
numbers.forEach(key => key.addEventListener('click', pressKey));
numbers.forEach(key => key.addEventListener('transitionend', removeTransition));

