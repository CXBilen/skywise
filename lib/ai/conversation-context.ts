// Conversation Context Manager for SkyWise
// Maintains conversation context across messages and supports multi-turn conversations

import { generateId } from '@/lib/utils';
import { parseIntent, generateClarificationPrompt } from './intent-parser';
import type {
  ConversationContext,
  ParsedIntent,
  Message,
  BookingInfo,
  UserPreferences,
  PendingAction,
  ConversationStep,
} from '@/lib/types';

// ============================================
// Context Creation
// ============================================

export function createConversationContext(
  sessionId?: string,
  userPreferences?: Partial<UserPreferences>
): ConversationContext {
  return {
    sessionId: sessionId || generateId(),
    collectedInfo: {},
    previousMessages: [],
    userPreferences: {
      calendarConnected: false,
      emailConnected: false,
      ...userPreferences,
    },
    lastActivity: new Date(),
  };
}

// ============================================
// Context Update
// ============================================

export function updateContext(
  input: string,
  currentContext: ConversationContext
): ConversationContext {
  const intent = parseIntent(input);

  // Create new message
  const userMessage: Message = {
    id: generateId(),
    role: 'user',
    content: input,
    timestamp: new Date(),
    metadata: { intent },
  };

  // Update collected info based on extracted entities
  const updatedCollectedInfo: Partial<BookingInfo> = {
    ...currentContext.collectedInfo,
  };

  if (intent.entities.destination) {
    updatedCollectedInfo.destination = intent.entities.destination;
    updatedCollectedInfo.destinationCode = intent.entities.destinationCode;
  }
  if (intent.entities.origin) {
    updatedCollectedInfo.origin = intent.entities.origin;
    updatedCollectedInfo.originCode = intent.entities.originCode;
  }
  if (intent.entities.departureDate) {
    updatedCollectedInfo.departureDate = intent.entities.departureDate;
  }
  if (intent.entities.returnDate) {
    updatedCollectedInfo.returnDate = intent.entities.returnDate;
  }
  if (intent.entities.passengers !== undefined) {
    updatedCollectedInfo.passengers = intent.entities.passengers;
  }
  if (intent.entities.class) {
    updatedCollectedInfo.class = intent.entities.class;
  }
  if (intent.entities.flexibility) {
    updatedCollectedInfo.flexibility = intent.entities.flexibility;
  }

  // Apply user preferences as defaults if not specified
  if (!updatedCollectedInfo.origin && currentContext.userPreferences.homeAirport) {
    updatedCollectedInfo.origin = currentContext.userPreferences.homeAirport;
    updatedCollectedInfo.originCode = currentContext.userPreferences.homeAirportCode;
  }
  if (!updatedCollectedInfo.class && currentContext.userPreferences.preferredClass) {
    updatedCollectedInfo.class = currentContext.userPreferences.preferredClass;
  }

  // Set defaults
  if (!updatedCollectedInfo.passengers) {
    updatedCollectedInfo.passengers = 1;
  }
  if (!updatedCollectedInfo.class) {
    updatedCollectedInfo.class = 'economy';
  }
  if (!updatedCollectedInfo.flexibility) {
    updatedCollectedInfo.flexibility = 'flexible';
  }

  return {
    ...currentContext,
    currentIntent: intent,
    collectedInfo: updatedCollectedInfo,
    previousMessages: [...currentContext.previousMessages, userMessage],
    lastActivity: new Date(),
  };
}

// ============================================
// Clarification Checks
// ============================================

export function shouldAskForClarification(context: ConversationContext): boolean {
  const { currentIntent, collectedInfo } = context;

  if (!currentIntent) return false;

  // For booking intents, check required fields
  if (currentIntent.type === 'book_flight') {
    if (!collectedInfo.destination && !collectedInfo.destinationCode) {
      return true;
    }
    if (!collectedInfo.departureDate) {
      return true;
    }
  }

  return currentIntent.missingRequired.length > 0;
}

export function getMissingFields(context: ConversationContext): string[] {
  const { collectedInfo, currentIntent } = context;
  const missing: string[] = [];

  if (currentIntent?.type !== 'book_flight') {
    return currentIntent?.missingRequired || [];
  }

  if (!collectedInfo.destination && !collectedInfo.destinationCode) {
    missing.push('destination');
  }
  if (!collectedInfo.departureDate) {
    missing.push('date');
  }

  return missing;
}

export function getNextPrompt(context: ConversationContext): string {
  const missing = getMissingFields(context);

  if (missing.length === 0) {
    return '';
  }

  return generateClarificationPrompt(missing, {
    origin: context.collectedInfo.origin,
    destination: context.collectedInfo.destination,
  });
}

// ============================================
// Booking Completion Check
// ============================================

export function isBookingComplete(context: ConversationContext): boolean {
  const { collectedInfo } = context;

  // Required fields for booking
  const hasDestination = !!(collectedInfo.destination || collectedInfo.destinationCode);
  const hasDate = !!collectedInfo.departureDate;

  return hasDestination && hasDate;
}

export function getBookingInfo(context: ConversationContext): BookingInfo | null {
  if (!isBookingComplete(context)) {
    return null;
  }

  const { collectedInfo } = context;

  return {
    origin: collectedInfo.origin || 'New York',
    originCode: collectedInfo.originCode || 'JFK',
    destination: collectedInfo.destination!,
    destinationCode: collectedInfo.destinationCode || collectedInfo.destination!.substring(0, 3).toUpperCase(),
    departureDate: collectedInfo.departureDate!,
    returnDate: collectedInfo.returnDate,
    passengers: collectedInfo.passengers || 1,
    class: collectedInfo.class || 'economy',
    flexibility: collectedInfo.flexibility || 'flexible',
  };
}

// ============================================
// Conversation Step Management
// ============================================

export function determineConversationStep(context: ConversationContext): ConversationStep {
  const { currentIntent, collectedInfo, pendingAction } = context;

  if (!currentIntent) {
    return 'idle';
  }

  // Handle pending actions
  if (pendingAction?.awaitingConfirmation) {
    if (pendingAction.type === 'booking') {
      return 'confirming';
    }
    if (pendingAction.type === 'calendar_add') {
      return 'confirming';
    }
  }

  // Handle by intent type
  switch (currentIntent.type) {
    case 'greeting':
    case 'help':
      return 'idle';

    case 'cancel':
      return 'idle';

    case 'book_flight':
      if (!isBookingComplete(context)) {
        return 'clarifying';
      }
      return 'showing_options';

    case 'import_email':
      return 'importing_email';

    case 'show_trips':
    case 'query_status':
      return 'showing_options';

    case 'modify_flight':
      return 'clarifying';

    case 'check_calendar':
      return 'checking_conflicts';

    default:
      return 'clarifying';
  }
}

// ============================================
// Session Management
// ============================================

export function resetContext(context: ConversationContext): ConversationContext {
  return {
    ...context,
    currentIntent: undefined,
    collectedInfo: {},
    pendingAction: undefined,
    lastActivity: new Date(),
  };
}

export function addAssistantMessage(
  context: ConversationContext,
  content: string,
  metadata?: Message['metadata']
): ConversationContext {
  const message: Message = {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: new Date(),
    metadata,
  };

  return {
    ...context,
    previousMessages: [...context.previousMessages, message],
    lastActivity: new Date(),
  };
}

export function setPendingAction(
  context: ConversationContext,
  action: PendingAction
): ConversationContext {
  return {
    ...context,
    pendingAction: action,
    lastActivity: new Date(),
  };
}

export function clearPendingAction(context: ConversationContext): ConversationContext {
  return {
    ...context,
    pendingAction: undefined,
    lastActivity: new Date(),
  };
}

// ============================================
// Context Resumption
// ============================================

export function resumeFromContext(context: ConversationContext): {
  canResume: boolean;
  message?: string;
  step: ConversationStep;
} {
  const { collectedInfo, currentIntent, lastActivity } = context;

  // Check if context is stale (more than 30 minutes old)
  const isStale = Date.now() - lastActivity.getTime() > 30 * 60 * 1000;

  if (isStale) {
    return {
      canResume: false,
      message: "It's been a while! Would you like to start a new search?",
      step: 'idle',
    };
  }

  // Check if we have partial booking info
  if (currentIntent?.type === 'book_flight' && Object.keys(collectedInfo).length > 0) {
    const parts: string[] = [];

    if (collectedInfo.destination) {
      parts.push(`flight to ${collectedInfo.destination}`);
    }
    if (collectedInfo.departureDate) {
      parts.push(`on ${collectedInfo.departureDate.toLocaleDateString()}`);
    }

    if (parts.length > 0) {
      return {
        canResume: true,
        message: `I see you were looking for a ${parts.join(' ')}. Would you like to continue?`,
        step: determineConversationStep(context),
      };
    }
  }

  return {
    canResume: false,
    step: 'idle',
  };
}

// ============================================
// Conversation Manager Class
// ============================================

export class ConversationManager {
  private context: ConversationContext;

  constructor(userPreferences?: Partial<UserPreferences>) {
    this.context = createConversationContext(undefined, userPreferences);
  }

  getContext(): ConversationContext {
    return this.context;
  }

  setContext(context: ConversationContext): void {
    this.context = context;
  }

  processInput(input: string): {
    context: ConversationContext;
    shouldClarify: boolean;
    missingFields: string[];
    isComplete: boolean;
    step: ConversationStep;
  } {
    this.context = updateContext(input, this.context);

    return {
      context: this.context,
      shouldClarify: shouldAskForClarification(this.context),
      missingFields: getMissingFields(this.context),
      isComplete: isBookingComplete(this.context),
      step: determineConversationStep(this.context),
    };
  }

  getNextPrompt(): string {
    return getNextPrompt(this.context);
  }

  getBookingInfo(): BookingInfo | null {
    return getBookingInfo(this.context);
  }

  addResponse(content: string, metadata?: Message['metadata']): void {
    this.context = addAssistantMessage(this.context, content, metadata);
  }

  setPendingAction(action: PendingAction): void {
    this.context = setPendingAction(this.context, action);
  }

  clearPendingAction(): void {
    this.context = clearPendingAction(this.context);
  }

  reset(): void {
    this.context = resetContext(this.context);
  }

  resume(): ReturnType<typeof resumeFromContext> {
    return resumeFromContext(this.context);
  }
}

// ============================================
// Exports
// ============================================

export {
  type ConversationContext,
  type ConversationStep,
};
