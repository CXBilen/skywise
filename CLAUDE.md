# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkyWise is an AI-powered airplane reservation chatbot built with Next.js 15 (App Router). It's a case study implementation demonstrating conversational AI interfaces for travel booking with email import and calendar integration features.

**Current Version:** 0.0.4

**Design Principles:**
- "AI Suggests, User Decides" - AI recommends but never acts unilaterally
- "No Calendar Writes Without Explicit Confirmation" - Always preview before changes
- "Always Editable, Always Reversible" - Undo available for all actions
- "Show Your Work" - Confidence levels and sources are visible

## Commands

```bash
# Development
bun run dev            # Start dev server with Turbopack (http://localhost:3000)

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

## Environment Setup

Required environment variable in `.env`:
```
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

Note: The app works in demo mode without a database connection - all features use mock data.

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
- `ClarificationPrompt` - Collects missing information
- `ConfidenceIndicator` - Shows AI confidence levels with contextual explanations
- `EmptyState` - Welcome state for new conversations
- `ErrorRecovery` - Error recovery UI with retry options
- `FeatureCard` - Feature highlight cards
- `InlineUndoPrompt` - Context-aware undo with explanation
- `RecoveryPrompt` - Handles AI misunderstandings with correction options
- `TourOverlay` - Onboarding tour overlay
- `TourTooltip` - Tour step tooltips
- `UndoActionPreview` - Enhanced undo with affected items list

**Flight Components** (`components/flights/`):
- `FlightCard` - Displays flight with calendar fit indicator
- `TripSummaryCard` - Booking confirmation view
- `TripMiniCard` - Compact trip display card for lists
- `ImportedTripCard` - Email import preview with confidence indicators per field
- `ConflictCard` - Calendar conflict resolution UI
- `UndoToast` - Dismissible undo notification with progress bar

**UI Components** (`components/ui/`):
- `DatePicker` - Calendar date picker component
- Standard shadcn/ui components (button, card, input, etc.)

**Layout** (`components/layout/`):
- Desktop: Two-panel (chat + side panel)
- Mobile: Single-column with `BottomSheet` for details

**Trust Components** (`components/trust/`):
- `PermissionExplainer` - Shows what access is granted and data usage

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

### Hooks (`hooks/`)

- `useChatState` - Conversation messages and step management
- `useResponsive` - Breakpoint detection for responsive layouts
- `useToast` - Toast notifications
- `useTour` - Onboarding tour state management

### App Pages (`app/`)

- `page.tsx` - Landing page with hero and feature overview
- `chat/` - Main chat interface for flight booking
- `trips/` - Trips dashboard (upcoming/completed, filter, expand details)
- `import/` - Email import wizard (automatic discovery + manual paste)
- `onboarding/` - 5-step permission and preferences setup
- `presentation/` - Case study slideshow presentation
- `settings/` - User settings and preferences
- `docs/` - Documentation browser with dynamic routes

### API Routes (`app/api/`)

- `flights/` - Flight search with mock data
- `trips/` - Trip CRUD operations
- `calendar/` - Calendar conflict detection
- `conversations/` - Conversation history management
- `email/` - Email import and parsing

### Demo Mode

The app includes a full demo mode with mock data - no external APIs required. All features work with pre-populated:
- Flight search results
- Simulated calendar conflicts
- Mock email imports

### Trust & Recovery Components

- **Confidence Indicator** (`components/chat/confidence-indicator.tsx`): Shows AI confidence levels with contextual explanations
- **Recovery Prompt** (`components/chat/recovery-prompt.tsx`): Handles AI misunderstandings gracefully with correction options
- **Error Recovery** (`components/chat/error-recovery.tsx`): Error recovery UI with retry options
- **Misunderstanding Scenarios** (`lib/ai/misunderstanding-scenarios.ts`): Pre-defined scenarios for demo/showcase
- **Inline Undo Prompt** (`components/chat/inline-undo-prompt.tsx`): Context-aware undo with explanation
- **Undo Action Preview** (`components/chat/undo-action-preview.tsx`): Enhanced undo with affected items list
- **Permission Explainer** (`components/trust/permission-explainer.tsx`): Shows what access is granted and data usage

### Tour System

- **Tour Config** (`lib/tour-config.ts`): Configuration for onboarding tour steps
- **Tour Overlay** (`components/chat/tour-overlay.tsx`): Full-screen tour overlay
- **Tour Tooltip** (`components/chat/tour-tooltip.tsx`): Positioned tooltips for tour steps
- **useTour Hook** (`hooks/use-tour.ts`): Tour state management

### Data Flow

```
User Input → Intent Parser → Context Manager → Missing Info Check
                                                    ↓
                         Calendar Check ← Complete BookingInfo
                                ↓
                         Flight Search → Display Options → User Selection
                                                              ↓
                                          Confirm → Book & Calendar → Complete
```

### Figma HTML Screens (`figma/`)

Self-contained HTML screens optimized for Figma import via html.to.design MCP server:

**Structure:**
- `mobile/` - 18 screens (375 × 812px, iPhone 14 Pro)
- `mobile/userflows/` - 3 user flow diagrams (2400-2800 × 920px)
- `desktop/` - 18 screens (1440 × 900px, standard laptop)
- `desktop/userflows/` - 4 user flow diagrams (3200-5600 × 1000px)
- **Total:** 43 HTML files (36 screens + 7 user flow diagrams)

**Screens (00-17):**
| # | Screen | Description |
|---|--------|-------------|
| 00 | Landing Page | Hero section with value proposition |
| 01 | Onboarding Welcome | Value proposition + features |
| 02 | Onboarding Email | Email permission request |
| 03 | Onboarding Calendar | Calendar permission request |
| 04 | Chat Empty | Empty chat state with suggestions |
| 05 | Flight Options | Search results with calendar fit badges |
| 06 | Trip Summary | Booking confirmation bottom sheet |
| 07 | Conflict Detection | Calendar conflict warning |
| 08 | Email Import | Extraction with confidence indicators |
| 09 | Success + Undo | Booking success with undo toast |
| 10 | Chat Full | Full conversation with flight cards |
| 11 | Trips Dashboard | My trips list with expandable cards |
| 12 | Import Choose | Import method selection (auto/manual) |
| 13 | Import Scanning | Email scan progress animation |
| 14 | Import Results | Discovered flights with confidence |
| 15 | Import Success | Confirmation with actions |
| 16 | Settings | Preferences and connected accounts |
| 17 | Documentation | Help and design principles |

**User Flows:**
- `flow-01-onboarding` - Onboarding flow (4-5 steps)
- `flow-02-booking` - Flight booking flow (4-5 steps)
- `flow-03-import` - Email import flow (4 steps)
- `flow-04-conflict` - Conflict resolution flow (3 steps, desktop only)