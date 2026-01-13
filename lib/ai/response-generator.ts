// Response Generator for SkyWise
// Generates natural, consistent assistant responses

import type {
  ConversationContext,
  ConversationStep,
  IntentType,
  Flight,
  Trip,
  CalendarConflict,
  ErrorInfo,
} from '@/lib/types';
import { typingDelays } from '@/lib/design-tokens';

// ============================================
// Response Templates
// ============================================

type ResponseType =
  | 'greeting'
  | 'clarification'
  | 'searching'
  | 'options'
  | 'no_flights'
  | 'confirmation'
  | 'booking_success'
  | 'conflict_detected'
  | 'error'
  | 'help'
  | 'cancel'
  | 'import_start'
  | 'import_found'
  | 'import_none'
  | 'goodbye';

interface ResponseOptions {
  context?: ConversationContext;
  flights?: Flight[];
  trip?: Trip;
  conflict?: CalendarConflict;
  error?: ErrorInfo;
  count?: number;
  destination?: string;
  date?: string;
}

interface GeneratedResponse {
  message: string;
  suggestions?: string[];
  delay: number;
}

// ============================================
// Greeting Responses
// ============================================

const GREETINGS = [
  "Hi! I'm your SkyWise travel assistant. Where would you like to fly today?",
  "Hello! Ready to help you find the perfect flight. Where are you headed?",
  "Hey there! Let's find you a great flight. Where would you like to go?",
  "Welcome to SkyWise! I can help you book flights, import confirmations from email, and check your calendar. What can I do for you?",
];

const GREETING_SUGGESTIONS = [
  "Find a flight",
  "Import from email",
  "Show my trips",
  "Help",
];

// ============================================
// Clarification Responses
// ============================================

const DESTINATION_PROMPTS = [
  "Where would you like to fly to?",
  "What's your destination?",
  "Where are you headed?",
];

const DATE_PROMPTS = [
  "When would you like to travel?",
  "What date works for you?",
  "When do you need to fly?",
];

const DATE_SUGGESTIONS = [
  "Tomorrow",
  "Next week",
  "This weekend",
  "Pick a date",
];

// ============================================
// Search Responses
// ============================================

const SEARCHING_MESSAGES = [
  "Searching for flights...",
  "Looking for the best options...",
  "Finding flights for you...",
  "Checking availability...",
];

// ============================================
// Results Responses
// ============================================

function generateFlightResultsMessage(
  count: number,
  destination?: string,
  date?: string
): string {
  const destPart = destination ? ` to ${destination}` : '';
  const datePart = date ? ` on ${date}` : '';

  if (count === 0) {
    return `I couldn't find any flights${destPart}${datePart}. Would you like to try different dates or destinations?`;
  }

  if (count === 1) {
    return `I found 1 flight option${destPart}${datePart}. Here it is:`;
  }

  return `I found ${count} flight options${destPart}${datePart}. I've checked your calendar - here are the best matches:`;
}

const NO_FLIGHTS_SUGGESTIONS = [
  "Try different dates",
  "Search nearby airports",
  "Change destination",
  "Start over",
];

// ============================================
// Confirmation Responses
// ============================================

const CONFIRMATION_MESSAGES = [
  "Great choice! Here's a summary of your trip. Ready to book?",
  "Excellent! I've prepared your booking details. Shall I confirm this reservation?",
  "Perfect! Here's what your trip looks like. Would you like to proceed with booking?",
];

const CONFIRMATION_SUGGESTIONS = [
  "Confirm booking",
  "Change flight",
  "Cancel",
];

// ============================================
// Success Responses
// ============================================

function generateBookingSuccessMessage(confirmationNumber?: string): string {
  const confPart = confirmationNumber ? ` Your confirmation number is ${confirmationNumber}.` : '';
  return `Your flight is booked!${confPart} I've added it to your calendar. Have a great trip!`;
}

const SUCCESS_SUGGESTIONS = [
  "Book another flight",
  "Show my trips",
  "Done",
];

// ============================================
// Conflict Responses
// ============================================

function generateConflictMessage(conflict: CalendarConflict): string {
  const severityText = {
    low: 'minor',
    medium: 'potential',
    high: 'significant',
  };

  return `I noticed a ${severityText[conflict.severity]} calendar conflict. You have "${conflict.eventTitle}" scheduled around this time. How would you like to proceed?`;
}

const CONFLICT_SUGGESTIONS = [
  "Book anyway",
  "Choose different flight",
  "Check calendar",
];

// ============================================
// Error Responses
// ============================================

function generateErrorMessage(error: ErrorInfo): string {
  const errorMessages: Record<string, string> = {
    NO_FLIGHTS_FOUND: "I couldn't find any flights matching your search. This route might not have direct flights, or the dates may not be available.",
    INVALID_ROUTE: "I couldn't find that route. Please check the airport codes or city names and try again.",
    DATE_UNAVAILABLE: "Flights aren't available for the selected date. Would you like to try a different date?",
    DATE_IN_PAST: "The date you selected is in the past. Please choose a future date.",
    SERVICE_ERROR: "I'm having trouble connecting to the flight search service. Please try again in a moment.",
    CALENDAR_ERROR: "I couldn't access your calendar. Please check your permissions and try again.",
    EMAIL_PARSE_ERROR: "I had trouble reading the flight confirmation from that email. The format might not be recognized.",
    BOOKING_FAILED: "The booking couldn't be completed. The flight might no longer be available at this price.",
    CONFLICT_UNRESOLVED: "We need to resolve the calendar conflict before proceeding with the booking.",
    UNKNOWN_ERROR: "Something went wrong. Please try again or start over.",
  };

  return error.message || errorMessages[error.code] || errorMessages.UNKNOWN_ERROR;
}

const ERROR_SUGGESTIONS = [
  "Try again",
  "Start over",
  "Help",
];

// ============================================
// Help Responses
// ============================================

const HELP_MESSAGE = `I can help you with:

• **Book flights** - Just tell me where you want to go and when
• **Import from email** - I'll scan your inbox for flight confirmations
• **Check calendar** - I'll make sure flights don't conflict with your schedule
• **Manage trips** - View and modify your bookings

Try saying something like "I need a flight to San Francisco next Tuesday"`;

const HELP_SUGGESTIONS = [
  "Find a flight",
  "Import from email",
  "Show my trips",
];

// ============================================
// Cancel Responses
// ============================================

const CANCEL_MESSAGES = [
  "No problem! Let me know if you need anything else.",
  "Got it, I've cancelled that. What else can I help with?",
  "Okay, starting fresh. Where would you like to fly?",
];

// ============================================
// Email Import Responses
// ============================================

const IMPORT_START_MESSAGES = [
  "Scanning your email for flight confirmations...",
  "Looking for booking confirmations in your inbox...",
  "Checking your email for travel confirmations...",
];

function generateImportFoundMessage(count: number): string {
  if (count === 1) {
    return "I found 1 flight confirmation in your email. Here's what I extracted:";
  }
  return `I found ${count} flight confirmations in your email. Let me show you what I found:`;
}

const IMPORT_NONE_MESSAGE = "I didn't find any flight confirmations in your recent emails. Make sure you're connected to your email account.";

// ============================================
// Typing Delay Calculator
// ============================================

function calculateDelay(responseType: ResponseType): number {
  const delayConfig = {
    greeting: typingDelays.short,
    clarification: typingDelays.short,
    searching: typingDelays.searching,
    options: typingDelays.long,
    no_flights: typingDelays.medium,
    confirmation: typingDelays.medium,
    booking_success: typingDelays.medium,
    conflict_detected: typingDelays.medium,
    error: typingDelays.error,
    help: typingDelays.medium,
    cancel: typingDelays.short,
    import_start: typingDelays.searching,
    import_found: typingDelays.long,
    import_none: typingDelays.medium,
    goodbye: typingDelays.short,
  };

  const config = delayConfig[responseType] || typingDelays.medium;
  return Math.floor(Math.random() * (config.max - config.min) + config.min);
}

// ============================================
// Random Selection Helper
// ============================================

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================
// Main Response Generator
// ============================================

export function generateResponse(
  responseType: ResponseType,
  options: ResponseOptions = {}
): GeneratedResponse {
  const delay = calculateDelay(responseType);

  switch (responseType) {
    case 'greeting':
      return {
        message: randomChoice(GREETINGS),
        suggestions: GREETING_SUGGESTIONS,
        delay,
      };

    case 'clarification':
      const context = options.context;
      if (context?.currentIntent?.missingRequired.includes('destination')) {
        return {
          message: randomChoice(DESTINATION_PROMPTS),
          suggestions: ['New York', 'Los Angeles', 'San Francisco', 'Miami'],
          delay,
        };
      }
      if (context?.currentIntent?.missingRequired.includes('date')) {
        return {
          message: randomChoice(DATE_PROMPTS),
          suggestions: DATE_SUGGESTIONS,
          delay,
        };
      }
      return {
        message: "I need a bit more information. Where and when would you like to travel?",
        suggestions: ['Help me plan', 'Show examples'],
        delay,
      };

    case 'searching':
      return {
        message: randomChoice(SEARCHING_MESSAGES),
        delay,
      };

    case 'options':
      return {
        message: generateFlightResultsMessage(
          options.count || 0,
          options.destination,
          options.date
        ),
        suggestions: ['Sort by price', 'Sort by time', 'Filter nonstop'],
        delay,
      };

    case 'no_flights':
      return {
        message: generateFlightResultsMessage(0, options.destination, options.date),
        suggestions: NO_FLIGHTS_SUGGESTIONS,
        delay,
      };

    case 'confirmation':
      return {
        message: randomChoice(CONFIRMATION_MESSAGES),
        suggestions: CONFIRMATION_SUGGESTIONS,
        delay,
      };

    case 'booking_success':
      return {
        message: generateBookingSuccessMessage(options.trip?.confirmationNumber),
        suggestions: SUCCESS_SUGGESTIONS,
        delay,
      };

    case 'conflict_detected':
      if (options.conflict) {
        return {
          message: generateConflictMessage(options.conflict),
          suggestions: CONFLICT_SUGGESTIONS,
          delay,
        };
      }
      return {
        message: "I found a potential scheduling conflict. Would you like to review it?",
        suggestions: CONFLICT_SUGGESTIONS,
        delay,
      };

    case 'error':
      if (options.error) {
        return {
          message: generateErrorMessage(options.error),
          suggestions: options.error.retryable ? ['Try again', 'Start over'] : ['Start over', 'Help'],
          delay,
        };
      }
      return {
        message: "Something went wrong. Please try again.",
        suggestions: ERROR_SUGGESTIONS,
        delay,
      };

    case 'help':
      return {
        message: HELP_MESSAGE,
        suggestions: HELP_SUGGESTIONS,
        delay,
      };

    case 'cancel':
      return {
        message: randomChoice(CANCEL_MESSAGES),
        suggestions: GREETING_SUGGESTIONS,
        delay,
      };

    case 'import_start':
      return {
        message: randomChoice(IMPORT_START_MESSAGES),
        delay,
      };

    case 'import_found':
      return {
        message: generateImportFoundMessage(options.count || 1),
        suggestions: ['Add to calendar', 'Dismiss', 'Scan again'],
        delay,
      };

    case 'import_none':
      return {
        message: IMPORT_NONE_MESSAGE,
        suggestions: ['Connect email', 'Try again', 'Book a flight'],
        delay,
      };

    case 'goodbye':
      return {
        message: "Have a great trip! Let me know if you need anything else.",
        delay,
      };

    default:
      return {
        message: "I'm here to help! What can I do for you?",
        suggestions: GREETING_SUGGESTIONS,
        delay,
      };
  }
}

// ============================================
// Intent-Based Response Generator
// ============================================

export function generateResponseForIntent(
  intentType: IntentType,
  step: ConversationStep,
  options: ResponseOptions = {}
): GeneratedResponse {
  // Map intent and step to response type
  const responseTypeMap: Record<string, ResponseType> = {
    'greeting:idle': 'greeting',
    'help:idle': 'help',
    'cancel:idle': 'cancel',
    'book_flight:clarifying': 'clarification',
    'book_flight:searching': 'searching',
    'book_flight:showing_options': 'options',
    'book_flight:confirming': 'confirmation',
    'book_flight:complete': 'booking_success',
    'book_flight:checking_conflicts': 'conflict_detected',
    'import_email:importing_email': 'import_start',
    'import_email:reviewing_import': 'import_found',
    'unknown:idle': 'greeting',
    'unknown:clarifying': 'clarification',
  };

  const key = `${intentType}:${step}`;
  const responseType = responseTypeMap[key] || 'greeting';

  return generateResponse(responseType, options);
}

// ============================================
// Smart Suggestions Based on Context
// ============================================

export function getSmartSuggestions(context: ConversationContext): string[] {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  const { collectedInfo, userPreferences, previousMessages } = context;

  const suggestions: string[] = [];

  // Time-based suggestions
  if (hour >= 5 && hour < 12) {
    suggestions.push('Morning flight');
  } else if (hour >= 12 && hour < 17) {
    suggestions.push('Afternoon flight');
  } else {
    suggestions.push('Evening flight');
  }

  // Day-based suggestions
  if (dayOfWeek === 5) {
    suggestions.push('Weekend trip');
  }
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    suggestions.push('Book for tomorrow');
  }

  // Context-based suggestions
  if (collectedInfo.destination) {
    suggestions.push(`Return from ${collectedInfo.destination}`);
  }

  // Preference-based suggestions
  if (userPreferences.homeAirport && !collectedInfo.origin) {
    suggestions.push(`Fly from ${userPreferences.homeAirport}`);
  }

  // History-based suggestions (if user has searched recently)
  const recentSearch = previousMessages.find(
    (m) => m.role === 'user' && m.metadata?.intent?.type === 'book_flight'
  );
  if (recentSearch?.metadata?.intent?.entities?.destination) {
    const dest = recentSearch.metadata.intent.entities.destination;
    if (dest !== collectedInfo.destination) {
      suggestions.push(`Search ${dest} again`);
    }
  }

  // Default suggestions
  if (suggestions.length < 4) {
    const defaults = ['Find a flight', 'Import from email', 'Show my trips', 'Help'];
    for (const d of defaults) {
      if (!suggestions.includes(d)) {
        suggestions.push(d);
      }
      if (suggestions.length >= 4) break;
    }
  }

  return suggestions.slice(0, 4);
}

// ============================================
// Exports
// ============================================

export type { ResponseType, ResponseOptions, GeneratedResponse };
