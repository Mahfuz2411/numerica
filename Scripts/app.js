// ==================== APP.JS - Main Application Entry Point ====================

const GAME_NAME = 'Numerica';
const VERSION = '8.0';

const APP = {
    currentPage: 'games',
    currentGame: null,

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
    playGame(gameId) {
        if (gameId !== 'guess-the-number') return;

        this.currentGame = gameId;
        
        // Hide games list
        document.getElementById('games-page').classList.remove('active');
        
        // Show game layout
        document.querySelector('.game-layout-container').classList.add('active');
        
        // Initialize game
        Game.init();
        UI.init();
        
        // Show play section by default
        this.showGameSection('play');
        
        // Update nav to show back button
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
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
        Game.reset();
        document.querySelector('.game-layout-container').classList.remove('active');
        document.getElementById('games-page').classList.add('active');
        
        // Reset nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === 'games');
        });
        
        this.currentPage = 'games';
        this.currentGame = null;
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
        
        UI.showAlert('Theme changed!', 'info', 1500);
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