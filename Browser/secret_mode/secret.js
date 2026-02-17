/* =============================================
   Secret Browser - Pro Engineering Design Mode
   Advanced JavaScript Implementation
   ============================================= */

// ==================== DOM Elements ====================
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const welcomePage = document.getElementById('welcome-page');
const designModeContainer = document.getElementById('design-mode-container');
const canvas = document.getElementById('design-canvas');
const ctx = canvas.getContext('2d');
const canvasWrapper = document.getElementById('canvas-wrapper');
const canvasOverlay = document.getElementById('canvas-overlay');

// Panels
const leftPanel = document.getElementById('left-panel');
const rightPanel = document.getElementById('right-panel');
const layersList = document.getElementById('layers-list');
const propertiesContent = document.getElementById('properties-content');

// Tool buttons
const toolButtons = document.querySelectorAll('.design-tool-btn[data-tool]');

// Style controls
const fillColorPicker = document.getElementById('fill-color-picker');
const strokeColorPicker = document.getElementById('stroke-color-picker');
const strokeWidthSlider = document.getElementById('stroke-width');
const fillPatternSelect = document.getElementById('fill-pattern');
const strokeStyleSelect = document.getElementById('stroke-style');
const fillNoneBtn = document.getElementById('fill-none-btn');

// View controls
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const fitScreenBtn = document.getElementById('fit-screen-btn');
const zoomLevelDisplay = document.getElementById('zoom-level');
const gridBtn = document.getElementById('grid-btn');
const snapBtn = document.getElementById('snap-btn');
const guidesBtn = document.getElementById('guides-btn');

// History controls
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');

// Action buttons
const deleteBtn = document.getElementById('delete-btn');
const duplicateBtn = document.getElementById('duplicate-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const exportBtn = document.getElementById('export-btn');
const exportSvgBtn = document.getElementById('export-svg-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const addLayerBtn = document.getElementById('add-layer-btn');

// Transform buttons
const rotateBtn = document.getElementById('rotate-btn');
const scaleBtn = document.getElementById('scale-btn');
const flipHBtn = document.getElementById('flip-h-btn');
const flipVBtn = document.getElementById('flip-v-btn');

// Panel toggles
const toggleLeftPanelBtn = document.getElementById('toggle-left-panel-btn');
const toggleRightPanelBtn = document.getElementById('toggle-right-panel-btn');
const showLeftPanelBtn = document.getElementById('show-left-panel-btn');
const showRightPanelBtn = document.getElementById('show-right-panel-btn');

// Property inputs
const propX = document.getElementById('prop-x');
const propY = document.getElementById('prop-y');
const propWidth = document.getElementById('prop-width');
const propHeight = document.getElementById('prop-height');
const propRotation = document.getElementById('prop-rotation');
const propOpacity = document.getElementById('prop-opacity');
const opacityValue = document.getElementById('opacity-value');
const propText = document.getElementById('prop-text');
const propFontSize = document.getElementById('prop-font-size');
const textProperties = document.getElementById('text-properties');
const textBoldBtn = document.getElementById('text-bold-btn');
const textItalicBtn = document.getElementById('text-italic-btn');
const textUnderlineBtn = document.getElementById('text-underline-btn');

// Status displays
const statusText = document.getElementById('status-text');
const cursorPosition = document.getElementById('cursor-position');
const selectionInfo = document.getElementById('selection-info');
const zoomInfo = document.getElementById('zoom-info');

// File inputs
const imageImport = document.getElementById('image-import');
const projectLoad = document.getElementById('project-load');

// Minimap
const minimap = document.getElementById('minimap');
const minimapCanvas = document.getElementById('minimap-canvas');
const minimapCtx = minimapCanvas.getContext('2d');

// ==================== State ====================
let isDesignMode = false;
let currentTool = 'select';
let fillColor = '#1a73e8';
let strokeColor = '#202124';
let strokeWidth = 2;
let fillPattern = 'solid';
let strokeStyle = 'solid';
let isDrawing = false;
let startX, startY;
let currentX, currentY;
let shapes = [];
let selectedShape = null;
let history = [];
let historyIndex = -1;
let currentPath = null;
let bezierControlPoints = null;
let polygonPoints = null;
let isRotating = false;
let isScaling = false;
let rotationAngle = 0;
let scaleRatio = 1;

// View state
let zoom = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX, panStartY;
let showGrid = true;
let snapToGrid = true;
let showGuides = true;
const gridSize = 20;

// Layers
let layers = [{ id: 1, name: 'Layer 1', shapes: [], visible: true, locked: false }];
let currentLayerId = 1;

// Guides
let hGuides = [];
let vGuides = [];

// ==================== Initialization ====================
function init() {
    resizeCanvas();
    setupEventListeners();
    updateLayersPanel();
    updateHistoryButtons();
    drawGrid();
}

function resizeCanvas() {
    canvas.width = canvasWrapper.clientWidth;
    canvas.height = canvasWrapper.clientHeight;
    minimapCanvas.width = minimap.clientWidth;
    minimapCanvas.height = minimap.clientHeight;
    redrawCanvas();
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Mode toggle
    modeToggleBtn.addEventListener('click', toggleDesignMode);
    
    // Tool selection
    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => selectTool(btn.dataset.tool));
    });
    
    // Canvas events
    canvas.addEventListener('mousedown', onCanvasMouseDown);
    canvas.addEventListener('mousemove', onCanvasMouseMove);
    canvas.addEventListener('mouseup', onCanvasMouseUp);
    canvas.addEventListener('mouseout', onCanvasMouseUp);
    canvas.addEventListener('wheel', onCanvasWheel);
    canvas.addEventListener('dblclick', onCanvasDoubleClick);
    
    // Style controls
    fillColorPicker.addEventListener('input', (e) => {
        fillColor = e.target.value;
        if (selectedShape && selectedShape.type !== 'image') {
            selectedShape.fill = fillColor;
            redrawCanvas();
            saveState();
            updatePropertiesPanel();
        }
    });
    
    strokeColorPicker.addEventListener('input', (e) => {
        strokeColor = e.target.value;
        if (selectedShape) {
            selectedShape.stroke = strokeColor;
            redrawCanvas();
            saveState();
            updatePropertiesPanel();
        }
    });
    
    strokeWidthSlider.addEventListener('input', (e) => {
        strokeWidth = parseInt(e.target.value);
        if (selectedShape) {
            selectedShape.strokeWidth = strokeWidth;
            redrawCanvas();
            saveState();
            updatePropertiesPanel();
        }
    });
    
    fillPatternSelect.addEventListener('change', (e) => {
        fillPattern = e.target.value;
        if (selectedShape) {
            selectedShape.fillPattern = fillPattern;
            redrawCanvas();
            saveState();
        }
    });
    
    strokeStyleSelect.addEventListener('change', (e) => {
        strokeStyle = e.target.value;
        if (selectedShape) {
            selectedShape.strokeStyle = strokeStyle;
            redrawCanvas();
            saveState();
        }
    });
    
    fillNoneBtn.addEventListener('click', () => {
        fillColor = 'transparent';
        fillColorPicker.value = '#1a73e8';
        if (selectedShape) {
            selectedShape.fill = 'transparent';
            redrawCanvas();
            saveState();
        }
    });
    
    // View controls
    zoomInBtn.addEventListener('click', () => setZoom(zoom + 0.1));
    zoomOutBtn.addEventListener('click', () => setZoom(zoom - 0.1));
    fitScreenBtn.addEventListener('click', fitToScreen);
    gridBtn.addEventListener('click', toggleGrid);
    snapBtn.addEventListener('click', toggleSnap);
    guidesBtn.addEventListener('click', toggleGuides);
    
    // History
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    
    // Actions
    deleteBtn.addEventListener('click', deleteSelected);
    duplicateBtn.addEventListener('click', duplicateSelected);
    exportBtn.addEventListener('click', exportAsPNG);
    exportSvgBtn.addEventListener('click', exportAsSVG);
    saveBtn.addEventListener('click', saveProject);
    loadBtn.addEventListener('click', () => projectLoad.click());
    addLayerBtn.addEventListener('click', addLayer);
    
    // Transform
    rotateBtn.addEventListener('click', () => startTransform('rotate'));
    scaleBtn.addEventListener('click', () => startTransform('scale'));
    flipHBtn.addEventListener('click', () => flipShape('horizontal'));
    flipVBtn.addEventListener('click', () => flipShape('vertical'));
    
    // Panel toggles
    toggleLeftPanelBtn.addEventListener('click', () => leftPanel.classList.add('hidden'));
    toggleRightPanelBtn.addEventListener('click', () => rightPanel.classList.add('hidden'));
    showLeftPanelBtn.addEventListener('click', () => leftPanel.classList.remove('hidden'));
    showRightPanelBtn.addEventListener('click', () => rightPanel.classList.remove('hidden'));
    
    // Property inputs
    propX.addEventListener('input', updateShapeFromProps);
    propY.addEventListener('input', updateShapeFromProps);
    propWidth.addEventListener('input', updateShapeFromProps);
    propHeight.addEventListener('input', updateShapeFromProps);
    propRotation.addEventListener('input', updateShapeFromProps);
    propOpacity.addEventListener('input', updateShapeFromProps);
    propText.addEventListener('input', updateShapeFromProps);
    propFontSize.addEventListener('input', updateShapeFromProps);
    
    propOpacity.addEventListener('input', () => {
        opacityValue.textContent = propOpacity.value + '%';
    });
    
    // Text formatting
    textBoldBtn.addEventListener('click', () => toggleTextFormat('bold'));
    textItalicBtn.addEventListener('click', () => toggleTextFormat('italic'));
    textUnderlineBtn.addEventListener('click', () => toggleTextFormat('underline'));
    
    // File inputs
    imageImport.addEventListener('change', handleImageImport);
    projectLoad.addEventListener('change', loadProject);
    
    // Window resize
    window.addEventListener('resize', () => {
        if (isDesignMode) {
            resizeCanvas();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Context menu
    canvas.addEventListener('contextmenu', showContextMenu);
    document.addEventListener('click', hideContextMenu);
}

// ==================== Mode Toggle ====================
function toggleDesignMode() {
    isDesignMode = !isDesignMode;
    
    if (isDesignMode) {
        welcomePage.style.display = 'none';
        designModeContainer.style.display = 'flex';
        modeToggleBtn.classList.add('active');
        modeToggleBtn.innerHTML = '<ion-icon name="close"></ion-icon><span>Exit Design</span>';
        resizeCanvas();
        updateStatus('Design Mode Activated');
        saveState();
    } else {
        welcomePage.style.display = 'flex';
        designModeContainer.style.display = 'none';
        modeToggleBtn.classList.remove('active');
        modeToggleBtn.innerHTML = '<ion-icon name="create-outline"></ion-icon><span>Design Mode</span>';
        updateStatus('Browser Mode');
    }
}

// ==================== Tool Selection ====================
function selectTool(tool) {
    currentTool = tool;
    toolButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === tool);
    });
    
    // Update cursor
    const cursors = {
        select: 'default',
        pan: 'move',
        rectangle: 'crosshair',
        circle: 'crosshair',
        triangle: 'crosshair',
        polygon: 'crosshair',
        star: 'crosshair',
        line: 'crosshair',
        arrow: 'crosshair',
        bezier: 'crosshair',
        pencil: 'crosshair',
        text: 'text',
        image: 'copy',
        arc: 'crosshair'
    };
    canvas.style.cursor = cursors[tool] || 'crosshair';
    
    updateStatus(`Tool: ${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
    
    // Reset special drawing states
    if (tool !== 'polygon') polygonPoints = null;
    if (tool !== 'bezier') bezierControlPoints = null;
}

// ==================== Canvas Mouse Handlers ====================
function onCanvasMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    startX = (e.clientX - rect.left - panX) / zoom;
    startY = (e.clientY - rect.top - panY) / zoom;
    
    if (snapToGrid) {
        startX = Math.round(startX / gridSize) * gridSize;
        startY = Math.round(startY / gridSize) * gridSize;
    }
    
    currentX = startX;
    currentY = startY;
    
    if (currentTool === 'select') {
        selectedShape = getShapeAt(startX, startY);
        if (selectedShape) {
            isDrawing = true;
            updatePropertiesPanel();
            redrawCanvas();
        } else {
            propertiesContent.innerHTML = '<p style="color: var(--design-text); font-size: 12px; padding: 12px;">No shape selected</p>';
        }
    } else if (currentTool === 'pan') {
        isPanning = true;
        panStartX = e.clientX - panX;
        panStartY = e.clientY - panY;
        canvas.style.cursor = 'grabbing';
    } else if (currentTool === 'polygon') {
        if (!polygonPoints) {
            polygonPoints = [{x: startX, y: startY}];
        } else {
            polygonPoints.push({x: startX, y: startY});
        }
        isDrawing = true;
    } else if (currentTool === 'bezier') {
        if (!bezierControlPoints) {
            bezierControlPoints = {start: {x: startX, y: startY}};
        } else if (!bezierControlPoints.control1) {
            bezierControlPoints.control1 = {x: startX, y: startY};
        } else if (!bezierControlPoints.control2) {
            bezierControlPoints.control2 = {x: startX, y: startY};
        } else {
            // Complete the bezier curve
            const shape = {
                type: 'bezier',
                start: bezierControlPoints.start,
                control1: bezierControlPoints.control1,
                control2: bezierControlPoints.control2,
                end: {x: startX, y: startY},
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                layerId: currentLayerId
            };
            getCurrentLayer().shapes.push(shape);
            bezierControlPoints = null;
            saveState();
        }
        isDrawing = true;
    } else if (currentTool === 'pencil') {
        currentPath = {
            type: 'path',
            points: [{x: startX, y: startY}],
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeStyle: strokeStyle,
            layerId: currentLayerId
        };
        isDrawing = true;
    } else if (currentTool === 'text') {
        createTextShape(startX, startY);
    } else if (currentTool === 'image') {
        imageImport.click();
    } else {
        isDrawing = true;
    }
    
    redrawCanvas();
}

function onCanvasMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    currentX = (e.clientX - rect.left - panX) / zoom;
    currentY = (e.clientY - rect.top - panY) / zoom;
    
    // Update cursor position display
    cursorPosition.textContent = `X: ${Math.round(currentX)}, Y: ${Math.round(currentY)}`;
    
    if (isPanning) {
        panX = e.clientX - panStartX;
        panY = e.clientY - panStartY;
        redrawCanvas();
        return;
    }
    
    if (!isDrawing) return;
    
    let snapX = currentX;
    let snapY = currentY;
    
    if (snapToGrid) {
        snapX = Math.round(currentX / gridSize) * gridSize;
        snapY = Math.round(currentY / gridSize) * gridSize;
    }
    
    if (currentTool === 'select' && selectedShape) {
        const dx = snapX - startX;
        const dy = snapY - startY;
        moveShape(selectedShape, dx, dy);
        startX = snapX;
        startY = snapY;
        updatePropertiesPanel();
        redrawCanvas();
    } else if (currentTool === 'pencil' && currentPath) {
        currentPath.points.push({x: snapX, y: snapY});
        redrawCanvas();
    } else if (currentTool === 'polygon' && polygonPoints) {
        redrawCanvas();
        // Draw preview line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 122, 204, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(polygonPoints[polygonPoints.length - 1].x, polygonPoints[polygonPoints.length - 1].y);
        ctx.lineTo(snapX, snapY);
        ctx.stroke();
        ctx.setLineDash([]);
    } else if (currentTool === 'bezier' && bezierControlPoints) {
        redrawCanvas();
        // Draw preview
        drawBezierPreview(bezierControlPoints, {x: snapX, y: snapY});
    }
}

function onCanvasMouseUp(e) {
    if (isPanning) {
        isPanning = false;
        canvas.style.cursor = currentTool === 'select' ? 'default' : 'crosshair';
        return;
    }
    
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    let endX = (e.clientX - rect.left - panX) / zoom;
    let endY = (e.clientY - rect.top - panY) / zoom;
    
    if (snapToGrid) {
        endX = Math.round(endX / gridSize) * gridSize;
        endY = Math.round(endY / gridSize) * gridSize;
    }
    
    if (currentTool === 'polygon' && polygonPoints && polygonPoints.length > 2) {
        // Close polygon on double click or when near start point
        const dist = Math.sqrt(
            Math.pow(polygonPoints[0].x - endX, 2) + 
            Math.pow(polygonPoints[0].y - endY, 2)
        );
        if (dist < 10) {
            const shape = {
                type: 'polygon',
                points: [...polygonPoints],
                fill: fillColor,
                fillPattern: fillPattern,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                layerId: currentLayerId
            };
            getCurrentLayer().shapes.push(shape);
            polygonPoints = null;
            saveState();
        }
    } else if (currentTool !== 'select' && currentTool !== 'pan' && 
               currentTool !== 'polygon' && currentTool !== 'bezier' && 
               currentTool !== 'pencil' && currentTool !== 'text' && 
               currentTool !== 'image') {
        const shape = createShape(currentTool, startX, startY, endX, endY);
        if (shape) {
            getCurrentLayer().shapes.push(shape);
            saveState();
        }
    } else if (currentTool === 'pencil' && currentPath && currentPath.points.length > 1) {
        getCurrentLayer().shapes.push(currentPath);
        saveState();
    }
    
    isDrawing = false;
    currentPath = null;
    redrawCanvas();
    updateStatus(`Created: ${currentTool}`);
}

function onCanvasDoubleClick(e) {
    if (currentTool === 'polygon' && polygonPoints && polygonPoints.length > 2) {
        // Complete polygon on double click
        const shape = {
            type: 'polygon',
            points: [...polygonPoints],
            fill: fillColor,
            fillPattern: fillPattern,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeStyle: strokeStyle,
            layerId: currentLayerId
        };
        getCurrentLayer().shapes.push(shape);
        polygonPoints = null;
        isDrawing = false;
        saveState();
        redrawCanvas();
    }
}

function onCanvasWheel(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(zoom + delta);
    }
}

// ==================== Shape Creation ====================
function createShape(type, x1, y1, x2, y2) {
    const width = x2 - x1;
    const height = y2 - y1;
    
    switch(type) {
        case 'rectangle':
            return {
                type: 'rectangle',
                x: width < 0 ? x2 : x1,
                y: height < 0 ? y2 : y1,
                width: Math.abs(width),
                height: Math.abs(height),
                fill: fillColor,
                fillPattern: fillPattern,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                rotation: 0,
                opacity: 1,
                layerId: currentLayerId
            };
        case 'circle':
            return {
                type: 'circle',
                x: x1 + width / 2,
                y: y1 + height / 2,
                radiusX: Math.abs(width) / 2,
                radiusY: Math.abs(height) / 2,
                fill: fillColor,
                fillPattern: fillPattern,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                rotation: 0,
                opacity: 1,
                layerId: currentLayerId
            };
        case 'triangle':
            return {
                type: 'triangle',
                x: x1,
                y: y1,
                width: width,
                height: height,
                fill: fillColor,
                fillPattern: fillPattern,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                rotation: 0,
                opacity: 1,
                layerId: currentLayerId
            };
        case 'line':
            return {
                type: 'line',
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                opacity: 1,
                layerId: currentLayerId
            };
        case 'arrow':
            return {
                type: 'arrow',
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                opacity: 1,
                layerId: currentLayerId
            };
        case 'star':
            const cx = x1 + width / 2;
            const cy = y1 + height / 2;
            const outerRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;
            const innerRadius = outerRadius * 0.4;
            return {
                type: 'star',
                x: cx,
                y: cy,
                outerRadius: outerRadius,
                innerRadius: innerRadius,
                points: 5,
                rotation: -Math.PI / 2,
                fill: fillColor,
                fillPattern: fillPattern,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                opacity: 1,
                layerId: currentLayerId
            };
        case 'arc':
            return {
                type: 'arc',
                x: x1 + width / 2,
                y: y1 + height / 2,
                radiusX: Math.abs(width) / 2,
                radiusY: Math.abs(height) / 2,
                startAngle: 0,
                endAngle: Math.PI / 2,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeStyle: strokeStyle,
                opacity: 1,
                layerId: currentLayerId
            };
        default:
            return null;
    }
}

function createTextShape(x, y) {
    const text = prompt('Enter text:', 'Sample Text');
    if (text) {
        const shape = {
            type: 'text',
            x: x,
            y: y,
            text: text,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: strokeColor,
            bold: false,
            italic: false,
            underline: false,
            rotation: 0,
            opacity: 1,
            layerId: currentLayerId
        };
        getCurrentLayer().shapes.push(shape);
        saveState();
        redrawCanvas();
    }
}

// ==================== Drawing Functions ====================
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);
    
    // Draw grid
    if (showGrid) {
        drawGrid();
    }
    
    // Draw guides
    if (showGuides) {
        drawGuides();
    }
    
    // Draw all shapes from all visible layers
    layers.forEach(layer => {
        if (layer.visible) {
            layer.shapes.forEach(shape => drawShape(shape));
        }
    });
    
    // Draw selection highlight
    if (selectedShape) {
        drawSelectionHighlight(selectedShape);
    }
    
    // Draw bezier preview
    if (currentTool === 'bezier' && bezierControlPoints) {
        drawBezierPreview(bezierControlPoints, {x: currentX, y: currentY});
    }
    
    ctx.restore();
    
    // Update minimap
    updateMinimap();
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    
    const visibleLeft = Math.max(0, -panX / zoom);
    const visibleTop = Math.max(0, -panY / zoom);
    const visibleRight = (canvas.width - panX) / zoom;
    const visibleBottom = (canvas.height - panY) / zoom;
    
    for (let x = Math.floor(visibleLeft / gridSize) * gridSize; x < visibleRight; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, visibleTop);
        ctx.lineTo(x, visibleBottom);
        ctx.stroke();
    }
    for (let y = Math.floor(visibleTop / gridSize) * gridSize; y < visibleBottom; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(visibleLeft, y);
        ctx.lineTo(visibleRight, y);
        ctx.stroke();
    }
}

function drawGuides() {
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    hGuides.forEach(y => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / zoom, y);
        ctx.stroke();
    });
    
    vGuides.forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / zoom);
        ctx.stroke();
    });
    
    ctx.setLineDash([]);
}

function drawShape(shape) {
    ctx.save();
    ctx.globalAlpha = shape.opacity || 1;
    ctx.lineWidth = shape.strokeWidth || 2;
    ctx.strokeStyle = shape.stroke || '#202124';
    
    // Set stroke style
    if (shape.strokeStyle === 'dashed') {
        ctx.setLineDash([10, 5]);
    } else if (shape.strokeStyle === 'dotted') {
        ctx.setLineDash([2, 4]);
    }
    
    // Apply rotation if exists
    if (shape.rotation) {
        let cx, cy;
        if (shape.type === 'rectangle' || shape.type === 'triangle') {
            cx = shape.x + shape.width / 2;
            cy = shape.y + shape.height / 2;
        } else if (shape.type === 'circle' || shape.type === 'star') {
            cx = shape.x;
            cy = shape.y;
        } else {
            cx = shape.x;
            cy = shape.y;
        }
        ctx.translate(cx, cy);
        ctx.rotate(shape.rotation * Math.PI / 180);
        ctx.translate(-cx, -cy);
    }
    
    ctx.beginPath();
    
    switch(shape.type) {
        case 'rectangle':
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            applyFill(shape);
            ctx.stroke();
            break;
        case 'circle':
            ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
            applyFill(shape);
            ctx.stroke();
            break;
        case 'triangle':
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.width / 2, shape.y + shape.height);
            ctx.lineTo(shape.x + shape.width, shape.y);
            ctx.closePath();
            applyFill(shape);
            ctx.stroke();
            break;
        case 'polygon':
            if (shape.points && shape.points.length > 0) {
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                    ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
                ctx.closePath();
            }
            applyFill(shape);
            ctx.stroke();
            break;
        case 'star':
            drawStarShape(shape);
            applyFill(shape);
            ctx.stroke();
            break;
        case 'line':
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
            break;
        case 'arrow':
            drawArrow(shape);
            break;
        case 'bezier':
            ctx.moveTo(shape.start.x, shape.start.y);
            ctx.bezierCurveTo(
                shape.control1.x, shape.control1.y,
                shape.control2.x, shape.control2.y,
                shape.end.x, shape.end.y
            );
            ctx.stroke();
            break;
        case 'path':
            if (shape.points && shape.points.length > 0) {
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                    ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
            }
            ctx.stroke();
            break;
        case 'arc':
            ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, 0, 
                       shape.startAngle, shape.endAngle);
            ctx.stroke();
            break;
        case 'text':
            ctx.font = `${shape.italic ? 'italic ' : ''}${shape.bold ? 'bold ' : ''}${shape.fontSize || 16}px ${shape.fontFamily || 'Arial'}`;
            ctx.fillStyle = shape.fill || '#202124';
            ctx.fillText(shape.text, shape.x, shape.y);
            if (shape.underline) {
                const metrics = ctx.measureText(shape.text);
                ctx.beginPath();
                ctx.moveTo(shape.x, shape.y + 2);
                ctx.lineTo(shape.x + metrics.width, shape.y + 2);
                ctx.stroke();
            }
            break;
        case 'image':
            if (shape.image) {
                ctx.drawImage(shape.image, shape.x, shape.y, shape.width, shape.height);
            }
            break;
    }
    
    ctx.restore();
}

function applyFill(shape) {
    if (!shape.fill || shape.fill === 'transparent') return;
    
    if (shape.fillPattern === 'gradient-h') {
        const gradient = ctx.createLinearGradient(shape.x, shape.y, shape.x + (shape.width || shape.radiusX * 2), shape.y);
        gradient.addColorStop(0, shape.fill);
        gradient.addColorStop(1, lightenColor(shape.fill, 30));
        ctx.fillStyle = gradient;
    } else if (shape.fillPattern === 'gradient-v') {
        const gradient = ctx.createLinearGradient(shape.x, shape.y, shape.x, shape.y + (shape.height || shape.radiusY * 2));
        gradient.addColorStop(0, shape.fill);
        gradient.addColorStop(1, lightenColor(shape.fill, 30));
        ctx.fillStyle = gradient;
    } else if (shape.fillPattern === 'gradient-radial') {
        const gradient = ctx.createRadialGradient(
            shape.x, shape.y, 0,
            shape.x, shape.y, Math.max(shape.width || shape.radiusX * 2, shape.height || shape.radiusY * 2)
        );
        gradient.addColorStop(0, shape.fill);
        gradient.addColorStop(1, lightenColor(shape.fill, 30));
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = shape.fill;
    }
    ctx.fill();
}

function drawStarShape(shape) {
    const { x, y, outerRadius, innerRadius, points, rotation } = shape;
    const step = Math.PI / points;
    
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * step + rotation;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
}

function drawArrow(shape) {
    const headLength = 15 + shape.strokeWidth * 2;
    const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(shape.x1, shape.y1);
    ctx.lineTo(shape.x2, shape.y2);
    ctx.stroke();
    
    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(shape.x2, shape.y2);
    ctx.lineTo(
        shape.x2 - headLength * Math.cos(angle - Math.PI / 6),
        shape.y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        shape.x2 - headLength * Math.cos(angle + Math.PI / 6),
        shape.y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = shape.stroke;
    ctx.fill();
}

function drawSelectionHighlight(shape) {
    ctx.save();
    ctx.strokeStyle = '#007acc';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    const padding = 5;
    
    switch(shape.type) {
        case 'rectangle':
        case 'triangle':
            ctx.strokeRect(
                shape.x - padding, 
                shape.y - padding, 
                shape.width + padding * 2, 
                shape.height + padding * 2
            );
            break;
        case 'circle':
            ctx.beginPath();
            ctx.ellipse(
                shape.x, shape.y, 
                shape.radiusX + padding, 
                shape.radiusY + padding, 
                0, 0, 2 * Math.PI
            );
            ctx.stroke();
            break;
        case 'polygon':
        case 'star':
            const bounds = getShapeBounds(shape);
            ctx.strokeRect(
                bounds.x - padding, 
                bounds.y - padding, 
                bounds.width + padding * 2, 
                bounds.height + padding * 2
            );
            break;
    }
    
    ctx.restore();
}

function drawBezierPreview(controlPoints, currentPoint) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 122, 204, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Draw control lines
    if (controlPoints.start && controlPoints.control1) {
        ctx.beginPath();
        ctx.moveTo(controlPoints.start.x, controlPoints.start.y);
        ctx.lineTo(controlPoints.control1.x, controlPoints.control1.y);
        ctx.stroke();
    }
    if (controlPoints.control2 && currentPoint) {
        ctx.beginPath();
        ctx.moveTo(controlPoints.control2.x, controlPoints.control2.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
    }
    
    // Draw control points
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    [controlPoints.start, controlPoints.control1, controlPoints.control2].forEach(p => {
        if (p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
    
    ctx.restore();
}

// ==================== Helper Functions ====================
function getShapeAt(x, y) {
    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (!layer.visible) continue;
        
        for (let j = layer.shapes.length - 1; j >= 0; j--) {
            const shape = layer.shapes[j];
            if (isPointInShape(x, y, shape)) {
                return shape;
            }
        }
    }
    return null;
}

function isPointInShape(x, y, shape) {
    switch(shape.type) {
        case 'rectangle':
        case 'triangle':
            return x >= shape.x && x <= shape.x + shape.width &&
                   y >= shape.y && y <= shape.y + shape.height;
        case 'circle':
            const dx = x - shape.x;
            const dy = y - shape.y;
            return (dx * dx / (shape.radiusX * shape.radiusX) + 
                    dy * dy / (shape.radiusY * shape.radiusY)) <= 1;
        case 'line':
        case 'arrow':
            const dist = pointToLineDistance(x, y, shape.x1, shape.y1, shape.x2, shape.y2);
            return dist < 10;
        case 'text':
            ctx.font = `${shape.fontSize || 16}px Arial`;
            const metrics = ctx.measureText(shape.text);
            return x >= shape.x && x <= shape.x + metrics.width &&
                   y >= shape.y - shape.fontSize && y <= shape.y;
        default:
            const bounds = getShapeBounds(shape);
            return x >= bounds.x && x <= bounds.x + bounds.width &&
                   y >= bounds.y && y <= bounds.y + bounds.height;
    }
}

function getShapeBounds(shape) {
    switch(shape.type) {
        case 'rectangle':
        case 'triangle':
            return { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
        case 'circle':
            return { 
                x: shape.x - shape.radiusX, 
                y: shape.y - shape.radiusY, 
                width: shape.radiusX * 2, 
                height: shape.radiusY * 2 
            };
        case 'polygon':
            if (!shape.points || shape.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
            const minX = Math.min(...shape.points.map(p => p.x));
            const maxX = Math.max(...shape.points.map(p => p.x));
            const minY = Math.min(...shape.points.map(p => p.y));
            const maxY = Math.max(...shape.points.map(p => p.y));
            return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        default:
            return { x: shape.x || 0, y: shape.y || 0, width: 50, height: 50 };
    }
}

function pointToLineDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = lenSq !== 0 ? dot / lenSq : -1;
    
    let xx, yy;
    if (param < 0) {
        xx = x1; yy = y1;
    } else if (param > 1) {
        xx = x2; yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function moveShape(shape, dx, dy) {
    switch(shape.type) {
        case 'rectangle':
        case 'triangle':
        case 'circle':
        case 'star':
        case 'text':
        case 'image':
        case 'arc':
            shape.x += dx;
            shape.y += dy;
            break;
        case 'line':
        case 'arrow':
            shape.x1 += dx;
            shape.y1 += dy;
            shape.x2 += dx;
            shape.y2 += dy;
            break;
        case 'bezier':
            shape.start.x += dx; shape.start.y += dy;
            shape.control1.x += dx; shape.control1.y += dy;
            shape.control2.x += dx; shape.control2.y += dy;
            shape.end.x += dx; shape.end.y += dy;
            break;
        case 'path':
        case 'polygon':
            shape.points.forEach(p => {
                p.x += dx;
                p.y += dy;
            });
            break;
    }
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// ==================== Layers Management ====================
function getCurrentLayer() {
    return layers.find(l => l.id === currentLayerId) || layers[0];
}

function addLayer() {
    const newId = Math.max(...layers.map(l => l.id)) + 1;
    layers.push({
        id: newId,
        name: `Layer ${newId}`,
        shapes: [],
        visible: true,
        locked: false
    });
    currentLayerId = newId;
    updateLayersPanel();
    updateStatus(`Added: ${layers[layers.length - 1].name}`);
}

function updateLayersPanel() {
    layersList.innerHTML = '';
    
    [...layers].reverse().forEach(layer => {
        const layerEl = document.createElement('div');
        layerEl.className = `layer-item ${layer.id === currentLayerId ? 'active' : ''}`;
        layerEl.innerHTML = `
            <button class="layer-visibility" data-layer-id="${layer.id}">
                <ion-icon name="${layer.visible ? 'eye' : 'eye-off'}"></ion-icon>
            </button>
            <span class="layer-name">${layer.name}</span>
            <span style="font-size: 10px; opacity: 0.5;">${layer.shapes.length} shapes</span>
        `;
        
        layerEl.addEventListener('click', (e) => {
            if (!e.target.closest('.layer-visibility')) {
                currentLayerId = layer.id;
                updateLayersPanel();
            }
        });
        
        const visibilityBtn = layerEl.querySelector('.layer-visibility');
        visibilityBtn.addEventListener('click', () => {
            layer.visible = !layer.visible;
            updateLayersPanel();
            redrawCanvas();
        });
        
        layersList.appendChild(layerEl);
    });
}

// ==================== Properties Panel ====================
function updatePropertiesPanel() {
    if (!selectedShape) {
        propertiesContent.innerHTML = '<p style="color: var(--design-text); font-size: 12px; padding: 12px;">No shape selected</p>';
        return;
    }
    
    const bounds = getShapeBounds(selectedShape);
    
    propertiesContent.innerHTML = `
        <div class="property-section">
            <h4>Position</h4>
            <div class="property-row">
                <label>X:</label>
                <input type="number" id="prop-x" step="1" value="${Math.round(bounds.x)}">
                <label>Y:</label>
                <input type="number" id="prop-y" step="1" value="${Math.round(bounds.y)}">
            </div>
        </div>
        <div class="property-section">
            <h4>Size</h4>
            <div class="property-row">
                <label>W:</label>
                <input type="number" id="prop-width" step="1" value="${Math.round(bounds.width)}">
                <label>H:</label>
                <input type="number" id="prop-height" step="1" value="${Math.round(bounds.height)}">
            </div>
        </div>
        <div class="property-section">
            <h4>Rotation</h4>
            <div class="property-row">
                <label>Angle:</label>
                <input type="number" id="prop-rotation" step="1" min="0" max="360" value="${Math.round(selectedShape.rotation || 0)}">
            </div>
        </div>
        <div class="property-section">
            <h4>Opacity</h4>
            <div class="property-row">
                <input type="range" id="prop-opacity" min="0" max="100" value="${Math.round((selectedShape.opacity || 1) * 100)}">
                <span id="opacity-value">${Math.round((selectedShape.opacity || 1) * 100)}%</span>
            </div>
        </div>
        ${selectedShape.type === 'text' ? `
        <div class="property-section" id="text-properties">
            <h4>Text</h4>
            <textarea id="prop-text" rows="3">${selectedShape.text}</textarea>
            <div class="property-row">
                <label>Font Size:</label>
                <input type="number" id="prop-font-size" value="${selectedShape.fontSize || 16}" min="8" max="200">
            </div>
            <div class="property-row">
                <button class="design-tool-btn ${selectedShape.bold ? 'active' : ''}" id="text-bold-btn" title="Bold">
                    <ion-icon name="bold"></ion-icon>
                </button>
                <button class="design-tool-btn ${selectedShape.italic ? 'active' : ''}" id="text-italic-btn" title="Italic">
                    <ion-icon name="italic"></ion-icon>
                </button>
                <button class="design-tool-btn ${selectedShape.underline ? 'active' : ''}" id="text-underline-btn" title="Underline">
                    <ion-icon name="underline"></ion-icon>
                </button>
            </div>
        </div>
        ` : ''}
    `;
    
    // Re-attach event listeners
    document.getElementById('prop-x')?.addEventListener('input', updateShapeFromProps);
    document.getElementById('prop-y')?.addEventListener('input', updateShapeFromProps);
    document.getElementById('prop-width')?.addEventListener('input', updateShapeFromProps);
    document.getElementById('prop-height')?.addEventListener('input', updateShapeFromProps);
    document.getElementById('prop-rotation')?.addEventListener('input', updateShapeFromProps);
    document.getElementById('prop-opacity')?.addEventListener('input', (e) => {
        document.getElementById('opacity-value').textContent = e.target.value + '%';
        updateShapeFromProps();
    });
    
    if (selectedShape.type === 'text') {
        document.getElementById('prop-text')?.addEventListener('input', updateShapeFromProps);
        document.getElementById('prop-font-size')?.addEventListener('input', updateShapeFromProps);
        document.getElementById('text-bold-btn')?.addEventListener('click', () => toggleTextFormat('bold'));
        document.getElementById('text-italic-btn')?.addEventListener('click', () => toggleTextFormat('italic'));
        document.getElementById('text-underline-btn')?.addEventListener('click', () => toggleTextFormat('underline'));
    }
}

function updateShapeFromProps() {
    if (!selectedShape) return;
    
    const x = parseFloat(propX?.value);
    const y = parseFloat(propY?.value);
    const w = parseFloat(propWidth?.value);
    const h = parseFloat(propHeight?.value);
    const rot = parseFloat(propRotation?.value);
    const opacity = parseFloat(propOpacity?.value) / 100;
    
    switch(selectedShape.type) {
        case 'rectangle':
        case 'triangle':
            if (!isNaN(x)) selectedShape.x = x;
            if (!isNaN(y)) selectedShape.y = y;
            if (!isNaN(w)) selectedShape.width = w;
            if (!isNaN(h)) selectedShape.height = h;
            break;
        case 'circle':
            if (!isNaN(x)) selectedShape.x = x;
            if (!isNaN(y)) selectedShape.y = y;
            if (!isNaN(w)) selectedShape.radiusX = w / 2;
            if (!isNaN(h)) selectedShape.radiusY = h / 2;
            break;
    }
    
    if (!isNaN(rot)) selectedShape.rotation = rot;
    if (!isNaN(opacity)) selectedShape.opacity = opacity;
    
    if (selectedShape.type === 'text') {
        if (propText) selectedShape.text = propText.value;
        if (propFontSize) selectedShape.fontSize = parseInt(propFontSize.value);
    }
    
    redrawCanvas();
    saveState();
}

function toggleTextFormat(format) {
    if (!selectedShape || selectedShape.type !== 'text') return;
    
    switch(format) {
        case 'bold':
            selectedShape.bold = !selectedShape.bold;
            textBoldBtn?.classList.toggle('active', selectedShape.bold);
            break;
        case 'italic':
            selectedShape.italic = !selectedShape.italic;
            textItalicBtn?.classList.toggle('active', selectedShape.italic);
            break;
        case 'underline':
            selectedShape.underline = !selectedShape.underline;
            textUnderlineBtn?.classList.toggle('active', selectedShape.underline);
            break;
    }
    
    redrawCanvas();
    saveState();
}

// ==================== View Controls ====================
function setZoom(newZoom) {
    zoom = Math.max(0.1, Math.min(5, newZoom));
    zoomLevelDisplay.textContent = Math.round(zoom * 100) + '%';
    zoomInfo.textContent = Math.round(zoom * 100) + '%';
    redrawCanvas();
}

function fitToScreen() {
    if (shapes.length === 0) return;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    shapes.forEach(shape => {
        const bounds = getShapeBounds(shape);
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
    });
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const scaleX = canvas.width / contentWidth;
    const scaleY = canvas.height / contentHeight;
    zoom = Math.min(scaleX, scaleY) * 0.9;
    
    panX = (canvas.width - contentWidth * zoom) / 2 - minX * zoom;
    panY = (canvas.height - contentHeight * zoom) / 2 - minY * zoom;
    
    setZoom(zoom);
}

function toggleGrid() {
    showGrid = !showGrid;
    gridBtn.classList.toggle('active', showGrid);
    redrawCanvas();
}

function toggleSnap() {
    snapToGrid = !snapToGrid;
    snapBtn.classList.toggle('active', snapToGrid);
    updateStatus(`Snap: ${snapToGrid ? 'On' : 'Off'}`);
}

function toggleGuides() {
    showGuides = !showGuides;
    guidesBtn.classList.toggle('active', showGuides);
    redrawCanvas();
}

// ==================== Minimap ====================
function updateMinimap() {
    minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    if (shapes.length === 0) return;
    
    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    shapes.forEach(shape => {
        const bounds = getShapeBounds(shape);
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
    });
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const scale = Math.min(
        (minimapCanvas.width - 10) / contentWidth,
        (minimapCanvas.height - 10) / contentHeight
    );
    
    // Draw shapes
    minimapCtx.save();
    minimapCtx.translate(5, 5);
    minimapCtx.scale(scale, scale);
    minimapCtx.translate(-minX, -minY);
    
    shapes.forEach(shape => {
        minimapCtx.fillStyle = shape.fill === 'transparent' ? '#444' : shape.fill;
        minimapCtx.strokeStyle = shape.stroke || '#666';
        minimapCtx.lineWidth = 1 / scale;
        
        const bounds = getShapeBounds(shape);
        minimapCtx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    });
    
    // Draw viewport indicator
    minimapCtx.strokeStyle = '#007acc';
    minimapCtx.lineWidth = 2 / scale;
    minimapCtx.strokeRect(
        -panX / zoom,
        -panY / zoom,
        canvas.width / zoom / scale,
        canvas.height / zoom / scale
    );
    
    minimapCtx.restore();
}

// ==================== History (Undo/Redo) ====================
function saveState() {
    history = history.slice(0, historyIndex + 1);
    history.push(JSON.stringify(layers));
    historyIndex++;
    
    // Limit history size
    if (history.length > 50) {
        history.shift();
        historyIndex--;
    }
    
    updateHistoryButtons();
    updateLayersPanel();
}

function updateHistoryButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        layers = JSON.parse(history[historyIndex]);
        selectedShape = null;
        redrawCanvas();
        updateHistoryButtons();
        updateLayersPanel();
        updatePropertiesPanel();
        updateStatus('Undo');
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        layers = JSON.parse(history[historyIndex]);
        selectedShape = null;
        redrawCanvas();
        updateHistoryButtons();
        updateLayersPanel();
        updatePropertiesPanel();
        updateStatus('Redo');
    }
}

// ==================== Shape Operations ====================
function deleteSelected() {
    if (!selectedShape) return;
    
    const layer = getCurrentLayer();
    const index = layer.shapes.indexOf(selectedShape);
    if (index > -1) {
        layer.shapes.splice(index, 1);
        selectedShape = null;
        redrawCanvas();
        saveState();
        updatePropertiesPanel();
        updateStatus('Deleted');
    }
}

function duplicateSelected() {
    if (!selectedShape) return;
    
    const duplicated = JSON.parse(JSON.stringify(selectedShape));
    
    // Offset position
    switch(duplicated.type) {
        case 'rectangle':
        case 'triangle':
        case 'circle':
        case 'star':
        case 'text':
        case 'image':
            duplicated.x += 20;
            duplicated.y += 20;
            break;
        case 'line':
        case 'arrow':
            duplicated.x1 += 20;
            duplicated.y1 += 20;
            duplicated.x2 += 20;
            duplicated.y2 += 20;
            break;
        case 'path':
        case 'polygon':
            duplicated.points.forEach(p => {
                p.x += 20;
                p.y += 20;
            });
            break;
    }
    
    getCurrentLayer().shapes.push(duplicated);
    selectedShape = duplicated;
    redrawCanvas();
    saveState();
    updateStatus('Duplicated');
}

function startTransform(type) {
    if (!selectedShape) {
        updateStatus('Select a shape first');
        return;
    }
    
    if (type === 'rotate') {
        const angle = prompt('Enter rotation angle (0-360):', selectedShape.rotation || 0);
        if (angle !== null) {
            selectedShape.rotation = parseFloat(angle) || 0;
            redrawCanvas();
            saveState();
            updatePropertiesPanel();
        }
    } else if (type === 'scale') {
        const scale = prompt('Enter scale factor (0.1-10):', '1');
        if (scale !== null) {
            const factor = parseFloat(scale) || 1;
            scaleShape(selectedShape, factor);
            redrawCanvas();
            saveState();
            updatePropertiesPanel();
        }
    }
}

function scaleShape(shape, factor) {
    switch(shape.type) {
        case 'rectangle':
        case 'triangle':
            shape.width *= factor;
            shape.height *= factor;
            break;
        case 'circle':
            shape.radiusX *= factor;
            shape.radiusY *= factor;
            break;
        case 'star':
            shape.outerRadius *= factor;
            shape.innerRadius *= factor;
            break;
        case 'line':
        case 'arrow':
            const cx = (shape.x1 + shape.x2) / 2;
            const cy = (shape.y1 + shape.y2) / 2;
            shape.x1 = cx + (shape.x1 - cx) * factor;
            shape.y1 = cy + (shape.y1 - cy) * factor;
            shape.x2 = cx + (shape.x2 - cx) * factor;
            shape.y2 = cy + (shape.y2 - cy) * factor;
            break;
    }
}

function flipShape(direction) {
    if (!selectedShape) return;
    
    const bounds = getShapeBounds(selectedShape);
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;
    
    if (direction === 'horizontal') {
        switch(selectedShape.type) {
            case 'rectangle':
            case 'triangle':
                selectedShape.x = cx - (selectedShape.x - cx) - selectedShape.width;
                break;
            case 'circle':
                selectedShape.x = cx - (selectedShape.x - cx);
                break;
            case 'line':
            case 'arrow':
                const x1 = selectedShape.x1;
                const x2 = selectedShape.x2;
                selectedShape.x1 = cx + (cx - x2);
                selectedShape.x2 = cx + (cx - x1);
                break;
        }
    } else {
        switch(selectedShape.type) {
            case 'rectangle':
            case 'triangle':
                selectedShape.y = cy - (selectedShape.y - cy) - selectedShape.height;
                break;
            case 'circle':
                selectedShape.y = cy - (selectedShape.y - cy);
                break;
            case 'line':
            case 'arrow':
                const y1 = selectedShape.y1;
                const y2 = selectedShape.y2;
                selectedShape.y1 = cy + (cy - y2);
                selectedShape.y2 = cy + (cy - y1);
                break;
        }
    }
    
    redrawCanvas();
    saveState();
}

// ==================== Import/Export ====================
function handleImageImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const shape = {
                type: 'image',
                x: 100,
                y: 100,
                width: img.width,
                height: img.height,
                image: img,
                opacity: 1,
                layerId: currentLayerId
            };
            getCurrentLayer().shapes.push(shape);
            redrawCanvas();
            saveState();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    imageImport.value = '';
}

function exportAsPNG() {
    // Create a temporary canvas without grid
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // White background
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw all shapes
    tempCtx.save();
    tempCtx.translate(panX, panY);
    tempCtx.scale(zoom, zoom);
    
    layers.forEach(layer => {
        if (layer.visible) {
            layer.shapes.forEach(shape => {
                // Draw shape to temp context
                drawShapeToContext(tempCtx, shape);
            });
        }
    });
    
    tempCtx.restore();
    
    // Download
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
    updateStatus('Exported as PNG');
}

function drawShapeToContext(ctx, shape) {
    ctx.save();
    ctx.globalAlpha = shape.opacity || 1;
    ctx.lineWidth = shape.strokeWidth || 2;
    ctx.strokeStyle = shape.stroke || '#202124';
    ctx.beginPath();
    
    switch(shape.type) {
        case 'rectangle':
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            ctx.fillStyle = shape.fill === 'transparent' ? '#ffffff' : shape.fill;
            ctx.fill();
            ctx.stroke();
            break;
        case 'circle':
            ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
            ctx.fillStyle = shape.fill === 'transparent' ? '#ffffff' : shape.fill;
            ctx.fill();
            ctx.stroke();
            break;
        // Add more shape types as needed
    }
    ctx.restore();
}

function exportAsSVG() {
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.width + '" height="' + canvas.height + '">';
    svg += '<rect width="100%" height="100%" fill="white"/>';
    
    shapes.forEach(shape => {
        if (shape.type === 'rectangle') {
            svg += `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" 
                       fill="${shape.fill === 'transparent' ? 'white' : shape.fill}" 
                       stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}"/>`;
        } else if (shape.type === 'circle') {
            svg += `<ellipse cx="${shape.x}" cy="${shape.y}" rx="${shape.radiusX}" ry="${shape.radiusY}" 
                       fill="${shape.fill === 'transparent' ? 'white' : shape.fill}" 
                       stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}"/>`;
        }
    });
    
    svg += '</svg>';
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'design.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
    updateStatus('Exported as SVG');
}

function saveProject() {
    const data = {
        layers: layers,
        currentLayerId: currentLayerId
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'project.json';
    link.href = URL.createObjectURL(blob);
    link.click();
    updateStatus('Project saved');
}

function loadProject(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            layers = data.layers;
            currentLayerId = data.currentLayerId;
            selectedShape = null;
            redrawCanvas();
            updateLayersPanel();
            updatePropertiesPanel();
            saveState();
            updateStatus('Project loaded');
        } catch (err) {
            alert('Error loading project file');
        }
    };
    reader.readAsText(file);
    projectLoad.value = '';
}

// ==================== Context Menu ====================
function showContextMenu(e) {
    e.preventDefault();
    // Implement context menu if needed
}

function hideContextMenu() {
    const menu = document.querySelector('.context-menu');
    if (menu) menu.remove();
}

// ==================== Keyboard Shortcuts ====================
function handleKeyboard(e) {
    if (!isDesignMode) return;
    
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key.toLowerCase();
    
    // Tool shortcuts
    const toolShortcuts = {
        'v': 'select',
        'h': 'pan',
        'r': 'rectangle',
        'c': 'circle',
        't': 'triangle',
        'p': 'polygon',
        's': 'star',
        'l': 'line',
        'a': 'arrow',
        'b': 'bezier',
        'f': 'pencil',
        'x': 'text',
        'i': 'image'
    };
    
    if (toolShortcuts[key]) {
        selectTool(toolShortcuts[key]);
        return;
    }
    
    // Action shortcuts
    if ((e.ctrlKey || e.metaKey) && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
            redo();
        } else {
            undo();
        }
    }
    
    if ((e.ctrlKey || e.metaKey) && key === 'y') {
        e.preventDefault();
        redo();
    }
    
    if ((e.ctrlKey || e.metaKey) && key === 'd') {
        e.preventDefault();
        duplicateSelected();
    }
    
    if (key === 'delete' || key === 'backspace') {
        deleteSelected();
    }
    
    if (key === 'g') {
        toggleGrid();
    }
    
    if (key === 'escape') {
        selectedShape = null;
        polygonPoints = null;
        bezierControlPoints = null;
        redrawCanvas();
        updatePropertiesPanel();
    }
}

// ==================== Status Updates ====================
function updateStatus(message) {
    statusText.textContent = message;
}

// ==================== Initialize ====================
init();

console.log('Secret Browser Pro - Engineering Design Mode Ready! 🎨');
