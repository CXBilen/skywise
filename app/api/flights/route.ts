import { NextRequest, NextResponse } from "next/server";

// Mock flight data - in production, this would call actual flight APIs
const generateFlightOptions = (
  origin: string,
  destination: string,
  date: string
) => {
  const airlines = [
    { name: "United", code: "UA", color: "blue" },
    { name: "American", code: "AA", color: "red" },
    { name: "Delta", code: "DL", color: "navy" },
    { name: "JetBlue", code: "B6", color: "sky" },
    { name: "Southwest", code: "WN", color: "amber" },
  ];

  const times = [
    { departure: "06:00", arrival: "09:15", label: "early_morning" },
    { departure: "08:30", arrival: "11:45", label: "morning" },
    { departure: "11:30", arrival: "14:45", label: "midday" },
    { departure: "14:15", arrival: "17:30", label: "afternoon" },
    { departure: "17:00", arrival: "20:15", label: "evening" },
    { departure: "20:30", arrival: "23:45", label: "night" },
  ];

  const basePrice = 180;
  const priceVariance = 150;

  return times.slice(0, 4).map((time, index) => {
    const airline = airlines[index % airlines.length];
    const flightNumber = `${airline.code} ${100 + Math.floor(Math.random() * 900)}`;
    const price = Math.floor(
      (basePrice + Math.random() * priceVariance) * 100
    );
    const stops = Math.random() > 0.7 ? 1 : 0;
    const duration = 315 + stops * 90 + Math.floor(Math.random() * 60);

    return {
      id: `flight_${Date.now()}_${index}`,
      airline: airline.name,
      flightNumber,
      departureAirport: origin,
      arrivalAirport: destination,
      departureTime: `${date}T${time.departure}:00`,
      arrivalTime: `${date}T${time.arrival}:00`,
      duration,
      stops,
      price,
      seatClass: "economy",
      calendarFit: "unknown" as const,
    };
  });
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin") || "JFK";
  const destination = searchParams.get("destination") || "SFO";
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const flights = generateFlightOptions(origin, destination, date);

  return NextResponse.json({
    success: true,
    data: {
      flights,
      searchParams: { origin, destination, date },
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destination, departureDate, returnDate, passengers } = body;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const outboundFlights = generateFlightOptions(
      origin,
      destination,
      departureDate
    );

    let returnFlights = null;
    if (returnDate) {
      returnFlights = generateFlightOptions(destination, origin, returnDate);
    }

    return NextResponse.json({
      success: true,
      data: {
        outboundFlights,
        returnFlights,
        searchParams: {
          origin,
          destination,
          departureDate,
          returnDate,
          passengers,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
