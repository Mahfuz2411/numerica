// Game Settings stored in localStorage
export interface GameSettings {
  soundEnabled: boolean
  databaseEnabled: boolean
}

const SETTINGS_PREFIX = "numerica-settings-"

export const gameSettings = {
  get(gameId: string): GameSettings {
    if (typeof window === "undefined") {
      return { soundEnabled: true, databaseEnabled: true }
    }

    const stored = localStorage.getItem(`${SETTINGS_PREFIX}${gameId}`)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return { soundEnabled: true, databaseEnabled: true }
      }
    }
    return { soundEnabled: true, databaseEnabled: true }
  },

  set(gameId: string, settings: GameSettings): void {
    if (typeof window === "undefined") return
    localStorage.setItem(`${SETTINGS_PREFIX}${gameId}`, JSON.stringify(settings))
  },

  clear(gameId: string): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(`${SETTINGS_PREFIX}${gameId}`)
  },

  clearAll(): void {
    if (typeof window === "undefined") return
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(SETTINGS_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  },
}
