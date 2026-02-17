// Beautiful Monaco-Style Code Editor JavaScript

// Define custom themes
const customThemes = {
    'beautify-dark': {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#1e1e2e',
            'editor.foreground': '#cdd6f4',
            'editor.lineHighlightBackground': '#313244',
            'editor.selectionBackground': '#585b70',
            'editorCursor.foreground': '#f5e0dc',
            'editorWhitespace.foreground': '#45475a',
            'editorLineNumber.foreground': '#7f849c',
            'editorActiveLineNumber.foreground': '#cdd6f4',
            'sideBar.background': '#181825',
            'activityBar.background': '#11111b',
            'statusBar.background': '#11111b',
            'tab.inactiveBackground': '#181825',
            'tab.activeBackground': '#1e1e2e',
            'titleBar.activeBackground': '#11111b',
            'titleBar.inactiveBackground': '#11111b',
            'button.background': '#cba6f7',
            'button.hoverBackground': '#f5c2e7',
            'dropdown.background': '#181825',
            'input.background': '#181825',
            'panel.background': '#181825',
            'terminal.ansiBlack': '#45475a',
            'terminal.ansiBlue': '#89b4fa',
            'terminal.ansiCyan': '#94e2d5',
            'terminal.ansiGreen': '#a6e3a1',
            'terminal.ansiMagenta': '#f5c2e7',
            'terminal.ansiRed': '#f38ba8',
            'terminal.ansiWhite': '#bac2de',
            'terminal.ansiYellow': '#f9e2af',
            'terminal.ansiBrightBlack': '#585b70',
            'terminal.ansiBrightBlue': '#89b4fa',
            'terminal.ansiBrightCyan': '#94e2d5',
            'terminal.ansiBrightGreen': '#a6e3a1',
            'terminal.ansiBrightMagenta': '#f5c2e7',
            'terminal.ansiBrightRed': '#f38ba8',
            'terminal.ansiBrightWhite': '#a6adc8',
            'terminal.ansiBrightYellow': '#f9e2af',
        }
    },
    'beautify-light': {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#eff1f5',
            'editor.foreground': '#4c4f69',
            'editor.lineHighlightBackground': '#ccd0da',
            'editor.selectionBackground': '#bcc0cc',
            'editorCursor.foreground': '#dc8a78',
            'editorWhitespace.foreground': '#9ca0b0',
            'editorLineNumber.foreground': '#8c8fa1',
            'editorActiveLineNumber.foreground': '#4c4f69',
            'sideBar.background': '#e6e9ef',
            'activityBar.background': '#dce0e8',
            'statusBar.background': '#dce0e8',
            'tab.inactiveBackground': '#e6e9ef',
            'tab.activeBackground': '#eff1f5',
            'titleBar.activeBackground': '#dce0e8',
            'titleBar.inactiveBackground': '#dce0e8',
            'button.background': '#8839ef',
            'button.hoverBackground': '#ea76cb',
            'dropdown.background': '#e6e9ef',
            'input.background': '#e6e9ef',
            'panel.background': '#e6e9ef',
        }
    }
};

// Initialize the editor once the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Register custom themes after Monaco is loaded
    registerCustomThemes();
    
    // Initialize the editor
    let editor;
    
    require(['vs/editor/editor.main'], function() {
        // Create the editor instance
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: [
                '<!DOCTYPE html>',
                '<html>',
                '<head>',
                '    <title>My Beautiful Editor</title>',
                '    <style>',
                '        body {',
                '            font-family: Arial, sans-serif;',
                '            margin: 0;',
                '            padding: 20px;',
                '            background-color: #f5f5f5;',
                '        }',
                '    </style>',
                '</head>',
                '<body>',
                '    <h1>Welcome to the Beautiful Code Editor</h1>',
                '    <p>This is a Monaco-style editor with enhanced aesthetics.</p>',
                '</body>',
                '</html>'
            ].join('\n'),
            language: 'html',
            theme: 'beautify-dark',
            fontSize: 14,
            minimap: { enabled: true },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            roundedSelection: true,
            scrollbar: {
                vertical: 'auto',
                horizontal: 'auto'
            },
            suggest: {
                showKeywords: true,
                showSnippets: true,
                showClasses: true,
                showFunctions: true
            },
            parameterHints: {
                enabled: true
            },
            quickSuggestions: {
                other: true,
                comments: false,
                strings: true
            },
            autoClosingBrackets: 'always',
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true
        });
        
        // Set up event listeners for the editor
        setupEventListeners(editor);
        
        // Expose editor globally for debugging purposes
        window.editor = editor;
    });
});

function registerCustomThemes() {
    // Wait for Monaco to be available before registering themes
    if (typeof monaco !== 'undefined' && monaco.editor) {
        // Register the custom themes with Monaco
        Object.entries(customThemes).forEach(([themeName, themeData]) => {
            monaco.editor.defineTheme(themeName, themeData);
        });
        
        // Update theme selector with custom themes
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            const beautifyDarkOption = document.createElement('option');
            beautifyDarkOption.value = 'beautify-dark';
            beautifyDarkOption.textContent = 'Beautify Dark';
            themeSelect.appendChild(beautifyDarkOption);
            
            const beautifyLightOption = document.createElement('option');
            beautifyLightOption.value = 'beautify-light';
            beautifyLightOption.textContent = 'Beautify Light';
            themeSelect.appendChild(beautifyLightOption);
        }
    } else {
        // If Monaco isn't loaded yet, try again after a short delay
        setTimeout(registerCustomThemes, 100);
    }
}


function setupEventListeners(editor) {
    // Language selection
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', function() {
        const language = this.value;
        const model = editor.getModel();
        monaco.editor.setModelLanguage(model, language);
        
        // Update language indicator
        document.getElementById('language-indicator').textContent = 
            language.charAt(0).toUpperCase() + language.slice(1);
    });
    
    // Theme selection
    const themeSelect = document.getElementById('theme-select');
    themeSelect.addEventListener('change', function() {
        const theme = this.value;
        monaco.editor.setTheme(theme);
    });
    
    // Update cursor position in status bar
    editor.onDidChangeCursorPosition(function(e) {
        const position = editor.getPosition();
        document.getElementById('position-indicator').textContent = 
            `Ln ${position.lineNumber}, Col ${position.column}`;
        
        // Update selection info
        const selection = editor.getSelection();
        if (selection) {
            const selectedText = editor.getModel().getValueInRange(selection);
            const selectedLines = selectedText.split('\n').length;
            document.getElementById('selection-indicator').textContent = 
                `${selectedText.length} chars, ${selectedLines} lines`;
        }
    });
    
    // Update word count in status bar
    editor.onDidChangeModelContent(debounce(function() {
        const model = editor.getModel();
        const content = model.getValue();
        const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
        const lines = model.getLineCount();
        
        document.getElementById('stats-indicator').textContent = 
            `${words} words, ${lines} lines`;
        
        // Update indentation info
        const opts = editor.getOption(monaco.editor.EditorOption.tabSize);
        const insertSpaces = editor.getOption(monaco.editor.EditorOption.insertSpaces);
        document.getElementById('indentation-indicator').textContent = 
            `${insertSpaces ? 'Spaces' : 'Tabs'}: ${opts}`;
    }, 500));
    
    // Update selection change events
    editor.onDidChangeCursorSelection(function(e) {
        const selection = editor.getSelection();
        if (selection) {
            const selectedText = editor.getModel().getValueInRange(selection);
            const selectedLines = selectedText.split('\n').length;
            document.getElementById('selection-indicator').textContent = 
                `${selectedText.length} chars, ${selectedLines} lines`;
        }
    });
    
    // File tree interactions
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            fileItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update tab title
            const fileName = this.querySelector('.file-icon').nextSibling.textContent.trim();
            document.querySelector('.tab-title').textContent = fileName;
            
            // Change editor content based on file type
            const fileExtension = getFileExtension(fileName);
            updateEditorContent(editor, fileExtension);
        });
    });
    
    // Tab close button
    const tabCloseBtn = document.querySelector('.tab-close');
    tabCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // In a real implementation, this would close the tab
        alert('Tab closed functionality would go here');
    });
    
    // New file button
    document.getElementById('new-file-btn').addEventListener('click', function() {
        // Clear the editor content
        editor.setValue('');
        
        // Reset the tab title to "untitled"
        document.querySelector('.tab-title').textContent = 'untitled';
        
        // Reset language to default (plaintext)
        monaco.editor.setModelLanguage(editor.getModel(), 'plaintext');
        document.getElementById('language-select').value = 'plaintext';
        document.getElementById('language-indicator').textContent = 'Plaintext';
    });
    
    // Open file button
    document.getElementById('open-file-btn').addEventListener('click', function() {
        document.getElementById('file-input').click();
    });
    
    // Open folder button (using File System Access API)
    document.getElementById('open-folder-btn').addEventListener('click', async function() {
        if ('showDirectoryPicker' in window) {
            try {
                const dirHandle = await window.showDirectoryPicker();
                await loadFolderContents(dirHandle);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error selecting folder:', err);
                    alert('Error accessing folder. Please make sure you are using a compatible browser (Chrome 86+, Edge 86+, Opera 72+)');
                }
            }
        } else {
            // Fallback for browsers that don't support the File System Access API
            alert('Your browser does not support folder access. Please use Chrome 86+, Edge 86+, or Opera 72+ for folder access.');
        }
    });
    
    // Handle file input change
    document.getElementById('file-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            openFileFromInput(file);
        }
        // Reset the input so the same file can be selected again
        this.value = '';
    });
    
    // Save button
    document.getElementById('save-btn').addEventListener('click', function() {
        saveCurrentFile(editor);
    });
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
        // Save functionality
        alert('Ctrl+S pressed - Save functionality would go here');
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, function() {
        // Find functionality
        editor.getAction('actions.find').run();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, function() {
        // Format document
        editor.getAction('editor.action.formatDocument').run();
    });
    
    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
        loadCurrentSettings(editor);
    });
    
    closeSettings.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Settings form elements
    setupSettingsForm(editor);
}

function getFileExtension(fileName) {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

function updateEditorContent(editor, extension) {
    let content = '';
    let language = 'plaintext';

    switch(extension) {
        case 'html':
            content = [
                '<!DOCTYPE html>',
                '<html>',
                '<head>',
                '    <title>New HTML File</title>',
                '    <meta charset="UTF-8">',
                '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '    <style>',
                '        body {',
                '            font-family: Arial, sans-serif;',
                '            margin: 0;',
                '            padding: 20px;',
                '            background-color: #f5f5f5;',
                '        }',
                '        .container {',
                '            max-width: 800px;',
                '            margin: 0 auto;',
                '            background: white;',
                '            padding: 20px;',
                '            border-radius: 8px;',
                '            box-shadow: 0 2px 10px rgba(0,0,0,0.1);',
                '        }',
                '    </style>',
                '</head>',
                '<body>',
                '    <div class="container">',
                '        <h1>Hello World</h1>',
                '        <p>This is a sample HTML file.</p>',
                '    </div>',
                '</body>',
                '</html>'
            ].join('\n');
            language = 'html';
            break;
        case 'js':
            content = [
                '// New JavaScript file',
                'function helloWorld() {',
                '    console.log("Hello, world!");',
                '}',
                '',
                'class Calculator {',
                '    constructor() {',
                '        this.result = 0;',
                '    }',
                '',
                '    add(num) {',
                '        this.result += num;',
                '        return this;',
                '    }',
                '',
                '    subtract(num) {',
                '        this.result -= num;',
                '        return this;',
                '    }',
                '',
                '    getResult() {',
                '        return this.result;',
                '    }',
                '}',
                '',
                'helloWorld();',
                '',
                '// Example usage of calculator',
                'const calc = new Calculator();',
                'console.log(calc.add(5).subtract(2).getResult()); // Output: 3'
            ].join('\n');
            language = 'javascript';
            break;
        case 'css':
            content = [
                '/* New CSS file */',
                'body {',
                '    margin: 0;',
                '    padding: 20px;',
                '    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;',
                '    background-color: #f8f9fa;',
                '    color: #333;',
                '}',
                '',
                '.container {',
                '    max-width: 1200px;',
                '    margin: 0 auto;',
                '    padding: 20px;',
                '}',
                '',
                '.card {',
                '    background: white;',
                '    border-radius: 8px;',
                '    box-shadow: 0 2px 10px rgba(0,0,0,0.05);',
                '    padding: 20px;',
                '    margin-bottom: 20px;',
                '}',
                '',
                'h1, h2, h3 {',
                '    color: #2c3e50;',
                '    margin-top: 0;',
                '}',
                '',
                '.btn {',
                '    display: inline-block;',
                '    padding: 8px 16px;',
                '    background-color: #3498db;',
                '    color: white;',
                '    text-decoration: none;',
                '    border-radius: 4px;',
                '    border: none;',
                '    cursor: pointer;',
                '    font-size: 14px;',
                '}',
                '',
                '.btn:hover {',
                '    background-color: #2980b9;',
                '}'
            ].join('\n');
            language = 'css';
            break;
        case 'py':
            content = [
                '# New Python file',
                'import math',
                '',
                'def hello_world():',
                '    print("Hello, world!")',
                '',
                'class Calculator:',
                '    def __init__(self):',
                '        self.result = 0',
                '',
                '    def add(self, num):',
                '        self.result += num',
                '        return self',
                '',
                '    def subtract(self, num):',
                '        self.result -= num',
                '        return self',
                '',
                '    def get_result(self):',
                '        return self.result',
                '',
                'if __name__ == "__main__":',
                '    hello_world()',
                '',
                '    # Example usage of calculator',
                '    calc = Calculator()',
                '    result = calc.add(5).subtract(2).get_result()',
                '    print(f"Result: {result}")  # Output: 3'
            ].join('\n');
            language = 'python';
            break;
        case 'java':
            content = [
                '// New Java file',
                'public class HelloWorld {',
                '    public static void main(String[] args) {',
                '        System.out.println("Hello, World!");',
                '        Calculator calc = new Calculator();',
                '        int result = calc.add(5).subtract(2).getResult();',
                '        System.out.println("Result: " + result); // Output: 3',
                '    }',
                '}',
                '',
                'class Calculator {',
                '    private int result;',
                '',
                '    public Calculator() {',
                '        this.result = 0;',
                '    }',
                '',
                '    public Calculator add(int num) {',
                '        this.result += num;',
                '        return this;',
                '    }',
                '',
                '    public Calculator subtract(int num) {',
                '        this.result -= num;',
                '        return this;',
                '    }',
                '',
                '    public int getResult() {',
                '        return this.result;',
                '    }',
                '}'
            ].join('\n');
            language = 'java';
            break;
        case 'cpp':
            content = [
                '// New C++ file',
                '#include <iostream>',
                '#include <string>',
                '',
                'using namespace std;',
                '',
                'class Calculator {',
                'private:',
                '    int result;',
                '',
                'public:',
                '    Calculator() : result(0) {}',
                '',
                '    Calculator& add(int num) {',
                '        result += num;',
                '        return *this;',
                '    }',
                '',
                '    Calculator& subtract(int num) {',
                '        result -= num;',
                '        return *this;',
                '    }',
                '',
                '    int getResult() {',
                '        return result;',
                '    }',
                '};',
                '',
                'int main() {',
                '    cout << "Hello, World!" << endl;',
                '',
                '    Calculator calc;',
                '    int result = calc.add(5).subtract(2).getResult();',
                '    cout << "Result: " << result << endl; // Output: 3',
                '',
                '    return 0;',
                '}'
            ].join('\n');
            language = 'cpp';
            break;
        case 'json':
            content = [
                '{',
                '  "name": "Sample Project",',
                '  "version": "1.0.0",',
                '  "description": "A sample JSON configuration",',
                '  "scripts": {',
                '    "start": "node index.js",',
                '    "test": "jest"',
                '  },',
                '  "keywords": [',
                '    "sample",',
                '    "project",',
                '    "config"',
                '  ],',
                '  "author": "Your Name",',
                '  "license": "MIT",',
                '  "dependencies": {',
                '    "express": "^4.18.0"',
                '  }',
                '}'
            ].join('\n');
            language = 'json';
            break;
        default:
            content = `// New ${extension} file\n// Add your code here`;
    }
    
    // Update editor content and language
    editor.setValue(content);
    monaco.editor.setModelLanguage(editor.getModel(), language);
    
    // Update language indicator
    document.getElementById('language-indicator').textContent = 
        language.charAt(0).toUpperCase() + language.slice(1);
}

// Utility function to debounce events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function setupSettingsForm(editor) {
    // Get settings modal elements
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.getElementById('close-settings');
    const saveSettingsBtn = document.getElementById('save-settings');
    const resetSettingsBtn = document.getElementById('reset-settings');
    
    // Font size controls
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    
    // Tab size controls
    const tabSizeSlider = document.getElementById('tab-size');
    const tabSizeValue = document.getElementById('tab-size-value');
    
    // Word wrap control
    const wordWrapSelect = document.getElementById('word-wrap');
    
    // Line numbers control
    const lineNumbersSelect = document.getElementById('line-numbers');
    
    // Feature checkboxes
    const minimapCheckbox = document.getElementById('minimap');
    const smoothScrollingCheckbox = document.getElementById('smooth-scrolling');
    const roundedSelectionCheckbox = document.getElementById('rounded-selection');
    const highlightActiveLineCheckbox = document.getElementById('highlight-active-line');
    const bracketMatchingCheckbox = document.getElementById('bracket-matching');
    
    // Key bindings control
    const keyBindingsSelect = document.getElementById('key-bindings');
    
    // Update displayed values when sliders change
    fontSizeSlider.addEventListener('input', function() {
        fontSizeValue.textContent = this.value + 'px';
    });
    
    tabSizeSlider.addEventListener('input', function() {
        tabSizeValue.textContent = this.value + ' spaces';
    });
    
    // Close modal when clicking the X
    closeModal.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // Save settings button
    saveSettingsBtn.addEventListener('click', function() {
        // Apply the settings to the editor
        editor.updateOptions({
            fontSize: parseInt(fontSizeSlider.value),
            tabSize: parseInt(tabSizeSlider.value),
            wordWrap: wordWrapSelect.value,
            lineNumbers: lineNumbersSelect.value,
            minimap: { enabled: minimapCheckbox.checked },
            smoothScrolling: smoothScrollingCheckbox.checked,
            roundedSelection: roundedSelectionCheckbox.checked,
            'editor.renderLineHighlight': highlightActiveLineCheckbox.checked ? 'all' : 'none',
            'editor.matchBrackets': bracketMatchingCheckbox.checked ? 'always' : 'never'
        });
        
        // Show confirmation
        alert('Settings applied successfully!');
        
        // Hide the modal
        settingsModal.style.display = 'none';
    });
    
    // Reset settings button
    resetSettingsBtn.addEventListener('click', function() {
        // Reset all settings to defaults
        fontSizeSlider.value = 14;
        fontSizeValue.textContent = '14px';
        tabSizeSlider.value = 2;
        tabSizeValue.textContent = '2 spaces';
        wordWrapSelect.value = 'on';
        lineNumbersSelect.value = 'on';
        minimapCheckbox.checked = true;
        smoothScrollingCheckbox.checked = true;
        roundedSelectionCheckbox.checked = true;
        highlightActiveLineCheckbox.checked = true;
        bracketMatchingCheckbox.checked = true;
        keyBindingsSelect.value = 'default';
    });
    
    // Settings button in toolbar
    document.getElementById('settings-btn').addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });
    
    // Refresh files button
    document.getElementById('refresh-files-btn').addEventListener('click', function() {
        if (currentDirHandle) {
            // If we're viewing a folder, refresh the folder contents
            loadFolderContents(currentDirHandle);
        } else {
            // Otherwise, clear recent files
            openedFiles = [];
            updateFileExplorer();
        }
    });
    
    // Menu bar functionality
    setupMenuBar();
}

// Track opened files
let openedFiles = [];

// Setup menu bar functionality
// Command palette commands
const commandPaletteCommands = [
    { id: 'new-file', title: 'New File', icon: '📄', shortcut: 'Ctrl+N', action: () => document.getElementById('new-file-btn').click() },
    { id: 'open-file', title: 'Open File...', icon: '📂', shortcut: 'Ctrl+O', action: () => document.getElementById('open-file-btn').click() },
    { id: 'open-folder', title: 'Open Folder...', icon: '📁', shortcut: 'Ctrl+K Ctrl+O', action: () => document.getElementById('open-folder-btn').click() },
    { id: 'save-file', title: 'Save File', icon: '💾', shortcut: 'Ctrl+S', action: () => document.getElementById('save-btn').click() },
    { id: 'save-as', title: 'Save As...', icon: '📥', shortcut: 'Ctrl+Shift+S', action: () => document.getElementById('save-btn').click() },
    { id: 'find', title: 'Find', icon: '🔍', shortcut: 'Ctrl+F', action: () => window.editor.trigger('source', 'actions.find', null) },
    { id: 'replace', title: 'Replace', icon: '🔄', shortcut: 'Ctrl+H', action: () => window.editor.trigger('source', 'editor.action.startFindReplaceAction', null) },
    { id: 'toggle-sidebar', title: 'Toggle Sidebar', icon: '↔️', shortcut: 'Ctrl+B', action: () => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.style.display === 'none' || sidebar.style.display === '') {
            sidebar.style.display = 'flex';
        } else {
            sidebar.style.display = 'none';
        }
    }},
    { id: 'zoom-in', title: 'Zoom In', icon: '🔍+', shortcut: 'Ctrl+=', action: () => {
        const currentFontSize = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        window.editor.updateOptions({ fontSize: currentFontSize + 2 });
    }},
    { id: 'zoom-out', title: 'Zoom Out', icon: '🔍-', shortcut: 'Ctrl+-', action: () => {
        const currentFontSize = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        if (currentFontSize > 6) {
            window.editor.updateOptions({ fontSize: currentFontSize - 2 });
        }
    }},
    { id: 'reset-zoom', title: 'Reset Zoom', icon: '🔍0', shortcut: 'Ctrl+0', action: () => {
        window.editor.updateOptions({ fontSize: 14 });
    }},
    { id: 'toggle-theme', title: 'Toggle Theme', icon: '🌙', shortcut: 'Ctrl+T', action: () => {
        const currentTheme = window.editor._themeService.getTheme().themeName;
        const newTheme = currentTheme.includes('dark') ? 'vs' : 'vs-dark';
        monaco.editor.setTheme(newTheme);
    }},
    { id: 'go-to-line', title: 'Go to Line...', icon: '🔢', shortcut: 'Ctrl+G', action: () => {
        const line = prompt('Go to line:');
        if (line && !isNaN(line)) {
            window.editor.revealLine(parseInt(line));
            window.editor.setPosition({ lineNumber: parseInt(line), column: 1 });
        }
    }}
];

function setupMenuBar() {
    // File menu
    document.getElementById('menu-new-file').addEventListener('click', function() {
        document.getElementById('new-file-btn').click();
    });
    
    document.getElementById('menu-open-file').addEventListener('click', function() {
        document.getElementById('open-file-btn').click();
    });
    
    document.getElementById('menu-open-folder').addEventListener('click', function() {
        document.getElementById('open-folder-btn').click();
    });
    
    document.getElementById('menu-save').addEventListener('click', function() {
        document.getElementById('save-btn').click();
    });
    
    document.getElementById('menu-save-as').addEventListener('click', function() {
        // For save as, we'll just trigger the normal save which prompts for filename
        document.getElementById('save-btn').click();
    });
    
    document.getElementById('menu-close-tab').addEventListener('click', function() {
        // Close the current tab by creating a new untitled file
        document.getElementById('new-file-btn').click();
    });
    
    // Edit menu
    document.getElementById('menu-undo').addEventListener('click', function() {
        window.editor.trigger('source', 'undo', null);
    });
    
    document.getElementById('menu-redo').addEventListener('click', function() {
        window.editor.trigger('source', 'redo', null);
    });
    
    document.getElementById('menu-cut').addEventListener('click', function() {
        document.execCommand('cut');
    });
    
    document.getElementById('menu-copy').addEventListener('click', function() {
        document.execCommand('copy');
    });
    
    document.getElementById('menu-paste').addEventListener('click', function() {
        document.execCommand('paste');
    });
    
    document.getElementById('menu-find').addEventListener('click', function() {
        window.editor.trigger('source', 'actions.find', null);
    });
    
    document.getElementById('menu-replace').addEventListener('click', function() {
        window.editor.trigger('source', 'editor.action.startFindReplaceAction', null);
    });
    
    // View menu
    document.getElementById('menu-toggle-sidebar').addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.style.display === 'none' || sidebar.style.display === '') {
            sidebar.style.display = 'flex';
        } else {
            sidebar.style.display = 'none';
        }
    });
    
    document.getElementById('menu-toggle-status').addEventListener('click', function() {
        const statusBar = document.querySelector('.status-bar');
        if (statusBar.style.display === 'none' || statusBar.style.display === '') {
            statusBar.style.display = 'flex';
        } else {
            statusBar.style.display = 'none';
        }
    });
    
    document.getElementById('menu-zoom-in').addEventListener('click', function() {
        const currentFontSize = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        window.editor.updateOptions({ fontSize: currentFontSize + 2 });
    });
    
    document.getElementById('menu-zoom-out').addEventListener('click', function() {
        const currentFontSize = window.editor.getOption(monaco.editor.EditorOption.fontSize);
        if (currentFontSize > 6) { // Minimum font size
            window.editor.updateOptions({ fontSize: currentFontSize - 2 });
        }
    });
    
    document.getElementById('menu-reset-zoom').addEventListener('click', function() {
        window.editor.updateOptions({ fontSize: 14 }); // Default font size
    });
    
    // Run menu
    document.getElementById('menu-run-code').addEventListener('click', function() {
        alert('Run functionality would execute the current code');
    });
    
    document.getElementById('menu-debug').addEventListener('click', function() {
        alert('Debug functionality would start debugging the current code');
    });
    
    // Help menu
    document.getElementById('menu-about').addEventListener('click', function() {
        alert('CodeEditor PRO v1.0\nA beautiful Monaco-style code editor\nBuilt with modern web technologies');
    });
    
    document.getElementById('menu-keyboard').addEventListener('click', function() {
        alert('Keyboard Shortcuts:\nCtrl+S: Save\nCtrl+O: Open File\nCtrl+N: New File\nCtrl+F: Find\nCtrl+H: Replace\nCtrl+=: Zoom In\nCtrl+-: Zoom Out\nCtrl+0: Reset Zoom');
    });
    
    document.getElementById('menu-documentation').addEventListener('click', function() {
        alert('Documentation would open in a new window');
    });
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.menu-item')) {
            const dropdowns = document.querySelectorAll('.menu-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });
    
    // Initialize command palette
    setupCommandPalette();
}

function setupCommandPalette() {
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('command-palette-input');
    const results = document.getElementById('command-palette-results');
    
    // Show command palette with Ctrl+Shift+P
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            showCommandPalette();
        }
        // Also support F1
        if (e.key === 'F1') {
            e.preventDefault();
            showCommandPalette();
        }
    });
    
    function showCommandPalette() {
        palette.style.display = 'block';
        input.value = '';
        input.focus();
        renderCommands(commandPaletteCommands);
    }
    
    function hideCommandPalette() {
        palette.style.display = 'none';
    }
    
    function renderCommands(commands) {
        results.innerHTML = '';
        commands.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = 'command-palette-item';
            item.innerHTML = `
                <span class="command-palette-item-icon">${cmd.icon}</span>
                <span class="command-palette-item-title">${cmd.title}</span>
                <span class="command-palette-item-shortcut">${cmd.shortcut}</span>
            `;
            
            item.addEventListener('click', function() {
                cmd.action();
                hideCommandPalette();
            });
            
            results.appendChild(item);
        });
    }
    
    input.addEventListener('input', function() {
        const query = input.value.toLowerCase();
        if (query === '') {
            renderCommands(commandPaletteCommands);
        } else {
            const filtered = commandPaletteCommands.filter(cmd => 
                cmd.title.toLowerCase().includes(query) || 
                cmd.id.toLowerCase().includes(query)
            );
            renderCommands(filtered);
        }
    });
    
    // Allow navigating commands with arrow keys
    let selectedIndex = -1;
    
    input.addEventListener('keydown', function(e) {
        const items = results.querySelectorAll('.command-palette-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].click();
            } else {
                // Execute first item if none selected
                if (items.length > 0) {
                    items[0].click();
                }
            }
        } else if (e.key === 'Escape') {
            hideCommandPalette();
        }
    });
    
    function updateSelection(items) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    // Close palette when clicking outside
    palette.addEventListener('click', function(e) {
        if (e.target === palette) {
            hideCommandPalette();
        }
    });
}

function saveCurrentFile(editor) {
    // Get the current content from the editor
    const content = editor.getValue();
    
    // Get the current filename from the tab
    let filename = document.querySelector('.tab-title').textContent || 'untitled';
    
    // If it's untitled, prompt for a filename
    if (filename === 'untitled') {
        filename = prompt('Enter filename:', 'new-file.txt') || 'untitled.txt';
    }
    
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show confirmation
    alert('File saved successfully!');
}

// Function to add a file to the opened files list
function addOpenedFile(filename, content, language) {
    // Check if file is already in the list
    const existingIndex = openedFiles.findIndex(file => file.filename === filename);
    
    if (existingIndex !== -1) {
        // Update existing file
        openedFiles[existingIndex] = { filename, content, language };
    } else {
        // Add new file
        openedFiles.push({ filename, content, language });
    }
    
    // Update the file explorer UI
    updateFileExplorer();
}

// Function to update the file explorer UI
function updateFileExplorer() {
    const fileList = document.querySelector('.file-list');
    if (!fileList) return;
    
    // Clear existing list
    fileList.innerHTML = '';
    
    // Add header
    const header = document.createElement('h3');
    header.textContent = 'Recent Files';
    header.className = 'explorer-header';
    fileList.appendChild(header);
    
    // Add files to the list
    openedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.innerHTML = `<span class="file-icon">📄</span> ${file.filename}`;
        
        li.addEventListener('click', function() {
            // Set as active
            document.querySelectorAll('.file-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update editor content
            window.editor.setValue(file.content);
            monaco.editor.setModelLanguage(window.editor.getModel(), file.language);
            
            // Update tab title
            document.querySelector('.tab-title').textContent = file.filename;
            
            // Update language indicator
            document.getElementById('language-indicator').textContent = 
                file.language.charAt(0).toUpperCase() + file.language.slice(1);
        });
        
        fileList.appendChild(li);
    });
    
    // If no files, show a message
    if (openedFiles.length === 0) {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.textContent = 'No files opened yet';
        li.style.color = 'var(--text-secondary)';
        fileList.appendChild(li);
    }
}

// Store the current directory handle
let currentDirHandle = null;

// Enhanced file opening function
function openFileFromInput(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        
        // Update editor
        window.editor.setValue(content);
        
        // Update tab title with filename
        document.querySelector('.tab-title').textContent = file.name;

        // Update status bar file name
        document.getElementById('file-name').textContent = file.name;

        // Detect language based on file extension
        const extension = file.name.split('.').pop().toLowerCase();
        let language = 'plaintext'; // default
        
        switch(extension) {
            case 'js':
            case 'javascript':
                language = 'javascript';
                break;
            case 'ts':
                language = 'typescript';
                break;
            case 'html':
            case 'htm':
                language = 'html';
                break;
            case 'css':
                language = 'css';
                break;
            case 'py':
                language = 'python';
                break;
            case 'java':
                language = 'java';
                break;
            case 'cpp':
            case 'c++':
                language = 'cpp';
                break;
            case 'json':
                language = 'json';
                break;
            case 'txt':
                language = 'plaintext';
                break;
        }
        
        // Update language in editor and selector
        monaco.editor.setModelLanguage(window.editor.getModel(), language);
        document.getElementById('language-select').value = language;
        document.getElementById('language-indicator').textContent = 
            language.charAt(0).toUpperCase() + language.slice(1);
        
        // Add to opened files list
        addOpenedFile(file.name, content, language);
    };
    
    reader.readAsText(file);
}

// Function to load folder contents using the File System Access API
async function loadFolderContents(dirHandle, parentElement = null, depth = 0) {
    // If this is the root call, set the current directory handle
    if (depth === 0) {
        currentDirHandle = dirHandle;
    }
    
    // Determine the container element
    let container;
    if (parentElement) {
        // This is a subdirectory, create a folder container
        const folderItem = document.createElement('div');
        folderItem.className = `file-item folder-item indent-${depth}`;
        
        // Add toggle button
        folderItem.innerHTML = `
            <span class="folder-toggle"></span>
            <span class="file-icon">📁</span> ${dirHandle.name}
        `;
        
        // Create container for folder contents
        const contentsDiv = document.createElement('div');
        contentsDiv.className = 'folder-contents';
        folderItem.appendChild(contentsDiv);
        
        parentElement.appendChild(folderItem);
        container = contentsDiv;
        
        // Add click event to toggle folder
        const toggle = folderItem.querySelector('.folder-toggle');
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            folderItem.classList.toggle('expanded');
            contentsDiv.classList.toggle('visible');
        });
        
        // Add click event to open folder
        folderItem.addEventListener('click', async function(e) {
            if (e.target !== toggle) {
                // Toggle expanded state when clicking on the folder name
                folderItem.classList.toggle('expanded');
                contentsDiv.classList.toggle('visible');
            }
        });
    } else {
        // This is the root call, clear and set up the main file list
        const fileList = document.querySelector('.file-list');
        if (!fileList) return;
        
        // Clear existing list
        fileList.innerHTML = '';
        
        // Add header
        const headerContainer = document.createElement('div');
        headerContainer.className = 'explorer-header-container';
        headerContainer.innerHTML = `
            <h3 class="explorer-header-text">${dirHandle.name}</h3>
            <button id="refresh-folder-btn" class="btn-icon-small" title="Refresh Folder">
                <svg width="12" height="12" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8 2.5a5.5 5.5 0 0 0-4.5 2.7 6 6 0 0 0 0 6.6 5.5 5.5 0 0 0 9 0 6 6 0 0 0 0-6.6A5.5 5.5 0 0 0 8 2.5zm0 11a5.5 5.5 0 0 1-4.5-2.7 6 6 0 0 1 0-6.6 5.5 5.5 0 0 1 9 0 6 6 0 0 1 0 6.6A5.5 5.5 0 0 1 8 13.5z"/>
                </svg>
            </button>
        `;
        fileList.appendChild(headerContainer);
        
        // Add refresh folder button functionality
        document.getElementById('refresh-folder-btn').addEventListener('click', async function() {
            if (currentDirHandle) {
                await loadFolderContents(currentDirHandle);
            }
        });
        
        // Add a back button to navigate up
        const backButton = document.createElement('div');
        backButton.className = 'file-item';
        backButton.innerHTML = '<span class="file-icon">📁</span> .. (Parent Folder)';
        backButton.addEventListener('click', async function() {
            try {
                // Navigate to parent directory
                // Note: The File System Access API doesn't provide a direct way to get parent,
                // so we'll just clear the current view
                currentDirHandle = null;
                updateFileExplorer(); // This will show the default explorer
            } catch (err) {
                console.error('Error navigating to parent folder:', err);
            }
        });
        fileList.appendChild(backButton);
        
        container = fileList;
    }
    
    // Iterate through the directory contents
    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
            // Handle files
            const fileItem = document.createElement('div');
            fileItem.className = `file-item indent-${depth + 1}`;
            
            // Determine file icon based on extension
            let icon = '📄'; // Default file icon
            const ext = entry.name.split('.').pop().toLowerCase();
            if (['js', 'ts', 'jsx', 'tsx'].includes(ext)) icon = '📜';
            else if (['html', 'htm'].includes(ext)) icon = '🌐';
            else if (['css'].includes(ext)) icon = '🎨';
            else if (['py'].includes(ext)) icon = '🐍';
            else if (['java', 'cpp', 'c', 'h'].includes(ext)) icon = '⚙️';
            else if (['json', 'xml', 'yaml', 'yml'].includes(ext)) icon = '📋';
            else if (['md'].includes(ext)) icon = '📝';
            
            fileItem.innerHTML = `<span class="file-icon">${icon}</span> ${entry.name}`;
            
            fileItem.addEventListener('click', async function(e) {
                e.stopPropagation();
                try {
                    const file = await entry.getFile();
                    const content = await file.text();
                    
                    // Update editor
                    window.editor.setValue(content);
                    
                    // Update tab title with filename
                    document.querySelector('.tab-title').textContent = entry.name;

                    // Update status bar file name
                    document.getElementById('file-name').textContent = entry.name;

                    // Detect language based on file extension
                    const extension = entry.name.split('.').pop().toLowerCase();
                    let language = 'plaintext'; // default
                    
                    switch(extension) {
                        case 'js':
                        case 'javascript':
                            language = 'javascript';
                            break;
                        case 'ts':
                            language = 'typescript';
                            break;
                        case 'html':
                        case 'htm':
                            language = 'html';
                            break;
                        case 'css':
                            language = 'css';
                            break;
                        case 'py':
                            language = 'python';
                            break;
                        case 'java':
                            language = 'java';
                            break;
                        case 'cpp':
                        case 'c++':
                            language = 'cpp';
                            break;
                        case 'json':
                            language = 'json';
                            break;
                        case 'txt':
                            language = 'plaintext';
                            break;
                    }
                    
                    // Update language in editor and selector
                    monaco.editor.setModelLanguage(window.editor.getModel(), language);
                    document.getElementById('language-select').value = language;
                    document.getElementById('language-indicator').textContent = 
                        language.charAt(0).toUpperCase() + language.slice(1);
                    
                    // Add to opened files list
                    addOpenedFile(entry.name, content, language);
                } catch (err) {
                    console.error('Error reading file:', err);
                    alert(`Error reading file: ${entry.name}`);
                }
            });
            
            container.appendChild(fileItem);
        } else if (entry.kind === 'directory') {
            // Handle directories recursively
            await loadFolderContents(entry, container, depth + 1);
        }
    }
}

