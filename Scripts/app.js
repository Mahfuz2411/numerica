// ==================== APP.JS - Main Application Entry Point ====================

const GAME_NAME = 'Numerica';
const VERSION = '7.0';

const APP = {
    currentPage: 'game',
    gameState: null,

    // Initialize the application
    init() {
        console.log(`🎮 Initializing ${GAME_NAME}...`);
        
        // Load theme preference
        this.loadTheme();
        
        // Setup event listeners
        this.setupNavigation();
        this.setupThemeToggle();
        
        // Initialize game
        Game.init();
        UI.init();
        Database.init();
    },

    // Setup navigation between pages
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });
    },

    // Navigate to a specific page
    navigateTo(page) {
        const validPages = ['game', 'rules', 'scores', 'about'];
        if (!validPages.includes(page)) return;

        // Update active link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Show selected page
        const pageId = page === 'game' ? 'game-page' : `${page}-page`;
        document.getElementById(pageId).classList.add('active');

        // Trigger page-specific actions
        if (page === 'scores') {
            UI.updateScoresDisplay();
        }

        this.currentPage = page;
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