export interface GameScore {
  id?: number
  gameId: string
  score: number
  date: Date
  metadata?: Record<string, any>
}

const DB_NAME = "numerica-db"
const DB_VERSION = 1
const STORE_NAME = "game-scores"

class GameDB {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (typeof window === "undefined") return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          })
          objectStore.createIndex("gameId", "gameId", { unique: false })
          objectStore.createIndex("date", "date", { unique: false })
        }
      }
    })
  }

  async addScore(score: Omit<GameScore, "id">): Promise<number> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add({ ...score, date: new Date(score.date) })

      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async getScoresByGame(gameId: string, limit?: number): Promise<GameScore[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index("gameId")
      const request = index.getAll(gameId)

      request.onsuccess = () => {
        let scores = request.result as GameScore[]
        // Sort by score descending
        scores.sort((a, b) => b.score - a.score)
        if (limit) scores = scores.slice(0, limit)
        resolve(scores)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getAllScores(): Promise<GameScore[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result as GameScore[])
      request.onerror = () => reject(request.error)
    })
  }

  async clearScores(gameId?: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)

      if (gameId) {
        // Clear scores for specific game
        const index = store.index("gameId")
        const request = index.openCursor(gameId)

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          } else {
            resolve()
          }
        }
        request.onerror = () => reject(request.error)
      } else {
        // Clear all scores
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      }
    })
  }

  async deleteDatabase(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }

    if (typeof window === "undefined") return

    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const gameDB = new GameDB()
