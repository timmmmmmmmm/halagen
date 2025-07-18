# HaLaGen (Hardware Label Generator)

A browser-based label generator for hardware components including screws, bolts, washers, nuts, and electrical components. Generate printable PNG labels with customizable dimensions and icons. Ideally to be used in label-print editors like Brother's P-touch Editor.

<div align="center">
  <a href="https://timmmmmmmmm.github.io/halagen">
    <img src="img/screenshot_halagen.png" alt="HaLaGen Interface" width="570px">
  </a>
</div>

## Features

- **No backend required** - Works entirely in your browser
- **Customizable labels** - Choose from multiple height options (9mm, 12mm, 18mm, 24mm) and set custom widths
- **Hardware-specific icons** - Extensive collection of icons for screws, bolts, washers, nuts, and electrical components
- **Multi-column support** - Create labels with multiple columns when your container has sections
- **Custom icon loading** - Upload your own icons or use the built-in collection
- **YAML batch processor** - Generate multiple labels at once using YAML input
- **Real-time preview** - See your label at actual size before downloading
- **PNG export** - Download labels as high-quality PNG files ready for printing
- **GitHub Pages hosted** - Access the tool at [timmmmmmmmm.github.io/halagen](https://timmmmmmmmm.github.io/halagen)

## Example Output

Here are some examples of labels generated with HaLaGen:
<div align="center">
<table>
  <tr>
    <td><img src="img/label-M3.png" alt="M3 Label" width="200px"></td>
    <td><img src="img/label-M3_heat_insert.png" alt="M3 Heat Insert" width="200px"></td>
    <td><img src="img/label-M4.png" alt="M4 Label" width="200px"></td>
  </tr>
  <tr>
    <td><img src="img/label-M6.png" alt="M6 Label" width="200px"></td>
    <td><img src="img/label-TX20_screws.png" alt="TX20 Screws" width="200px"></td>
    <td><img src="img/label-Wago_221.png" alt="Wago 221" width="200px"></td>
  </tr>
</table>
</div>

## Online Access

Visit [timmmmmmmmm.github.io/halagen](https://timmmmmmmmm.github.io/halagen) to use the tool directly in your browser.

## Usage

1. **Choose a component type** from the dropdown (Bolt, Screw, Nut, Washer, Electrical)
2. **Select an icon** that best represents your hardware
3. **Enter the main text** (e.g., "M4 × 12")
4. **Add optional subtext** (e.g., "DIN 7984")
5. **Set label dimensions** - Choose height and width
6. **Configure columns** - Add multiple columns if your container has sections
7. **Preview your label** at real size
8. **Download as PNG** and print

## Label Structure

Each label consists of:
- A square icon on the left (hardware symbol)
- Main text line (component specifications)
- Secondary text line (standards, notes, etc.)
- Multiple columns support for containers with sections
- Customizable dimensions for different label printer formats

## Multi-Column Labels

HaLaGen supports multi-column labels for when your storage containers have multiple sections. This feature allows you to create a single label that covers multiple compartments, with each column representing a different section of your container. Simply specify the number of columns needed and fill in the content for each section.

## YAML Batch Processor

HaLaGen includes a powerful YAML batch processor that allows you to generate multiple labels simultaneously. This feature is particularly useful when you need to create many labels at once.

**AI/LLM Integration**: The YAML format is designed to work seamlessly with AI assistants and Large Language Models (LLMs). Simply take fore example a screenshot of your hardware shopping basket or current organizer, and ask an AI to generate the YAML configuration for all the parts it can identify. This makes organizing large quantities of hardware components incredibly efficient.

<div align="center">
<img src="img/screenshot_batch_yaml.png" alt="YAML Batch Processor" width="570px">
</div>

Example YAML format:
```yaml
labels:
  - text: "M4 × 12"
    subtext: "DIN 7984"
    icon: "Screw_Socket"
  - text: "M6 × 20"
    subtext: "Hex Bolt"
    icon: "Screw_Hex"
```

## Contributing

We welcome contributions! Here's how you can help:

### Adding New Icons

While you can upload your own custom icons directly in the application, we encourage contributors to submit icons to the repository so that everyone can benefit from them. 

To contribute icons:
1. Create square PNG files with clear, recognizable designs
2. Name files descriptively (e.g., `Screw_Hex.png`, `Washer_Flat.png`)
3. Place icons in the appropriate subdirectory within `/icons/`
4. Submit a pull request with your new icons

### Code Contributions
- Use clear, descriptive branch names (e.g., `feature/label-preview`, `fix/icon-alignment`)
- Keep commits atomic and well-described
- Follow the existing code style

## License

This project is open source and available under the [MIT License](LICENSE).

## Icon Attribution

All icons in this project are based on designs by **3dprintbunny**, available at: https://www.printables.com/model/621771-gridfinity-bin-label-icons

Used under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
https://creativecommons.org/licenses/by/4.0/

Special thanks to 3dprintbunny for creating these excellent hardware icons that make this project possible.

## Support

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/timmmmmmmmm/halagen/issues) on GitHub.

---

*HaLaGen (Hardware Label Generator)*