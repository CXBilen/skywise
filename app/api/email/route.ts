import { NextRequest, NextResponse } from "next/server";

// Mock extracted email data
const mockExtractedFlights = [
  {
    id: "email_1",
    emailId: "msg_abc123",
    subject: "Your Delta Flight Confirmation",
    sender: "noreply@delta.com",
    receivedAt: "2025-01-15T10:30:00",
    extractedData: {
      airline: "Delta",
      flightNumber: "DL 1247",
      departureDate: "2025-02-10",
      departureTime: "08:00",
      arrivalTime: "11:15",
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      confirmationNumber: "ABC123",
      passengerName: "John Doe",
    },
    confidence: {
      airline: "high",
      flightNumber: "high",
      date: "high",
      departureTime: "low",
      airports: "high",
      overall: "medium",
    },
    processed: false,
  },
  {
    id: "email_2",
    emailId: "msg_def456",
    subject: "United Airlines - Itinerary Confirmation",
    sender: "confirmation@united.com",
    receivedAt: "2025-01-18T14:22:00",
    extractedData: {
      airline: "United",
      flightNumber: "UA 892",
      departureDate: "2025-03-05",
      departureTime: "14:30",
      arrivalTime: "17:45",
      departureAirport: "SFO",
      arrivalAirport: "ORD",
      confirmationNumber: "XYZ789",
      passengerName: "John Doe",
    },
    confidence: {
      airline: "high",
      flightNumber: "high",
      date: "high",
      departureTime: "high",
      airports: "high",
      overall: "high",
    },
    processed: false,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unprocessedOnly = searchParams.get("unprocessed") === "true";

  // Simulate email scanning delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let emails = [...mockExtractedFlights];

  if (unprocessedOnly) {
    emails = emails.filter((e) => !e.processed);
  }

  return NextResponse.json({
    success: true,
    data: {
      emails,
      totalFound: emails.length,
      lastScanned: new Date().toISOString(),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, emailId, correctedData } = body;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (action === "scan") {
      // Trigger a new email scan
      return NextResponse.json({
        success: true,
        data: {
          newFlightsFound: 1,
          emails: mockExtractedFlights.filter((e) => !e.processed),
        },
      });
    }

    if (action === "import" && emailId) {
      const email = mockExtractedFlights.find((e) => e.id === emailId);

      if (!email) {
        return NextResponse.json(
          { success: false, error: "Email not found" },
          { status: 404 }
        );
      }

      // Apply corrections if provided
      const finalData = correctedData || email.extractedData;

      // Create a trip from the imported email
      const importedTrip = {
        id: `trip_imported_${Date.now()}`,
        status: "draft",
        origin: finalData.departureAirport,
        destination: finalData.arrivalAirport,
        departureDate: `${finalData.departureDate}T${finalData.departureTime}:00`,
        returnDate: null,
        isRoundTrip: false,
        totalPrice: null,
        currency: "USD",
        source: "email_import",
        flights: [
          {
            id: `flight_imported_${Date.now()}`,
            airline: finalData.airline,
            flightNumber: finalData.flightNumber,
            departureAirport: finalData.departureAirport,
            arrivalAirport: finalData.arrivalAirport,
            departureTime: `${finalData.departureDate}T${finalData.departureTime}:00`,
            arrivalTime: `${finalData.departureDate}T${finalData.arrivalTime}:00`,
            confirmationNumber: finalData.confirmationNumber,
            isOutbound: true,
          },
        ],
        sourceEmailId: emailId,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: {
          trip: importedTrip,
          email: { ...email, processed: true },
        },
      });
    }

    if (action === "dismiss" && emailId) {
      return NextResponse.json({
        success: true,
        data: {
          emailId,
          dismissed: true,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
