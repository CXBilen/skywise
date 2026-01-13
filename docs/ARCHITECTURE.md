# SkyWise Architecture

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
│   ├── onboarding/        # User onboarding flow
│   ├── settings/          # User settings
│   └── api/               # API routes
│       ├── flights/       # Flight search & booking
│       ├── calendar/      # Calendar integration
│       ├── email/         # Email import
│       └── trips/         # Trip management
│
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── chat/              # Chat-specific components
│   ├── flights/           # Flight display components
│   ├── layout/            # App structure components
│   ├── onboarding/        # Onboarding components
│   └── trust/             # Privacy/trust components
│
├── hooks/                 # Custom React hooks
│   ├── use-chat-state.ts # Conversation state
│   ├── use-responsive.ts # Responsive breakpoints
│   └── use-toast.ts      # Toast notifications
│
├── lib/
│   ├── ai/               # AI processing layer
│   │   ├── intent-parser.ts
│   │   ├── conversation-context.ts
│   │   └── response-generator.ts
│   │
│   ├── actions/          # Action management
│   │   └── undo-manager.ts
│   │
│   ├── email/            # Email processing
│   │   ├── parser.ts
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
│   └── utils.ts          # Utility functions
│
└── docs/                 # Documentation
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

### Email Import Flow

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

## API Reference

### Flight API

```typescript
// Search flights
GET /api/flights?origin=JFK&destination=SFO&date=2025-01-21

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
GET /api/calendar?start=2025-01-01&end=2025-01-31
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

## State Management

Local React state is used throughout:

- `useChatState`: Conversation messages and step
- `useUndo`: Undo manager hook
- `useResponsive`: Breakpoint detection

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

## Future Considerations

1. **Real API integration**: Replace mock data with actual flight/calendar APIs
2. **Authentication**: Add user auth with OAuth providers
3. **Database migrations**: Run Drizzle migrations for production
4. **Analytics**: Add usage tracking and error reporting
5. **Internationalization**: Support multiple languages
