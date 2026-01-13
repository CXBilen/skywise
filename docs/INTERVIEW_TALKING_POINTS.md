# SkyWise - Interview Talking Points

## The One-Liner

> "I treated the chatbot as an interface layer, not as the product itself."

---

## Key Design Decisions to Highlight

### 1. "AI Suggests, User Decides"

**The Pattern:**
- AI never writes to calendar without explicit confirmation
- AI shows confidence levels when uncertain
- User always has final say

**Why This Matters:**
```
Traditional Chatbot: "I've booked your flight and added it to your calendar."
SkyWise Approach: "Here's what I understood. Is this correct? [Confirm / Edit]"
```

**Interview Quote:**
> "Calendar write actions are the highest-risk moment in this flow. One wrong event can cascade into meeting conflicts. That's why I designed a confirmation checkpoint—not as friction, but as trust architecture."

---

### 2. Confidence Transparency

**The Pattern:**
- Show AI confidence levels on extracted data
- Explain WHY AI is uncertain when relevant
- Allow inline editing for low-confidence fields

**Why This Matters:**
AI that pretends to be 100% certain is dangerous. Users need to know when to double-check.

**Interview Quote:**
> "I designed the AI to say 'I'm 72% sure about this departure time' instead of presenting everything as fact. This builds appropriate trust—users verify what needs verifying."

---

### 3. 15-Second Undo Window

**The Pattern:**
- All write actions have 15-second grace period
- Visual countdown with hover-to-pause
- Clear description of what "undo" will do

**Why This Matters:**
Research shows 15 seconds is optimal—long enough to catch mistakes, short enough to not forget.

**Interview Quote:**
> "The undo window isn't just an error recovery mechanism—it's a trust signal. Users are more willing to take action when they know it's reversible."

---

### 4. Recovery UX for AI Mistakes

**The Pattern:**
- AI admits uncertainty proactively
- Offers correction options, not just "try again"
- Doesn't blame user for ambiguous input

**Why This Matters:**
AI WILL make mistakes. The question is how gracefully you handle them.

**Interview Quote:**
> "When someone says 'next Tuesday,' different people mean different things. Instead of guessing, I designed the AI to show its interpretation and ask for confirmation. The ambiguity is acknowledged, not hidden."

---

### 5. Mobile Progressive Disclosure

**The Pattern:**
- Three-level bottom sheet (peek/half/full)
- Critical actions visible at minimum level
- Details available on demand

**Why This Matters:**
Mobile users need to act quickly. Don't bury confirm buttons under scrolling.

**Interview Quote:**
> "On mobile, I used progressive disclosure because screen real estate is precious. Users can confirm a booking with one tap, or expand for full details. This isn't lazy mobile design—it's intentional information hierarchy."

---

## Questions to Prepare For

### "Why a chatbot instead of forms?"

> "Speed and flexibility. 'Book me a flight to SF tomorrow' takes 3 seconds to type. A form with dropdowns and date pickers takes 30+. The chatbot handles natural language variations that forms can't."

### "What if the AI makes a mistake?"

> "That's actually built into the design. The recovery flow shows what AI understood, its confidence level, and offers correction options. I'm not pretending the AI is perfect—I'm designing for graceful failure."

### "How do you handle trust/privacy?"

> "Three mechanisms:
> 1. Read-only email access explicitly stated
> 2. Calendar writes require confirmation
> 3. 15-second undo for all actions
>
> Trust isn't just about what you prevent—it's about giving control."

### "Walk me through your design process."

> "I started with the riskiest moment—calendar writes. From there, I worked backwards: what needs to happen before a user feels safe confirming? That led to confidence indicators, confirmation previews, and the undo system. The chat interface came last—it's the delivery mechanism, not the product."

### "How did you handle edge cases?"

> "I identified ambiguous inputs like 'next Tuesday' or 'New York' and designed specific recovery flows. Instead of guessing, the AI shows its interpretation with a confidence score and asks for confirmation. This turns potential errors into trust-building moments."

---

## Technical Decisions Worth Mentioning

### NLP Pipeline Architecture
- Three-stage processing: Intent Parser → Conversation Context → Response Generator
- Confidence scoring at each extraction point
- Graceful degradation when confidence is low

### State Machine Design
- Explicit conversation states (idle → clarifying → searching → confirming → complete)
- Each state has clear entry/exit conditions
- Error states have recovery paths, not dead ends

### Undo System Implementation
- Singleton UndoManager with grace period management
- Hover-to-pause extends the window (user engagement signal)
- Action types: calendar_add, booking_confirm, email_import

---

## Metrics & Success Criteria

If this were a real product, I'd measure:

1. **Trust Metrics**
   - % of users who review before confirming (vs. blind confirms)
   - Undo usage rate (too high = AI too aggressive, too low = AI too conservative)
   - Time spent on confirmation screens

2. **Efficiency Metrics**
   - Time from intent to booking confirmation
   - Number of clarification rounds needed
   - Recovery flow completion rate

3. **Error Metrics**
   - Calendar conflict rate post-booking
   - AI misinterpretation reports
   - Manual edit frequency on AI suggestions

---

## Closing Statement

> "v0.0.3'te özellikle şuna odaklandım: AI'nın yanlış yapabileceğini kabul eden, ama kullanıcıyı yormayan bir kontrol mekanizması. Bu yüzden chat her zaman karar vermiyor—karar anlarını özellikle UI'ya taşıdım. Calendar write aksiyonlarını en riskli nokta olarak gördüm ve trust architecture'ı bunun etrafında kurdum."

This positions you as someone who:
1. Thinks about AI limitations proactively
2. Designs for trust, not just features
3. Can articulate design rationale clearly
4. Understands the difference between "working" and "well-designed"
