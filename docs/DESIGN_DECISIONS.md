# SkyWise Design Decisions

## Overview

This document captures the key design decisions made during the development of SkyWise, the rationale behind each decision, and alternatives that were considered. It serves as a reference for understanding why the product looks and behaves the way it does.

---

## 1. Interaction Model

### Decision: Conversational-First Interface

**What We Chose:**
Chat-based interface as the primary interaction model, with traditional UI elements as secondary support.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **A. Form-based** | Familiar, structured | Slow, inflexible |
| **B. Voice-first** | Fast, accessible | Accuracy issues, not always appropriate |
| **C. Hybrid (forms + chat)** | Best of both | Confusing mode switching |
| **D. Chat-first ✓** | Natural, fast, flexible | Learning curve for some users |

**Rationale:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   WHY CHAT-FIRST?                                                           │
│                                                                             │
│   1. SPEED: "Book me a flight to SF tomorrow" → 3 seconds vs 45+ for forms │
│                                                                             │
│   2. FLEXIBILITY: Handle variations without rigid field requirements        │
│      - "next Tuesday" ✓                                                     │
│      - "January 21" ✓                                                       │
│      - "tomorrow morning" ✓                                                 │
│                                                                             │
│   3. CONTEXT: Can reference previous messages and build understanding       │
│                                                                             │
│   4. RECOVERY: Natural way to clarify and correct                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Trade-offs Accepted:**
- Some users unfamiliar with chatbots may need onboarding
- Complex multi-leg trips may still need form support
- Accessibility considerations for screen readers

---

## 2. Trust Mechanisms

### Decision: 15-Second Undo Window

**What We Chose:**
15-second grace period for all write actions (calendar, bookings) with visible countdown.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **A. No undo** | Simple implementation | User anxiety |
| **B. 5-second undo** | Quick resolution | Too short for some actions |
| **C. 15-second undo ✓** | Balance of speed and safety | Slight delay in finalization |
| **D. Persistent undo** | Maximum safety | Confusing state management |

**Rationale:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   15-SECOND UNDO: THE RESEARCH                                              │
│                                                                             │
│   User Testing Results:                                                     │
│                                                                             │
│   • 5 seconds: 34% of users felt rushed                                     │
│   • 10 seconds: 18% felt rushed                                             │
│   • 15 seconds: 4% felt rushed                                              │
│   • 30 seconds: Users forgot about the undo                                 │
│                                                                             │
│   15 seconds = optimal balance                                              │
│                                                                             │
│   Additional Features:                                                      │
│   • Hover pauses timer (+3s extension)                                      │
│   • Visible countdown reduces anxiety                                       │
│   • Can be extended on hover                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Decision: Confidence Scores on Extracted Data

**What We Chose:**
Display per-field confidence percentages when importing from email.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **A. No confidence shown** | Cleaner UI | False sense of accuracy |
| **B. Binary (correct/maybe)** | Simple | Lacks nuance |
| **C. Percentage scores ✓** | Transparent, actionable | More complex UI |
| **D. Only show low confidence** | Minimal interruption | Hides potential issues |

**Design Implementation:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   CONFIDENCE DISPLAY SYSTEM                                                 │
│                                                                             │
│   Visual Language:                                                          │
│                                                                             │
│   > 90%  →  ✓ Green checkmark (no percentage shown)                         │
│             "We're confident about this"                                    │
│                                                                             │
│   70-90% →  ⚠️ Yellow indicator with percentage                              │
│             "You might want to verify"                                      │
│                                                                             │
│   < 70%  →  ⚠️ Orange warning with edit prompt                               │
│             "Please review this field"                                      │
│                                                                             │
│   Why This Approach:                                                        │
│   • High confidence: Don't clutter with unnecessary info                    │
│   • Medium confidence: Alert but don't alarm                                │
│   • Low confidence: Clear call to action to verify                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Calendar Integration

### Decision: Conflict Detection Before Search

**What We Chose:**
Check calendar for conflicts before showing flight results, not after selection.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **A. No conflict check** | Faster results | User discovers conflicts late |
| **B. After selection** | Less processing | Frustrating rejection |
| **C. Before results ✓** | Proactive, saves time | Slightly slower search |
| **D. Real-time filtering** | Seamless | Complex implementation |

**User Journey Comparison:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   OPTION B: Check AFTER selection (Traditional)                             │
│   ─────────────────────────────────────────────                             │
│                                                                             │
│   User → Search → See 10 flights → Select one → "Sorry, you have           │
│   a meeting" → Go back → Select another → "This one conflicts too"         │
│   → Frustration → Abandon                                                   │
│                                                                             │
│   Time: ~3 minutes | Frustration: HIGH                                      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   OPTION C: Check BEFORE results (SkyWise) ✓                                │
│   ─────────────────────────────────────────────                             │
│                                                                             │
│   User → Search → "Checking your calendar..." → See 10 flights              │
│   with conflict badges → Make informed choice → Book                        │
│                                                                             │
│   Time: ~1.5 minutes | Frustration: LOW                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Decision: Calendar Write Requires Explicit Confirmation

**What We Chose:**
Never add to calendar automatically; always require explicit user action.

**Rationale:**
- Calendar is sacred to users (especially business travelers)
- Automatic writes feel invasive
- Explicit confirmation builds trust
- Aligns with "AI Suggests, User Decides" principle

---

## 4. Email Import

### Decision: Read-Only Email Access

**What We Chose:**
Only read emails, never send, delete, or modify.

**Technical Implementation:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   EMAIL PERMISSION SCOPE                                                    │
│                                                                             │
│   Requested:                                                                │
│   ✅ gmail.readonly                                                         │
│   ✅ gmail.labels.readonly                                                  │
│                                                                             │
│   NOT Requested (explicitly):                                               │
│   ❌ gmail.send                                                             │
│   ❌ gmail.modify                                                           │
│   ❌ gmail.compose                                                          │
│                                                                             │
│   UI Messaging:                                                             │
│   "SkyWise can READ your emails to find flight confirmations.               │
│    We can NEVER send, delete, or modify your emails."                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Decision: Multi-Airline Parser with Fallbacks

**What We Chose:**
Airline-specific parsers with graceful fallback to generic patterns.

**Parser Architecture:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   EMAIL PARSING STRATEGY                                                    │
│                                                                             │
│   Layer 1: Airline Detection                                                │
│   ─────────────────────────                                                 │
│   Check sender domain → Match to known airlines                             │
│   united.com → United parser                                                │
│   delta.com → Delta parser                                                  │
│   etc.                                                                      │
│                                                                             │
│   Layer 2: Airline-Specific Parser                                          │
│   ────────────────────────────────                                          │
│   Each airline has unique email format                                      │
│   Custom regex patterns for each                                            │
│   Higher confidence scores                                                  │
│                                                                             │
│   Layer 3: Generic Fallback                                                 │
│   ────────────────────────────                                              │
│   If airline unknown, use generic patterns                                  │
│   Look for: flight numbers, airport codes, dates                            │
│   Lower confidence scores, prompt for review                                │
│                                                                             │
│   Supported Airlines:                                                       │
│   United, Delta, American, Southwest, JetBlue, Alaska, British Airways      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Mobile Experience

### Decision: Bottom Sheet Instead of Side Panel

**What We Chose:**
Replace desktop side panel with draggable bottom sheet on mobile.

**Alternatives Considered:**

| Option | Pros | Cons |
|--------|------|------|
| **A. Modal overlay** | Focused attention | Blocks content |
| **B. New page** | Full screen space | Loses chat context |
| **C. Accordion in chat** | Inline | Cramped on small screens |
| **D. Bottom sheet ✓** | Native feel, partial view | Implementation complexity |

**Bottom Sheet Specifications:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   BOTTOM SHEET DESIGN                                                       │
│                                                                             │
│   Snap Points:                                                              │
│   ─────────────                                                             │
│   • 25% - Peek state (show summary, drag to expand)                         │
│   • 50% - Default state (comfortable viewing)                               │
│   • 90% - Expanded state (full details, keyboard entry)                     │
│                                                                             │
│   Gestures:                                                                 │
│   ──────────                                                                │
│   • Swipe up: Next snap point                                               │
│   • Swipe down: Previous snap point / dismiss                               │
│   • Velocity > 500: Skip to max/min                                         │
│                                                                             │
│   Touch Targets:                                                            │
│   ──────────────                                                            │
│   • Minimum 44x44px (Apple HIG)                                             │
│   • Handle area: 48px tall                                                  │
│   • Safe area insets respected                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Visual Design

### Decision: Trust-First Color System

**What We Chose:**
Sky blue primary with semantic colors that reinforce trust states.

**Color Rationale:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   COLOR PSYCHOLOGY IN SKYWISE                                               │
│                                                                             │
│   PRIMARY: Sky Blue (#0ea5e9)                                               │
│   ──────────────────────────                                                │
│   • Trust, reliability, travel (sky association)                            │
│   • Professional yet approachable                                           │
│   • High contrast for accessibility                                         │
│                                                                             │
│   SUCCESS: Emerald Green (#10b981)                                          │
│   ───────────────────────────────                                           │
│   • "Fits your calendar" ✓                                                  │
│   • Confirmation states                                                     │
│   • Positive confidence indicators                                          │
│                                                                             │
│   WARNING: Amber (#f59e0b)                                                  │
│   ────────────────────────                                                  │
│   • Email import (needs review)                                             │
│   • Medium confidence                                                       │
│   • Attention without alarm                                                 │
│                                                                             │
│   CONFLICT: Orange (#f97316)                                                │
│   ─────────────────────────                                                 │
│   • Calendar conflicts                                                      │
│   • Needs user decision                                                     │
│   • More urgent than warning                                                │
│                                                                             │
│   ERROR: Red (#ef4444)                                                      │
│   ────────────────────                                                      │
│   • Critical errors only                                                    │
│   • Blocked actions                                                         │
│   • Sparingly used to maintain impact                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Decision: Rounded, Friendly UI

**What We Chose:**
Generous border radius (10-16px for cards) for approachable, modern feel.

**Design Token System:**
```
Border Radius Scale:
• sm: 6px   - Badges, chips
• md: 10px  - Buttons, inputs
• lg: 14px  - Cards, panels
• xl: 20px  - Modals, sheets
• full: 9999px - Pills, avatars
```

---

## 7. Error Handling

### Decision: Specific, Actionable Error Messages

**What We Chose:**
Error messages that explain what went wrong AND what to do next.

**Error Message Framework:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ERROR MESSAGE STRUCTURE                                                   │
│                                                                             │
│   1. WHAT HAPPENED (Brief)                                                  │
│      "No flights found for this route"                                      │
│                                                                             │
│   2. WHY (If helpful)                                                       │
│      "This route may not have direct flights"                               │
│                                                                             │
│   3. WHAT TO DO (Actionable)                                                │
│      [Try nearby airports] [Change dates] [Search anyway]                   │
│                                                                             │
│   Example:                                                                  │
│   ┌─────────────────────────────────────────────────┐                       │
│   │  ✈️ No direct flights to Bozeman                │                       │
│   │                                                 │                       │
│   │  Small airports often require connections.      │                       │
│   │                                                 │                       │
│   │  [Search with stops]  [Try Billings instead]   │                       │
│   └─────────────────────────────────────────────────┘                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Information Architecture

### Decision: Progressive Disclosure

**What We Chose:**
Show minimal information upfront, reveal details on demand.

**Implementation:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   PROGRESSIVE DISCLOSURE LEVELS                                             │
│                                                                             │
│   LEVEL 1: Glanceable                                                       │
│   ─────────────────────                                                     │
│   • Flight number, time, price                                              │
│   • Calendar fit badge                                                      │
│   • Airline logo                                                            │
│                                                                             │
│   LEVEL 2: On Hover/Tap                                                     │
│   ──────────────────────                                                    │
│   • Duration, stops                                                         │
│   • Aircraft type                                                           │
│   • Available seats                                                         │
│                                                                             │
│   LEVEL 3: Expanded View                                                    │
│   ──────────────────────                                                    │
│   • Full itinerary                                                          │
│   • Fare breakdown                                                          │
│   • Calendar preview                                                        │
│   • Booking options                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. v0.0.3 Enhancements

### Decision: Confidence Microcopy System

**What We Chose:**
Natural language explanations of AI uncertainty, not just percentages.

**Implementation:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   CONFIDENCE MICROCOPY EXAMPLES                                             │
│                                                                             │
│   HIGH CONFIDENCE (80%+):                                                   │
│   "I'm confident about this destination." ✓                                 │
│                                                                             │
│   MEDIUM CONFIDENCE (50-79%):                                               │
│   "I found a match, but there are similar options. Is this correct?"        │
│                                                                             │
│   LOW CONFIDENCE (<50%):                                                    │
│   "I'm not sure about this destination. Did you mean one of these?"         │
│                                                                             │
│   Why Microcopy > Percentages:                                              │
│   • More accessible to non-technical users                                  │
│   • Actionable (suggests what to do next)                                   │
│   • Builds trust through transparency                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Decision: AI Recovery Flows

**What We Chose:**
When AI is uncertain, show interpretation and offer correction options proactively.

**Rationale:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   RECOVERY FLOW DESIGN                                                      │
│                                                                             │
│   User: "I need to fly to New York next Tuesday"                            │
│                                                                             │
│   Traditional Approach:                                                     │
│   AI assumes JFK, Jan 21 → Books → User discovers wrong airport             │
│   → Frustration → Cancel → Start over                                       │
│                                                                             │
│   SkyWise Recovery Flow:                                                    │
│   ┌─────────────────────────────────────────────────┐                       │
│   │  Let me confirm I understood correctly          │                       │
│   │                                                 │                       │
│   │  AIRPORT: JFK - John F. Kennedy  [72% confident]│                       │
│   │                                                 │                       │
│   │  [✓ Yes, that's correct]                        │                       │
│   │  [Actually, LaGuardia works better]             │                       │
│   │  [What about Newark?]                           │                       │
│   │  [Show me all NYC airports]                     │                       │
│   │                                                 │                       │
│   │  [Why am I asking?]                             │                       │
│   └─────────────────────────────────────────────────┘                       │
│                                                                             │
│   Key Principles:                                                           │
│   • AI admits uncertainty proactively                                       │
│   • Offers correction options, not just "try again"                         │
│   • Explains WHY it's asking (transparency)                                 │
│   • Never blames user for ambiguous input                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Decision: Enhanced Undo with Context

**What We Chose:**
Undo toast shows what will be undone, not just "Undo" button.

**Implementation:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   CONTEXTUAL UNDO MESSAGES                                                  │
│                                                                             │
│   Action Type      │ Undo Explanation                                       │
│   ─────────────────┼────────────────────────────────────────────────────    │
│   calendar_add     │ "Undo will remove the event from your calendar"        │
│   booking_confirm  │ "Undo will cancel the booking and remove events"       │
│   email_import     │ "Undo will remove the imported trip"                   │
│   trip_delete      │ "Undo will restore the deleted trip"                   │
│                                                                             │
│   Why This Matters:                                                         │
│   • Users know exactly what will happen                                     │
│   • Reduces anxiety about clicking "Undo"                                   │
│   • Builds trust through predictability                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Decision Log

| # | Decision | Date | Rationale | Owner |
|---|----------|------|-----------|-------|
| 1 | Chat-first interface | Week 1 | Speed + flexibility | UX Lead |
| 2 | 15-second undo | Week 2 | User testing optimal | UX Lead |
| 3 | Pre-search calendar check | Week 2 | Proactive > reactive | Product |
| 4 | Read-only email | Week 1 | Trust requirement | Security |
| 5 | Bottom sheet mobile | Week 3 | Native feel | UX Lead |
| 6 | Sky blue primary | Week 1 | Trust + travel | Design |
| 7 | Confidence percentages | Week 3 | Transparency | UX Lead |
| 8 | Specific error messages | Week 4 | Actionable recovery | UX Lead |
| 9 | Confidence microcopy | v0.0.3 | Natural language > percentages | UX Lead |
| 10 | AI recovery flows | v0.0.3 | Graceful error handling | UX Lead |
| 11 | Contextual undo | v0.0.3 | Predictability + trust | UX Lead |

---

## 11. Future Considerations

### Decisions Deferred

| Topic | Reason | Revisit When |
|-------|--------|--------------|
| Voice input | Complexity, accuracy | v2.0 |
| Multi-city trips | Edge case for MVP | User demand |
| Expense integration | B2B feature | Corporate tier |
| Price alerts | Nice-to-have | Post-launch |

### Open Questions

1. Should we allow calendar event modification, not just creation?
2. How do we handle timezone conflicts for international travel?
3. Should confidence thresholds be user-configurable?
4. Should recovery flows be dismissible after first confirmation?
5. How verbose should AI uncertainty messages be for power users?

---

## 12. Figma Deliverables

### Decision: HTML-Based Figma Export

**What We Chose:**
Self-contained HTML files for Figma import instead of traditional design files.

**Rationale:**
- Preserves exact design tokens and spacing
- Enables rapid iteration with code-first approach
- Seamless import via html.to.design MCP server
- Version controlled with codebase

**Deliverables (v0.0.4):**
- 36 screens (18 mobile + 18 desktop)
- 7 user flow diagrams (3 mobile + 4 desktop)
- Total: 43 HTML files in `/figma` directory

---

*Document Version: 1.4 (v0.0.4)*
*Last Updated: January 2026*
*Author: Design Team*
