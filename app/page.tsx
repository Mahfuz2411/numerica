"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Clock3,
  CloudOff,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const appear = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
}

const capabilities = [
  {
    icon: Sparkles,
    title: "Polished Gameplay",
    description: "Smooth transitions, clear interactions, and responsive controls across desktop and mobile.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Per-game high scores, session stats, and persistent local progress you control.",
  },
  {
    icon: CloudOff,
    title: "Offline Ready",
    description: "Install and play without a network connection using built-in PWA support.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "No accounts, no trackers, and no hidden data export. Your gameplay stays on your device.",
  },
]

const gameCatalog = [
  { name: "2048", detail: "Tile merge strategy" },
  { name: "Guess the Number", detail: "Code cracking" },
  { name: "Minesweeper", detail: "Risk and logic" },
  { name: "Sudoku", detail: "Pattern deduction" },
  { name: "Memory Card", detail: "Focus and recall" },
  { name: "Tic-Tac-Toe", detail: "Fast tactical rounds" },
  { name: "Whack-a-Mole", detail: "Reaction challenge" },
]

const stats = [
  { label: "Games Available", value: "7" },
  { label: "Install Required", value: "0" },
  { label: "Offline Support", value: "Yes" },
]

export default function HomePage() {
  const [showMobileNotice, setShowMobileNotice] = useState(true)

  return (
    <MainLayout>
      <section className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-7xl flex-col overflow-hidden px-4 py-10 md:min-h-[calc(100dvh-4rem)] md:py-14 lg:min-h-[calc(100vh-4rem)] lg:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-emerald-500/15 via-cyan-500/10 to-transparent blur-3xl" />

        {showMobileNotice && (
          <div className="mb-4 lg:hidden">
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-amber-100 shadow-lg shadow-black/10 backdrop-blur">
              <p className="flex-1 text-xs leading-relaxed sm:text-sm">
                This site is currently optimized for desktop screens. We are actively improving the mobile and tablet UI/UX experience.
              </p>
              <button
                type="button"
                onClick={() => setShowMobileNotice(false)}
                aria-label="Dismiss compatibility notice"
                className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded text-amber-200/80 transition hover:bg-amber-400/20 hover:text-amber-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="show"
          variants={appear}
          className="mx-auto grid flex-1 max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              New: Unified game layout and faster mobile rendering
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              A clean, modern hub for daily logic games
            </h1>

            <p className="max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              Numerica delivers classic puzzle experiences with production-grade UX: responsive gameplay, local progress sync,
              and instant startup across every device.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/games"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full gap-2 bg-linear-to-r from-emerald-500 to-cyan-500 text-black hover:from-emerald-400 hover:to-cyan-400 sm:w-auto"
                )}
              >
                Start Playing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/settings"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
              >
                Manage Preferences
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 sm:max-w-xl">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border/60 bg-card/60 p-3">
                  <p className="text-lg font-semibold md:text-xl">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-linear-to-b from-card/90 to-card/50 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Gamepad2 className="h-4 w-4 text-cyan-400" />
                Game Library
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                Instant launch
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {gameCatalog.map((game) => (
                <div
                  key={game.name}
                  className="rounded-lg border border-border/60 bg-background/40 p-3"
                >
                  <p className="text-sm font-semibold">{game.name}</p>
                  <p className="text-xs text-muted-foreground">{game.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold md:text-3xl">Built for real product expectations</h2>
            <Link href="/games" className="hidden text-sm text-cyan-400 hover:text-cyan-300 md:inline-flex">
              Explore all games
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="h-full border-border/70 bg-card/70 backdrop-blur">
                    <CardHeader>
                      <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border/70 bg-linear-to-r from-emerald-500/15 via-cyan-500/10 to-transparent p-6 text-center md:p-10"
        >
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to make your daily game session better?</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Start with quick rounds, track your performance over time, and keep your favorite logic games in one place.
              Numerica is designed to feel lightweight, reliable, and fun every single day.
            </p>
            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <Link
                href="/games"
                className={cn(buttonVariants({ size: "lg" }), "w-full gap-2 sm:w-auto")}
              >
                Open Game Hub
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/games/minesweeper"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
              >
                Try Minesweeper
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          <Card className="bg-card/60">
            <CardContent className="p-5 text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">Fast Access</p>
              Launch directly from browser and continue where you left off.
            </CardContent>
          </Card>
          <Card className="bg-card/60">
            <CardContent className="p-5 text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">Clear Difficulty Steps</p>
              Easy to hard progression across puzzle and reflex categories.
            </CardContent>
          </Card>
          <Card className="bg-card/60">
            <CardContent className="p-5 text-sm text-muted-foreground">
              <p className="mb-2 font-semibold text-foreground">Local Control</p>
              Manage stored progress and preferences from one settings page.
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-xs text-muted-foreground"
        >
          Trusted by players who want focused gameplay, not unnecessary clutter.
        </motion.p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16">
        <Card className="border-border/70 bg-card/40">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div>
              <p className="text-lg font-semibold">One destination for classic logic games</p>
              <p className="text-sm text-muted-foreground">Play now, track progress, and keep improving.</p>
            </div>
            <Link
              href="/games"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              Browse Library
              <Trophy className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  )
}

