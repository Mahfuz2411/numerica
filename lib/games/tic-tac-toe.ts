export type Player = "X" | "O" | null
export type Board = Player[]

export interface GameState {
  board: Board
  currentPlayer: Player
  winner: Player
  isDraw: boolean
  winningLine: number[] | null
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
]

export function createEmptyBoard(): Board {
  return Array(9).fill(null)
}

export function checkWinner(board: Board): {
  winner: Player
  winningLine: number[] | null
} {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: combination }
    }
  }
  return { winner: null, winningLine: null }
}

export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && !checkWinner(board).winner
}

export function makeMove(
  board: Board,
  index: number,
  player: Player
): Board | null {
  if (board[index] || checkWinner(board).winner) {
    return null
  }
  const newBoard = [...board]
  newBoard[index] = player
  return newBoard
}

export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === "X" ? "O" : "X"
}

// Simple AI for single player mode
export function getAIMove(board: Board, difficulty: "easy" | "hard" = "hard"): number {
  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index) => index !== null) as number[]

  if (availableMoves.length === 0) return -1

  if (difficulty === "easy") {
    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  // Hard: Minimax algorithm
  const minimax = (
    currentBoard: Board,
    isMaximizing: boolean
  ): { score: number; move?: number } => {
    const { winner } = checkWinner(currentBoard)
    
    if (winner === "O") return { score: 10 }
    if (winner === "X") return { score: -10 }
    if (checkDraw(currentBoard)) return { score: 0 }

    const moves = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null) as number[]

    if (isMaximizing) {
      let bestScore = -Infinity
      let bestMove = moves[0]

      for (const move of moves) {
        const newBoard = [...currentBoard]
        newBoard[move] = "O"
        const { score } = minimax(newBoard, false)
        if (score > bestScore) {
          bestScore = score
          bestMove = move
        }
      }

      return { score: bestScore, move: bestMove }
    } else {
      let bestScore = Infinity

      for (const move of moves) {
        const newBoard = [...currentBoard]
        newBoard[move] = "X"
        const { score } = minimax(newBoard, true)
        bestScore = Math.min(score, bestScore)
      }

      return { score: bestScore }
    }
  }

  const { move } = minimax(board, true)
  return move ?? availableMoves[0]
}
