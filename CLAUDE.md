# Project overview
This repository contains an open-source, browser-based label generator for hardware components including screws, bolts, washers, nuts, and electrical components.

The project is a static web interface for generating printable PNG labels, hosted on GitHub Pages, with no backend. It works across platforms and is easily extendable through community contributions.

# Key goals
- Create a browser-based label generator that works without a backend
- Allow label content customisation through a simple interface
- Support previewing and exporting labels as PNG
- Enable community-driven icon contributions
- Keep initial implementation desktop-focused and minimal
- Prepare for mobile support, QR codes, and internationalisation in the future

# Label structure (MVP)
Each label consists of:
- A fixed width (user-defined)
- A fixed height (selectable: 9mm, 12mm, 18mm, 24mm)
- A left-aligned square icon (hardware symbol, e.g. bolt, washer, electrical connector)
- A main text line (e.g. `M4 × 12`)
- A secondary/subtext line (e.g. `DIN 7984`)

QR code support is **not included** in the MVP but may be added later, aligned on the right side in the same square format as the icon.

# MVP user interactions
Users should be able to:
- Choose a component type (e.g. Bolt, Screw, Nut, Washer, Electrical)
- Input dimensions (e.g. M3, length in mm)
- Optionally enter a subtext (standard, note)
- Choose an icon from a dropdown (from available PNGs)
- Preview the label at real size
- Select height and fixed width
- Download the label as a PNG

# Hosting and structure
- The project will be static and hosted on **GitHub Pages**
- Label rendering and export are handled entirely **in-browser**
- No external backend or database is used

# Icon system
- Icons are square PNG files stored in the `/icons` directory
- Contributors may add new icons via pull requests
- Icons cover hardware types including screws, bolts, washers, nuts, and electrical components
- Icon categories include: Electrical, Screw Heads, Inserts, Nuts, Screws, and Washers

# Community contributions
To contribute:
- New icons must be PNG files with square dimensions
- Icon files should be named clearly (e.g. `Screw_Hex.png`, `Washer_Flat.png`)
- Submit a pull request with the new icon and a brief description

# Planned future improvements
These are **not included in the MVP**, but may be added later:
- Mobile-responsive UI
- Persistent label storage (e.g. local storage, shareable URLs)
- Internationalisation (multi-language support)
- QR code generation linking to part datasheets or shop pages
- External icon library support
- User-uploaded custom icons
- Custom themes or font styles
- Print/export support for label sheets

# Project workflow
This project follows the **Explore → Plan → Code → Commit** workflow.

- Exploration and planning are done in Claude Chat
- Code generation and edits are done in Claude Code
- CLAUDE.md is updated regularly to reflect current context

# Repository etiquette
- Use clear, descriptive branch names (e.g. `feature/label-preview`, `fix/icon-alignment`)
- Prefer pull requests for all contributions
- Keep commits atomic and well-described
- Document major decisions in this file or a `plan.md`

# Developer environment
The project is intentionally lightweight and front-end only. No local server, build step, or package manager is required. Simply open `index.html` in a web browser to use the application.

# Current implementation
The project includes:
- `index.html` - Main application interface
- `styles.css` - Styling for the label generator
- `script.js` - JavaScript for label generation and PNG export
- `icons/` - Directory containing PNG icons organized by category