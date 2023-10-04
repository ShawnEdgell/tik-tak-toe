let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;
let xSVG, oSVG;

window.onload = function() {
    setupSVGs();
}

function setupSVGs() {
    fetch('images/cancel.svg')
        .then(response => response.text())
        .then(data => xSVG = data)
        .catch(error => console.error('Error fetching X SVG:', error));

    fetch('images/check.svg')
        .then(response => response.text())
        .then(data => oSVG = data)
        .catch(error => console.error('Error fetching O SVG:', error));
}

function makeMove(index) {
    if (board[index] === '' && !gameOver) {
        const svgToInsert = currentPlayer === 'X' ? xSVG : oSVG;
        document.getElementsByClassName('cell')[index].innerHTML = svgToInsert;
        board[index] = currentPlayer;
        
        if (!checkWin()) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateSubtitle();
        }
    }
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

function updateSubtitle() {
    const player = currentPlayer === 'X' ? 'Player 1' : 'Player 2';
    const message = `${player}, make your move.`;
    document.querySelector('.subtext').innerHTML = message;
}

function updateResultSubtext(message) {
    const initialSubtextElement = document.querySelector('.initial-subtext');
    const resultSubtextElement = document.querySelector('.result-subtext');

    initialSubtextElement.classList.add('hidden'); // hide initial subtext
    resultSubtextElement.textContent = message;
    resultSubtextElement.classList.remove('hidden'); // show result subtext
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('winning-cell');
    }

    updateSubtitle();
}


