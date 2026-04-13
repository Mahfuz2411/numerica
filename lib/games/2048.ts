/**
 * 2048 Game Logic
 * Classic sliding tile puzzle game
 */

export type Tile = {
  id: string
  value: number
  row: number
  col: number
  isNew?: boolean
  isMerged?: boolean
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
 * Initialize a new game board
 */
export function initializeGame(): GameState2048 {
  const tiles: Tile[] = []
  
  // Add two random tiles to start
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
 * Add a random tile (2 or 4) to an empty spot
 */
function addRandomTile(tiles: Tile[]): void {
  const emptyCells = getEmptyCells(tiles)
  
  if (emptyCells.length === 0) return
  
  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  const value = Math.random() < 0.9 ? 2 : 4 // 90% chance of 2, 10% chance of 4
  
  tiles.push({
    id: `${Date.now()}-${Math.random()}`,
    value,
    row,
    col,
    isNew: true,
  })
}

/**
 * Get all empty cells on the board
 */
function getEmptyCells(tiles: Tile[]): { row: number; col: number }[] {
  const occupied = new Set(tiles.map(t => `${t.row},${t.col}`))
  const empty: { row: number; col: number }[] = []
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!occupied.has(`${row},${col}`)) {
        empty.push({ row, col })
      }
    }
  }
  
  return empty
}

/**
 * Move tiles in the specified direction
 */
export function moveTiles(state: GameState2048, direction: Direction): GameState2048 {
  if (state.isGameOver) return state
  
  // Clear merge and new flags
  const tiles = state.tiles.map(t => ({ ...t, isMerged: false, isNew: false }))
  
  // Get ordered list of tiles based on direction
  const orderedTiles = getOrderedTiles(tiles, direction)
  const newTiles: Tile[] = []
  let scoreGained = 0
  let moved = false
  
  // Process each row/column
  for (let line = 0; line < GRID_SIZE; line++) {
    const lineTiles = orderedTiles.filter(t => getLine(t, direction) === line)
    const { tiles: processedTiles, score } = processLine(lineTiles, direction, line)
    
    newTiles.push(...processedTiles)
    scoreGained += score
    
    // Check if tiles moved
    lineTiles.forEach((oldTile, i) => {
      if (processedTiles[i] && 
          (oldTile.row !== processedTiles[i].row || 
           oldTile.col !== processedTiles[i].col)) {
        moved = true
      }
    })
  }
  
  // If no tiles moved, return original state
  if (!moved) return state
  
  // Add a new random tile
  addRandomTile(newTiles)
  
  const newScore = state.score + scoreGained
  const hasWon = !state.hasWon && newTiles.some(t => t.value >= WIN_VALUE)
  const isGameOver = checkGameOver(newTiles)
  
  return {
    tiles: newTiles,
    score: newScore,
    bestScore: Math.max(state.bestScore, newScore),
    isGameOver,
    hasWon,
    moveCount: state.moveCount + 1,
  }
}

/**
 * Get tiles ordered by direction for processing
 */
function getOrderedTiles(tiles: Tile[], direction: Direction): Tile[] {
  return [...tiles].sort((a, b) => {
    switch (direction) {
      case 'up':
        return a.row - b.row
      case 'down':
        return b.row - a.row
      case 'left':
        return a.col - b.col
      case 'right':
        return b.col - a.col
    }
  })
}

/**
 * Get the line number (row or column) for a tile based on direction
 */
function getLine(tile: Tile, direction: Direction): number {
  return direction === 'up' || direction === 'down' ? tile.col : tile.row
}

/**
 * Process a single line (row or column) of tiles
 */
function processLine(
  tiles: Tile[],
  direction: Direction,
  line: number
): { tiles: Tile[]; score: number } {
  const result: Tile[] = []
  let score = 0
  let position = 0
  
  for (let i = 0; i < tiles.length; i++) {
    const current = tiles[i]
    
    // Check if can merge with previous tile
    if (result.length > 0 && 
        result[result.length - 1].value === current.value &&
        !result[result.length - 1].isMerged) {
      // Merge tiles
      const merged = result[result.length - 1]
      merged.value *= 2
      merged.isMerged = true
      score += merged.value
    } else {
      // Add new tile at current position
      const newTile = { ...current }
      
      if (direction === 'up' || direction === 'down') {
        newTile.row = direction === 'up' ? position : GRID_SIZE - 1 - position
        newTile.col = line
      } else {
        newTile.row = line
        newTile.col = direction === 'left' ? position : GRID_SIZE - 1 - position
      }
      
      result.push(newTile)
      position++
    }
  }
  
  return { tiles: result, score }
}

/**
 * Check if the game is over (no more valid moves)
 */
function checkGameOver(tiles: Tile[]): boolean {
  // Check if there are empty cells
  if (getEmptyCells(tiles).length > 0) return false
  
  // Check if any adjacent tiles can merge
  for (const tile of tiles) {
    // Check right
    const right = tiles.find(t => t.row === tile.row && t.col === tile.col + 1)
    if (right && right.value === tile.value) return false
    
    // Check down
    const down = tiles.find(t => t.row === tile.row + 1 && t.col === tile.col)
    if (down && down.value === tile.value) return false
  }
  
  return true
}

/**
 * Check if a move is valid
 */
export function canMove(state: GameState2048, direction: Direction): boolean {
  const testState = moveTiles(state, direction)
  return testState.tiles.length !== state.tiles.length ||
         testState.tiles.some((t, i) => 
           t.row !== state.tiles[i]?.row || t.col !== state.tiles[i]?.col
         )
}

/**
 * Get tile color based on value
 */
export function getTileColor(value: number): string {
  const colors: Record<number, string> = {
    2: 'bg-amber-100 text-gray-800',
    4: 'bg-amber-200 text-gray-800',
    8: 'bg-orange-400 text-white',
    16: 'bg-orange-500 text-white',
    32: 'bg-orange-600 text-white',
    64: 'bg-red-500 text-white',
    128: 'bg-yellow-400 text-white',
    256: 'bg-yellow-500 text-white',
    512: 'bg-yellow-600 text-white',
    1024: 'bg-yellow-700 text-white',
    2048: 'bg-yellow-800 text-white',
    4096: 'bg-purple-600 text-white',
    8192: 'bg-purple-700 text-white',
  }
  
  return colors[value] || 'bg-gray-800 text-white'
}

/**
 * Get font size based on tile value (more digits = smaller font)
 */
export function getTileFontSize(value: number): string {
  if (value < 100) return 'text-5xl'
  if (value < 1000) return 'text-4xl'
  if (value < 10000) return 'text-3xl'
  return 'text-2xl'
}
