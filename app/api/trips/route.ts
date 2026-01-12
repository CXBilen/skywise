import { NextRequest, NextResponse } from "next/server";

// Mock trips data - in production this would use the database
const mockTrips = [
  {
    id: "trip_1",
    status: "confirmed",
    origin: "JFK",
    destination: "SFO",
    departureDate: "2025-01-21T11:30:00",
    returnDate: "2025-01-23T17:15:00",
    isRoundTrip: true,
    totalPrice: 57800,
    currency: "USD",
    source: "chat",
    flights: [
      {
        id: "flight_1",
        airline: "United",
        flightNumber: "UA 442",
        departureAirport: "JFK",
        arrivalAirport: "SFO",
        departureTime: "2025-01-21T11:30:00",
        arrivalTime: "2025-01-21T14:45:00",
        duration: 375,
        stops: 0,
        isOutbound: true,
      },
      {
        id: "flight_2",
        airline: "United",
        flightNumber: "UA 443",
        departureAirport: "SFO",
        arrivalAirport: "JFK",
        departureTime: "2025-01-23T17:15:00",
        arrivalTime: "2025-01-24T01:30:00",
        duration: 315,
        stops: 0,
        isOutbound: false,
      },
    ],
    calendarEventIds: ["cal_evt_1", "cal_evt_2"],
    createdAt: "2025-01-15T10:00:00",
  },
  {
    id: "trip_2",
    status: "draft",
    origin: "JFK",
    destination: "LAX",
    departureDate: "2025-02-10T08:00:00",
    returnDate: null,
    isRoundTrip: false,
    totalPrice: 21900,
    currency: "USD",
    source: "email_import",
    flights: [
      {
        id: "flight_3",
        airline: "Delta",
        flightNumber: "DL 1247",
        departureAirport: "JFK",
        arrivalAirport: "LAX",
        departureTime: "2025-02-10T08:00:00",
        arrivalTime: "2025-02-10T11:15:00",
        duration: 375,
        stops: 0,
        isOutbound: true,
      },
    ],
    calendarEventIds: [],
    createdAt: "2025-01-18T14:30:00",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "10");

  let trips = [...mockTrips];

  if (status) {
    trips = trips.filter((t) => t.status === status);
  }

  trips = trips.slice(0, limit);

  return NextResponse.json({
    success: true,
    data: { trips },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      flights,
      addToCalendar,
    } = body;

    // Simulate booking delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTrip = {
      id: `trip_${Date.now()}`,
      status: "confirmed",
      origin,
      destination,
      departureDate,
      returnDate,
      isRoundTrip: !!returnDate,
      totalPrice: flights.reduce(
        (sum: number, f: { price: number }) => sum + f.price,
        0
      ),
      currency: "USD",
      source: "chat",
      flights,
      calendarEventIds: addToCalendar
        ? flights.map(() => `cal_evt_${Date.now()}_${Math.random()}`)
        : [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        trip: newTrip,
        calendarEventsCreated: addToCalendar ? newTrip.calendarEventIds.length : 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
