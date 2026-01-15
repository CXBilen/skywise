# SkyWise - AI-Powered Travel Assistant

**Version 0.0.4** | [Live Demo](/chat) | [Documentation](/docs)

A Next.js application demonstrating an AI-powered airplane reservation chatbot with email and calendar integration. This is a fully functional case study implementation showcasing modern UX patterns for conversational AI interfaces.

## 🎯 Project Overview

SkyWise is a conversational travel assistant that helps users:
- **Search and book flights** using natural language
- **Import trips from email** with AI-powered extraction (automatic and manual)
- **Detect calendar conflicts** before booking
- **Manage travel plans** with full control and reversibility
- **View and manage trips** with dedicated trips dashboard

### Design Principles

1. **"AI Suggests, User Decides"** - AI recommends, but never acts unilaterally
2. **"No Calendar Writes Without Explicit Confirmation"** - Always preview before changes
3. **"Always Editable, Always Reversible"** - Undo available for all actions
4. **"Show Your Work"** - Confidence levels and sources are visible

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Runtime:** Bun
- **Database:** Neon (Serverless PostgreSQL)
- **ORM:** Drizzle ORM
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Language:** TypeScript

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Neon](https://neon.tech/) account for database

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skywise-travel
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Neon database URL:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

4. **Set up the database**
   ```bash
   bun run db:generate
   bun run db:push
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
skywise/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── flights/         # Flight search API
│   │   ├── trips/           # Trip management API
│   │   ├── calendar/        # Calendar conflict checking
│   │   ├── conversations/   # Conversation history API
│   │   └── email/           # Email import API
│   ├── chat/                # Main chat interface
│   ├── docs/                # Documentation pages (dynamic routes)
│   │   ├── page.tsx         # Docs index
│   │   └── [slug]/          # Individual doc pages
│   ├── import/              # Email import wizard (auto + manual)
│   ├── onboarding/          # Onboarding flow
│   ├── presentation/        # Case study presentation
│   ├── settings/            # Settings page
│   ├── trips/               # Trips management dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── icon.svg             # App icon
│   ├── apple-icon.svg       # Apple touch icon
│   └── globals.css          # Global styles
├── components/
│   ├── chat/                # Chat components
│   │   ├── chat-message.tsx
│   │   ├── chat-input.tsx
│   │   ├── clarification-prompt.tsx
│   │   ├── confidence-indicator.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-recovery.tsx
│   │   ├── feature-card.tsx
│   │   ├── inline-undo-prompt.tsx
│   │   ├── quick-reply-chips.tsx
│   │   ├── recovery-prompt.tsx
│   │   ├── tour-overlay.tsx
│   │   ├── tour-tooltip.tsx
│   │   └── undo-action-preview.tsx
│   ├── flights/             # Flight-related components
│   │   ├── flight-card.tsx
│   │   ├── trip-summary-card.tsx
│   │   ├── trip-mini-card.tsx
│   │   ├── imported-trip-card.tsx
│   │   ├── conflict-card.tsx
│   │   └── undo-toast.tsx
│   ├── layout/              # Layout components
│   │   ├── app-header.tsx
│   │   ├── side-panel.tsx
│   │   └── bottom-sheet.tsx
│   ├── onboarding/          # Onboarding components
│   │   └── onboarding-step.tsx
│   ├── trust/               # Trust & privacy components
│   │   └── permission-explainer.tsx
│   └── ui/                  # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── date-picker.tsx  # Date picker component
│       └── ...
├── hooks/                   # Custom React hooks
│   ├── use-chat-state.ts
│   ├── use-responsive.ts
│   ├── use-toast.ts
│   └── use-tour.ts
├── lib/
│   ├── ai/                  # AI processing layer
│   │   ├── intent-parser.ts
│   │   ├── conversation-context.ts
│   │   ├── response-generator.ts
│   │   └── misunderstanding-scenarios.ts
│   ├── actions/             # Action management
│   │   └── undo-manager.ts
│   ├── demo/                # Demo scenarios
│   │   └── scenario-runner.ts
│   ├── email/               # Email processing
│   │   ├── parser.ts
│   │   └── mock-emails.ts
│   ├── db/                  # Database configuration
│   │   ├── index.ts
│   │   └── schema.ts        # Drizzle schema
│   ├── design-tokens.ts     # Design system tokens
│   ├── tour-config.ts       # Tour configuration
│   └── utils.ts             # Utility functions
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md
│   ├── CASE_STUDY_MAPPING.md
│   ├── COMPETITIVE_ANALYSIS.md
│   ├── DESIGN_DECISIONS.md
│   ├── INDEX.md
│   ├── PERSONAS.md
│   ├── USER_FLOWS.md
│   └── UX_RESEARCH.md
├── figma/                   # Figma HTML screens (43 total)
│   ├── mobile/              # 18 mobile screens (00-17) + 3 user flows (375×812px)
│   │   └── userflows/       # Mobile user flow diagrams
│   ├── desktop/             # 18 desktop screens (00-17) + 4 user flows (1440×900px)
│   │   └── userflows/       # Desktop user flow diagrams
│   └── README.md            # Figma export documentation
├── drizzle.config.ts        # Drizzle configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json
```

## 🎨 Key Features & Screens

### 1. Onboarding Flow
- Welcome screen with value proposition
- Email permission request (read-only)
- Calendar permission request (read/write with explicit confirmation)
- Preferences setup (home airport, seat preference)

### 2. Chat Interface
- Natural language flight search
- Quick-reply chips for common actions
- Inline flight cards with calendar fit indicators
- Real-time typing indicators
- Onboarding tour with tooltips

### 3. Flight Booking
- Flight comparison cards
- Calendar conflict detection
- Trip summary with calendar preview
- One-click booking with undo support

### 4. Email Import Wizard
- **Automatic Discovery**: Scan connected email for flight confirmations
- **Manual Entry**: Paste confirmation emails for AI extraction
- Per-field confidence indicators
- Inline editing for corrections
- Add to calendar with preview

### 5. Trips Dashboard
- View all upcoming and completed trips
- Filter by status (all/upcoming/completed)
- Expandable flight details
- Edit and cancel trip actions
- Calendar sync status indicators

### 6. Conflict Resolution
- Visual timeline showing overlap
- Multiple resolution options
- Alternative flight suggestions
- "Book anyway" option with skip calendar

## 🗄 Database Schema

The application uses Drizzle ORM with Neon PostgreSQL:

- **users** - User profiles and preferences
- **trips** - Booked and draft trips
- **flights** - Individual flight segments
- **conversations** - Chat conversation metadata
- **messages** - Chat messages with metadata
- **imported_emails** - Extracted flight data from emails
- **calendar_conflicts** - Detected conflicts
- **undo_actions** - Reversible action tracking

## 🧪 Demo Mode

The application includes a full demo mode with mock data:
- Pre-populated flight options
- Simulated calendar conflicts
- Mock email imports
- All features work without external APIs

## 📱 Responsive Design

- **Desktop:** Two-panel layout (chat + side panel)
- **Mobile:** Single-column with bottom sheets
- Consistent experience across devices

## 🔐 Trust & Privacy Features

- Clear permission explanations
- Read-only email access
- Explicit confirmation for calendar writes
- Undo available for all actions
- Data transparency and audit trail

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

```bash
vercel deploy
```

### Deploy to Other Platforms

The app is compatible with any platform supporting Next.js 15:
- Netlify
- Railway
- Render
- Self-hosted

## 📄 Scripts

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run start      # Start production server
bun run lint       # Run ESLint
bun run db:generate # Generate database migrations
bun run db:push    # Push schema to database
bun run db:studio  # Open Drizzle Studio
```

## 📖 Case Study Narrative

### The Problem

Business travelers waste 15+ minutes per trip on fragmented booking flows:
- Search on one site
- Compare on another
- Check calendar manually
- Copy-paste confirmation details
- Create calendar events by hand

### The Insight

> "What if the booking assistant could see your calendar and do the tedious work—but only with your explicit permission?"

### The Solution

SkyWise is an AI travel assistant that:
1. **Understands natural language** - "Book me a flight to SF next Tuesday"
2. **Checks your calendar** - Proactively flags conflicts
3. **Shows its work** - Displays confidence levels on extracted data
4. **Stays in your control** - Never writes without confirmation

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Chat-first interface | Speed and flexibility over rigid forms |
| Confidence indicators | AI admits uncertainty, users verify appropriately |
| 15-second undo | Optimal balance of reversibility and finality |
| Progressive disclosure on mobile | Action-first, details on demand |

### What Makes This Different

Most travel chatbots are glorified search boxes. SkyWise is designed around **trust architecture**:

- **AI suggests, user decides** - No autonomous calendar writes
- **Transparent uncertainty** - "I'm 72% sure about this time"
- **Graceful recovery** - When AI misunderstands, it admits and offers corrections

---

## 🎯 Case Study Context

This project was created as a design case study demonstrating:

- **Realistic AI Usage** - AI can be wrong; design for recovery
- **Trust & User Control** - Users always in control
- **Clear Recovery UX** - Undo and edit everything
- **Structured Experience** - Progressive disclosure of complexity
- **Production-Ready Code** - Real implementation, not just mockups

---

## 📋 Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.0.1 | Jan 2026 | Basic chat UI, mock APIs |
| 0.0.2 | Jan 2026 | NLP, error handling, undo, trust, mobile, demo |
| 0.0.3 | Jan 2026 | Confidence microcopy, recovery flows, enhanced undo UX, 20 Figma screens, tour system |
| 0.0.4 | Jan 2026 | Trips dashboard, import wizard (auto + manual), docs pages, date picker, app icons, 43 Figma HTML screens with user flow diagrams |

---

*Made for Efsora Labs by Cem Bilen*