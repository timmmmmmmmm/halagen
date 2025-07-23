# Feature Requests from Reddit Feedback

## **Priority Recommendations**

**Phase 1 (Quick wins):**
- UI Framework Migration (Bootstrap 5)
- Icon Count Selection Feature (0/1/2 icons)
- Text centering
- Toggle second row

**Phase 2 (Enhanced functionality):**
- Basic crimping icons
- Icon overlay system
- QR code integration

## **Future Considerations / Maybe Later**
- **Direct printing integration**: Enable direct printing to label printers without saving as PNG first
  - Would require integration with browser printing APIs or label printer SDKs
  - Complex implementation, uncertain browser support
  - Users can continue using current PNG → label printer workflow

# Feature Details

## **UI Framework Migration**
**Move to Bootstrap 5 for better component system and styling**

**Implementation Plan:**
- Add Bootstrap 5 CSS to existing HTML (CDN or local copy)
- Migrate existing form controls to Bootstrap classes
- Update button styling to use Bootstrap button components
- Implement Bootstrap button groups for icon count selector
- Use Bootstrap grid system for better layout balance
- Update input fields to use Bootstrap form controls
- Maintain current functionality while improving visual consistency
- Test responsive behavior on different screen sizes

**Benefits:**
- Professional, consistent styling out of the box
- Ready-made components (button groups, form controls, modals)
- No build process required - works with current static setup
- Easier to implement future UI features

## **Icon Count Selection Feature**
**Addresses no-image mode and dual icon support requests**

**Implementation Plan:**
- Add icon count selector as Bootstrap-style button group with three buttons: `[0] [1] [2]`
- Position above height setting, left of width setting for UI balance
- Default state: 1 icon (current behavior)
- Button group styling: Connected buttons, active button highlighted, inactive buttons subdued

**Behavior per mode:**
- **0 Icons**: Hide all icon selectors, text area expands to full label width
- **1 Icon**: Current behavior, single icon selector visible
- **2 Icons**: Show two icon selectors (Icon 1, Icon 2), arrange side by side in label

**Layout adjustments:**
- 0 icons: Text spans full width, centered or left-aligned based on text alignment setting
- 1 icon: Current layout (icon left, text right)
- 2 icons: Icons positioned left side (stacked or side-by-side), text area adjusted accordingly

**UI considerations:**
- When switching from 2→1 icons, preserve Icon 1 selection, clear Icon 2
- When switching from 1→0 icons, hide icon selector but preserve selection for when user switches back
- Update preview canvas in real-time when mode changes

## **Text Centering/Justification**
Add center alignment option for text

## **Toggle Second Row**
Option to disable subtitle/subtext completely for single-line labels

## **Crimping/Electrical Icons**
Add ferrules, terminal connections, and other electrical component icons

## **Icon Overlay System**
Implement Cullenect-style overlays where tool interface icons are overlaid on bolt shapes

## **QR Code Integration**
Add QR codes to labels for linking to specifications, inventory systems, or part databases
   
**Implementation Plan:**
- Add "QR Code" section in label editor UI
- Input field with 20-25 character limit for reliable scanning at 12mm height
- Live character counter showing remaining characters  
- Helper text: "Use TinyURL.com to shorten long URLs"
- Real-time QR code preview as user types
- Use client-side QR library (qrcode.js or qrcode-generator)
- Position QR on right side of label, adjust text layout accordingly
- QR version 2-3 (25x25 to 29x29 modules) with error correction level L
- Disable QR generation if over character limit

## **Implementation Notes**
- The dual icon feature would work well with the existing fastener/head icon structure you already have
- The overlay concept could leverage your existing SVG head icons to create composite visuals