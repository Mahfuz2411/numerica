export type CellState = "hidden" | "revealed" | "flagged"
export type CellValue = number | "mine"

export interface Cell {
  value: CellValue
  state: CellState
  row: number
  col: number
}

export type Difficulty = "easy" | "medium" | "hard"

export interface GameConfig {
  rows: number
  cols: number
  mines: number
}

export const DIFFICULTIES: Record<Difficulty, GameConfig> = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
}

export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = []

  // Initialize empty board
  for (let row = 0; row < rows; row++) {
    board[row] = []
    for (let col = 0; col < cols; col++) {
      board[row][col] = {
        value: 0,
        state: "hidden",
        row,
        col,
      }
    }
  }

  return board
}

export function createBoard(
  rows: number,
  cols: number,
  mines: number,
  safeRow?: number,
  safeCol?: number
): Cell[][] {
  const board = createEmptyBoard(rows, cols)

  // Get safe zone cells (clicked cell + adjacent cells)
  const safeZone = new Set<string>()
  if (safeRow !== undefined && safeCol !== undefined) {
    for (let r = safeRow - 1; r <= safeRow + 1; r++) {
      for (let c = safeCol - 1; c <= safeCol + 1; c++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          safeZone.add(`${r}-${c}`)
        }
      }
    }
  }

  // Place mines randomly (avoiding safe zone)
  let minesPlaced = 0
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)
    const key = `${row}-${col}`

    if (board[row][col].value !== "mine" && !safeZone.has(key)) {
      board[row][col].value = "mine"
      minesPlaced++

      // Update adjacent cells
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (
            r >= 0 &&
            r < rows &&
            c >= 0 &&
            c < cols &&
            board[r][c].value !== "mine"
          ) {
            board[r][c].value = (board[r][c].value as number) + 1
          }
        }
      }
    }
  }

  return board
}

export function revealCell(
  board: Cell[][],
  row: number,
  col: number
): Cell[][] {
  const newBoard = board.map((r) => [...r])

  if (
    row < 0 ||
    row >= newBoard.length ||
    col < 0 ||
    col >= newBoard[0].length ||
    newBoard[row][col].state !== "hidden"
  ) {
    return newBoard
  }

  newBoard[row][col].state = "revealed"

  // If empty cell, reveal adjacent cells
  if (newBoard[row][col].value === 0) {
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r !== row || c !== col) {
          const result = revealCell(newBoard, r, c)
          for (let i = 0; i < result.length; i++) {
            newBoard[i] = result[i]
          }
        }
      }
    }
  }

  return newBoard
}

export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map((r) => [...r])

  if (newBoard[row][col].state === "hidden") {
    newBoard[row][col].state = "flagged"
  } else if (newBoard[row][col].state === "flagged") {
    newBoard[row][col].state = "hidden"
  }

  return newBoard
}

export function checkWin(board: Cell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (cell.value !== "mine" && cell.state !== "revealed") {
        return false
      }
    }
  }
  return true
}

export function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map((row) =>
    row.map((cell) =>
      cell.value === "mine" ? { ...cell, state: "revealed" as CellState } : cell
    )
  )
}

export function countFlags(board: Cell[][]): number {
  let count = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === "flagged") count++
    }
  }
  return count
}
