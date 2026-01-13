// Email Module for SkyWise
// Re-exports email parsing and mock data

export { parseFlightEmail, AIRLINE_PATTERNS, AIRPORT_NAMES } from './parser';

export {
  MOCK_EMAILS,
  getUnreadEmails,
  getFlightConfirmationEmails,
  getRecentEmails,
  getEmailById,
  markEmailAsRead,
} from './mock-emails';

export type { MockEmail } from './mock-emails';
