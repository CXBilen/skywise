# SkyWise - Figma Import Package

This package contains HTML screens optimized for importing into Figma using the **HTML to Design** plugin.

## 📱 Screens Included

### Mobile Screens (375 × 812px - iPhone 14 Pro)

1. **01-mobile-onboarding-welcome.html** - Welcome screen with value proposition
2. **02-mobile-onboarding-email.html** - Email permission request
3. **03-mobile-onboarding-calendar.html** - Calendar permission request
4. **04-mobile-chat-empty.html** - Empty chat state with suggestions
5. **05-mobile-flight-options.html** - Flight search results with calendar fit badges
6. **06-mobile-trip-summary.html** - Trip confirmation bottom sheet
7. **07-mobile-conflict-detection.html** - Calendar conflict warning
8. **08-mobile-email-import.html** - Email extraction with confidence indicators
9. **09-mobile-success-undo.html** - Booking success with undo toast

### Desktop Screens (1440 × 900px)

10. **10-desktop-chat-full.html** - Full desktop interface with side panel

## 🔌 How to Import into Figma

### Step 1: Install the Plugin

1. Open Figma
2. Go to **Resources** (Shift + I) → **Plugins** tab
3. Search for "**HTML to Design by Divriots**"
4. Click **Run** or **Save** to add it

### Step 2: Import Screens

1. Open the plugin: **Plugins** → **HTML to Design**
2. Choose **Import from URL** or **Import from HTML**
3. Either:
   - **Option A**: Host these files and paste the URL
   - **Option B**: Copy the HTML content and paste directly
4. Click **Import**

### Step 3: Organize in Figma

After import, organize your frames:

```
📁 SkyWise Design System
├── 📁 Mobile Screens
│   ├── Onboarding
│   │   ├── Welcome
│   │   ├── Email Permission
│   │   └── Calendar Permission
│   ├── Chat
│   │   ├── Empty State
│   │   ├── Flight Options
│   │   └── Success + Undo
│   ├── Booking
│   │   ├── Trip Summary
│   │   └── Conflict Detection
│   └── Import
│       └── Email Import
├── 📁 Desktop Screens
│   └── Full Chat Interface
└── 📁 Components (extract after import)
    ├── Buttons
    ├── Cards
    ├── Inputs
    └── Badges
```

## 🎨 Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #0ea5e9 | Main actions, links |
| Primary Dark | #0284c7 | Hover states, gradients |
| Primary Light | #38bdf8 | Highlights, gradients |
| Success | #10b981 | Confirmations, fits |
| Warning | #f59e0b | Email import, amber states |
| Error | #ef4444 | Destructive actions |
| Conflict | #f97316 | Calendar conflicts |
| Surface | #ffffff | Cards, backgrounds |
| Muted | #f8fafc | Secondary backgrounds |
| Border | #e2e8f0 | Dividers, outlines |
| Text Primary | #0f172a | Headlines |
| Text Secondary | #64748b | Body text |
| Text Muted | #94a3b8 | Placeholders |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

| Style | Size | Weight |
|-------|------|--------|
| H1 | 28px | 700 |
| H2 | 20px | 600 |
| Body | 15px | 400 |
| Caption | 13px | 400 |
| Small | 12px | 400 |
| Tiny | 11px | 400 |

### Spacing

- Base unit: 4px
- Common values: 8px, 12px, 16px, 20px, 24px, 32px

### Border Radius

- Small: 6px (badges)
- Medium: 10px-12px (buttons, inputs)
- Large: 14px-16px (cards)
- XL: 20px-28px (modals, sheets)

## 🔗 Creating Prototype Flows

After importing, set up these prototype connections:

### Onboarding Flow
```
Welcome → [Get Started] → Email Permission
Email Permission → [Connect/Skip] → Calendar Permission
Calendar Permission → [Connect/Skip] → Chat Empty
```

### Booking Flow
```
Chat Empty → [Book a flight] → Flight Options
Flight Options → [Select] → Trip Summary
Trip Summary → [Confirm] → Success + Undo
```

### Conflict Flow
```
Flight Options → [Select conflict] → Conflict Detection
Conflict Detection → [Find alternatives] → Flight Options (filtered)
Conflict Detection → [Book anyway] → Success
```

### Import Flow
```
Chat Empty → [Import from email] → Email Import
Email Import → [Add to Calendar] → Success + Undo
```

## 📐 Frame Sizes

- **Mobile**: 375 × 812px (iPhone 14 Pro)
- **Desktop**: 1440 × 900px

## 🚀 Quick Start Tips

1. **Auto Layout**: Convert imported groups to Auto Layout for responsive behavior
2. **Components**: Create components from repeated elements (buttons, cards)
3. **Variants**: Set up button variants (primary, outline, ghost)
4. **Styles**: Create color and text styles from the design tokens

## 📦 Files

```
screens/
├── 01-mobile-onboarding-welcome.html
├── 02-mobile-onboarding-email.html
├── 03-mobile-onboarding-calendar.html
├── 04-mobile-chat-empty.html
├── 05-mobile-flight-options.html
├── 06-mobile-trip-summary.html
├── 07-mobile-conflict-detection.html
├── 08-mobile-email-import.html
├── 09-mobile-success-undo.html
└── 10-desktop-chat-full.html
```

---

Created for **SkyWise AI Travel Assistant** case study.
