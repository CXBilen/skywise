// AI Module for SkyWise
// Re-exports all AI-related functionality

export {
  parseIntent,
  generateClarificationPrompt,
  parseLocation,
  parseDate,
  extractEntities,
  AIRPORT_CODES,
} from './intent-parser';

export {
  ConversationManager,
  createConversationContext,
  updateContext,
  shouldAskForClarification,
  getMissingFields,
  getNextPrompt,
  isBookingComplete,
  getBookingInfo,
  determineConversationStep,
  resetContext,
  addAssistantMessage,
  setPendingAction,
  clearPendingAction,
  resumeFromContext,
} from './conversation-context';

export {
  generateResponse,
  generateResponseForIntent,
  getSmartSuggestions,
} from './response-generator';

export type { ResponseType, ResponseOptions, GeneratedResponse } from './response-generator';
