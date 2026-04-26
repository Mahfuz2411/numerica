"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock3, Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

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

const genres = ["Strategy", "Logic", "Memory", "Reflex", "Numbers"]

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    description: "Classic 3x3 strategy game. Can you beat the AI or play with a friend?",
    icon: "🎯",
    players: "1-2 Players",
    genre: "Strategy",
    pace: "Fast",
    new: false,
    disabled: false,
  },
  {
    id: "memory-card",
    title: "Memory Card Game",
    description: "Test your memory by matching pairs of cards. How fast can you complete it?",
    icon: "🃏",
    players: "1 Player",
    genre: "Memory",
    pace: "Balanced",
    new: false,
    disabled: false,
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    description: "Classic puzzle game. Clear the board without hitting any mines using logic!",
    icon: "💣",
    players: "1 Player",
    genre: "Logic",
    pace: "Deliberate",
    new: false,
    disabled: false,
  },
  {
    id: "whack-a-mole",
    title: "Whack-a-Mole",
    description: "Test your reflexes! Click the moles as fast as you can before they disappear!",
    icon: "🦫",
    players: "1 Player",
    genre: "Reflex",
    pace: "Fast",
    new: false,
    disabled: false,
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Classic number puzzle. Fill the 9x9 grid using logic and deduction!",
    icon: "🔢",
    players: "1 Player",
    genre: "Numbers",
    pace: "Deliberate",
    new: false,
    disabled: false,
  },
  {
    id: "2048",
    title: "2048",
    description: "Combine numbered tiles to reach 2048! Addictive sliding tile puzzle game.",
    icon: "🎲",
    players: "1 Player",
    genre: "Numbers",
    pace: "Balanced",
    new: false,
    disabled: false,
  },
  {
    id: "guess-the-number",
    title: "Guess the Number",
    description: "Crack the hidden 5-digit code. Get feedback on correct positions after each guess.",
    icon: "🔐",
    players: "1 Player",
    genre: "Logic",
    pace: "Balanced",
    new: true,
    disabled: false,
  },
  {
    id: "cross-sum",
    title: "Cross Sum",
    description: "Remove extra numbers so row and column sums match the targets. You only get 3 mistakes!",
    icon: "🧮",
    players: "1 Player",
    genre: "Numbers",
    pace: "Deliberate",
    new: true,
    disabled: false,
  },
]

export default function GamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedAge, setSelectedAge] = useState<"all" | "new" | "old">("all")

  const filteredGames = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return [...games]
      .sort((a, b) => {
        if (a.new !== b.new) return a.new ? -1 : 1
        return a.title.localeCompare(b.title)
      })
      .filter((game) => {
        const byGenre = selectedGenre === "All" || game.genre === selectedGenre
        const byAge = selectedAge === "all" || (selectedAge === "new" ? game.new : !game.new)
        const byTerm =
          term.length === 0 ||
          game.title.toLowerCase().includes(term) ||
          game.description.toLowerCase().includes(term) ||
          game.genre.toLowerCase().includes(term)

        return byGenre && byAge && byTerm
      })
  }, [searchTerm, selectedGenre, selectedAge])

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 md:space-y-10"
        >
          <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-r from-cyan-500/10 via-emerald-500/10 to-transparent p-6 md:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Game Library
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Find your next logic challenge</h1>
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                Pick from strategy, memory, number, and reflex games. Every title is optimized for quick sessions,
                local progress tracking, and smooth browser gameplay.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                <div className="rounded-xl border border-border/60 bg-card/60 p-3">
                  <p className="text-xl font-bold">{games.length}</p>
                  <p className="text-xs text-muted-foreground">Playable Games</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3">
                  <p className="text-xl font-bold">5+</p>
                  <p className="text-xs text-muted-foreground">Puzzle Styles</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3">
                  <p className="text-xl font-bold">Local</p>
                  <p className="text-xs text-muted-foreground">Progress Save</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/60 p-3">
                  <p className="text-xl font-bold">PWA</p>
                  <p className="text-xs text-muted-foreground">Offline Ready</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              Live filter and search
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or genre..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none ring-0 transition-colors focus:border-cyan-400"
                />
              </label>

              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value as "all" | "new" | "old")}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-cyan-400"
              >
                <option value="all">All Games</option>
                <option value="new">New First</option>
                <option value="old">Classic Only</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedGenre("All")}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selectedGenre === "All"
                    ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-300"
                    : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                )}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    selectedGenre === genre
                      ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-300"
                      : "border-border bg-muted/40 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold md:text-xl">All Titles</h2>
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
              Showing {filteredGames.length} games • Sorted: New → Old
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredGames.map((game) => (
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
                    <Card className="group h-full cursor-pointer overflow-hidden border-border/70 bg-card/70 transition-all hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10">
                      <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 8 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="text-5xl"
                          >
                            {game.icon}
                          </motion.div>
                          <div className="flex items-center gap-2">
                            {game.new && (
                              <span className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300">
                                New
                              </span>
                            )}
                            <span className="rounded-full border border-border bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground">
                              {game.genre}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <CardTitle className="transition-colors group-hover:text-cyan-300">
                            {game.title}
                          </CardTitle>
                          <CardDescription>
                            {game.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-secondary px-2 py-1">
                            {game.players}
                          </span>
                          <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                            Pace: {game.pace}
                          </span>
                        </div>

                        <Button className={cn("w-full cursor-pointer gap-2", "group-hover:border-cyan-400/40")} variant="outline">
                          Play Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </motion.div>
            ))}

            <motion.div variants={item}>
              <Card className="h-full overflow-hidden border-border/70 border-dashed bg-card/40">
                <CardHeader className="space-y-4">
                  <div className="text-5xl">✨</div>
                  <div className="space-y-2">
                    <CardTitle>More Games Coming Soon</CardTitle>
                    <CardDescription>
                      We are cooking new puzzle ideas for you. Stay tuned for the next drop.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
                      Thinking about games logic.
                    </span>
                  </div>
                  <Button className="w-full" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground">No games match your search. Try a different keyword or filter.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  )
}
