"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Palette, Volume2, Moon, Sun, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { gameDB } from "@/lib/db/game-db"

type GameStorageInfo = {
  gameId: string
  gameName: string
  scoreCount: number
  estimatedSize: string
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [storageInfo, setStorageInfo] = useState<GameStorageInfo[]>([])
  const [isLoadingStorage, setIsLoadingStorage] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadStorageInfo()
  }, [])

  const loadStorageInfo = async () => {
    try {
      setIsLoadingStorage(true)
      const games = [
        { id: "tic-tac-toe", name: "🎯 Tic-Tac-Toe" },
        { id: "memory-card", name: "🃏 Memory Card Game" },
      ]

      const info: GameStorageInfo[] = []
      
      for (const game of games) {
        const scores = await gameDB.getScoresByGame(game.id, 1000)
        const scoreCount = scores.length
        
        // Estimate storage size (rough calculation)
        const avgScoreSize = 200 // bytes per score entry (approximate)
        const totalBytes = scoreCount * avgScoreSize
        const sizeKB = totalBytes / 1024
        const estimatedSize = sizeKB < 1 ? `${totalBytes} B` : `${sizeKB.toFixed(2)} KB`

        info.push({
          gameId: game.id,
          gameName: game.name,
          scoreCount,
          estimatedSize,
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
    if (confirm(`Are you sure you want to clear all data for ${gameName}?`)) {
      try {
        await gameDB.clearScores(gameId)
        
        // Also clear localStorage for this game
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(gameId)) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Reload storage info
        await loadStorageInfo()
      } catch (error) {
        console.error("Error clearing game data:", error)
        alert("Failed to clear game data")
      }
    }
  }

  const handleClearAllData = async () => {
    if (confirm("Are you sure you want to clear ALL game data including scores and settings?")) {
      try {
        // Clear all scores from IndexedDB
        await gameDB.clearScores()
        
        // Clear localStorage and sessionStorage
        localStorage.clear()
        sessionStorage.clear()
        
        // Reload storage info
        await loadStorageInfo()
        
        alert("All data cleared!")
      } catch (error) {
        console.error("Error clearing all data:", error)
        alert("Failed to clear all data")
      }
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
                                {game.scoreCount} {game.scoreCount === 1 ? "score" : "scores"} · {game.estimatedSize}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClearGameData(game.gameId, game.gameName)}
                              className="text-destructive hover:text-destructive"
                              disabled={game.scoreCount === 0}
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
                        onClick={handleClearAllData}
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
      </div>
    </MainLayout>
  )
}
