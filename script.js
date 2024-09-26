let streak = getCookie("streak") ? parseInt(getCookie("streak")) : 0;
let currentProblem = {};

function generateProblem() {
    let difficulty = Math.floor(streak / 5) + 1;
    let num1 = Math.floor(Math.random() * 10 * difficulty);
    let num2 = Math.floor(Math.random() * 10 * difficulty);
    let operator = Math.random() > 0.5 ? '+' : '-';
    currentProblem = {
        num1: num1,
        num2: num2,
        operator: operator,
        answer: operator === '+' ? num1 + num2 : num1 - num2
    };
    document.getElementById('problem').innerText = `${num1} ${operator} ${num2} = ?`;
}

function checkAnswer() {
    let userAnswer = parseInt(document.getElementById('answer').value);
    let feedback = document.getElementById('feedback');
    if (userAnswer === currentProblem.answer) {
        streak++;
        setCookie("streak", streak, 365);
        feedback.innerText = "¡Correcto!";
        feedback.style.color = "green";
    } else {
        streak = 0;
        setCookie("streak", streak, 365);
        feedback.innerText = "Incorrecto. La racha se ha reiniciado.";
        feedback.style.color = "red";
    }
    document.getElementById('answer').value = '';
    updateStreak();
    generateProblem();
}

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
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
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
    generateProblem();
}