# SkyWise - AI-Powered Travel Assistant

A Next.js application demonstrating an AI-powered airplane reservation chatbot with email and calendar integration. This is a fully functional case study implementation showcasing modern UX patterns for conversational AI interfaces.

## 🎯 Project Overview

SkyWise is a conversational travel assistant that helps users:
- **Search and book flights** using natural language
- **Import trips from email** with AI-powered extraction
- **Detect calendar conflicts** before booking
- **Manage travel plans** with full control and reversibility

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
skywise-travel/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── flights/         # Flight search API
│   │   ├── trips/           # Trip management API
│   │   ├── calendar/        # Calendar conflict checking
│   │   └── email/           # Email import API
│   ├── chat/                # Main chat interface
│   ├── onboarding/          # Onboarding flow
│   ├── settings/            # Settings page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   ├── chat/                # Chat components
│   │   ├── chat-message.tsx
│   │   ├── chat-input.tsx
│   │   └── quick-reply-chips.tsx
│   ├── flights/             # Flight-related components
│   │   ├── flight-card.tsx
│   │   ├── trip-summary-card.tsx
│   │   ├── imported-trip-card.tsx
│   │   ├── conflict-card.tsx
│   │   └── undo-toast.tsx
│   ├── layout/              # Layout components
│   │   ├── app-header.tsx
│   │   ├── side-panel.tsx
│   │   └── bottom-sheet.tsx
│   ├── onboarding/          # Onboarding components
│   │   └── onboarding-step.tsx
│   └── ui/                  # shadcn/ui components
├── hooks/                   # Custom React hooks
│   ├── use-chat-state.ts
│   └── use-toast.ts
├── lib/
│   ├── db/                  # Database configuration
│   │   ├── index.ts
│   │   └── schema.ts        # Drizzle schema
│   └── utils.ts             # Utility functions
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

### 3. Flight Booking
- Flight comparison cards
- Calendar conflict detection
- Trip summary with calendar preview
- One-click booking with undo support

### 4. Email Import
- Automatic flight detection
- Confidence indicators on extracted data
- Inline editing for corrections
- Add to calendar with preview

### 5. Conflict Resolution
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

## 🎯 Case Study Context

This project was created as a design case study demonstrating:

- **Realistic AI Usage** - AI can be wrong; design for recovery
- **Trust & User Control** - Users always in control
- **Clear Recovery UX** - Undo and edit everything
- **Structured Experience** - Progressive disclosure of complexity
- **Production-Ready Code** - Real implementation, not just mockups

## 📝 License

MIT License - feel free to use this as a template for your own projects.

---

Built with ❤️ using Next.js, Bun, and Neon
