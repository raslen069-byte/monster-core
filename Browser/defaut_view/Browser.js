// =============================================
// Modern Browser - Complete JavaScript
// All Features Implementation
// =============================================

// =============================================
// Data Structures & State
// =============================================

let tabs = [];
let currentTabId = null;
let tabCounter = 1;
let history = [];
let historyIndex = -1;
let bookmarks = [];
let downloads = [];
let passwords = [];
let closedTabs = [];
let zoomLevel = 100;
let currentSearchEngine = 'google';
let settings = {};
let readerFontSize = 18;

// Quick Commands for Browser Modes
const quickCommands = {
    'gaming': {
        name: 'Gaming Mode',
        path: '../gaming_mode/gaming-mode.html',
        icon: '🎮',
        description: 'Open Gaming Mode'
    },
    'dev': {
        name: 'Developer Mode',
        path: '../code-dev-mode/dev.html',
        icon: '💻',
        description: 'Open Developer Mode'
    },
    'secret': {
        name: 'Secret Mode',
        path: '../secret_mode/secret.html',
        icon: '🕵️',
        description: 'Open Secret Mode'
    },
    'editor': {
        name: 'Code Editor',
        path: '../code-editor/editor.html',
        icon: '📝',
        description: 'Open Code Editor'
    },
    'game': {
        name: 'Gaming Mode',
        path: '../gaming_mode/gaming-mode.html',
        icon: '🎮',
        description: 'Open Gaming Mode'
    },
    'developer': {
        name: 'Developer Mode',
        path: '../code-dev-mode/dev.html',
        icon: '💻',
        description: 'Open Developer Mode'
    },
    'code': {
        name: 'Developer Mode',
        path: '../code-dev-mode/dev.html',
        icon: '💻',
        description: 'Open Developer Mode'
    }
};

// Search Engines Configuration
const searchEngines = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        icon: '🔍'
    },
    duckduckgo: {
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q=',
        icon: '🦆'
    },
    bing: {
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
        icon: '🔷'
    },
    wikipedia: {
        name: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Special:Search?search=',
        icon: '📚'
    }
};

// Default bookmarks
const defaultBookmarks = [
    { id: 1, title: 'Google', url: 'https://www.google.com', favicon: 'https://www.google.com/favicon.ico' },
    { id: 2, title: 'YouTube', url: 'https://www.youtube.com', url: 'https://www.youtube.com', favicon: 'https://www.youtube.com/favicon.ico' },
    { id: 3, title: 'GitHub', url: 'https://www.github.com', favicon: 'https://github.com/favicon.ico' },
    { id: 4, title: 'Wikipedia', url: 'https://www.wikipedia.org', favicon: 'https://www.wikipedia.org/favicon.ico' },
    { id: 5, title: 'Reddit', url: 'https://www.reddit.com', favicon: 'https://www.reddit.com/favicon.ico' },
    { id: 6, title: 'Twitter', url: 'https://www.twitter.com', favicon: 'https://twitter.com/favicon.ico' }
];

// Default passwords (for demo)
const defaultPasswords = [
    { id: 1, site: 'github.com', username: 'user@example.com', password: '••••••••••••' },
    { id: 2, site: 'google.com', username: 'user@example.com', password: '••••••••••••' }
];

// Sites that block iframes
const iframeBlockedSites = [
    'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 
    'instagram.com', 'linkedin.com', 'microsoft.com', 'apple.com'
];

// =============================================
// DOM Elements
// =============================================

let tabsContainer;
let newTabBtn;
let addressInput;
let addressBar;
let securityIcon;
let loadingIndicator;
let contentArea;
let bookmarkBar;
let statusBar;
let contextMenu;
let dropdownMenu;
let downloadsPanel;
let historyPanel;
let bookmarksPanel;
let readerMode;
let settingsPanel;
let passwordsPanel;
let searchEngineDropdown;
let findPanel;
let autocompleteDropdown;

// Navigation buttons
let backBtn;
let forwardBtn;
let refreshBtn;
let homeBtn;

// Extension buttons
let findExt;
let readerExt;
let screenshotExt;
let downloadExt;
let incognitoExt;
let starBtn;
let menuBtn;
let searchEngineBtn;

// Dialogs
let bookmarkDialog;
let clearDataDialog;

// =============================================
// Initialization
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    try {
        getDOMElements();
        loadSavedData();
        initializeUI();
        setupEventListeners();
        createNewTab('about:blank');
    } catch (error) {
        console.error('Error initializing browser:', error);
        // Show error message to user
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="welcome-page">
                    <div class="welcome-logo">⚠️</div>
                    <h1 class="welcome-title">Error Loading Browser</h1>
                    <p class="welcome-subtitle">Please refresh the page or check the console for details.</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    }
});

function getDOMElements() {
    tabsContainer = document.getElementById('tabs-container');
    newTabBtn = document.getElementById('new-tab-btn');
    addressInput = document.getElementById('address-input');
    addressBar = document.getElementById('address-bar');
    securityIcon = document.getElementById('security-icon');
    loadingIndicator = document.getElementById('loading-indicator');
    contentArea = document.getElementById('content-area');
    bookmarkBar = document.getElementById('bookmark-bar');
    statusBar = document.getElementById('status-bar');
    contextMenu = document.getElementById('context-menu');
    dropdownMenu = document.getElementById('dropdown-menu');
    downloadsPanel = document.getElementById('downloads-panel');
    historyPanel = document.getElementById('history-panel');
    bookmarksPanel = document.getElementById('bookmarks-panel');
    readerMode = document.getElementById('reader-mode');
    settingsPanel = document.getElementById('settings-panel');
    passwordsPanel = document.getElementById('passwords-panel');
    searchEngineDropdown = document.getElementById('search-engine-dropdown');
    findPanel = document.getElementById('find-panel');
    autocompleteDropdown = document.getElementById('autocomplete-dropdown');

    backBtn = document.getElementById('back-btn');
    forwardBtn = document.getElementById('forward-btn');
    refreshBtn = document.getElementById('refresh-btn');
    homeBtn = document.getElementById('home-btn');

    findExt = document.getElementById('find-ext');
    readerExt = document.getElementById('reader-ext');
    screenshotExt = document.getElementById('screenshot-ext');
    downloadExt = document.getElementById('download-ext');
    incognitoExt = document.getElementById('incognito-ext');
    starBtn = document.getElementById('star-btn');
    menuBtn = document.getElementById('menu-btn');
    searchEngineBtn = document.getElementById('search-engine-btn');

    bookmarkDialog = document.getElementById('bookmark-dialog');
    clearDataDialog = document.getElementById('clear-data-dialog');
    
    // Initialize zoom and search engine display elements
    const zoomLevelEl = document.getElementById('zoom-level');
    const zoomValueEl = document.getElementById('zoom-value');
    const zoomRangeEl = document.getElementById('zoom-range');
}

function loadSavedData() {
    try {
        const savedBookmarks = localStorage.getItem('browser_bookmarks');
        bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [...defaultBookmarks];

        const savedHistory = localStorage.getItem('browser_history');
        history = savedHistory ? JSON.parse(savedHistory) : [];
        historyIndex = history.length - 1;

        const savedZoom = localStorage.getItem('browser_zoom');
        zoomLevel = savedZoom ? parseInt(savedZoom) : 100;

        const savedSearchEngine = localStorage.getItem('browser_search_engine');
        currentSearchEngine = savedSearchEngine || 'google';

        const savedPasswords = localStorage.getItem('browser_passwords');
        passwords = savedPasswords ? JSON.parse(savedPasswords) : [...defaultPasswords];

        const savedSettings = localStorage.getItem('browser_settings');
        settings = savedSettings ? JSON.parse(savedSettings) : {
            theme: 'light',
            showHomeBtn: true,
            showBookmarksBar: true,
            blockPopups: true,
            hardwareAcceleration: true
        };
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function initializeUI() {
    try {
        renderBookmarks();
        renderPasswords();
        updateNavigationButtons();
        updateZoomDisplay();
        updateSearchEngineIcon();
        applySettings();
    } catch (error) {
        console.error('Error initializing UI:', error);
    }
}

function applySettings() {
    // Show/hide home button
    if (homeBtn) {
        homeBtn.style.display = settings.showHomeBtn !== false ? 'flex' : 'none';
    }
    
    // Show/hide bookmarks bar
    if (bookmarkBar) {
        bookmarkBar.style.display = settings.showBookmarksBar !== false ? 'flex' : 'none';
    }
    
    // Apply theme
    if (settings.theme === 'dark') {
        document.body.style.filter = 'invert(0.9)';
    }
}

// =============================================
// Tab Management
// =============================================

function createNewTab(url = 'about:blank', isIncognito = false) {
    const tabId = 'tab-' + tabCounter++;
    const newTab = {
        id: tabId,
        url: url,
        title: 'New Tab',
        favicon: '',
        isLoading: false,
        iframe: null,
        canGoBack: false,
        canGoForward: false,
        isIncognito: isIncognito,
        isPinned: false
    };
    
    tabs.push(newTab);
    renderTabs();
    switchToTab(tabId);
    
    if (url === 'about:blank') {
        if (isIncognito) {
            showIncognitoPage();
        } else {
            showWelcomePage();
        }
    } else {
        loadURL(url);
    }
    
    return tabId;
}

function switchToTab(tabId) {
    currentTabId = tabId;
    const activeTab = getActiveTab();
    
    if (activeTab) {
        addressInput.value = activeTab.url === 'about:blank' ? '' : activeTab.url;
        updateSecurityIcon(activeTab.url);
        updateStarButton();
        showTabContent(tabId);
        updateNavigationButtons();
        renderTabs();
    }
}

function closeTab(tabId, event) {
    if (event) event.stopPropagation();
    
    if (tabs.length <= 1) {
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            tab.url = 'about:blank';
            tab.title = 'New Tab';
            tab.iframe = null;
            showWelcomePage();
            addressInput.value = '';
            renderTabs();
        }
        return;
    }
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    const tabToRemove = tabs[tabIndex];
    
    // Save to closed tabs for reopening
    if (!tabToRemove.isIncognito) {
        closedTabs.push({
            url: tabToRemove.url,
            title: tabToRemove.title
        });
        if (closedTabs.length > 10) closedTabs.shift();
    }
    
    if (tabToRemove.iframe && tabToRemove.iframe.parentNode) {
        tabToRemove.iframe.parentNode.removeChild(tabToRemove.iframe);
    }
    
    tabs.splice(tabIndex, 1);
    
    if (currentTabId === tabId) {
        const newTabIndex = Math.min(tabIndex, tabs.length - 1);
        if (tabs[newTabIndex]) {
            switchToTab(tabs[newTabIndex].id);
        }
    }
    
    renderTabs();
}

function reopenClosedTab() {
    if (closedTabs.length === 0) {
        showToast('No closed tabs to reopen');
        return;
    }
    
    const closedTab = closedTabs.pop();
    const tabId = createNewTab(closedTab.url);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
        tab.title = closedTab.title;
        renderTabs();
    }
    showToast('Tab reopened');
}

function pinTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
        tab.isPinned = !tab.isPinned;
        renderTabs();
    }
}

function getActiveTab() {
    return tabs.find(tab => tab.id === currentTabId);
}

function renderTabs() {
    tabsContainer.innerHTML = '';
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab.id === currentTabId ? 'active' : ''} ${tab.isPinned ? 'pinned' : ''}`;
        tabElement.dataset.tabId = tab.id;
        
        const faviconHtml = tab.favicon 
            ? `<div class="tab-favicon"><img src="${tab.favicon}" alt="" onerror="this.style.display='none'"></div>`
            : `<div class="tab-favicon"><ion-icon name="globe-outline"></ion-icon></div>`;
        
        if (tab.isPinned) {
            tabElement.innerHTML = faviconHtml;
        } else {
            tabElement.innerHTML = `
                ${faviconHtml}
                <span class="tab-title">${tab.title || 'New Tab'}</span>
                <button class="close-tab" data-tab-id="${tab.id}" title="Close tab">
                    <ion-icon name="close"></ion-icon>
                </button>
            `;
        }
        
        tabsContainer.appendChild(tabElement);
        
        tabElement.addEventListener('click', () => switchToTab(tab.id));
        
        // Double click to pin
        tabElement.addEventListener('dblclick', () => {
            if (!tab.isPinned) {
                pinTab(tab.id);
            }
        });
        
        const closeBtn = tabElement.querySelector('.close-tab');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => closeTab(tab.id, e));
        }
    });
}

function showTabContent(tabId) {
    document.querySelectorAll('.tab-iframe').forEach(iframe => {
        iframe.style.display = 'none';
    });
    
    document.querySelectorAll('.welcome-page, .incognito-page').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll('.search-results-container').forEach(el => {
        el.style.display = 'none';
    });
    
    const activeTab = tabs.find(tab => tab.id === tabId);
    if (activeTab) {
        if (activeTab.iframe) {
            activeTab.iframe.style.display = 'block';
        } else if (activeTab.url === 'about:blank') {
            if (activeTab.isIncognito) {
                showIncognitoPage();
            } else {
                showWelcomePage();
            }
        }
    }
}

function showWelcomePage() {
    contentArea.innerHTML = `
        <div class="welcome-page">
            <div class="welcome-logo">🌐</div>
            <h1 class="welcome-title">Welcome to Browser</h1>
            <p class="welcome-subtitle">Search the web or enter a URL to get started</p>
            
            <!-- Quick Commands Section -->
            <div class="quick-commands-hint">
                <p style="margin-bottom: 12px; opacity: 0.9;">💡 <strong>Quick Tip:</strong> Type in the address bar to quickly navigate to:</p>
                <div class="quick-command-chips">
                    <span class="command-chip">🎮 gaming - Gaming Mode</span>
                    <span class="command-chip">💻 dev - Developer Mode</span>
                    <span class="command-chip">🕵️ secret - Secret Mode</span>
                    <span class="command-chip">📝 editor - Code Editor</span>
                </div>
            </div>
            
            <div class="quick-links">
                <button class="quick-link" data-url="https://www.google.com">
                    <span class="quick-link-icon">🔍</span>
                    <span class="quick-link-title">Google</span>
                </button>
                <button class="quick-link" data-url="https://www.youtube.com">
                    <span class="quick-link-icon">📺</span>
                    <span class="quick-link-title">YouTube</span>
                </button>
                <button class="quick-link" data-url="https://www.github.com">
                    <span class="quick-link-icon">💻</span>
                    <span class="quick-link-title">GitHub</span>
                </button>
                <button class="quick-link" data-url="https://www.wikipedia.org">
                    <span class="quick-link-icon">📚</span>
                    <span class="quick-link-title">Wikipedia</span>
                </button>
            </div>
        </div>
    `;

    document.querySelectorAll('.quick-link').forEach(link => {
        link.addEventListener('click', () => loadURL(link.dataset.url));
    });
    
    // Add click handlers for command chips
    document.querySelectorAll('.command-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const text = chip.textContent.split(' ')[0];
            addressInput.value = text;
            loadURL(text);
        });
    });
}

function showIncognitoPage() {
    contentArea.innerHTML = `
        <div class="incognito-page">
            <div class="incognito-logo">🕵️</div>
            <h1 class="incognito-title">Incognito Mode</h1>
            <p class="incognito-subtitle">
                Pages you view in incognito mode won't stick around in your browser's history, 
                cookie store, or search history after you've closed all of your incognito tabs.
            </p>
        </div>
    `;
}

// =============================================
// Navigation & URL Loading
// =============================================

function loadURL(url) {
    if (!url) return;
    
    // Check for quick commands first
    if (handleQuickCommand(url)) {
        return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (!url.includes('.') || url.includes(' ')) {
            performSearch(url);
            return;
        }
        url = 'https://' + url;
    }

    const activeTab = getActiveTab();
    if (!activeTab) return;

    const isBlocked = iframeBlockedSites.some(site => url.includes(site));

    if (isBlocked) {
        showIframeWarning(url);
        return;
    }

    activeTab.url = url;
    activeTab.title = extractDomain(url);
    addressInput.value = url;
    updateSecurityIcon(url);
    updateStarButton();

    addToHistory(url, activeTab.title);
    createOrUpdateIframe(activeTab, url);

    setLoadingState(true);

    setTimeout(() => {
        setLoadingState(false);
        renderTabs();
    }, 1000);
}

function handleQuickCommand(input) {
    const normalizedInput = input.toLowerCase().trim();
    
    // Check for exact matches
    if (quickCommands[normalizedInput]) {
        const command = quickCommands[normalizedInput];
        navigateToMode(command);
        return true;
    }
    
    // Check for partial matches (e.g., "gaming mode", "dev mode")
    for (const [key, command] of Object.entries(quickCommands)) {
        if (normalizedInput.includes(key) || normalizedInput.includes(command.name.toLowerCase())) {
            navigateToMode(command);
            return true;
        }
    }
    
    return false;
}

function navigateToMode(command) {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    // Show loading state
    setLoadingState(true);
    
    // Show transition message
    contentArea.innerHTML = `
        <div class="welcome-page" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="welcome-logo">${command.icon}</div>
            <h1 class="welcome-title">Opening ${command.name}...</h1>
            <p class="welcome-subtitle">${command.description}</p>
        </div>
    `;
    
    // Update tab info
    activeTab.url = command.path;
    activeTab.title = command.name;
    addressInput.value = command.name;
    
    // Navigate after short delay
    setTimeout(() => {
        window.location.href = command.path;
    }, 800);
}

function performSearch(query) {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    const engine = searchEngines[currentSearchEngine];
    const searchUrl = engine.url + encodeURIComponent(query);
    
    activeTab.url = searchUrl;
    activeTab.title = `Search: ${query}`;
    addressInput.value = searchUrl;
    
    addToHistory(searchUrl, `Search (${engine.name}): ${query}`);
    createOrUpdateIframe(activeTab, searchUrl);
    
    setLoadingState(true);
    setTimeout(() => {
        setLoadingState(false);
        renderTabs();
    }, 1500);
}

function showIframeWarning(url) {
    const activeTab = getActiveTab();
    if (!activeTab) return;
    
    contentArea.innerHTML = `
        <div class="welcome-page" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <div class="welcome-logo">⚠️</div>
            <h1 class="welcome-title">Cannot Display This Site</h1>
            <p class="welcome-subtitle" style="margin-top: 16px;">
                ${new URL(url).hostname} does not allow embedding in iframes.<br>
                Opening in a new window instead...
            </p>
            <button onclick="window.open('${url.replace(/'/g, "\\'")}', '_blank')" 
                    style="margin-top: 24px; padding: 12px 32px; background: white; color: #f5576c; 
                           border: none; border-radius: 24px; font-size: 16px; cursor: pointer; 
                           font-weight: 600;">
                Open in New Window
            </button>
        </div>
    `;
    
    activeTab.url = url;
    activeTab.title = extractDomain(url);
    addressInput.value = url;
    
    setTimeout(() => {
        window.open(url, '_blank');
    }, 2000);
}

function createOrUpdateIframe(tab, url) {
    if (tab.iframe && tab.iframe.parentNode) {
        tab.iframe.parentNode.removeChild(tab.iframe);
    }
    
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.className = 'tab-iframe';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'none';
    
    iframe.onload = () => {
        if (tab.id === currentTabId) {
            setLoadingState(false);
        }
    };
    
    iframe.onerror = () => {
        console.error(`Failed to load ${url}`);
        if (tab.id === currentTabId) {
            setLoadingState(false);
        }
    };
    
    contentArea.appendChild(iframe);
    tab.iframe = iframe;
    
    if (tab.id === currentTabId) {
        showTabContent(tab.id);
    }
}

function navigateBack() {
    const activeTab = getActiveTab();
    if (!activeTab || !activeTab.canGoBack) return;
    
    try {
        if (activeTab.iframe) {
            activeTab.iframe.contentWindow.history.back();
        }
    } catch (e) {
        console.log("Cross-origin restriction");
    }
    
    updateNavigationButtons();
}

function navigateForward() {
    const activeTab = getActiveTab();
    if (!activeTab || !activeTab.canGoForward) return;
    
    try {
        if (activeTab.iframe) {
            activeTab.iframe.contentWindow.history.forward();
        }
    } catch (e) {
        console.log("Cross-origin restriction");
    }
    
    updateNavigationButtons();
}

function refresh() {
    const activeTab = getActiveTab();
    if (!activeTab || !activeTab.iframe) return;
    
    const icon = refreshBtn.querySelector('.refresh-icon');
    icon.style.animation = 'none';
    void icon.offsetWidth;
    icon.style.animation = 'spin 0.5s linear';
    
    activeTab.iframe.src = activeTab.iframe.src;
    setLoadingState(true);
    
    setTimeout(() => {
        setLoadingState(false);
    }, 1000);
}

function goHome() {
    const activeTab = getActiveTab();
    if (activeTab) {
        activeTab.url = 'about:blank';
        activeTab.title = 'New Tab';
        activeTab.iframe = null;
        contentArea.innerHTML = '';
        showWelcomePage();
        addressInput.value = '';
        updateSecurityIcon('about:blank');
        renderTabs();
    }
}

// =============================================
// History Management
// =============================================

function addToHistory(url, title) {
    const activeTab = getActiveTab();
    if (activeTab && activeTab.isIncognito) return; // Don't save incognito history
    
    const historyItem = {
        id: Date.now(),
        url: url,
        title: title,
        timestamp: new Date().toISOString()
    };
    
    history.push(historyItem);
    historyIndex = history.length - 1;
    
    localStorage.setItem('browser_history', JSON.stringify(history));
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const activeTab = getActiveTab();
    backBtn.disabled = !activeTab || historyIndex <= 0;
    forwardBtn.disabled = !activeTab || historyIndex >= history.length - 1;
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                <ion-icon name="time-outline" style="font-size: 48px; margin-bottom: 16px;"></ion-icon>
                <p>No history yet</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = history.slice().reverse().map(item => {
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="history-item" data-url="${item.url}">
                <div class="history-favicon">
                    <ion-icon name="globe-outline"></ion-icon>
                </div>
                <div class="history-info">
                    <div class="history-title">${item.title}</div>
                    <div class="history-url">${item.url}</div>
                </div>
                <span class="history-time">${timeStr}</span>
            </div>
        `;
    }).join('');
    
    historyList.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            loadURL(item.dataset.url);
            toggleHistoryPanel();
        });
    });
}

function clearHistory() {
    history = [];
    historyIndex = -1;
    localStorage.setItem('browser_history', JSON.stringify(history));
    renderHistory();
    updateNavigationButtons();
    showToast('History cleared');
}

// =============================================
// Bookmarks
// =============================================

function renderBookmarks() {
    if (!bookmarkBar) return;
    
    bookmarkBar.innerHTML = bookmarks.map(bookmark => `
        <button class="bookmark-item" data-url="${bookmark.url}">
            <div class="bookmark-favicon">
                <img src="${bookmark.favicon}" alt="" onerror="this.style.display='none'">
            </div>
            <span class="bookmark-title">${bookmark.title}</span>
        </button>
    `).join('');
    
    bookmarkBar.querySelectorAll('.bookmark-item').forEach(item => {
        item.addEventListener('click', () => loadURL(item.dataset.url));
    });
}

function renderBookmarksPanel() {
    const bookmarksList = document.getElementById('bookmarks-list');
    if (!bookmarksList) return;
    
    if (bookmarks.length === 0) {
        bookmarksList.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                <ion-icon name="bookmark-outline" style="font-size: 48px; margin-bottom: 16px;"></ion-icon>
                <p>No bookmarks yet</p>
            </div>
        `;
        return;
    }
    
    bookmarksList.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark-item-panel" data-url="${bookmark.url}">
            <div class="bookmark-favicon">
                <img src="${bookmark.favicon}" alt="" onerror="this.style.display='none'">
            </div>
            <div class="history-info">
                <div class="history-title">${bookmark.title}</div>
                <div class="history-url">${bookmark.url}</div>
            </div>
        </div>
    `).join('');
    
    bookmarksList.querySelectorAll('.bookmark-item-panel').forEach(item => {
        item.addEventListener('click', () => {
            loadURL(item.dataset.url);
            toggleBookmarksPanel();
        });
    });
}

function addCurrentBookmark() {
    const activeTab = getActiveTab();
    if (!activeTab || activeTab.url === 'about:blank') {
        showBookmarkDialog();
        return;
    }
    
    const bookmark = {
        id: Date.now(),
        title: activeTab.title,
        url: activeTab.url,
        favicon: `https://www.google.com/s2/favicons?domain=${activeTab.url}`
    };
    
    bookmarks.push(bookmark);
    localStorage.setItem('browser_bookmarks', JSON.stringify(bookmarks));
    renderBookmarks();
    updateStarButton();
    showToast('Bookmark added');
}

function showBookmarkDialog() {
    const overlay = document.getElementById('bookmark-dialog-overlay');
    const activeTab = getActiveTab();
    
    document.getElementById('bookmark-name').value = activeTab ? activeTab.title : '';
    document.getElementById('bookmark-url').value = activeTab ? activeTab.url : '';
    
    overlay.classList.add('visible');
}

function hideBookmarkDialog() {
    document.getElementById('bookmark-dialog-overlay').classList.remove('visible');
}

function saveBookmarkFromDialog() {
    const name = document.getElementById('bookmark-name').value;
    const url = document.getElementById('bookmark-url').value;
    
    if (name && url) {
        const bookmark = {
            id: Date.now(),
            title: name,
            url: url,
            favicon: `https://www.google.com/s2/favicons?domain=${url}`
        };
        
        bookmarks.push(bookmark);
        localStorage.setItem('browser_bookmarks', JSON.stringify(bookmarks));
        renderBookmarks();
        renderBookmarksPanel();
        updateStarButton();
        showToast('Bookmark saved');
    }
    
    hideBookmarkDialog();
}

function updateStarButton() {
    if (!starBtn) return;
    
    const activeTab = getActiveTab();
    const isBookmarked = activeTab && bookmarks.some(b => b.url === activeTab.url);
    
    if (isBookmarked) {
        starBtn.classList.add('active');
        starBtn.innerHTML = '<ion-icon name="star"></ion-icon>';
    } else {
        starBtn.classList.remove('active');
        starBtn.innerHTML = '<ion-icon name="star-outline"></ion-icon>';
    }
}

// =============================================
// Downloads
// =============================================

function simulateDownload(filename, size) {
    const download = {
        id: Date.now(),
        name: filename,
        size: size,
        progress: 0,
        status: 'downloading'
    };
    
    downloads.unshift(download);
    renderDownloads();
    
    const interval = setInterval(() => {
        download.progress += Math.random() * 30;
        if (download.progress >= 100) {
            download.progress = 100;
            download.status = 'complete';
            clearInterval(interval);
            showToast('Download complete: ' + filename);
        }
        renderDownloads();
    }, 500);
}

function renderDownloads() {
    const downloadsList = document.getElementById('downloads-list');
    if (!downloadsList) return;
    
    if (downloads.length === 0) {
        downloadsList.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                <ion-icon name="download-outline" style="font-size: 48px; margin-bottom: 16px;"></ion-icon>
                <p>No downloads</p>
            </div>
        `;
        return;
    }
    
    downloadsList.innerHTML = downloads.map(dl => `
        <div class="download-item">
            <div class="download-icon">
                <ion-icon name="${dl.status === 'complete' ? 'document' : 'arrow-down'}"></ion-icon>
            </div>
            <div class="download-info">
                <div class="download-name">${dl.name}</div>
                <div class="download-status">
                    ${dl.status === 'complete' ? 'Complete' : Math.round(dl.progress) + '%'}
                </div>
                ${dl.status !== 'complete' ? `
                    <div class="download-progress">
                        <div class="download-progress-bar" style="width: ${dl.progress}%"></div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function clearDownloads() {
    downloads = [];
    renderDownloads();
    showToast('Downloads cleared');
}

function toggleDownloadsPanel() {
    renderDownloads();
    downloadsPanel.classList.toggle('visible');
    historyPanel.classList.remove('visible');
    dropdownMenu.classList.remove('visible');
}

// =============================================
// Passwords Manager
// =============================================

function renderPasswords() {
    const passwordsList = document.getElementById('passwords-list');
    if (!passwordsList) return;
    
    if (passwords.length === 0) {
        passwordsList.innerHTML = `
            <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                <ion-icon name="key-outline" style="font-size: 48px; margin-bottom: 16px;"></ion-icon>
                <p>No saved passwords</p>
            </div>
        `;
        return;
    }
    
    passwordsList.innerHTML = passwords.map(pwd => `
        <div class="password-item">
            <div class="password-icon">
                <ion-icon name="key"></ion-icon>
            </div>
            <div class="password-info">
                <div class="password-site">${pwd.site}</div>
                <div class="password-username">${pwd.username}</div>
            </div>
            <div class="password-actions">
                <button class="password-action-btn" title="Show password" onclick="showPassword(${pwd.id})">
                    <ion-icon name="eye"></ion-icon>
                </button>
                <button class="password-action-btn" title="Copy password" onclick="copyPassword(${pwd.id})">
                    <ion-icon name="copy"></ion-icon>
                </button>
                <button class="password-action-btn" title="Delete" onclick="deletePassword(${pwd.id})">
                    <ion-icon name="trash"></ion-icon>
                </button>
            </div>
        </div>
    `).join('');
}

function showPassword(id) {
    const pwd = passwords.find(p => p.id === id);
    if (pwd) {
        showToast('Password: ' + pwd.password.replace(/•/g, 'p'));
    }
}

function copyPassword(id) {
    const pwd = passwords.find(p => p.id === id);
    if (pwd) {
        navigator.clipboard.writeText(pwd.password.replace(/•/g, 'p'));
        showToast('Password copied to clipboard');
    }
}

function deletePassword(id) {
    passwords = passwords.filter(p => p.id !== id);
    localStorage.setItem('browser_passwords', JSON.stringify(passwords));
    renderPasswords();
    showToast('Password deleted');
}

function togglePasswordsPanel() {
    renderPasswords();
    passwordsPanel.classList.toggle('visible');
    dropdownMenu.classList.remove('visible');
}

// =============================================
// Find in Page
// =============================================

let findMatches = [];
let currentFindIndex = -1;

function toggleFindPanel() {
    findPanel.classList.toggle('visible');
    if (findPanel.classList.contains('visible')) {
        document.getElementById('find-input').focus();
    }
}

function findInPage(text) {
    const activeTab = getActiveTab();
    if (!activeTab || !activeTab.iframe) return;
    
    try {
        const iframeDoc = activeTab.iframe.contentDocument;
        if (!iframeDoc) return;
        
        // Simple text search
        const content = iframeDoc.body.innerText;
        findMatches = [];
        let index = content.toLowerCase().indexOf(text.toLowerCase());
        
        while (index !== -1) {
            findMatches.push(index);
            index = content.toLowerCase().indexOf(text.toLowerCase(), index + 1);
        }
        
        currentFindIndex = findMatches.length > 0 ? 0 : -1;
        updateFindCount();
        
    } catch (e) {
        console.log("Cannot search in iframe due to cross-origin");
    }
}

function findNext() {
    if (findMatches.length === 0) return;
    currentFindIndex = (currentFindIndex + 1) % findMatches.length;
    updateFindCount();
}

function findPrevious() {
    if (findMatches.length === 0) return;
    currentFindIndex = (currentFindIndex - 1 + findMatches.length) % findMatches.length;
    updateFindCount();
}

function updateFindCount() {
    const countEl = document.getElementById('find-count');
    if (countEl) {
        countEl.textContent = findMatches.length > 0 
            ? `${currentFindIndex + 1}/${findMatches.length}` 
            : '0/0';
    }
}

// =============================================
// Reader Mode
// =============================================

function toggleReaderMode() {
    readerMode.classList.toggle('visible');
    
    if (readerMode.classList.contains('visible')) {
        const activeTab = getActiveTab();
        if (activeTab && activeTab.title !== 'New Tab') {
            document.getElementById('reader-article').innerHTML = `
                <h1>${activeTab.title}</h1>
                <div class="meta">Source: ${extractDomain(activeTab.url)}</div>
                <div class="content" style="font-size: ${readerFontSize}px;">
                    <p>Reader mode provides a clean, distraction-free view of articles.</p>
                    <p>The content from ${activeTab.url} would be displayed here in a simplified format.</p>
                </div>
            `;
        }
    }
}

function setReaderTheme(theme) {
    readerMode.classList.remove('light', 'dark', 'sepia');
    readerMode.classList.add(theme);
}

// =============================================
// Settings
// =============================================

function toggleSettingsPanel() {
    settingsPanel.classList.toggle('visible');
    dropdownMenu.classList.remove('visible');
}

function switchSettingsSection(section) {
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });
    
    document.querySelectorAll('.settings-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === 'settings-' + section);
    });
}

function saveSettings() {
    localStorage.setItem('browser_settings', JSON.stringify(settings));
    applySettings();
    showToast('Settings saved');
}

// =============================================
// UI State Management
// =============================================

function setLoadingState(isLoading) {
    const activeTab = getActiveTab();
    if (activeTab) activeTab.isLoading = isLoading;
    
    loadingIndicator.classList.toggle('active', isLoading);
    
    const icon = refreshBtn.querySelector('.refresh-icon');
    if (isLoading) {
        icon.setAttribute('name', 'close');
    } else {
        icon.setAttribute('name', 'refresh');
    }
}

function updateSecurityIcon(url) {
    if (url === 'about:blank') {
        securityIcon.innerHTML = '<ion-icon name="globe-outline"></ion-icon>';
        securityIcon.classList.remove('warning');
        addressBar.classList.remove('security-secure', 'security-warning');
        return;
    }
    
    try {
        const urlObj = new URL(url);
        if (urlObj.protocol === 'https:') {
            securityIcon.innerHTML = '<ion-icon name="lock-closed"></ion-icon>';
            securityIcon.classList.remove('warning');
            addressBar.classList.add('security-secure');
            addressBar.classList.remove('security-warning');
        } else {
            securityIcon.innerHTML = '<ion-icon name="warning"></ion-icon>';
            securityIcon.classList.add('warning');
            addressBar.classList.remove('security-secure');
            addressBar.classList.add('security-warning');
        }
    } catch (e) {
        securityIcon.innerHTML = '<ion-icon name="globe-outline"></ion-icon>';
        securityIcon.classList.remove('warning');
        addressBar.classList.remove('security-secure', 'security-warning');
    }
}

function updateZoomDisplay() {
    try {
        const zoomLevelEl = document.getElementById('zoom-level');
        const zoomValueEl = document.getElementById('zoom-value');
        const zoomRangeEl = document.getElementById('zoom-range');

        if (zoomLevelEl) zoomLevelEl.textContent = zoomLevel + '%';
        if (zoomValueEl) zoomValueEl.textContent = zoomLevel + '%';
        if (zoomRangeEl) zoomRangeEl.value = zoomLevel;

        if (contentArea) {
            contentArea.style.zoom = zoomLevel / 100;
        }
        localStorage.setItem('browser_zoom', zoomLevel);
    } catch (error) {
        console.error('Error updating zoom:', error);
    }
}

function updateSearchEngineIcon() {
    try {
        const engine = searchEngines[currentSearchEngine];
        if (searchEngineBtn && engine) {
            searchEngineBtn.innerHTML = `<span style="font-size: 16px;">${engine.icon}</span>`;
        }
    } catch (error) {
        console.error('Error updating search engine icon:', error);
    }
}

// =============================================
// Screenshot
// =============================================

function takeScreenshot() {
    showToast('Screenshot captured!');
    simulateDownload('screenshot_' + Date.now() + '.png', '1.2 MB');
}

// =============================================
// Fullscreen
// =============================================

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// =============================================
// Search Engine Selection
// =============================================

function toggleSearchEngineDropdown() {
    searchEngineDropdown.classList.toggle('visible');
}

function setSearchEngine(engine) {
    currentSearchEngine = engine;
    localStorage.setItem('browser_search_engine', engine);
    updateSearchEngineIcon();
    searchEngineDropdown.classList.remove('visible');
    showToast(`Search engine changed to ${searchEngines[engine].name}`);
}

// =============================================
// Context Menu
// =============================================

function showContextMenu(x, y) {
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.classList.add('visible');
}

function hideContextMenu() {
    contextMenu.classList.remove('visible');
}

function hideAllMenus() {
    hideContextMenu();
    dropdownMenu.classList.remove('visible');
    downloadsPanel.classList.remove('visible');
    historyPanel.classList.remove('visible');
    bookmarksPanel.classList.remove('visible');
    passwordsPanel.classList.remove('visible');
    searchEngineDropdown.classList.remove('visible');
    hideAutocomplete();
}

// =============================================
// Utility Functions
// =============================================

function extractDomain(url) {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch (e) {
        return url;
    }
}

function toggleHistoryPanel() {
    renderHistory();
    historyPanel.classList.toggle('visible');
    downloadsPanel.classList.remove('visible');
    dropdownMenu.classList.remove('visible');
}

function toggleBookmarksPanel() {
    renderBookmarksPanel();
    bookmarksPanel.classList.toggle('visible');
    dropdownMenu.classList.remove('visible');
}

function toggleDropdownMenu() {
    dropdownMenu.classList.toggle('visible');
    downloadsPanel.classList.remove('visible');
    historyPanel.classList.remove('visible');
    bookmarksPanel.classList.remove('visible');
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">✓</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close"><ion-icon name="close"></ion-icon></button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =============================================
// Autocomplete Suggestions
// =============================================

let autocompleteSuggestions = [];
let selectedAutocompleteIndex = -1;

function showAutocomplete(input) {
    if (!autocompleteDropdown) return;
    
    const normalizedInput = input.toLowerCase();
    autocompleteSuggestions = [];
    selectedAutocompleteIndex = -1;
    
    // Add quick commands suggestions
    for (const [key, command] of Object.entries(quickCommands)) {
        if (key.includes(normalizedInput) || command.name.toLowerCase().includes(normalizedInput)) {
            autocompleteSuggestions.push({
                type: 'command',
                icon: command.icon,
                title: command.name,
                description: command.description,
                shortcut: 'Quick Command',
                action: () => navigateToMode(command)
            });
        }
    }
    
    // Add history suggestions
    const historyMatches = history.filter(item => 
        item.title.toLowerCase().includes(normalizedInput) || 
        item.url.toLowerCase().includes(normalizedInput)
    ).slice(0, 3);
    
    historyMatches.forEach(item => {
        autocompleteSuggestions.push({
            type: 'history',
            icon: '🕐',
            title: item.title,
            description: item.url,
            shortcut: 'History',
            action: () => loadURL(item.url)
        });
    });
    
    // Add bookmark suggestions
    const bookmarkMatches = bookmarks.filter(item => 
        item.title.toLowerCase().includes(normalizedInput) || 
        item.url.toLowerCase().includes(normalizedInput)
    ).slice(0, 2);
    
    bookmarkMatches.forEach(item => {
        autocompleteSuggestions.push({
            type: 'bookmark',
            icon: '⭐',
            title: item.title,
            description: item.url,
            shortcut: 'Bookmark',
            action: () => loadURL(item.url)
        });
    });
    
    // Add search suggestion
    if (normalizedInput.length > 0) {
        const engine = searchEngines[currentSearchEngine];
        autocompleteSuggestions.push({
            type: 'search',
            icon: engine.icon,
            title: `Search "${input}" with ${engine.name}`,
            description: `Search the web`,
            shortcut: 'Search',
            action: () => performSearch(input)
        });
    }
    
    renderAutocomplete();
}

function renderAutocomplete() {
    if (!autocompleteDropdown) return;
    
    if (autocompleteSuggestions.length === 0) {
        hideAutocomplete();
        return;
    }
    
    autocompleteDropdown.innerHTML = autocompleteSuggestions.map((item, index) => `
        <div class="autocomplete-item ${index === selectedAutocompleteIndex ? 'selected' : ''}" data-index="${index}">
            <span class="autocomplete-icon">${item.icon}</span>
            <div class="autocomplete-content">
                <div class="autocomplete-title">${item.title}</div>
                <div class="autocomplete-description">${item.description}</div>
            </div>
            <span class="autocomplete-shortcut">${item.shortcut}</span>
        </div>
    `).join('');
    
    // Add click handlers
    autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach((itemEl, index) => {
        itemEl.addEventListener('click', () => {
            if (autocompleteSuggestions[index]) {
                autocompleteSuggestions[index].action();
                hideAutocomplete();
            }
        });
    });
    
    autocompleteDropdown.classList.add('visible');
}

function hideAutocomplete() {
    if (autocompleteDropdown) {
        autocompleteDropdown.classList.remove('visible');
    }
    autocompleteSuggestions = [];
    selectedAutocompleteIndex = -1;
}

function selectNextAutocomplete() {
    if (autocompleteSuggestions.length === 0 || !autocompleteDropdown) return;
    
    selectedAutocompleteIndex = (selectedAutocompleteIndex + 1) % autocompleteSuggestions.length;
    updateAutocompleteSelection();
}

function selectPreviousAutocomplete() {
    if (autocompleteSuggestions.length === 0 || !autocompleteDropdown) return;
    
    selectedAutocompleteIndex = (selectedAutocompleteIndex - 1 + autocompleteSuggestions.length) % autocompleteSuggestions.length;
    updateAutocompleteSelection();
}

function updateAutocompleteSelection() {
    if (!autocompleteDropdown) return;
    
    const items = autocompleteDropdown.querySelectorAll('.autocomplete-item');
    items.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedAutocompleteIndex);
    });
    
    // Scroll selected item into view
    const selected = autocompleteDropdown.querySelector('.autocomplete-item.selected');
    if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
    }
}

// =============================================
// Event Listeners Setup
// =============================================

function setupEventListeners() {
    try {
        // New tab button
        if (newTabBtn) {
            newTabBtn.addEventListener('click', () => createNewTab('about:blank'));
        }

        // Navigation buttons
        if (backBtn) backBtn.addEventListener('click', navigateBack);
        if (forwardBtn) forwardBtn.addEventListener('click', navigateForward);
        if (refreshBtn) refreshBtn.addEventListener('click', refresh);
        if (homeBtn) homeBtn.addEventListener('click', goHome);
    
    // Address bar
    if (addressInput) {
        addressInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length > 0) {
                showAutocomplete(value);
            } else {
                hideAutocomplete();
            }
        });

        addressInput.addEventListener('focus', () => {
            addressInput.select();
            if (addressInput.value.trim().length > 0) {
                showAutocomplete(addressInput.value.trim());
            }
        });

        addressInput.addEventListener('blur', () => {
            setTimeout(() => hideAutocomplete(), 200);
        });

        addressInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const selected = autocompleteDropdown?.querySelector('.autocomplete-item.selected');
                if (selected) {
                    e.preventDefault();
                    selected.click();
                    return;
                }
                const url = addressInput.value.trim();
                if (url) loadURL(url);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectNextAutocomplete();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectPreviousAutocomplete();
            } else if (e.key === 'Escape') {
                hideAutocomplete();
            }
        });

        addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const url = addressInput.value.trim();
                if (url) loadURL(url);
            }
        });
    }
    
    // Star button
    if (starBtn) {
        starBtn.addEventListener('click', () => {
            const activeTab = getActiveTab();
            const isBookmarked = activeTab && bookmarks.some(b => b.url === activeTab.url);

            if (isBookmarked) {
                // Remove bookmark
                bookmarks = bookmarks.filter(b => b.url !== activeTab.url);
                localStorage.setItem('browser_bookmarks', JSON.stringify(bookmarks));
                renderBookmarks();
                updateStarButton();
                showToast('Bookmark removed');
            } else {
                addCurrentBookmark();
            }
        });
    }

    // Search engine button
    if (searchEngineBtn) {
        searchEngineBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSearchEngineDropdown();
        });
    }

    // Search engine options
    if (searchEngineDropdown) {
        searchEngineDropdown.querySelectorAll('.search-engine-option').forEach(option => {
            option.addEventListener('click', () => {
                setSearchEngine(option.dataset.engine);
            });
        });
    }

    // Extension buttons
    if (findExt) findExt.addEventListener('click', toggleFindPanel);
    if (readerExt) readerExt.addEventListener('click', toggleReaderMode);
    if (screenshotExt) screenshotExt.addEventListener('click', takeScreenshot);
    if (downloadExt) downloadExt.addEventListener('click', () => {
        simulateDownload('file_' + Date.now() + '.pdf', '2.5 MB');
        toggleDownloadsPanel();
    });
    if (incognitoExt) incognitoExt.addEventListener('click', () => createNewTab('about:blank', true));

    // Menu button
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdownMenu();
        });
    }
    
    // Close panels
    document.getElementById('close-downloads')?.addEventListener('click', () => {
        downloadsPanel.classList.remove('visible');
    });
    
    document.getElementById('clear-downloads')?.addEventListener('click', clearDownloads);
    
    document.getElementById('close-history')?.addEventListener('click', () => {
        historyPanel.classList.remove('visible');
    });
    
    document.getElementById('clear-history')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all history?')) {
            clearHistory();
        }
    });
    
    document.getElementById('close-bookmarks')?.addEventListener('click', () => {
        bookmarksPanel.classList.remove('visible');
    });
    
    document.getElementById('add-bookmark')?.addEventListener('click', showBookmarkDialog);
    
    document.getElementById('close-passwords')?.addEventListener('click', () => {
        passwordsPanel.classList.remove('visible');
    });
    
    // Reader mode controls
    document.getElementById('reader-close')?.addEventListener('click', () => {
        readerMode.classList.remove('visible');
    });
    
    document.getElementById('reader-font-increase')?.addEventListener('click', () => {
        readerFontSize = Math.min(readerFontSize + 2, 32);
        const content = document.querySelector('.reader-article .content');
        if (content) content.style.fontSize = readerFontSize + 'px';
    });
    
    document.getElementById('reader-font-decrease')?.addEventListener('click', () => {
        readerFontSize = Math.max(readerFontSize - 2, 14);
        const content = document.querySelector('.reader-article .content');
        if (content) content.style.fontSize = readerFontSize + 'px';
    });
    
    document.getElementById('reader-theme-light')?.addEventListener('click', () => setReaderTheme('light'));
    document.getElementById('reader-theme-dark')?.addEventListener('click', () => setReaderTheme('dark'));
    document.getElementById('reader-theme-sepia')?.addEventListener('click', () => setReaderTheme('sepia'));
    
    // Find panel
    document.getElementById('find-close')?.addEventListener('click', () => {
        findPanel.classList.remove('visible');
    });
    
    document.getElementById('find-input')?.addEventListener('input', (e) => {
        findInPage(e.target.value);
    });
    
    document.getElementById('find-next')?.addEventListener('click', findNext);
    document.getElementById('find-prev')?.addEventListener('click', findPrevious);
    
    // Zoom controls
    document.getElementById('zoom-in')?.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomLevel = Math.min(zoomLevel + 10, 200);
        updateZoomDisplay();
    });
    
    document.getElementById('zoom-out')?.addEventListener('click', (e) => {
        e.stopPropagation();
        zoomLevel = Math.max(zoomLevel - 10, 50);
        updateZoomDisplay();
    });
    
    // Settings
    document.getElementById('close-settings')?.addEventListener('click', () => {
        settingsPanel.classList.remove('visible');
    });
    
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            switchSettingsSection(item.dataset.section);
        });
    });
    
    // Settings controls
    document.getElementById('show-home-btn')?.addEventListener('change', (e) => {
        settings.showHomeBtn = e.target.checked;
        saveSettings();
    });
    
    document.getElementById('show-bookmarks-bar')?.addEventListener('change', (e) => {
        settings.showBookmarksBar = e.target.checked;
        saveSettings();
    });
    
    document.getElementById('zoom-range')?.addEventListener('input', (e) => {
        zoomLevel = parseInt(e.target.value);
        updateZoomDisplay();
    });
    
    document.getElementById('default-search-engine')?.addEventListener('change', (e) => {
        currentSearchEngine = e.target.value;
        localStorage.setItem('browser_search_engine', e.target.value);
        updateSearchEngineIcon();
    });
    
    document.getElementById('clear-browsing-data')?.addEventListener('click', () => {
        document.getElementById('clear-data-dialog-overlay').classList.add('visible');
    });
    
    document.getElementById('clear-data-dialog-close')?.addEventListener('click', () => {
        document.getElementById('clear-data-dialog-overlay').classList.remove('visible');
    });
    
    document.getElementById('clear-data-cancel')?.addEventListener('click', () => {
        document.getElementById('clear-data-dialog-overlay').classList.remove('visible');
    });
    
    document.getElementById('clear-data-confirm')?.addEventListener('click', () => {
        const clearHistoryCheck = document.getElementById('clear-history-check')?.checked;
        const clearPasswordsCheck = document.getElementById('clear-passwords-check')?.checked;
        
        if (clearHistoryCheck) clearHistory();
        if (clearPasswordsCheck) {
            passwords = [];
            localStorage.setItem('browser_passwords', JSON.stringify(passwords));
            renderPasswords();
        }
        
        document.getElementById('clear-data-dialog-overlay').classList.remove('visible');
        showToast('Browsing data cleared');
    });
    
    // Bookmark dialog
    document.getElementById('bookmark-dialog-close')?.addEventListener('click', hideBookmarkDialog);
    document.getElementById('bookmark-cancel')?.addEventListener('click', hideBookmarkDialog);
    document.getElementById('bookmark-save')?.addEventListener('click', saveBookmarkFromDialog);
    
    // Dropdown menu actions
    dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            handleMenuAction(action);
        });
    });
    
    // Context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY);
    });
    
    contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleContextMenuAction(action);
            hideContextMenu();
        });
    });
    
    // Click outside to close menus
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target) &&
            !dropdownMenu.contains(e.target) &&
            !downloadsPanel.contains(e.target) &&
            !historyPanel.contains(e.target) &&
            !bookmarksPanel.contains(e.target) &&
            !passwordsPanel.contains(e.target) &&
            !searchEngineDropdown.contains(e.target) &&
            !autocompleteDropdown.contains(e.target) &&
            !addressInput.contains(e.target)) {
            hideAllMenus();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Gaming mode button
    const gamingModeBtn = document.getElementById('gaming-mode-btn');
    if (gamingModeBtn) {
        gamingModeBtn.addEventListener('click', () => {
            window.location.href = '../gaming_mode/gaming-mode.html';
        });
    }

    // Status bar - show URL on link hover
    if (contentArea && statusBar) {
        contentArea.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'A' && e.target.href) {
                statusBar.textContent = e.target.href;
                statusBar.classList.add('visible');
            }
        });

        contentArea.addEventListener('mouseout', () => {
            statusBar.classList.remove('visible');
        });
    }
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function handleMenuAction(action) {
    switch (action) {
        case 'new-tab':
            createNewTab('about:blank');
            break;
        case 'new-window':
            window.open('Browser.html', '_blank');
            break;
        case 'new-incognito':
            createNewTab('about:blank', true);
            break;
        case 'reopen-closed':
            reopenClosedTab();
            break;
        case 'history':
            toggleHistoryPanel();
            break;
        case 'downloads':
            toggleDownloadsPanel();
            break;
        case 'bookmarks':
            addCurrentBookmark();
            break;
        case 'bookmark-manager':
            toggleBookmarksPanel();
            break;
        case 'find-in-page':
            toggleFindPanel();
            break;
        case 'fullscreen':
            toggleFullscreen();
            break;
        case 'screenshot':
            takeScreenshot();
            break;
        case 'settings':
            toggleSettingsPanel();
            break;
        case 'extensions':
            showToast('Extensions panel coming soon!');
            break;
        case 'passwords':
            togglePasswordsPanel();
            break;
        case 'help':
            alert('Browser Help:\n\n• Ctrl+T: New Tab\n• Ctrl+W: Close Tab\n• Ctrl+Shift+T: Reopen Closed Tab\n• F5: Refresh\n• Alt+Left: Back\n• Alt+Right: Forward\n• Ctrl+F: Find in Page\n• Ctrl+D: Bookmark\n• Ctrl+H: History\n• Ctrl+J: Downloads\n• F11: Fullscreen');
            break;
        case 'dev-mode':
            window.location.href = '../code-dev-mode/dev.html';
            break;
        case 'secret-mode':
            window.location.href = '../secret_mode/index.html';
            break;
    }
    dropdownMenu.classList.remove('visible');
}

function handleContextMenuAction(action) {
    switch (action) {
        case 'back':
            navigateBack();
            break;
        case 'forward':
            navigateForward();
            break;
        case 'refresh':
            refresh();
            break;
        case 'bookmark':
            addCurrentBookmark();
            break;
        case 'save-as':
            showToast('Save as feature coming soon!');
            break;
        case 'print':
            window.print();
            break;
        case 'select-all':
            document.execCommand('selectAll');
            break;
        case 'view-source':
            const activeTab = getActiveTab();
            if (activeTab && activeTab.iframe) {
                try {
                    const doc = activeTab.iframe.contentWindow.document;
                    console.log(doc.documentElement.outerHTML);
                    showToast('Page source logged to console');
                } catch (e) {
                    showToast('Cannot view source due to cross-origin restrictions');
                }
            }
            break;
        case 'inspect':
            alert('Developer Tools:\nPress F12 to open browser DevTools');
            break;
    }
}

function handleKeyboardShortcuts(e) {
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        createNewTab('about:blank');
    }
    
    if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        if (currentTabId) closeTab(currentTabId);
    }
    
    if (e.ctrlKey && e.key === 'Shift' && e.key === 'T') {
        e.preventDefault();
        reopenClosedTab();
    }
    
    if (e.key === 'F5') {
        e.preventDefault();
        refresh();
    }
    
    if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateBack();
    }
    
    if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        navigateForward();
    }
    
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        addCurrentBookmark();
    }
    
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        toggleHistoryPanel();
    }
    
    if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        toggleDownloadsPanel();
    }
    
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        toggleFindPanel();
    }
    
    if (e.ctrlKey && e.key === 'Shift' && e.key === 'N') {
        e.preventDefault();
        createNewTab('about:blank', true);
    }
    
    if (e.ctrlKey && e.key === 'Shift' && e.key === 'O') {
        e.preventDefault();
        toggleBookmarksPanel();
    }
    
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
}

// =============================================
// Search System Functionality
// =============================================

// Search history
let searchHistory = JSON.parse(localStorage.getItem('browserSearchHistory') || '[]');
let selectedSuggestionIndex = -1;

// Initialize search system
function initializeSearchSystem() {
    setupSearchEventListeners();
}

// Setup search event listeners
function setupSearchEventListeners() {
    const addressInput = document.getElementById('address-input');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');

    if (!addressInput || !clearSearchBtn) return;

    // Address bar focus - show suggestions
    addressInput.addEventListener('focus', () => {
        showSearchSuggestions();
    });

    // Address bar blur - hide suggestions
    addressInput.addEventListener('blur', () => {
        setTimeout(() => {
            hideSearchSuggestions();
        }, 200);
    });

    // Address bar input
    addressInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        clearSearchBtn.style.display = value ? 'flex' : 'none';
        showSearchSuggestions();
    });

    // Address bar keyboard navigation
    addressInput.addEventListener('keydown', (e) => {
        const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedSuggestionIndex < suggestions.length - 1) {
                selectedSuggestionIndex++;
                updateSuggestionSelection(suggestions);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedSuggestionIndex > 0) {
                selectedSuggestionIndex--;
                updateSuggestionSelection(suggestions);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
                suggestions[selectedSuggestionIndex].click();
            } else {
                const url = addressInput.value.trim();
                if (url) {
                    performSearch(url);
                }
            }
        } else if (e.key === 'Escape') {
            hideSearchSuggestions();
            addressInput.blur();
        }
    });

    // Clear search button
    clearSearchBtn.addEventListener('click', () => {
        addressInput.value = '';
        clearSearchBtn.style.display = 'none';
        hideSearchSuggestions();
        addressInput.focus();
    });

    // Address bar submission
    addressInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const url = addressInput.value.trim();
            if (url) {
                performSearch(url);
            }
        }
    });
}

// Show search suggestions
function showSearchSuggestions() {
    const addressInput = document.getElementById('address-input');
    const searchSuggestions = document.getElementById('searchSuggestions');

    if (!addressInput || !searchSuggestions) return;

    const query = addressInput.value.trim();
    searchSuggestions.innerHTML = '';
    selectedSuggestionIndex = -1;

    // Show recent searches if query is empty
    if (!query) {
        if (searchHistory.length > 0) {
            const header = document.createElement('div');
            header.className = 'search-suggestions-header';
            header.textContent = 'Recent Searches';
            searchSuggestions.appendChild(header);

            searchHistory.slice(0, 5).forEach((item) => {
                const suggestion = createSuggestionItem(item, 'time-outline', true);
                suggestion.addEventListener('click', () => {
                    addressInput.value = item;
                    performSearch(item);
                });
                searchSuggestions.appendChild(suggestion);
            });

            searchSuggestions.classList.add('active');
        }
        return;
    }

    // Filter history based on query
    const filteredHistory = searchHistory.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (filteredHistory.length > 0) {
        const header = document.createElement('div');
        header.className = 'search-suggestions-header';
        header.textContent = 'Recent';
        searchSuggestions.appendChild(header);

        filteredHistory.forEach(item => {
            const suggestion = createSuggestionItem(item, 'time-outline', true);
            suggestion.addEventListener('click', () => {
                addressInput.value = item;
                performSearch(item);
            });
            searchSuggestions.appendChild(suggestion);
        });
    }

    // Add search suggestion
    const searchSuggestion = createSuggestionItem(`Search "${query}"`, 'search', false);
    searchSuggestion.addEventListener('click', () => {
        performSearch(query);
    });
    searchSuggestions.appendChild(searchSuggestion);

    searchSuggestions.classList.add('active');
}

// Create suggestion item
function createSuggestionItem(text, icon, isRecent) {
    const item = document.createElement('div');
    item.className = `suggestion-item ${isRecent ? 'recent' : ''}`;
    item.innerHTML = `
        <ion-icon name="${icon}"></ion-icon>
        <span>${text}</span>
    `;
    return item;
}

// Update suggestion selection
function updateSuggestionSelection(suggestions) {
    suggestions.forEach((s, index) => {
        s.classList.toggle('selected', index === selectedSuggestionIndex);
    });

    if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        document.getElementById('address-input').value = suggestions[selectedSuggestionIndex].querySelector('span').textContent;
    }
}

// Hide search suggestions
function hideSearchSuggestions() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (searchSuggestions) {
        searchSuggestions.classList.remove('active');
    }
}

// Add to search history
function addToSearchHistory(query) {
    searchHistory = searchHistory.filter(item => item !== query);
    searchHistory.unshift(query);
    searchHistory = searchHistory.slice(0, 20);
    localStorage.setItem('browserSearchHistory', JSON.stringify(searchHistory));
}

// Perform search
function performSearch(query) {
    hideSearchSuggestions();

    // Check if it's a URL
    if (isValidUrl(query)) {
        loadUrlInIframe(query);
        return;
    }

    // Add to history
    addToSearchHistory(query);

    // Show loading progress bar
    showLoadingProgressBar();

    // Use DuckDuckGo HTML for search results
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

    // Update address bar
    document.getElementById('address-input').value = query;

    // Show search results container
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchResultsContent = document.getElementById('searchResultsContent');
    const searchQueryTitle = document.getElementById('searchQueryTitle');

    if (searchResultsContainer && searchResultsContent) {
        searchResultsContainer.style.display = 'block';
        searchQueryTitle.textContent = `Search Results for "${query}"`;
        searchResultsContent.innerHTML = `
            <div class="loading-results">
                <div class="loading-spinner"></div>
                <p>Loading search results...</p>
            </div>
        `;
    }

    // Create temporary iframe to fetch search results
    const tempIframe = document.createElement('iframe');
    tempIframe.style.display = 'none';
    tempIframe.src = searchUrl;
    document.body.appendChild(tempIframe);

    tempIframe.onload = function() {
        hideLoadingProgressBar();
        try {
            const iframeDoc = tempIframe.contentDocument || tempIframe.contentWindow.document;
            const results = iframeDoc.querySelectorAll('.result');
            const abstract = iframeDoc.querySelector('.abstract');

            let html = '';

            // Add abstract if available
            if (abstract) {
                html += `
                    <div class="search-abstract-card">
                        <h3>${abstract.querySelector('h2')?.textContent || 'Search Results'}</h3>
                        <p>${abstract.textContent}</p>
                    </div>
                `;
            }

            // Add results
            if (results.length > 0) {
                results.forEach(result => {
                    const title = result.querySelector('.result__title') || result.querySelector('a');
                    const snippet = result.querySelector('.result__snippet');
                    const url = result.querySelector('a')?.href || '';

                    if (title && snippet) {
                        html += `
                            <div class="search-result-card">
                                <h3><a href="${url}" target="_blank">${title.textContent}</a></h3>
                                <p>${snippet.textContent}</p>
                                <span class="result-url">${url}</span>
                            </div>
                        `;
                    }
                });
            } else {
                html = `
                    <div class="no-results">
                        <h3>No results found</h3>
                        <p>Try different keywords or check your spelling</p>
                    </div>
                `;
            }

            searchResultsContent.innerHTML = html;
        } catch (e) {
            console.error('Error parsing search results:', e);
            searchResultsContent.innerHTML = `
                <div class="no-results">
                    <h3>Error loading results</h3>
                    <p>Please try again later</p>
                </div>
            `;
        }

        // Remove temporary iframe
        setTimeout(() => {
            document.body.removeChild(tempIframe);
        }, 1000);
    };

    tempIframe.onerror = function() {
        hideLoadingProgressBar();
        searchResultsContent.innerHTML = `
            <div class="no-results">
                <h3>Error loading results</h3>
                <p>Please try again later</p>
            </div>
        `;
        setTimeout(() => {
            document.body.removeChild(tempIframe);
        }, 1000);
    };

    // Timeout fallback
    setTimeout(() => {
        if (document.body.contains(tempIframe)) {
            hideLoadingProgressBar();
            document.body.removeChild(tempIframe);
            if (searchResultsContent.innerHTML.includes('Loading search results')) {
                searchResultsContent.innerHTML = `
                    <div class="no-results">
                        <h3>Search is currently unavailable</h3>
                        <p>Please try again later</p>
                    </div>
                `;
            }
        }
    }, 10000);
}

// Load URL in iframe
function loadUrlInIframe(url) {
    showLoadingProgressBar();

    // Hide search results container
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    if (searchResultsContainer) {
        searchResultsContainer.style.display = 'none';
    }

    // Update address bar
    document.getElementById('address-input').value = url;

    // Navigate using existing browser functionality
    navigateToUrl(url);

    setTimeout(() => {
        hideLoadingProgressBar();
    }, 1000);
}

// Show loading progress bar
function showLoadingProgressBar() {
    const progressBar = document.getElementById('loadingProgressBar');
    if (progressBar) {
        progressBar.classList.add('active');
    }
}

// Hide loading progress bar
function hideLoadingProgressBar() {
    const progressBar = document.getElementById('loadingProgressBar');
    if (progressBar) {
        progressBar.classList.remove('active');
        progressBar.style.width = '0%';
    }
}

// Validate URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Initialize search system on load
document.addEventListener('DOMContentLoaded', () => {
    initializeSearchSystem();
});
