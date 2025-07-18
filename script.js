class LabelMaker {
    constructor() {
        this.availableIcons = [
            'Elec_WagoLogo', 'Elec_Wago_Alt1', 'Elec_Wago_Alt2', 'Elec_WireNut', 'Electrical_Generic',
            'Head_Flat', 'Head_Hex', 'Head_Phillips', 'Head_Robinson', 'Head_SlottedPhillips', 'Head_Torx',
            'Insert_Heat', 'Insert_Wood', 'Nut_CapNut', 'Nut_LockNut', 'Nut_Standard',
            'Screw_Round', 'Screw_Tbolt', 'Screw Truss', 'Screw TrussModified', 'Screw Wafer',
            'Screw_Bugle', 'Screw_Fillister', 'Screw_Flat', 'Screw_Hex', 'Screw_Oval', 'Screw_Pan',
            'Screw_ThumbKnurled', 'Screw_Trim', 'Thumb_Screw', 'Washer_Fender', 'Washer_Flat',
            'Washer_Split', 'Washer_StarExterior', 'Washer_StartInterior'
        ];
        this.icons = {
            'Elec_WagoLogo': 'icons/Elec_WagoLogo.png',
            'Elec_Wago_Alt1': 'icons/Elec_Wago_Alt1.png',
            'Elec_Wago_Alt2': 'icons/Elec_Wago_Alt2.png',
            'Elec_WireNut': 'icons/Elec_WireNut.png',
            'Electrical_Generic': 'icons/Electrical_Generic.png',
            'Head_Flat': 'icons/Head_Flat.png',
            'Head_Hex': 'icons/Head_Hex.png',
            'Head_Phillips': 'icons/Head_Phillips.png',
            'Head_Robinson': 'icons/Head_Robinson.png',
            'Head_SlottedPhillips': 'icons/Head_SlottedPhillips.png',
            'Head_Torx': 'icons/Head_Torx.png',
            'Insert_Heat': 'icons/Insert_Heat.png',
            'Insert_Wood': 'icons/Insert_Wood.png',
            'Nut_CapNut': 'icons/Nut_CapNut.png',
            'Nut_LockNut': 'icons/Nut_LockNut.png',
            'Nut_Standard': 'icons/Nut_Standard.png',
            'Screw_Round': 'icons/Screw_Round.png',
            'Screw_Tbolt': 'icons/Screw_Tbolt.png',
            'Screw Truss': 'icons/Screw Truss.png',
            'Screw TrussModified': 'icons/Screw TrussModified.png',
            'Screw Wafer': 'icons/Screw Wafer.png',
            'Screw_Bugle': 'icons/Screw_Bugle.png',
            'Screw_Fillister': 'icons/Screw_Fillister.png',
            'Screw_Flat': 'icons/Screw_Flat.png',
            'Screw_Hex': 'icons/Screw_Hex.png',
            'Screw_Oval': 'icons/Screw_Oval.png',
            'Screw_Pan': 'icons/Screw_Pan.png',
            'Screw_ThumbKnurled': 'icons/Screw_ThumbKnurled.png',
            'Screw_Trim': 'icons/Screw_Trim.png',
            'Thumb_Screw': 'icons/Thumb_Screw.png',
            'Washer_Fender': 'icons/Washer_Fender.png',
            'Washer_Flat': 'icons/Washer_Flat.png',
            'Washer_Split': 'icons/Washer_Split.png',
            'Washer_StarExterior': 'icons/Washer_StarExterior.png',
            'Washer_StartInterior': 'icons/Washer_StartInterior.png'
        };
        
        this.customIcons = this.loadCustomIcons();
        this.initializeEventListeners();
        this.initializeDefaultColumns();
        this.updatePreview();
        this.initializeTabs();
        this.loadAvailableIcons();
        this.initializeYamlEditor();
        this.initializeIconPicker();
        this.initializeIconUpload();
    }

    initializeEventListeners() {
        // Basic form elements
        const iconSelect = document.getElementById('icon-select');
        const labelHeight = document.getElementById('label-height');
        const labelWidth = document.getElementById('label-width');
        const updatePreview = document.getElementById('update-preview');
        const downloadPng = document.getElementById('download-png');
        const validateYaml = document.getElementById('validate-yaml');
        const generateZip = document.getElementById('generate-zip');
        
        if (iconSelect) iconSelect.addEventListener('change', () => this.updatePreview());
        if (labelHeight) labelHeight.addEventListener('change', () => this.updatePreview());
        if (labelWidth) labelWidth.addEventListener('input', () => this.updatePreview());
        if (updatePreview) updatePreview.addEventListener('click', () => this.updatePreview());
        if (downloadPng) downloadPng.addEventListener('click', () => this.downloadPNG());
        if (validateYaml) validateYaml.addEventListener('click', () => this.validateYAML());
        if (generateZip) generateZip.addEventListener('click', () => this.generateZIP());
        
        // Column selector event listeners
        document.querySelectorAll('.column-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.updateColumn('main', action);
            });
        });
        
        document.querySelectorAll('.sub-column-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.updateColumn('sub', action);
            });
        });
        
        // Initial setup for text inputs
        this.setupMainTextInputs();
        this.setupSubTextInputs();
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
        const countElement = document.querySelector(isMain ? '.column-count' : '.sub-column-count');
        const inputClass = isMain ? 'main-text-input' : 'sub-text-input';
        
        let currentCount = container.querySelectorAll(`.${inputClass}`).length;
        
        if (action === 'add' && currentCount < 4) {
            currentCount++;
        } else if (action === 'remove' && currentCount > 1) {
            currentCount--;
        }
        
        this.updateTextInputs(container, inputClass, currentCount, isMain);
        countElement.textContent = currentCount;
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
        const mainTextInputs = document.querySelectorAll('.main-text-input');
        const mainTexts = Array.from(mainTextInputs).map(input => input.value.trim()).filter(text => text);
        const subTextInputs = document.querySelectorAll('.sub-text-input');
        const subTexts = Array.from(subTextInputs).map(input => input.value.trim()).filter(text => text);
        const height = document.getElementById('label-height').value;
        const width = document.getElementById('label-width').value;

        const labelPreview = document.getElementById('label-preview');
        const iconContainer = labelPreview.querySelector('.label-icon');
        const mainTextElement = labelPreview.querySelector('.main-text');
        const subTextElement = labelPreview.querySelector('.sub-text');

        // Get icon path from either built-in icons or custom icons
        const iconPath = this.icons[iconSelect] || this.customIcons[iconSelect] || this.icons['Head_Hex'];
        iconContainer.innerHTML = `<img class="icon" src="${iconPath}" alt="${iconSelect}">`;
        
        // Update main text with columns
        if (mainTexts.length === 0) {
            mainTextElement.innerHTML = '<div class="main-text-column">M3</div><div class="main-text-column">M3</div><div class="main-text-column">M3</div>';
        } else {
            const columnHTML = mainTexts.map(text => `<div class="main-text-column">${text}</div>`).join('');
            mainTextElement.innerHTML = columnHTML;
        }
        
        // Update sub text with columns
        if (subTexts.length === 0) {
            subTextElement.innerHTML = '<div class="sub-text-column">8 mm</div><div class="sub-text-column">10 mm</div><div class="sub-text-column">12 mm</div>';
        } else {
            const subColumnHTML = subTexts.map(text => `<div class="sub-text-column">${text}</div>`).join('');
            subTextElement.innerHTML = subColumnHTML;
        }

        labelPreview.setAttribute('data-height', height);
        labelPreview.style.width = `${width}mm`;

        if (subTexts.length === 0) {
            subTextElement.style.display = 'none';
        } else {
            subTextElement.style.display = 'flex';
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

            const dpi = 300;
            const mmToPx = dpi / 25.4;
            
            canvas.width = width * mmToPx;
            canvas.height = height * mmToPx;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

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

            const link = document.createElement('a');
            const labelName = mainTexts.length > 0 ? mainTexts.join('_') : 'label';
            link.download = `label-${labelName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('PNG download failed:', error);
            alert('Failed to download PNG. Please try again.');
        }
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
        const iconPath = this.icons[iconType] || this.customIcons[iconType] || this.icons['Head_Hex'];
        
        return new Promise((resolve, reject) => {
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
                document.getElementById(`${targetTab}-tab`).style.display = targetTab === 'batch' ? 'block' : 'grid';
                
                // Refresh CodeMirror editor when batch tab becomes visible
                if (targetTab === 'batch' && this.yamlEditor) {
                    setTimeout(() => this.yamlEditor.refresh(), 100);
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
            
            // Check for long PNG options (YAML settings or UI checkboxes)
            const generateLongPng = parsed.long_png || document.getElementById('generate-long-png').checked;
            const includeCutMarks = parsed.cut_marks || document.getElementById('include-cut-marks').checked;
            
            // Generate individual labels
            for (let i = 0; i < labels.length; i++) {
                const label = labels[i];
                const canvas = await this.generateLabelCanvas(label);
                const imageData = canvas.toDataURL().split(',')[1];
                const titleText = label.title || (label.columns ? label.columns.join('_') : 'label');
                const filename = `label_${i + 1}_${titleText.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
                zip.file(filename, imageData, { base64: true });
            }
            
            // Generate long PNG strip if requested
            if (generateLongPng) {
                const longPngCanvas = await this.generateLongPngStrip(labels, includeCutMarks);
                const longPngData = longPngCanvas.toDataURL().split(',')[1];
                
                // Calculate total strip length
                const totalLength = labels.reduce((sum, label) => sum + label.width_mm, 0);
                const cutMarkSpaces = includeCutMarks ? (labels.length - 1) * 2 : 0; // 2mm per cut mark
                const totalStripLength = totalLength + cutMarkSpaces;
                
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

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue;

            if (line === 'labels:') {
                inLabels = true;
                continue;
            }

            if (inLabels) {
                if (line.startsWith('- ')) {
                    if (currentLabel) {
                        result.labels.push(currentLabel);
                    }
                    currentLabel = {};
                    
                    const keyValue = line.substring(2).trim();
                    if (keyValue.includes(':')) {
                        const [key, value] = keyValue.split(':', 2);
                        currentLabel[key.trim()] = this.parseValue(value.trim());
                    }
                } else if (line.includes(':') && currentLabel) {
                    const [key, value] = line.split(':', 2);
                    currentLabel[key.trim()] = this.parseValue(value.trim());
                }
            } else {
                // Handle global options outside of labels
                if (line.includes(':')) {
                    const [key, value] = line.split(':', 2);
                    const trimmedKey = key.trim();
                    if (trimmedKey === 'long_png' || trimmedKey === 'cut_marks') {
                        result[trimmedKey] = this.parseValue(value.trim());
                    }
                }
            }
        }

        if (currentLabel) {
            result.labels.push(currentLabel);
        }

        return result;
    }

    parseValue(value) {
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
        if (!isNaN(value)) {
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

        parsed.labels.forEach((label, index) => {
            const labelNum = index + 1;
            
            // Check for either title (single column) or columns (multi-column)
            if (!label.title && !label.columns) {
                errors.push(`Label ${labelNum}: Missing title or columns`);
            } else if (label.title && label.columns) {
                errors.push(`Label ${labelNum}: Cannot have both title and columns. Use either title for single column or columns for multi-column`);
            } else if (label.title && typeof label.title !== 'string') {
                errors.push(`Label ${labelNum}: Invalid title. Must be a string`);
            } else if (label.columns && (!Array.isArray(label.columns) || label.columns.length === 0 || label.columns.length > 4)) {
                errors.push(`Label ${labelNum}: Invalid columns. Must be an array with 1-4 string elements`);
            } else if (label.columns && label.columns.some(col => typeof col !== 'string')) {
                errors.push(`Label ${labelNum}: Invalid columns. All column values must be strings`);
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
        
        const height = label.height_mm;
        const width = label.width_mm;
        const mainTexts = label.columns ? label.columns.filter(col => col.trim()) : [label.title];
        const subTexts = label.subtext_columns ? label.subtext_columns.filter(col => col.trim()) : (label.subtext ? [label.subtext] : []);
        const iconSelect = label.icon;

        const dpi = 300;
        const mmToPx = dpi / 25.4;
        
        canvas.width = width * mmToPx;
        canvas.height = height * mmToPx;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

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
        const cutMarkWidth = includeCutMarks ? 2 * mmToPx : 0; // 2mm cut marks
        
        let totalWidth = 0;
        const labelCanvases = [];
        
        // Generate individual label canvases and calculate total width
        for (const label of labels) {
            const canvas = await this.generateLabelCanvas(label);
            labelCanvases.push(canvas);
            totalWidth += canvas.width;
            
            // Add cut mark space between labels (except after the last one)
            if (labels.indexOf(label) < labels.length - 1 && includeCutMarks) {
                totalWidth += cutMarkWidth;
            }
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
            
            // Draw cut marks between labels (except after the last one)
            if (i < labelCanvases.length - 1 && includeCutMarks) {
                this.drawCutMarks(stripCtx, currentX, labelHeight, cutMarkWidth);
                currentX += cutMarkWidth;
            }
        }
        
        return stripCanvas;
    }
    
    drawCutMarks(ctx, x, labelHeight, cutMarkWidth) {
        const cutMarkLength = labelHeight * 0.1; // 10% of label height
        const cutMarkThickness = 1;
        
        ctx.strokeStyle = '#666';
        ctx.lineWidth = cutMarkThickness;
        
        const centerX = x + cutMarkWidth / 2;
        
        // Top cut mark
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, cutMarkLength);
        ctx.stroke();
        
        // Bottom cut mark
        ctx.beginPath();
        ctx.moveTo(centerX, labelHeight - cutMarkLength);
        ctx.lineTo(centerX, labelHeight);
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
                    // Validate square dimensions
                    if (img.width !== img.height) {
                        alert('Please upload a square image (width = height).');
                        reject(new Error('Not square'));
                        return;
                    }

                    // Validate minimum size
                    if (img.width < 32 || img.height < 32) {
                        alert('Image must be at least 32x32 pixels.');
                        reject(new Error('Too small'));
                        return;
                    }

                    // Resize to standard size if needed (128x128)
                    const targetSize = 128;
                    canvas.width = targetSize;
                    canvas.height = targetSize;
                    
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, targetSize, targetSize);
                    ctx.drawImage(img, 0, 0, targetSize, targetSize);
                    
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
            if (error.message !== 'Not square' && error.message !== 'Too small') {
                alert('Error processing uploaded image. Please try again.');
            }
        }
    }

    generatePrompt() {
        const yamlTemplate = `# Hardware Label Maker - Batch Generation Template
# 
# Instructions for AI assistants:
# Generate a YAML file for batch label generation with the following format.
# Use this template as a starting point and modify as needed.
# 
# Requirements:
# - title: required for single column (string) OR columns: required for multi-column (array of 1-4 strings)
# - Cannot use both title and columns in the same label
# - subtext: optional (string) for single column sub text
# - subtext_columns: optional (array of 1-4 strings) for multi-column sub text
# - icon: required (must be one of the available icons listed below)
# - width_mm: required (number, 20-100)
# - height_mm: required (number, must be 9, 12, 18, or 24)
# 
# Available icons:
# ${this.availableIcons.join(', ')}
# 
# Optional global settings:
# - long_png: optional (boolean) - generates one continuous PNG strip
# - cut_marks: optional (boolean) - adds cut marks between labels for trimming
# 
# Generate 5-10 labels for various hardware components. 
# Use multi-column format when labeling drawers with multiple related items.

# Optional global settings
long_png: true      # Generate one long PNG strip (optional)
cut_marks: true     # Include cut marks between labels (optional)

labels:
  # Single column label example
  - title: "M4 × 12"
    subtext: "DIN 7984"
    icon: "Head_Hex"
    width_mm: 50
    height_mm: 12

  # Multi-column label example (for drawer sections)
  - columns: ["M2", "M3", "M4"]
    subtext_columns: ["Phillips", "Hex", "Torx"]
    icon: "Screw_Hex"
    width_mm: 60
    height_mm: 12

  # Add your own labels here...
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
            'Electrical': ['Elec_WagoLogo', 'Elec_Wago_Alt1', 'Elec_Wago_Alt2', 'Elec_WireNut', 'Electrical_Generic'],
            'Screw Heads': ['Head_Flat', 'Head_Hex', 'Head_Phillips', 'Head_Robinson', 'Head_SlottedPhillips', 'Head_Torx'],
            'Inserts': ['Insert_Heat', 'Insert_Wood'],
            'Nuts': ['Nut_CapNut', 'Nut_LockNut', 'Nut_Standard'],
            'Screws': ['Screw_Round', 'Screw_Tbolt', 'Screw Truss', 'Screw TrussModified', 'Screw Wafer', 'Screw_Bugle', 'Screw_Fillister', 'Screw_Flat', 'Screw_Hex', 'Screw_Oval', 'Screw_Pan', 'Screw_ThumbKnurled', 'Screw_Trim', 'Thumb_Screw'],
            'Washers': ['Washer_Fender', 'Washer_Flat', 'Washer_Split', 'Washer_StarExterior', 'Washer_StartInterior']
        };

        const iconNames = {
            'Elec_WagoLogo': 'Wago Logo',
            'Elec_Wago_Alt1': 'Wago Alt 1',
            'Elec_Wago_Alt2': 'Wago Alt 2',
            'Elec_WireNut': 'Wire Nut',
            'Electrical_Generic': 'Generic Electrical',
            'Head_Flat': 'Flat Head',
            'Head_Hex': 'Hex Head',
            'Head_Phillips': 'Phillips Head',
            'Head_Robinson': 'Robinson Head',
            'Head_SlottedPhillips': 'Slotted Phillips',
            'Head_Torx': 'Torx Head',
            'Insert_Heat': 'Heat Insert',
            'Insert_Wood': 'Wood Insert',
            'Nut_CapNut': 'Cap Nut',
            'Nut_LockNut': 'Lock Nut',
            'Nut_Standard': 'Standard Nut',
            'Screw Round': 'Round Screw',
            'Screw Tbolt': 'T-Bolt',
            'Screw Truss': 'Truss Screw',
            'Screw TrussModified': 'Truss Modified',
            'Screw Wafer': 'Wafer Screw',
            'Screw_Bugle': 'Bugle Screw',
            'Screw_Fillister': 'Fillister Screw',
            'Screw_Flat': 'Flat Screw',
            'Screw_Hex': 'Hex Screw',
            'Screw_Oval': 'Oval Screw',
            'Screw_Pan': 'Pan Screw',
            'Screw_ThumbKnurled': 'Thumb Knurled',
            'Screw_Trim': 'Trim Screw',
            'ThumbScrew': 'Thumb Screw',
            'Washer_Fender': 'Fender Washer',
            'Washer_Flat': 'Flat Washer',
            'Washer_Split': 'Split Washer',
            'Washer_StarExterior': 'Star Exterior',
            'Washer_StartInterior': 'Star Interior'
        };

        this.iconCategories = iconCategories;
        this.iconNames = iconNames;
        this.selectedIcon = 'Head_Hex';

        // Populate the icon grid
        this.populateIconGrid();

        // Event listeners
        const pickerSelected = document.querySelector('.icon-picker-selected');
        const pickerDropdown = document.querySelector('.icon-picker-dropdown');
        const searchInput = document.getElementById('icon-search');

        pickerSelected.addEventListener('click', () => {
            const isActive = pickerSelected.classList.contains('active');
            if (isActive) {
                this.closeIconPicker();
            } else {
                this.openIconPicker();
            }
        });

        // Close picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!document.getElementById('icon-picker').contains(e.target)) {
                this.closeIconPicker();
            }
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.filterIcons(e.target.value);
        });
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
        const pickerSelected = document.querySelector('.icon-picker-selected');
        const pickerDropdown = document.querySelector('.icon-picker-dropdown');
        
        pickerSelected.classList.add('active');
        pickerDropdown.style.display = 'block';
        
        // Focus search input
        setTimeout(() => {
            document.getElementById('icon-search').focus();
        }, 100);
    }

    closeIconPicker() {
        const pickerSelected = document.querySelector('.icon-picker-selected');
        const pickerDropdown = document.querySelector('.icon-picker-dropdown');
        
        pickerSelected.classList.remove('active');
        pickerDropdown.style.display = 'none';
        
        // Clear search
        document.getElementById('icon-search').value = '';
        this.filterIcons('');
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
                this.selectIcon('Head_Hex');
            }
        }
    }
}


let labelMaker;

document.addEventListener('DOMContentLoaded', () => {
    labelMaker = new LabelMaker();
});
