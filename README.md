# Hardware Label Maker

A browser-based label generator for hardware components including screws, bolts, washers, nuts, and electrical components. Generate printable PNG labels with customizable dimensions and icons.

## Features

- **No backend required** - Works entirely in your browser
- **Customizable labels** - Choose from multiple height options (9mm, 12mm, 18mm, 24mm) and set custom widths
- **Hardware-specific icons** - Extensive collection of icons for screws, bolts, washers, nuts, and electrical components
- **Real-time preview** - See your label at actual size before downloading
- **PNG export** - Download labels as high-quality PNG files ready for printing
- **GitHub Pages hosted** - Access the tool at [your-username.github.io/maker-label-maker](https://your-username.github.io/maker-label-maker)

## Usage

1. **Choose a component type** from the dropdown (Bolt, Screw, Nut, Washer, Electrical)
2. **Select an icon** that best represents your hardware
3. **Enter the main text** (e.g., "M4 × 12")
4. **Add optional subtext** (e.g., "DIN 7984")
5. **Set label dimensions** - Choose height and width
6. **Preview your label** at real size
7. **Download as PNG** and print

## Label Structure

Each label consists of:
- A square icon on the left (hardware symbol)
- Main text line (component specifications)
- Secondary text line (standards, notes, etc.)
- Customizable dimensions for different label printer formats

## Getting Started

### Online Version
Visit [your-username.github.io/maker-label-maker](https://your-username.github.io/maker-label-maker) to use the tool directly in your browser.

### Local Development
1. Clone this repository
2. Open `index.html` in any modern web browser
3. No build process or dependencies required!

## Contributing

We welcome contributions! Here's how you can help:

### Adding New Icons
1. Create square PNG files with clear, recognizable designs
2. Name files descriptively (e.g., `Screw_Hex.png`, `Washer_Flat.png`)
3. Place icons in the appropriate subdirectory within `/icons/`
4. Submit a pull request with your new icons

### Code Contributions
- Use clear, descriptive branch names (e.g., `feature/label-preview`, `fix/icon-alignment`)
- Keep commits atomic and well-described
- Test your changes across different browsers
- Follow the existing code style

## File Structure

```
maker-label-maker/
├── index.html          # Main application interface
├── styles.css          # Styling for the label generator
├── script.js           # JavaScript for label generation and PNG export
├── icons/              # PNG icons organized by category
│   ├── Elec_*.png      # Electrical components
│   ├── Head_*.png      # Screw heads
│   ├── Insert_*.png    # Inserts
│   ├── Nut_*.png       # Nuts
│   ├── Screw_*.png     # Screws
│   └── Washer_*.png    # Washers
└── README.md           # This file
```

## Browser Compatibility

This tool works in all modern browsers including:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Future Enhancements

Planned features (not yet implemented):
- Mobile-responsive interface
- QR code generation
- Multi-language support
- Custom themes
- Batch label generation
- Label template saving

## License

This project is open source and available under the [MIT License](LICENSE).

## Icon Attribution

All icons in this project are based on designs by **3dprintbunny**, available at: https://www.printables.com/model/621771-gridfinity-bin-label-icons

Used under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
https://creativecommons.org/licenses/by/4.0/

Special thanks to 3dprintbunny for creating these excellent hardware icons that make this project possible.

## Support

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/your-username/maker-label-maker/issues) on GitHub.