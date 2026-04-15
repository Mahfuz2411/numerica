"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Palette, Volume2, Moon, Sun, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { gameDB } from "@/lib/db/game-db"
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

type GameStorageInfo = {
  gameId: string
  gameName: string
  scoreCount: number
  localEntryCount: number
  estimatedSize: string
}

const STORAGE_GAMES = [
  {
    id: "2048",
    name: "2048",
    storagePrefixes: ["2048-", "numerica-settings-2048"],
  },
  {
    id: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    storagePrefixes: ["tic-tac-toe", "numerica-settings-tic-tac-toe"],
  },
  {
    id: "memory-card",
    name: "Memory Card Game",
    storagePrefixes: ["memory-card", "numerica-settings-memory-card"],
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    storagePrefixes: ["minesweeper", "numerica-settings-minesweeper"],
  },
  {
    id: "sudoku",
    name: "Sudoku",
    storagePrefixes: ["sudoku-", "numerica-settings-sudoku"],
  },
  {
    id: "whack-a-mole",
    name: "Whack-a-Mole",
    storagePrefixes: ["whack-a-mole-", "numerica-settings-whack-a-mole"],
  },
  {
    id: "guess-the-number",
    name: "Guess the Number",
    storagePrefixes: ["guess-the-number-", "numerica-settings-guess-the-number"],
  },
]

type ClearTarget =
  | { type: "game"; gameId: string; gameName: string }
  | { type: "all" }

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [storageInfo, setStorageInfo] = useState<GameStorageInfo[]>([])
  const [isLoadingStorage, setIsLoadingStorage] = useState(true)
  const [clearTarget, setClearTarget] = useState<ClearTarget | null>(null)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadStorageInfo()
  }, [])

  const bytesToReadableSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`

    const sizeKB = bytes / 1024
    if (sizeKB < 1024) return `${sizeKB.toFixed(2)} KB`

    const sizeMB = sizeKB / 1024
    return `${sizeMB.toFixed(2)} MB`
  }

  const getMatchingStorageKeys = (prefixes: string[]) => {
    const matches: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue

      if (prefixes.some((prefix) => key.startsWith(prefix))) {
        matches.push(key)
      }
    }

    return matches
  }

  const loadStorageInfo = async () => {
    try {
      setIsLoadingStorage(true)

      const info: GameStorageInfo[] = []
      
      for (const game of STORAGE_GAMES) {
        const scores = await gameDB.getScoresByGame(game.id, 1000)
        const scoreCount = scores.length

        const scoreBytes = scores.reduce((total, score) => {
          return total + JSON.stringify(score).length
        }, 0)

        const localKeys = getMatchingStorageKeys(game.storagePrefixes)
        const localBytes = localKeys.reduce((total, key) => {
          const value = localStorage.getItem(key) ?? ""
          return total + key.length + value.length
        }, 0)

        const totalBytes = scoreBytes + localBytes

        if (scoreCount === 0 && localKeys.length === 0) {
          continue
        }

        info.push({
          gameId: game.id,
          gameName: game.name,
          scoreCount,
          localEntryCount: localKeys.length,
          estimatedSize: bytesToReadableSize(totalBytes),
        })
      }

      setStorageInfo(info)
    } catch (error) {
      console.error("Error loading storage info:", error)
    } finally {
      setIsLoadingStorage(false)
    }
  }

  const handleClearGameData = async (gameId: string, gameName: string) => {
    try {
      await gameDB.clearScores(gameId)

      const game = STORAGE_GAMES.find((item) => item.id === gameId)
      const keysToRemove = game ? getMatchingStorageKeys(game.storagePrefixes) : []
      keysToRemove.forEach((key) => localStorage.removeItem(key))

      if (game) {
        const sessionKeysToRemove: string[] = []
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key && game.storagePrefixes.some((prefix) => key.startsWith(prefix))) {
            sessionKeysToRemove.push(key)
          }
        }
        sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key))
      }

      await loadStorageInfo()
      toast.success(`${gameName} data cleared.`)
    } catch (error) {
      console.error("Error clearing game data:", error)
      toast.error("Failed to clear game data")
    }
  }

  const handleClearAllData = async () => {
    try {
      await gameDB.clearScores()

      localStorage.clear()
      sessionStorage.clear()

      await loadStorageInfo()
      toast.success("All data cleared.")
    } catch (error) {
      console.error("Error clearing all data:", error)
      toast.error("Failed to clear all data")
    }
  }

  return (
    <MainLayout>
      <div className="container px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6 md:space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Configure your gaming experience
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Choose your preferred theme
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mounted && (
                  <div className="flex gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="flex-1 gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="flex-1 gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="flex-1 gap-2"
                    >
                      System
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Sound</CardTitle>
                    <CardDescription>
                      Game-specific sound settings available in each game
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Storage</CardTitle>
                    <CardDescription>
                      Manage your game data and scores
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingStorage ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Loading storage info...
                  </div>
                ) : (
                  <>
                    {storageInfo.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Storage by Game</p>
                        {storageInfo.map((game) => (
                          <div
                            key={game.gameId}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{game.gameName}</p>
                              <p className="text-xs text-muted-foreground">
                                {game.scoreCount} {game.scoreCount === 1 ? "score" : "scores"} · {game.localEntryCount} {game.localEntryCount === 1 ? "local item" : "local items"} · {game.estimatedSize}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setClearTarget({ type: "game", gameId: game.gameId, gameName: game.gameName })}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No game data stored
                      </p>
                    )}
                    
                    <div className="pt-2 border-t">
                      <Button
                        variant="destructive"
                        className="w-full justify-start gap-2"
                        onClick={() => setClearTarget({ type: "all" })}
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All Data
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        This will delete all game scores, settings, and preferences
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <AlertDialog
          open={clearTarget !== null}
          onOpenChange={(open) => {
            if (!open) {
              setClearTarget(null)
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {clearTarget?.type === "all"
                  ? "Clear all data?"
                  : `Clear ${clearTarget?.gameName} data?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {clearTarget?.type === "all"
                  ? "This will delete all saved scores, settings, and preferences across the site."
                  : "This will delete the saved scores and local storage entries for this game."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={isClearing}
                onClick={async () => {
                  const target = clearTarget
                  setClearTarget(null)

                  if (!target) {
                    return
                  }

                  setIsClearing(true)
                  try {
                    if (target.type === "all") {
                      await handleClearAllData()
                    } else {
                      await handleClearGameData(target.gameId, target.gameName)
                    }
                  } finally {
                    setIsClearing(false)
                  }
                }}
              >
                {isClearing ? "Clearing..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  )
}
