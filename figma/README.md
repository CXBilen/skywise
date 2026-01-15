# SkyWise - Figma HTML Screens

This package contains HTML screens optimized for importing into Figma using the **HTML to Design** MCP server.

## Folder Structure

```
figma/
├── mobile/                    # Mobile screens (375 × 812px)
│   ├── 00-mobile-landing.html
│   ├── 01-mobile-onboarding-welcome.html
│   ├── 02-mobile-onboarding-email.html
│   ├── 03-mobile-onboarding-calendar.html
│   ├── 04-mobile-chat-empty.html
│   ├── 05-mobile-flight-options.html
│   ├── 06-mobile-trip-summary.html
│   ├── 07-mobile-conflict-detection.html
│   ├── 08-mobile-email-import.html
│   ├── 09-mobile-success-undo.html
│   ├── 10-mobile-chat-full.html
│   ├── 11-mobile-trips-dashboard.html
│   ├── 12-mobile-import-choose.html
│   ├── 13-mobile-import-scanning.html
│   ├── 14-mobile-import-results.html
│   ├── 15-mobile-import-success.html
│   ├── 16-mobile-settings.html
│   ├── 17-mobile-docs.html
│   └── userflows/             # Mobile user flow diagrams
│       ├── flow-01-onboarding.html
│       ├── flow-02-booking.html
│       └── flow-03-import.html
├── desktop/                   # Desktop screens (1440 × 900px)
│   ├── 00-desktop-landing.html
│   ├── 01-desktop-onboarding-welcome.html
│   ├── 02-desktop-onboarding-email.html
│   ├── 03-desktop-onboarding-calendar.html
│   ├── 04-desktop-chat-empty.html
│   ├── 05-desktop-flight-options.html
│   ├── 06-desktop-trip-summary.html
│   ├── 07-desktop-conflict-detection.html
│   ├── 08-desktop-email-import.html
│   ├── 09-desktop-success-undo.html
│   ├── 10-desktop-chat-full.html
│   ├── 11-desktop-trips-dashboard.html
│   ├── 12-desktop-import-choose.html
│   ├── 13-desktop-import-scanning.html
│   ├── 14-desktop-import-results.html
│   ├── 15-desktop-import-success.html
│   ├── 16-desktop-settings.html
│   ├── 17-desktop-docs.html
│   └── userflows/             # Desktop user flow diagrams
│       ├── flow-01-onboarding.html
│       ├── flow-02-booking.html
│       ├── flow-03-import.html
│       └── flow-04-conflict.html
└── README.md
```

## Screen Overview

### Mobile Screens (375 × 812px - iPhone 14 Pro)

| # | Screen | Description | Flow |
|---|--------|-------------|------|
| 00 | Landing Page | Hero section with value proposition | Entry |
| 01 | Onboarding Welcome | Value proposition + features | Start |
| 02 | Onboarding Email | Email permission request | Onboarding |
| 03 | Onboarding Calendar | Calendar permission request | Onboarding |
| 04 | Chat Empty | Empty chat state with suggestions | Main |
| 05 | Flight Options | Search results with calendar fit badges | Booking |
| 06 | Trip Summary | Booking confirmation bottom sheet | Booking |
| 07 | Conflict Detection | Calendar conflict warning | Booking |
| 08 | Email Import | Extraction with confidence indicators | Import |
| 09 | Success + Undo | Booking success with undo toast | Complete |
| 10 | Chat Full | Full conversation with flight cards | Main |
| 11 | Trips Dashboard | My trips list with expandable cards | Trips |
| 12 | Import Choose | Import method selection (auto/manual) | Import |
| 13 | Import Scanning | Email scan progress animation | Import |
| 14 | Import Results | Discovered flights with confidence | Import |
| 15 | Import Success | Confirmation with actions | Import |
| 16 | Settings | Preferences and connected accounts | Settings |
| 17 | Documentation | Help and design principles | Help |

### Desktop Screens (1440 × 900px - Standard Laptop)

| # | Screen | Description | Layout |
|---|--------|-------------|--------|
| 00 | Landing Page | Hero section with CTA | Full width |
| 01 | Onboarding Welcome | Value proposition + features | Centered card |
| 02 | Onboarding Email | Email permission request | Centered card |
| 03 | Onboarding Calendar | Calendar permission request | Centered card |
| 04 | Chat Empty | Empty chat with welcome message | Full width |
| 05 | Flight Options | Search results with flight cards | Chat only |
| 06 | Trip Summary | Booking confirmation | Chat + Side panel |
| 07 | Conflict Detection | Calendar conflict warning | Chat + Side panel |
| 08 | Email Import | Extraction with confidence indicators | Chat + Side panel |
| 09 | Success + Undo | Booking success with undo toast | Chat + Toast |
| 10 | Chat Full | Full conversation with side panel | Chat + Side panel |
| 11 | Trips Dashboard | My trips with expanded trip view | Two-column |
| 12 | Import Choose | Import method selection | Centered card |
| 13 | Import Scanning | Email scan progress | Centered |
| 14 | Import Results | Discovered flights list | Full width |
| 15 | Import Success | Confirmation with actions | Centered |
| 16 | Settings | Preferences and connected accounts | Sidebar + Content |
| 17 | Documentation | Help with sidebar navigation | Sidebar + Content |

## User Flow Diagrams

### Desktop User Flows (in `desktop/userflows/`)

| Flow | File | Steps | Dimensions |
|------|------|-------|------------|
| Onboarding | flow-01-onboarding.html | 5 screens | 4800 × 1000px |
| Booking | flow-02-booking.html | 5 screens | 5600 × 1000px |
| Import | flow-03-import.html | 4 screens | 4800 × 1000px |
| Conflict | flow-04-conflict.html | 3 screens | 3200 × 1000px |

### Mobile User Flows (in `mobile/userflows/`)

| Flow | File | Steps | Dimensions |
|------|------|-------|------------|
| Onboarding | flow-01-onboarding.html | 4 screens | 2400 × 920px |
| Booking | flow-02-booking.html | 4 screens | 2800 × 920px |
| Import | flow-03-import.html | 4 screens | 2400 × 920px |

## Using with HTML to Design MCP

### MCP Server URL

```
https://h2d-mcp.divriots.com/[YOUR-SESSION-ID]/mcp
```

### Import via MCP

The HTML files are structured for direct import:

1. Each file is self-contained with embedded CSS
2. Fixed viewport sizes for consistent import
3. Google Fonts loaded via CDN
4. Semantic HTML structure

### Import Commands

```bash
# Mobile screens
mcp__figma__get_design_context --nodeId="mobile/01" --fileKey="..."

# Desktop screens
mcp__figma__get_design_context --nodeId="desktop/10" --fileKey="..."

# User flows (wide canvas)
mcp__figma__get_design_context --nodeId="desktop/userflows/flow-01" --fileKey="..."
```

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#0ea5e9` | Main actions, links |
| Primary Dark | `#0284c7` | Hover states, gradients |
| Primary Light | `#38bdf8` | Highlights |
| Success | `#10b981` | Confirmations, fits |
| Warning | `#f59e0b` | Email import, medium confidence |
| Error | `#ef4444` | Destructive actions |
| Conflict | `#f97316` | Calendar conflicts |
| Surface | `#ffffff` | Cards, backgrounds |
| Muted | `#f8fafc` | Secondary backgrounds |
| Border | `#e2e8f0` | Dividers, outlines |
| Text Primary | `#0f172a` | Headlines |
| Text Secondary | `#64748b` | Body text |
| Text Muted | `#94a3b8` | Placeholders |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

| Style | Size | Weight |
|-------|------|--------|
| H1 | 28px (mobile) / 36px (desktop) | 700 |
| H2 | 20px (mobile) / 24px (desktop) | 600 |
| Body | 15px | 400 |
| Caption | 13px | 400 |
| Small | 12px | 400 |
| Tiny | 11px | 400 |

### Spacing

- Base unit: 4px
- Common values: 8px, 12px, 16px, 20px, 24px, 32px

### Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | 6px | Badges, chips |
| Medium | 10-12px | Buttons, inputs |
| Large | 14-16px | Cards |
| XL | 20-28px | Modals, sheets |

## Prototype Flows

### Landing → Onboarding Flow
```
00-Landing → [Get Started] → 01-Welcome
01-Welcome → [Get Started] → 02-Email Permission
02-Email → [Connect/Skip] → 03-Calendar Permission
03-Calendar → [Connect/Skip] → 04-Chat Empty
```

### Booking Flow
```
04-Chat Empty → [Book a flight] → 05-Flight Options
05-Options → [Select] → 06-Trip Summary
06-Summary → [Confirm] → 09-Success + Undo
09-Success → [View My Trips] → 11-Trips Dashboard
```

### Conflict Flow
```
05-Options → [Select conflict] → 07-Conflict Detection
07-Conflict → [Find alternatives] → 05-Options (filtered)
07-Conflict → [Book anyway] → 09-Success
```

### Import Flow (New in v0.0.4)
```
12-Import Choose → [Auto-Scan] → 13-Import Scanning
13-Scanning → [Complete] → 14-Import Results
14-Results → [Add] → 15-Import Success
15-Success → [View My Trips] → 11-Trips Dashboard
```

### Full Conversation Flow
```
04-Chat Empty → [User message] → 10-Chat Full
```

## v0.0.4 Updates

New screens added in v0.0.4:

### New Screens
- **Landing Page** (00) - Hero section with value proposition
- **Trips Dashboard** (11) - My trips list with expanded trip details
- **Import Wizard** (12-15) - 4-step import flow with auto/manual options
- **Settings** (16) - Preferences and connected accounts management
- **Documentation** (17) - Help center with design principles

### User Flow Diagrams
Complete user flow visualizations showing screen-to-screen transitions with:
- Step labels and screen frames
- Arrow connectors between steps
- Contextual notes explaining each step
- Phone frame mockups for mobile flows

### Enhanced Features
- **Confidence indicators** - Color-coded badges for AI certainty levels
- **Recovery prompts** - UI for handling AI misunderstandings
- **Enhanced undo toast** - With contextual explanations
- **Progressive disclosure** - Three-level bottom sheet design (mobile)
- **Side panel layout** - Contextual details panel (desktop)
- **Bottom navigation** - Consistent nav across all mobile screens
- **Top navigation** - Consistent nav bar for desktop screens

## Frame Sizes

| Platform | Width | Height | Device |
|----------|-------|--------|--------|
| Mobile | 375px | 812px | iPhone 14 Pro |
| Desktop | 1440px | 900px | Standard laptop |
| Desktop User Flow | 3200-5600px | 1000px | Wide canvas |
| Mobile User Flow | 2400-2800px | 920px | Wide canvas |

## Total Screens

- **Mobile**: 18 screens + 3 user flows
- **Desktop**: 18 screens + 4 user flows
- **Total**: 36 screens + 7 user flow diagrams = **43 HTML files**

---

Created for **SkyWise AI Travel Assistant** case study (v0.0.4)
