# Numerica - Refactored Project Structure

## Version
v8.1 - Modular Architecture Release

## Project Structure

```
numerica/
│
├── index.html                          # Main HTML file (loads core scripts)
├── README.md
├── robots.txt
├── sitemap.xml
│
├── Scripts/
│   ├── core/                          # Shared, reusable modules
│   │   ├── app.js                     # Main app logic & game loader
│   │   ├── database.js                # IndexedDB management
│   │   └── sounds.js                  # Web Audio API for sound effects
│   │
│   └── games/                         # Game-specific modules (lazy-loaded)
│       └── guess-the-number/
│           ├── game.js                # Guess The Number game logic
│           └── ui.js                  # Guess The Number UI management
│
├── Styles/
│   ├── main.css                       # Global styles
│   ├── theme.css                      # Theme variables
│   │
│   └── games/                         # Game-specific styles (lazy-loaded)
│       └── guess-the-number.css       # Guess The Number styles
│
└── Assets/
    └── [game assets]
```

## Architecture Benefits

### 1. **Modularity**
- Each game has its own `game.js` and `ui.js`
- Easy to add new games without touching existing code
- Game-specific styles separated from global styles

### 2. **Performance**
- Core scripts load immediately (app, database, sounds)
- Game scripts load only when user clicks "Play"
- Smaller initial page load size

### 3. **Maintainability**
- Clear separation of concerns
- Debugging is easier (isolated code for each game)
- Easier to refactor individual games

### 4. **Scalability**
- Add new game: Create `Scripts/games/[game-name]/` folder
- Add game styles: Create `Styles/games/[game-name].css`
- Update `APP.loadGame()` to handle game loading

## File Descriptions

### Core Scripts

**Scripts/core/app.js**
- Main application entry point
- Manages navigation (Games list, About)
- Implements dynamic game loading via `loadGame()`
- Handles theme switching
- Routes between pages and sections

**Scripts/core/database.js**
- IndexedDB initialization and management
- Stores: Best, Better, Good scores
- Tracks: Total games, wins, guesses
- Calculates statistics and rankings
- Safe null-checks for UI availability

**Scripts/core/sounds.js**
- Web Audio API for sound generation
- Sound types: correct, incorrect, win, lose
- No external audio files needed

### Game Scripts (Guess The Number)

**Scripts/games/guess-the-number/game.js**
- Game logic (digit validation, guessing mechanism)
- Event listeners for digit boxes
- Win/lose detection
- Ranking system (7 tiers)
- Error messages and alerts

**Scripts/games/guess-the-number/ui.js**
- UI updates for game board
- Statistics display
- Popup dialogs
- Input clearing and focus management
- Exports as `GuessTheNumberUI` with `UI` alias

### Game Styles

**Styles/games/guess-the-number.css**
- Digit box styling
- Feedback animations
- Responsive design (mobile, tablet, desktop)
- Game-specific layout styles

## How to Add a New Game

1. **Create game folder:**
   ```
   Scripts/games/[game-name]/
   ├── game.js
   └── ui.js
   ```

2. **Create game class (game.js):**
   ```javascript
   const MyNewGame = {
       init() { /* initialize */ },
       // ... game logic
   };
   ```

3. **Create UI class (ui.js):**
   ```javascript
   const MyNewGameUI = {
       init() { /* initialize */ },
       // ... UI methods
   };
   const UI = MyNewGameUI; // Alias for compatibility
   ```

4. **Create game CSS:**
   ```
   Styles/games/[game-name].css
   ```

5. **Update index.html game cards:**
   ```html
   <div class="game-card">
       <button class="game-play-btn" data-game="[game-name]">
           Play Now
       </button>
   </div>
   ```

6. **Update app.js (if needed):**
   - Add game to `loadGame()` switch statement
   - Map game ID to class names

## Key Implementation Details

### Dynamic Script Loading
```javascript
async loadGame(gameId) {
    // Load game logic
    await this.loadScript(`Scripts/games/${gameId}/game.js`);
    // Load game UI
    await this.loadScript(`Scripts/games/${gameId}/ui.js`);
    // Load game CSS
    await this.loadCSS(`Styles/games/${gameId}.css`);
}
```

### Game Initialization
```javascript
async playGame(gameId) {
    const loaded = await this.loadGame(gameId);
    const GameClass = gameId === 'guess-the-number' ? GuessTheNumberGame : null;
    const UIClass = gameId === 'guess-the-number' ? GuessTheNumberUI : null;
    
    // Create global aliases
    window.Game = GameClass;
    window.UI = UIClass;
    
    GameClass.init();
    UIClass.init();
}
```

## Changes from Previous Version

### Renamed Classes
- `Game` → `GuessTheNumberGame` (namespaced to avoid conflicts)
- `UI` → `GuessTheNumberUI` (namespaced to avoid conflicts)
- Global `Game` and `UI` aliases created at runtime for compatibility

### New Features
- `APP.loadGame()` - Dynamic script loading
- `APP.loadScript()` - Helper for loading JS files
- `APP.loadCSS()` - Helper for loading CSS files
- `APP.loadedGames` - Tracks loaded games to prevent re-loading

### Removed Code Duplication
- Removed old `Scripts/game.js` (moved to games/)
- Removed old `Scripts/ui.js` (moved to games/)
- Kept core in `Scripts/core/`

## Testing Checklist

✓ No JavaScript errors in console
✓ Core scripts load on page load
✓ Game scripts load when "Play" clicked
✓ Game CSS loads properly
✓ All game functionality works
✓ Statistics tracking works
✓ Database operations work
✓ Theme switching works
✓ Navigation works
✓ Mobile responsive

## Browser Compatibility

- Modern browsers with ES6+ support
- IndexedDB support required
- Web Audio API for sounds (graceful fallback if unavailable)
- CSS Grid and Flexbox required

## Version History

- v8.0 - Single-file architecture
- v8.1 - Modular architecture with game folder structure
