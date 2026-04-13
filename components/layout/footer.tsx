"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="border-t py-6 md:py-8 mt-auto"
    >
      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="font-semibold mb-2">Numerica</h3>
            <p className="text-sm text-muted-foreground">
              Enjoy smooth, engaging logical games with beautiful animations
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/games" className="hover:text-primary transition-colors">
                  Games
                </a>
              </li>
              <li>
                <a href="/settings" className="hover:text-primary transition-colors">
                  Settings
                </a>
              </li>
            </ul>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-2">Developer</h3>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using Next.js, TypeScript, and Framer Motion
            </p>
          </div>
        </div>
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Numerica. All rights reserved.
        </div>
      </div>
    </motion.footer>
  )
}
