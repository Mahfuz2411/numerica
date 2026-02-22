"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

export function ScrollIndicator() {
  const [scrollY, setScrollY] = useState(0)
  const [showIndicator, setShowIndicator] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset)
      setShowIndicator(true)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isAtTop = scrollY < 200
  
  const handleClick = () => {
    if (isAtTop) {
      // Scroll down to next section
      window.scrollTo({
        top: window.innerHeight * 0.8,
        behavior: "smooth",
      })
    } else {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            aria-label={isAtTop ? "Scroll down" : "Scroll to top"}
          >
            <AnimatePresence mode="wait">
              {isAtTop ? (
                <motion.div
                  key="scroll-down"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.div
                    animate={{
                      y: [0, 8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors"
                  >
                    Scroll
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all shadow-lg"
                    animate={{
                      y: [0, 8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronDown className="w-6 h-6 text-primary" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="scroll-up"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all shadow-lg"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronUp className="w-6 h-6 text-primary" />
                  </motion.div>
                  <motion.div
                    className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Top
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
