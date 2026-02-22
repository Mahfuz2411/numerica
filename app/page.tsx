"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Gamepad2, Zap, Trophy, Sparkles, Grid3x3, WifiOff } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollIndicator } from "@/components/scroll-indicator"

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const featuredGames = [
  {
    title: "Tic-Tac-Toe",
    description: "Classic 3x3 strategy game. Challenge your mind!",
    icon: "🎯",
    href: "/games/tic-tac-toe",
  },
  {
    title: "Memory Card",
    description: "Test your memory with matching cards",
    icon: "🃏",
    href: "/games/memory-card",
  },
]

const features = [
  {
    icon: Grid3x3,
    title: "Multiple Mini Games",
    description: "Play various logical games - more coming soon!",
  },
  {
    icon: Trophy,
    title: "Track Your Scores",
    description: "Save and beat your high scores locally",
  },
  {
    icon: WifiOff,
    title: "Play Offline",
    description: "No internet? No problem - play anytime, anywhere",
  },
]

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const gamesRef = useRef<HTMLDivElement>(null)
  
  // Parallax for hero section
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  
  const heroY = useTransform(heroScrollY, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(heroScrollY, [0, 0.5, 1], [1, 0.8, 0.3])
  
  // Parallax for games section
  const { scrollYProgress: gamesScrollY } = useScroll({
    target: gamesRef,
    offset: ["start end", "end start"],
  })
  
  const gamesY = useTransform(gamesScrollY, [0, 1], ["-10%", "10%"])

  return (
    <MainLayout>
      <ScrollIndicator />
      {/* Hero Section */}
      <section ref={heroRef} className="container px-4 py-12 md:py-20 lg:py-32 relative overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center space-y-4 md:space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block"
          >
            <Gamepad2 className="h-16 w-16 md:h-20 md:w-20 text-primary mx-auto" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight px-4"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Numerica
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4"
          >
            Experience smooth, engaging logical games with beautiful animations.
            No downloads required - play instantly in your browser!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/games">Browse Games</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/settings">Settings</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Games */}
      <section ref={gamesRef} className="container px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center"
          >
            Featured Games
          </motion.h2>
          
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ y: gamesY }}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {featuredGames.map((game, index) => (
              <motion.div key={game.href} variants={item}>
                <Link href={game.href}>
                  <Card className="h-full hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="text-5xl mb-4"
                      >
                        {game.icon}
                      </motion.div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {game.title}
                      </CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-center">Why Numerica?</h2>
          
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.title} variants={item}>
                  <Card className="h-full text-center">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="mx-auto mb-4"
                      >
                        <Icon className="h-12 w-12 text-primary" />
                      </motion.div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* About/Developer Section */}
      <section className="container px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <h2 className="text-3xl font-bold">About the Project</h2>
          <p className="text-muted-foreground">
            Numerica is a Progressive Web App built with cutting-edge technologies
            including Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.
            Our mission is to provide smooth, buttery gaming experiences with
            beautiful animations and intuitive design.
          </p>
          <p className="text-sm text-muted-foreground">
            Created with ❤️ by the Numerica team
          </p>
        </motion.div>
      </section>
    </MainLayout>
  )
}

