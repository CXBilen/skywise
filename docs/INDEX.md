# SkyWise Case Study Documentation

## Efsora Labs - UX Designer (AI-Native) Position

**Version 0.0.4** | January 2026

---

## Overview

This case study demonstrates the design and development of **SkyWise**, an AI-powered travel assistant that helps users plan, book, and manage flights using conversational AI, email integration, and calendar synchronization.

---

## Quick Links

### Interactive Demo
- **[Live Demo](/chat)** - Try the booking flow
- **[Presentation Mode](/presentation)** - Full case study slideshow
- **[Onboarding Flow](/onboarding)** - See the permission setup
- **[Trips Dashboard](/trips)** - View and manage trips
- **[Import Wizard](/import)** - Email import flow (auto + manual)
- **[Settings](/settings)** - User preferences
- **[Documentation](/docs)** - Browse documentation

### Documentation
| Document | Description |
|----------|-------------|
| [UX Research](./UX_RESEARCH.md) | Problem framing, research methodology, key findings |
| [User Personas](./PERSONAS.md) | Detailed user profiles with JTBD |
| [User Flows](./USER_FLOWS.md) | Visual flow diagrams for all journeys |
| [Competitive Analysis](./COMPETITIVE_ANALYSIS.md) | Market positioning and differentiation |
| [Design Decisions](./DESIGN_DECISIONS.md) | Rationale for key design choices |
| [Case Study Mapping](./CASE_STUDY_MAPPING.md) | Requirements to implementation mapping |
| [Architecture](./ARCHITECTURE.md) | Technical architecture and data flows |

---

## Case Study Requirements Checklist

### What Candidate Should Deliver

| Requirement | Status | Location |
|-------------|--------|----------|
| Problem framing & assumptions | ✅ Complete | [UX Research](./UX_RESEARCH.md) |
| 2-3 key user flows | ✅ Complete | [User Flows](./USER_FLOWS.md) |
| Wireframes / mid-fi screens | ✅ Complete | [Figma Package](../figma/) (43 HTML files) |
| - Landing page | ✅ | Screen 00 |
| - Onboarding & permissions | ✅ | Screens 01-03 |
| - Booking via chat | ✅ | Screens 04-06, 09-10 |
| - Conflict handling | ✅ | Screen 07 |
| - Adding imported trips | ✅ | Screen 08, 12-15 (Import Wizard) |
| - Trips dashboard | ✅ | Screen 11 |
| - Settings & docs | ✅ | Screens 16-17 |
| - User flow diagrams | ✅ | 7 flow diagrams (mobile + desktop) |
| Example chatbot conversations | ✅ Complete | [Demo Scenarios](../lib/demo/scenario-runner.ts) |
| Edge cases + trust/privacy | ✅ Complete | [Design Decisions](./DESIGN_DECISIONS.md) |

### Constraints Addressed

| Constraint | Implementation |
|------------|----------------|
| Web app chatbot (mobile + desktop) | Responsive design with bottom sheet |
| Email read-only | Read-only OAuth scope, clear messaging |
| Calendar read/write with confirmation | Explicit confirmation, preview before write |
| AI can make mistakes | Confidence scores, inline editing, undo |

### Evaluation Focus Areas

| Area | Evidence |
|------|----------|
| Clear UX thinking | 4 design principles, documented decisions |
| Realistic AI usage | NLP parser, confidence scoring, error recovery |
| Trust & control | Undo system, explicit confirmations, transparency |
| Structured, simple experience | Progressive disclosure, clarification prompts |
| Figma best practices | Design tokens, component library, responsive |

---

## Key Features Demonstrated

### 1. Conversational Booking
- Natural language intent parsing
- Multi-turn context management
- Smart clarification prompts
- Quick-reply suggestions

### 2. Calendar Integration
- Proactive conflict detection
- Visual fit indicators
- Explicit write confirmations
- Alternative suggestions

### 3. Email Import
- Multi-airline parser (7 airlines)
- Per-field confidence scoring
- Inline editing for corrections
- Source attribution

### 4. Trust Mechanisms
- 15-second undo window (pause on hover)
- "AI Suggests, User Decides" principle
- No silent calendar writes
- Full transparency on AI actions

### 5. v0.0.3 Enhancements
- **Confidence Microcopy**: AI shows uncertainty levels with natural language explanations
- **Recovery Flows**: Graceful handling when AI misunderstands (e.g., "next Tuesday" ambiguity)
- **Enhanced Undo UX**: Clear explanations of what undo will do

### 6. v0.0.4 Features
- **Trips Dashboard**: View and manage all upcoming/completed trips with filtering
- **Import Wizard**: Two-mode import flow (automatic email discovery + manual paste)
- **Documentation Pages**: In-app documentation browser with dynamic routes
- **Date Picker**: Calendar-based date selection component
- **App Icons**: SVG icons for web and Apple devices
- **43 Figma HTML Screens**: Complete screen set with 7 user flow diagrams

---

## Design Principles

1. **"AI Suggests, User Decides"** - AI recommends, never acts unilaterally
2. **"No Writes Without Confirmation"** - Calendar changes require explicit approval
3. **"Always Editable, Always Reversible"** - Everything can be changed or undone
4. **"Show Your Work"** - Confidence levels and sources are visible

---

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Drizzle ORM + Neon PostgreSQL

---

## Project Structure

```
skywise/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── calendar/      # Calendar conflict checking
│   │   ├── conversations/ # Conversation history
│   │   ├── email/         # Email import
│   │   ├── flights/       # Flight search
│   │   └── trips/         # Trip management
│   ├── chat/              # Main chat interface
│   ├── docs/              # Documentation pages
│   ├── import/            # Import flow page
│   ├── onboarding/        # Permission setup flow
│   ├── presentation/      # Case study presentation
│   ├── settings/          # Settings page
│   └── trips/             # Trips management page
├── components/            # React components
│   ├── chat/              # Chat-specific (13 components)
│   ├── flights/           # Flight cards (6 components)
│   ├── layout/            # Layout components
│   ├── onboarding/        # Onboarding components
│   ├── trust/             # Trust components
│   └── ui/                # Base UI (shadcn)
├── hooks/                 # Custom React hooks
│   ├── use-chat-state.ts
│   ├── use-responsive.ts
│   ├── use-toast.ts
│   └── use-tour.ts
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md
│   ├── CASE_STUDY_MAPPING.md
│   ├── COMPETITIVE_ANALYSIS.md
│   ├── DESIGN_DECISIONS.md
│   ├── INDEX.md
│   ├── PERSONAS.md
│   ├── USER_FLOWS.md
│   └── UX_RESEARCH.md
├── lib/                   # Core logic
│   ├── ai/                # Intent parsing, NLP
│   ├── actions/           # Undo manager
│   ├── demo/              # Demo scenarios
│   ├── email/             # Email parser
│   ├── db/                # Database schema
│   ├── design-tokens.ts   # Design system tokens
│   └── tour-config.ts     # Tour configuration
└── figma/                 # Figma HTML screens (43 total)
    ├── mobile/            # Mobile screens (00-17) + userflows/
    ├── desktop/           # Desktop screens (00-17) + userflows/
    └── README.md          # Figma export documentation
```

---

## How to Run

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open in browser
open http://localhost:3000

# View presentation
open http://localhost:3000/presentation
```

---

## Contact

This case study was created for the **UX Designer (AI-Native)** position at **Efsora Labs**.

---

*Last Updated: January 2026 (v0.0.4)*
