# Case Study Requirements Mapping

This document maps the SkyWise case study requirements to their implementations in the codebase.

## Core Features

| Requirement | Implementation | File(s) |
|-------------|----------------|---------|
| Onboarding & Permissions | 5-step flow with skip options | `/app/onboarding/page.tsx` |
| Chat Booking | Conversational UI with NLP | `/app/chat/page.tsx`, `/lib/ai/*` |
| Calendar Integration | Conflict detection + event creation | `/app/api/calendar/route.ts` |
| Email Import | Multi-airline parsing with confidence | `/lib/email/parser.ts` |
| Undo Functionality | 15-second grace period | `/lib/actions/undo-manager.ts` |
| Trust & Control | Explicit confirmations | `/components/trust/*` |

## Detailed Mapping

### 1. Onboarding Flow

**Requirement**: Guide users through setup with optional steps

| Feature | Implementation |
|---------|----------------|
| Welcome screen | Step 1: App introduction |
| Email connection | Step 2: Gmail/Outlook OAuth (optional) |
| Calendar connection | Step 3: Google/Outlook Calendar (optional) |
| Preferences | Step 4: Home airport, class preference |
| Summary | Step 5: Review connected services |
| Skip option | All steps can be skipped |

**Files**:
- `/app/onboarding/page.tsx`
- `/components/onboarding/onboarding-step.tsx`

### 2. Conversational Booking

**Requirement**: Natural language flight booking with multi-turn support

| Feature | Implementation |
|---------|----------------|
| Intent detection | Pattern matching + entity extraction |
| Date parsing | Relative ("next Tuesday") + absolute |
| Location parsing | City names + airport codes |
| Progressive collection | Missing field prompts |
| Class/passenger support | Extracted from conversation |

**Files**:
- `/lib/ai/intent-parser.ts` - Intent detection
- `/lib/ai/conversation-context.ts` - State management
- `/lib/ai/response-generator.ts` - Natural responses
- `/components/chat/clarification-prompt.tsx` - Missing info UI

### 3. Calendar Conflict Detection

**Requirement**: Check calendar before showing flights, highlight conflicts

| Feature | Implementation |
|---------|----------------|
| Calendar check | API call before flight search |
| Conflict detection | Overlap calculation |
| Visual indicator | Badge on FlightCard |
| Resolution options | ConflictCard component |
| Severity levels | Low/Medium/High |

**Files**:
- `/app/api/calendar/route.ts`
- `/components/flights/flight-card.tsx` (calendarFit prop)
- `/components/flights/conflict-card.tsx`

### 4. Email Import

**Requirement**: Extract flight details from confirmation emails

| Feature | Implementation |
|---------|----------------|
| Airline detection | Domain + keyword matching |
| Field extraction | Regex patterns per airline |
| Confidence scoring | Per-field confidence (0-1) |
| Low-confidence flags | Visual highlight + edit |
| Airline support | United, Delta, American, Southwest, JetBlue, Alaska, British Airways |

**Files**:
- `/lib/email/parser.ts` - Parsing logic
- `/lib/email/mock-emails.ts` - Demo data
- `/components/flights/imported-trip-card.tsx` - Display component

### 5. Undo System

**Requirement**: Allow users to undo recent actions

| Feature | Implementation |
|---------|----------------|
| Grace period | 15 seconds default, extensible |
| Pause on hover | Timer pauses when hovering |
| Action types | Calendar, booking, import, delete |
| Batch undo | "Undo All" for multiple actions |
| Visual countdown | Progress bar animation |

**Files**:
- `/lib/actions/undo-manager.ts` - Core logic
- `/components/flights/undo-toast.tsx` - UI component
- `/lib/design-tokens.ts` (undoGracePeriod config)

### 6. Trust & Privacy

**Requirement**: Clear communication about data access

| Feature | Implementation |
|---------|----------------|
| Permission explainer | What we can/cannot do |
| Data usage indicator | Real-time access status |
| Confirmation checkboxes | Explicit consent |
| Privacy messages | Throughout the flow |
| Disconnect option | Revoke access anytime |

**Files**:
- `/components/trust/permission-explainer.tsx`
- Trust messages in onboarding flow

## UX Requirements

### Error Handling

| Requirement | Implementation | File |
|-------------|----------------|------|
| No flights found | Helpful suggestions | `/app/api/flights/route.ts` |
| Invalid route | Clear error message | Error factory in API |
| Service unavailable | Retry option | `/components/chat/error-recovery.tsx` |
| Parse failures | Fallback behavior | Email parser |

### Mobile Responsiveness

| Feature | Implementation | File |
|---------|----------------|------|
| Bottom sheet | Replaces side panel | `/components/layout/bottom-sheet.tsx` |
| Snap points | 25%, 50%, 90% | Bottom sheet component |
| Safe area | Notch handling | `/hooks/use-responsive.ts` |
| Touch targets | Min 44px | Design tokens |
| Keyboard handling | Sheet expands | useKeyboard hook |

### Visual Consistency

| Element | Standard | File |
|---------|----------|------|
| Border radius | md (10px) for cards | `/lib/design-tokens.ts` |
| Icon sizes | 16/20/24px | Design tokens |
| Transitions | 150ms default | Design tokens |
| Card padding | 16px | Design tokens |
| Shadows | card/cardHover | Design tokens |

## Demo Requirements

### Interactive Scenarios

| Scenario | Description | Duration |
|----------|-------------|----------|
| Happy Path | Complete booking flow | ~25s |
| Conflict Resolution | Calendar conflict handling | ~30s |
| Email Import | Extract from confirmation | ~22s |
| Natural Language | Various phrasings | ~35s |
| Undo Demo | Undo functionality | ~18s |

**File**: `/lib/demo/scenario-runner.ts`

## Testing Checklist

### Functional Tests

- [x] Book flight with natural language (various phrasings)
- [x] Handle missing info gracefully (ask for clarification)
- [x] Show calendar conflicts clearly
- [x] Undo calendar addition within grace period
- [x] Import email with confidence indicators
- [x] Edit low-confidence fields inline
- [x] Error states are friendly and recoverable

### Responsive Tests

- [x] Mobile: full flow on 375px width
- [x] Tablet: side panel behavior
- [x] Desktop: full experience

### Trust Tests

- [x] Trust messages appear at all relevant points
- [x] Permissions clearly explained
- [x] Explicit confirmations required

### Demo Tests

- [x] Demo mode plays through all scenarios
- [x] Pause/resume/skip work correctly
- [x] Highlights appear on correct elements

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.0.1 | Initial | Basic chat UI, mock APIs |
| 0.0.2 | Current | NLP, error handling, undo, trust, mobile, demo |
