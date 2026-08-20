let display =
    document.getElementById("display");

let historyList =
    document.getElementById("historyList");


/* ANGLE MODE */

let angleMode = "DEG";


/* ADD NUMBER */

function addNumber(number) {

    display.value += number;
}


/* ADD OPERATOR */

function addOperator(operator) {

    if (display.value === "") {
        return;
    }

    let last =
        display.value[
            display.value.length - 1
        ];

    if ("+-*/".includes(last)) {
        return;
    }

    display.value += operator;
}


/* CLEAR */

function clearDisplay() {

    display.value = "";
}


/* DELETE */

function deleteLast() {

    display.value =
        display.value.slice(0, -1);
}


/* PERCENTAGE */

function percentage() {

    if (display.value !== "") {

        try {

            display.value =
                eval(display.value) / 100;

        } catch {

            display.value = "Error";
        }
    }
}


/* CALCULATE */

function calculate() {

    if (display.value === "") {
        return;
    }

    try {

        let expression =
            display.value;

        let result =
            evaluateExpression(expression);

        addHistory(
            expression,
            result
        );

        display.value = result;

    } catch {

        display.value = "Error";

        setTimeout(() => {

            display.value = "";

        }, 1000);
    }
}


/* EVALUATE */

function evaluateExpression(expression) {

    /*
       Replace π with Math.PI
       and e with Math.E
    */

    expression =
        expression.replace(
            /π/g,
            "Math.PI"
        );

    expression =
        expression.replace(
            /(?<![a-zA-Z])e/g,
            "Math.E"
        );


    /*
       Power operator
    */

    expression =
        expression.replace(
            /\^/g,
            "**"
        );


    return eval(expression);
}


/* SCIENTIFIC FUNCTIONS */

function scientific(type) {

    if (display.value === "") {
        return;
    }


    try {

        let value =
            parseFloat(display.value);

        let result;


        /* SIN */

        if (type === "sin") {

            let angle =
                convertAngle(value);

            result =
                Math.sin(angle);
        }


        /* COS */

        else if (type === "cos") {

            let angle =
                convertAngle(value);

            result =
                Math.cos(angle);
        }


        /* TAN */

        else if (type === "tan") {

            let angle =
                convertAngle(value);

            result =
                Math.tan(angle);
        }


        /* SQUARE ROOT */

        else if (type === "sqrt") {

            result =
                Math.sqrt(value);
        }


        /* SQUARE */

        else if (type === "square") {

            result =
                value * value;
        }


        /* POWER */

        else if (type === "power") {

            display.value += "^";

            return;
        }


        /* LOG */

        else if (type === "log") {

            result =
                Math.log10(value);
        }


        /* NATURAL LOG */

        else if (type === "ln") {

            result =
                Math.log(value);
        }


        display.value =
            formatResult(result);

    } catch {

        display.value = "Error";

    }

}


/* CONSTANTS */

function addConstant(type) {

    if (type === "pi") {

        display.value += "π";

    }

    else if (type === "e") {

        display.value += "e";

    }

}


/* FORMAT RESULT */

function formatResult(result) {

    if (!Number.isFinite(result)) {

        throw new Error(
            "Invalid result"
        );
    }

    return Number(
        result.toFixed(10)
    );
}


/* ANGLE CONVERSION */

function convertAngle(value) {

    if (angleMode === "DEG") {

        return value *
            Math.PI / 180;

    }

    return value;
}


/* TOGGLE DEG / RAD */

function toggleAngleMode() {

    if (angleMode === "DEG") {

        angleMode = "RAD";

        document.getElementById(
            "angleButton"
        ).textContent = "RAD";

        document.getElementById(
            "angleText"
        ).textContent = "Radians";

    }

    else {

        angleMode = "DEG";

        document.getElementById(
            "angleButton"
        ).textContent = "DEG";

        document.getElementById(
            "angleText"
        ).textContent = "Degrees";
    }
}


/* HISTORY */

function addHistory(
    expression,
    result
) {

    let empty =
        document.querySelector(".empty");

    if (empty) {

        empty.remove();
    }


    let item =
        document.createElement("div");


    item.className =
        "history-item";


    item.textContent =
        expression +
        " = " +
        result;


    historyList.prepend(item);
}


/* CLEAR HISTORY */

function clearHistory() {

    historyList.innerHTML =
        `
        <p class="empty">
            No calculations yet
        </p>
        `;
}


/* DARK MODE */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    let button =
        document.getElementById(
            "themeButton"
        );


    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        button.textContent = "☀️";

    }

    else {

        button.textContent = "🌙";

    }
}


/* KEYBOARD */

document.addEventListener(
    "keydown",
    function(event) {

        let key = event.key;


        /* NUMBERS */

        if (
            key >= "0" &&
            key <= "9"
        ) {

            addNumber(key);
        }


        /* DECIMAL */

        else if (key === ".") {

            addNumber(".");
        }


        /* OPERATORS */

        else if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            addOperator(key);
        }


        /* POWER */

        else if (key === "^") {

            scientific("power");
        }


        /* ENTER */

        else if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();
        }


        /* BACKSPACE */

        else if (
            key === "Backspace"
        ) {

            deleteLast();
        }


        /* ESC */

        else if (
            key === "Escape"
        ) {

            clearDisplay();
        }


        /* PERCENTAGE */

        else if (key === "%") {

            percentage();
        }

    }
);