// Gaming mode browser functionality
let currentGameUrl = '';
let isFullscreen = false;
let isHiddenControls = false;
let performanceInterval = null;
let lastTimestamp = 0;
let frameCount = 0;
let currentFPS = 60;
let particles = [];

// DOM elements
const gamingTopBar = document.getElementById('gamingTopBar');
const gamingAddressBar = document.getElementById('gamingAddressBar');
const gamingIframe = document.getElementById('gamingIframe');
const gamingOverlay = document.getElementById('gamingOverlay');
const gamingContentArea = document.getElementById('gamingContentArea');
const gamingBackBtn = document.getElementById('gamingBackBtn');
const gamingForwardBtn = document.getElementById('gamingForwardBtn');
const gamingRefreshBtn = document.getElementById('gamingRefreshBtn');
const gamingHomeBtn = document.getElementById('gamingHomeBtn');
const gamingFullscreenBtn = document.getElementById('gamingFullscreenBtn');
const gamingSettingsBtn = document.getElementById('gamingSettingsBtn');
const gamingGameItems = document.querySelectorAll('.gaming-game-item');
const fpsValue = document.getElementById('fpsValue');
const latencyValue = document.getElementById('latencyValue');
const memoryValue = document.getElementById('memoryValue');
const gamingPerformancePanel = document.getElementById('gamingPerformancePanel');
const particlesContainer = document.getElementById('particles');
const gamingSearchResults = document.getElementById('gamingSearchResults');
const searchResultsContent = document.getElementById('searchResultsContent');
const searchQueryTitle = document.getElementById('searchQueryTitle');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');
const gamingProgressBar = document.getElementById('gamingProgressBar');
const gamingMiniGame = document.getElementById('gamingMiniGame');
const gameCanvas = document.getElementById('gameCanvas');
const gameScore = document.getElementById('gameScore');
const gameLevel = document.getElementById('gameLevel');
const gameTime = document.getElementById('gameTime');
const gameMessage = document.getElementById('gameMessage');
const startGameBtn = document.getElementById('startGameBtn');
const playMiniGameBtn = document.getElementById('playMiniGameBtn');
const overlaySearchInput = document.getElementById('overlaySearchInput');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const gamesPlayedDisplay = document.getElementById('gamesPlayedDisplay');
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnUp = document.getElementById('btnUp');
const btnDown = document.getElementById('btnDown');

// Search history
let searchHistory = JSON.parse(localStorage.getItem('gamingSearchHistory') || '[]');
let selectedSuggestionIndex = -1;

// Game stats
let gameStats = JSON.parse(localStorage.getItem('gamingStats') || '{"highScore": 0, "gamesPlayed": 0}');

// Game variables
let gameRunning = false;
let score = 0;
let level = 1;
let timeElapsed = 0;
let gameInterval = null;
let timeInterval = null;
let player = { x: 100, y: 100, size: 20, speed: 5 };
let point = { x: 200, y: 200, size: 12 };
let canvas, ctx;

// Initialize gaming mode
function initializeGamingMode() {
    setupEventListeners();
    setupPerformanceMonitoring();
    setupKeyboardShortcuts();
    createParticles();
    initGame();
    updateStatsDisplay();

    // Check if a game URL was passed via URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const gameUrl = urlParams.get('game');
    if (gameUrl) {
        loadGame(gameUrl);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons
    gamingBackBtn.addEventListener('click', () => {
        if (gamingIframe.contentWindow) {
            try {
                gamingIframe.contentWindow.history.back();
            } catch (e) {
                console.log("Cannot navigate back due to cross-origin restrictions");
            }
        }
    });

    gamingForwardBtn.addEventListener('click', () => {
        if (gamingIframe.contentWindow) {
            try {
                gamingIframe.contentWindow.history.forward();
            } catch (e) {
                console.log("Cannot navigate forward due to cross-origin restrictions");
            }
        }
    });
    gamingRefreshBtn.addEventListener('click',()=>{
        location.reload();
    })
    gamingRefreshBtn.addEventListener('click', () => {
        if (currentGameUrl) {
            loadGame(currentGameUrl);
        }
    });

    // Home button - return to mini game
    gamingHomeBtn.addEventListener('click', () => {
        stopGame();
        showMiniGame();
    });

    // Address bar - show progress bar on focus
    gamingAddressBar.addEventListener('focus', () => {
        showSearchSuggestions();
    });

    gamingAddressBar.addEventListener('blur', () => {
        // Delay to allow clicking on suggestions
        setTimeout(() => {
            hideSearchSuggestions();
        }, 200);
    });

    // Address bar input - show suggestions while typing
    gamingAddressBar.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        
        // Show/hide clear button
        clearSearchBtn.style.display = value ? 'flex' : 'none';
        
        // Show suggestions
        showSearchSuggestions();
    });

    // Address bar - handle keyboard navigation
    gamingAddressBar.addEventListener('keydown', (e) => {
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
                const url = gamingAddressBar.value.trim();
                if (url) {
                    loadGame(url);
                }
            }
        } else if (e.key === 'Escape') {
            hideSearchSuggestions();
            gamingAddressBar.blur();
        }
    });

    // Clear search button
    clearSearchBtn.addEventListener('click', () => {
        gamingAddressBar.value = '';
        clearSearchBtn.style.display = 'none';
        hideSearchSuggestions();
        gamingAddressBar.focus();
    });

    // Address bar submission
    gamingAddressBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const url = gamingAddressBar.value.trim();
            if (url) {
                loadGame(url);
            }
        }
    });
    
    // Fullscreen toggle
    gamingFullscreenBtn.addEventListener('click',toggleFullscreen);
    
    // Settings button
    gamingSettingsBtn.addEventListener('click', toggleSettings);
    
    // Play Mini Game button
    playMiniGameBtn.addEventListener('click', () => {
        gamingOverlay.classList.add('hidden');
        showMiniGame();
    });
    
    // Overlay search input
    overlaySearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const value = overlaySearchInput.value.trim();
            if (value) {
                gamingOverlay.classList.add('hidden');
                loadGame(value);
            }
        }
    });
    
    // Game item selection - show mini game for now
    gamingGameItems.forEach(item => {
        item.addEventListener('click', () => {
            showMiniGame();
        });
    });
    
    // Auto-hide controls when mouse is idle
    let mouseMoveTimer;
    document.addEventListener('mousemove', () => {
        gamingTopBar.style.opacity = '1';
        clearTimeout(mouseMoveTimer);
        
        mouseMoveTimer = setTimeout(() => {
            if (!isFullscreen) {
                gamingTopBar.style.opacity = '0.7';
            }
        }, 3000);
    });
    
    // Click on content area to hide/show controls in fullscreen
    gamingContentArea.addEventListener('click', () => {
        if (isFullscreen) {
            toggleControlsVisibility();
        }
    });
}

// Set up keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // F11 - Toggle fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
        
        // Ctrl+R - Reload
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (currentGameUrl) {
                loadGame(currentGameUrl);
            }
        }
        
        // Ctrl+H - Toggle controls visibility
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            toggleControlsVisibility();
        }
        
        // Escape - Exit fullscreen
        if (e.key === 'Escape' && isFullscreen) {
            toggleFullscreen();
        }
        
        // F12 - Toggle performance panel
        if (e.key === 'F12') {
            e.preventDefault();
            gamingPerformancePanel.style.display = 
                gamingPerformancePanel.style.display === 'none' ? 'block' : 'none';
        }
    });
}

// Create animated particles
function createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Apply styles
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
        particles.push({
            element: particle,
            x: posX,
            y: posY,
            size: size,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
}

// Animate particles
function animateParticles() {
    particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.y > window.innerHeight) particle.y = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        
        particle.element.style.left = `${particle.x}px`;
        particle.element.style.top = `${particle.y}px`;
    });
    
    requestAnimationFrame(animateParticles);
}

// Set up performance monitoring
function setupPerformanceMonitoring() {
    performanceInterval = setInterval(updatePerformanceMetrics, 1000);
    
    // FPS calculation
    function measureFPS(timestamp) {
        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
            frameCount = 0;
        }
        
        frameCount++;
        const delta = timestamp - lastTimestamp;
        
        if (delta >= 1000) {
            currentFPS = Math.round((frameCount * 1000) / delta);
            frameCount = 0;
            lastTimestamp = timestamp;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
    requestAnimationFrame(animateParticles);
}

// Update performance metrics display
function updatePerformanceMetrics() {
    // Update FPS
    fpsValue.textContent = currentFPS;
    
    // Update latency (simulated)
    const simulatedLatency = Math.floor(Math.random() * 20) + 10;
    latencyValue.textContent = `${simulatedLatency}ms`;
    
    // Update memory usage (simulated)
    const simulatedMemory = Math.floor(Math.random() * 500) + 100;
    memoryValue.textContent = `${simulatedMemory}MB`;
}

// Load a game in the iframe
async function loadGame(url) {
    // Hide search suggestions
    hideSearchSuggestions();
    
    // Validate URL
    if (!isValidUrl(url)) {
        // If not a valid URL, treat as search term
        performGamingSearch(url);
        return;
    }
    
    // Show progress bar
    showProgressBar();

    // Check if URL is from a site that blocks iframes
    const iframeBlockedSites = ['google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'];
    const isBlockedSite = iframeBlockedSites.some(site => url.includes(site));

    if (isBlockedSite) {
        // If site blocks iframes, open in new tab instead
        alert(`This site (${new URL(url).hostname}) does not allow embedding. Opening in new tab...`);
        window.open(url, '_blank');
        hideProgressBar();
        return;
    }

    // Show loading state with enhanced animations
    gamingOverlay.classList.remove('hidden');
    gamingOverlay.innerHTML = `
        <h2>LOADING GAME...</h2>
        <p>Connecting to ${url}</p>
        <div class="gaming-pulse" style="width: 50px; height: 50px; border: 3px solid #4fc3f7; border-top: 3px solid transparent; border-radius: 50%; margin: 20px auto;"></div>
        <div class="loading-progress" style="width: 200px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 20px; overflow: hidden;">
            <div class="progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #4fc3f7, #29b6f6); border-radius: 2px; animation: progressAnimation 2s infinite;"></div>
        </div>
    `;

    // Add progress animation
    const progressBar = gamingOverlay.querySelector('.progress-bar');
    let width = 0;
    const progressInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressInterval);
        } else {
            width += 1;
            progressBar.style.width = width + '%';
        }
    }, 50);

    // Set the iframe source
    gamingIframe.src = url;
    currentGameUrl = url;
    gamingAddressBar.value = url;

    // Show iframe once loaded with entrance animation
    gamingIframe.onload = function() {
        clearInterval(progressInterval);
        hideProgressBar();

        // Add fade-out effect to overlay
        gamingOverlay.style.transition = 'opacity 0.5s ease';
        gamingOverlay.style.opacity = '0';

        setTimeout(() => {
            gamingOverlay.classList.add('hidden');
            gamingOverlay.style.opacity = '1';
            gamingOverlay.innerHTML = '';

            // Show iframe with entrance animation
            gamingIframe.style.display = 'block';
            gamingIframe.style.opacity = '0';
            gamingIframe.style.transform = 'scale(0.95)';

            // Animate iframe entrance
            setTimeout(() => {
                gamingIframe.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                gamingIframe.style.opacity = '1';
                gamingIframe.style.transform = 'scale(1)';
            }, 10);

            // Focus the iframe to enable keyboard controls
            gamingIframe.focus();
        }, 300);
    };

    gamingIframe.onerror = function() {
        clearInterval(progressInterval);
        hideProgressBar();
        gamingOverlay.innerHTML = `
            <h2>GAME LOADING ERROR</h2>
            <p>Could not load ${url}</p>
            <button onclick="loadGame('${currentGameUrl}')">Retry</button>
        `;
    };
}

// Perform search using iframe (no API needed)
function performGamingSearch(query) {
    // Use DuckDuckGo HTML version for search results
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    // Add to search history
    addToSearchHistory(query);
    
    // Update address bar
    gamingAddressBar.value = query;

    // Show loading progress bar
    showProgressBar();

    // Show loading overlay with animation
    gamingSearchResults.style.display = 'none';
    gamingIframe.style.display = 'none';
    gamingOverlay.classList.remove('hidden');
    gamingOverlay.innerHTML = `
        <h2>SEARCHING...</h2>
        <p>Searching for: "${query}"</p>
        <div class="gaming-pulse" style="width: 60px; height: 60px; border: 4px solid #4fc3f7; border-top: 4px solid transparent; border-radius: 50%; margin: 25px auto; animation: spin 1s linear infinite;"></div>
        <p style="color: #888; font-size: 14px; margin-top: 15px;">Loading search results...</p>
    `;

    // Load search in iframe
    gamingIframe.src = searchUrl;
    currentGameUrl = searchUrl;

    // Hide overlay when iframe loads
    gamingIframe.onload = function() {
        hideProgressBar();
        setTimeout(() => {
            gamingOverlay.classList.add('hidden');
            gamingOverlay.innerHTML = '';
            gamingIframe.style.display = 'block';
            gamingIframe.style.opacity = '1';
        }, 800);
    };

    // Fallback: hide overlay after 3 seconds even if iframe didn't load
    setTimeout(() => {
        if (gamingOverlay.classList.contains('gaming-overlay') && !gamingOverlay.classList.contains('hidden')) {
            hideProgressBar();
            gamingOverlay.classList.add('hidden');
            gamingIframe.style.display = 'block';
        }
    }, 3000);
}

// Show progress bar
function showProgressBar() {
    gamingProgressBar.classList.add('active');
}

// Hide progress bar
function hideProgressBar() {
    gamingProgressBar.classList.remove('active');
    gamingProgressBar.style.width = '0%';
}

// Show search suggestions
function showSearchSuggestions() {
    const query = gamingAddressBar.value.trim();
    searchSuggestions.innerHTML = '';
    selectedSuggestionIndex = -1;
    
    // Show recent searches if query is empty
    if (!query) {
        if (searchHistory.length > 0) {
            const header = document.createElement('div');
            header.className = 'search-suggestions-header';
            header.textContent = 'Recent Searches';
            searchSuggestions.appendChild(header);
            
            searchHistory.slice(0, 5).forEach((item, index) => {
                const suggestion = createSuggestionItem(item, 'time-outline', true);
                suggestion.addEventListener('click', () => {
                    gamingAddressBar.value = item;
                    loadGame(item);
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
                gamingAddressBar.value = item;
                loadGame(item);
            });
            searchSuggestions.appendChild(suggestion);
        });
    }
    
    // Add search suggestion
    const searchSuggestion = createSuggestionItem(`Search "${query}"`, 'search', false);
    searchSuggestion.addEventListener('click', () => {
        loadGame(query);
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

// Update suggestion selection (keyboard navigation)
function updateSuggestionSelection(suggestions) {
    suggestions.forEach((s, index) => {
        s.classList.toggle('selected', index === selectedSuggestionIndex);
    });
    
    if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        gamingAddressBar.value = suggestions[selectedSuggestionIndex].querySelector('span').textContent;
    }
}

// Hide search suggestions
function hideSearchSuggestions() {
    searchSuggestions.classList.remove('active');
}

// Add to search history
function addToSearchHistory(query) {
    // Remove if already exists
    searchHistory = searchHistory.filter(item => item !== query);
    
    // Add to beginning
    searchHistory.unshift(query);
    
    // Keep only last 20 searches
    searchHistory = searchHistory.slice(0, 20);
    
    // Save to localStorage
    localStorage.setItem('gamingSearchHistory', JSON.stringify(searchHistory));
}

// Validate URL format
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    if (!isFullscreen) {
        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
        
        isFullscreen = true;
        gamingFullscreenBtn.innerHTML = '<ion-icon name="contract"></ion-icon>';
        gamingTopBar.style.opacity = '0.7';
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
        
        isFullscreen = false;
        gamingFullscreenBtn.innerHTML = '<ion-icon name="expand"></ion-icon>';
        gamingTopBar.style.opacity = '1';
    }
}

// Toggle controls visibility
function toggleControlsVisibility() {
    if (isHiddenControls) {
        gamingTopBar.style.opacity = '1';
        isHiddenControls = false;
    } else {
        gamingTopBar.style.opacity = '0';
        isHiddenControls = true;
    }
}

// Toggle settings panel
function toggleSettings() {
    // For now, just show an alert - in a full implementation this would open a settings panel
    alert('Gaming mode settings panel would open here');
}

// Add visual feedback for button clicks
function addButtonRippleEffect(button) {
    button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Position the ripple at the click location
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size/2;
        const y = e.clientY - rect.top - size/2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Add ripple to button
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effects to gaming buttons
function addRippleEffects() {
    const buttons = [
        gamingBackBtn, gamingForwardBtn, gamingRefreshBtn,
        gamingFullscreenBtn, gamingSettingsBtn
    ];
    
    buttons.forEach(button => {
        // Add ripple effect styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .gaming-nav-button .ripple, .gaming-overlay button .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        addButtonRippleEffect(button);
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeGamingMode();
    addRippleEffects();
});

// Listen for fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    isFullscreen = !!document.fullscreenElement ||
                   !!document.mozFullScreenElement ||
                   !!document.webkitFullscreenElement ||
                   !!document.msFullscreenElement;

    if (isFullscreen) {
        gamingFullscreenBtn.innerHTML = '<ion-icon name="contract"></ion-icon>';
        gamingTopBar.style.opacity = '0.7';
    } else {
        gamingFullscreenBtn.innerHTML = '<ion-icon name="expand"></ion-icon>';
        gamingTopBar.style.opacity = '1';
    }
}

// ==================== GAME FUNCTIONS ====================

// Initialize the game
function initGame() {
    canvas = gameCanvas;
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    
    // Don't show mini game by default - show overlay first
    gamingMiniGame.style.display = 'none';
}

// Resize canvas to fit screen
function resizeCanvas() {
    const maxWidth = Math.min(600, window.innerWidth - 100);
    const maxHeight = Math.min(400, window.innerHeight - 300);
    canvas.width = maxWidth;
    canvas.height = maxHeight;
}

// Show mini game
function showMiniGame() {
    gamingIframe.style.display = 'none';
    gamingSearchResults.style.display = 'none';
    gamingOverlay.classList.add('hidden');

    // Show and animate mini game
    gamingMiniGame.style.display = 'flex';

    // Trigger reflow for animation
    setTimeout(() => {
        gamingMiniGame.classList.add('visible');
    }, 10);

    gameMessage.classList.remove('hidden');
    stopGame();
}

// Start the game
function startGame() {
    gameRunning = true;
    score = 0;
    level = 1;
    timeElapsed = 0;
    player.speed = 5;
    player.x = canvas.width / 2 - player.size / 2;
    player.y = canvas.height / 2 - player.size / 2;
    
    // Increment games played
    saveGameStats();
    
    updateGameStats();
    spawnPoint();
    
    // Hide message with fade out
    gameMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    gameMessage.style.opacity = '0';
    gameMessage.style.transform = 'translate(-50%, -50%) scale(0.8)';
    
    setTimeout(() => {
        gameMessage.classList.add('hidden');
        gameMessage.style.opacity = '1';
        gameMessage.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 300);
    
    // Game start animation
    canvas.style.transition = 'transform 0.5s ease';
    canvas.style.transform = 'scale(0.9)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 50);
    
    // Start game loop
    gameInterval = requestAnimationFrame(gameLoop);
    
    // Start timer
    timeInterval = setInterval(() => {
        timeElapsed++;
        gameTime.textContent = timeElapsed + 's';
    }, 1000);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    render();
    
    gameInterval = requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Check collision with point
    if (checkCollision(player, point)) {
        score += 10;
        
        // Level up every 50 points
        if (score % 50 === 0) {
            level++;
            player.speed += 1;
        }
        
        updateGameStats();
        spawnPoint();
    }
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(79, 195, 247, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Draw point
    ctx.fillStyle = '#4fc3f7';
    ctx.shadowColor = '#4fc3f7';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(point.x + point.size/2, point.y + point.size/2, point.size/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw player
    ctx.fillStyle = '#29b6f6';
    ctx.shadowColor = '#29b6f6';
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.shadowBlur = 0;
}

// Check collision between player and point
function checkCollision(p1, p2) {
    return p1.x < p2.x + p2.size &&
           p1.x + p1.size > p2.x &&
           p1.y < p2.y + p2.size &&
           p1.y + p1.size > p2.y;
}

// Spawn point at random position
function spawnPoint() {
    point.x = Math.random() * (canvas.width - point.size);
    point.y = Math.random() * (canvas.height - point.size);
}

// Update game stats display
function updateGameStats() {
    gameScore.textContent = score;
    gameLevel.textContent = level;
    
    // Update high score
    if (score > gameStats.highScore) {
        gameStats.highScore = score;
        localStorage.setItem('gamingStats', JSON.stringify(gameStats));
        updateStatsDisplay();
    }
}

// Update stats display on overlay
function updateStatsDisplay() {
    highScoreDisplay.textContent = gameStats.highScore;
    gamesPlayedDisplay.textContent = gameStats.gamesPlayed;
}

// Save game stats
function saveGameStats() {
    gameStats.gamesPlayed++;
    localStorage.setItem('gamingStats', JSON.stringify(gameStats));
    updateStatsDisplay();
}

// Stop game
function stopGame() {
    gameRunning = false;
    cancelAnimationFrame(gameInterval);
    clearInterval(timeInterval);
}

// Move player
function movePlayer(dx, dy) {
    if (!gameRunning) return;
    
    player.x += dx;
    player.y += dy;
    
    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;
}

// Game event listeners
startGameBtn.addEventListener('click', startGame);

btnLeft.addEventListener('click', () => movePlayer(-player.speed * 2, 0));
btnRight.addEventListener('click', () => movePlayer(player.speed * 2, 0));
btnUp.addEventListener('click', () => movePlayer(0, -player.speed * 2));
btnDown.addEventListener('click', () => movePlayer(0, player.speed * 2));

// Keyboard controls for game
document.addEventListener('keydown', (e) => {
    if (gamingMiniGame.style.display !== 'none') {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
                movePlayer(-player.speed * 2, 0);
                break;
            case 'ArrowRight':
            case 'd':
                movePlayer(player.speed * 2, 0);
                break;
            case 'ArrowUp':
            case 'w':
                movePlayer(0, -player.speed * 2);
                break;
            case 'ArrowDown':
            case 's':
                movePlayer(0, player.speed * 2);
                break;
        }
    }
});