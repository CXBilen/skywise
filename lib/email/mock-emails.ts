// Mock Email Data for SkyWise Demo
// Realistic email samples from various airlines

export interface MockEmail {
  id: string;
  from: string;
  subject: string;
  receivedAt: Date;
  body: string;
  read?: boolean;
}

export const MOCK_EMAILS: MockEmail[] = [
  {
    id: 'email-1',
    from: 'no-reply@united.com',
    subject: 'Your flight confirmation - UA442 to San Francisco',
    receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    body: `Dear Valued Customer,

Thank you for choosing United Airlines!

Your flight is confirmed. Please review your itinerary details below:

CONFIRMATION NUMBER: ABC123

FLIGHT DETAILS
--------------
Flight: UA 442
Date: January 21, 2025
Departure: New York (JFK) at 11:30 AM
Arrival: San Francisco (SFO) at 2:45 PM

Passenger: John Smith
Class: Economy
Seat: 24A (Window)

IMPORTANT INFORMATION
- Please arrive at the airport at least 2 hours before departure
- Check-in opens 24 hours before your flight
- Carry-on: 1 personal item + 1 carry-on bag

Manage your booking at united.com/manage

Thank you for flying United!

United Airlines
MileagePlus Service Center`,
    read: false,
  },

  {
    id: 'email-2',
    from: 'reservations@delta.com',
    subject: 'Delta Air Lines - Your Trip Confirmation DL1892',
    receivedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    body: `Your Trip is Booked!

Hello Sarah,

Get ready for your upcoming Delta flight. Here are your trip details:

Confirmation #: XYZ789

OUTBOUND FLIGHT
Flight DL 1892
February 3, 2025

Atlanta (ATL) → Los Angeles (LAX)
Departs: 8:15 AM
Arrives: 10:45 AM (Local Time)

Duration: 4h 30m | Nonstop

Passenger: Sarah Johnson
SkyMiles #: 1234567890

SEAT SELECTION
Main Cabin | Seat 18C (Aisle)

Need to make changes?
Visit delta.com or call 1-800-221-1212

Safe travels!
Delta Air Lines`,
    read: true,
  },

  {
    id: 'email-3',
    from: 'confirmation@aa.com',
    subject: 'American Airlines - Record Locator MNOPQR',
    receivedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    body: `American Airlines
Your Trip Confirmation

Record Locator: MNOPQR

Hello Michael,

Thank you for booking with American Airlines. Your itinerary is confirmed.

FLIGHT 1
--------
AA 234
Thursday, January 30, 2025

Chicago O'Hare (ORD) - Miami (MIA)
Depart: 2:20 PM | Arrive: 6:55 PM
Flight Time: 3h 35m | Nonstop

Aircraft: Boeing 737-800

Traveler: Michael Chen
AAdvantage #: AA123456789

RETURN FLIGHT
-------------
AA 567
Sunday, February 2, 2025

Miami (MIA) - Chicago O'Hare (ORD)
Depart: 9:00 AM | Arrive: 11:45 AM
Flight Time: 3h 45m | Nonstop

TOTAL COST: $478.00

View or manage your trip at aa.com

American Airlines`,
    read: false,
  },

  {
    id: 'email-4',
    from: 'info@southwest.com',
    subject: 'Southwest Airlines - Confirmation #RSTUVW',
    receivedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    body: `Confirmation Number: RSTUVW

Howdy Emily!

Wanna Get Away? You're all set!

FLIGHT DETAILS
==============

Flight WN 2341
February 14, 2025

Departing: Dallas Love Field (DAL)
Arriving: Denver (DEN)

Departs at 7:25 AM
Arrives at 8:40 AM

Passenger: Emily Davis
Rapid Rewards #: RR98765432

Fare Type: Wanna Get Away
Bags: 2 free checked bags!

WHAT'S NEXT?
- Check in 24 hours before departure
- Print boarding pass or use mobile boarding pass
- Arrive at airport 2 hours early

No change fees! No cancel fees!
Manage your reservation at southwest.com

LUV,
Southwest Airlines`,
    read: true,
  },

  {
    id: 'email-5',
    from: 'bookings@jetblue.com',
    subject: 'JetBlue - Your Flight B6 789 is Confirmed!',
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    body: `JetBlue

Your trip is booked!

Confirmation Code: HIJKLM

------------------------------------------

FLIGHT INFORMATION

Flight B6 789
Saturday, February 8, 2025

Boston Logan (BOS) → Fort Lauderdale (FLL)
Departs: 6:45 AM
Arrives: 10:20 AM

Duration: 3h 35m | Nonstop
Aircraft: Airbus A320

Traveler: David Wilson
TrueBlue #: TB246813579

SELECTED EXTRAS
- Even More Space seat 4D
- Snack pack
- Priority boarding

TRIP TOTAL: $329.00

Manage your trip at jetblue.com

Fly happy!
JetBlue`,
    read: false,
  },

  {
    id: 'email-6',
    from: 'reservations@alaskaair.com',
    subject: 'Alaska Airlines - Your Confirmation NOPQRS',
    receivedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    body: `Alaska Airlines

Booking Confirmed!

Confirmation Code: NOPQRS

Dear Jennifer,

Your Alaska Airlines reservation is confirmed.

FLIGHT DETAILS
--------------

Flight AS 123
March 5, 2025

Seattle (SEA) to Los Angeles (LAX)
Departure: 10:15 AM
Arrival: 1:00 PM (Pacific)

Class: Main Cabin
Seat: 15F (Window)

Passenger: Jennifer Brown
Mileage Plan: MP111222333

CHECKED BAGS
First bag: $30
Second bag: $40

Manage your trip at alaskaair.com

Thank you for flying Alaska!

Alaska Airlines
Care-ful since 1932`,
    read: true,
  },

  {
    id: 'email-7',
    from: 'no-reply@britishairways.com',
    subject: 'BA Booking Reference: UVWXYZ - London Heathrow',
    receivedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    body: `British Airways

Your booking is confirmed

Booking Reference: UVWXYZ

Dear Mr. Thompson,

Thank you for booking with British Airways.

YOUR FLIGHT
============

BA 115
15 March 2025

From: New York JFK
To: London Heathrow (LHR)

Departure: 10:30 PM
Arrival: 10:30 AM (+1 day)

Duration: 7h 00m
Aircraft: Boeing 777-200

Cabin: World Traveller (Economy)
Passenger: Robert Thompson

WHAT TO DO NEXT
- Online check-in opens 24h before departure
- Download the BA app
- Review baggage allowance

Manage at ba.com/managemybooking

British Airways
To Fly. To Serve.`,
    read: false,
  },
];

// ============================================
// Helper Functions
// ============================================

export function getUnreadEmails(): MockEmail[] {
  return MOCK_EMAILS.filter(email => !email.read);
}

export function getFlightConfirmationEmails(): MockEmail[] {
  const flightKeywords = [
    'confirmation', 'booking', 'itinerary', 'flight',
    'record locator', 'reservation', 'ticket',
  ];

  return MOCK_EMAILS.filter(email => {
    const searchText = `${email.subject} ${email.body}`.toLowerCase();
    return flightKeywords.some(keyword => searchText.includes(keyword));
  });
}

export function getRecentEmails(days: number = 7): MockEmail[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return MOCK_EMAILS.filter(email => email.receivedAt.getTime() > cutoff);
}

export function getEmailById(id: string): MockEmail | undefined {
  return MOCK_EMAILS.find(email => email.id === id);
}

export function markEmailAsRead(id: string): void {
  const email = MOCK_EMAILS.find(e => e.id === id);
  if (email) {
    email.read = true;
  }
}

// ============================================
// Export default
// ============================================

export default MOCK_EMAILS;
