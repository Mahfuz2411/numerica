/**
 * 2048 Game Logic - Fixed & Rewritten
 * Classic sliding tile puzzle game with correct game mechanics
 */

export type Tile = {
  id: string
  value: number
  x: number // column (0-3)
  y: number // row (0-3)
  isNew?: boolean
  mergedFrom?: [Tile, Tile] // tiles that merged to form this one
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export type GameState2048 = {
  tiles: Tile[]
  score: number
  bestScore: number
  isGameOver: boolean
  hasWon: boolean
  moveCount: number
}

const GRID_SIZE = 4
const WIN_VALUE = 2048

/**
 * Create a unique tile ID
 */
function createTileId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Initialize a new game board with 2 tiles
 */
export function initializeGame(): GameState2048 {
  const tiles: Tile[] = []
  addRandomTile(tiles)
  addRandomTile(tiles)

  return {
    tiles,
    score: 0,
    bestScore: 0,
    isGameOver: false,
    hasWon: false,
    moveCount: 0,
  }
}

/**
 * Add a random tile (90% 2, 10% 4) to an empty spot
 */
function addRandomTile(tiles: Tile[]): Tile | null {
  const emptySpots = getEmptySpots(tiles)
  if (emptySpots.length === 0) return null

  const { x, y } = emptySpots[Math.floor(Math.random() * emptySpots.length)]
  const value = Math.random() < 0.9 ? 2 : 4

  const newTile: Tile = {
    id: createTileId(),
    value,
    x,
    y,
    isNew: true,
  }

  tiles.push(newTile)
  return newTile
}

/**
 * Get all empty cells
 */
function getEmptySpots(tiles: Tile[]): Array<{ x: number; y: number }> {
  const occupied = new Set(tiles.map(t => `${t.x},${t.y}`))
  const empty: Array<{ x: number; y: number }> = []

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y })
      }
    }
  }

  return empty
}

/**
 * Move tiles in a direction and return new state
 */
export function moveTiles(state: GameState2048, direction: Direction): GameState2048 {
  if (state.isGameOver) return state

  // Clone tiles and reset merge flags
  let tiles = state.tiles.map(t => ({
    ...t,
    isNew: false,
    mergedFrom: undefined,
  }))

  // Move tiles in the specified direction
  tiles = performMove(tiles, direction)

  // Check if board changed
  if (JSON.stringify(tiles) === JSON.stringify(state.tiles)) {
    return state // No change, return original state
  }

  // Add new tile
  addRandomTile(tiles)

  // Calculate score from merged tiles
  let scoreGained = 0
  tiles.forEach(tile => {
    if (tile.mergedFrom) {
      scoreGained += tile.value
    }
  })

  const newScore = state.score + scoreGained
  const hasWon = !state.hasWon && tiles.some(t => t.value >= WIN_VALUE)
  const isGameOver = !hasWon && checkGameOver(tiles)

  return {
    tiles,
    score: newScore,
    bestScore: Math.max(state.bestScore, newScore),
    isGameOver,
    hasWon,
    moveCount: state.moveCount + 1,
  }
}

/**
 * Perform the actual move operation
 */
function performMove(tiles: Tile[], direction: Direction): Tile[] {
  // Convert board to array for easier manipulation
  const board = createBoard(tiles)

  // Move and merge
  if (direction === 'up') {
    moveUp(board)
  } else if (direction === 'down') {
    moveDown(board)
  } else if (direction === 'left') {
    moveLeft(board)
  } else if (direction === 'right') {
    moveRight(board)
  }

  // Convert back to tiles
  return boardToTiles(board)
}

/**
 * Create a 2D board from tiles array
 */
function createBoard(tiles: Tile[]): (Tile | null)[][] {
  const board: (Tile | null)[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null))

  tiles.forEach(tile => {
    board[tile.y][tile.x] = tile
  })

  return board
}

/**
 * Convert board back to tiles array
 */
function boardToTiles(board: (Tile | null)[][]): Tile[] {
  const tiles: Tile[] = []
  board.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile) {
        tile.x = x
        tile.y = y
        tiles.push(tile)
      }
    })
  })
  return tiles
}

/**
 * Slide and merge a single line
 */
function slideLine(line: (Tile | null)[]): (Tile | null)[] {
  // Remove nulls
  const filtered = line.filter(t => t !== null) as Tile[]

  // Merge
  const merged: (Tile | null)[] = []
  let skipNext = false

  for (let i = 0; i < filtered.length; i++) {
    if (skipNext) {
      skipNext = false
      continue
    }

    if (i + 1 < filtered.length && filtered[i].value === filtered[i + 1].value) {
      // Merge
      const newTile: Tile = {
        id: createTileId(),
        value: filtered[i].value * 2,
        x: 0,
        y: 0,
        mergedFrom: [filtered[i], filtered[i + 1]],
      }
      merged.push(newTile)
      skipNext = true
    } else {
      merged.push(filtered[i])
    }
  }

  // Pad with nulls
  while (merged.length < GRID_SIZE) {
    merged.push(null)
  }

  return merged
}

/**
 * Move left
 */
function moveLeft(board: (Tile | null)[][]): void {
  for (let y = 0; y < GRID_SIZE; y++) {
    const newLine = slideLine(board[y])
    board[y] = newLine
  }
}

/**
 * Move right
 */
function moveRight(board: (Tile | null)[][]): void {
  for (let y = 0; y < GRID_SIZE; y++) {
    const reversed = board[y].reverse()
    const newLine = slideLine(reversed)
    board[y] = newLine.reverse()
  }
}

/**
 * Move up
 */
function moveUp(board: (Tile | null)[][]): void {
  for (let x = 0; x < GRID_SIZE; x++) {
    const column: (Tile | null)[] = []
    for (let y = 0; y < GRID_SIZE; y++) {
      column.push(board[y][x])
    }

    const newColumn = slideLine(column)

    for (let y = 0; y < GRID_SIZE; y++) {
      board[y][x] = newColumn[y]
    }
  }
}

/**
 * Move down
 */
function moveDown(board: (Tile | null)[][]): void {
  for (let x = 0; x < GRID_SIZE; x++) {
    const column: (Tile | null)[] = []
    for (let y = GRID_SIZE - 1; y >= 0; y--) {
      column.push(board[y][x])
    }

    const newColumn = slideLine(column)

    for (let y = GRID_SIZE - 1, i = 0; y >= 0; y--, i++) {
      board[y][x] = newColumn[i]
    }
  }
}

/**
 * Check if game is over
 */
function checkGameOver(tiles: Tile[]): boolean {
  // If empty spots exist, game not over
  if (getEmptySpots(tiles).length > 0) return false

  // Create board
  const board = createBoard(tiles)

  // Check if any move is possible
  // Check left/right moves
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE - 1; x++) {
      if (board[y][x]?.value === board[y][x + 1]?.value) {
        return false // Can merge horizontally
      }
    }
  }

  // Check up/down moves
  for (let y = 0; y < GRID_SIZE - 1; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[y][x]?.value === board[y + 1][x]?.value) {
        return false // Can merge vertically
      }
    }
  }

  return true // No moves possible
}

/**
 * Get tile color based on value
 */
export function getTileColor(value: number): string {
  const colorMap: Record<number, string> = {
    2: 'bg-slate-200 text-slate-900 font-bold',
    4: 'bg-slate-300 text-slate-900 font-bold',
    8: 'bg-orange-400 text-white',
    16: 'bg-orange-500 text-white',
    32: 'bg-orange-600 text-white',
    64: 'bg-red-500 text-white',
    128: 'bg-yellow-400 text-gray-900 font-bold',
    256: 'bg-yellow-500 text-white',
    512: 'bg-yellow-500 text-white',
    1024: 'bg-amber-600 text-white',
    2048: 'bg-purple-600 text-white',
    4096: 'bg-purple-700 text-white',
    8192: 'bg-indigo-800 text-white',
  }

  return colorMap[value] || colorMap[2048]
}

/**
 * Get font size for tile value
 */
export function getTileFontSize(value: number): string {
  if (value < 100) return 'text-5xl'
  if (value < 1000) return 'text-4xl'
  if (value < 10000) return 'text-3xl'
  return 'text-2xl'
}
