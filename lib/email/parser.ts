// Email Parser for SkyWise
// Pattern matching for major airlines with confidence scoring

import type { EmailParseResult, ExtractedFlightData, FieldConfidence } from '@/lib/types';
import { confidenceThresholds } from '@/lib/design-tokens';

// ============================================
// Airline Patterns
// ============================================

interface AirlinePattern {
  name: string;
  domains: string[];
  confirmationPattern: RegExp;
  flightPattern: RegExp;
  datePatterns: RegExp[];
  timePatterns: RegExp[];
  airportPatterns: RegExp[];
}

const AIRLINE_PATTERNS: Record<string, AirlinePattern> = {
  united: {
    name: 'United Airlines',
    domains: ['united.com', 'unitedairlines.com'],
    confirmationPattern: /Confirmation[:\s#]+([A-Z0-9]{6})/i,
    flightPattern: /(?:Flight|UA)[:\s]*(\d{3,4})/i,
    datePatterns: [
      /(?:Date|Departure)[:\s]*(\w+ \d{1,2},? \d{4})/i,
      /(\w+ \d{1,2},? \d{4})/,
    ],
    timePatterns: [
      /Depart(?:s|ure)?[:\s]*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i,
      /Arrive(?:s)?[:\s]*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i,
    ],
    airportPatterns: [
      /(?:From|Depart(?:ing)?)[:\s]*([A-Z]{3})/i,
      /(?:To|Arriv(?:ing|al))[:\s]*([A-Z]{3})/i,
    ],
  },

  delta: {
    name: 'Delta Air Lines',
    domains: ['delta.com'],
    confirmationPattern: /Confirmation[:\s#]+([A-Z0-9]{6})/i,
    flightPattern: /(?:Flight|DL)[:\s]*(\d{3,4})/i,
    datePatterns: [
      /(?:Date|Departure)[:\s]*(\w+ \d{1,2},? \d{4})/i,
    ],
    timePatterns: [
      /(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i,
    ],
    airportPatterns: [
      /([A-Z]{3})\s*(?:to|→|->)\s*([A-Z]{3})/i,
    ],
  },

  american: {
    name: 'American Airlines',
    domains: ['aa.com', 'americanairlines.com'],
    confirmationPattern: /Record Locator[:\s]+([A-Z0-9]{6})/i,
    flightPattern: /(?:Flight|AA)[:\s]*(\d{3,4})/i,
    datePatterns: [
      /(\w{3,9} \d{1,2},? \d{4})/,
    ],
    timePatterns: [
      /(\d{1,2}:\d{2}\s*(?:AM|PM))/i,
    ],
    airportPatterns: [
      /([A-Z]{3})\s*-\s*([A-Z]{3})/,
    ],
  },

  southwest: {
    name: 'Southwest Airlines',
    domains: ['southwest.com'],
    confirmationPattern: /Confirmation[:\s#]+([A-Z0-9]{6})/i,
    flightPattern: /(?:Flight|WN)[:\s]*(\d{3,4})/i,
    datePatterns: [
      /(\w+ \d{1,2},? \d{4})/,
    ],
    timePatterns: [
      /(\d{1,2}:\d{2}\s*(?:AM|PM))/i,
    ],
    airportPatterns: [
      /([A-Z]{3})\s*(?:to|→)\s*([A-Z]{3})/i,
    ],
  },

  jetblue: {
    name: 'JetBlue',
    domains: ['jetblue.com'],
    confirmationPattern: /Confirmation[:\s#]+([A-Z0-9]{6})/i,
    flightPattern: /(?:Flight|B6)[:\s]*(\d{3,4})/i,
    datePatterns: [
      /(\w+ \d{1,2},? \d{4})/,
    ],
    timePatterns: [
      /(\d{1,2}:\d{2}\s*(?:AM|PM))/i,
    ],
    airportPatterns: [
      /([A-Z]{3})\s*(?:to|→|->)\s*([A-Z]{3})/i,
    ],
  },

  alaska: {
    name: 'Alaska Airlines',
    domains: ['alaskaair.com'],
    confirmationPattern: /Confirmation[:\s#]+([A-Z0-9]{6})/i,
    flightPattern: /(?:Flight|AS)[:\s]*(\d{3,4})/i,
    datePatterns: [
      /(\w+ \d{1,2},? \d{4})/,
    ],
    timePatterns: [
      /(\d{1,2}:\d{2}\s*(?:AM|PM))/i,
    ],
    airportPatterns: [
      /([A-Z]{3})\s*(?:to|→|->)\s*([A-Z]{3})/i,
    ],
  },
};

// ============================================
// Airport Data
// ============================================

const AIRPORT_NAMES: Record<string, string> = {
  'JFK': 'John F. Kennedy International Airport',
  'LGA': 'LaGuardia Airport',
  'EWR': 'Newark Liberty International Airport',
  'LAX': 'Los Angeles International Airport',
  'SFO': 'San Francisco International Airport',
  'ORD': "O'Hare International Airport",
  'DFW': 'Dallas/Fort Worth International Airport',
  'DEN': 'Denver International Airport',
  'SEA': 'Seattle-Tacoma International Airport',
  'MIA': 'Miami International Airport',
  'BOS': 'Boston Logan International Airport',
  'ATL': 'Hartsfield-Jackson Atlanta International Airport',
  'PHX': 'Phoenix Sky Harbor International Airport',
  'IAH': 'George Bush Intercontinental Airport',
  'LAS': 'Harry Reid International Airport',
  'MCO': 'Orlando International Airport',
  'LHR': 'London Heathrow Airport',
  'CDG': 'Paris Charles de Gaulle Airport',
  'NRT': 'Narita International Airport',
  'HND': 'Tokyo Haneda Airport',
};

// ============================================
// Generic Patterns
// ============================================

const GENERIC_PATTERNS = {
  confirmation: [
    /Confirmation[:\s#]+([A-Z0-9]{5,8})/i,
    /Record Locator[:\s]+([A-Z0-9]{5,8})/i,
    /Booking Reference[:\s]+([A-Z0-9]{5,8})/i,
    /Reservation[:\s#]+([A-Z0-9]{5,8})/i,
    /PNR[:\s#]+([A-Z0-9]{5,8})/i,
  ],
  flightNumber: [
    /Flight[:\s]*([A-Z]{2}\s?\d{3,4})/i,
    /([A-Z]{2}\d{3,4})/,
  ],
  date: [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(\w{3,9}\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})/i,
    /(\d{1,2}\s+\w{3,9}\s+\d{4})/i,
    /(\w{3},?\s+\w{3,9}\s+\d{1,2},?\s+\d{4})/i,
  ],
  time: [
    /(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/,
    /(?:at\s+)?(\d{1,2}:\d{2})/,
    /Depart(?:s|ure)?[:\s]*(\d{1,2}:\d{2})/i,
    /Arrive(?:s|al)?[:\s]*(\d{1,2}:\d{2})/i,
  ],
  airport: [
    /([A-Z]{3})\s*(?:to|→|->|–)\s*([A-Z]{3})/,
    /From[:\s]*([A-Z]{3})/i,
    /To[:\s]*([A-Z]{3})/i,
    /Depart(?:ing|ure)?[:\s]*(?:from\s+)?([A-Z]{3})/i,
    /Arriv(?:ing|al)?[:\s]*(?:at|in)?\s*([A-Z]{3})/i,
  ],
  passengerName: [
    /(?:Passenger|Traveler)[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
    /(?:Dear|Hello)\s+([A-Z][a-z]+)/i,
    /Name[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
  ],
};

// ============================================
// Parser Functions
// ============================================

function detectAirline(emailContent: string, sender: string): AirlinePattern | null {
  const senderLower = sender.toLowerCase();

  for (const [key, pattern] of Object.entries(AIRLINE_PATTERNS)) {
    if (pattern.domains.some(domain => senderLower.includes(domain))) {
      return pattern;
    }
  }

  // Try to detect from content
  const airlineKeywords = {
    united: ['united airlines', 'mileageplus'],
    delta: ['delta air lines', 'skymiles'],
    american: ['american airlines', 'aadvantage'],
    southwest: ['southwest airlines', 'rapid rewards'],
    jetblue: ['jetblue', 'trueblue'],
    alaska: ['alaska airlines', 'mileage plan'],
  };

  const contentLower = emailContent.toLowerCase();
  for (const [key, keywords] of Object.entries(airlineKeywords)) {
    if (keywords.some(kw => contentLower.includes(kw))) {
      return AIRLINE_PATTERNS[key];
    }
  }

  return null;
}

function extractWithConfidence(
  content: string,
  patterns: RegExp[],
  groupIndex: number = 1
): { value: string | null; confidence: number } {
  for (let i = 0; i < patterns.length; i++) {
    const match = content.match(patterns[i]);
    if (match && match[groupIndex]) {
      // Higher confidence for earlier patterns (more specific)
      const confidence = 1 - (i * 0.1);
      return { value: match[groupIndex].trim(), confidence: Math.max(0.5, confidence) };
    }
  }
  return { value: null, confidence: 0 };
}

function extractAirports(
  content: string,
  patterns: RegExp[]
): { departure: string | null; arrival: string | null; confidence: number } {
  // Try combined patterns first (e.g., "JFK to LAX")
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1] && match[2]) {
      return {
        departure: match[1].toUpperCase(),
        arrival: match[2].toUpperCase(),
        confidence: 0.95,
      };
    }
  }

  // Try separate patterns
  const { value: departure, confidence: depConf } = extractWithConfidence(
    content,
    GENERIC_PATTERNS.airport.filter(p => /from|depart/i.test(p.source))
  );

  const { value: arrival, confidence: arrConf } = extractWithConfidence(
    content,
    GENERIC_PATTERNS.airport.filter(p => /to|arriv/i.test(p.source))
  );

  if (departure || arrival) {
    return {
      departure: departure?.toUpperCase() || null,
      arrival: arrival?.toUpperCase() || null,
      confidence: Math.min(depConf, arrConf) || 0.6,
    };
  }

  return { departure: null, arrival: null, confidence: 0 };
}

function extractTimes(
  content: string,
  patterns: RegExp[]
): { departure: string | null; arrival: string | null; confidence: number } {
  const times: string[] = [];

  for (const pattern of patterns) {
    const matches = content.matchAll(new RegExp(pattern, 'gi'));
    for (const match of matches) {
      if (match[1] && !times.includes(match[1])) {
        times.push(match[1]);
      }
    }
  }

  if (times.length >= 2) {
    return {
      departure: times[0],
      arrival: times[1],
      confidence: 0.85,
    };
  } else if (times.length === 1) {
    return {
      departure: times[0],
      arrival: null,
      confidence: 0.7,
    };
  }

  return { departure: null, arrival: null, confidence: 0 };
}

function normalizeDate(dateStr: string): string | null {
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch {
    // Continue to manual parsing
  }

  // Manual parsing for common formats
  const formats = [
    // "January 21, 2025"
    /(\w+)\s+(\d{1,2}),?\s+(\d{4})/,
    // "21 January 2025"
    /(\d{1,2})\s+(\w+)\s+(\d{4})/,
    // "01/21/2025"
    /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,
  ];

  const months: Record<string, number> = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      let year: number;
      let month: number;
      let day: number;

      if (/^\d+$/.test(match[1])) {
        // Numeric format (MM/DD/YYYY or DD/MM/YYYY)
        // Assume MM/DD/YYYY (US format)
        month = parseInt(match[1]) - 1;
        day = parseInt(match[2]);
        year = parseInt(match[3]);
        if (year < 100) year += 2000;
      } else if (/^\d+$/.test(match[2])) {
        // "21 January 2025"
        day = parseInt(match[1]);
        month = months[match[2].toLowerCase()] ?? 0;
        year = parseInt(match[3]);
      } else {
        // "January 21, 2025"
        month = months[match[1].toLowerCase()] ?? 0;
        day = parseInt(match[2]);
        year = parseInt(match[3]);
      }

      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
  }

  return null;
}

// ============================================
// Main Parse Function
// ============================================

export function parseFlightEmail(emailContent: string, sender: string): EmailParseResult {
  const airline = detectAirline(emailContent, sender);

  // Use airline-specific patterns if available, otherwise use generic
  const patterns = airline
    ? {
        confirmation: [airline.confirmationPattern, ...GENERIC_PATTERNS.confirmation],
        flight: [airline.flightPattern, ...GENERIC_PATTERNS.flightNumber],
        date: [...airline.datePatterns, ...GENERIC_PATTERNS.date],
        time: [...airline.timePatterns, ...GENERIC_PATTERNS.time],
        airport: [...airline.airportPatterns, ...GENERIC_PATTERNS.airport],
      }
    : {
        confirmation: GENERIC_PATTERNS.confirmation,
        flight: GENERIC_PATTERNS.flightNumber,
        date: GENERIC_PATTERNS.date,
        time: GENERIC_PATTERNS.time,
        airport: GENERIC_PATTERNS.airport,
      };

  // Extract each field
  const confirmation = extractWithConfidence(emailContent, patterns.confirmation);
  const flightNumber = extractWithConfidence(emailContent, patterns.flight);
  const dateRaw = extractWithConfidence(emailContent, patterns.date);
  const airports = extractAirports(emailContent, patterns.airport);
  const times = extractTimes(emailContent, patterns.time);
  const passengerName = extractWithConfidence(emailContent, GENERIC_PATTERNS.passengerName);

  // Normalize date
  const normalizedDate = dateRaw.value ? normalizeDate(dateRaw.value) : null;

  // Calculate field confidence
  const perField: FieldConfidence['perField'] = {
    airline: airline ? 0.95 : 0.5,
    flightNumber: flightNumber.confidence,
    date: normalizedDate ? dateRaw.confidence : 0,
    time: times.confidence,
    airports: airports.confidence,
    confirmation: confirmation.confidence,
  };

  // Calculate overall confidence
  const confidenceValues = Object.values(perField);
  const overallConfidence = confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length;

  // Determine fields needing review
  const needsReview: string[] = [];
  if (perField.flightNumber < confidenceThresholds.high) needsReview.push('flightNumber');
  if (perField.date < confidenceThresholds.high) needsReview.push('date');
  if (perField.time < confidenceThresholds.high) needsReview.push('time');
  if (perField.airports < confidenceThresholds.high) needsReview.push('airports');
  if (perField.confirmation < confidenceThresholds.high) needsReview.push('confirmation');

  // Build extracted data
  const extracted: ExtractedFlightData = {
    airline: airline?.name,
    flightNumber: flightNumber.value || undefined,
    departureDate: normalizedDate || undefined,
    departureTime: times.departure || undefined,
    arrivalTime: times.arrival || undefined,
    departureAirport: airports.departure ? AIRPORT_NAMES[airports.departure] : undefined,
    departureAirportCode: airports.departure || undefined,
    arrivalAirport: airports.arrival ? AIRPORT_NAMES[airports.arrival] : undefined,
    arrivalAirportCode: airports.arrival || undefined,
    confirmationNumber: confirmation.value || undefined,
    passengerName: passengerName.value || undefined,
  };

  // Create raw snippet (first 200 chars of relevant content)
  const relevantContent = emailContent
    .replace(/\s+/g, ' ')
    .substring(0, 300)
    .trim();

  return {
    success: overallConfidence >= confidenceThresholds.medium,
    confidence: {
      overall: overallConfidence,
      perField,
    },
    extracted,
    rawSnippet: relevantContent + '...',
    needsReview,
  };
}

// ============================================
// Exports
// ============================================

export { AIRLINE_PATTERNS, AIRPORT_NAMES };
