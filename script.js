class LabelMaker {
    constructor() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    new LabelMaker();
});