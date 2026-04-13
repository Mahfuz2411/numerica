// Sudoku Game Logic

export type Cell = {
  value: number // 0 means empty
  isFixed: boolean // true if it's part of the initial puzzle
  notes: number[] // for pencil marks
  isError: boolean // for highlighting conflicts
}

export type Difficulty = "easy" | "medium" | "hard" | "expert"

export const DIFFICULTIES: Record<Difficulty, { cellsToRemove: number; name: string }> = {
  easy: { cellsToRemove: 30, name: "Easy" },
  medium: { cellsToRemove: 40, name: "Medium" },
  hard: { cellsToRemove: 50, name: "Hard" },
  expert: { cellsToRemove: 55, name: "Expert" },
}

// Create an empty 9x9 board
export function createEmptyBoard(): Cell[][] {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => ({
          value: 0,
          isFixed: false,
          notes: [],
          isError: false,
        }))
    )
}

// Check if placing a number is valid
export function isValidPlacement(
  board: Cell[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x].value === num) {
      return false
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col].value === num) {
      return false
    }
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = startRow + i
      const c = startCol + j
      if ((r !== row || c !== col) && board[r][c].value === num) {
        return false
      }
    }
  }

  return true
}

// Solve sudoku using backtracking
function solveSudoku(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacementSimple(board, row, col, num)) {
            board[row][col] = num
            if (solveSudoku(board)) {
              return true
            }
            board[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function isValidPlacementSimple(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false
    }
  }

  return true
}

// Generate a filled valid Sudoku board
function generateFilledBoard(): number[][] {
  const board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0))

  // Fill diagonal 3x3 boxes first (they don't affect each other)
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box)
  }

  // Solve the rest
  solveSudoku(board)
  return board
}

function fillBox(board: number[][], row: number, col: number) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  // Shuffle numbers
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[nums[i], nums[j]] = [nums[j], nums[i]]
  }

  let index = 0
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[row + i][col + j] = nums[index++]
    }
  }
}

// Generate a Sudoku puzzle by removing cells
export function generatePuzzle(difficulty: Difficulty): Cell[][] {
  const filledBoard = generateFilledBoard()
  const puzzle = createEmptyBoard()

  // Copy the filled board to puzzle
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      puzzle[i][j].value = filledBoard[i][j]
      puzzle[i][j].isFixed = true
    }
  }

  // Remove cells based on difficulty
  const cellsToRemove = DIFFICULTIES[difficulty].cellsToRemove
  let removed = 0
  const cells: [number, number][] = []

  // Create array of all cell positions
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push([i, j])
    }
  }

  // Shuffle cells
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cells[i], cells[j]] = [cells[j], cells[i]]
  }

  // Remove cells
  for (const [row, col] of cells) {
    if (removed >= cellsToRemove) break
    puzzle[row][col].value = 0
    puzzle[row][col].isFixed = false
    removed++
  }

  return puzzle
}

// Check if the puzzle is solved correctly
export function isPuzzleSolved(board: Cell[][]): boolean {
  // Check if all cells are filled
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].value === 0) return false
    }
  }

  // Check if there are no conflicts
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const value = board[i][j].value
      if (value !== 0 && !isValidPlacement(board, i, j, value)) {
        return false
      }
    }
  }

  return true
}

// Find conflicts for a cell
export function findConflicts(board: Cell[][], row: number, col: number): [number, number][] {
  const conflicts: [number, number][] = []
  const value = board[row][col].value

  if (value === 0) return conflicts

  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x].value === value) {
      conflicts.push([row, x])
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col].value === value) {
      conflicts.push([x, col])
    }
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = startRow + i
      const c = startCol + j
      if ((r !== row || c !== col) && board[r][c].value === value) {
        conflicts.push([r, c])
      }
    }
  }

  return conflicts
}

// Get a hint (find an empty cell that can be filled)
export function getHint(board: Cell[][]): { row: number; col: number; value: number } | null {
  const emptyCells: [number, number][] = []

  // Find all empty cells
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].value === 0 && !board[i][j].isFixed) {
        emptyCells.push([i, j])
      }
    }
  }

  if (emptyCells.length === 0) return null

  // Try to find a cell with only one possible value
  for (const [row, col] of emptyCells) {
    const possibleValues: number[] = []
    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(board, row, col, num)) {
        possibleValues.push(num)
      }
    }
    if (possibleValues.length === 1) {
      return { row, col, value: possibleValues[0] }
    }
  }

  // Otherwise, pick a random empty cell and find a valid value
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, row, col, num)) {
      return { row, col, value: num }
    }
  }

  return null
}

// Count remaining empty cells
export function countEmptyCells(board: Cell[][]): number {
  let count = 0
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].value === 0) count++
    }
  }
  return count
}
