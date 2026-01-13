# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkyWise is an AI-powered airplane reservation chatbot built with Next.js 15 (App Router). It's a case study implementation demonstrating conversational AI interfaces for travel booking with email import and calendar integration features.

**Design Principles:**
- "AI Suggests, User Decides" - AI recommends but never acts unilaterally
- "No Calendar Writes Without Explicit Confirmation" - Always preview before changes
- "Always Editable, Always Reversible" - Undo available for all actions
- "Show Your Work" - Confidence levels and sources are visible

## Commands

```bash
# Development
bun run dev            # Start dev server with Turbopack

# Build & Production
bun run build          # Build for production
bun run start          # Start production server

# Linting
bun run lint           # Run Next.js ESLint

# Database (Drizzle + Neon PostgreSQL)
bun run db:generate    # Generate migrations from schema
bun run db:push        # Push schema directly to database
bun run db:migrate     # Run migrations
bun run db:studio      # Open Drizzle Studio GUI
```

## Architecture

### AI Layer (`lib/ai/`)

The NLP pipeline processes user messages through three stages:

1. **Intent Parser** (`intent-parser.ts`): Extracts intents and entities from natural language
   - Recognizes 10 intent types: `book_flight`, `modify_flight`, `cancel`, `query_status`, `show_trips`, `import_email`, `check_calendar`, `greeting`, `help`, `unknown`
   - Entity extraction: airports (code/city/aliases), dates (relative/absolute), passengers, flight class
   - Returns `ParsedIntent` with confidence scores and missing required fields

2. **Conversation Context** (`conversation-context.ts`): Maintains session state and collected booking info

3. **Response Generator** (`response-generator.ts`): Generates contextual responses with suggested quick replies

### Conversation State Machine

Defined in `lib/types/index.ts` as `ConversationStep`:
```
idle -> clarifying -> searching -> showing_options -> confirming -> checking_conflicts -> booking -> complete
                                                   -> resolving_conflict
                                        -> importing_email -> reviewing_import
                  -> error
```

State is managed via `useChatState` hook (`hooks/use-chat-state.ts`).

### Undo System (`lib/actions/undo-manager.ts`)

Singleton `UndoManager` class with:
- Grace period management (15s default, extendable to 30s)
- Pause/resume for hover interactions
- Action types: `calendar_add`, `booking_confirm`, `email_import`, `trip_delete`, `preference_change`
- React hook: `useUndo()` for component integration

### Database Schema (`lib/db/schema.ts`)

Drizzle ORM with Neon PostgreSQL:
- `users` - User profiles with preferences (home airport, seat preference)
- `trips` - Booked/draft trips with calendar event IDs
- `flights` - Individual flight segments linked to trips
- `conversations` / `messages` - Chat history with metadata (flight options, trip summaries, conflicts)
- `importedEmails` - Extracted flight data with confidence levels
- `calendarConflicts` - Detected scheduling conflicts
- `undoActions` - Reversible action tracking

### Component Structure

**Chat Components** (`components/chat/`):
- `ChatMessage` - Renders user/assistant messages with embedded content
- `ChatInput` - Input with suggestions
- `QuickReplyChips` - Tappable suggestion chips

**Flight Components** (`components/flights/`):
- `FlightCard` - Displays flight with calendar fit indicator
- `TripSummaryCard` - Booking confirmation view
- `ImportedTripCard` - Email import preview with confidence indicators per field
- `ConflictCard` - Calendar conflict resolution UI
- `UndoToast` - Dismissible undo notification

**Layout** (`components/layout/`):
- Desktop: Two-panel (chat + side panel)
- Mobile: Single-column with `BottomSheet` for details

### Design Tokens (`lib/design-tokens.ts`)

Centralized design system:
- Colors: primary (sky blue), success, warning, error, calendar status, confidence levels
- Typography: Cal Sans display, Geist Sans body, Geist Mono
- Spacing: 4px base unit system
- Motion variants for Framer Motion animations
- `typingDelays`: Short/medium/long delays for natural typing simulation
- `undoGracePeriod`: Default 15s, extended 30s
- `confidenceThresholds`: High (80%+), medium (50-79%), low (<50%)

### Type System (`lib/types/index.ts`)

Key types:
- `BookingInfo` - Complete booking parameters
- `Flight`, `Trip` - Core domain models
- `ParsedIntent`, `IntentEntities` - NLP output
- `ConversationContext`, `ConversationStep` - State management
- `ErrorInfo`, `ErrorCode` - Structured error handling
- `UndoableAction` - Undo system types

## Key Patterns

### Calendar Fit Status
Flights display status: `fits` | `conflict` | `blocked` | `pending`

### Confidence Levels
Email import shows per-field confidence: `high` | `medium` | `low` displayed with color indicators

### Message Metadata
Messages can carry rich metadata: flight options, trip summaries, conflicts, imported trips, actions

### API Routes (`app/api/`)

- `flights/` - Flight search with mock data
- `trips/` - Trip CRUD operations
- `calendar/` - Calendar conflict detection
- `email/` - Email import and parsing

### Demo Mode

The app includes a full demo mode with mock data - no external APIs required. All features work with pre-populated:
- Flight search results
- Simulated calendar conflicts
- Mock email imports

### v0.0.3 New Components

- **Confidence Indicator** (`components/chat/confidence-indicator.tsx`): Shows AI confidence levels with contextual explanations
- **Recovery Prompt** (`components/chat/recovery-prompt.tsx`): Handles AI misunderstandings gracefully with correction options
- **Misunderstanding Scenarios** (`lib/ai/misunderstanding-scenarios.ts`): Pre-defined scenarios for demo/showcase
- **Inline Undo Prompt** (`components/chat/inline-undo-prompt.tsx`): Context-aware undo with explanation
- **Undo Action Preview** (`components/chat/undo-action-preview.tsx`): Enhanced undo with affected items list

### Interview Documentation

See `/docs/INTERVIEW_TALKING_POINTS.md` for:
- Key design decisions with rationale
- Interview questions and prepared answers
- Technical architecture highlights
- Metrics and success criteria
