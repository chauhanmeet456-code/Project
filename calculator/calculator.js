let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";
let isResult = false;

// safe calculate function
function calculate(expr) {
    try {
        return Function('"use strict";return (' + expr + ')')();
    } catch {
        return "Error";
    }
}

Array.from(buttons).forEach(button => {
    button.addEventListener('click', (e) => {

        let value = e.target.innerHTML;

        // convert symbols
        if (value === '×') value = '*';
        if (value === '÷') value = '/';

        if (value == '=') {
            if (string === "") return;

            let result = calculate(string);

            input.value = result;
            string = result.toString();
            isResult = true;
        }

        else if (value == 'AC') {
            string = "";
            input.value = "";
            isResult = false;
        }

        else if (value == 'DEL') {
            if (!isResult) {
                string = string.slice(0, -1);
                input.value = string;
            }
        }

        else if (value == '%') {
            if (string !== "") {
                string += "/100";
                input.value = string;
            }
        }

        else {
            let operators = ['+', '-', '*', '/'];
            let lastChar = string[string.length - 1];

            // prevent double operator
            if (operators.includes(value) && operators.includes(lastChar)) {
                string = string.slice(0, -1) + value;
            } 
            else {

                // 🔥 main fix (continuous calculation)
                if (isResult) {
                    if (operators.includes(value)) {
                        string += value;   // continue calculation
                    } else {
                        string = value;   // new input
                    }
                    isResult = false;
                } 
                else {
                    string += value;
                }
            }

            // display symbols
            input.value = string
                .replace(/\*/g, '×')
                .replace(/\//g, '÷');
        }
    });
});