let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;

function updateInitialSubtext() {
    const player = currentPlayer === 'X' 
                   ? '<span class="player-name"><strong>Player 1</strong></span>' 
                   : '<span class="player-name"><strong>Player 2</strong></span>';
    document.querySelector('.initial-subtext').innerHTML = `${player}, make your move.`;
}

// Define a function to update the result subtext
function updateResultSubtext(message) {
    document.querySelector('.result-subtext').textContent = message;
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
            // Highlight the winning cells
            condition.forEach(index => {
                document.getElementsByClassName('cell')[index].classList.add('winning-cell');
            });

            const winner = currentPlayer === 'X' ? 'Player 1' : 'Player 2';
            const message = `${winner} wins!`;
            showModal(message);
            updateResultSubtext(message); // Update the result subtext
            return true;
        }
    }

    if (!board.includes('')) {
        gameOver = true;
        showModal('Draw!');
        updateResultSubtext('Draw!'); // Update the result subtext for a draw
        return true;
    }


    return false;
}

function updateSubtitle() {
    if (gameOver) {
        const winner = currentPlayer === 'X' ? 'Player 1' : 'Player 2';
        const message = winner ? `${winner} wins!` : 'Draw!';
        document.querySelector('.result-subtext').textContent = message;
    } else {
        const player = currentPlayer === 'X'
            ? '<span class="player-name"><strong>Player 1</strong></span>'
            : '<span class="player-name"><strong>Player 2</strong></span>';
        document.querySelector('.subtext').innerHTML = `${player}, make your move.`;
    }
}

window.onload = function() {
    fetch('/images/cancel.svg')
      .then(response => response.text())
      .then(data => {
        xSVG = data;
      })
      .catch(error => {
        console.error('Error fetching X SVG:', error);
      });

    fetch('/images/check.svg')
      .then(response => response.text())
      .then(data => {
        oSVG = data;
      })
      
      .catch(error => {
        console.error('Error fetching O SVG:', error);
      });

    // Modal logic
    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
      modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
}

function makeMove(index) {
    if (board[index] === '' && !gameOver) {
        let svgToInsert = currentPlayer === 'X' ? xSVG : oSVG;
        document.getElementsByClassName('cell')[index].innerHTML = svgToInsert;
        board[index] = currentPlayer;
        if (!checkWin()) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateSubtitle();  // Update subtitle after making a move
        }
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;

    // Clear the board display and remove the winning-cell class
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('winning-cell'); // Remove the winning-cell class
    }

    updateSubtitle();  // Reset the subtitle message
}

function showModal(message) {
    const modal = document.getElementById("myModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
}

window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}