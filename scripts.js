import { database, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

let streak = 0;
let username = '';

function saveStreakToFirebase() {
    set(ref(database, 'streaks/' + username), {
        streak: streak
    });
}

function getStreakFromFirebase() {
    const dbRef = ref(database);
    get(child(dbRef, `streaks/${username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            streak = snapshot.val().streak;
            document.getElementById('streak').textContent = streak;
        }
    }).catch((error) => {
        console.error(error);
    });
}

function generateProblem() {
    let num1, num2, operator;
    if (streak > 12) {
        num1 = Math.floor(Math.random() * 1000) + 1;
        num2 = Math.floor(Math.random() * 1000) + 1;
        operator = ['+', '-', '*', '/', '^', '%'][Math.floor(Math.random() * 6)];
    } else if (streak > 6) {
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

function renderProblem() {
    const problemsContainer = document.getElementById('problems');
    problemsContainer.innerHTML = '';
    const { problem, solution } = generateProblem();
    const problemDiv = document.createElement('div');
    problemDiv.className = 'problem';
    problemDiv.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Problema</h5>
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
            saveStreakToFirebase();
            document.getElementById('streak').textContent = streak;
        } else {
            result.textContent = `Incorrecto. La respuesta correcta es ${solution}.`;
            result.className = 'result text-danger';
            streak = 0;
            saveStreakToFirebase();
            document.getElementById('streak').textContent = streak;
        }
        renderProblem();
    });
    problemsContainer.appendChild(problemDiv);
}

document.getElementById('generate').addEventListener('click', renderProblem);

window.onload = function() {
    username = prompt("Por favor, ingresa tu nombre:");
    if (username) {
        getStreakFromFirebase();
    }
    renderProblem();
};