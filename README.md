# 🎮 Numerica - Master The Numbers

A modern, feature-rich platform for number-related puzzle games. Currently featuring **Guess The Number** with plans to add more number games!

## 🎯 About Numerica

Numerica is a sleek web-based gaming platform dedicated to number puzzles and logic games. Test your logical thinking, climb the rankings, and compete with yourself to improve your scores.

**Current Version:** v8.1 (Multi-game Platform Architecture)

## 🎮 Available Games

### 🎯 Guess The Number
Crack the randomly generated 5-digit code! You have 30 attempts to guess correctly. Get feedback on how many digits you've matched in the right positions.

**Features:**
- 30-attempt limit to guess the 5-digit number
- Real-time feedback on digit matches
- 7-tier ranking system (Hacker → Legend → Master → Pro → Skilled → Beginner → Noob)
- Best, Better, Good score tracking
- Sound effects for correct/incorrect guesses
- Win/lose animations with detailed feedback

## ✨ Platform Features

### 🎨 Modern UI
- Clean, minimalist design with cyan/dark theme
- Smooth animations and transitions
- Glassmorphism effects with backdrop blur
- Professional card layouts

### 📱 Fully Responsive
- **Desktop:** Full sidebar navigation with games list
- **Tablet:** Horizontal sidebar with optimized spacing (768px breakpoint)
- **Mobile:** Compact single-column layout (480px breakpoint)

### 🎵 Audio System
- Web Audio API for sound effects (no external libraries)
- Global audio settings across all games
- Per-game audio feedback for player actions
- Victory and completion sound effects
- Configurable sound toggle in settings

### 📊 Statistics & Tracking
- **Individual Game Stats:** Each game tracks its own performance metrics
- **Overall Statistics:** Aggregate stats across all games
- **Ranking System:** Game-specific ranking based on performance
- **Performance History:** Complete record of all gameplay sessions
- **Data Persistence:** All progress saved in IndexedDB (survives page refresh)
- **Data Management:** Reset option for all statistics

### 🎮 Game Controls
- **Keyboard Navigation:** Tab, arrow keys, Enter for game interaction
- **Mouse/Touch:** Full pointer and touch support
- **Accessibility:** Semantic HTML and ARIA labels
- **Cross-device Support:** Works seamlessly on desktop, tablet, and mobile
- **Game-specific Features:** Each game has optimized controls for its mechanics

### ⚙️ Settings
- 🌙 **Dark/Light Theme:** Persistent theme preference
- 🔊 **Sound Effects:** Global toggle for all audio
- 🗑️ **Data Management:** Reset all game data with confirmation
- **Per-game Settings:** Individual game customization options coming soon

### 🌐 Navigation
- **Games Hub:** Browse and select from available games
- **Individual Game Pages:** Dedicated space with sidebar for Play/Rules/Scores/Settings
- **About Page:** Project information and future plans
- **Persistent Preferences:** Theme and settings saved across sessions

## 🚀 Getting Started

### Play Online
Visit: [https://mahfuz2411.github.io/numerica/](https://mahfuz2411.github.io/numerica/)

### Local Development
```bash
# Clone the repository
git clone https://github.com/Mahfuz2411/numerica.git
cd numerica

# Open with Live Server (VS Code)
# Right-click index.html → "Open with Live Server"
# Or use any local server:
python -m http.server 8000
# Visit: http://localhost:8000
```

## 📁 Project Structure

```
numerica/
├── index.html              # Main HTML structure
├── Styles/
│   ├── main.css           # Primary styles (1700+ lines)
│   └── theme.css          # Dark/light theme variables
├── Scripts/
│   ├── app.js             # App initialization & navigation
│   ├── game.js            # Core game logic
│   ├── ui.js              # UI updates & popups
│   ├── sounds.js          # Web Audio API sounds
│   └── database.js        # IndexedDB management & stats
├── Assets/                # Game assets
└── README.md              # This file
```

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Storage:** IndexedDB (persistent local storage)
- **Audio:** Web Audio API (programmatic sound generation)
- **Styling:** CSS Custom Properties, Flexbox, Grid
- **Theme:** Light/Dark mode with CSS variables
- **No External Dependencies** ✨ (lightweight & fast)

## 🎨 Design Highlights

- **Responsive Breakpoints:** 1024px (desktop), 768px (tablet), 480px (mobile)
- **Custom Popup System:** Beautiful confirmation dialogs
- **Smooth Animations:** CSS transitions and keyframes
- **Accessibility:** Semantic HTML, keyboard navigation support
- **Performance:** Zero dependencies, ~50KB total size

## 📝 Future Roadmap

- 🎲 More number games (Math Puzzle, Sequence, Number Memory, etc.)
- 🏆 Global leaderboard system
- 🎭 Multiplayer challenges
- 🎨 Custom themes
- 📊 Advanced statistics dashboard
- 🔔 Achievement system

## 🐛 Known Issues

None currently! Report bugs on GitHub Issues.

## 📄 License

MIT License - Feel free to use and modify!

## 👤 Developer

Created by [Mahfuz](https://github.com/Mahfuz2411)

## 🔗 Links

- **GitHub Repo:** [numerica](https://github.com/Mahfuz2411/numerica)
- **Live Demo:** [numerica.github.io](https://mahfuz2411.github.io/numerica/)
- **Developer:** [@Mahfuz2411](https://github.com/Mahfuz2411)

---

**Made with ❤️ for number enthusiasts**