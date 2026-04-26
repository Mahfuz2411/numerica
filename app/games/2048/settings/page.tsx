"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
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

const GAME_ID = "2048"

export default function Settings2048Page() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClearData = () => {
    localStorage.removeItem(`${GAME_ID}-best-score`)
    localStorage.removeItem(`${GAME_ID}-games-played`)
    localStorage.removeItem(`${GAME_ID}-total-score`)
    setShowConfirm(false)
    window.location.reload()
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your game preferences and data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Controls</CardTitle>
          <CardDescription>
            Available controls for playing 2048
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Keyboard</h3>
            <div className="flex flex-wrap gap-2">
              <kbd className="px-3 py-2 bg-muted rounded border text-sm">↑ Up</kbd>
              <kbd className="px-3 py-2 bg-muted rounded border text-sm">↓ Down</kbd>
              <kbd className="px-3 py-2 bg-muted rounded border text-sm">← Left</kbd>
              <kbd className="px-3 py-2 bg-muted rounded border text-sm">→ Right</kbd>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <kbd className="px-3 py-2 bg-muted rounded border text-sm">W</kbd>
              <kbd className="px-3 py-2 bg-muted rounded border text-sm">A</kbd>
              <kbd className="px-3 py-2 bg-muted rounded border text-sm">S</kbd>
              <kbd className="px-3 py-2 bg-muted rounded border text-sm">D</kbd>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Touch Controls</h3>
            <p className="text-sm text-muted-foreground">
              Swipe in any direction (up, down, left, right) to move tiles on mobile devices.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About the Game</CardTitle>
          <CardDescription>
            2048 is a popular sliding tile puzzle game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            The game was originally created by Gabriele Cirulli in 2014. The objective is to slide numbered tiles on a grid to combine them and create a tile with the number 2048.
          </p>
          <p className="text-sm text-muted-foreground">
            This version includes smooth animations, responsive design, and score tracking to enhance your gaming experience.
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will delete your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button
              variant="destructive"
              onClick={() => setShowConfirm(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will delete your best score, games played, and all statistics.
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all 2048 data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your scores and statistics will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleClearData}>
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
