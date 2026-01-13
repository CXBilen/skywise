// Centralized type definitions for SkyWise
// Re-export from schema and add utility types

// ============================================
// Core Booking Types
// ============================================

export interface BookingInfo {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
  class: FlightClass;
  flexibility: 'exact' | 'flexible';
}

export type FlightClass = 'economy' | 'business' | 'first';

export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  duration: string;
  durationMinutes: number;
  stops: number;
  stopLocations?: string[];
  price: number;
  class: FlightClass;
  calendarFit: CalendarFitStatus;
  availableSeats: number;
  aircraft?: string;
}

export type CalendarFitStatus = 'fits' | 'conflict' | 'blocked' | 'pending';

export interface Trip {
  id: string;
  userId?: string;
  outboundFlight: Flight;
  returnFlight?: Flight;
  passengers: number;
  totalPrice: number;
  status: TripStatus;
  confirmationNumber?: string;
  createdAt: Date;
  bookedAt?: Date;
}

export type TripStatus = 'draft' | 'pending' | 'confirmed' | 'cancelled';

// ============================================
// Calendar Types
// ============================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: 'flight' | 'meeting' | 'personal' | 'other';
  source?: 'google' | 'outlook' | 'manual';
}

export interface CalendarConflict {
  id: string;
  flightId: string;
  eventId: string;
  eventTitle: string;
  conflictType: 'overlap' | 'back_to_back' | 'same_day';
  severity: 'low' | 'medium' | 'high';
  resolution?: ConflictResolution;
}

export type ConflictResolution = 'keep_both' | 'reschedule_event' | 'choose_different_flight' | 'ignored';

// ============================================
// Email Import Types
// ============================================

export interface ImportedEmail {
  id: string;
  from: string;
  subject: string;
  receivedAt: Date;
  body: string;
  parsed?: EmailParseResult;
}

export interface EmailParseResult {
  success: boolean;
  confidence: FieldConfidence;
  extracted: ExtractedFlightData;
  rawSnippet: string;
  needsReview: string[];
}

export interface FieldConfidence {
  overall: number;
  perField: {
    airline: number;
    flightNumber: number;
    date: number;
    time: number;
    airports: number;
    confirmation: number;
  };
}

export interface ExtractedFlightData {
  airline?: string;
  flightNumber?: string;
  departureDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  departureAirport?: string;
  departureAirportCode?: string;
  arrivalAirport?: string;
  arrivalAirportCode?: string;
  confirmationNumber?: string;
  passengerName?: string;
}

// ============================================
// AI Intent Types
// ============================================

export type IntentType =
  | 'book_flight'
  | 'modify_flight'
  | 'cancel'
  | 'query_status'
  | 'show_trips'
  | 'import_email'
  | 'check_calendar'
  | 'greeting'
  | 'help'
  | 'unknown';

export interface ParsedIntent {
  type: IntentType;
  confidence: number;
  entities: IntentEntities;
  missingRequired: string[];
  rawInput: string;
  suggestedResponse?: string;
}

export interface IntentEntities {
  origin?: string;
  originCode?: string;
  destination?: string;
  destinationCode?: string;
  departureDate?: Date;
  returnDate?: Date;
  passengers?: number;
  class?: FlightClass;
  flexibility?: 'exact' | 'flexible';
  tripId?: string;
  action?: string;
}

// ============================================
// Conversation Types
// ============================================

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  intent?: ParsedIntent;
  flights?: Flight[];
  trip?: Trip;
  conflict?: CalendarConflict;
  importedEmail?: ImportedEmail;
  suggestions?: string[];
  isTyping?: boolean;
  error?: ErrorInfo;
}

export interface ConversationContext {
  sessionId: string;
  currentIntent?: ParsedIntent;
  collectedInfo: Partial<BookingInfo>;
  previousMessages: Message[];
  userPreferences: UserPreferences;
  pendingAction?: PendingAction;
  lastActivity: Date;
}

export interface UserPreferences {
  preferredAirlines?: string[];
  preferredClass?: FlightClass;
  homeAirport?: string;
  homeAirportCode?: string;
  calendarConnected?: boolean;
  emailConnected?: boolean;
}

export interface PendingAction {
  type: 'booking' | 'modification' | 'cancellation' | 'calendar_add' | 'email_import';
  data: unknown;
  awaitingConfirmation: boolean;
  expiresAt?: Date;
}

// ============================================
// Conversation State Machine
// ============================================

export type ConversationStep =
  | 'idle'
  | 'clarifying'
  | 'searching'
  | 'showing_options'
  | 'confirming'
  | 'checking_conflicts'
  | 'resolving_conflict'
  | 'booking'
  | 'complete'
  | 'error'
  | 'importing_email'
  | 'reviewing_import';

// ============================================
// Error Types
// ============================================

export type ErrorCode =
  | 'NO_FLIGHTS_FOUND'
  | 'INVALID_ROUTE'
  | 'DATE_UNAVAILABLE'
  | 'DATE_IN_PAST'
  | 'SERVICE_ERROR'
  | 'CALENDAR_ERROR'
  | 'EMAIL_PARSE_ERROR'
  | 'BOOKING_FAILED'
  | 'CONFLICT_UNRESOLVED'
  | 'UNKNOWN_ERROR';

export interface ErrorInfo {
  code: ErrorCode;
  message: string;
  suggestions: string[];
  retryable: boolean;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorInfo;
}

// ============================================
// Undo Types
// ============================================

export type UndoActionType =
  | 'calendar_add'
  | 'booking_confirm'
  | 'email_import'
  | 'trip_delete'
  | 'preference_change';

export interface UndoableAction {
  id: string;
  type: UndoActionType;
  timestamp: Date;
  expiresAt: Date;
  data: {
    before: unknown;
    after: unknown;
  };
  description: string;
  canUndo: boolean;
}

// ============================================
// UI Component Props Types
// ============================================

export interface ClarificationPromptProps {
  missingFields: Array<'destination' | 'date' | 'origin' | 'passengers'>;
  partialData: Partial<BookingInfo>;
  onFieldProvided: (field: string, value: unknown) => void;
  suggestions?: Record<string, string[]>;
}

export interface ErrorRecoveryProps {
  errorType: ErrorCode;
  context: string;
  onRetry: () => void;
  onModify: () => void;
  onStartOver: () => void;
}

export interface FlightCardProps {
  flight: Flight;
  isSelected?: boolean;
  onSelect?: (flight: Flight) => void;
  showCalendarFit?: boolean;
  compact?: boolean;
}

export interface TripSummaryProps {
  trip: Trip;
  onConfirm?: () => void;
  onModify?: () => void;
  onCancel?: () => void;
  showPrivacyNotice?: boolean;
}

// ============================================
// Demo Types
// ============================================

export type DemoStepType =
  | 'user_message'
  | 'assistant_response'
  | 'ui_action'
  | 'highlight'
  | 'pause'
  | 'system_event';

export interface DemoStep {
  type: DemoStepType;
  content: string;
  delay: number;
  highlight?: string;
  action?: () => void;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  steps: DemoStep[];
  estimatedDuration: number;
}

// ============================================
// Utility Types
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: ErrorInfo | null;
};
