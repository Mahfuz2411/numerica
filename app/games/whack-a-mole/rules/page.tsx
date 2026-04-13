import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hammer, Target, Trophy, Zap } from "lucide-react"

export default function WhackAMoleRulesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Game Objective
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm sm:text-base text-muted-foreground">
          <p>
            Click on as many moles as possible before time runs out! Moles will pop up randomly from 9 different holes. 
            Your goal is to &quot;whack&quot; them by clicking on them before they disappear back into their holes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Moles (🦫) will randomly appear from the holes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Click on a mole as soon as it appears to whack it</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Each successful whack earns you 1 point</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Moles will disappear after a short time if not whacked</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>The game ends when time runs out</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Try to beat your high score!</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Difficulty Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-green-500/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-base">🌱 Easy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• 30 seconds duration</p>
                <p>• Moles stay for 1.5s</p>
                <p>• Slower spawn rate</p>
                <p>• Perfect for beginners!</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-base">⚡ Medium</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• 45 seconds duration</p>
                <p>• Moles stay for 1s</p>
                <p>• Moderate spawn rate</p>
                <p>• Good challenge!</p>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-base">🔥 Hard</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• 60 seconds duration</p>
                <p>• Moles stay for 0.7s</p>
                <p>• Fast spawn rate</p>
                <p>• For pro players!</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Tips & Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Stay focused:</strong> Keep your eyes scanning all holes continuously</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Be quick:</strong> Click immediately when you see a mole appear</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Use your peripherals:</strong> Train your peripheral vision to catch moles early</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Start with Easy:</strong> Master the timing before moving to harder levels</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Practice makes perfect:</strong> Your reaction time will improve with practice!</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">🎯 Pro Tip</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Position your cursor in the center of the board and make quick movements to the moles. 
            This minimizes the distance you need to move your mouse for each click!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
