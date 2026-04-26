"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card as UICard } from "@/components/ui/card"
import {
    createDeck,
    flipCard,
    checkMatch,
    unflipCards,
    calculateScore,
    isGameComplete,
    type Card,
} from "@/lib/games/memory-card"
import { gameDB } from "@/lib/db/game-db"
import { gameSettings } from "@/lib/db/game-settings"
import { cn } from "@/lib/utils"

interface MemoryCardGameProps {
    gameId?: string
}

export function MemoryCardGame({ gameId = "memory-card" }: MemoryCardGameProps) {
    const [sessionState, setSessionState] = useState<"idle" | "playing" | "paused">("idle")
    const [cards, setCards] = useState<Card[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [moves, setMoves] = useState(0)
    const [matchedPairs, setMatchedPairs] = useState(0)
    const [startTime, setStartTime] = useState<number | null>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [isComplete, setIsComplete] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [bestScore, setBestScore] = useState<number | null>(null)

    const settings = gameSettings.get(gameId)

    // Initialize deck on client side only to avoid hydration mismatch
    useEffect(() => {
        setCards(createDeck(8))
        setMounted(true)

        const savedBestScore = localStorage.getItem(`${gameId}-best-score`)
        if (savedBestScore) {
            setBestScore(parseInt(savedBestScore, 10))
        }
    }, [])

    useEffect(() => {
        const onPause = () => {
            setSessionState((prev) => (prev === "playing" ? "paused" : prev))
        }

        window.addEventListener("numerica:pause-game", onPause)
        return () => window.removeEventListener("numerica:pause-game", onPause)
    }, [])

    // Timer
    useEffect(() => {
        if (sessionState !== "playing" || !startTime || isComplete) return

        const interval = setInterval(() => {
            setCurrentTime(Math.floor((Date.now() - startTime) / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime, isComplete, sessionState])

    // Check for game completion
    useEffect(() => {
        if (matchedPairs === 8 && !isComplete) {
            setIsComplete(true)
            const finalTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
            const score = calculateScore(moves, finalTime)

            if (!bestScore || score > bestScore) {
                setBestScore(score)
                localStorage.setItem(`${gameId}-best-score`, score.toString())
            }

            // Save score
            if (settings.databaseEnabled) {
                gameDB.addScore({
                    gameId,
                    score,
                    date: new Date(),
                    metadata: { moves, time: finalTime },
                })
            }
        }
    }, [matchedPairs, isComplete, moves, startTime, gameId, settings.databaseEnabled, bestScore])

    const handleCardClick = async (cardId: number) => {
        if (sessionState !== "playing" || isChecking || flippedCards.length >= 2) return

        const card = cards.find((c) => c.id === cardId)
        if (!card || card.isFlipped || card.isMatched) return

        // Start timer on first move
        if (!startTime) {
            setStartTime(Date.now())
        }

        // Flip the card
        const newCards = flipCard(cards, cardId)
        setCards(newCards)

        const newFlippedCards = [...flippedCards, cardId]
        setFlippedCards(newFlippedCards)

        // Check for match if two cards are flipped
        if (newFlippedCards.length === 2) {
            setIsChecking(true)
            setMoves(moves + 1)

            const [firstCardId, secondCardId] = newFlippedCards
            const { matched, cards: updatedCards } = checkMatch(
                newCards,
                firstCardId,
                secondCardId
            )

            if (matched) {
                setMatchedPairs(matchedPairs + 1)
                setCards(updatedCards)
                setFlippedCards([])
                setIsChecking(false)
            } else {
                // Unflip after delay
                setTimeout(() => {
                    setCards(unflipCards(updatedCards, newFlippedCards))
                    setFlippedCards([])
                    setIsChecking(false)
                }, 1000)
            }
        }
    }

    const resetGame = () => {
        setCards(createDeck(8))
        setFlippedCards([])
        setMoves(0)
        setMatchedPairs(0)
        setStartTime(null)
        setCurrentTime(0)
        setIsComplete(false)
        setIsChecking(false)
    }

    const startGame = () => {
        resetGame()
        setSessionState("playing")
    }

    const togglePause = () => {
        setSessionState((prev) => {
            if (prev === "playing") return "paused"
            setStartTime(Date.now() - currentTime * 1000)
            return "playing"
        })
    }

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <UICard className="p-4">
                <div className="relative mx-auto w-full max-w-sm sm:max-w-md px-2 sm:px-0">
                    {sessionState !== "playing" && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/95 backdrop-blur-sm">
                            <Button onClick={sessionState === "idle" ? startGame : togglePause}>
                                {sessionState === "idle" ? "Start Game" : "Resume Game"}
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-2">{!mounted || cards.length === 0 ? (
                        Array.from({ length: 16 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-full aspect-square rounded-md border-2 bg-card/50 animate-pulse"
                            />
                        ))
                    ) : (
                        cards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <button
                                    onClick={() => handleCardClick(card.id)}
                                    disabled={card.isFlipped || card.isMatched || isChecking}
                                    className="w-full aspect-square disabled:cursor-not-allowed"
                                >
                                    <motion.div
                                        className="relative w-full h-full"
                                        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        <div
                                            className={cn(
                                                "absolute inset-0 rounded-md border-2 flex items-center justify-center",
                                                "bg-linear-to-br from-primary to-primary/60",
                                                card.isMatched && "opacity-0"
                                            )}
                                            style={{ backfaceVisibility: "hidden" }}
                                        >
                                            <span className="text-xl md:text-2xl">🃏</span>
                                        </div>

                                        <div
                                            className={cn(
                                                "absolute inset-0 rounded-md border-2 flex items-center justify-center",
                                                "bg-card",
                                                card.isMatched ? "bg-primary/20 border-primary" : "border-border"
                                            )}
                                            style={{
                                                backfaceVisibility: "hidden",
                                                transform: "rotateY(180deg)",
                                            }}
                                        >
                                            <motion.span
                                                className="text-xl md:text-2xl"
                                                animate={card.isMatched ? { scale: [1, 1.2, 1] } : {}}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {card.value}
                                            </motion.span>
                                        </div>
                                    </motion.div>
                                </button>
                            </motion.div>
                        ))
                    )}
                    </div>
                </div>
            </UICard>

            <UICard className="p-4 space-y-4 lg:sticky lg:top-4">
                <div className="space-y-2 rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Game Stats</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-md bg-muted/40 p-2">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                                <Zap className="h-3 w-3" /> Moves
                            </div>
                            <p className="text-lg font-bold">{moves}</p>
                        </div>
                        <div className="rounded-md bg-muted/40 p-2">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                                <Clock className="h-3 w-3" /> Time
                            </div>
                            <p className="text-lg font-bold">{formatTime(currentTime)}</p>
                        </div>
                        <div className="rounded-md bg-muted/40 p-2">
                            <p className="text-xs text-muted-foreground">Pairs</p>
                            <p className="text-lg font-bold">{matchedPairs}/8</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Game Control</p>
                    {sessionState === "idle" ? (
                        <Button onClick={startGame} className="w-full">Start Game</Button>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={togglePause} variant="outline" className="w-full">
                                {sessionState === "playing" ? "Pause" : "Resume"}
                            </Button>
                            <Button onClick={startGame} variant="outline" className="w-full gap-2">
                                <RotateCcw className="h-4 w-4" />
                                New
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-2 rounded-lg border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Best Score</p>
                    <p className="text-2xl font-bold">{bestScore ?? "-"}</p>
                </div>
            </UICard>
        </div>
    )
}
