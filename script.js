class LabelMaker {
    constructor() {
        this.icons = this.loadIconsFromStructure();
        
        this.customIcons = this.loadCustomIcons();
        // Global alignment state
        this.globalMainTextAlign = 'left';
        this.globalSubTextAlign = 'left';
        // Track which icon selector is currently active (1 or 2)
        this.currentIconSelector = 1;
        // Store icons for each selector
        this.selectedIcon1 = 'heads_hex_socket';
        this.selectedIcon2 = 'heads_hex_socket';
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
                'pozidriv': 'Pozidriv',
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

    setupEditableTextHandlers(element) {
        const resetScroll = () => {
            element.scrollLeft = 0;
            // Force selection to start if text is focused
            if (document.activeElement === element) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    if (range.endOffset > element.textContent.length || element.scrollLeft > 0) {
                        element.scrollLeft = 0;
                    }
                }
            }
        };

        element.addEventListener('input', () => {
            this.syncEditableTextToInputs();
            // Force scroll to beginning to show start of text
            setTimeout(resetScroll, 0);
        });
        
        element.addEventListener('blur', () => {
            this.syncEditableTextToInputs();
            resetScroll();
        });

        element.addEventListener('focus', () => {
            resetScroll();
        });

        element.addEventListener('keyup', () => {
            resetScroll();
        });
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
        
        // Icon count selector
        document.querySelectorAll('.icon-count-selector .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Get the button element (in case user clicked on icon inside)
                const button = e.currentTarget;
                
                // Update active state
                document.querySelectorAll('.icon-count-selector .btn').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                // Update icon display in button
                this.updateIconCountDisplay();
                
                // Update preview
                this.updatePreview();
            });
        });
        
        // Global text alignment selectors
        document.querySelectorAll('.global-main-align-selector .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Get the button element (in case user clicked on icon inside)
                const button = e.currentTarget;
                const alignment = button.dataset.align;
                this.setGlobalMainTextAlignment(alignment);
            });
        });
        
        document.querySelectorAll('.global-sub-align-selector .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Get the button element (in case user clicked on icon inside)
                const button = e.currentTarget;
                const alignment = button.dataset.align;
                this.setGlobalSubTextAlignment(alignment);
            });
        });
        if (downloadPng) downloadPng.addEventListener('click', () => this.downloadPNG());
        
        // Dimension arrow controls
        this.initializeDimensionArrows();
        
        // DPI preset buttons
        document.querySelectorAll('[data-dpi]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dpi = e.target.dataset.dpi;
                document.getElementById('png-dpi').value = dpi;
            });
        });
        
        const downloadSvg = document.getElementById('download-svg');
        if (downloadSvg) downloadSvg.addEventListener('click', () => this.downloadSVG());
        
        const copyYamlBtn = document.getElementById('copy-yaml-btn');
        if (copyYamlBtn) copyYamlBtn.addEventListener('click', () => this.copyYAML());
        
        if (validateYaml) validateYaml.addEventListener('click', () => this.validateYAML());
        if (generateZip) generateZip.addEventListener('click', () => this.generateZIP());
        
        // WYSIWYG preview interactions
        this.setupPreviewInteractions();
        
        // Initial setup for text inputs
        this.setupMainTextInputs();
        this.setupSubTextInputs();
        
        // QR Code functionality
        this.setupQRCode();
    }

    initializeDimensionArrows() {
        // Width arrows (horizontal)
        const widthInput = document.getElementById('label-width');
        const widthContainer = widthInput?.closest('.input-group');
        const widthArrows = widthContainer?.querySelectorAll('.dimension-arrow');
        
        if (widthArrows && widthArrows.length >= 2 && widthInput) {
            const leftArrow = widthArrows[0]; // ←
            const rightArrow = widthArrows[1]; // →
            
            leftArrow.addEventListener('click', () => {
                const currentValue = parseInt(widthInput.value);
                const minValue = parseInt(widthInput.min);
                if (currentValue > minValue) {
                    widthInput.value = currentValue - 1;
                    widthInput.dispatchEvent(new Event('input'));
                }
            });
            
            rightArrow.addEventListener('click', () => {
                const currentValue = parseInt(widthInput.value);
                const maxValue = parseInt(widthInput.max);
                if (currentValue < maxValue) {
                    widthInput.value = currentValue + 1;
                    widthInput.dispatchEvent(new Event('input'));
                }
            });
        }
        
        // Height arrows (vertical)
        const heightInput = document.getElementById('label-height');
        const heightContainer = heightInput?.closest('.input-group');
        const heightArrows = heightContainer?.querySelectorAll('.dimension-arrow');
        
        if (heightArrows && heightArrows.length >= 2 && heightInput) {
            const upArrow = heightArrows[0]; // ↑
            const downArrow = heightArrows[1]; // ↓
            
            upArrow.addEventListener('click', () => {
                const currentValue = parseInt(heightInput.value);
                const maxValue = parseInt(heightInput.max);
                if (currentValue < maxValue) {
                    heightInput.value = currentValue + 1;
                    heightInput.dispatchEvent(new Event('change'));
                }
            });
            
            downArrow.addEventListener('click', () => {
                const currentValue = parseInt(heightInput.value);
                const minValue = parseInt(heightInput.min);
                if (currentValue > minValue) {
                    heightInput.value = currentValue - 1;
                    heightInput.dispatchEvent(new Event('change'));
                }
            });
        }
    }

    setupPreviewInteractions() {
        // Add click handler to existing overlay
        const overlay = document.querySelector('.icon-picker-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeIconPicker();
            });
        }

        // Click handler for preview icons to open icon picker
        const previewIcon = document.querySelector('.label-icon.clickable-icon');
        const previewIcon2 = document.querySelector('.label-icon-2.clickable-icon');
        
        if (previewIcon) {
            previewIcon.addEventListener('click', () => {
                this.currentIconSelector = 1;
                this.openIconPicker();
            });
        }
        
        if (previewIcon2) {
            previewIcon2.addEventListener('click', () => {
                this.currentIconSelector = 2;
                this.openIconPicker();
            });
        }

        // Content editable text change handlers
        document.querySelectorAll('.editable-text').forEach(element => {
            this.setupEditableTextHandlers(element);
            this.setupTextAlignmentTooltip(element);
            // Initialize with global alignment if not already set
            const isMainText = element.closest('.main-text') !== null;
            const textType = isMainText ? 'main' : 'sub';
            if (!element.getAttribute(`data-${textType}-align`)) {
                const globalAlign = isMainText ? this.globalMainTextAlign : this.globalSubTextAlign;
                element.setAttribute(`data-${textType}-align`, globalAlign);
                element.classList.add(`align-${globalAlign}`);
            }
        });


        // Column control buttons in form
        document.querySelectorAll('.column-btn, .column-btn-small').forEach(btn => {
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
        
        if (action === 'add' && currentCount < 8) {
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
        // Store existing alignment data before clearing
        const existingAlignments = [];
        mainContainer.querySelectorAll('.main-text-column').forEach(col => {
            existingAlignments.push(col.getAttribute('data-main-align') || 'left');
        });
        
        mainContainer.innerHTML = '';
        Array.from(mainInputs).forEach((input, index) => {
            const column = document.createElement('div');
            column.className = 'main-text-column editable-text';
            column.contentEditable = true;
            column.textContent = input.value.trim() || `New ${index + 1}`;
            
            // Apply preserved alignment, global alignment, or default to left
            let alignment;
            if (this.globalMainTextAlign === 'custom') {
                // In custom mode, preserve individual alignments
                alignment = existingAlignments[index] || 'left';
            } else {
                // Use global alignment
                alignment = this.globalMainTextAlign;
            }
            column.classList.add(`align-${alignment}`);
            column.setAttribute('data-main-align', alignment);
            
            this.setupEditableTextHandlers(column);
            this.setupTextAlignmentTooltip(column);
            
            mainContainer.appendChild(column);
        });
        
        // Update sub text columns
        const subContainer = document.querySelector('.sub-text');
        // Store existing alignment data before clearing
        const existingSubAlignments = [];
        subContainer.querySelectorAll('.sub-text-column').forEach(col => {
            existingSubAlignments.push(col.getAttribute('data-sub-align') || 'left');
        });
        
        subContainer.innerHTML = '';
        Array.from(subInputs).forEach((input, index) => {
            const column = document.createElement('div');
            column.className = 'sub-text-column editable-text';
            column.contentEditable = true;
            column.textContent = input.value.trim() || `Sub ${index + 1}`;
            
            // Apply preserved alignment, global alignment, or default to left  
            let alignment;
            if (this.globalSubTextAlign === 'custom') {
                // In custom mode, preserve individual alignments
                alignment = existingSubAlignments[index] || 'left';
            } else {
                // Use global alignment
                alignment = this.globalSubTextAlign;
            }
            column.classList.add(`align-${alignment}`);
            column.setAttribute('data-sub-align', alignment);
            
            this.setupEditableTextHandlers(column);
            this.setupTextAlignmentTooltip(column);
            
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
    
    setupQRCode() {
        const qrInput = document.getElementById('qr-url-input');
        const clearBtn = document.getElementById('clear-qr-btn');
        
        // Store current QR URL
        this.currentQRUrl = '';
        
        if (qrInput) {
            qrInput.addEventListener('input', (e) => {
                const url = e.target.value;
                this.updateQRCodeWithValidation(url);
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (qrInput) qrInput.value = '';
                this.updateQRCodeWithValidation('');
            });
        }
        
        // Initialize character counter
        this.updateCharacterCounter('');
    }
    
    updateQRCodeWithValidation(url) {
        this.updateCharacterCounter(url);
        this.updateQRCode(url.trim());
    }
    
    updateCharacterCounter(url) {
        const charCounter = document.getElementById('qr-char-counter');
        const qrInput = document.getElementById('qr-url-input');
        
        if (charCounter && qrInput) {
            const currentLength = url.length;
            const complexityThreshold1 = 33; // QR code complexity increases
            const complexityThreshold2 = 54; // QR code complexity increases again
            
            charCounter.textContent = `${currentLength}/${complexityThreshold2}`;
            
            // Add visual feedback based on QR code complexity thresholds
            charCounter.classList.remove('text-muted', 'text-warning', 'text-danger');
            
            if (currentLength === 0) {
                charCounter.classList.add('text-muted');
            } else if (currentLength >= complexityThreshold2) {
                charCounter.classList.add('text-danger');
            } else if (currentLength >= complexityThreshold1) {
                charCounter.classList.add('text-warning');
            } else {
                charCounter.classList.add('text-muted');
            }
            
            // Add visual feedback to input field
            qrInput.classList.remove('border-warning', 'border-danger');
            if (currentLength >= complexityThreshold2) {
                qrInput.classList.add('border-danger');
            } else if (currentLength >= complexityThreshold1) {
                qrInput.classList.add('border-warning');
            }
        }
    }
    
    updateQRCode(url) {
        this.currentQRUrl = url;
        
        // Update main label preview
        this.updatePreview();
    }
    
    setupTextAlignmentTooltip(element) {
        const tooltip = document.getElementById('text-alignment-tooltip');
        
        // Initialize global hover state if not exists
        if (!window.tooltipHoverState) {
            window.tooltipHoverState = {
                isOverElement: false,
                isOverTooltip: false,
                currentElement: null
            };
        }
        
        // Hover enter on text element
        element.addEventListener('mouseenter', (e) => {
            window.tooltipHoverState.isOverElement = true;
            window.tooltipHoverState.currentElement = element;
            this.showAlignmentTooltip(element, tooltip);
        });
        
        // Hover leave on text element
        element.addEventListener('mouseleave', (e) => {
            window.tooltipHoverState.isOverElement = false;
            setTimeout(() => {
                if (!window.tooltipHoverState.isOverElement && !window.tooltipHoverState.isOverTooltip) {
                    this.hideAlignmentTooltip(tooltip);
                }
            }, 100);
        });
        
        // Tooltip hover handlers (only add once)
        if (!tooltip.hasAttribute('data-handlers-added')) {
            tooltip.setAttribute('data-handlers-added', 'true');
            
            tooltip.addEventListener('mouseenter', () => {
                window.tooltipHoverState.isOverTooltip = true;
            });
            
            tooltip.addEventListener('mouseleave', () => {
                window.tooltipHoverState.isOverTooltip = false;
                setTimeout(() => {
                    if (!window.tooltipHoverState.isOverElement && !window.tooltipHoverState.isOverTooltip) {
                        this.hideAlignmentTooltip(tooltip);
                    }
                }, 100);
            });
            
            // Alignment button clicks
            tooltip.querySelectorAll('.alignment-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Prevent event bubbling and get the button element
                    e.preventDefault();
                    e.stopPropagation();
                    const button = e.currentTarget;
                    const alignment = button.dataset.align;
                    const activeElement = window.tooltipHoverState.currentElement;
                    if (activeElement) {
                        this.applyTextAlignment(activeElement, alignment);
                        this.updateAlignmentButtons(tooltip, alignment);
                    }
                });
            });
        }
    }
    
    showAlignmentTooltip(targetElement, tooltip) {
        const isMainText = targetElement.closest('.main-text') !== null;
        const textType = isMainText ? 'main' : 'sub';
        
        // Only show tooltip if in custom mode
        if (!this.isCustomAlignmentMode(textType)) {
            return;
        }
        
        const rect = targetElement.getBoundingClientRect();
        
        // Position tooltip centered horizontally
        const left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2);
        
        if (isMainText) {
            // Show above main text - positioned closer
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 2}px`;
        } else {
            // Show below sub text - positioned closer
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${rect.bottom + 2}px`;
        }
        
        tooltip.classList.add('show');
        
        // Update active alignment button
        const currentAlign = this.getCurrentAlignment(targetElement);
        this.updateAlignmentButtons(tooltip, currentAlign);
    }
    
    hideAlignmentTooltip(tooltip) {
        tooltip.classList.remove('show');
    }
    
    getCurrentAlignment(element) {
        const isMainText = element.closest('.main-text') !== null;
        const textType = isMainText ? 'main' : 'sub';
        const alignAttr = element.getAttribute(`data-${textType}-align`);
        
        if (alignAttr) {
            return alignAttr;
        }
        
        // Check for CSS classes as fallback
        if (element.classList.contains('align-center')) return 'center';
        if (element.classList.contains('align-right')) return 'right';
        if (element.classList.contains('align-justify')) return 'justify';
        
        // Default to left
        return 'left';
    }
    
    applyTextAlignment(element, alignment) {
        // Apply to only the specific element (individual cell)
        const isMainText = element.closest('.main-text') !== null;
        const textType = isMainText ? 'main' : 'sub';
        
        // Remove existing alignment classes from this element only
        element.classList.remove('align-left', 'align-center', 'align-right', 'align-justify');
        // Add new alignment class to this element only
        element.classList.add(`align-${alignment}`);
        // Set data attribute for tracking on this element
        element.setAttribute(`data-${textType}-align`, alignment);
        
        // Auto-switch to Custom mode when individual alignment is changed
        if (isMainText) {
            this.setGlobalMainTextAlignment('custom');
        } else {
            this.setGlobalSubTextAlignment('custom');
        }
        
        // Update preview to reflect changes
        this.updatePreview();
    }
    
    updateAlignmentButtons(tooltip, activeAlignment) {
        tooltip.querySelectorAll('.alignment-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === activeAlignment);
        });
    }
    
    getIconCount() {
        const activeBtn = document.querySelector('.icon-count-selector .btn.active');
        return activeBtn ? parseInt(activeBtn.getAttribute('data-icon-count')) : 1;
    }
    
    updateIconCountDisplay() {
        // Icon display removed for cleaner look
        // Button text (0, 1, 2) is sufficient indication
    }

    updatePreview() {
        const iconSelect = document.getElementById('icon-select').value;
        const height = document.getElementById('label-height').value;
        const width = document.getElementById('label-width').value;
        const iconCount = this.getIconCount();

        const labelPreview = document.getElementById('header-label-preview');
        const iconContainer = labelPreview.querySelector('.label-icon img');
        const labelIcon = labelPreview.querySelector('.label-icon');
        const iconContainer2 = labelPreview.querySelector('.label-icon-2 img');
        const labelIcon2 = labelPreview.querySelector('.label-icon-2');
        const labelText = labelPreview.querySelector('.label-text');
        const labelQR = labelPreview.querySelector('.label-qr');
        const qrCanvas = labelPreview.querySelector('.label-qr .qr-canvas');

        // Handle icon visibility based on icon count
        if (labelIcon) {
            if (iconCount === 0) {
                labelIcon.style.display = 'none';
                if (labelIcon2) labelIcon2.style.display = 'none';
                // Expand text to full width when no icons
                if (labelText) {
                    labelText.style.marginLeft = '0';
                    labelText.style.width = '100%';
                }
            } else if (iconCount === 1) {
                labelIcon.style.display = 'flex';
                if (labelIcon2) labelIcon2.style.display = 'none';
                // Reset text positioning for single icon mode
                if (labelText) {
                    labelText.style.marginLeft = '';
                    labelText.style.width = '';
                }
                
                // Get icon path from either built-in icons or custom icons
                const iconPath1 = this.icons[this.selectedIcon1] || this.customIcons[this.selectedIcon1] || this.icons['heads_hex_socket'];
                if (iconContainer) {
                    iconContainer.src = iconPath1;
                    iconContainer.alt = this.selectedIcon1;
                }
            } else if (iconCount === 2) {
                labelIcon.style.display = 'flex';
                if (labelIcon2) labelIcon2.style.display = 'flex';
                // Adjust text positioning for two icon mode
                if (labelText) {
                    labelText.style.marginLeft = '';
                    labelText.style.width = '';
                }
                
                // Get icon paths for both icons
                const iconPath1 = this.icons[this.selectedIcon1] || this.customIcons[this.selectedIcon1] || this.icons['heads_hex_socket'];
                const iconPath2 = this.icons[this.selectedIcon2] || this.customIcons[this.selectedIcon2] || this.icons['heads_hex_socket'];
                if (iconContainer) {
                    iconContainer.src = iconPath1;
                    iconContainer.alt = this.selectedIcon1;
                }
                if (iconContainer2) {
                    iconContainer2.src = iconPath2;
                    iconContainer2.alt = this.selectedIcon2;
                }
            }
        }

        labelPreview.setAttribute('data-height', height);
        labelPreview.style.width = `${width}mm`;
        labelPreview.style.height = `${height}mm`;
        
        // Update CSS custom property for control positioning
        document.documentElement.style.setProperty('--label-width', `${width}mm`);
        
        // Dynamically set icon size based on height (height - 2mm for 1mm margin on each side)
        const iconSize = Math.max(6, height - 2); // Minimum 6mm, otherwise height - 2mm
        if (labelIcon) {
            labelIcon.style.width = `${iconSize}mm`;
            labelIcon.style.height = `${iconSize}mm`;
        }
        if (labelIcon2) {
            labelIcon2.style.width = `${iconSize}mm`;
            labelIcon2.style.height = `${iconSize}mm`;
        }
        
        // Handle QR code display and sizing
        if (labelQR && qrCanvas) {
            if (this.currentQRUrl && this.currentQRUrl.trim().length > 0) {
                labelQR.style.display = 'flex';
                
                // Set QR code size based on label height (same as icon size)
                labelQR.style.width = `${iconSize}mm`;
                labelQR.style.height = `${iconSize}mm`;
                
                // Set canvas size to match container - use higher resolution
                const qrSizePx = iconSize * 15; // Higher resolution for better quality
                qrCanvas.width = qrSizePx;
                qrCanvas.height = qrSizePx;
                qrCanvas.style.width = '100%';
                qrCanvas.style.height = '100%';
                
                // Generate QR code for main label
                if (typeof QRious !== 'undefined') {
                    try {
                        const ctx = qrCanvas.getContext('2d');
                        ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
                        
                        const qr = new QRious({
                            element: qrCanvas,
                            value: this.currentQRUrl,
                            size: qrSizePx,
                            level: 'L'
                        });
                    } catch (error) {
                        console.error('QR code generation error:', error);
                    }
                }
            } else {
                labelQR.style.display = 'none';
            }
        }
        
        // Check if sub text has any non-empty columns
        const subTextColumns = document.querySelectorAll('.sub-text-column');
        const hasSubText = Array.from(subTextColumns).some(col => col.textContent.trim());
        const subTextContainer = document.querySelector('.sub-text');
        
        if (!hasSubText) {
            subTextContainer.style.display = 'none';
        } else {
            subTextContainer.style.display = 'flex';
        }
        
    }

    async downloadPNG() {
        try {
            // Sync editable content to hidden inputs before export
            this.syncEditableTextToInputs();
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const height = parseInt(document.getElementById('label-height').value);
            const width = parseInt(document.getElementById('label-width').value);
            const mainTextInputs = document.querySelectorAll('.main-text-input');
            const mainTexts = Array.from(mainTextInputs).map(input => input.value.trim()).filter(text => text);
            const subTextInputs = document.querySelectorAll('.sub-text-input');
            const subTexts = Array.from(subTextInputs).map(input => input.value.trim()).filter(text => text);
            const iconSelect = document.getElementById('icon-select').value;
            const iconCount = this.getIconCount();
            const dpi = this.validateDPI(parseInt(document.getElementById('png-dpi').value) || 96);
            const shouldRotate = document.getElementById('export-rotate').checked;
            const mmToPx = dpi / 25.4;
            
            // Always set canvas to normal dimensions first (we'll rotate after drawing)
            canvas.width = width * mmToPx;
            canvas.height = height * mmToPx;

            // Always use transparent background

            let textX, textAreaWidth;
            
            if (iconCount === 0) {
                // No icons - text takes full width
                textX = 1 * mmToPx;
                textAreaWidth = canvas.width - (2 * mmToPx);
            } else if (iconCount === 1) {
                // Single icon
                const iconSize = (height - 2) * mmToPx;
                const iconX = 1 * mmToPx;
                const iconY = 1 * mmToPx;

                await this.drawIcon(ctx, iconX, iconY, iconSize, this.selectedIcon1);

                textX = iconX + iconSize + (2 * mmToPx);
                textAreaWidth = canvas.width - textX - (1 * mmToPx);
            } else if (iconCount === 2) {
                // Two icons
                const iconSize = (height - 2) * mmToPx;
                const icon1X = 1 * mmToPx;
                const icon2X = icon1X + iconSize + (0.5 * mmToPx);
                const iconY = 1 * mmToPx;

                await this.drawIcon(ctx, icon1X, iconY, iconSize, this.selectedIcon1);
                await this.drawIcon(ctx, icon2X, iconY, iconSize, this.selectedIcon2);

                textX = icon2X + iconSize + (2 * mmToPx);
                textAreaWidth = canvas.width - textX - (1 * mmToPx);
            }

            ctx.fillStyle = 'black';
            ctx.textBaseline = 'middle';

            const mainFontSize = this.calculateFontSize(height);
            const subFontSize = mainFontSize * 0.75;

            ctx.font = `bold ${mainFontSize}px Arial`;
            // Center text vertically like in the preview
            const centerY = (height * mmToPx) / 2;
            const textY = subTexts.length > 0 ? centerY - (mainFontSize * 0.3) : centerY;
            
            // Handle multiple columns for main text
            if (mainTexts.length === 0) {
                const defaultTexts = ['M3', 'M3', 'M3'];
                const columnWidth = textAreaWidth / defaultTexts.length;
                defaultTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    const alignment = this.getColumnAlignment('main', index);
                    this.drawAlignedText(ctx, text, columnX, textY, columnWidth, alignment);
                });
            } else {
                const columnWidth = textAreaWidth / mainTexts.length;
                mainTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    const alignment = this.getColumnAlignment('main', index);
                    this.drawAlignedText(ctx, text, columnX, textY, columnWidth, alignment);
                });
            }

            // Handle multiple columns for sub text
            ctx.font = `${subFontSize}px Arial`;
            ctx.fillStyle = '#666';
            const subTextY = centerY + (subFontSize * 0.6);
            
            if (subTexts.length === 0) {
                const defaultSubTexts = ['8 mm', '10 mm', '12 mm'];
                const columnWidth = textAreaWidth / defaultSubTexts.length;
                defaultSubTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    const alignment = this.getColumnAlignment('sub', index);
                    this.drawAlignedText(ctx, text, columnX, subTextY, columnWidth, alignment);
                });
            } else {
                const columnWidth = textAreaWidth / subTexts.length;
                subTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    const alignment = this.getColumnAlignment('sub', index);
                    this.drawAlignedText(ctx, text, columnX, subTextY, columnWidth, alignment);
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
            // Sync editable content to hidden inputs before export
            this.syncEditableTextToInputs();
            
            const height = parseInt(document.getElementById('label-height').value);
            const width = parseInt(document.getElementById('label-width').value);
            const mainTextInputs = document.querySelectorAll('.main-text-input');
            const mainTexts = Array.from(mainTextInputs).map(input => input.value.trim()).filter(text => text);
            const subTextInputs = document.querySelectorAll('.sub-text-input');
            const subTexts = Array.from(subTextInputs).map(input => input.value.trim()).filter(text => text);
            const iconSelect = document.getElementById('icon-select').value;
            const iconCount = this.getIconCount();
            const shouldRotate = document.getElementById('export-rotate').checked;
            
            const svg = await this.generateLabelSVG({
                height_mm: height,
                width_mm: width,
                columns: mainTexts.length > 0 ? mainTexts : ['M3', 'M3', 'M3'],
                subtext_columns: subTexts.length > 0 ? subTexts : ['8 mm', '10 mm', '12 mm'],
                icon: iconSelect,
                icon_count: iconCount,
                icon1: this.selectedIcon1,
                icon2: this.selectedIcon2,
                rotate: shouldRotate
            });
            
            // Save DPI setting to localStorage
            this.saveDPISettings();

            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            const labelName = mainTexts.length > 0 ? mainTexts.join('_') : 'label';
            const rotation = shouldRotate ? '_rotated' : '';
            link.download = `label-${labelName.replace(/[^a-zA-Z0-9]/g, '_')}${rotation}.svg`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('SVG download failed:', error);
            alert('Failed to download SVG. Please try again.');
        }
    }

    async copyYAML() {
        try {
            // Sync editable content to hidden inputs before extracting values
            this.syncEditableTextToInputs();
            
            // Extract current form values
            const height = parseInt(document.getElementById('label-height').value);
            const width = parseInt(document.getElementById('label-width').value);
            const mainTextInputs = document.querySelectorAll('.main-text-input');
            const mainTexts = Array.from(mainTextInputs).map(input => input.value.trim()).filter(text => text);
            const subTextInputs = document.querySelectorAll('.sub-text-input');
            const subTexts = Array.from(subTextInputs).map(input => input.value.trim()).filter(text => text);
            const iconSelect = document.getElementById('icon-select').value;
            const iconCount = this.getIconCount();
            const shouldRotate = document.getElementById('export-rotate').checked;
            const pngDpi = parseInt(document.getElementById('png-dpi').value) || 300;
            
            // Generate YAML structure matching batch processor format
            let yamlContent = `# Generated from Single Editor Settings\n`;
            yamlContent += `# Copy this YAML to the Batch tab for processing multiple labels\n\n`;
            yamlContent += `# Global settings\n`;
            yamlContent += `width_mm: ${width}\n`;
            yamlContent += `height_mm: ${height}\n`;
            yamlContent += `png_dpi: ${pngDpi}\n`;
            yamlContent += `main_text_align: ${this.globalMainTextAlign}\n`;
            yamlContent += `sub_text_align: ${this.globalSubTextAlign}\n`;
            if (shouldRotate) {
                yamlContent += `export_rotate: true\n`;
            }
            yamlContent += `\n`;
            yamlContent += `labels:\n`;
            yamlContent += `  - name: "current_label"\n`;
            
            if (iconCount > 0) {
                yamlContent += `    icon: "${iconSelect}"\n`;
            }
            
            if (mainTexts.length > 0) {
                yamlContent += `    columns:\n`;
                mainTexts.forEach(text => {
                    yamlContent += `      - "${text}"\n`;
                });
            }
            
            if (subTexts.length > 0) {
                yamlContent += `    subtext_columns:\n`;
                subTexts.forEach(text => {
                    yamlContent += `      - "${text}"\n`;
                });
            }
            
            // Copy to clipboard
            await navigator.clipboard.writeText(yamlContent);
            
            // Show success feedback
            const button = document.getElementById('copy-yaml-btn');
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check"></i> Copied!';
            button.classList.remove('btn-outline-info');
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('btn-success');
                button.classList.add('btn-outline-info');
            }, 2000);
            
        } catch (error) {
            console.error('Copy YAML failed:', error);
            alert('Failed to copy YAML to clipboard. Please try again.');
        }
    }

    async generateLabelSVG(label) {
        const originalHeight = label.height_mm;
        const originalWidth = label.width_mm;
        const shouldRotate = label.rotate || false;
        
        const mainTexts = label.columns ? label.columns.filter(col => col.trim()) : [label.title];
        const subTexts = label.subtext_columns ? label.subtext_columns.filter(col => col.trim()) : (label.subtext ? [label.subtext] : []);
        const iconSelect = label.icon;
        const iconCount = label.icon_count || 1;
        const icon1 = label.icon1 || iconSelect;
        const icon2 = label.icon2 || iconSelect;
        const svgDpi = 96; // Fixed SVG DPI

        // Always use original dimensions for layout calculations
        let textX, textAreaWidth;
        const iconSize = originalHeight - 2;
        
        if (iconCount === 0) {
            // No icons - text takes full width
            textX = 1;
            textAreaWidth = originalWidth - 2;
        } else if (iconCount === 1) {
            // Single icon
            textX = 1 + iconSize + 2;
            textAreaWidth = originalWidth - textX - 1;
        } else if (iconCount === 2) {
            // Two icons
            textX = 1 + iconSize + 0.5 + iconSize + 2;
            textAreaWidth = originalWidth - textX - 1;
        }
        
        // For rotation, swap dimensions only for the SVG canvas
        const canvasHeight = shouldRotate ? originalWidth : originalHeight;
        const canvasWidth = shouldRotate ? originalHeight : originalWidth;

        // Use 96 PPI for SVG (Inkscape standard)
        const dpi = 96;
        const mmToPx = dpi / 25.4; // ~3.78
        const baseFontSize = this.calculateFontSize(originalHeight);
        const mainFontSizePx = baseFontSize; // Already in pixels
        const subFontSizePx = mainFontSizePx * 0.75;
        
        // Convert to px-based viewBox for consistent sizing with PNG
        const viewBoxWidth = canvasWidth * mmToPx;
        const viewBoxHeight = canvasHeight * mmToPx;
        const scale = mmToPx; // For converting mm coordinates to px

        let svgContent = `<svg width="${canvasWidth}mm" height="${canvasHeight}mm" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description>
        <dpi>${svgDpi}</dpi>
        <print-dpi>${svgDpi}</print-dpi>
      </rdf:Description>
    </rdf:RDF>
  </metadata>`;

        // Add rotation group if needed
        if (shouldRotate) {
            // For 90-degree rotation, we need to rotate around the center and then translate
            // to ensure the content fits within the swapped canvas dimensions
            const originalViewBoxWidth = originalWidth * mmToPx;
            const originalViewBoxHeight = originalHeight * mmToPx;
            const centerX = originalViewBoxWidth / 2;
            const centerY = originalViewBoxHeight / 2;
            
            // Calculate the translation needed after rotation to center content in new canvas
            const translateX = (viewBoxWidth - originalViewBoxWidth) / 2;
            const translateY = (viewBoxHeight - originalViewBoxHeight) / 2;
            
            svgContent += `<g transform="translate(${translateX + centerX}, ${translateY + centerY}) rotate(90) translate(${-centerX}, ${-centerY})">`;
        }

        // Add transparent background box for easier selection in design software
        const backgroundWidth = originalWidth * mmToPx;
        const backgroundHeight = originalHeight * mmToPx;
        svgContent += `<rect x="0" y="0" width="${backgroundWidth}" height="${backgroundHeight}" fill="white" fill-opacity="0.01" stroke="none"/>`;

        // Add icons based on icon count
        if (iconCount > 0) {
            const iconY = 1;
            const iconSizePx = iconSize * scale;
            
            // Helper function to add an icon
            const addIcon = async (iconKey, xPosition) => {
                const iconXPx = xPosition * scale;
                const iconYPx = iconY * scale;
                
                const iconPath = this.icons[iconKey] || this.customIcons[iconKey] || this.icons['heads_hex_socket'];
                if (iconPath && iconPath.toLowerCase().endsWith('.svg')) {
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
                        // Fallback to a simple rectangle
                        svgContent += `<rect x="${iconXPx}" y="${iconYPx}" width="${iconSizePx}" height="${iconSizePx}" fill="#ccc" stroke="#999"/>`;
                    }
                } else if (iconPath) {
                    // For PNG icons, convert to base64 and embed
                    try {
                        const response = await fetch(iconPath);
                        const blob = await response.blob();
                        const base64 = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        });
                        svgContent += `<image x="${iconXPx}" y="${iconYPx}" width="${iconSizePx}" height="${iconSizePx}" href="${base64}"/>`;
                    } catch (error) {
                        console.error('Failed to embed PNG icon:', error);
                        // Fallback to a simple rectangle
                        svgContent += `<rect x="${iconXPx}" y="${iconYPx}" width="${iconSizePx}" height="${iconSizePx}" fill="#ccc" stroke="#999"/>`;
                    }
                } else {
                    console.warn('No icon path found for:', iconKey);
                    // Fallback to a simple rectangle
                    svgContent += `<rect x="${iconXPx}" y="${iconYPx}" width="${iconSizePx}" height="${iconSizePx}" fill="#ccc" stroke="#999"/>`;
                }
            };
            
            // Draw first icon if icon count >= 1
            if (iconCount >= 1) {
                await addIcon(icon1, 1);
            }
            
            // Draw second icon if icon count >= 2
            if (iconCount >= 2) {
                await addIcon(icon2, 1 + iconSize + 0.5);
            }
        }

        // Add main text - position so bottom of text is on horizontal centerline
        const textXPx = textX * scale;
        const textAreaWidthPx = textAreaWidth * scale;
        const centerYPx = (originalHeight * mmToPx) / 2; // Use original height for centerline
        const textYPx = subTexts.length > 0 ? centerYPx - (mainFontSizePx * 0.3) : centerYPx;
        
        if (mainTexts.length === 1) {
            // For single label export, get alignment from DOM or use batch data
            const alignment = label.main_text_align || this.getColumnAlignment('main', 0);
            const alignedX = this.getSvgAlignedX(textXPx, textAreaWidthPx, alignment);
            const textAnchor = this.getSvgTextAnchor(alignment);
            svgContent += `<text x="${alignedX}" y="${textYPx}" font-family="Arial, sans-serif" font-size="${mainFontSizePx}px" font-weight="bold" fill="black" text-anchor="${textAnchor}" dominant-baseline="middle">${this.escapeXml(mainTexts[0])}</text>`;
        } else {
            const columnWidthPx = textAreaWidthPx / mainTexts.length;
            mainTexts.forEach((text, index) => {
                const columnXPx = textXPx + (index * columnWidthPx);
                // For single label export, get individual column alignment or use batch data
                const alignment = label.main_text_align || this.getColumnAlignment('main', index);
                const alignedX = this.getSvgAlignedX(columnXPx, columnWidthPx, alignment);
                const textAnchor = this.getSvgTextAnchor(alignment);
                svgContent += `<text x="${alignedX}" y="${textYPx}" font-family="Arial, sans-serif" font-size="${mainFontSizePx}px" font-weight="bold" fill="black" text-anchor="${textAnchor}" dominant-baseline="middle">${this.escapeXml(text)}</text>`;
            });
        }

        // Add sub text - position below main text with same spacing
        if (subTexts.length > 0) {
            const subTextYPx = centerYPx + (subFontSizePx * 0.6); // Position sub text below center
            if (subTexts.length === 1) {
                // For single label export, get alignment from DOM or use batch data
                const alignment = label.sub_text_align || this.getColumnAlignment('sub', 0);
                const alignedX = this.getSvgAlignedX(textXPx, textAreaWidthPx, alignment);
                const textAnchor = this.getSvgTextAnchor(alignment);
                svgContent += `<text x="${alignedX}" y="${subTextYPx}" font-family="Arial, sans-serif" font-size="${subFontSizePx}px" fill="#666" text-anchor="${textAnchor}" dominant-baseline="middle">${this.escapeXml(subTexts[0])}</text>`;
            } else {
                const columnWidthPx = textAreaWidthPx / subTexts.length;
                subTexts.forEach((text, index) => {
                    const columnXPx = textXPx + (index * columnWidthPx);
                    // For single label export, get individual column alignment or use batch data
                    const alignment = label.sub_text_align || this.getColumnAlignment('sub', index);
                    const alignedX = this.getSvgAlignedX(columnXPx, columnWidthPx, alignment);
                    const textAnchor = this.getSvgTextAnchor(alignment);
                    svgContent += `<text x="${alignedX}" y="${subTextYPx}" font-family="Arial, sans-serif" font-size="${subFontSizePx}px" fill="#666" text-anchor="${textAnchor}" dominant-baseline="middle">${this.escapeXml(text)}</text>`;
                });
            }
        }

        // Close rotation group if needed
        if (shouldRotate) {
            svgContent += '</g>';
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
        // Return exact CSS pixel values from preview (no DPI conversion needed)
        switch(height) {
            case 9: return 6;   // matches CSS: 6px
            case 12: return 12; // matches CSS: 12px
            case 18: return 12; // matches CSS: 12px
            case 24: return 14; // matches CSS: 14px
            default: return 12;
        }
    }
    
    drawAlignedText(ctx, text, x, y, width, alignment) {
        switch (alignment) {
            case 'center':
                ctx.textAlign = 'center';
                ctx.fillText(text, x + width / 2, y);
                break;
            case 'right':
                ctx.textAlign = 'right';
                ctx.fillText(text, x + width, y);
                break;
            case 'justify':
                // For justify, use left alignment as canvas doesn't have native justify
                ctx.textAlign = 'left';
                ctx.fillText(text, x, y);
                break;
            case 'left':
            default:
                ctx.textAlign = 'left';
                ctx.fillText(text, x, y);
                break;
        }
    }
    
    getSvgAlignedX(x, width, alignment) {
        switch (alignment) {
            case 'center':
                return x + width / 2;
            case 'right':
                return x + width;
            case 'justify':
            case 'left':
            default:
                return x;
        }
    }
    
    getSvgTextAnchor(alignment) {
        switch (alignment) {
            case 'center':
                return 'middle';
            case 'right':
                return 'end';
            case 'justify':
            case 'left':
            default:
                return 'start';
        }
    }
    
    getColumnAlignment(textType, columnIndex) {
        // If not in custom mode, use global alignment
        if (!this.isCustomAlignmentMode(textType)) {
            return textType === 'main' ? this.globalMainTextAlign : this.globalSubTextAlign;
        }
        
        // In custom mode, get alignment from the specific column element in the DOM
        const selector = textType === 'main' ? '.main-text-column' : '.sub-text-column';
        const columns = document.querySelectorAll(selector);
        
        if (columns[columnIndex]) {
            const alignment = columns[columnIndex].getAttribute(`data-${textType}-align`);
            return alignment || 'left';
        }
        
        return 'left'; // Default fallback
    }
    
    setGlobalMainTextAlignment(alignment) {
        // Update active state in UI
        document.querySelectorAll('.global-main-align-selector .btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === alignment);
        });
        
        this.globalMainTextAlign = alignment;
        
        if (alignment !== 'custom') {
            // Apply alignment to all main text columns
            document.querySelectorAll('.main-text-column').forEach(col => {
                col.classList.remove('align-left', 'align-center', 'align-right', 'align-justify');
                col.classList.add(`align-${alignment}`);
                col.setAttribute('data-main-align', alignment);
            });
        }
        
        this.updatePreview();
    }
    
    setGlobalSubTextAlignment(alignment) {
        // Update active state in UI
        document.querySelectorAll('.global-sub-align-selector .btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === alignment);
        });
        
        this.globalSubTextAlign = alignment;
        
        if (alignment !== 'custom') {
            // Apply alignment to all sub text columns
            document.querySelectorAll('.sub-text-column').forEach(col => {
                col.classList.remove('align-left', 'align-center', 'align-right', 'align-justify');
                col.classList.add(`align-${alignment}`);
                col.setAttribute('data-sub-align', alignment);
            });
        }
        
        this.updatePreview();
    }
    
    isCustomAlignmentMode(textType) {
        return textType === 'main' ? 
            this.globalMainTextAlign === 'custom' : 
            this.globalSubTextAlign === 'custom';
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
        const tabButtons = document.querySelectorAll('.btn[data-tab]');
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
            const dpiSetting = parsed.png_dpi || 300;
            
            // Generate individual labels
            for (let i = 0; i < labels.length; i++) {
                const label = labels[i];
                const titleText = label.title || (label.columns ? label.columns.join('_') : 'label');
                
                // Generate PNG
                const canvas = await this.generateLabelCanvas(label, dpiSetting);
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
                const longPngCanvas = await this.generateLongPngStrip(labels, includeCutMarks, dpiSetting);
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
                    if (trimmedKey === 'long_png' || trimmedKey === 'cut_marks' || trimmedKey === 'export_svg' || trimmedKey === 'width_mm' || trimmedKey === 'height_mm' || trimmedKey === 'png_dpi' || trimmedKey === 'main_text_align' || trimmedKey === 'sub_text_align') {
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
        
        if (parsed.png_dpi !== undefined && (typeof parsed.png_dpi !== 'number' || parsed.png_dpi < 50 || parsed.png_dpi > 1200)) {
            errors.push('Invalid global png_dpi. Must be a number between 50 and 1200 if provided');
        }
        
        // Validate global text alignment settings
        const validAlignments = ['left', 'center', 'right', 'justify'];
        if (parsed.main_text_align !== undefined && !validAlignments.includes(parsed.main_text_align)) {
            errors.push(`Invalid global main_text_align. Must be one of: ${validAlignments.join(', ')} if provided`);
        }
        if (parsed.sub_text_align !== undefined && !validAlignments.includes(parsed.sub_text_align)) {
            errors.push(`Invalid global sub_text_align. Must be one of: ${validAlignments.join(', ')} if provided`);
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
            
            // Apply text alignment defaults
            if (!label.main_text_align && parsed.main_text_align) {
                label.main_text_align = parsed.main_text_align;
            }
            if (!label.sub_text_align && parsed.sub_text_align) {
                label.sub_text_align = parsed.sub_text_align;
            }
            
            // Check for either title (single column) or columns (multi-column)
            if (!label.title && !label.columns) {
                errors.push(`Label ${labelNum}: Missing title or columns (or maintext_columns)`);
            } else if (label.title && label.columns) {
                errors.push(`Label ${labelNum}: Cannot have both title and columns. Use either title for single column or columns/maintext_columns for multi-column`);
            } else if (label.title && typeof label.title !== 'string') {
                errors.push(`Label ${labelNum}: Invalid title. Must be a string`);
            } else if (label.columns && (!Array.isArray(label.columns) || label.columns.length === 0 || label.columns.length > 8)) {
                errors.push(`Label ${labelNum}: Invalid columns/maintext_columns. Must be an array with 1-8 string elements`);
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
            
            if (label.subtext_columns && (!Array.isArray(label.subtext_columns) || label.subtext_columns.length === 0 || label.subtext_columns.length > 8)) {
                errors.push(`Label ${labelNum}: Invalid subtext_columns. Must be an array with 1-8 string elements if provided`);
            } else if (label.subtext_columns && label.subtext_columns.some(col => typeof col !== 'string')) {
                errors.push(`Label ${labelNum}: Invalid subtext_columns. All column values must be strings`);
            }
            
            // Validate text alignment options
            const validAlignments = ['left', 'center', 'right', 'justify'];
            if (label.main_text_align && !validAlignments.includes(label.main_text_align)) {
                errors.push(`Label ${labelNum}: Invalid main_text_align. Must be one of: ${validAlignments.join(', ')}`);
            }
            if (label.sub_text_align && !validAlignments.includes(label.sub_text_align)) {
                errors.push(`Label ${labelNum}: Invalid sub_text_align. Must be one of: ${validAlignments.join(', ')}`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            labelCount: parsed.labels.length
        };
    }

    async generateLabelCanvas(label, dpi = 300) {
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
        const iconCount = label.icon_count || 1;
        const icon1 = label.icon1 || iconSelect;
        const icon2 = label.icon2 || iconSelect;
        const mmToPx = dpi / 25.4;
        
        canvas.width = width * mmToPx;
        canvas.height = height * mmToPx;

        // Always use transparent background

        let textX, textAreaWidth;
        
        if (iconCount === 0) {
            // No icons - text takes full width
            textX = 1 * mmToPx;
            textAreaWidth = canvas.width - (2 * mmToPx);
        } else if (iconCount === 1) {
            // Single icon
            const iconSize = (height - 2) * mmToPx;
            const iconX = 1 * mmToPx;
            const iconY = 1 * mmToPx;

            await this.drawIcon(ctx, iconX, iconY, iconSize, icon1);

            textX = iconX + iconSize + (2 * mmToPx);
            textAreaWidth = canvas.width - textX - (1 * mmToPx);
        } else if (iconCount === 2) {
            // Two icons
            const iconSize = (height - 2) * mmToPx;
            const icon1X = 1 * mmToPx;
            const icon2X = icon1X + iconSize + (0.5 * mmToPx);
            const iconY = 1 * mmToPx;

            await this.drawIcon(ctx, icon1X, iconY, iconSize, icon1);
            await this.drawIcon(ctx, icon2X, iconY, iconSize, icon2);

            textX = icon2X + iconSize + (2 * mmToPx);
            textAreaWidth = canvas.width - textX - (1 * mmToPx);
        }

        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';

        const mainFontSize = this.calculateFontSize(height);
        const subFontSize = mainFontSize * 0.75;

        ctx.font = `bold ${mainFontSize}px Arial`;
        // Center text vertically like in the preview
        const centerY = (height * mmToPx) / 2;
        const textY = subTexts.length > 0 ? centerY - (mainFontSize * 0.3) : centerY;
        
        // Handle multiple columns for main text
        if (mainTexts.length === 1) {
            const alignment = label.main_text_align || 'left';
            this.drawAlignedText(ctx, mainTexts[0], textX, textY, textAreaWidth, alignment);
        } else {
            const columnWidth = textAreaWidth / mainTexts.length;
            mainTexts.forEach((text, index) => {
                const columnX = textX + (index * columnWidth);
                // For batch processing, use single alignment for all columns or default
                const alignment = label.main_text_align || 'left';
                this.drawAlignedText(ctx, text, columnX, textY, columnWidth, alignment);
            });
        }

        // Handle multiple columns for sub text
        if (subTexts.length > 0) {
            ctx.font = `${subFontSize}px Arial`;
            ctx.fillStyle = '#666';
            const subTextY = centerY + (subFontSize * 0.6);
            
            if (subTexts.length === 1) {
                const alignment = label.sub_text_align || 'left';
                this.drawAlignedText(ctx, subTexts[0], textX, subTextY, textAreaWidth, alignment);
            } else {
                const columnWidth = textAreaWidth / subTexts.length;
                subTexts.forEach((text, index) => {
                    const columnX = textX + (index * columnWidth);
                    // For batch processing, use single alignment for all columns or default
                    const alignment = label.sub_text_align || 'left';
                    this.drawAlignedText(ctx, text, columnX, subTextY, columnWidth, alignment);
                });
            }
        }

        return canvas;
    }

    async generateLongPngStrip(labels, includeCutMarks, dpi = 300) {
        const mmToPx = dpi / 25.4;
        
        // Calculate dimensions - horizontal strip
        const firstLabel = labels[0];
        const labelHeight = firstLabel.height_mm * mmToPx;
        
        let totalWidth = 0;
        const labelCanvases = [];
        
        // Generate individual label canvases and calculate total width
        for (const label of labels) {
            const canvas = await this.generateLabelCanvas(label, dpi);
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
png_dpi: 300          # PNG export resolution in dots per inch (50-1200)
main_text_align: left # Default main text alignment: left, center, right, justify
sub_text_align: left  # Default sub text alignment: left, center, right, justify

labels:
  # Multi-column label example (great for drawer compartments)
  - icon: "heads_hex_socket"            # Icon to display on the left
    maintext_columns:                   # Main text columns (1-8 columns max)
      - "M3"
      - "M3" 
      - "M3"
    subtext_columns:                    # Optional sub-text columns
      - "8 mm"
      - "10 mm"
      - "12 mm"
    rotate: false                       # Rotate label 90 degrees (default: false)
    # Text alignment inherits from global settings (left) - no need to specify

  # Another multi-column example with explicit text alignment
  - icon: "heads_hex_socket"
    maintext_columns:
      - "M4"
      - "M4"
      - "M4"
    subtext_columns:
      - "14 mm"
      - "16 mm"
      - "18 mm"
    main_text_align: center             # Apply center alignment to all main text columns
    sub_text_align: right               # Apply right alignment to all sub text columns
    rotate: false                       # Rotate label 90 degrees (default: false)
    # Note: In batch mode, alignment applies to all columns of the same type

# Single column alternatives (if you prefer):
# - title: "M5 × 20"                   # Single main text
#   subtext: "DIN 7984"                # Optional single sub-text  
#   icon: "fasteners_screw_hex"
#   width_mm: 45                       # Override global width
#   height_mm: 18                      # Override global height
#   main_text_align: center            # Override: center main text
#   sub_text_align: justify            # Override: justify sub text
#   rotate: false                      # Rotate label 90 degrees (default: false)
#
# 💡 Text Alignment System:
# - UI has global alignment controls (left, center, right, justify, custom)
# - When "Custom" is selected, hover tooltips appear for individual cell alignment
# - Global settings apply to all columns; Custom mode allows per-cell control
# - For batch processing, alignment applies uniformly to all columns of the same type
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
            'Screw Heads': ['heads_cross', 'heads_hex_external', 'heads_hex_socket', 'heads_phillips', 'heads_pozidriv', 'heads_robertson', 'heads_slotted', 'heads_square_external', 'heads_ta', 'heads_torx', 'heads_torx_tamperproof'],
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
            'heads_pozidriv': 'Pozidriv',
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
        // Store the icon for the currently active selector
        if (this.currentIconSelector === 1) {
            this.selectedIcon1 = iconKey;
        } else {
            this.selectedIcon2 = iconKey;
        }
        
        // For backwards compatibility, also set selectedIcon to the primary icon
        this.selectedIcon = this.selectedIcon1;
        
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

        // Update the hidden select for compatibility (use primary icon)
        const selectElement = document.getElementById('icon-select');
        selectElement.value = this.selectedIcon1;
        selectElement.innerHTML = `<option value="${this.selectedIcon1}" selected>${this.iconNames[this.selectedIcon1] || this.selectedIcon1}</option>`;

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
            
            // Translate and rotate - text alignment is preserved in the original canvas
            rotatedCtx.translate(canvas.height, 0);
            rotatedCtx.rotate(Math.PI / 2);
        }
        
        // Draw the original canvas onto the rotated canvas
        // Text alignment from the original rendering is preserved
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
                if (parsed.exportRotate !== undefined) {
                    document.getElementById('export-rotate').checked = parsed.exportRotate;
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
                exportRotate: document.getElementById('export-rotate').checked
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
