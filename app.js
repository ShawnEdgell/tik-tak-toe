let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;
let xSVG, oSVG;

let aiEnabled;

window.onload = function() {
    setupSVGs();
    aiEnabled = document.getElementById('aiToggle').checked;
    document.getElementById('aiToggle').addEventListener('change', toggleAI);
}

function setupSVGs() {
    fetch('check.svg')
        .then(response => response.text())
        .then(data => xSVG = data)
        .catch(error => console.error('Error fetching X SVG:', error));

    fetch('cancel.svg')
        .then(response => response.text())
        .then(data => oSVG = data)
        .catch(error => console.error('Error fetching O SVG:', error));
}

function toggleAI() {
    aiEnabled = !aiEnabled;
    if (aiEnabled && currentPlayer === 'O' && !gameOver) {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index) {
    if (board[index] === '' && !gameOver) {
        insertMove(index, currentPlayer);
        if (!checkWin() && !gameOver && currentPlayer === 'O' && aiEnabled) {
            setTimeout(computerMove, 500);
        }
    }
}

function insertMove(index, player) {
    const svgToInsert = player === 'X' ? xSVG : oSVG;
    document.getElementsByClassName('cell')[index].innerHTML = svgToInsert;
    board[index] = player;

    if (!checkWin()) {
        currentPlayer = player === 'X' ? 'O' : 'X';
        updateSubtitle();
    }
}

function computerMove() {
    if (Math.random() < 0.75) {
        aiMove();
    } else {
        makeRandomMove();
    }
}

function makeRandomMove() {
    let availableCells = board.reduce((acc, value, idx) => {
        if (value === '') acc.push(idx);
        return acc;
    }, []);

    if (availableCells.length > 0) {
        let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        insertMove(randomIndex, 'O');
    }
}

function aiMove() {
    let bestMove = -1;
    let bestValue = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let moveValue = minimax(0, false);
            board[i] = '';
            if (moveValue > bestValue) {
                bestMove = i;
                bestValue = moveValue;
            }
        }
    }

    if (bestMove !== -1) {
        insertMove(bestMove, 'O');
    }
}

function minimax(depth, isMax) {
    const winner = checkWinForMinimax();
    if (winner !== null) {
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
    }

    if (isBoardFull()) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                best = Math.max(best, minimax(depth + 1, false));
                board[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                best = Math.min(best, minimax(depth + 1, true));
                board[i] = '';
            }
        }
        return best;
    }
}

function checkWinForMinimax() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        if (board[condition[0]] && board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]]) {
            return board[condition[0]];
        }
    }
    return null;
}

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        if (board[condition[0]] && board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]]) {
            gameOver = true;
            condition.forEach(index => document.getElementsByClassName('cell')[index].classList.add('winning-cell'));
            
            const winnerMessage = `${currentPlayer === 'X' ? 'Player 1' : 'Player 2'} wins!`;
            updateResultSubtext(winnerMessage);
            return true;
        }
    }

    if (!board.includes('')) {
        gameOver = true;
        updateResultSubtext('Draw!');
        return true;
    }
    return false;
}

function isBoardFull() {
    return !board.includes('');
}

function updateSubtitle() {
    const player = currentPlayer === 'X' ? 'Player 1' : 'Player 2';
    const message = `${player}, make your move.`;
    document.querySelector('.subtext').innerHTML = message;
}

function updateResultSubtext(message) {
    const initialSubtextElement = document.querySelector('.initial-subtext');
    const resultSubtextElement = document.querySelector('.result-subtext');

    initialSubtextElement.classList.add('hidden');
    resultSubtextElement.textContent = message;
    resultSubtextElement.classList.remove('hidden');
}

function resetGame() {
    board.fill('');
    currentPlayer = 'X';
    gameOver = false;
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerHTML = '';
        cell.classList.remove('winning-cell');
    }
    updateSubtitle();
    document.querySelector('.initial-subtext').classList.remove('hidden');
    document.querySelector('.result-subtext').classList.add('hidden');
    
    if (aiEnabled && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}
