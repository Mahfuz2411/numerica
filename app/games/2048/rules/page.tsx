import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Plus, Trophy } from "lucide-react"

export default function Rules2048Page() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">2048 Rules</h1>
        <p className="text-muted-foreground">
          Learn how to play 2048 and master the art of tile merging!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Objective</CardTitle>
          <CardDescription>
            Combine numbered tiles to create a tile with the value of 2048
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            2048 is a single-player sliding tile puzzle game. The objective is to slide numbered tiles on a grid to combine them and create a tile with the number 2048.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Fun Fact:</strong> After reaching 2048, you can continue playing to achieve higher scores and tiles like 4096, 8192, and beyond!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Use Arrow Keys or Swipe</h3>
                <p className="text-sm text-muted-foreground">
                  Use your keyboard arrow keys (↑ ↓ ← →) or WASD keys to move tiles. On mobile, swipe in any direction.
                </p>
                <div className="flex gap-2 mt-2">
                  <div className="px-3 py-1 bg-muted rounded text-xs flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" /> Up
                  </div>
                  <div className="px-3 py-1 bg-muted rounded text-xs flex items-center gap-1">
                    <ArrowDown className="h-3 w-3" /> Down
                  </div>
                  <div className="px-3 py-1 bg-muted rounded text-xs flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Left
                  </div>
                  <div className="px-3 py-1 bg-muted rounded text-xs flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" /> Right
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Tiles Slide</h3>
                <p className="text-sm text-muted-foreground">
                  When you move, all tiles slide in that direction until they hit the edge or another tile.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  Tiles Merge <Plus className="h-4 w-4 text-primary" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  When two tiles with the same number touch, they merge into one tile with double the value.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <div className="px-3 py-2 bg-yellow-200 dark:bg-yellow-900 rounded font-bold">2</div>
                  <Plus className="h-3 w-3" />
                  <div className="px-3 py-2 bg-yellow-200 dark:bg-yellow-900 rounded font-bold">2</div>
                  <span>=</span>
                  <div className="px-3 py-2 bg-orange-300 dark:bg-orange-800 rounded font-bold">4</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">New Tile Appears</h3>
                <p className="text-sm text-muted-foreground">
                  After each move, a new tile (2 or 4) appears in a random empty spot on the grid.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  Reach 2048 <Trophy className="h-4 w-4 text-yellow-600" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Keep merging tiles until you create a tile with the value 2048. That&apos;s a win!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            Your score increases by the value of the new tile created whenever two tiles merge.
          </p>
          <div className="bg-muted p-3 rounded space-y-2">
            <p className="text-sm">
              <strong>Example:</strong>
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Merge 2 + 2 = 4 → Score +4</li>
              <li>Merge 4 + 4 = 8 → Score +8</li>
              <li>Merge 128 + 128 = 256 → Score +256</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Your best score is saved automatically and displayed alongside your current score.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Winning & Losing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
              🎉 You Win When:
            </h3>
            <p className="text-sm text-muted-foreground">
              You create a tile with the value of 2048. After winning, you can choose to continue playing to achieve higher tiles and scores!
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
              😢 You Lose When:
            </h3>
            <p className="text-sm text-muted-foreground">
              The grid is completely full and no adjacent tiles have the same value. When you can&apos;t make any more moves, the game is over.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips & Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong>Keep your highest tile in a corner</strong>
                <p className="text-sm text-muted-foreground">
                  Choose a corner (usually bottom-right) and build smaller tiles around it.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong>Build in a snake pattern</strong>
                <p className="text-sm text-muted-foreground">
                  Arrange tiles in descending order in a snake-like pattern from your chosen corner.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong>Focus on one direction</strong>
                <p className="text-sm text-muted-foreground">
                  Use mainly two or three directions (e.g., down, right, left) and avoid the fourth unless necessary.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong>Plan ahead</strong>
                <p className="text-sm text-muted-foreground">
                  Think about where new tiles might appear and how your move will affect the entire board.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <div>
                <strong>Be patient</strong>
                <p className="text-sm text-muted-foreground">
                  Don&apos;t rush! Take time to analyze the board before each move.
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
