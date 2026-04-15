export type CrossSumeDifficulty = "easy" | "medium" | "hard"

export interface CrossSumeConfig {
  size: number
  label: string
}

export interface CrossSumePuzzle {
  size: number
  grid: number[][]
  keepMask: boolean[][]
  rowTargets: number[]
  colTargets: number[]
}

export const CROSS_SUME_CONFIG: Record<CrossSumeDifficulty, CrossSumeConfig> = {
  easy: { size: 5, label: "Easy" },
  medium: { size: 6, label: "Medium" },
  hard: { size: 7, label: "Hard" },
}

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const cloneMask = (mask: boolean[][]) => mask.map((row) => [...row])

const ensureRowAndColVariety = (mask: boolean[][]) => {
  const size = mask.length
  const next = cloneMask(mask)

  for (let row = 0; row < size; row++) {
    const keptCount = next[row].filter(Boolean).length
    if (keptCount === 0) {
      next[row][randomInt(0, size - 1)] = true
    } else if (keptCount === size) {
      next[row][randomInt(0, size - 1)] = false
    }
  }

  for (let col = 0; col < size; col++) {
    let kept = 0
    for (let row = 0; row < size; row++) {
      if (next[row][col]) kept += 1
    }

    if (kept === 0) {
      next[randomInt(0, size - 1)][col] = true
    } else if (kept === size) {
      next[randomInt(0, size - 1)][col] = false
    }
  }

  return next
}

const sumFromMask = (grid: number[][], keepMask: boolean[][]) => {
  const size = grid.length
  const rowTargets = Array(size).fill(0)
  const colTargets = Array(size).fill(0)

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (keepMask[row][col]) {
        rowTargets[row] += grid[row][col]
        colTargets[col] += grid[row][col]
      }
    }
  }

  return { rowTargets, colTargets }
}

export const generateCrossSumePuzzle = (
  difficulty: CrossSumeDifficulty
): CrossSumePuzzle => {
  const { size } = CROSS_SUME_CONFIG[difficulty]

  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => randomInt(1, 9))
  )

  const keepProbability = difficulty === "easy" ? 0.55 : difficulty === "medium" ? 0.5 : 0.45

  let keepMask = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random() < keepProbability)
  )

  keepMask = ensureRowAndColVariety(keepMask)

  const { rowTargets, colTargets } = sumFromMask(grid, keepMask)

  return {
    size,
    grid,
    keepMask,
    rowTargets,
    colTargets,
  }
}

export const createFullActiveGrid = (size: number) =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => true))

export const getRowCurrentSum = (
  grid: number[][],
  activeMask: boolean[][],
  row: number
) => {
  let sum = 0
  for (let col = 0; col < grid.length; col++) {
    if (activeMask[row][col]) sum += grid[row][col]
  }
  return sum
}

export const getColCurrentSum = (
  grid: number[][],
  activeMask: boolean[][],
  col: number
) => {
  let sum = 0
  for (let row = 0; row < grid.length; row++) {
    if (activeMask[row][col]) sum += grid[row][col]
  }
  return sum
}

export const isPuzzleSolved = (keepMask: boolean[][], activeMask: boolean[][]) => {
  const size = keepMask.length
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (keepMask[row][col] !== activeMask[row][col]) {
        return false
      }
    }
  }
  return true
}
