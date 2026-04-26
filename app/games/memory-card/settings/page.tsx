"use client"

import { useState, useEffect } from "react"
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

const GAME_ID = "memory-card"

export default function MemoryCardSettingsPage() {
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    databaseEnabled: true,
  })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const savedSettings = gameSettings.get(GAME_ID)
    setSettings(savedSettings)
  }

  const handleClearScores = async () => {
    try {
      setIsClearing(true)
      await gameDB.clearScores(GAME_ID)
      toast.success("All scores cleared!")
    } catch (error) {
      console.error("Error clearing scores:", error)
      toast.error("Failed to clear scores")
    } finally {
      setIsClearing(false)
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
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Scores
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all scores?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all saved scores for this game.
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
