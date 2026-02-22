import { Card } from "@/components/ui/card"

export default function MinesweeperRulesPage() {
  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-3">How to Play</h2>
        <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
          <p>
            The goal is to clear the board without detonating any mines. Use logic and deduction to safely reveal all
            non-mine cells!
          </p>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-3">Game Rules</h2>
        <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc list-inside">
          <li>
            <strong>Reveal cells:</strong> Left-click on a cell to reveal it
          </li>
          <li>
            <strong>Flag mines:</strong> Right-click on a cell to mark it with a flag
          </li>
          <li>
            <strong>Numbers:</strong> Each number indicates how many mines are adjacent to that cell
          </li>
          <li>
            <strong>Empty cells:</strong> Cells with no adjacent mines will automatically reveal nearby cells
          </li>
          <li>
            <strong>Win condition:</strong> Reveal all non-mine cells without clicking on a mine
          </li>
          <li>
            <strong>Game over:</strong> Clicking on a mine ends the game
          </li>
        </ul>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-3">Difficulty Levels</h2>
        <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
          <div>
            <strong className="text-foreground">Easy:</strong> 8×8 grid with 10 mines
          </div>
          <div>
            <strong className="text-foreground">Medium:</strong> 12×12 grid with 20 mines
          </div>
          <div>
            <strong className="text-foreground">Hard:</strong> 16×16 grid with 40 mines
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-3">Tips & Strategy</h2>
        <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc list-inside">
          <li>Start by clicking corners and edges - they have fewer adjacent cells</li>
          <li>Use flags to mark suspected mines and keep track of dangerous areas</li>
          <li>Look for patterns: a "1" touching one unrevealed cell means that cell is a mine</li>
          <li>A "1" touching only one unrevealed cell with other revealed cells means that cell is a mine</li>
          <li>Count flags and compare with the mine counter to track your progress</li>
          <li>Take your time - rushing often leads to mistakes!</li>
        </ul>
      </Card>
    </div>
  )
}
