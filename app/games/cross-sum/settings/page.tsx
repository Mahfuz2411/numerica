"use client"

import { useEffect, useState } from "react"
import { Trash2, Volume2, VolumeX, Database, DatabaseZap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { gameDB } from "@/lib/db/game-db"
import { gameSettings, type GameSettings } from "@/lib/db/game-settings"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

const GAME_ID = "cross-sum"

export default function CrossSumSettingsPage() {
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    databaseEnabled: true,
  })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    const savedSettings = gameSettings.get(GAME_ID)
    setSettings(savedSettings)
  }, [])

  const handleClearScores = async () => {
    try {
      setIsClearing(true)
      await gameDB.clearScores(GAME_ID)
      localStorage.removeItem(`${GAME_ID}-best-time`)
      localStorage.removeItem(`${GAME_ID}-games-solved`)
      localStorage.removeItem(`${GAME_ID}-latest-achievement`)
      toast.success("All game data cleared!")
    } catch (error) {
      console.error("Error clearing scores:", error)
      toast.error("Failed to clear game data")
    } finally {
      setIsClearing(false)
    }
  }

  const toggleSound = () => {
    const nextSettings = { ...settings, soundEnabled: !settings.soundEnabled }
    setSettings(nextSettings)
    gameSettings.set(GAME_ID, nextSettings)
  }

  const toggleDatabase = () => {
    const nextSettings = { ...settings, databaseEnabled: !settings.databaseEnabled }
    setSettings(nextSettings)
    gameSettings.set(GAME_ID, nextSettings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Settings</CardTitle>
        <CardDescription>Customize your Cross Sum experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
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
          <Button variant={settings.soundEnabled ? "default" : "outline"} onClick={toggleSound}>
            {settings.soundEnabled ? "Disable" : "Enable"}
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {settings.databaseEnabled ? (
              <Database className="h-5 w-5 text-primary" />
            ) : (
              <DatabaseZap className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-semibold">Score Tracking</p>
              <p className="text-sm text-muted-foreground">
                {settings.databaseEnabled ? "Scores are being saved" : "Scores are not saved"}
              </p>
            </div>
          </div>
          <Button variant={settings.databaseEnabled ? "default" : "outline"} onClick={toggleDatabase}>
            {settings.databaseEnabled ? "Disable" : "Enable"}
          </Button>
        </div>

        <div className="border-t pt-4">
          <Button variant="destructive" className="w-full" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Data
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all saved scores and progress for this game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isClearing}
              onClick={async () => {
                setConfirmOpen(false)
                await handleClearScores()
              }}
            >
              {isClearing ? "Clearing..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
