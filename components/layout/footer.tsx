"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/games" },
  { label: "Settings", href: "/settings" },
]

const productPoints = [
  "Instant access to classic logic games",
  "Local progress and settings management",
  "Responsive, offline-friendly experience",
]

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-auto border-t bg-background/80 py-8 md:py-10"
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr_0.9fr] md:gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">Numerica</h3>
              <Badge variant="secondary">PWA</Badge>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              A focused game hub for quick rounds, local progress, and polished puzzle experiences across devices.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {productPoints.map((point) => (
                <Badge key={point} variant="outline" className="rounded-full px-3 py-1 text-[11px] font-normal">
                  {point}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Platform
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Built with Next.js, TypeScript, Tailwind, and motion-driven UI patterns for a responsive product feel.
            </p>
          </div>
        </div>

        <Separator className="my-6 md:my-8" />

        <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} Numerica. All rights reserved.</p>
          <p>Designed for quick access, clear focus, and uninterrupted play.</p>
        </div>
      </div>
    </motion.footer>
  )
}
