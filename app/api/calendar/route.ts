import { NextRequest, NextResponse } from "next/server";

// Mock calendar events
const mockCalendarEvents = [
  {
    id: "evt_1",
    title: "Team Standup",
    start: "2025-01-21T09:00:00",
    end: "2025-01-21T09:30:00",
    recurring: true,
  },
  {
    id: "evt_2",
    title: "Product Review",
    start: "2025-01-21T14:00:00",
    end: "2025-01-21T15:00:00",
    recurring: false,
  },
  {
    id: "evt_3",
    title: "Quarterly Planning",
    start: "2025-01-22T13:00:00",
    end: "2025-01-22T15:00:00",
    recurring: false,
  },
  {
    id: "evt_4",
    title: "1:1 with Manager",
    start: "2025-01-23T10:00:00",
    end: "2025-01-23T10:30:00",
    recurring: true,
  },
];

function checkOverlap(
  eventStart: Date,
  eventEnd: Date,
  flightStart: Date,
  flightEnd: Date
): boolean {
  return eventStart < flightEnd && eventEnd > flightStart;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { flights } = body;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const conflicts: Array<{
      flightId: string;
      conflictingEvent: (typeof mockCalendarEvents)[0];
      overlapType: "departure" | "arrival" | "duration";
    }> = [];

    for (const flight of flights) {
      const flightDeparture = new Date(flight.departureTime);
      const flightArrival = new Date(flight.arrivalTime);

      for (const event of mockCalendarEvents) {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        if (checkOverlap(eventStart, eventEnd, flightDeparture, flightArrival)) {
          let overlapType: "departure" | "arrival" | "duration" = "duration";

          if (
            flightDeparture >= eventStart &&
            flightDeparture <= eventEnd
          ) {
            overlapType = "departure";
          } else if (
            flightArrival >= eventStart &&
            flightArrival <= eventEnd
          ) {
            overlapType = "arrival";
          }

          conflicts.push({
            flightId: flight.id,
            conflictingEvent: event,
            overlapType,
          });
        }
      }
    }

    // Return flights with calendar fit status
    const flightsWithCalendarStatus = flights.map(
      (flight: { id: string }) => {
        const flightConflicts = conflicts.filter(
          (c) => c.flightId === flight.id
        );
        return {
          ...flight,
          calendarFit: flightConflicts.length > 0 ? "conflict" : "fits",
          conflicts: flightConflicts,
        };
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        flights: flightsWithCalendarStatus,
        totalConflicts: conflicts.length,
        conflicts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// Get calendar events for a date range
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  let events = [...mockCalendarEvents];

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    events = events.filter((event) => {
      const eventStart = new Date(event.start);
      return eventStart >= start && eventStart <= end;
    });
  }

  return NextResponse.json({
    success: true,
    data: { events },
  });
}
