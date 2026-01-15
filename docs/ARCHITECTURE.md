# SkyWise Architecture

**Version 0.0.4** | January 2026

## Overview

SkyWise is an AI-powered airplane reservation chatbot built with Next.js 15, TypeScript, and a trust-first design approach. The application provides a conversational interface for booking flights, importing confirmations from email, and managing travel schedules with calendar integration.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **UI Components**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Drizzle ORM with PostgreSQL (Neon)
- **State Management**: React hooks (local state)

## Key Design Decisions

### 1. Trust-First Design

User trust and privacy are paramount in this application:

- **Email Access**: Read-only. We explicitly cannot send, delete, or modify emails.
- **Calendar Access**: Read for conflict detection, write only with explicit confirmation.
- **Undo System**: 15-second grace period for all write actions.
- **Privacy Messaging**: Clear indication of what data is accessed and why.

### 2. AI-Powered Conversation

The AI layer handles diverse user inputs through:

- **Intent Parser** (`/lib/ai/intent-parser.ts`): Detects user intent and extracts entities (dates, locations, passengers).
- **Conversation Context** (`/lib/ai/conversation-context.ts`): Maintains multi-turn conversation state.
- **Response Generator** (`/lib/ai/response-generator.ts`): Produces natural, consistent responses.
- **Misunderstanding Scenarios** (`/lib/ai/misunderstanding-scenarios.ts`): Pre-defined recovery flows for ambiguous inputs.

### 3. Progressive Information Collection

Instead of requiring all information upfront:

- Accept partial inputs ("I need to fly to SF")
- Ask clarifying questions naturally
- Build booking info progressively across turns
- Use user preferences as defaults

### 4. Error Recovery UX

Graceful handling of edge cases:

- Specific error messages with actionable suggestions
- Clear recovery paths (retry, modify, start over)
- Never leave users stuck

## Directory Structure

```
skywise/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── chat/page.tsx      # Main chat interface
│   ├── docs/              # Documentation pages
│   ├── import/            # Email import flow
│   ├── onboarding/        # User onboarding flow
│   ├── presentation/      # Case study presentation
│   ├── settings/          # User settings
│   ├── trips/             # Trips management
│   └── api/               # API routes
│       ├── calendar/      # Calendar integration
│       ├── conversations/ # Conversation history
│       ├── email/         # Email import
│       ├── flights/       # Flight search & booking
│       └── trips/         # Trip management
│
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── chat/              # Chat-specific components (13 files)
│   ├── flights/           # Flight display components (6 files)
│   ├── layout/            # App structure components
│   ├── onboarding/        # Onboarding components
│   └── trust/             # Privacy/trust components
│
├── hooks/                 # Custom React hooks
│   ├── use-chat-state.ts # Conversation state
│   ├── use-responsive.ts # Responsive breakpoints
│   ├── use-toast.ts      # Toast notifications
│   └── use-tour.ts       # Onboarding tour state
│
├── lib/
│   ├── ai/               # AI processing layer
│   │   ├── intent-parser.ts
│   │   ├── conversation-context.ts
│   │   ├── response-generator.ts
│   │   └── misunderstanding-scenarios.ts
│   │
│   ├── actions/          # Action management
│   │   └── undo-manager.ts
│   │
│   ├── email/            # Email processing
│   │   ├── parser.ts
│   │   ├── index.ts
│   │   └── mock-emails.ts
│   │
│   ├── demo/             # Demo scenarios
│   │   └── scenario-runner.ts
│   │
│   ├── db/               # Database schema
│   │   ├── schema.ts
│   │   └── index.ts
│   │
│   ├── types/            # Type definitions
│   │   └── index.ts
│   │
│   ├── design-tokens.ts  # Design system tokens
│   ├── tour-config.ts    # Tour configuration
│   └── utils.ts          # Utility functions
│
└── docs/                 # Documentation (9 MD files)
```

## Data Flow

### Flight Booking Flow

```
User Input
    │
    ▼
┌─────────────────┐
│  Intent Parser  │ ──→ Extracts: destination, date, passengers, class
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Context Manager │ ──→ Builds complete BookingInfo
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Missing Info?  │ ──Yes──→ Clarification Prompt
└────────┬────────┘
         │ No
         ▼
┌─────────────────┐
│ Calendar Check  │ ──→ Conflict detection
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Flight Search   │ ──→ Mock API (production: real APIs)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display Options │ ──→ Flight cards with calendar fit
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Selection  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Trip Summary    │ ──→ Confirmation required
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Book & Calendar │ ──→ Add to calendar with undo option
└────────┬────────┘
         │
         ▼
     Complete
```

### Email Import Flow (Chat-based)

```
User: "Import from email"
         │
         ▼
┌─────────────────┐
│ Scan Inbox      │ ──→ Look for flight-related emails
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Email Parser    │ ──→ Extract flight details
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Confidence Calc │ ──→ Score each extracted field
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Review Card     │ ──→ Show extracted data with confidence
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Edits?     │ ──→ Inline edit for low-confidence fields
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Confirm Import  │ ──→ Add to trips/calendar
└─────────────────┘
```

### Import Wizard Flow (v0.0.4 - Standalone Page)

```
/import page
         │
         ▼
┌─────────────────┐
│ Choose Method   │ ──→ Automatic Discovery or Manual Entry
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌───────┐
│ Auto  │  │Manual │
│ Scan  │  │ Paste │
└───┬───┘  └───┬───┘
    │          │
    ▼          ▼
┌───────────────────┐
│ Discovered Flights│ ←──→ Paste email text
└────────┬──────────┘
         │
         ▼
┌─────────────────┐
│ Select Flight   │ ──→ Show confidence badges per field
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Review & Edit   │ ──→ Inline editing for corrections
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Add to Trips    │ ──→ Success + redirect to /trips
└─────────────────┘
```

## API Reference

### Flight API

```typescript
// Search flights
GET /api/flights?origin=JFK&destination=SFO&date=2026-01-21

// Search with full options
POST /api/flights
{
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  class?: 'economy' | 'business' | 'first';
}

// Book a flight
PUT /api/flights
{
  flightId: string;
  passengers: number;
  contactInfo: object;
}
```

### Calendar API

```typescript
// Check calendar availability
POST /api/calendar
{
  date: string;
  startTime: string;
  endTime: string;
}

// Get events
GET /api/calendar?start=2026-01-01&end=2026-01-31
```

### Email API

```typescript
// Scan for confirmations
GET /api/email

// Import a trip
POST /api/email
{
  action: 'import';
  emailId: string;
}

// Dismiss an email
POST /api/email
{
  action: 'dismiss';
  emailId: string;
}
```

### Conversations API

```typescript
// Get conversation history
GET /api/conversations

// Create new conversation
POST /api/conversations
{
  userId: string;
}

// Get messages for conversation
GET /api/conversations/:id/messages
```

## Design System

Design tokens are centralized in `/lib/design-tokens.ts`:

- **Colors**: Primary (sky blue), success (green), warning (amber), error (red)
- **Typography**: Plus Jakarta Sans (body), DM Sans (display)
- **Spacing**: 4px base unit system
- **Border Radius**: sm (6px), md (10px), lg (14px), xl (20px)
- **Shadows**: Consistent card and elevation shadows
- **Transitions**: 150ms default with easeInOut

## Component Patterns

### Conversation Components

- `ChatMessage`: Displays user/assistant messages
- `ClarificationPrompt`: Collects missing information
- `QuickReplyChips`: Suggestion buttons

### Flight Components

- `FlightCard`: Individual flight option
- `TripSummaryCard`: Complete trip details
- `ConflictCard`: Calendar conflict alert
- `ImportedTripCard`: Email-extracted data

### Trust Components

- `PermissionExplainer`: Shows what access is granted
- `DataUsageIndicator`: Real-time data access status
- `ConfirmationCheckbox`: Explicit consent UI

### v0.0.3 Components

- `ConfidenceIndicator`: Shows AI confidence levels with contextual explanations
- `RecoveryPrompt`: Handles AI misunderstandings with correction options
- `InlineUndoPrompt`: Context-aware undo prompts within chat
- `UndoActionPreview`: Enhanced undo with affected items list
- `EmptyState`: Welcome state for new conversations
- `FeatureCard`: Feature highlight cards
- `TourOverlay`: Full-screen onboarding tour overlay
- `TourTooltip`: Positioned tooltips for tour steps
- `TripMiniCard`: Compact trip display card
- `ErrorRecovery`: Error recovery UI with retry options

### v0.0.4 Pages & Components

**New Pages:**
- `/trips`: Full trips dashboard with filter, expand, edit, cancel
- `/import`: Import wizard with automatic discovery and manual paste modes
- `/docs/[slug]`: Dynamic documentation pages

**New Components:**
- `DatePicker`: Calendar-based date selection component

## State Management

Local React state is used throughout:

- `useChatState`: Conversation messages and step
- `useUndo`: Undo manager hook
- `useResponsive`: Breakpoint detection
- `useTour`: Onboarding tour state management

## Security Considerations

1. **No sensitive data in URLs**: Avoid URL parameters for sensitive info
2. **Mock data for demo**: All APIs use mock data in development
3. **Explicit confirmation**: All write operations require user confirmation
4. **Undo capability**: Users can reverse actions within grace period

## Performance Optimizations

1. **Parallel tool calls**: Multiple independent operations run concurrently
2. **Lazy loading**: Components loaded on demand
3. **Animation optimization**: Framer Motion with spring physics
4. **Responsive images**: Optimized for different screen sizes

## Figma HTML Screens

The `/figma` directory contains 43 self-contained HTML files for Figma import:

### Structure
```
figma/
├── mobile/                    # Mobile screens (375 × 812px)
│   ├── 00-17 screens          # 18 screens
│   └── userflows/             # 3 user flow diagrams
├── desktop/                   # Desktop screens (1440 × 900px)
│   ├── 00-17 screens          # 18 screens
│   └── userflows/             # 4 user flow diagrams
└── README.md
```

### Screens (00-17)
| # | Screen |
|---|--------|
| 00 | Landing Page |
| 01-03 | Onboarding (Welcome, Email, Calendar) |
| 04 | Chat Empty |
| 05 | Flight Options |
| 06 | Trip Summary |
| 07 | Conflict Detection |
| 08 | Email Import |
| 09 | Success + Undo |
| 10 | Chat Full |
| 11 | Trips Dashboard |
| 12-15 | Import Wizard (Choose, Scanning, Results, Success) |
| 16 | Settings |
| 17 | Documentation |

### User Flow Diagrams
- **Onboarding Flow**: 4-5 steps (desktop: 4800×1000px, mobile: 2400×920px)
- **Booking Flow**: 4-5 steps (desktop: 5600×1000px, mobile: 2800×920px)
- **Import Flow**: 4 steps (desktop: 4800×1000px, mobile: 2400×920px)
- **Conflict Flow**: 3 steps (desktop only: 3200×1000px)

## Future Considerations

1. **Real API integration**: Replace mock data with actual flight/calendar APIs
2. **Authentication**: Add user auth with OAuth providers
3. **Database migrations**: Run Drizzle migrations for production
4. **Analytics**: Add usage tracking and error reporting
5. **Internationalization**: Support multiple languages
