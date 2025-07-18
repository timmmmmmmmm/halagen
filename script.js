class LabelMaker {
    constructor() {
        this.availableIcons = [
            'Elec_WagoLogo', 'Elec_Wago_Alt1', 'Elec_Wago_Alt2', 'Elec_WireNut', 'Electrical_Generic',
            'Head_Flat', 'Head_Hex', 'Head_Phillips', 'Head_Robinson', 'Head_SlottedPhillips', 'Head_Torx',
            'Insert_Heat', 'Insert_Wood', 'Nut_CapNut', 'Nut_LockNut', 'Nut_Standard',
            'Screw Round', 'Screw Tbolt', 'Screw Truss', 'Screw TrussModified', 'Screw Wafer',
            'Screw_Bugle', 'Screw_Fillister', 'Screw_Flat', 'Screw_Hex', 'Screw_Oval', 'Screw_Pan',
            'Screw_ThumbKnurled', 'Screw_Trim', 'ThumbScrew', 'Washer_Fender', 'Washer_Flat',
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
            'Screw Round': 'icons/Screw Round.png',
            'Screw Tbolt': 'icons/Screw Tbolt.png',
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
            'ThumbScrew': 'icons/ThumbScrew.png',
            'Washer_Fender': 'icons/Washer_Fender.png',
            'Washer_Flat': 'icons/Washer_Flat.png',
            'Washer_Split': 'icons/Washer_Split.png',
            'Washer_StarExterior': 'icons/Washer_StarExterior.png',
            'Washer_StartInterior': 'icons/Washer_StartInterior.png'
        };
        
        this.initializeEventListeners();
        this.updatePreview();
        this.initializeTabs();
        this.loadAvailableIcons();
    }

    initializeEventListeners() {
        document.getElementById('component-type').addEventListener('change', () => this.updatePreview());
        document.getElementById('icon-select').addEventListener('change', () => this.updatePreview());
        document.getElementById('main-text').addEventListener('input', () => this.updatePreview());
        document.getElementById('sub-text').addEventListener('input', () => this.updatePreview());
        document.getElementById('label-height').addEventListener('change', () => this.updatePreview());
        document.getElementById('label-width').addEventListener('input', () => this.updatePreview());
        document.getElementById('update-preview').addEventListener('click', () => this.updatePreview());
        document.getElementById('download-png').addEventListener('click', () => this.downloadPNG());
        
        document.getElementById('validate-yaml').addEventListener('click', () => this.validateYAML());
        document.getElementById('generate-zip').addEventListener('click', () => this.generateZIP());
    }

    updatePreview() {
        const iconSelect = document.getElementById('icon-select').value;
        const mainText = document.getElementById('main-text').value;
        const subText = document.getElementById('sub-text').value;
        const height = document.getElementById('label-height').value;
        const width = document.getElementById('label-width').value;

        const labelPreview = document.getElementById('label-preview');
        const iconContainer = labelPreview.querySelector('.label-icon');
        const mainTextElement = labelPreview.querySelector('.main-text');
        const subTextElement = labelPreview.querySelector('.sub-text');

        iconContainer.innerHTML = `<img class="icon" src="${this.icons[iconSelect] || this.icons['Screw_Hex']}" alt="${iconSelect}">`;
        mainTextElement.textContent = mainText || 'M4 × 12';
        subTextElement.textContent = subText || '';

        labelPreview.setAttribute('data-height', height);
        labelPreview.style.width = `${width}mm`;

        if (!subText) {
            subTextElement.style.display = 'none';
        } else {
            subTextElement.style.display = 'block';
        }
    }

    async downloadPNG() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const height = parseInt(document.getElementById('label-height').value);
            const width = parseInt(document.getElementById('label-width').value);
            const mainText = document.getElementById('main-text').value || 'M4 × 12';
            const subText = document.getElementById('sub-text').value || '';
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
            const textY = subText ? iconY + (iconSize * 0.2) : iconY + (iconSize * 0.4);
            ctx.fillText(mainText, textX, textY);

            if (subText) {
                ctx.font = `${subFontSize * mmToPx}px Arial`;
                ctx.fillStyle = '#666';
                ctx.fillText(subText, textX, textY + (mainFontSize * mmToPx * 1.2));
            }

            const link = document.createElement('a');
            link.download = `label-${mainText.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
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
        const iconPath = this.icons[iconType] || this.icons['Screw_Hex'];
        
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
            });
        });
    }

    validateYAML() {
        const yamlInput = document.getElementById('yaml-input').value.trim();
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
        const yamlInput = document.getElementById('yaml-input').value.trim();
        
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
            
            for (let i = 0; i < labels.length; i++) {
                const label = labels[i];
                const canvas = await this.generateLabelCanvas(label);
                const imageData = canvas.toDataURL().split(',')[1];
                const filename = `label_${i + 1}_${label.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
                zip.file(filename, imageData, { base64: true });
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'hardware_labels.zip';
            link.click();
            
            this.showValidationResult(`✅ ZIP generated successfully with ${labels.length} labels!`, 'success');
            
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

        parsed.labels.forEach((label, index) => {
            const labelNum = index + 1;
            
            if (!label.title || typeof label.title !== 'string') {
                errors.push(`Label ${labelNum}: Missing or invalid title`);
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
        const mainText = label.title;
        const subText = label.subtext || '';
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
        const textY = subText ? iconY + (iconSize * 0.2) : iconY + (iconSize * 0.4);
        ctx.fillText(mainText, textX, textY);

        if (subText) {
            ctx.font = `${subFontSize * mmToPx}px Arial`;
            ctx.fillStyle = '#666';
            ctx.fillText(subText, textX, textY + (mainFontSize * mmToPx * 1.2));
        }

        return canvas;
    }

    showValidationResult(message, type) {
        const resultDiv = document.getElementById('validation-result');
        resultDiv.className = `validation-result ${type}`;
        resultDiv.innerHTML = message.replace(/\n/g, '<br>');
        resultDiv.style.display = 'block';
    }

    loadAvailableIcons() {
        const iconSelect = document.getElementById('icon-select');
        const iconOptions = iconSelect.querySelectorAll('option');
        
        this.availableIcons = Array.from(iconOptions).map(option => option.value);
        this.generatePrompt();
    }

    generatePrompt() {
        const promptText = `Generate a YAML file for batch label generation with the following format:

labels:
  - title: "M4 × 12"
    subtext: "DIN 7984"
    icon: "Head_Hex"
    width_mm: 50
    height_mm: 12

Available icons:
${this.availableIcons.join(', ')}

Requirements:
- title: required (string)
- subtext: optional (string)
- icon: required (must be one of the available icons above)
- width_mm: required (number, 20-100)
- height_mm: required (number, must be 9, 12, 18, or 24)

Generate 5-10 labels for various hardware components.`;
        
        document.getElementById('llm-prompt').value = promptText;
    }
}

function copyToClipboard() {
    const promptText = document.querySelector('.llm-prompt');
    promptText.select();
    document.execCommand('copy');
    
    const button = document.querySelector('.copy-button');
    const originalText = button.textContent;
    button.textContent = '✅ Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    new LabelMaker();
});