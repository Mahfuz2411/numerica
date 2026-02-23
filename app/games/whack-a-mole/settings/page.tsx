"use client"

import { Card } from "@/components/ui/card"
import { Settings2, Info } from "lucide-react"

export default function WhackAMoleSettingsPage() {
  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Game Settings
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Difficulty</h3>
            <p className="text-sm text-muted-foreground">
              Change the difficulty level from the main game screen. Each difficulty offers a unique challenge:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground ml-4">
              <li>• <strong>Easy:</strong> 30s game, moles stay for 1.5s</li>
              <li>• <strong>Medium:</strong> 45s game, moles stay for 1s</li>
              <li>• <strong>Hard:</strong> 60s game, moles stay for 0.7s</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Controls</h3>
            <p className="text-sm text-muted-foreground">
              Simply click or tap on moles as they appear. The faster you react, the higher your score!
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Each mole you successfully whack earns you 1 point. Your high score for each difficulty is automatically saved.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Info className="h-5 w-5" />
          About This Game
        </h2>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            Whack-a-Mole is a classic arcade game that tests your reflexes and hand-eye coordination. 
            The game has been enjoyed in arcades for decades, and this digital version brings that fun to your browser!
          </p>
          <p>
            Challenge yourself to beat your high scores and improve your reaction time. With three difficulty levels, 
            there&apos;s always a new challenge waiting!
          </p>
        </div>
      </Card>
    </div>
  )
}
