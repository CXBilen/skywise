// Intent Parser for SkyWise
// Handles diverse user inputs and extracts travel-related entities

import type { ParsedIntent, IntentType, IntentEntities, FlightClass } from '@/lib/types';

// ============================================
// Airport Data
// ============================================

const AIRPORT_CODES: Record<string, { code: string; city: string; aliases: string[] }> = {
  // US Major Airports
  jfk: { code: 'JFK', city: 'New York', aliases: ['new york', 'nyc', 'manhattan', 'kennedy', 'john f kennedy'] },
  lga: { code: 'LGA', city: 'New York', aliases: ['laguardia', 'la guardia'] },
  ewr: { code: 'EWR', city: 'Newark', aliases: ['newark', 'new jersey', 'nj'] },
  lax: { code: 'LAX', city: 'Los Angeles', aliases: ['los angeles', 'la', 'l.a.', 'hollywood'] },
  sfo: { code: 'SFO', city: 'San Francisco', aliases: ['san francisco', 'sf', 'san fran', 'bay area', 'frisco'] },
  ord: { code: 'ORD', city: 'Chicago', aliases: ['chicago', "o'hare", 'ohare'] },
  dfw: { code: 'DFW', city: 'Dallas', aliases: ['dallas', 'fort worth', 'dallas-fort worth', 'dallas fort worth'] },
  den: { code: 'DEN', city: 'Denver', aliases: ['denver', 'colorado'] },
  sea: { code: 'SEA', city: 'Seattle', aliases: ['seattle', 'tacoma', 'seatac'] },
  mia: { code: 'MIA', city: 'Miami', aliases: ['miami', 'south florida'] },
  bos: { code: 'BOS', city: 'Boston', aliases: ['boston', 'logan'] },
  atl: { code: 'ATL', city: 'Atlanta', aliases: ['atlanta', 'hartsfield'] },
  phx: { code: 'PHX', city: 'Phoenix', aliases: ['phoenix', 'arizona'] },
  iah: { code: 'IAH', city: 'Houston', aliases: ['houston', 'george bush', 'intercontinental'] },
  las: { code: 'LAS', city: 'Las Vegas', aliases: ['las vegas', 'vegas'] },
  mco: { code: 'MCO', city: 'Orlando', aliases: ['orlando', 'disney', 'florida'] },

  // International
  lhr: { code: 'LHR', city: 'London', aliases: ['london', 'heathrow', 'england', 'uk'] },
  cdg: { code: 'CDG', city: 'Paris', aliases: ['paris', 'charles de gaulle', 'france'] },
  nrt: { code: 'NRT', city: 'Tokyo', aliases: ['tokyo', 'narita', 'japan'] },
  hnd: { code: 'HND', city: 'Tokyo', aliases: ['haneda'] },
  ist: { code: 'IST', city: 'Istanbul', aliases: ['istanbul', 'turkey', 'turkiye'] },
  saw: { code: 'SAW', city: 'Istanbul', aliases: ['sabiha', 'sabiha gokcen'] },
  dxb: { code: 'DXB', city: 'Dubai', aliases: ['dubai', 'uae', 'emirates'] },
  sin: { code: 'SIN', city: 'Singapore', aliases: ['singapore', 'changi'] },
  hkg: { code: 'HKG', city: 'Hong Kong', aliases: ['hong kong'] },
  ams: { code: 'AMS', city: 'Amsterdam', aliases: ['amsterdam', 'netherlands', 'schiphol'] },
  fra: { code: 'FRA', city: 'Frankfurt', aliases: ['frankfurt', 'germany'] },
  muc: { code: 'MUC', city: 'Munich', aliases: ['munich', 'munchen'] },
  mad: { code: 'MAD', city: 'Madrid', aliases: ['madrid', 'spain'] },
  bcn: { code: 'BCN', city: 'Barcelona', aliases: ['barcelona'] },
  fco: { code: 'FCO', city: 'Rome', aliases: ['rome', 'fiumicino', 'italy'] },
  syd: { code: 'SYD', city: 'Sydney', aliases: ['sydney', 'australia'] },
  yyz: { code: 'YYZ', city: 'Toronto', aliases: ['toronto', 'pearson', 'canada'] },
  mex: { code: 'MEX', city: 'Mexico City', aliases: ['mexico city', 'mexico', 'cdmx'] },
  gru: { code: 'GRU', city: 'Sao Paulo', aliases: ['sao paulo', 'brazil', 'guarulhos'] },
  icn: { code: 'ICN', city: 'Seoul', aliases: ['seoul', 'incheon', 'korea'] },
};

// ============================================
// Intent Patterns
// ============================================

const BOOKING_PATTERNS = [
  /(?:i (?:want|need|would like) to |book |fly |get |find )?(?:a )?(?:flight|flights|ticket|tickets)/i,
  /(?:fly|flying|travel|traveling|trip|going) (?:to|from)/i,
  /(?:book|reserve|get) (?:me )?(?:a )?(?:flight|ticket)/i,
  /(?:search|look|find|check) (?:for )?(?:flights?|tickets?)/i,
  /(?:i'm |im |i am )?(?:heading|going|flying|traveling) to/i,
  /(?:take me|get me) to/i,
  /(?:round[ -]?trip|one[ -]?way) (?:to|from)/i,
];

const MODIFY_PATTERNS = [
  /(?:change|modify|update|edit|reschedule) (?:my )?(?:flight|booking|reservation|trip)/i,
  /(?:i need to |can i |want to )?(?:change|modify|reschedule)/i,
  /(?:different|another|other) (?:flight|date|time)/i,
];

const CANCEL_PATTERNS = [
  /(?:cancel|nevermind|never mind|forget|stop|abort)/i,
  /(?:don't|dont|do not) (?:book|want|need)/i,
  /(?:start over|start again|begin again)/i,
];

const QUERY_PATTERNS = [
  /\b(?:what|where|how|when)(?:'s| is| are)? (?:my |the )?(?:status|trip|flight|booking)\b/i,
  /\b(?:show|tell|give) (?:me )?(?:my |the )?(?:status|details|info)\b/i,
  /\b(?:track|check) (?:my )?(?:flight|trip|booking)\b/i,
];

const SHOW_TRIPS_PATTERNS = [
  /^show my trips?$/i,
  /^show trips?$/i,
  /^my trips?$/i,
  /show\s+(?:my\s+)?trips?/i,
  /(?:show|list|see|view|display)\s+(?:my\s+|all\s+)?(?:upcoming\s+|past\s+)?(?:trips?|bookings?|flights?|reservations?)/i,
  /(?:my|upcoming|past)\s+(?:trips?|bookings?|reservations?)/i,
  /(?:what|which)\s+(?:trips?|flights?)\s+do\s+i\s+have/i,
];

const IMPORT_EMAIL_PATTERNS = [
  /(?:import|scan|check|read|find) (?:my )?(?:email|emails|mail|inbox|confirmations?)/i,
  /(?:get|pull|extract) (?:flights? )?from (?:my )?(?:email|mail)/i,
  /(?:email|mail|gmail|outlook) (?:import|scan)/i,
  /(?:confirmation|booking) (?:email|emails|mail)/i,
  /(?:automatically|auto) (?:import|scan|check)/i,
  /import (?:flights? )?from (?:my )?(?:email|mail)/i,
];

const CALENDAR_PATTERNS = [
  /(?:check|show|view) (?:my )?calendar/i,
  /(?:calendar|schedule) (?:conflicts?|availability)/i,
  /(?:am i |do i have )?(?:free|available|busy)/i,
];

const GREETING_PATTERNS = [
  /^(?:hi|hello|hey|greetings|good (?:morning|afternoon|evening)|howdy)[\s!.,]*$/i,
  /^(?:what's up|sup|yo|hiya)[\s!.,]*$/i,
];

const HELP_PATTERNS = [
  /(?:help|assist|support)/i,
  /(?:what can you do|how does this work|how do i)/i,
  /(?:guide|tutorial|instructions)/i,
];

// ============================================
// Date Parsing
// ============================================

function parseDate(input: string): Date | undefined {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const normalizedInput = input.toLowerCase().trim();

  // Relative dates
  if (/today/.test(normalizedInput)) {
    return today;
  }
  if (/tomorrow/.test(normalizedInput)) {
    return tomorrow;
  }

  // Day of week
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const nextWeekMatch = normalizedInput.match(/(?:next|this)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
  if (nextWeekMatch) {
    const targetDay = daysOfWeek.indexOf(nextWeekMatch[1].toLowerCase());
    const currentDay = today.getDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    if (normalizedInput.includes('next') && daysUntil <= 7) daysUntil += 7;
    const result = new Date(today);
    result.setDate(today.getDate() + daysUntil);
    return result;
  }

  // "In X days/weeks"
  const inDaysMatch = normalizedInput.match(/in\s+(\d+)\s*(day|days|week|weeks)/i);
  if (inDaysMatch) {
    const num = parseInt(inDaysMatch[1]);
    const unit = inDaysMatch[2].toLowerCase();
    const multiplier = unit.startsWith('week') ? 7 : 1;
    const result = new Date(today);
    result.setDate(today.getDate() + num * multiplier);
    return result;
  }

  // Month and day (e.g., "January 15", "Jan 15th")
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const monthShort = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  const monthDayMatch = normalizedInput.match(
    /(?:on\s+)?(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i
  ) || normalizedInput.match(
    /(?:on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?/i
  );

  if (monthDayMatch) {
    let day: number;
    let monthStr: string;

    if (/^\d/.test(monthDayMatch[1])) {
      day = parseInt(monthDayMatch[1]);
      monthStr = monthDayMatch[2].toLowerCase();
    } else {
      monthStr = monthDayMatch[1].toLowerCase();
      day = parseInt(monthDayMatch[2]);
    }

    let monthIndex = months.indexOf(monthStr);
    if (monthIndex === -1) monthIndex = monthShort.indexOf(monthStr);

    if (monthIndex !== -1 && day >= 1 && day <= 31) {
      const result = new Date(today.getFullYear(), monthIndex, day);
      // If date is in the past, assume next year
      if (result < today) {
        result.setFullYear(result.getFullYear() + 1);
      }
      return result;
    }
  }

  // ISO format or numeric (MM/DD, DD/MM)
  const numericMatch = normalizedInput.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
  if (numericMatch) {
    const first = parseInt(numericMatch[1]);
    const second = parseInt(numericMatch[2]);
    let year = numericMatch[3] ? parseInt(numericMatch[3]) : today.getFullYear();
    if (year < 100) year += 2000;

    // Assume MM/DD format (US)
    const month = first - 1;
    const day = second;

    if (month >= 0 && month < 12 && day >= 1 && day <= 31) {
      const result = new Date(year, month, day);
      if (result < today && !numericMatch[3]) {
        result.setFullYear(result.getFullYear() + 1);
      }
      return result;
    }
  }

  return undefined;
}

// ============================================
// Location Parsing
// ============================================

function parseLocation(input: string): { city: string; code: string } | undefined {
  const normalizedInput = input.toLowerCase().trim();

  // Direct airport code match (3 letters)
  const codeMatch = normalizedInput.match(/\b([a-z]{3})\b/i);
  if (codeMatch) {
    const code = codeMatch[1].toLowerCase();
    if (AIRPORT_CODES[code]) {
      return { city: AIRPORT_CODES[code].city, code: AIRPORT_CODES[code].code };
    }
  }

  // City/alias match
  for (const [key, airport] of Object.entries(AIRPORT_CODES)) {
    if (normalizedInput.includes(airport.city.toLowerCase())) {
      return { city: airport.city, code: airport.code };
    }
    for (const alias of airport.aliases) {
      if (normalizedInput.includes(alias)) {
        return { city: airport.city, code: airport.code };
      }
    }
  }

  return undefined;
}

function extractOriginDestination(input: string): { origin?: { city: string; code: string }; destination?: { city: string; code: string } } {
  const normalizedInput = input.toLowerCase();
  let origin: { city: string; code: string } | undefined;
  let destination: { city: string; code: string } | undefined;

  // "from X to Y" pattern
  const fromToMatch = normalizedInput.match(/from\s+(.+?)\s+to\s+(.+?)(?:\s+on|\s+next|\s+this|\s+in|\s*$)/i);
  if (fromToMatch) {
    origin = parseLocation(fromToMatch[1]);
    destination = parseLocation(fromToMatch[2]);
  }

  // "to Y from X" pattern
  const toFromMatch = normalizedInput.match(/to\s+(.+?)\s+from\s+(.+?)(?:\s+on|\s+next|\s+this|\s+in|\s*$)/i);
  if (toFromMatch && !destination) {
    destination = parseLocation(toFromMatch[1]);
    origin = parseLocation(toFromMatch[2]);
  }

  // Just "to Y" pattern (destination only)
  if (!destination) {
    const toMatch = normalizedInput.match(/(?:to|for)\s+(.+?)(?:\s+on|\s+next|\s+this|\s+in|\s*$)/i);
    if (toMatch) {
      destination = parseLocation(toMatch[1]);
    }
  }

  // Just "from X" pattern (origin only)
  if (!origin) {
    const fromMatch = normalizedInput.match(/from\s+(.+?)(?:\s+to|\s+on|\s+next|\s+this|\s+in|\s*$)/i);
    if (fromMatch) {
      origin = parseLocation(fromMatch[1]);
    }
  }

  return { origin, destination };
}

// ============================================
// Entity Extraction
// ============================================

function extractEntities(input: string): IntentEntities {
  const entities: IntentEntities = {};
  const normalizedInput = input.toLowerCase();

  // Extract origin and destination
  const { origin, destination } = extractOriginDestination(input);
  if (origin) {
    entities.origin = origin.city;
    entities.originCode = origin.code;
  }
  if (destination) {
    entities.destination = destination.city;
    entities.destinationCode = destination.code;
  }

  // Extract dates
  const dateMatches = [
    normalizedInput.match(/(?:on\s+|for\s+|departure[:\s]+)?(\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))/i),
    normalizedInput.match(/((?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?)/i),
    normalizedInput.match(/(today|tomorrow)/i),
    normalizedInput.match(/((?:next|this)\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))/i),
    normalizedInput.match(/(in\s+\d+\s*(?:day|days|week|weeks))/i),
    normalizedInput.match(/(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)/),
  ];

  const dateStrings: string[] = [];
  for (const match of dateMatches) {
    if (match) dateStrings.push(match[1]);
  }

  if (dateStrings.length > 0) {
    const parsedDeparture = parseDate(dateStrings[0]);
    if (parsedDeparture) {
      entities.departureDate = parsedDeparture;
    }
    if (dateStrings.length > 1) {
      const parsedReturn = parseDate(dateStrings[1]);
      if (parsedReturn) {
        entities.returnDate = parsedReturn;
      }
    }
  }

  // Check for return/round-trip indicators
  if (/round[ -]?trip|return(?:ing)?|both ways|two[ -]?way/i.test(normalizedInput)) {
    // If we have departure but no return, mark as needing return date
    if (entities.departureDate && !entities.returnDate) {
      // We'll let the clarification prompt ask for return date
    }
  }

  // Extract passengers
  const passengerMatch = normalizedInput.match(/(\d+)\s*(?:passenger|passengers|people|person|adult|adults|traveler|travelers|ticket|tickets)/i);
  if (passengerMatch) {
    entities.passengers = Math.min(parseInt(passengerMatch[1]), 9);
  }

  // "for me" or "just me" implies 1 passenger
  if (!entities.passengers && /(?:for|just)\s+me\b/i.test(normalizedInput)) {
    entities.passengers = 1;
  }

  // "for us" implies 2+ passengers
  if (!entities.passengers && /for\s+us\b/i.test(normalizedInput)) {
    entities.passengers = 2;
  }

  // Extract class
  if (/business\s*class/i.test(normalizedInput)) {
    entities.class = 'business';
  } else if (/first\s*class/i.test(normalizedInput)) {
    entities.class = 'first';
  } else if (/economy|coach/i.test(normalizedInput)) {
    entities.class = 'economy';
  }

  // Extract flexibility
  if (/flexible|anytime|any\s*time|open|not\s*strict/i.test(normalizedInput)) {
    entities.flexibility = 'flexible';
  } else if (/exact|specific|only|must\s*be/i.test(normalizedInput)) {
    entities.flexibility = 'exact';
  }

  return entities;
}

// ============================================
// Intent Detection
// ============================================

function detectIntent(input: string): { type: IntentType; confidence: number } {
  const normalizedInput = input.toLowerCase().trim();

  // Check for greeting first (highest priority for short inputs)
  for (const pattern of GREETING_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'greeting', confidence: 0.95 };
    }
  }

  // Help patterns
  for (const pattern of HELP_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'help', confidence: 0.9 };
    }
  }

  // Cancel patterns (check early to catch abort requests)
  for (const pattern of CANCEL_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'cancel', confidence: 0.9 };
    }
  }

  // Modification patterns
  for (const pattern of MODIFY_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'modify_flight', confidence: 0.85 };
    }
  }

  // Email import patterns
  for (const pattern of IMPORT_EMAIL_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'import_email', confidence: 0.9 };
    }
  }

  // Calendar patterns
  for (const pattern of CALENDAR_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'check_calendar', confidence: 0.85 };
    }
  }

  // Query status patterns
  for (const pattern of QUERY_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'query_status', confidence: 0.85 };
    }
  }

  // Show trips patterns
  for (const pattern of SHOW_TRIPS_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'show_trips', confidence: 0.9 };
    }
  }

  // Booking patterns (most common, check last after more specific patterns)
  for (const pattern of BOOKING_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return { type: 'book_flight', confidence: 0.85 };
    }
  }

  // If we find location entities, likely a booking intent
  const { origin, destination } = extractOriginDestination(input);
  if (destination || origin) {
    return { type: 'book_flight', confidence: 0.7 };
  }

  // If we find date patterns, might be a booking intent
  if (parseDate(input)) {
    return { type: 'book_flight', confidence: 0.5 };
  }

  return { type: 'unknown', confidence: 0.3 };
}

// ============================================
// Missing Fields Detection
// ============================================

function getMissingRequiredFields(entities: IntentEntities, intentType: IntentType): string[] {
  const missing: string[] = [];

  if (intentType === 'book_flight') {
    if (!entities.destination && !entities.destinationCode) {
      missing.push('destination');
    }
    if (!entities.departureDate) {
      missing.push('date');
    }
    // Origin is optional - we'll use user's home airport if not specified
  }

  return missing;
}

// ============================================
// Main Parse Function
// ============================================

export function parseIntent(input: string): ParsedIntent {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      type: 'unknown',
      confidence: 0,
      entities: {},
      missingRequired: [],
      rawInput: input,
    };
  }

  const { type, confidence } = detectIntent(trimmedInput);
  const entities = extractEntities(trimmedInput);
  const missingRequired = getMissingRequiredFields(entities, type);

  // Adjust confidence based on missing fields
  let adjustedConfidence = confidence;
  if (type === 'book_flight') {
    if (entities.destination) adjustedConfidence += 0.1;
    if (entities.departureDate) adjustedConfidence += 0.1;
    if (missingRequired.length > 0) adjustedConfidence -= 0.1 * missingRequired.length;
  }

  adjustedConfidence = Math.max(0, Math.min(1, adjustedConfidence));

  return {
    type,
    confidence: adjustedConfidence,
    entities,
    missingRequired,
    rawInput: input,
  };
}

// ============================================
// Clarification Prompts
// ============================================

export function generateClarificationPrompt(missing: string[], context?: Partial<IntentEntities>): string {
  if (missing.length === 0) {
    return '';
  }

  const prompts: Record<string, string> = {
    destination: context?.origin
      ? `Where would you like to fly to from ${context.origin}?`
      : 'Where would you like to fly to?',
    origin: context?.destination
      ? `Where will you be flying from to reach ${context.destination}?`
      : 'Where will you be flying from?',
    date: context?.destination
      ? `When would you like to fly to ${context.destination}?`
      : 'When would you like to travel?',
    passengers: 'How many passengers will be traveling?',
  };

  if (missing.length === 1) {
    return prompts[missing[0]] || `Could you tell me the ${missing[0]}?`;
  }

  // Multiple missing fields - prioritize
  const priority = ['destination', 'date', 'origin', 'passengers'];
  const sortedMissing = missing.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));

  return prompts[sortedMissing[0]] || `I need a few more details. ${prompts[sortedMissing[0]]}`;
}

// ============================================
// Exports
// ============================================

export { parseLocation, parseDate, extractEntities, AIRPORT_CODES };
