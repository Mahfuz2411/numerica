export interface Card {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

export interface GameState {
  cards: Card[]
  flippedCards: number[]
  matchedPairs: number
  moves: number
  startTime: number | null
  endTime: number | null
}

const CARD_EMOJIS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎹"]

export function createDeck(pairCount: number = 8): Card[] {
  const emojis = CARD_EMOJIS.slice(0, pairCount)
  const cards: Card[] = []

  emojis.forEach((emoji, index) => {
    cards.push(
      {
        id: index * 2,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: index * 2 + 1,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      }
    )
  })

  return shuffleArray(cards)
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function flipCard(cards: Card[], cardId: number): Card[] {
  return cards.map((card) =>
    card.id === cardId ? { ...card, isFlipped: true } : card
  )
}

export function checkMatch(
  cards: Card[],
  firstCardId: number,
  secondCardId: number
): { matched: boolean; cards: Card[] } {
  const firstCard = cards.find((c) => c.id === firstCardId)
  const secondCard = cards.find((c) => c.id === secondCardId)

  if (!firstCard || !secondCard) {
    return { matched: false, cards }
  }

  const matched = firstCard.value === secondCard.value

  if (matched) {
    return {
      matched: true,
      cards: cards.map((card) =>
        card.id === firstCardId || card.id === secondCardId
          ? { ...card, isMatched: true }
          : card
      ),
    }
  }

  return { matched: false, cards }
}

export function unflipCards(cards: Card[], cardIds: number[]): Card[] {
  return cards.map((card) =>
    cardIds.includes(card.id) && !card.isMatched
      ? { ...card, isFlipped: false }
      : card
  )
}

export function calculateScore(moves: number, timeInSeconds: number): number {
  // Lower moves and faster time = higher score
  const movesPenalty = moves * 10
  const timePenalty = Math.floor(timeInSeconds / 10)
  const baseScore = 10000
  return Math.max(0, baseScore - movesPenalty - timePenalty)
}

export function isGameComplete(cards: Card[]): boolean {
  return cards.every((card) => card.isMatched)
}
