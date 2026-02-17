/**
 * Dev Browser - Ultimate Developer Mode
 * Real Browser Functionality
 */

// ========================================
// DOM Elements
// ========================================
const elements = {
    // Navigation
    backBtn: document.getElementById('backBtn'),
    forwardBtn: document.getElementById('forwardBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    homeBtn: document.getElementById('homeBtn'),
    urlInput: document.getElementById('urlInput'),
    urlIcon: document.getElementById('urlIcon'),
    bookmarkBtn: document.getElementById('bookmarkBtn'),
    menuBtn: document.getElementById('menuBtn'),
    
    // Dev Tools
    consoleBtn: document.getElementById('consoleBtn'),
    inspectorBtn: document.getElementById('inspectorBtn'),
    debugBtn: document.getElementById('debugBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    
    // Console
    consolePanel: document.getElementById('consolePanel'),
    consoleOutput: document.getElementById('consoleOutput'),
    clearConsole: document.getElementById('clearConsole'),
    closeConsole: document.getElementById('closeConsole'),
    consoleInput: document.getElementById('consoleInput'),
    
    // Viewport
    viewportContent: document.getElementById('viewportContent'),
    loadingBar: document.getElementById('loadingBar'),
    
    // Status
    statusReady: document.getElementById('statusReady'),
    networkStatus: document.getElementById('networkStatus'),
    zoomLevel: document.getElementById('zoomLevel'),
    
    // Quick Search
    quickSearch: document.getElementById('quickSearch'),
    
    // Browser Frame (for real browsing)
    browserFrame: document.getElementById('browserFrame'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer'),
    
    // Tabs
    tabBar: document.getElementById('tabBar'),
    newTabBtn: document.getElementById('newTabBtn'),
    
    // Modals
    settingsModal: document.getElementById('settingsModal'),
    addBookmarkModal: document.getElementById('addBookmarkModal'),
    newTabModal: document.getElementById('newTabModal'),
    speedDialModal: document.getElementById('speedDialModal'),
    
    // Context Menu
    contextMenu: document.getElementById('contextMenu')
};

// ========================================
// State
// ========================================
const state = {
    history: [],
    historyIndex: -1,
    isConsoleOpen: false,
    zoom: 100,
    isBookmarked: false,
    currentApp: null,
    currentPage: 'dev://browser/start',
    tabs: [{ id: 1, title: 'Developer Mode', url: 'dev://browser/start', active: true, history: [], historyIndex: -1 }],
    tabCounter: 1,
    bookmarks: [],
    downloads: [],
    browsingHistory: [],
    speedDials: [],
    settings: {
        theme: 'indigo',
        fontSize: 14,
        animations: true,
        doNotTrack: false,
        saveHistory: true,
        savePasswords: false,
        blockAds: false,
        enableJS: true
    },
    isLoading: false,
    loadingProgress: 0,
    connectionStatus: 'online'
};

// ========================================
// Apps Configuration
// ========================================
const apps = {
    editor: '../Browser/code-editor/editor.html',
    chat: '../Browser/communication/monster-browser-chat.html',
    translation: '../Browser/communication/translation.html'
};

// ========================================
// Allowed URLs (for security demo)
// ========================================
const allowedURLs = [
    'https://github.com',
    'https://stackoverflow.com',
    'https://devdocs.io',
    'https://codepen.io',
    'https://npmjs.com',
    'https://mdn.dev',
    'https://www.google.com',
    'https://www.wikipedia.org',
    'https://www.youtube.com',
    'https://twitter.com',
    'https://www.reddit.com'
];

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadBookmarks();
    loadHistory();
    loadSpeedDials();
    loadDownloads();
    
    // Initialize first tab
    state.tabs[0].history = ['dev://browser/start'];
    state.tabs[0].historyIndex = 0;
    state.history = state.tabs[0].history;
    state.historyIndex = state.tabs[0].historyIndex;
    
    initializeEventListeners();
    initializeSettingsListeners();
    initializeFrameListener();
    
    logToConsole('INFO', 'Developer Browser initialized successfully');
    updateStatus('Ready', 'online');
    updateNavigationButtons();
    applyTheme(state.settings.theme);
    showToast('Welcome to Dev Browser!', 'info');
    
    // Check connection
    checkConnection();
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
    
    // Add entrance animation class to body
    document.body.classList.add('page-loaded');
});

// ========================================
// Real Browser Frame
// ========================================
function initializeFrameListener() {
    if (elements.browserFrame) {
        elements.browserFrame.addEventListener('load', () => {
            handlePageLoad();
        });
        
        elements.browserFrame.addEventListener('error', () => {
            handlePageError();
        });
    }
}

function handlePageLoad() {
    state.isLoading = false;
    state.loadingProgress = 100;
    hideLoading();
    
    try {
        const frame = elements.browserFrame;
        if (frame && frame.contentDocument) {
            const title = frame.contentDocument.title || 'Untitled';
            updateTabTitle(title);
            updateStatus(title.substring(0, 50), 'online');
        }
    } catch (e) {
        // Cross-origin restriction
        logToConsole('INFO', 'Page loaded (cross-origin)');
    }
    
    showToast('Page loaded', 'success');
}

function handlePageError() {
    state.isLoading = false;
    hideLoading();
    updateStatus('Error loading page', 'error');
    showToast('Failed to load page', 'error');
    
    showErrorMessage();
}

function showErrorMessage() {
    elements.viewportContent.innerHTML = `
        <div class="welcome-screen">
            <div class="error-container">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h1 class="error-title">Oops! Something went wrong</h1>
                <p class="error-message">This page might be unavailable or has security restrictions</p>
                <div class="error-actions">
                    <button class="btn-primary" onclick="refresh()">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                    <button class="btn-secondary" onclick="goHome()">
                        <i class="fas fa-home"></i> Go Home
                    </button>
                </div>
                <div class="error-tips">
                    <h3>Possible reasons:</h3>
                    <ul>
                        <li>The page has CORS restrictions</li>
                        <li>The URL is not accessible via iframe</li>
                        <li>Network connection issue</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// Event Listeners
// ========================================
function initializeEventListeners() {
    // Navigation buttons
    elements.backBtn?.addEventListener('click', () => { logToConsole('INFO', 'Back clicked'); goBack(); });
    elements.forwardBtn?.addEventListener('click', () => { logToConsole('INFO', 'Forward clicked'); goForward(); });
    elements.refreshBtn?.addEventListener('click', () => { logToConsole('INFO', 'Refresh clicked'); refresh(); });
    elements.homeBtn?.addEventListener('click', () => { logToConsole('INFO', 'Home clicked'); goHome(); });
    
    // URL bar
    elements.urlInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') navigateTo(elements.urlInput.value);
    });
    
    elements.urlInput?.addEventListener('focus', () => elements.urlInput?.select());
    
    // Buttons
    elements.bookmarkBtn?.addEventListener('click', toggleBookmark);
    elements.menuBtn?.addEventListener('click', showMenu);
    
    // Dev tools
    elements.consoleBtn?.addEventListener('click', toggleConsole);
    elements.inspectorBtn?.addEventListener('click', openInspector);
    elements.debugBtn?.addEventListener('click', openDebugger);
    elements.settingsBtn?.addEventListener('click', openSettings);
    
    // Console
    elements.clearConsole?.addEventListener('click', clearConsoleOutput);
    elements.closeConsole?.addEventListener('click', closeConsolePanel);
    elements.consoleInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeConsoleCommand(elements.consoleInput.value);
    });
    
    // Quick Search
    elements.quickSearch?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(elements.quickSearch.value);
    });
    
    // Tabs
    elements.newTabBtn?.addEventListener('click', () => openNewTabModal());
    
    // Close modals
    document.getElementById('closeSettings')?.addEventListener('click', () => closeSettings());
    document.getElementById('closeAddBookmark')?.addEventListener('click', () => closeModal('addBookmarkModal'));
    document.getElementById('closeNewTab')?.addEventListener('click', () => closeModal('newTabModal'));
    document.getElementById('closeSpeedDial')?.addEventListener('click', () => closeModal('speedDialModal'));
    
    // Settings tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', () => switchSettingsTab(tab.dataset.tab));
    });
    
    // Add Bookmark
    document.getElementById('addBookmarkBtn')?.addEventListener('click', () => openModal('addBookmarkModal'));
    document.getElementById('cancelAddBookmark')?.addEventListener('click', () => closeModal('addBookmarkModal'));
    document.getElementById('saveBookmark')?.addEventListener('click', saveBookmark);
    
    // New Tab
    document.getElementById('cancelNewTab')?.addEventListener('click', () => closeModal('newTabModal'));
    document.getElementById('createNewTab')?.addEventListener('click', createNewTab);
    
    // Speed Dial
    document.getElementById('cancelSpeedDial')?.addEventListener('click', () => closeModal('speedDialModal'));
    document.getElementById('saveSpeedDial')?.addEventListener('click', saveSpeedDial);
    
    // History
    document.getElementById('clearHistoryBtn')?.addEventListener('click', clearAllHistory);
    document.getElementById('historySearch')?.addEventListener('input', (e) => filterHistory(e.target.value));
    
    // Downloads
    document.getElementById('clearDownloadsBtn')?.addEventListener('click', clearAllDownloads);
    
    // Privacy
    document.getElementById('clearBrowsingData')?.addEventListener('click', clearBrowsingData);
    
    // Theme cards
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const theme = card.dataset.theme;
            applyTheme(theme);
            state.settings.theme = theme;
            saveSettings();
            showToast(`Theme changed to ${theme}`, 'success');
        });
    });
    
    // Font size
    const fontSizeRange = document.getElementById('fontSizeRange');
    const fontSizeValue = document.getElementById('fontSizeValue');
    if (fontSizeRange && fontSizeValue) {
        fontSizeRange.addEventListener('input', (e) => {
            const size = e.target.value;
            fontSizeValue.textContent = `${size}px`;
            document.documentElement.style.fontSize = `${size}px`;
        });
    }
    
    // Animations toggle
    const animationsToggle = document.getElementById('animationsToggle');
    if (animationsToggle) {
        animationsToggle.addEventListener('change', (e) => {
            state.settings.animations = e.target.checked;
            saveSettings();
            if (!e.target.checked) {
                document.documentElement.style.setProperty('--transition-fast', '0.01ms');
                document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            } else {
                document.documentElement.style.setProperty('--transition-fast', '0.15s');
                document.documentElement.style.setProperty('--transition-normal', '0.3s');
            }
        });
    }
    
    // Context menu
    document.addEventListener('click', () => {
        elements.contextMenu?.classList.remove('active');
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
}

function initializeSettingsListeners() {
    const doNotTrack = document.getElementById('doNotTrack');
    const saveHistory = document.getElementById('saveHistory');
    const savePasswords = document.getElementById('savePasswords');
    const blockAds = document.getElementById('blockAds');
    const enableJS = document.getElementById('enableJS');
    
    if (doNotTrack) doNotTrack.addEventListener('change', (e) => { state.settings.doNotTrack = e.target.checked; saveSettings(); });
    if (saveHistory) saveHistory.addEventListener('change', (e) => { state.settings.saveHistory = e.target.checked; saveSettings(); });
    if (savePasswords) savePasswords.addEventListener('change', (e) => { state.settings.savePasswords = e.target.checked; saveSettings(); });
    if (blockAds) blockAds.addEventListener('change', (e) => { state.settings.blockAds = e.target.checked; saveSettings(); });
    if (enableJS) enableJS.addEventListener('change', (e) => { state.settings.enableJS = e.target.checked; saveSettings(); });
}

// ========================================
// Real Loading System
// ========================================
function startLoading(url) {
    state.isLoading = true;
    state.loadingProgress = 0;
    
    showLoading();
    
    // Simulate realistic loading progress
    const loadingInterval = setInterval(() => {
        if (!state.isLoading) {
            clearInterval(loadingInterval);
            return;
        }
        
        // Non-linear progress simulation
        if (state.loadingProgress < 30) {
            state.loadingProgress += Math.random() * 10;
        } else if (state.loadingProgress < 70) {
            state.loadingProgress += Math.random() * 5;
        } else if (state.loadingProgress < 90) {
            state.loadingProgress += Math.random() * 2;
        } else {
            // Wait at 90-95% until page actually loads
            state.loadingProgress = 90 + Math.random() * 5;
        }
        
        updateLoadingBar();
    }, 200);
    
    // Timeout for safety
    setTimeout(() => {
        if (state.isLoading) {
            clearInterval(loadingInterval);
            state.isLoading = false;
            hideLoading();
        }
    }, 30000); // 30 second timeout
}

function updateLoadingBar() {
    if (elements.loadingBar) {
        elements.loadingBar.style.transform = `scaleX(${state.loadingProgress / 100})`;
    }
}

function completeLoading() {
    state.isLoading = false;
    state.loadingProgress = 100;
    updateLoadingBar();
    setTimeout(() => hideLoading(), 300);
}

function showLoading() {
    if (elements.loadingBar) {
        elements.loadingBar.classList.add('active');
        elements.loadingBar.style.transform = 'scaleX(0)';
    }
    updateStatus('Loading...', 'online');
}

function hideLoading() {
    if (elements.loadingBar) {
        elements.loadingBar.classList.remove('active');
        elements.loadingBar.style.transform = 'scaleX(1)';
        setTimeout(() => {
            if (elements.loadingBar) {
                elements.loadingBar.style.transform = 'scaleX(0)';
            }
        }, 300);
    }
}

// ========================================
// Search Handler
// ========================================
function handleSearch(query) {
    const trimmedQuery = query.trim().toLowerCase();
    
    if (['editor', 'code editor', 'محرر'].includes(trimmedQuery)) { openApp('editor'); return; }
    if (['chat', 'monster chat'].includes(trimmedQuery)) { openApp('chat'); return; }
    if (['translation', 'translator'].includes(trimmedQuery)) { openApp('translation'); return; }
    
    // Check if it's a URL
    if (trimmedQuery.startsWith('http://') || trimmedQuery.startsWith('https://') || 
        (trimmedQuery.includes('.') && !trimmedQuery.includes(' '))) {
        navigateTo(trimmedQuery.startsWith('http') ? trimmedQuery : 'https://' + trimmedQuery);
        return;
    }
    
    // Search with Google
    navigateTo(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
}

// ========================================
// App Management
// ========================================
function openApp(appName) {
    const appPath = apps[appName];
    if (!appPath) { showToast(`App "${appName}" not found`, 'error'); return; }
    
    state.currentApp = appName;
    startLoading(appPath);
    
    // Create or show iframe for app
    let appFrame = document.getElementById('appFrame');
    if (!appFrame) {
        appFrame = document.createElement('iframe');
        appFrame.id = 'appFrame';
        appFrame.className = 'app-frame';
        elements.viewportContent.parentNode.appendChild(appFrame);
    }
    
    elements.viewportContent.style.display = 'none';
    appFrame.style.display = 'block';
    appFrame.src = appPath;
    
    appFrame.onload = () => {
        completeLoading();
        updateTabTitle(`${appName} - App`);
    };
    
    elements.urlInput.value = `dev://app/${appName}`;
    updateUrlIcon(elements.urlInput.value);
    updateStatus(`Running: ${appName}`, 'online');
    
    logToConsole('INFO', `Opened app: ${appName}`);
    showToast(`Opened ${appName}`, 'success');
    
    addToHistory(appName, `dev://app/${appName}`);
}

function closeApp() {
    if (state.currentApp) {
        const appFrame = document.getElementById('appFrame');
        if (appFrame) {
            appFrame.style.display = 'none';
            appFrame.src = '';
        }
        elements.viewportContent.style.display = 'block';
        state.currentApp = null;
        logToConsole('INFO', 'Closed app');
    }
}

// ========================================
// Navigation Functions
// ========================================
function navigateTo(url) {
    closeApp();
    
    // Add protocol if missing
    if (!url.startsWith('http') && !url.startsWith('dev://')) {
        if (url.includes('.') && !url.includes(' ')) {
            url = 'https://' + url;
        } else {
            // It's a search query
            url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        }
    }
    
    // Get current tab
    const currentTab = state.tabs.find(t => t.active);
    if (!currentTab) return;
    
    // Add to tab history
    if (currentTab.history.length === 0 || currentTab.history[currentTab.historyIndex] !== url) {
        currentTab.history = currentTab.history.slice(0, currentTab.historyIndex + 1);
        currentTab.history.push(url);
        currentTab.historyIndex++;
    }
    
    // Update global state
    state.history = currentTab.history;
    state.historyIndex = currentTab.historyIndex;
    state.currentPage = url;
    
    // Update UI
    elements.urlInput.value = url;
    updateUrlIcon(url);
    startLoading(url);
    updateNavigationButtons();
    
    // Load page
    setTimeout(() => {
        loadPage(url);
    }, 100);
    
    logToConsole('INFO', `Navigating to: ${url}`);
    addToHistory(extractDomain(url), url);
}

function loadPage(url) {
    if (url.startsWith('dev://')) {
        // Internal pages
        switch(url) {
            case 'dev://browser/start':
                showWelcomeScreen();
                completeLoading();
                break;
            case 'dev://app/editor':
                openApp('editor');
                return;
            default:
                showWelcomeScreen();
                completeLoading();
        }
    } else {
        // External URLs - try to load in iframe
        loadExternalURL(url);
    }
    
    updateStatus('Ready', 'online');
    updateNavigationButtons();
}

function loadExternalURL(url) {
    // Check if URL is allowed
    const isAllowed = allowedURLs.some(allowed => url.includes(allowed.replace('https://', '')));
    
    // Create browser frame if not exists
    let browserFrame = document.getElementById('browserFrame');
    if (!browserFrame) {
        browserFrame = document.createElement('iframe');
        browserFrame.id = 'browserFrame';
        browserFrame.className = 'app-frame';
        browserFrame.style.display = 'none';
        elements.viewportContent.parentNode.appendChild(browserFrame);
    }
    
    // Hide welcome screen
    elements.viewportContent.style.display = 'none';
    browserFrame.style.display = 'block';
    
    // Try to load URL
    browserFrame.src = url;
    
    // Handle load completion
    browserFrame.onload = () => {
        completeLoading();
        updateTabTitle(extractDomain(url));
    };
    
    // Handle errors
    browserFrame.onerror = () => {
        handlePageError();
    };
    
    // Timeout for security
    setTimeout(() => {
        if (state.isLoading) {
            // Many sites block iframe embedding, show error
            showErrorMessage();
        }
    }, 5000);
}

function extractDomain(url) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        return domain;
    } catch {
        return url;
    }
}

function goBack() {
    const currentTab = state.tabs.find(t => t.active);
    if (!currentTab) return;
    
    if (currentTab.historyIndex > 0) {
        currentTab.historyIndex--;
        const url = currentTab.history[currentTab.historyIndex];
        state.history = currentTab.history;
        state.historyIndex = currentTab.historyIndex;
        state.currentPage = url;
        elements.urlInput.value = url;
        updateUrlIcon(url);
        loadPage(url);
        updateNavigationButtons();
        logToConsole('INFO', `Navigated back to: ${url}`);
        showToast('Navigated back', 'info');
    } else {
        showToast('Cannot go back further', 'warning');
    }
}

function goForward() {
    const currentTab = state.tabs.find(t => t.active);
    if (!currentTab) return;
    
    if (currentTab.historyIndex < currentTab.history.length - 1) {
        currentTab.historyIndex++;
        const url = currentTab.history[currentTab.historyIndex];
        state.history = currentTab.history;
        state.historyIndex = currentTab.historyIndex;
        state.currentPage = url;
        elements.urlInput.value = url;
        updateUrlIcon(url);
        loadPage(url);
        updateNavigationButtons();
        logToConsole('INFO', `Navigated forward to: ${url}`);
        showToast('Navigated forward', 'info');
    } else {
        showToast('Cannot go forward', 'warning');
    }
}

function refresh() {
    const currentTab = state.tabs.find(t => t.active);
    if (!currentTab) return;
    
    startLoading('refresh');
    
    const refreshIcon = elements.refreshBtn?.querySelector('i');
    if (refreshIcon) refreshIcon.style.animation = 'spin 1s linear infinite';
    
    setTimeout(() => {
        // Refresh app frame
        const appFrame = document.getElementById('appFrame');
        if (appFrame && appFrame.style.display !== 'none') {
            appFrame.src = appFrame.src;
        }
        
        // Refresh browser frame
        const browserFrame = document.getElementById('browserFrame');
        if (browserFrame && browserFrame.style.display !== 'none') {
            browserFrame.src = browserFrame.src;
        }
        
        // Refresh welcome screen
        if (state.currentPage === 'dev://browser/start') {
            showWelcomeScreen();
        }
        
        completeLoading();
        
        if (refreshIcon) refreshIcon.style.animation = '';
        showToast('Page refreshed', 'success');
        logToConsole('INFO', 'Page refreshed');
    }, 800);
}

function goHome() {
    closeApp();
    navigateTo('dev://browser/start');
    logToConsole('INFO', 'Navigated home');
}

function updateNavigationButtons() {
    const currentTab = state.tabs.find(t => t.active);
    if (!currentTab) return;
    
    if (elements.backBtn) {
        elements.backBtn.disabled = currentTab.historyIndex <= 0;
        elements.backBtn.style.opacity = currentTab.historyIndex <= 0 ? '0.4' : '1';
        elements.backBtn.style.cursor = currentTab.historyIndex <= 0 ? 'not-allowed' : 'pointer';
    }
    
    if (elements.forwardBtn) {
        elements.forwardBtn.disabled = currentTab.historyIndex >= currentTab.history.length - 1;
        elements.forwardBtn.style.opacity = currentTab.historyIndex >= currentTab.history.length - 1 ? '0.4' : '1';
        elements.forwardBtn.style.cursor = currentTab.historyIndex >= currentTab.history.length - 1 ? 'not-allowed' : 'pointer';
    }
}

function updateTabTitle(title) {
    const currentTab = state.tabs.find(t => t.active);
    if (currentTab) {
        currentTab.title = title;
        renderTabs();
    }
}

// ========================================
// Connection Check
// ========================================
function checkConnection() {
    if (navigator.onLine) {
        state.connectionStatus = 'online';
        updateStatus('Ready', 'online');
    } else {
        state.connectionStatus = 'offline';
        updateStatus('Offline', 'offline');
        showToast('You are offline', 'warning');
    }
}

window.addEventListener('online', () => {
    state.connectionStatus = 'online';
    updateStatus('Ready', 'online');
    showToast('Back online', 'success');
    logToConsole('INFO', 'Connection restored');
});

window.addEventListener('offline', () => {
    state.connectionStatus = 'offline';
    updateStatus('Offline', 'offline');
    showToast('You are offline', 'warning');
    logToConsole('WARNING', 'Connection lost');
});

// ========================================
// Welcome Screen
// ========================================
function showWelcomeScreen() {
    closeApp();
    
    const speedDialsHtml = state.speedDials.map(dial => `
        <div class="access-card" data-url="${dial.url}" data-id="${dial.id}">
            <div class="card-actions">
                <button class="card-action-btn" onclick="event.stopPropagation(); removeSpeedDial(${dial.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="card-icon" style="background: rgba(99, 102, 241, 0.2); color: var(--theme-primary);">
                <i class="fas ${dial.icon}"></i>
            </div>
            <span class="card-title">${dial.name}</span>
            <span class="card-desc">${dial.url}</span>
        </div>
    `).join('');
    
    elements.viewportContent.innerHTML = `
        <div class="welcome-screen">
            <div class="bg-animation">
                <div class="floating-shape shape-1"></div>
                <div class="floating-shape shape-2"></div>
                <div class="floating-shape shape-3"></div>
            </div>
            <div class="welcome-content">
                <div class="logo-container">
                    <div class="logo-glow"></div>
                    <i class="fas fa-code"></i>
                </div>
                <h1 class="main-title"><span class="gradient-text">Developer Browser</span></h1>
                <p class="subtitle">Your gateway to the web, built for developers</p>
                
                <div class="search-container">
                    <div class="search-box">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" class="search-input" id="quickSearch" placeholder="Search or type 'editor'...">
                    </div>
                    <div class="search-suggestions">
                        <span class="suggestion-item" data-query="editor"><i class="fas fa-file-code"></i> editor</span>
                        <span class="suggestion-item" data-query="github"><i class="fab fa-github"></i> github</span>
                        <span class="suggestion-item" data-query="stackoverflow"><i class="fab fa-stack-overflow"></i> stackoverflow</span>
                    </div>
                </div>
                
                <div class="quick-access-section">
                    <h3 class="section-title"><i class="fas fa-bolt"></i><span>Speed Dial</span></h3>
                    <div class="quick-access-grid">
                        ${speedDialsHtml}
                        <div class="add-speed-dial" onclick="openModal('speedDialModal')">
                            <i class="fas fa-plus"></i>
                            <span>Add Site</span>
                        </div>
                    </div>
                </div>
                
                <div class="shortcuts-section">
                    <h3 class="section-title"><i class="fas fa-keyboard"></i><span>Keyboard Shortcuts</span></h3>
                    <div class="shortcuts-grid">
                        <div class="shortcut-item"><kbd>Ctrl+E</kbd><span>Open Editor</span></div>
                        <div class="shortcut-item"><kbd>Ctrl+K</kbd><span>Quick Search</span></div>
                        <div class="shortcut-item"><kbd>F12</kbd><span>Console</span></div>
                        <div class="shortcut-item"><kbd>Ctrl+L</kbd><span>Focus URL</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Re-attach listeners
    const newSearchInput = document.getElementById('quickSearch');
    if (newSearchInput) {
        newSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch(newSearchInput.value);
        });
    }
    
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => handleSearch(item.dataset.query));
    });
    
    document.querySelectorAll('.access-card[data-url]').forEach(card => {
        card.addEventListener('click', () => navigateTo(card.dataset.url));
    });
    
    updateNavigationButtons();
    completeLoading();
}

// ========================================
// Console Functions
// ========================================
function toggleConsole() {
    state.isConsoleOpen = !state.isConsoleOpen;
    if (state.isConsoleOpen) {
        elements.consolePanel.classList.add('active');
        elements.consoleBtn.classList.add('active');
        logToConsole('INFO', 'Console opened');
    } else {
        closeConsolePanel();
    }
}

function closeConsolePanel() {
    elements.consolePanel.classList.remove('active');
    elements.consoleBtn.classList.remove('active');
    state.isConsoleOpen = false;
}

function clearConsoleOutput() {
    elements.consoleOutput.innerHTML = '';
    logToConsole('INFO', 'Console cleared');
}

function executeConsoleCommand(command) {
    if (!command.trim()) return;
    logToConsole('USER', `> ${command}`);
    try {
        const result = eval(command);
        if (result !== undefined) logToConsole('RESULT', String(result));
    } catch (error) {
        logToConsole('ERROR', error.message);
    }
    elements.consoleInput.value = '';
}

function logToConsole(type, message) {
    const logEntry = document.createElement('div');
    logEntry.className = 'console-log';
    
    const colors = {
        'INFO': 'var(--info)',
        'USER': 'var(--success)',
        'RESULT': 'var(--text-primary)',
        'ERROR': 'var(--error)',
        'WARNING': 'var(--warning)'
    };
    
    logEntry.innerHTML = `
        <span class="log-prefix" style="color: ${colors[type] || colors.INFO}">[${type}]</span>
        <span>${message}</span>
    `;
    
    elements.consoleOutput.appendChild(logEntry);
    elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
}

// ========================================
// Dev Tools Functions
// ========================================
function openInspector() {
    logToConsole('INFO', 'Inspector activated');
    showToast('Inspector: Element selection mode', 'info');
}

function openDebugger() {
    logToConsole('INFO', 'Debugger activated');
    showToast('Debugger: Breakpoints ready', 'info');
}

function openSettings() {
    openModal('settingsModal');
    renderBookmarks();
    renderHistory();
    renderDownloads();
}

function closeSettings() {
    closeModal('settingsModal');
}

function switchSettingsTab(tabName) {
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`.settings-tab[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`${tabName}Panel`)?.classList.add('active');
}

// ========================================
// Bookmarks
// ========================================
function loadBookmarks() {
    const saved = localStorage.getItem('devBrowser_bookmarks');
    if (saved) state.bookmarks = JSON.parse(saved);
}

function saveBookmark() {
    const name = document.getElementById('bookmarkName')?.value;
    const url = document.getElementById('bookmarkUrl')?.value;
    const folder = document.getElementById('bookmarkFolder')?.value;
    
    if (!name || !url) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    state.bookmarks.push({ id: Date.now(), name, url, folder });
    localStorage.setItem('devBrowser_bookmarks', JSON.stringify(state.bookmarks));
    
    closeModal('addBookmarkModal');
    renderBookmarks();
    showToast('Bookmark saved', 'success');
    
    document.getElementById('bookmarkName').value = '';
    document.getElementById('bookmarkUrl').value = '';
}

function renderBookmarks() {
    const list = document.getElementById('bookmarksList');
    if (!list) return;
    
    if (state.bookmarks.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No bookmarks yet</p>';
        return;
    }
    
    list.innerHTML = state.bookmarks.map(b => `
        <div class="bookmark-item" data-url="${b.url}">
            <i class="fas fa-star"></i>
            <div class="bookmark-info">
                <div class="bookmark-title">${b.name}</div>
                <div class="bookmark-url">${b.url}</div>
            </div>
            <div class="bookmark-actions">
                <button class="action-icon-btn" onclick="navigateTo('${b.url}')"><i class="fas fa-external-link-alt"></i></button>
                <button class="action-icon-btn" onclick="removeBookmark(${b.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    
    list.querySelectorAll('.bookmark-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.bookmark-actions')) {
                navigateTo(item.dataset.url);
            }
        });
    });
}

function removeBookmark(id) {
    state.bookmarks = state.bookmarks.filter(b => b.id !== id);
    localStorage.setItem('devBrowser_bookmarks', JSON.stringify(state.bookmarks));
    renderBookmarks();
    showToast('Bookmark removed', 'info');
}

// ========================================
// History
// ========================================
function loadHistory() {
    const saved = localStorage.getItem('devBrowser_history');
    if (saved) state.browsingHistory = JSON.parse(saved);
}

function addToHistory(title, url) {
    if (!state.settings.saveHistory) return;
    
    state.browsingHistory.unshift({
        id: Date.now(),
        title,
        url,
        timestamp: new Date().toISOString()
    });
    
    state.browsingHistory = state.browsingHistory.slice(0, 100);
    localStorage.setItem('devBrowser_history', JSON.stringify(state.browsingHistory));
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    
    if (state.browsingHistory.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No history yet</p>';
        return;
    }
    
    list.innerHTML = state.browsingHistory.map(h => `
        <div class="history-item" data-url="${h.url}">
            <i class="fas fa-history"></i>
            <div class="history-info">
                <div class="history-title">${h.title}</div>
                <div class="history-url">${h.url}</div>
            </div>
            <div class="bookmark-actions">
                <button class="action-icon-btn" onclick="navigateTo('${h.url}')"><i class="fas fa-external-link-alt"></i></button>
                <button class="action-icon-btn" onclick="removeHistoryItem(${h.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function filterHistory(query) {
    const items = document.querySelectorAll('.history-item');
    items.forEach(item => {
        const title = item.querySelector('.history-title')?.textContent.toLowerCase() || '';
        const url = item.querySelector('.history-url')?.textContent.toLowerCase() || '';
        item.style.display = (title.includes(query.toLowerCase()) || url.includes(query.toLowerCase())) ? 'flex' : 'none';
    });
}

function clearAllHistory() {
    state.browsingHistory = [];
    localStorage.removeItem('devBrowser_history');
    renderHistory();
    showToast('History cleared', 'success');
}

function removeHistoryItem(id) {
    state.browsingHistory = state.browsingHistory.filter(h => h.id !== id);
    localStorage.setItem('devBrowser_history', JSON.stringify(state.browsingHistory));
    renderHistory();
}

// ========================================
// Downloads
// ========================================
function loadDownloads() {
    const saved = localStorage.getItem('devBrowser_downloads');
    if (saved) state.downloads = JSON.parse(saved);
}

function renderDownloads() {
    const list = document.getElementById('downloadsList');
    if (!list) return;
    
    if (state.downloads.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No downloads yet</p>';
        return;
    }
    
    list.innerHTML = state.downloads.map(d => `
        <div class="download-item">
            <i class="fas fa-download"></i>
            <div class="download-info">
                <div class="bookmark-title">${d.name}</div>
                <div class="bookmark-url">${d.url}</div>
            </div>
            <div class="bookmark-actions">
                <button class="action-icon-btn" onclick="removeDownload(${d.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function clearAllDownloads() {
    state.downloads = [];
    localStorage.removeItem('devBrowser_downloads');
    renderDownloads();
    showToast('Downloads cleared', 'success');
}

function removeDownload(id) {
    state.downloads = state.downloads.filter(d => d.id !== id);
    localStorage.setItem('devBrowser_downloads', JSON.stringify(state.downloads));
    renderDownloads();
}

// ========================================
// Speed Dial
// ========================================
function loadSpeedDials() {
    const saved = localStorage.getItem('devBrowser_speedDials');
    if (saved) state.speedDials = JSON.parse(saved);
}

function saveSpeedDial() {
    const name = document.getElementById('speedDialName')?.value;
    const url = document.getElementById('speedDialUrl')?.value;
    const icon = document.getElementById('speedDialIcon')?.value || 'fa-globe';
    
    if (!name || !url) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    state.speedDials.push({ id: Date.now(), name, url, icon });
    localStorage.setItem('devBrowser_speedDials', JSON.stringify(state.speedDials));
    
    closeModal('speedDialModal');
    showWelcomeScreen();
    showToast('Speed Dial added', 'success');
    
    document.getElementById('speedDialName').value = '';
    document.getElementById('speedDialUrl').value = '';
}

function removeSpeedDial(id) {
    state.speedDials = state.speedDials.filter(d => d.id !== id);
    localStorage.setItem('devBrowser_speedDials', JSON.stringify(state.speedDials));
    showWelcomeScreen();
    showToast('Speed Dial removed', 'info');
}

// ========================================
// Settings
// ========================================
function loadSettings() {
    const saved = localStorage.getItem('devBrowser_settings');
    if (saved) state.settings = { ...state.settings, ...JSON.parse(saved) };
}

function saveSettings() {
    localStorage.setItem('devBrowser_settings', JSON.stringify(state.settings));
}

function autoSave() {
    saveSettings();
    localStorage.setItem('devBrowser_bookmarks', JSON.stringify(state.bookmarks));
    localStorage.setItem('devBrowser_history', JSON.stringify(state.browsingHistory));
    localStorage.setItem('devBrowser_speedDials', JSON.stringify(state.speedDials));
    logToConsole('INFO', 'Auto-saved all data');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function clearBrowsingData() {
    state.browsingHistory = [];
    state.bookmarks = [];
    state.downloads = [];
    localStorage.removeItem('devBrowser_history');
    localStorage.removeItem('devBrowser_bookmarks');
    localStorage.removeItem('devBrowser_downloads');
    
    renderHistory();
    renderBookmarks();
    renderDownloads();
    showToast('All browsing data cleared', 'success');
}

// ========================================
// Tabs
// ========================================
function openNewTabModal() {
    openModal('newTabModal');
}

function createNewTab() {
    const name = document.getElementById('newTabName')?.value || 'New Tab';
    const url = document.getElementById('newTabUrl')?.value || 'dev://browser/start';
    
    state.tabCounter++;
    state.tabs.forEach(t => t.active = false);
    state.tabs.push({ 
        id: state.tabCounter, 
        title: name, 
        url, 
        active: true,
        history: [url],
        historyIndex: 0
    });
    
    state.history = state.tabs[state.tabs.length - 1].history;
    state.historyIndex = 0;
    
    closeModal('newTabModal');
    renderTabs();
    navigateTo(url);
    showToast('New tab created', 'info');
    
    document.getElementById('newTabName').value = '';
    document.getElementById('newTabUrl').value = '';
}

function switchTab(tabId) {
    state.tabs.forEach(t => {
        t.active = t.id === tabId;
        if (t.active) {
            state.history = t.history;
            state.historyIndex = t.historyIndex;
        }
    });
    renderTabs();
    updateNavigationButtons();
}

function closeTab(tabId) {
    if (state.tabs.length === 1) return;
    
    const tabIndex = state.tabs.findIndex(t => t.id === tabId);
    state.tabs = state.tabs.filter(t => t.id !== tabId);
    
    // Switch to adjacent tab
    if (tabIndex > 0) {
        switchTab(state.tabs[tabIndex - 1].id);
    } else {
        switchTab(state.tabs[0].id);
    }
    
    renderTabs();
}

function renderTabs() {
    const existingTabs = elements.tabBar?.querySelectorAll('.tab:not(.new-tab)');
    existingTabs?.forEach(t => t.remove());
    
    state.tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.active ? 'active' : ''}`;
        tabEl.dataset.tabId = tab.id;
        tabEl.innerHTML = `
            <span class="tab-icon"><i class="fas fa-code"></i></span>
            <span class="tab-title">${tab.title}</span>
            <span class="tab-close"><i class="fas fa-times"></i></span>
        `;
        
        tabEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-close') || e.target.parentElement.classList.contains('tab-close')) {
                closeTab(tab.id);
            } else {
                switchTab(tab.id);
            }
        });
        
        elements.newTabBtn?.before(tabEl);
    });
}

// ========================================
// Modal Helpers
// ========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// ========================================
// Utility Functions
// ========================================
function updateUrlIcon(url) {
    if (!elements.urlIcon) return;
    
    if (url.startsWith('https://')) {
        elements.urlIcon.innerHTML = '<i class="fas fa-lock"></i>';
        elements.urlIcon.style.color = 'var(--success)';
    } else if (url.startsWith('http://')) {
        elements.urlIcon.innerHTML = '<i class="fas fa-unlock"></i>';
        elements.urlIcon.style.color = 'var(--warning)';
    } else {
        elements.urlIcon.innerHTML = '<i class="fas fa-code"></i>';
        elements.urlIcon.style.color = 'var(--theme-primary)';
    }
}

function toggleBookmark() {
    state.isBookmarked = !state.isBookmarked;
    const icon = elements.bookmarkBtn?.querySelector('i');
    
    if (state.isBookmarked) {
        icon?.classList.remove('far');
        icon?.classList.add('fas');
        icon.style.color = 'var(--warning)';
        showToast('Added to bookmarks', 'success');
    } else {
        icon?.classList.remove('fas');
        icon?.classList.add('far');
        icon.style.color = '';
        showToast('Removed from bookmarks', 'info');
    }
}

function showMenu() {
    const menu = elements.contextMenu;
    if (!menu) return;
    
    menu.style.display = 'block';
    menu.style.top = '100px';
    menu.style.right = '20px';
    menu.classList.add('active');
}

function updateStatus(message, network) {
    if (elements.statusReady) {
        elements.statusReady.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    }
    if (elements.networkStatus) {
        const networkText = network === 'online' ? 'Online' : 'Offline';
        elements.networkStatus.innerHTML = `<i class="fas fa-wifi"></i> ${networkText}`;
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <span class="toast-icon"><i class="fas ${icons[type]}"></i></span>
        <span class="toast-message">${message}</span>
    `;
    
    elements.toastContainer?.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// Keyboard Shortcuts
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape' && state.isConsoleOpen) closeConsolePanel();
        return;
    }
    
    if ((e.ctrlKey && e.key === 'l') || e.key === 'F6') {
        e.preventDefault();
        elements.urlInput?.focus();
        elements.urlInput?.select();
    }
    
    if ((e.ctrlKey && e.shiftKey && e.key === 'I') || e.key === 'F12') {
        e.preventDefault();
        toggleConsole();
    }
    
    if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        refresh();
    }
    
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleBookmark();
    }
    
    if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); goBack(); }
    if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); goForward(); }
    
    if (e.key === 'Escape') {
        if (state.isConsoleOpen) closeConsolePanel();
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    }
    
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        elements.quickSearch?.focus();
    }
    
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        openApp('editor');
    }
    
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        openNewTabModal();
    }
    
    if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        const currentTab = state.tabs.find(t => t.active);
        if (currentTab) closeTab(currentTab.id);
    }
});

// Console log
console.log('%c Dev Browser Ultimate ', 'background: #6366f1; color: white; font-size: 18px; padding: 6px 12px; font-weight: bold; border-radius: 4px;');
console.log('%c Real Browser Functionality Enabled | Type "editor" to open Code Editor ', 'color: #10b981; font-size: 13px;');
