class LabelMaker {
    constructor() {
        this.icons = this.loadIconsFromStructure();
        
        this.customIcons = this.loadCustomIcons();
        this.initializeEventListeners();
        this.initializeDefaultColumns();
        this.updatePreview();
        this.initializeTabs();
        this.loadAvailableIcons();
        this.initializeYamlEditor();
        this.initializeIconPicker();
        this.initializeIconUpload();
        this.loadDPISettings();
    }

    loadIconsFromStructure() {
        const iconMapping = {
            'electronics': {
                'wago-logo': 'Wago Logo',
                'wago-alt1': 'Wago Alt 1', 
                'wago-alt2': 'Wago Alt 2',
                'wire-nut': 'Wire Nut',
                'generic': 'Generic Electrical'
            },
            'heads': {
                'cross': 'Cross Head',
                'hex-external': 'Hex External',
                'hex-socket': 'Hex Socket',
                'phillips': 'Phillips Head',
                'pozidrive': 'Pozidrive',
                'robertson': 'Robertson Head',
                'slotted': 'Slotted Head',
                'square-external': 'Square External',
                'ta': 'TA Head',
                'torx': 'Torx Head',
                'torx-tamperproof': 'Torx Tamperproof'
            },
            'inserts': {
                'heat': 'Heat Insert',
                'wood': 'Wood Insert'
            },
            'nuts': {
                'nut-cap': 'Cap Nut',
                'nut-lock': 'Lock Nut',
                'nut-standard': 'Standard Nut'
            },
            'fasteners': {
                'screw-round': 'Round Screw',
                'screw-tbolt': 'T-Bolt',
                'screw-truss': 'Truss Screw',
                'screw-truss-modified': 'Truss Modified',
                'screw-wafer': 'Wafer Screw',
                'screw-bugle': 'Bugle Screw',
                'screw-fillister': 'Fillister Screw',
                'screw-flat': 'Flat Screw',
                'screw-hex': 'Hex Screw',
                'screw-oval': 'Oval Screw',
                'screw-pan': 'Pan Screw',
                'screw-pan-hex': 'Pan Hex Screw',
                'screw-thumb-knurled': 'Thumb Knurled',
                'screw-trim': 'Trim Screw',
                'thumb-screw': 'Thumb Screw'
            },
            'washers': {
                'fender': 'Fender Washer',
                'flat': 'Flat Washer',
                'split': 'Split Washer',
                'star-exterior': 'Star Exterior',
                'star-interior': 'Star Interior'
            }
        };

        const icons = {};
        const availableIcons = [];

        Object.entries(iconMapping).forEach(([category, items]) => {
            Object.entries(items).forEach(([filename, displayName]) => {
                const iconKey = `${category}_${filename}`.replace(/-/g, '_');
                // Determine file extension based on category - heads use SVG, others use PNG
                const extension = category === 'heads' ? 'svg' : 'png';
                // For heads, convert filename to match actual file structure
                let actualFilename = filename;
                if (category === 'heads') {
                    actualFilename = `Screw_Head_-_${filename.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join('_')}`;
                }
                const iconPath = `icons/${category}/${actualFilename}.${extension}`;
                icons[iconKey] = iconPath;
                availableIcons.push(iconKey);
            });
        });

        this.availableIcons = availableIcons;
        return icons;
    }

    initializeEventListeners() {
        // Basic form elements
        const iconSelect = document.getElementById('icon-select');
        const labelHeight = document.getElementById('label-height');
        const labelWidth = document.getElementById('label-width');
        const downloadPng = document.getElementById('download-png');
        const validateYaml = document.getElementById('validate-yaml');
        const generateZip = document.getElementById('generate-zip');
        
        if (iconSelect) iconSelect.addEventListener('change', () => this.updatePreview());
        if (labelHeight) labelHeight.addEventListener('change', () => this.updatePreview());
        if (labelWidth) labelWidth.addEventListener('input', () => this.updatePreview());
        if (downloadPng) downloadPng.addEventListener('click', () => this.downloadPNG());
        
        // DPI preset buttons
        document.querySelectorAll('.dpi-preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dpi = e.target.dataset.dpi;
                document.getElementById('png-dpi').value = dpi;
            });
        });
        
        const downloadSvg = document.getElementById('download-svg');
        if (downloadSvg) downloadSvg.addEventListener('click', () => this.downloadSVG());
        if (validateYaml) validateYaml.addEventListener('click', () => this.validateYAML());
        if (generateZip) generateZip.addEventListener('click', () => this.generateZIP());
        
        // WYSIWYG preview interactions
        this.setupPreviewInteractions();
        
        // Initial setup for text inputs
        this.setupMainTextInputs();
        this.setupSubTextInputs();
    }

    setupPreviewInteractions() {
        // Create overlay for icon picker if it doesn't exist
        if (!document.querySelector('.icon-picker-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'icon-picker-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                this.closeIconPicker();
            });
        }

        // Click handler for preview icon to open icon picker
        const previewIcon = document.querySelector('.clickable-icon');
        if (previewIcon) {
            previewIcon.addEventListener('click', () => {
                this.openIconPicker();
            });
        }

        // Content editable text change handlers
        document.querySelectorAll('.editable-text').forEach(element => {
            element.addEventListener('input', () => {
                this.syncEditableTextToInputs();
            });
            
            element.addEventListener('blur', () => {
                this.syncEditableTextToInputs();
            });
        });

        // Column control buttons in form
        document.querySelectorAll('.column-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const type = e.target.dataset.type;
                this.updateColumn(type, action);
            });
        });
    }

    syncEditableTextToInputs() {
        // Sync main text
        const mainTextColumns = document.querySelectorAll('.main-text-column');
        const mainTextInputs = document.querySelectorAll('.main-text-input');
        
        mainTextColumns.forEach((column, index) => {
            if (mainTextInputs[index]) {
                mainTextInputs[index].value = column.textContent.trim();
            }
        });

        // Sync sub text
        const subTextColumns = document.querySelectorAll('.sub-text-column');
        const subTextInputs = document.querySelectorAll('.sub-text-input');
        
        subTextColumns.forEach((column, index) => {
            if (subTextInputs[index]) {
                subTextInputs[index].value = column.textContent.trim();
            }
        });
    }


    addHiddenInput(isMain, value = '') {
        const container = document.getElementById(isMain ? 'main-text-inputs' : 'sub-text-inputs');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = isMain ? 'main-text-input' : 'sub-text-input';
        input.value = value;
        input.addEventListener('input', () => this.updatePreview());
        container.appendChild(input);
    }

    removeHiddenInput(isMain) {
        const container = document.getElementById(isMain ? 'main-text-inputs' : 'sub-text-inputs');
        const inputs = container.querySelectorAll(isMain ? '.main-text-input' : '.sub-text-input');
        if (inputs.length > 1) {
            const lastInput = inputs[inputs.length - 1];
            lastInput.remove();
        }
    }

    initializeDefaultColumns() {
        // Set up event listeners for all pre-existing input fields
        document.querySelectorAll('.main-text-input').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });
        
        document.querySelectorAll('.sub-text-input').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });
    }

    updateColumn(type, action) {
        const isMain = type === 'main';
        const container = document.getElementById(isMain ? 'main-text-inputs' : 'sub-text-inputs');
        const inputClass = isMain ? 'main-text-input' : 'sub-text-input';
        
        let currentCount = container.querySelectorAll(`.${inputClass}`).length;
        
        if (action === 'add' && currentCount < 4) {
            currentCount++;
        } else if (action === 'remove' && currentCount > 1) {
            currentCount--;
        }
        
        this.updateTextInputs(container, inputClass, currentCount, isMain);
        this.updateColumnDisplay(type, currentCount);
        this.updatePreviewFromInputs();
    }

    updateColumnDisplay(type, count) {
        const countElement = document.getElementById(type === 'main' ? 'main-column-count' : 'sub-column-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    updatePreviewFromInputs() {
        // Update the preview based on hidden inputs, then sync to editable elements
        const mainInputs = document.querySelectorAll('.main-text-input');
        const subInputs = document.querySelectorAll('.sub-text-input');
        
        // Update main text columns
        const mainContainer = document.querySelector('.main-text');
        mainContainer.innerHTML = '';
        Array.from(mainInputs).forEach((input, index) => {
            const column = document.createElement('div');
            column.className = 'main-text-column editable-text';
            column.contentEditable = true;
            column.textContent = input.value.trim() || `New ${index + 1}`;
            
            column.addEventListener('input', () => {
                this.syncEditableTextToInputs();
            });
            column.addEventListener('blur', () => {
                this.syncEditableTextToInputs();
            });
            
            mainContainer.appendChild(column);
        });
        
        // Update sub text columns
        const subContainer = document.querySelector('.sub-text');
        subContainer.innerHTML = '';
        Array.from(subInputs).forEach((input, index) => {
            const column = document.createElement('div');
            column.className = 'sub-text-column editable-text';
            column.contentEditable = true;
            column.textContent = input.value.trim() || `Sub ${index + 1}`;
            
            column.addEventListener('input', () => {
                this.syncEditableTextToInputs();
            });
            column.addEventListener('blur', () => {
                this.syncEditableTextToInputs();
            });
            
            subContainer.appendChild(column);
        });
        
        // Update other preview elements
        this.updatePreview();
    }

    updateTextInputs(container, inputClass, columnCount, isMain) {
        const currentInputs = container.querySelectorAll(`.${inputClass}`);
        const currentValues = Array.from(currentInputs).map(input => input.value);

        // Clear existing inputs
        container.innerHTML = '';

        // Create new inputs
        for (let i = 0; i < columnCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = inputClass;
            input.placeholder = isMain ? `Column ${i + 1}` : `Sub Column ${i + 1}`;
            input.value = currentValues[i] || '';
            input.addEventListener('input', () => this.updatePreview());
            container.appendChild(input);
        }
    }

    setupMainTextInputs() {
        // Add event listeners to existing inputs
        document.querySelectorAll('.main-text-input').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });
    }
    
    setupSubTextInputs() {
        // Add event listeners to existing inputs
        document.querySelectorAll('.sub-text-input').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
        });
    }

    updatePreview() {
        const iconSelect = document.getElementById('icon-select').value;
        const height = document.getElementById('label-height').value;
        const width = document.getElementById('label-width').value;

        const labelPreview = document.getElementById('header-label-preview');
        const iconContainer = labelPreview.querySelector('.label-icon img');

        // Get icon path from either built-in icons or custom icons
        const iconPath = this.icons[iconSelect] || this.customIcons[iconSelect] || this.icons['heads_hex_socket'];
        if (iconContainer) {
            iconContainer.src = iconPath;
            iconContainer.alt = iconSelect;
        }

        labelPreview.setAttribute('data-height', height);
        labelPreview.style.width = `${width}mm`;

        // Check if sub text has any non-empty columns
        const subTextColumns = document.querySelectorAll('.sub-text-column');
        const hasSubText = Array.from(subTextColumns).some(col => col.textContent.trim());
        const subTextContainer = document.querySelector('.sub-text-container');
        
        if (!hasSubText) {
            subTextContainer.style.display = 'none';
        } else {
            subTextContainer.style.display = 'flex';
        }
    }

    async downloadPNG() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const height = parseInt(document.getElementById('label-height').value);
            const width = parseInt(document.getElementById('label-width').value);
            const mainTextInputs = document.querySelectorAll('.main-text-input');
            const mainTexts = Array.from(mainTextInputs).map(input => input.value.trim()).filter(text => text);
            const subTextInputs = document.querySelectorAll('.sub-text-input');
            const subTexts = Array.from(subTextInputs).map(input => input.value.trim()).filter(text => text);
            const iconSelect = document.getElementById('icon-select').value;
            const dpi = this.validateDPI(parseInt(document.getElementById('png-dpi').value) || 96);
            const shouldRotate = document.getElementById('png-rotate').checked;
            const mmToPx = dpi / 25.4;
            
            // Always set canvas to normal dimensions first (we'll rotate after drawing)
            canvas.width = width * mmToPx;
            canvas.height = height * mmToPx;

            // Always use transparent background

            const iconSize = (height - 2) * mmToPx;
            const iconX = 1 * mmToPx;
            const iconY = 1 * mmToPx;

            await this.drawIcon(ctx, iconX, iconY, iconSize, iconSelect);

            const textX = iconX + iconSize + (2 * mmToPx);
            const textAreaWidth = canvas.width - textX - (1 * mmToPx);

            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const mainFontSize = this.calculateFontSize(height);
            const subFontSize = mainFontSize * 0.75;

            ctx.font = `bold ${mainFontSize * mmToPx}px Arial`;
            const textY = subTexts.length > 0 ? iconY + (iconSize * 0.2) : iconY + (iconSize * 0.4);
            
            // Handle multiple columns for main text
            if (mainTexts.length === 0) {
                const defaultTexts = ['M3', 'M3', 'M3'];
                const columnWidth = textAreaWidth / defaultTexts.length;
                defaultTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    ctx.textAlign = 'left';
                    ctx.fillText(text, columnX, textY);
                });
            } else {
                const columnWidth = textAreaWidth / mainTexts.length;
                mainTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    ctx.textAlign = 'left';
                    ctx.fillText(text, columnX, textY);
                });
            }

            // Handle multiple columns for sub text
            ctx.font = `${subFontSize * mmToPx}px Arial`;
            ctx.fillStyle = '#666';
            const subTextY = textY + (mainFontSize * mmToPx * 1.2);
            
            if (subTexts.length === 0) {
                const defaultSubTexts = ['8 mm', '10 mm', '12 mm'];
                const columnWidth = textAreaWidth / defaultSubTexts.length;
                defaultSubTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    ctx.textAlign = 'left';
                    ctx.fillText(text, columnX, subTextY);
                });
            } else {
                const columnWidth = textAreaWidth / subTexts.length;
                subTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    ctx.textAlign = 'left';
                    ctx.fillText(text, columnX, subTextY);
                });
            }

            // Apply rotation if requested
            let finalCanvas = canvas;
            if (shouldRotate) {
                finalCanvas = this.rotateCanvas(canvas, 90);
            }
            
            // Save DPI setting to localStorage
            this.saveDPISettings();
            
            const link = document.createElement('a');
            const labelName = mainTexts.length > 0 ? mainTexts.join('_') : 'label';
            const rotation = shouldRotate ? '_rotated' : '';
            link.download = `label-${labelName.replace(/[^a-zA-Z0-9]/g, '_')}-${dpi}dpi${rotation}.png`;
            link.href = finalCanvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('PNG download failed:', error);
            alert('Failed to download PNG. Please try again.');
        }
    }

    async downloadSVG() {
        try {
            const height = parseInt(document.getElementById('label-height').value);
            const width = parseInt(document.getElementById('label-width').value);
            const mainTextInputs = document.querySelectorAll('.main-text-input');
            const mainTexts = Array.from(mainTextInputs).map(input => input.value.trim()).filter(text => text);
            const subTextInputs = document.querySelectorAll('.sub-text-input');
            const subTexts = Array.from(subTextInputs).map(input => input.value.trim()).filter(text => text);
            const iconSelect = document.getElementById('icon-select').value;
            const svg = await this.generateLabelSVG({
                height_mm: height,
                width_mm: width,
                columns: mainTexts.length > 0 ? mainTexts : ['M3', 'M3', 'M3'],
                subtext_columns: subTexts.length > 0 ? subTexts : ['8 mm', '10 mm', '12 mm'],
                icon: iconSelect
            });
            
            // Save DPI setting to localStorage
            this.saveDPISettings();

            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            const labelName = mainTexts.length > 0 ? mainTexts.join('_') : 'label';
            link.download = `label-${labelName.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('SVG download failed:', error);
            alert('Failed to download SVG. Please try again.');
        }
    }

    async generateLabelSVG(label) {
        const height = label.height_mm;
        const width = label.width_mm;
        const mainTexts = label.columns ? label.columns.filter(col => col.trim()) : [label.title];
        const subTexts = label.subtext_columns ? label.subtext_columns.filter(col => col.trim()) : (label.subtext ? [label.subtext] : []);
        const iconSelect = label.icon;
        const svgDpi = 96; // Fixed SVG DPI

        const iconSize = height - 2;
        const iconX = 1;
        const iconY = 1;
        const textX = iconX + iconSize + 2;
        const textAreaWidth = width - textX - 1;

        // Use 96 PPI for SVG (Inkscape standard)
        const dpi = 96;
        const mmToPx = dpi / 25.4; // ~3.78
        const baseFontSize = this.calculateFontSize(height);
        const mainFontSizePx = baseFontSize * mmToPx;
        const subFontSizePx = mainFontSizePx * 0.75;
        
        // Convert to px-based viewBox for consistent sizing with PNG
        const viewBoxWidth = width * mmToPx;
        const viewBoxHeight = height * mmToPx;
        const scale = mmToPx; // For converting mm coordinates to px

        let svgContent = `<svg width="${width}mm" height="${height}mm" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description>
        <dpi>${svgDpi}</dpi>
        <print-dpi>${svgDpi}</print-dpi>
      </rdf:Description>
    </rdf:RDF>
  </metadata>`;

        // Add icon - convert coordinates to pixel space
        const iconXPx = iconX * scale;
        const iconYPx = iconY * scale;
        const iconSizePx = iconSize * scale;
        
        const iconPath = this.icons[iconSelect] || this.customIcons[iconSelect] || this.icons['heads_hex_socket'];
        if (iconPath.endsWith('.svg')) {
            try {
                const response = await fetch(iconPath);
                const iconSvg = await response.text();
                const parser = new DOMParser();
                const iconDoc = parser.parseFromString(iconSvg, 'image/svg+xml');
                const iconSvgElement = iconDoc.documentElement;
                
                // Get original viewBox or width/height to calculate proper scale
                const viewBox = iconSvgElement.getAttribute('viewBox');
                let originalWidth = 100, originalHeight = 100; // fallback
                
                if (viewBox) {
                    const parts = viewBox.split(' ');
                    if (parts.length === 4) {
                        originalWidth = parseFloat(parts[2]);
                        originalHeight = parseFloat(parts[3]);
                    }
                } else {
                    const widthAttr = iconSvgElement.getAttribute('width');
                    const heightAttr = iconSvgElement.getAttribute('height');
                    if (widthAttr) originalWidth = parseFloat(widthAttr.replace(/\D/g, ''));
                    if (heightAttr) originalHeight = parseFloat(heightAttr.replace(/\D/g, ''));
                }
                
                // Calculate scale to fit icon in square
                const iconScale = iconSizePx / Math.max(originalWidth, originalHeight);
                
                // Extract the inner content and scale it properly
                const iconContent = iconSvgElement.innerHTML;
                svgContent += `<g transform="translate(${iconXPx},${iconYPx}) scale(${iconScale})">`;
                svgContent += iconContent;
                svgContent += '</g>';
            } catch (error) {
                console.error('Failed to embed SVG icon:', error);
            }
        } else {
            // For PNG icons, embed as image
            svgContent += `<image x="${iconXPx}" y="${iconYPx}" width="${iconSizePx}" height="${iconSizePx}" href="${iconPath}"/>`;
        }

        // Add main text - position so bottom of text is on horizontal centerline
        const textXPx = textX * scale;
        const textAreaWidthPx = textAreaWidth * scale;
        const centerYPx = viewBoxHeight / 2; // Horizontal centerline of label
        const textYPx = subTexts.length > 0 ? centerYPx : centerYPx;
        
        if (mainTexts.length === 1) {
            svgContent += `<text x="${textXPx}" y="${textYPx}" font-family="Arial, sans-serif" font-size="${mainFontSizePx}px" font-weight="bold" fill="black" dominant-baseline="bottom">${this.escapeXml(mainTexts[0])}</text>`;
        } else {
            const columnWidthPx = textAreaWidthPx / mainTexts.length;
            mainTexts.forEach((text, index) => {
                const columnXPx = textXPx + (index * columnWidthPx);
                svgContent += `<text x="${columnXPx}" y="${textYPx}" font-family="Arial, sans-serif" font-size="${mainFontSizePx}px" font-weight="bold" fill="black" dominant-baseline="bottom">${this.escapeXml(text)}</text>`;
            });
        }

        // Add sub text - position below main text with same spacing
        if (subTexts.length > 0) {
            const subTextYPx = textYPx + (mainFontSizePx * 0.3) + (subFontSizePx * 0.8); // Adjust spacing for new positioning
            if (subTexts.length === 1) {
                svgContent += `<text x="${textXPx}" y="${subTextYPx}" font-family="Arial, sans-serif" font-size="${subFontSizePx}px" fill="#666" dominant-baseline="bottom">${this.escapeXml(subTexts[0])}</text>`;
            } else {
                const columnWidthPx = textAreaWidthPx / subTexts.length;
                subTexts.forEach((text, index) => {
                    const columnXPx = textXPx + (index * columnWidthPx);
                    svgContent += `<text x="${columnXPx}" y="${subTextYPx}" font-family="Arial, sans-serif" font-size="${subFontSizePx}px" fill="#666" dominant-baseline="bottom">${this.escapeXml(text)}</text>`;
                });
            }
        }

        svgContent += '</svg>';
        return svgContent;
    }

    escapeXml(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&apos;');
    }

    calculateFontSize(height) {
        switch(height) {
            case 9: return 3;
            case 12: return 4;
            case 18: return 6.5;
            case 24: return 8;
            default: return 4;
        }
    }

    async drawIcon(ctx, x, y, size, iconType) {
        const iconPath = this.icons[iconType] || this.customIcons[iconType] || this.icons['heads_hex_socket'];
        
        return new Promise((resolve, reject) => {
            if (iconPath.endsWith('.svg')) {
                // Handle SVG icons
                fetch(iconPath)
                    .then(response => response.text())
                    .then(svgText => {
                        const img = new Image();
                        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(svgBlob);
                        
                        img.onload = () => {
                            try {
                                ctx.drawImage(img, x, y, size, size);
                                URL.revokeObjectURL(url);
                                resolve();
                            } catch (error) {
                                URL.revokeObjectURL(url);
                                reject(error);
                            }
                        };
                        
                        img.onerror = (error) => {
                            URL.revokeObjectURL(url);
                            console.error('Failed to load SVG icon:', iconPath, error);
                            reject(error);
                        };
                        
                        img.src = url;
                    })
                    .catch(error => {
                        console.error('Failed to fetch SVG:', iconPath, error);
                        reject(error);
                    });
            } else {
                // Handle PNG/JPG icons
                const img = new Image();
                img.onload = () => {
                    try {
                        ctx.drawImage(img, x, y, size, size);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };
                img.onerror = (error) => {
                    console.error('Failed to load icon:', iconPath, error);
                    reject(error);
                };
                img.src = iconPath;
            }
        });
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.style.display = 'none');
                
                button.classList.add('active');
                document.getElementById(`${targetTab}-tab`).style.display = 'block';
                
                // Refresh CodeMirror editor when batch tab becomes visible
                if (targetTab === 'batch' && this.yamlEditor) {
                    setTimeout(() => {
                        this.yamlEditor.refresh();
                    }, 100);
                }
            });
        });
    }

    validateYAML() {
        const yamlInput = this.yamlEditor ? this.yamlEditor.getValue().trim() : document.getElementById('yaml-input').value.trim();
        const resultDiv = document.getElementById('validation-result');
        
        if (!yamlInput) {
            this.showValidationResult('Please enter YAML content to validate.', 'error');
            return;
        }

        try {
            const parsed = this.parseYAML(yamlInput);
            const validation = this.validateLabels(parsed);
            
            if (validation.isValid) {
                this.showValidationResult(`✅ YAML is valid! Found ${validation.labelCount} labels.`, 'success');
            } else {
                this.showValidationResult(`❌ Validation failed:\n${validation.errors.join('\n')}`, 'error');
            }
        } catch (error) {
            this.showValidationResult(`❌ YAML parsing error: ${error.message}`, 'error');
        }
    }

    async generateZIP() {
        const yamlInput = this.yamlEditor ? this.yamlEditor.getValue().trim() : document.getElementById('yaml-input').value.trim();
        
        if (!yamlInput) {
            this.showValidationResult('Please enter YAML content first.', 'error');
            return;
        }

        try {
            const parsed = this.parseYAML(yamlInput);
            const validation = this.validateLabels(parsed);
            
            if (!validation.isValid) {
                this.showValidationResult(`❌ Cannot generate ZIP: ${validation.errors.join(', ')}`, 'error');
                return;
            }

            this.showValidationResult('⏳ Generating labels and creating ZIP...', 'warning');
            
            const labels = parsed.labels;
            const zip = new JSZip();
            
            // Check for export options from YAML settings
            const generateLongPng = parsed.long_png || false;
            const includeCutMarks = parsed.cut_marks || false;
            const generateSvg = parsed.export_svg || false;
            
            // Generate individual labels
            for (let i = 0; i < labels.length; i++) {
                const label = labels[i];
                const titleText = label.title || (label.columns ? label.columns.join('_') : 'label');
                
                // Generate PNG
                const canvas = await this.generateLabelCanvas(label);
                const imageData = canvas.toDataURL().split(',')[1];
                const pngFilename = `label_${i + 1}_${titleText.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
                zip.file(pngFilename, imageData, { base64: true });
                
                // Generate SVG if requested
                if (generateSvg) {
                    const svgContent = await this.generateLabelSVG(label);
                    const svgFilename = `label_${i + 1}_${titleText.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
                    zip.file(svgFilename, svgContent);
                }
            }
            
            // Generate long PNG strip if requested
            if (generateLongPng) {
                const longPngCanvas = await this.generateLongPngStrip(labels, includeCutMarks);
                const longPngData = longPngCanvas.toDataURL().split(',')[1];
                
                // Calculate total strip length - no extra space for cut marks
                const totalStripLength = labels.reduce((sum, label) => sum + label.width_mm, 0);
                
                const longPngFilename = `labels_strip_${totalStripLength}mm.png`;
                
                zip.file(longPngFilename, longPngData, { base64: true });
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'hardware_labels.zip';
            link.click();
            
            let message = `✅ ZIP generated successfully with ${labels.length} labels!`;
            if (generateLongPng) {
                message += ' Long PNG strip included.';
            }
            if (generateSvg) {
                message += ' SVG files included.';
            }
            
            this.showValidationResult(message, 'success');
            
        } catch (error) {
            this.showValidationResult(`❌ Error generating ZIP: ${error.message}`, 'error');
        }
    }

    parseYAML(yamlString) {
        const lines = yamlString.split('\n');
        const result = { labels: [] };
        let currentLabel = null;
        let inLabels = false;
        let currentArray = null;
        let currentArrayKey = null;

        for (let line of lines) {
            const originalLine = line;
            line = line.trim();
            if (!line || line.startsWith('#')) continue;

            if (line === 'labels:') {
                inLabels = true;
                continue;
            }

            if (inLabels) {
                if (line.startsWith('- ') && originalLine.match(/^  - /)) {
                    // New label item (starts with exactly 2 spaces + dash)
                    if (currentLabel) {
                        // Finish any pending array
                        if (currentArray && currentArrayKey && currentArray.length > 0) {
                            currentLabel[currentArrayKey] = currentArray;
                        }
                        if (Object.keys(currentLabel).length > 0) {
                            result.labels.push(currentLabel);
                        }
                    }
                    currentLabel = {};
                    currentArray = null;
                    currentArrayKey = null;
                    
                    const keyValue = line.substring(2).trim();
                    if (keyValue.includes(':')) {
                        const [key, value] = keyValue.split(':', 2);
                        const trimmedKey = key.trim();
                        const trimmedValue = value.trim();
                        if (trimmedKey && trimmedValue) {
                            currentLabel[trimmedKey] = this.parseValue(trimmedValue);
                        }
                    }
                } else if (line.startsWith('- ') && originalLine.match(/^      - /) && currentArray) {
                    // Array item (starts with exactly 6 spaces + dash)
                    const value = line.substring(2).trim();
                    currentArray.push(this.parseValue(value));
                } else if (line.includes(':') && currentLabel) {
                    // Finish previous array if exists
                    if (currentArray && currentArrayKey && currentArray.length > 0) {
                        currentLabel[currentArrayKey] = currentArray;
                    }
                    
                    const [key, value] = line.split(':', 2);
                    const trimmedKey = key.trim();
                    const trimmedValue = value.trim();
                    if (trimmedKey) {
                        // Check if the value is just a comment (starts with #)
                        const parsedValue = this.parseValue(trimmedValue);
                        if (trimmedValue && !trimmedValue.startsWith('#') && parsedValue !== '') {
                            // Has real value on same line
                            currentLabel[trimmedKey] = parsedValue;
                            currentArray = null;
                            currentArrayKey = null;
                        } else {
                            // Start of array - prepare to collect items (empty value or comment only)
                            currentArray = [];
                            currentArrayKey = trimmedKey;
                        }
                    }
                }
            } else {
                // Handle global options outside of labels
                if (line.includes(':')) {
                    const [key, value] = line.split(':', 2);
                    const trimmedKey = key.trim();
                    if (trimmedKey === 'long_png' || trimmedKey === 'cut_marks' || trimmedKey === 'export_svg' || trimmedKey === 'width_mm' || trimmedKey === 'height_mm') {
                        result[trimmedKey] = this.parseValue(value.trim());
                    }
                }
            }
        }

        if (currentLabel) {
            // Finish any pending array
            if (currentArray && currentArrayKey && currentArray.length > 0) {
                currentLabel[currentArrayKey] = currentArray;
            }
            if (Object.keys(currentLabel).length > 0) {
                result.labels.push(currentLabel);
            }
        }

        return result;
    }

    parseValue(value) {
        // Remove inline comments
        const commentIndex = value.indexOf('#');
        if (commentIndex !== -1) {
            value = value.substring(0, commentIndex).trim();
        }
        
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1);
        }
        if (value.startsWith("'") && value.endsWith("'")) {
            return value.slice(1, -1);
        }
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        if (!isNaN(value) && value !== '') {
            return Number(value);
        }
        return value;
    }

    validateLabels(parsed) {
        const errors = [];
        const validHeights = [9, 12, 18, 24];
        
        if (!parsed.labels || !Array.isArray(parsed.labels)) {
            errors.push('Missing or invalid "labels" array');
            return { isValid: false, errors, labelCount: 0 };
        }

        if (parsed.labels.length === 0) {
            errors.push('No labels found');
            return { isValid: false, errors, labelCount: 0 };
        }

        // Validate optional global settings
        if (parsed.long_png !== undefined && typeof parsed.long_png !== 'boolean') {
            errors.push('Invalid long_png setting. Must be true or false if provided');
        }
        
        if (parsed.cut_marks !== undefined && typeof parsed.cut_marks !== 'boolean') {
            errors.push('Invalid cut_marks setting. Must be true or false if provided');
        }
        
        if (parsed.export_svg !== undefined && typeof parsed.export_svg !== 'boolean') {
            errors.push('Invalid export_svg setting. Must be true or false if provided');
        }

        // Validate global width_mm and height_mm
        if (parsed.width_mm !== undefined && (typeof parsed.width_mm !== 'number' || parsed.width_mm < 20 || parsed.width_mm > 100)) {
            errors.push('Invalid global width_mm. Must be a number between 20 and 100 if provided');
        }
        
        if (parsed.height_mm !== undefined && (typeof parsed.height_mm !== 'number' || !validHeights.includes(parsed.height_mm))) {
            errors.push(`Invalid global height_mm. Must be one of: ${validHeights.join(', ')} if provided`);
        }

        parsed.labels.forEach((label, index) => {
            const labelNum = index + 1;
            
            // Normalize maintext_columns to columns for backwards compatibility
            if (label.maintext_columns && !label.columns) {
                label.columns = label.maintext_columns;
            }
            
            // Apply global defaults
            if (!label.width_mm && parsed.width_mm) {
                label.width_mm = parsed.width_mm;
            }
            if (!label.height_mm && parsed.height_mm) {
                label.height_mm = parsed.height_mm;
            }
            
            // Check for either title (single column) or columns (multi-column)
            if (!label.title && !label.columns) {
                errors.push(`Label ${labelNum}: Missing title or columns (or maintext_columns)`);
            } else if (label.title && label.columns) {
                errors.push(`Label ${labelNum}: Cannot have both title and columns. Use either title for single column or columns/maintext_columns for multi-column`);
            } else if (label.title && typeof label.title !== 'string') {
                errors.push(`Label ${labelNum}: Invalid title. Must be a string`);
            } else if (label.columns && (!Array.isArray(label.columns) || label.columns.length === 0 || label.columns.length > 4)) {
                errors.push(`Label ${labelNum}: Invalid columns/maintext_columns. Must be an array with 1-4 string elements`);
            } else if (label.columns && label.columns.some(col => typeof col !== 'string')) {
                errors.push(`Label ${labelNum}: Invalid columns/maintext_columns. All column values must be strings`);
            }
            
            if (!label.icon || typeof label.icon !== 'string') {
                errors.push(`Label ${labelNum}: Missing or invalid icon`);
            } else if (!this.availableIcons.includes(label.icon)) {
                errors.push(`Label ${labelNum}: Invalid icon "${label.icon}". Must be one of: ${this.availableIcons.join(', ')}`);
            }
            
            if (!label.width_mm || typeof label.width_mm !== 'number' || label.width_mm < 20 || label.width_mm > 100) {
                errors.push(`Label ${labelNum}: Invalid width_mm. Must be a number between 20 and 100`);
            }
            
            if (!label.height_mm || typeof label.height_mm !== 'number' || !validHeights.includes(label.height_mm)) {
                errors.push(`Label ${labelNum}: Invalid height_mm. Must be one of: ${validHeights.join(', ')}`);
            }
            
            if (label.subtext && typeof label.subtext !== 'string') {
                errors.push(`Label ${labelNum}: Invalid subtext. Must be a string if provided`);
            }
            
            if (label.subtext_columns && (!Array.isArray(label.subtext_columns) || label.subtext_columns.length === 0 || label.subtext_columns.length > 4)) {
                errors.push(`Label ${labelNum}: Invalid subtext_columns. Must be an array with 1-4 string elements if provided`);
            } else if (label.subtext_columns && label.subtext_columns.some(col => typeof col !== 'string')) {
                errors.push(`Label ${labelNum}: Invalid subtext_columns. All column values must be strings`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            labelCount: parsed.labels.length
        };
    }

    async generateLabelCanvas(label) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Normalize maintext_columns to columns for backwards compatibility
        if (label.maintext_columns && !label.columns) {
            label.columns = label.maintext_columns;
        }
        
        const height = label.height_mm;
        const width = label.width_mm;
        const mainTexts = label.columns ? label.columns.filter(col => col.trim()) : [label.title];
        const subTexts = label.subtext_columns ? label.subtext_columns.filter(col => col.trim()) : (label.subtext ? [label.subtext] : []);
        const iconSelect = label.icon;

        const dpi = 300;
        const mmToPx = dpi / 25.4;
        
        canvas.width = width * mmToPx;
        canvas.height = height * mmToPx;

        // Always use transparent background

        const iconSize = (height - 2) * mmToPx;
        const iconX = 1 * mmToPx;
        const iconY = 1 * mmToPx;

        await this.drawIcon(ctx, iconX, iconY, iconSize, iconSelect);

        const textX = iconX + iconSize + (2 * mmToPx);
        const textAreaWidth = canvas.width - textX - (1 * mmToPx);

        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const mainFontSize = this.calculateFontSize(height);
        const subFontSize = mainFontSize * 0.75;

        ctx.font = `bold ${mainFontSize * mmToPx}px Arial`;
        const textY = subTexts.length > 0 ? iconY + (iconSize * 0.2) : iconY + (iconSize * 0.4);
        
        // Handle multiple columns for main text
        if (mainTexts.length === 1) {
            ctx.fillText(mainTexts[0], textX, textY);
        } else {
            const columnWidth = textAreaWidth / mainTexts.length;
            mainTexts.forEach((text, index) => {
                const columnX = textX + (index * columnWidth);
                ctx.textAlign = 'left';
                ctx.fillText(text, columnX, textY);
            });
        }

        // Handle multiple columns for sub text
        if (subTexts.length > 0) {
            ctx.font = `${subFontSize * mmToPx}px Arial`;
            ctx.fillStyle = '#666';
            const subTextY = textY + (mainFontSize * mmToPx * 1.2);
            
            if (subTexts.length === 1) {
                ctx.fillText(subTexts[0], textX, subTextY);
            } else {
                const columnWidth = textAreaWidth / subTexts.length;
                subTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    ctx.textAlign = 'left';
                    ctx.fillText(text, columnX, subTextY);
                });
            }
        }

        return canvas;
    }

    async generateLongPngStrip(labels, includeCutMarks) {
        const dpi = 300;
        const mmToPx = dpi / 25.4;
        
        // Calculate dimensions - horizontal strip
        const firstLabel = labels[0];
        const labelHeight = firstLabel.height_mm * mmToPx;
        
        let totalWidth = 0;
        const labelCanvases = [];
        
        // Generate individual label canvases and calculate total width
        for (const label of labels) {
            const canvas = await this.generateLabelCanvas(label);
            labelCanvases.push(canvas);
            totalWidth += canvas.width;
            // No extra space for cut marks - they're just visual lines
        }
        
        // Create the horizontal strip canvas
        const stripCanvas = document.createElement('canvas');
        const stripCtx = stripCanvas.getContext('2d');
        
        stripCanvas.width = totalWidth;
        stripCanvas.height = labelHeight;
        
        // Fill with white background
        stripCtx.fillStyle = 'white';
        stripCtx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);
        
        // Draw labels and cut marks horizontally
        let currentX = 0;
        
        for (let i = 0; i < labelCanvases.length; i++) {
            const labelCanvas = labelCanvases[i];
            
            // Draw the label
            stripCtx.drawImage(labelCanvas, currentX, 0);
            currentX += labelCanvas.width;
            
            // Draw cut marks between labels (except after the last one) - no space taken
            if (i < labelCanvases.length - 1 && includeCutMarks) {
                this.drawCutMarks(stripCtx, currentX, labelHeight);
            }
        }
        
        return stripCanvas;
    }
    
    drawCutMarks(ctx, x, labelHeight) {
        const cutMarkLength = labelHeight * 0.1; // 10% of label height
        const cutMarkThickness = 1;
        
        ctx.strokeStyle = '#666';
        ctx.lineWidth = cutMarkThickness;
        
        // Draw cut mark at the exact boundary between labels
        
        // Top cut mark
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cutMarkLength);
        ctx.stroke();
        
        // Bottom cut mark
        ctx.beginPath();
        ctx.moveTo(x, labelHeight - cutMarkLength);
        ctx.lineTo(x, labelHeight);
        ctx.stroke();
    }

    showValidationResult(message, type) {
        const resultDiv = document.getElementById('validation-result');
        resultDiv.className = `validation-result ${type}`;
        resultDiv.innerHTML = message.replace(/\n/g, '<br>');
        resultDiv.style.display = 'block';
    }

    loadAvailableIcons() {
        // Use all available icons from the icon picker + custom icons
        this.availableIcons = Object.keys(this.icons).concat(Object.keys(this.customIcons));
        // Only generate prompt if YAML editor is ready
        if (this.yamlEditor) {
            this.generatePrompt();
        }
    }

    loadCustomIcons() {
        try {
            const stored = localStorage.getItem('customIcons');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading custom icons:', error);
            return {};
        }
    }

    saveCustomIcons() {
        try {
            localStorage.setItem('customIcons', JSON.stringify(this.customIcons));
        } catch (error) {
            console.error('Error saving custom icons:', error);
        }
    }

    initializeIconUpload() {
        const uploadBtn = document.getElementById('upload-icon-btn');
        const fileInput = document.getElementById('icon-upload');

        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.handleIconUpload(file);
            }
        });
    }

    async handleIconUpload(file) {
        // Validate file type
        if (!file.type.startsWith('image/png')) {
            alert('Please upload a PNG image file.');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB.');
            return;
        }

        try {
            // Create image element to validate dimensions
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const imageDataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    // Validate minimum size
                    if (img.width < 32 || img.height < 32) {
                        alert('Image must be at least 32x32 pixels.');
                        reject(new Error('Too small'));
                        return;
                    }

                    // Resize to standard size, maintaining aspect ratio and centering
                    const targetSize = 128;
                    canvas.width = targetSize;
                    canvas.height = targetSize;
                    
                    // Fill with white background
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, targetSize, targetSize);
                    
                    // Calculate scaling to fit within target size while maintaining aspect ratio
                    const scale = Math.min(targetSize / img.width, targetSize / img.height);
                    const scaledWidth = img.width * scale;
                    const scaledHeight = img.height * scale;
                    
                    // Center the image
                    const offsetX = (targetSize - scaledWidth) / 2;
                    const offsetY = (targetSize - scaledHeight) / 2;
                    
                    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
                    
                    resolve();
                };
                img.onerror = reject;
                img.src = imageDataUrl;
            });

            // Get processed image data
            const processedDataUrl = canvas.toDataURL('image/png');
            
            // Generate unique name for the icon
            const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
            let iconName = `Custom_${baseName}`;
            let counter = 1;
            
            // Ensure unique name
            while (this.icons[iconName] || this.customIcons[iconName]) {
                iconName = `Custom_${baseName}_${counter}`;
                counter++;
            }

            // Save to custom icons
            this.customIcons[iconName] = processedDataUrl;
            this.saveCustomIcons();
            
            // Update available icons list
            this.loadAvailableIcons();
            
            // Refresh the icon picker
            this.populateIconGrid();
            
            // Auto-select the new icon
            this.selectIcon(iconName);
            
            alert(`✅ Icon "${iconName}" uploaded successfully!`);
            
        } catch (error) {
            console.error('Error processing uploaded icon:', error);
            if (error.message !== 'Too small') {
                alert('Error processing uploaded image. Please try again.');
            }
        }
    }
    
    

    generatePrompt() {
        const yamlTemplate = `# Hardware Label Generator - Batch YAML Template
#
# 💡 TIP: Copy this template to your favorite LLM tool (ChatGPT, Claude, etc.) 
#         and ask it to generate labels for your specific hardware collection!
#         Example prompt: "Generate 20 labels for my M3-M8 bolt collection with various lengths"
#
# Available icons: ${this.availableIcons.join(', ')}

# Global settings (optional - applied to all labels unless overridden)
long_png: true        # Generate one continuous PNG strip of all labels
cut_marks: true       # Add cut marks between labels for easy trimming  
export_svg: true      # Also generate SVG files (vector format, scalable)
width_mm: 50          # Default width for all labels (20-100mm)
height_mm: 12         # Default height for all labels (9, 12, 18, or 24mm)

labels:
  # Multi-column label example (great for drawer compartments)
  - icon: "heads_hex_socket"            # Icon to display on the left
    maintext_columns:                   # Main text columns (1-4 columns max)
      - "M3"
      - "M3" 
      - "M3"
    subtext_columns:                    # Optional sub-text columns
      - "8 mm"
      - "10 mm"
      - "12 mm"

  # Another multi-column example
  - icon: "heads_hex_socket"
    maintext_columns:
      - "M4"
      - "M4"
      - "M4"
    subtext_columns:
      - "14 mm"
      - "16 mm"
      - "18 mm"

# Single column alternatives (if you prefer):
# - title: "M5 × 20"                   # Single main text
#   subtext: "DIN 7984"                # Optional single sub-text  
#   icon: "fasteners_screw_hex"
#   width_mm: 45                       # Override global width
#   height_mm: 18                      # Override global height
`;
        
        // Set the template in the YAML editor
        if (this.yamlEditor) {
            this.yamlEditor.setValue(yamlTemplate);
        } else {
            document.getElementById('yaml-input').value = yamlTemplate;
        }
    }

    initializeYamlEditor() {
        // Wait for CodeMirror to be available
        if (typeof CodeMirror === 'undefined') {
            setTimeout(() => this.initializeYamlEditor(), 100);
            return;
        }

        const yamlTextarea = document.getElementById('yaml-input');
        
        this.yamlEditor = CodeMirror.fromTextArea(yamlTextarea, {
            mode: 'yaml',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 2,
            tabSize: 2,
            indentWithTabs: false,
            autoCloseBrackets: true,
            matchBrackets: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            placeholder: 'Paste your YAML here...'
        });

        // Set initial size
        this.yamlEditor.setSize(null, 400);

        // Add class to indicate CodeMirror loaded successfully
        document.body.classList.add('codemirror-loaded');

        // Update the editor when the tab becomes visible
        this.yamlEditor.refresh();
        
        // Load template after editor is ready
        this.generatePrompt();
        
    }

    initializeIconPicker() {
        const iconCategories = {
            'Electronics': ['electronics_wago_logo', 'electronics_wago_alt1', 'electronics_wago_alt2', 'electronics_wire_nut', 'electronics_generic'],
            'Screw Heads': ['heads_cross', 'heads_hex_external', 'heads_hex_socket', 'heads_phillips', 'heads_pozidrive', 'heads_robertson', 'heads_slotted', 'heads_square_external', 'heads_ta', 'heads_torx', 'heads_torx_tamperproof'],
            'Inserts': ['inserts_heat', 'inserts_wood'],
            'Nuts': ['nuts_nut_cap', 'nuts_nut_lock', 'nuts_nut_standard'],
            'Screws': ['fasteners_screw_round', 'fasteners_screw_tbolt', 'fasteners_screw_truss', 'fasteners_screw_truss_modified', 'fasteners_screw_wafer', 'fasteners_screw_bugle', 'fasteners_screw_fillister', 'fasteners_screw_flat', 'fasteners_screw_hex', 'fasteners_screw_oval', 'fasteners_screw_pan', 'fasteners_screw_pan_hex', 'fasteners_screw_thumb_knurled', 'fasteners_screw_trim', 'fasteners_thumb_screw'],
            'Washers': ['washers_fender', 'washers_flat', 'washers_split', 'washers_star_exterior', 'washers_star_interior']
        };

        const iconNames = {
            'electronics_wago_logo': 'Wago Logo',
            'electronics_wago_alt1': 'Wago Alt 1',
            'electronics_wago_alt2': 'Wago Alt 2',
            'electronics_wire_nut': 'Wire Nut',
            'electronics_generic': 'Generic Electrical',
            'heads_cross': 'Cross Head',
            'heads_hex_external': 'Hex External',
            'heads_hex_socket': 'Hex Socket',
            'heads_phillips': 'Phillips Head',
            'heads_pozidrive': 'Pozidrive',
            'heads_robertson': 'Robertson Head',
            'heads_slotted': 'Slotted Head',
            'heads_square_external': 'Square External',
            'heads_ta': 'TA Head',
            'heads_torx': 'Torx Head',
            'heads_torx_tamperproof': 'Torx Tamperproof',
            'inserts_heat': 'Heat Insert',
            'inserts_wood': 'Wood Insert',
            'nuts_nut_cap': 'Cap Nut',
            'nuts_nut_lock': 'Lock Nut',
            'nuts_nut_standard': 'Standard Nut',
            'fasteners_screw_round': 'Round Screw',
            'fasteners_screw_tbolt': 'T-Bolt',
            'fasteners_screw_truss': 'Truss Screw',
            'fasteners_screw_truss_modified': 'Truss Modified',
            'fasteners_screw_wafer': 'Wafer Screw',
            'fasteners_screw_bugle': 'Bugle Screw',
            'fasteners_screw_fillister': 'Fillister Screw',
            'fasteners_screw_flat': 'Flat Screw',
            'fasteners_screw_hex': 'Hex Screw',
            'fasteners_screw_oval': 'Oval Screw',
            'fasteners_screw_pan': 'Pan Screw',
            'fasteners_screw_pan_hex': 'Pan Hex Screw',
            'fasteners_screw_thumb_knurled': 'Thumb Knurled',
            'fasteners_screw_trim': 'Trim Screw',
            'fasteners_thumb_screw': 'Thumb Screw',
            'washers_fender': 'Fender Washer',
            'washers_flat': 'Flat Washer',
            'washers_split': 'Split Washer',
            'washers_star_exterior': 'Star Exterior',
            'washers_star_interior': 'Star Interior'
        };

        this.iconCategories = iconCategories;
        this.iconNames = iconNames;
        this.selectedIcon = 'heads_hex_socket';

        // Populate the icon grid
        this.populateIconGrid();

        // Search functionality
        const searchInput = document.getElementById('icon-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterIcons(e.target.value);
            });
        }
    }

    populateIconGrid() {
        const grid = document.getElementById('icon-grid');
        grid.innerHTML = '';

        // Add custom icons first if they exist
        if (Object.keys(this.customIcons).length > 0) {
            const customCategoryDiv = document.createElement('div');
            customCategoryDiv.className = 'icon-picker-category custom-icon-category';
            customCategoryDiv.textContent = 'Custom Icons';
            grid.appendChild(customCategoryDiv);

            Object.keys(this.customIcons).forEach(iconKey => {
                const iconDiv = document.createElement('div');
                iconDiv.className = 'icon-picker-item';
                iconDiv.dataset.icon = iconKey;
                iconDiv.innerHTML = `
                    <img src="${this.customIcons[iconKey]}" alt="${iconKey}">
                    <span>${iconKey.replace('Custom_', '').replace(/_/g, ' ')}</span>
                    <button class="delete-icon-btn" onclick="event.stopPropagation(); labelMaker.deleteCustomIcon('${iconKey}')">×</button>
                `;

                iconDiv.addEventListener('click', () => {
                    this.selectIcon(iconKey);
                });

                if (iconKey === this.selectedIcon) {
                    iconDiv.classList.add('selected');
                }

                grid.appendChild(iconDiv);
            });
        }

        // Add built-in icons
        Object.entries(this.iconCategories).forEach(([category, icons]) => {
            // Add category header
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'icon-picker-category';
            categoryDiv.textContent = category;
            grid.appendChild(categoryDiv);

            // Add icons
            icons.forEach(iconKey => {
                const iconDiv = document.createElement('div');
                iconDiv.className = 'icon-picker-item';
                iconDiv.dataset.icon = iconKey;
                iconDiv.innerHTML = `
                    <img src="${this.icons[iconKey]}" alt="${iconKey}">
                    <span>${this.iconNames[iconKey]}</span>
                `;

                iconDiv.addEventListener('click', () => {
                    this.selectIcon(iconKey);
                });

                if (iconKey === this.selectedIcon) {
                    iconDiv.classList.add('selected');
                }

                grid.appendChild(iconDiv);
            });
        });
    }

    selectIcon(iconKey) {
        this.selectedIcon = iconKey;
        
        // Get icon path and display name
        const iconPath = this.icons[iconKey] || this.customIcons[iconKey];
        const displayName = this.iconNames[iconKey] || iconKey.replace('Custom_', '').replace(/_/g, ' ');
        
        // Update the selected icon display
        const selectedIconDiv = document.querySelector('.selected-icon');
        selectedIconDiv.dataset.icon = iconKey;
        selectedIconDiv.innerHTML = `
            <img src="${iconPath}" alt="${iconKey}">
            <span>${displayName}</span>
        `;

        // Update the hidden select for compatibility
        const selectElement = document.getElementById('icon-select');
        selectElement.value = iconKey;
        selectElement.innerHTML = `<option value="${iconKey}" selected>${displayName}</option>`;

        // Update grid selection
        document.querySelectorAll('.icon-picker-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.icon === iconKey);
        });

        // Close picker and update preview
        this.closeIconPicker();
        this.updatePreview();
    }

    openIconPicker() {
        const iconPicker = document.getElementById('icon-picker');
        const overlay = document.querySelector('.icon-picker-overlay');
        
        if (iconPicker && overlay) {
            iconPicker.style.display = 'block';
            overlay.classList.add('active');
            
            // Focus search input
            setTimeout(() => {
                const searchInput = document.getElementById('icon-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        }
    }

    closeIconPicker() {
        const iconPicker = document.getElementById('icon-picker');
        const overlay = document.querySelector('.icon-picker-overlay');
        
        if (iconPicker && overlay) {
            iconPicker.style.display = 'none';
            overlay.classList.remove('active');
            
            // Clear search
            const searchInput = document.getElementById('icon-search');
            if (searchInput) {
                searchInput.value = '';
                this.filterIcons('');
            }
        }
    }

    filterIcons(searchTerm) {
        const items = document.querySelectorAll('.icon-picker-item');
        const categories = document.querySelectorAll('.icon-picker-category');
        
        searchTerm = searchTerm.toLowerCase();
        
        items.forEach(item => {
            const iconKey = item.dataset.icon;
            const iconName = (this.iconNames[iconKey] || iconKey.replace('Custom_', '').replace(/_/g, ' ')).toLowerCase();
            const matches = iconName.includes(searchTerm) || iconKey.toLowerCase().includes(searchTerm);
            
            item.style.display = matches ? 'flex' : 'none';
        });

        // Show/hide categories based on whether they have visible items
        categories.forEach(category => {
            let hasVisibleItems = false;
            let sibling = category.nextElementSibling;
            
            while (sibling && !sibling.classList.contains('icon-picker-category')) {
                if (sibling.style.display !== 'none') {
                    hasVisibleItems = true;
                    break;
                }
                sibling = sibling.nextElementSibling;
            }
            
            category.style.display = hasVisibleItems ? 'block' : 'none';
        });
    }

    deleteCustomIcon(iconKey) {
        if (confirm(`Are you sure you want to delete the custom icon "${iconKey}"?`)) {
            delete this.customIcons[iconKey];
            this.saveCustomIcons();
            this.loadAvailableIcons();
            this.populateIconGrid();
            
            // If this was the selected icon, switch to default
            if (this.selectedIcon === iconKey) {
                this.selectIcon('heads_hex_socket');
            }
        }
    }

    validateDPI(dpi) {
        // Validate DPI is within acceptable range
        if (isNaN(dpi) || dpi < 50 || dpi > 1200) {
            return 96; // Default fallback
        }
        return dpi;
    }

    rotateCanvas(canvas, degrees) {
        const rotatedCanvas = document.createElement('canvas');
        const rotatedCtx = rotatedCanvas.getContext('2d');
        
        // For 90 degree rotation, swap width and height
        if (degrees === 90) {
            rotatedCanvas.width = canvas.height;
            rotatedCanvas.height = canvas.width;
            
            // Translate and rotate
            rotatedCtx.translate(canvas.height, 0);
            rotatedCtx.rotate(Math.PI / 2);
        }
        
        // Draw the original canvas onto the rotated canvas
        rotatedCtx.drawImage(canvas, 0, 0);
        
        return rotatedCanvas;
    }

    loadDPISettings() {
        try {
            const settings = localStorage.getItem('dpiSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                if (parsed.pngDpi) {
                    document.getElementById('png-dpi').value = this.validateDPI(parsed.pngDpi);
                }
                // SVG DPI removed - using fixed 96 DPI
                if (parsed.pngRotate !== undefined) {
                    document.getElementById('png-rotate').checked = parsed.pngRotate;
                }
            }
        } catch (error) {
            console.error('Error loading DPI settings:', error);
        }
    }

    saveDPISettings() {
        try {
            const settings = {
                pngDpi: parseInt(document.getElementById('png-dpi').value),
                pngRotate: document.getElementById('png-rotate').checked
            };
            localStorage.setItem('dpiSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving DPI settings:', error);
        }
    }
}


let labelMaker;

document.addEventListener('DOMContentLoaded', () => {
    labelMaker = new LabelMaker();
});
