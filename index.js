document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click', solveSudoku);

    const sudokuGrid = document.getElementById("sudoku-grid");
    // Create the sudoku grid and input cells
    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

async function solveSudoku() {
    const gridSize = 9;
    const sudokuArray = [];

    // Fill the sudokuArray with input values from the grid
    for (let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }

    // Validate the Sudoku grid before attempting to solve
    if (!isValidSudoku(sudokuArray)) {
        alert("Invalid Sudoku grid. Please correct the duplicates.");
        return;
    }

    // Identify user-input cells and mark them
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if (sudokuArray[row][col] !== 0) {
                cell.classList.add("user-input");
            }
        }
    }

    // Solve the sudoku and display the solution
    if (solveSudokuHelper(sudokuArray)) {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Fill in solved values and apply animation
                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(20); // Add a delay for visualization
                }
            }
        }
    } else {
        alert("No solution found. Please check the puzzle setup.");
    }
}

function solveSudokuHelper(board) {
    const gridSize = 9;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;

                        if (solveSudokuHelper(board)) {
                            return true;
                        }

                        board[row][col] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }

    return true; // All cells filled
}

function isValidMove(board, row, col, num) {
    const gridSize = 9;

    for (let i = 0; i < gridSize; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) {
                return false;
            }
        }
    }

    return true;
}

function isValidSudoku(sudokuArray) {
    const gridSize = 9;

    for (let i = 0; i < gridSize; i++) {
        let rowSet = new Set();
        let colSet = new Set();

        for (let j = 0; j < gridSize; j++) {
            if (sudokuArray[i][j] !== 0) {
                if (rowSet.has(sudokuArray[i][j])) return false;
                rowSet.add(sudokuArray[i][j]);
            }

            if (sudokuArray[j][i] !== 0) {
                if (colSet.has(sudokuArray[j][i])) return false;
                colSet.add(sudokuArray[j][i]);
            }
        }
    }

    for (let row = 0; row < gridSize; row += 3) {
        for (let col = 0; col < gridSize; col += 3) {
            let gridSet = new Set();

            for (let i = row; i < row + 3; i++) {
                for (let j = col; j < col + 3; j++) {
                    if (sudokuArray[i][j] !== 0) {
                        if (gridSet.has(sudokuArray[i][j])) return false;
                        gridSet.add(sudokuArray[i][j]);
                    }
                }
            }
        }
    }

    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

