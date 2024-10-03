let streak = getCookie("streak") ? parseInt(getCookie("streak")) : 0;
let currentProblem = getCookie("currentProblem") ? JSON.parse(getCookie("currentProblem")) : {};

document.addEventListener('DOMContentLoaded', function() {
    const cookieCard = document.querySelector('.cookie-card');
    const allowCookieButton = document.getElementById('allowcokkie');

    if (localStorage.getItem('cookiesAccepted') !== 'true') {
        cookieCard.style.display = 'block';
    }

    allowCookieButton.addEventListener('click', function() {
        cookieCard.style.display = 'none';
        localStorage.setItem('cookiesAccepted', 'true');
    });
});

function generateProblem() {
    let difficulty = Math.floor(Math.random() * (streak + 1)) + 1;
    let num1 = Math.floor(Math.random() * 10 * difficulty);
    let num2 = Math.floor(Math.random() * 10 * difficulty);
    let operators = ['+', '-', '*', '/', '^', '√'];
    let operator = operators[Math.floor(Math.random() * operators.length)];
    let answer;

    switch (operator) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
        case '/':
            num2 = num2 === 0 ? 1 : num2; // distinto de 0
            answer = num1 / num2;
            if (!Number.isInteger(answer)) {
                answer = Math.floor(answer);
                num1 = answer * num2; // división exacta
            }
            break;
        case '^':
            num2 = Math.floor(Math.random() * 6); // potencia entre 0 y 5
            answer = Math.pow(num1, num2);
            break;
        case '√':
            answer = Math.floor(Math.sqrt(num1));
            num1 = answer * answer;
            num2 = 2;
            break;
    }

    currentProblem = {
        num1: num1,
        num2: num2,
        operator: operator,
        answer: answer
    };

    setCookie("currentProblem", JSON.stringify(currentProblem), 365);

    let problemText = operator === '√' ? `√${num1} = ?` : `${num1} ${operator} ${num2} = ?`;
    document.getElementById('problem').innerText = problemText;
}

function checkAnswer() {
    let userAnswer = parseInt(document.getElementById('answer').value);
    let feedback = document.getElementById('feedback');
    let answerValue = document.getElementById('answer').value;
    let button = document.getElementById('submitBtn');

    if (answerValue.trim() === "") {
        feedback.innerText = "Por favor, ingrese una respuesta.";
        feedback.style.color = "red";
        button.classList.add('error');
        setTimeout(() => {
            button.classList.remove('error');
        }, 1000);
        return;
    }

    if (userAnswer === currentProblem.answer) {
        streak++;
        setCookie("streak", streak, 365);
        feedback.innerText = "";
        feedback.style.color = "green";
        button.classList.add('success');
        setTimeout(() => {
            button.classList.remove('success');
        }, 1000);
    } else {
        streak = 0;
        setCookie("streak", streak, 365);
        feedback.innerText = "";
        feedback.style.color = "red";
        button.classList.add('error');
        setTimeout(() => {
            button.classList.remove('error');
        }, 1000);
    }

    document.getElementById('answer').value = '';
    updateStreak();
    generateProblem();
}

document.getElementById('submitBtn').addEventListener('click', checkAnswer);

function updateStreak() {
    document.getElementById('streak').innerText = `Racha: ${streak}`;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
}

window.onload = function () {
    updateStreak();
    if (Object.keys(currentProblem).length === 0) {
        generateProblem();
    } else {
        let problemText = currentProblem.operator === '√' ? `√${currentProblem.num1} = ?` : `${currentProblem.num1} ${currentProblem.operator} ${currentProblem.num2} = ?`;
        document.getElementById('problem').innerText = problemText;
    }
}