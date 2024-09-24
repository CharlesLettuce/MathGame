let streak = 0;

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function generateProblem() {
    let num1, num2, operator;
    if (streak > 6) {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        operator = ['+', '-', '*', '/', '^', '%'][Math.floor(Math.random() * 6)];
    } else {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = ['+', '-', '*', '/', '^'][Math.floor(Math.random() * 5)];
    }

    let problem, solution;
    switch (operator) {
        case '+':
            problem = `${num1} + ${num2}`;
            solution = num1 + num2;
            break;
        case '-':
            problem = `${num1} - ${num2}`;
            solution = num1 - num2;
            break;
        case '*':
            problem = `${num1} * ${num2}`;
            solution = num1 * num2;
            break;
        case '/':
            problem = `${num1 * num2} / ${num1}`;
            solution = num2;
            break;
        case '^':
            problem = `${num1} ^ ${num2}`;
            solution = Math.pow(num1, num2);
            break;
        case '%':
            problem = `${num1} % ${num2}`;
            solution = num1 % num2;
            break;
    }
    return { problem, solution };
}

function renderProblems() {
    const problemsContainer = document.getElementById('problems');
    problemsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const { problem, solution } = generateProblem();
        const problemDiv = document.createElement('div');
        problemDiv.className = 'problem';
        problemDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Problema ${i + 1}</h5>
                    <p class="card-text">${problem}</p>
                    <input type="number" class="form-control answer" placeholder="Tu respuesta">
                    <button class="btn btn-success mt-2 check-answer">Comprobar</button>
                    <p class="result mt-2"></p>
                </div>
            </div>
        `;
        problemDiv.querySelector('.check-answer').addEventListener('click', function() {
            const userAnswer = parseFloat(problemDiv.querySelector('.answer').value);
            const result = problemDiv.querySelector('.result');
            if (userAnswer === solution) {
                result.textContent = '¡Correcto!';
                result.className = 'result text-success';
                streak++;
                setCookie('streak', streak, 7);
                document.getElementById('streak').textContent = streak;
            } else {
                result.textContent = `Incorrecto. La respuesta correcta es ${solution}.`;
                result.className = 'result text-danger';
                streak = 0;
                setCookie('streak', streak, 7);
                document.getElementById('streak').textContent = streak;
                renderProblems();
            }
        });
        problemsContainer.appendChild(problemDiv);
    }
}

document.getElementById('generate').addEventListener('click', renderProblems);

window.onload = function() {
    const savedStreak = getCookie('streak');
    if (savedStreak) {
        streak = parseInt(savedStreak);
        document.getElementById('streak').textContent = streak;
    }
    renderProblems();
};