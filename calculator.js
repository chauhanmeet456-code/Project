let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";
let isResult = false;

Array.from(buttons).forEach(button => {
    button.addEventListener('click', (e) => {

        if (e.target.innerHTML == '=') {
            string = eval(string);
            input.value = string;
            isResult = true;
        }

        else if (e.target.innerHTML == 'AC') {
            string = "";
            input.value = "";
            isResult = false;
        }

        else if (e.target.innerHTML == 'DEL') {
            string = string.substring(0, string.length - 1);
            input.value = string;
        }

        else {
            if (isResult) {
                string = e.target.innerHTML; // new calculation
                isResult = false;
            } else {
                string += e.target.innerHTML;
            }
            input.value = string;
        }
    });
});