// Juego de Buscaminas
class Buscaminas {
    constructor() {
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.timer = 0;
        this.timerInterval = null;
        this.difficulty = 'easy';
        this.config = {
            easy: { rows: 9, cols: 9, mines: 10 },
            medium: { rows: 16, cols: 16, mines: 40 },
            hard: { rows: 16, cols: 30, mines: 99 }
        };
        
        this.initializeGame();
    }

    initializeGame() {
        this.currentConfig = this.config[this.difficulty];
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.timer = 0;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Inicializar tablero vacío
        for (let i = 0; i < this.currentConfig.rows; i++) {
            this.board[i] = [];
            this.revealed[i] = [];
            this.flagged[i] = [];
            for (let j = 0; j < this.currentConfig.cols; j++) {
                this.board[i][j] = 0;
                this.revealed[i][j] = false;
                this.flagged[i][j] = false;
            }
        }
        
        this.updateUI();
        this.renderBoard();
    }

    placeMines(excludeRow, excludeCol) {
        let minesPlaced = 0;
        const { rows, cols, mines } = this.currentConfig;
        
        while (minesPlaced < mines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            
            // No colocar mina en la casilla inicial ni en sus vecinas
            const isExcluded = (row === excludeRow && col === excludeCol) ||
                               (Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1);
            
            if (this.board[row][col] !== -1 && !isExcluded) {
                this.board[row][col] = -1; // -1 representa una mina
                minesPlaced++;
            }
        }
        
        // Calcular números alrededor de las minas
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.board[i][j] !== -1) {
                    this.board[i][j] = this.countAdjacentMines(i, j);
                }
            }
        }
    }

    countAdjacentMines(row, col) {
        let count = 0;
        const { rows, cols } = this.currentConfig;
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const newRow = row + i;
                const newCol = col + j;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    this.board[newRow][newCol] === -1) {
                    count++;
                }
            }
        }
        
        return count;
    }

    revealCell(row, col) {
        if (this.gameOver || this.gameWon) return;
        if (this.flagged[row][col]) return;
        if (this.revealed[row][col]) return;
        
        // Primera jugada: colocar minas (evitando esta casilla)
        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
            this.startTimer();
        }
        
        this.revealed[row][col] = true;
        
        // Si es una mina, game over
        if (this.board[row][col] === -1) {
            this.gameOver = true;
            this.revealAllMines();
            this.stopTimer();
            this.updateResetButton('lost');
            return;
        }
        
        // Si es 0, revelar casillas adyacentes
        if (this.board[row][col] === 0) {
            this.revealAdjacentCells(row, col);
        }
        
        // Verificar si ganó
        if (this.checkWin()) {
            this.gameWon = true;
            this.stopTimer();
            this.updateResetButton('won');
            alert('¡Felicitaciones! Has ganado en ' + this.timer + ' segundos!');
        }
        
        this.updateUI();
        this.renderBoard();
    }

    revealAdjacentCells(row, col) {
        const { rows, cols } = this.currentConfig;
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const newRow = row + i;
                const newCol = col + j;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    !this.revealed[newRow][newCol] && 
                    !this.flagged[newRow][newCol]) {
                    this.revealed[newRow][newCol] = true;
                    
                    if (this.board[newRow][newCol] === 0) {
                        this.revealAdjacentCells(newRow, newCol);
                    }
                }
            }
        }
    }

    toggleFlag(row, col) {
        if (this.gameOver || this.gameWon) return;
        if (this.revealed[row][col]) return;
        
        this.flagged[row][col] = !this.flagged[row][col];
        this.updateUI();
        this.renderBoard();
    }

    checkWin() {
        const { rows, cols, mines } = this.currentConfig;
        let revealedCount = 0;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.revealed[i][j] && this.board[i][j] !== -1) {
                    revealedCount++;
                }
            }
        }
        
        return revealedCount === (rows * cols - mines);
    }

    revealAllMines() {
        const { rows, cols } = this.currentConfig;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.board[i][j] === -1) {
                    this.revealed[i][j] = true;
                }
            }
        }
        
        this.renderBoard();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = String(this.timer).padStart(3, '0');
        }
    }

    updateUI() {
        const { mines } = this.currentConfig;
        const flagsCount = this.countFlags();
        const minesCount = mines - flagsCount;
        
        const minesCountEl = document.getElementById('mines-count');
        const flagsCountEl = document.getElementById('flags-count');
        
        if (minesCountEl) {
            minesCountEl.textContent = minesCount;
        }
        
        if (flagsCountEl) {
            flagsCountEl.textContent = flagsCount;
        }
    }

    countFlags() {
        let count = 0;
        const { rows, cols } = this.currentConfig;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (this.flagged[i][j]) {
                    count++;
                }
            }
        }
        
        return count;
    }

    updateResetButton(state) {
        const resetBtn = document.getElementById('reset-btn');
        if (!resetBtn) return;
        
        resetBtn.classList.remove('won', 'lost');
        
        if (state === 'won') {
            resetBtn.textContent = '😎';
            resetBtn.classList.add('won');
        } else if (state === 'lost') {
            resetBtn.textContent = '😵';
            resetBtn.classList.add('lost');
        } else {
            resetBtn.textContent = '😊';
        }
    }

    renderBoard() {
        const boardEl = document.getElementById('game-board');
        if (!boardEl) return;
        
        const { rows, cols } = this.currentConfig;
        
        // Limpiar tablero
        boardEl.innerHTML = '';
        boardEl.className = this.difficulty;
        
        // Crear celdas
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (this.revealed[i][j]) {
                    cell.classList.add('revealed');
                    if (this.board[i][j] === -1) {
                        cell.classList.add('mine');
                        cell.textContent = '💣';
                    } else if (this.board[i][j] > 0) {
                        cell.classList.add(`number-${this.board[i][j]}`);
                        cell.textContent = this.board[i][j];
                    }
                } else if (this.flagged[i][j]) {
                    cell.classList.add('flagged');
                    cell.textContent = '🚩';
                }
                
                // Event listeners
                cell.addEventListener('click', (e) => {
                    if (e.button === 0 || !e.button) {
                        this.revealCell(i, j);
                    }
                });
                
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.toggleFlag(i, j);
                });
                
                boardEl.appendChild(cell);
            }
        }
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.stopTimer();
        this.updateTimer();
        this.initializeGame();
    }
}

// Inicializar juego
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Buscaminas();
    
    // Botón de reinicio
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            game.initializeGame();
        });
    }
    
    // Selector de dificultad
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            game.setDifficulty(btn.dataset.difficulty);
        });
    });
});

