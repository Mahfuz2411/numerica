"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
}

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    description: "Classic 3x3 strategy game. Can you beat the AI or play with a friend?",
    icon: "🎯",
    difficulty: "Easy",
    players: "1-2 Players",
    disabled: false, // Set to true to disable this game
  },
  {
    id: "memory-card",
    title: "Memory Card Game",
    description: "Test your memory by matching pairs of cards. How fast can you complete it?",
    icon: "🃏",
    difficulty: "Medium",
    players: "1 Player",
    disabled: false, // Set to true to disable this game
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    description: "Classic puzzle game. Clear the board without hitting any mines using logic!",
    icon: "💣",
    difficulty: "Medium",
    players: "1 Player",
    disabled: false, // Set to true to disable this game
  },
  {
    id: "whack-a-mole",
    title: "Whack-a-Mole",
    description: "Test your reflexes! Click the moles as fast as you can before they disappear!",
    icon: "🦫",
    difficulty: "Easy to Hard",
    players: "1 Player",
    disabled: true, // Set to true to disable this game
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Classic number puzzle. Fill the 9x9 grid using logic and deduction!",
    icon: "🔢",
    difficulty: "Easy to Expert",
    players: "1 Player",
    disabled: false, // Set to true to disable this game
  },
  {
    id: "2048",
    title: "2048",
    description: "Combine numbered tiles to reach 2048! Addictive sliding tile puzzle game.",
    icon: "🎲",
    difficulty: "Medium",
    players: "1 Player",
    disabled: false, // Set to true to disable this game
  },
]

export default function GamesPage() {
  return (
    <MainLayout>
      <div className="container px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 md:space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">All Games</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Choose a game and start playing!
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {games.map((game) => (
              <motion.div key={game.id} variants={item}>
                {game.disabled ? (
                  <Card className="h-full overflow-hidden opacity-60 cursor-not-allowed">
                    <CardHeader className="space-y-4">
                      <div className="text-6xl opacity-50">
                        {game.icon}
                      </div>
                      <div>
                        <CardTitle className="text-muted-foreground">
                          {game.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {game.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {game.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {game.players}
                        </span>
                      </div>
                      <Button className="w-full" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Link href={`/games/${game.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 overflow-hidden">
                      <CardHeader className="space-y-4">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className="text-6xl"
                        >
                          {game.icon}
                        </motion.div>
                        <div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {game.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {game.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {game.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-secondary">
                            {game.players}
                          </span>
                        </div>
                        <Button className="w-full" variant="outline">
                          Play Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>

          {games.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground">No games available yet.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  )
}
