export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Numerica',
  alternateName: 'Numerica Gaming Hub',
  url: 'https://numerica247.vercel.app',
  description: 'Play classic logic games including Tic-Tac-Toe, Memory Card, Minesweeper, Whack-a-Mole, and Sudoku online for free.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://numerica247.vercel.app/games?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Numerica',
    logo: {
      '@type': 'ImageObject',
      url: 'https://numerica247.vercel.app/icon.svg'
    }
  }
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Numerica',
  url: 'https://numerica247.vercel.app',
  logo: 'https://numerica247.vercel.app/icon.svg',
  description: 'Free online gaming platform featuring classic logic and puzzle games',
  sameAs: [
    // Add your social media links here when available
    // 'https://twitter.com/numerica',
    // 'https://facebook.com/numerica',
  ]
}

export const gameSchemas = {
  minesweeper: {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Minesweeper',
    description: 'Play the classic Minesweeper game online with multiple difficulty levels',
    gamePlatform: 'Web Browser',
    genre: 'Puzzle',
    url: 'https://numerica247.vercel.app/games/minesweeper',
    author: {
      '@type': 'Organization',
      name: 'Numerica'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  },
  'tic-tac-toe': {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Tic-Tac-Toe',
    description: 'Classic strategy game with multiple difficulty levels',
    gamePlatform: 'Web Browser',
    genre: 'Strategy',
    url: 'https://numerica247.vercel.app/games/tic-tac-toe',
    author: {
      '@type': 'Organization',
      name: 'Numerica'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  },
  'memory-card': {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Memory Card Game',
    description: 'Test your memory by matching pairs of cards',
    gamePlatform: 'Web Browser',
    genre: 'Puzzle',
    url: 'https://numerica247.vercel.app/games/memory-card',
    author: {
      '@type': 'Organization',
      name: 'Numerica'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  },
  'whack-a-mole': {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Whack-a-Mole',
    description: 'Test your reflexes in this classic arcade game',
    gamePlatform: 'Web Browser',
    genre: 'Arcade',
    url: 'https://numerica247.vercel.app/games/whack-a-mole',
    author: {
      '@type': 'Organization',
      name: 'Numerica'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  },
  sudoku: {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Sudoku',
    description: 'Solve the classic 9×9 Sudoku puzzle online',
    gamePlatform: 'Web Browser',
    genre: 'Puzzle',
    url: 'https://numerica247.vercel.app/games/sudoku',
    author: {
      '@type': 'Organization',
      name: 'Numerica'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }
}

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})
