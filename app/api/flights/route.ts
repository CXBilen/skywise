import { NextRequest, NextResponse } from "next/server";
import type { ErrorCode, ApiResponse, Flight, CalendarFitStatus } from "@/lib/types";

// ============================================
// Types
// ============================================

interface FlightSearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers?: number;
  class?: string;
}

interface ApiError {
  code: ErrorCode;
  message: string;
  suggestions: string[];
  retryable: boolean;
}

// ============================================
// Valid Routes (Mock - would be real data in production)
// ============================================

const VALID_AIRPORTS = new Set([
  'JFK', 'LGA', 'EWR', 'LAX', 'SFO', 'ORD', 'DFW', 'DEN', 'SEA', 'MIA',
  'BOS', 'ATL', 'PHX', 'IAH', 'LAS', 'MCO', 'MSP', 'DTW', 'PHL', 'CLT',
  'LHR', 'CDG', 'NRT', 'HND', 'IST', 'SAW', 'DXB', 'SIN', 'HKG', 'AMS',
  'FRA', 'MUC', 'MAD', 'BCN', 'FCO', 'SYD', 'YYZ', 'MEX', 'GRU', 'ICN',
]);

const SUSPENDED_ROUTES = new Set([
  'JFK-PRG', // Example suspended route
]);

// ============================================
// Error Factory
// ============================================

function createError(code: ErrorCode, customMessage?: string): ApiError {
  const errorMap: Record<ErrorCode, Omit<ApiError, 'code'>> = {
    NO_FLIGHTS_FOUND: {
      message: customMessage || 'No flights found for this route and date combination.',
      suggestions: [
        'Try searching for nearby airports',
        'Check flights on adjacent dates',
        'Consider flights with connections',
      ],
      retryable: true,
    },
    INVALID_ROUTE: {
      message: customMessage || 'The specified route is not valid or not currently served.',
      suggestions: [
        'Verify the airport codes are correct',
        'Check if the route requires a connection',
        'Try searching for alternative airports',
      ],
      retryable: false,
    },
    DATE_UNAVAILABLE: {
      message: customMessage || 'Flights are not available for the selected date.',
      suggestions: [
        'Airlines typically open bookings 330 days in advance',
        'Try a date closer to today',
        'Check if the airline operates on this day of the week',
      ],
      retryable: true,
    },
    DATE_IN_PAST: {
      message: customMessage || 'The selected date is in the past.',
      suggestions: [
        'Please select a future date',
        'Consider booking for tomorrow or later',
      ],
      retryable: false,
    },
    SERVICE_ERROR: {
      message: customMessage || 'Unable to connect to flight search service.',
      suggestions: [
        'Please try again in a moment',
        'Check your internet connection',
      ],
      retryable: true,
    },
    CALENDAR_ERROR: {
      message: customMessage || 'Unable to check calendar availability.',
      suggestions: [],
      retryable: true,
    },
    EMAIL_PARSE_ERROR: {
      message: customMessage || 'Unable to parse email content.',
      suggestions: [],
      retryable: false,
    },
    BOOKING_FAILED: {
      message: customMessage || 'Unable to complete booking.',
      suggestions: [
        'The flight may no longer be available',
        'Try searching for updated options',
      ],
      retryable: true,
    },
    CONFLICT_UNRESOLVED: {
      message: customMessage || 'Calendar conflict must be resolved.',
      suggestions: [],
      retryable: false,
    },
    UNKNOWN_ERROR: {
      message: customMessage || 'An unexpected error occurred.',
      suggestions: [
        'Please try again',
        'Start a new search if the problem persists',
      ],
      retryable: true,
    },
  };

  return {
    code,
    ...errorMap[code],
  };
}

// ============================================
// Validation Functions
// ============================================

function validateAirportCode(code: string): boolean {
  return VALID_AIRPORTS.has(code.toUpperCase());
}

function validateDate(dateStr: string): { valid: boolean; error?: ErrorCode } {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'DATE_UNAVAILABLE' };
  }

  if (date < today) {
    return { valid: false, error: 'DATE_IN_PAST' };
  }

  // Check if date is too far in the future (330 days)
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 330);

  if (date > maxDate) {
    return { valid: false, error: 'DATE_UNAVAILABLE' };
  }

  return { valid: true };
}

function validateRoute(origin: string, destination: string): { valid: boolean; error?: ErrorCode } {
  if (!validateAirportCode(origin)) {
    return { valid: false, error: 'INVALID_ROUTE' };
  }

  if (!validateAirportCode(destination)) {
    return { valid: false, error: 'INVALID_ROUTE' };
  }

  if (origin.toUpperCase() === destination.toUpperCase()) {
    return { valid: false, error: 'INVALID_ROUTE' };
  }

  const routeKey = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  if (SUSPENDED_ROUTES.has(routeKey)) {
    return { valid: false, error: 'NO_FLIGHTS_FOUND' };
  }

  return { valid: true };
}

// ============================================
// Flight Generation
// ============================================

const AIRLINES = [
  { name: "United", code: "UA", logo: "✈️" },
  { name: "American", code: "AA", logo: "🛫" },
  { name: "Delta", code: "DL", logo: "🔺" },
  { name: "JetBlue", code: "B6", logo: "💙" },
  { name: "Southwest", code: "WN", logo: "❤️" },
  { name: "Alaska", code: "AS", logo: "🏔️" },
];

const TIME_SLOTS = [
  { departure: "06:00", arrival: "09:15", label: "early_morning" },
  { departure: "08:30", arrival: "11:45", label: "morning" },
  { departure: "11:30", arrival: "14:45", label: "midday" },
  { departure: "14:15", arrival: "17:30", label: "afternoon" },
  { departure: "17:00", arrival: "20:15", label: "evening" },
  { departure: "20:30", arrival: "23:45", label: "night" },
];

function generateFlightOptions(
  origin: string,
  destination: string,
  date: string,
  count: number = 4
): Flight[] {
  const basePrice = 180;
  const priceVariance = 150;

  // Simulate occasional empty results (5% chance for demo)
  if (Math.random() < 0.05) {
    return [];
  }

  return TIME_SLOTS.slice(0, count).map((time, index) => {
    const airline = AIRLINES[index % AIRLINES.length];
    const flightNumber = `${airline.code}${100 + Math.floor(Math.random() * 900)}`;
    const price = Math.floor(basePrice + Math.random() * priceVariance);
    const stops = Math.random() > 0.7 ? 1 : 0;
    const baseDuration = 315; // 5h 15m base
    const duration = baseDuration + stops * 90 + Math.floor(Math.random() * 60);

    // Simulate calendar fit status
    const fitOptions: CalendarFitStatus[] = ['fits', 'fits', 'fits', 'conflict', 'pending'];
    const calendarFit = fitOptions[Math.floor(Math.random() * fitOptions.length)];

    return {
      id: `flight_${Date.now()}_${index}`,
      airline: airline.name,
      airlineLogo: airline.logo,
      flightNumber,
      departureTime: time.departure,
      arrivalTime: time.arrival,
      origin: origin.toUpperCase(),
      originCode: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      destinationCode: destination.toUpperCase(),
      duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
      durationMinutes: duration,
      stops,
      stopLocations: stops > 0 ? ['DEN'] : undefined,
      price,
      class: 'economy' as const,
      calendarFit,
      availableSeats: 5 + Math.floor(Math.random() * 50),
      aircraft: 'Boeing 737-800',
    };
  });
}

// ============================================
// API Handlers
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{ flights: Flight[]; searchParams: FlightSearchParams }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin") || "JFK";
    const destination = searchParams.get("destination") || "SFO";
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const passengers = parseInt(searchParams.get("passengers") || "1");
    const flightClass = searchParams.get("class") || "economy";

    // Validate route
    const routeValidation = validateRoute(origin, destination);
    if (!routeValidation.valid) {
      const error = createError(routeValidation.error!,
        `Route ${origin.toUpperCase()} to ${destination.toUpperCase()} is not available.`);
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // Validate date
    const dateValidation = validateDate(date);
    if (!dateValidation.valid) {
      const error = createError(dateValidation.error!);
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    // Simulate occasional service errors (2% chance)
    if (Math.random() < 0.02) {
      const error = createError('SERVICE_ERROR');
      return NextResponse.json({ success: false, error }, { status: 503 });
    }

    const flights = generateFlightOptions(origin, destination, date);

    // Handle no flights found
    if (flights.length === 0) {
      const error = createError('NO_FLIGHTS_FOUND',
        `No flights available from ${origin.toUpperCase()} to ${destination.toUpperCase()} on ${date}.`);
      return NextResponse.json({ success: false, error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        flights,
        searchParams: {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          date,
          passengers,
          class: flightClass,
        },
      },
    });
  } catch (error) {
    console.error('Flight search error:', error);
    const apiError = createError('UNKNOWN_ERROR');
    return NextResponse.json({ success: false, error: apiError }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{
  outboundFlights: Flight[];
  returnFlights: Flight[] | null;
  searchParams: FlightSearchParams & { returnDate?: string };
}>>> {
  try {
    const body = await request.json();
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers = 1,
      class: flightClass = 'economy',
    } = body;

    // Validate required fields
    if (!origin || !destination || !departureDate) {
      const error = createError('INVALID_ROUTE', 'Missing required search parameters.');
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // Validate route
    const routeValidation = validateRoute(origin, destination);
    if (!routeValidation.valid) {
      const error = createError(routeValidation.error!,
        `Route ${origin.toUpperCase()} to ${destination.toUpperCase()} is not available.`);
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // Validate departure date
    const departureDateValidation = validateDate(departureDate);
    if (!departureDateValidation.valid) {
      const error = createError(departureDateValidation.error!);
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // Validate return date if provided
    if (returnDate) {
      const returnDateValidation = validateDate(returnDate);
      if (!returnDateValidation.valid) {
        const error = createError(returnDateValidation.error!,
          'Return date is not valid.');
        return NextResponse.json({ success: false, error }, { status: 400 });
      }

      // Ensure return date is after departure date
      if (new Date(returnDate) < new Date(departureDate)) {
        const error = createError('DATE_UNAVAILABLE',
          'Return date must be after departure date.');
        return NextResponse.json({ success: false, error }, { status: 400 });
      }
    }

    // Validate passengers
    if (passengers < 1 || passengers > 9) {
      const error = createError('INVALID_ROUTE',
        'Number of passengers must be between 1 and 9.');
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    // Simulate occasional service errors (2% chance)
    if (Math.random() < 0.02) {
      const error = createError('SERVICE_ERROR');
      return NextResponse.json({ success: false, error }, { status: 503 });
    }

    const outboundFlights = generateFlightOptions(origin, destination, departureDate);

    // Handle no flights found
    if (outboundFlights.length === 0) {
      const error = createError('NO_FLIGHTS_FOUND',
        `No outbound flights available from ${origin.toUpperCase()} to ${destination.toUpperCase()} on ${departureDate}.`);
      return NextResponse.json({ success: false, error }, { status: 404 });
    }

    let returnFlights: Flight[] | null = null;
    if (returnDate) {
      returnFlights = generateFlightOptions(destination, origin, returnDate);

      // Handle no return flights found
      if (returnFlights.length === 0) {
        const error = createError('NO_FLIGHTS_FOUND',
          `No return flights available from ${destination.toUpperCase()} to ${origin.toUpperCase()} on ${returnDate}.`);
        return NextResponse.json({ success: false, error }, { status: 404 });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        outboundFlights,
        returnFlights,
        searchParams: {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase(),
          date: departureDate,
          returnDate,
          passengers,
          class: flightClass,
        },
      },
    });
  } catch (error) {
    console.error('Flight search error:', error);

    // Check if it's a JSON parse error
    if (error instanceof SyntaxError) {
      const apiError = createError('INVALID_ROUTE', 'Invalid request format.');
      return NextResponse.json({ success: false, error: apiError }, { status: 400 });
    }

    const apiError = createError('UNKNOWN_ERROR');
    return NextResponse.json({ success: false, error: apiError }, { status: 500 });
  }
}

// ============================================
// Booking endpoint
// ============================================

export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse<{
  confirmationNumber: string;
  status: string;
}>>> {
  try {
    const body = await request.json();
    const { flightId, passengers, contactInfo } = body;

    if (!flightId) {
      const error = createError('BOOKING_FAILED', 'Flight ID is required.');
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Simulate occasional booking failures (5% chance)
    if (Math.random() < 0.05) {
      const error = createError('BOOKING_FAILED',
        'Unable to complete booking. The flight may no longer be available at this price.');
      return NextResponse.json({ success: false, error }, { status: 409 });
    }

    // Generate confirmation number
    const confirmationNumber = `SW${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      data: {
        confirmationNumber,
        status: 'confirmed',
      },
    });
  } catch (error) {
    console.error('Booking error:', error);
    const apiError = createError('BOOKING_FAILED');
    return NextResponse.json({ success: false, error: apiError }, { status: 500 });
  }
}
