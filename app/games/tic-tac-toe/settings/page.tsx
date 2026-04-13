"use client"

import { useState, useEffect } from "react"
import { Trash2, Volume2, VolumeX, Database, DatabaseZap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { gameDB } from "@/lib/db/game-db"
import { gameSettings, type GameSettings } from "@/lib/db/game-settings"

const GAME_ID = "tic-tac-toe"

export default function TicTacToeSettingsPage() {
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    databaseEnabled: true,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const savedSettings = gameSettings.get(GAME_ID)
    setSettings(savedSettings)
  }

  const handleClearScores = async () => {
    if (confirm("Are you sure you want to clear all scores for this game?")) {
      try {
        await gameDB.clearScores(GAME_ID)
        alert("All scores cleared!")
      } catch (error) {
        console.error("Error clearing scores:", error)
        alert("Failed to clear scores")
      }
    }
  }

  const toggleSound = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled }
    setSettings(newSettings)
    gameSettings.set(GAME_ID, newSettings)
  }

  const toggleDatabase = () => {
    const newSettings = { ...settings, databaseEnabled: !settings.databaseEnabled }
    setSettings(newSettings)
    gameSettings.set(GAME_ID, newSettings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Settings</CardTitle>
        <CardDescription>Customize your gaming experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-semibold">Sound Effects</p>
              <p className="text-sm text-muted-foreground">
                {settings.soundEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <Button
            variant={settings.soundEnabled ? "default" : "outline"}
            onClick={toggleSound}
          >
            {settings.soundEnabled ? "Disable" : "Enable"}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            {settings.databaseEnabled ? (
              <Database className="h-5 w-5 text-primary" />
            ) : (
              <DatabaseZap className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-semibold">Score Tracking</p>
              <p className="text-sm text-muted-foreground">
                {settings.databaseEnabled
                  ? "Scores are being saved"
                  : "Scores are not saved"}
              </p>
            </div>
          </div>
          <Button
            variant={settings.databaseEnabled ? "default" : "outline"}
            onClick={toggleDatabase}
          >
            {settings.databaseEnabled ? "Disable" : "Enable"}
          </Button>
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleClearScores}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Scores
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
