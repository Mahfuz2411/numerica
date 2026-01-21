// ==================== APP.JS - Main Application Entry Point ====================

const GAME_NAME = 'Numerica';
const VERSION = '8.1';

const APP = {
    currentPage: 'games',
    currentGame: null,
    loadedGames: new Set(),

    // Initialize the application
    init() {
        console.log(`🎮 Initializing ${GAME_NAME} v${VERSION}...`);
        
        // Load theme preference
        this.loadTheme();
        
        // Setup event listeners
        this.setupTopNavigation();
        this.setupGameCardButtons();
        this.setupThemeToggle();
        this.setupSidebarNavigation();
        this.setupSettingsButtons();
        
        // Initialize database
        Database.init();
        
        console.log('✓ App initialized');
    },

    // Load game scripts dynamically
    async loadGame(gameId) {
        if (this.loadedGames.has(gameId)) {
            console.log(`✓ Game "${gameId}" already loaded`);
            return true;
        }

        try {
            console.log(`📦 Loading game: "${gameId}"...`);
            
            // Determine game paths
            const gamePath = `Scripts/games/${gameId}`;
            
            // Load game logic script
            await this.loadScript(`${gamePath}/game.js`);
            
            // Load game UI script
            await this.loadScript(`${gamePath}/ui.js`);
            
            // Load game CSS
            await this.loadCSS(`Styles/games/${gameId}.css`);
            
            this.loadedGames.add(gameId);
            console.log(`✓ Game "${gameId}" loaded successfully`);
            return true;
        } catch (error) {
            console.error(`✗ Failed to load game "${gameId}":`, error);
            UI.showAlert(`Failed to load ${gameId}!`, 'error', 3000);
            return false;
        }
    },

    // Helper: Load script dynamically
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load: ${src}`));
            document.head.appendChild(script);
        });
    },

    // Helper: Load CSS dynamically
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Failed to load: ${href}`));
            document.head.appendChild(link);
        });
    },

    // Setup top navigation (Games, About)
    setupTopNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
            });
        });
    },

    // Navigate to a top-level page
    navigateToPage(page) {
        const validPages = ['games', 'about'];
        if (!validPages.includes(page)) return;

        // Hide game layout
        const gameLayout = document.querySelector('.game-layout-container');
        const gamesPage = document.getElementById('games-page');
        const aboutPage = document.getElementById('about-page');
        
        gameLayout.classList.remove('active');
        
        if (page === 'games') {
            gamesPage.classList.add('active');
            aboutPage.classList.remove('active');
        } else if (page === 'about') {
            gamesPage.classList.remove('active');
            aboutPage.classList.add('active');
        }

        // Update nav active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        this.currentPage = page;
    },

    // Setup game card buttons
    setupGameCardButtons() {
        document.querySelectorAll('.game-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const game = btn.dataset.game;
                this.playGame(game);
            });
        });
    },

    // Play a specific game
    async playGame(gameId) {
        console.log(`🎮 Starting game: "${gameId}"`);
        
        // Load game files if not already loaded
        const loaded = await this.loadGame(gameId);
        if (!loaded) return;

        this.currentGame = gameId;
        
        // Get game-specific objects
        const GameClass = gameId === 'guess-the-number' ? GuessTheNumberGame : null;
        const UIClass = gameId === 'guess-the-number' ? GuessTheNumberUI : null;

        if (!GameClass || !UIClass) {
            console.error(`Game "${gameId}" not found`);
            return;
        }

        // Create aliases for global Game and UI
        window.Game = GameClass;
        window.UI = UIClass;

        // Hide games list
        document.getElementById('games-page').classList.remove('active');
        
        // Show game layout
        document.querySelector('.game-layout-container').classList.add('active');
        
        // Initialize game
        GameClass.init();
        UIClass.init();
        
        // Show play section by default
        this.showGameSection('play');
        
        // Update nav to show back button
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        console.log(`✓ Game "${gameId}" started`);
    },

    // Setup sidebar navigation (only visible in game)
    setupSidebarNavigation() {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showGameSection(section);
            });
        });
    },

    // Setup settings buttons
    setupSettingsButtons() {
        const resetDbBtn = document.getElementById('resetDbBtn');
        if (resetDbBtn) {
            resetDbBtn.addEventListener('click', () => {
                this.showResetConfirmation();
            });
        }
    },

    // Show reset confirmation popup
    showResetConfirmation() {
        UI.showPopup({
            title: '⚠️ Confirm Reset',
            html: `
                <p style="margin-bottom: 12px; font-size: 0.95rem;">Are you sure you want to reset all data?</p>
                <p style="color: #ff3b30; font-weight: 600; font-size: 0.85rem; margin-top: 8px;">⚠️ This action cannot be undone. All scores and statistics will be deleted.</p>
            `,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            isDanger: true,
            onConfirm: async () => {
                try {
                    console.log('🔄 Resetting database...');
                    await Database.resetDatabase();
                    console.log('✓ Reset completed');
                    UI.showAlert('✓ All data has been reset!', 'success', 2000);
                } catch (error) {
                    console.error('Reset failed:', error);
                    UI.showAlert('❌ Failed to reset data!', 'error', 2000);
                }
            },
            onCancel: () => {
                console.log('Reset cancelled');
                UI.showAlert('Reset cancelled', 'info', 1500);
            }
        });
    },

    // Show a specific game section (play, rules, scores, settings)
    showGameSection(section) {
        const validSections = ['play', 'rules', 'scores', 'settings'];
        if (!validSections.includes(section)) return;

        // Hide all sections
        document.querySelectorAll('.section-content').forEach(s => {
            s.classList.remove('active');
        });

        // Show selected section
        const sectionId = `${section}-section`;
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            sectionElement.classList.add('active');
        }

        // Update active sidebar link
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });

        // Trigger section-specific actions
        if (section === 'scores') {
            UI.updateScoresDisplay();
        } else if (section === 'play') {
            // Focus first input
            setTimeout(() => {
                const firstBox = document.querySelector('.digit-box');
                if (firstBox) firstBox.focus();
            }, 100);
        }
    },

    // Back to games button handler
    backToGames() {
        if (Game && Game.reset) {
            Game.reset();
        }
        
        document.querySelector('.game-layout-container').classList.remove('active');
        document.getElementById('games-page').classList.add('active');
        
        // Reset nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === 'games');
        });
        
        this.currentPage = 'games';
        this.currentGame = null;

        console.log('✓ Back to games list');
    },

    // Setup theme toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    },

    // Toggle dark/light theme
    toggleTheme() {
        const body = document.body;
        body.classList.toggle('dark-theme');
        
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update toggle button text
        document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙';
        
        if (UI && UI.showAlert) {
            UI.showAlert('Theme changed!', 'info', 1500);
        }
    },

    // Load theme preference from storage
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);

        if (isDark) {
            document.body.classList.add('dark-theme');
            document.getElementById('themeToggle').textContent = '☀️';
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    APP.init();
});
