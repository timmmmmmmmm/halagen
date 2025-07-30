# Halagen Label Generator - Todo List

## **IMPLEMENTATION STATUS** ✅

### **COMPLETED FEATURES**
- ✅ **Bootstrap 5 Migration** - Full UI framework migration completed
- ✅ **Copy YAML Button** - Export single editor settings as YAML for batch processing
- ✅ **Icon Count Selection (0/1/2)** - Full support for no icons, single icon, and dual icons
- ✅ **Text Alignment Controls** - Global and per-cell text alignment (left/center/right/justify)
- ✅ **Column Management** - Dynamic main text and sub-text column controls
- ✅ **Footer Optimization** - Compact footer layout with proper spacing

---

## **CURRENT PRIORITIES** 🚀

### 1. **QR Code Integration** - PARTIALLY IMPLEMENTED
**Status:** UI elements exist but functionality not connected
- ✅ QR input field in advanced settings
- ✅ QR preview canvas placeholder
- ❌ QR generation library integration
- ❌ QR code rendering in labels
- ❌ Character limit validation

### 2. **Button Group Visual Consistency**
**Improve visual cohesion of dimension controls**
- Make width/height inputs visually grouped with Bootstrap input groups
- Ensure column +/- buttons follow same visual pattern
- Improve button hover/click states for better UX

### 3. **Column Label Clarity**
**Replace icons with text labels for better UX**
- Change column controls to show "Main Text" / "Sub Text" labels
- Improve clarity of what each setting controls

---

## **PLANNED FEATURES** 📋

### **Phase 2: Enhanced Icons & Functionality**
- **Crimping/Electrical Icons** - Add ferrules, terminals, connectors
- **Icon Overlay System** - Composite icons (tools on fastener backgrounds)
- **Custom Icon Upload** - Better PNG handling and processing

### **Phase 3: Advanced Features**
- **Batch YAML Templates** - Pre-built templates for common use cases
- **Print Integration** - Direct label printer support
- **Advanced Typography** - Font selection, weight, spacing controls

---

## **IMPLEMENTATION DETAILS**

### **QR Code Integration** (Priority 1)
**Goal:** Enable QR codes on labels for inventory/specification links

**Technical Plan:**
- Integrate qrcode.js library for client-side generation
- Add 25-character limit with live counter
- Position QR code on right side of label
- Adjust text layout automatically when QR is present
- Support QR version 2-3 with error correction level L
- Add "Clear QR" functionality

**UI Requirements:**
- Real-time preview as user types
- Character limit validation and visual feedback
- Helper text for URL shortening recommendations

### **Visual Consistency Improvements** (Priority 2)
**Goal:** Professional, cohesive control styling

**Changes Needed:**
- Convert dimension controls to Bootstrap input groups
- Standardize button group treatments
- Improve active/hover states across all controls
- Ensure consistent spacing and alignment

### **UX Improvements** (Priority 3)
**Goal:** Clearer interface labels and controls

**Changes:**
- Replace column icons with descriptive text
- Add tooltips for advanced features
- Improve control grouping and visual hierarchy

---

## **ARCHIVED/COMPLETED DETAILED SPECS**

<details>
<summary>Bootstrap 5 Migration - COMPLETED</summary>

**Implementation completed:**
- Bootstrap 5 CSS integrated via CDN
- All controls migrated to Bootstrap classes
- Button groups implemented for icon count selection
- Bootstrap grid system in use
- Form controls standardized
- Responsive behavior verified
</details>

<details>
<summary>Icon Count Selection - COMPLETED</summary>

**Full implementation completed:**
- Three-button selector: [No icon] [One icon] [Two icons]
- Dynamic layout adjustment for each mode
- Icon selector visibility management
- Canvas rendering for all icon count modes
- State preservation when switching modes
</details>

<details>
<summary>Text Alignment - COMPLETED</summary>

**Global and per-cell alignment implemented:**
- Global alignment controls for main and sub text
- Per-cell custom alignment option
- Real-time preview updates
- Alignment state persistence
</details>