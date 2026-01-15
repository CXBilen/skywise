"use client";

/**
 * CHAT PAGE - Main Conversation Interface
 *
 * Features:
 * 1. AI-powered intent parsing and entity extraction
 * 2. Confidence transparency - Shows when AI is uncertain
 * 3. Recovery flows - Handles AI misunderstandings gracefully
 * 4. Undo architecture - All actions are reversible
 * 5. Progressive disclosure - Information revealed as needed
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Calendar, Clock, MapPin } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { SidePanel } from "@/components/layout/side-panel";
import { BottomSheet } from "@/components/layout/bottom-sheet";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { QuickReplyChips } from "@/components/chat/quick-reply-chips";
import { ConfidenceIndicator } from "@/components/chat/confidence-indicator";
import { RecoveryPrompt } from "@/components/chat/recovery-prompt";
import { EmptyState } from "@/components/chat/empty-state";
import { TourOverlay } from "@/components/chat/tour-overlay";
import { TourTooltip } from "@/components/chat/tour-tooltip";
import { FlightCard } from "@/components/flights/flight-card";
import { TripSummaryCard } from "@/components/flights/trip-summary-card";
import { ImportedTripCard } from "@/components/flights/imported-trip-card";
import { ConflictCard } from "@/components/flights/conflict-card";
import { UndoToast } from "@/components/flights/undo-toast";
import { TripMiniCard } from "@/components/flights/trip-mini-card";
import { DatePicker } from "@/components/ui/date-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChatState, FlightOption } from "@/hooks/use-chat-state";
import { useToast } from "@/hooks/use-toast";
import { useTour } from "@/hooks/use-tour";
import { chatTour } from "@/lib/tour-config";
import { generateResponse } from "@/lib/ai/response-generator";
import {
  checkForMisunderstandingTrigger,
  type MisunderstandingScenario,
} from "@/lib/ai/misunderstanding-scenarios";

// ============================================
// Mock Data
// ============================================

const mockFlightOptions: FlightOption[] = [
  {
    id: "1",
    airline: "United",
    flightNumber: "UA 442",
    departureAirport: "JFK",
    arrivalAirport: "SFO",
    departureTime: "2025-01-21T11:30:00",
    arrivalTime: "2025-01-21T14:45:00",
    duration: 375,
    stops: 0,
    price: 28900,
    calendarFit: "fits",
  },
  {
    id: "2",
    airline: "American",
    flightNumber: "AA 178",
    departureAirport: "JFK",
    arrivalAirport: "SFO",
    departureTime: "2025-01-21T14:15:00",
    arrivalTime: "2025-01-21T17:30:00",
    duration: 375,
    stops: 0,
    price: 25400,
    calendarFit: "fits",
  },
  {
    id: "3",
    airline: "Delta",
    flightNumber: "DL 891",
    departureTime: "2025-01-21T07:00:00",
    arrivalTime: "2025-01-21T10:15:00",
    departureAirport: "JFK",
    arrivalAirport: "SFO",
    duration: 375,
    stops: 0,
    price: 21900,
    calendarFit: "conflict",
    conflictDetails: "Overlaps with 'Team Standup' (9:00 AM - 9:30 AM)",
  },
];

const mockTrips = [
  // Upcoming trips
  {
    id: "1",
    destination: "San Francisco",
    origin: "New York",
    departureDate: "2025-01-28",
    returnDate: "2025-01-31",
    status: "upcoming" as const,
    calendarSynced: true,
    airline: "United",
    flightNumber: "UA 442",
  },
  {
    id: "2",
    destination: "Chicago",
    origin: "New York",
    departureDate: "2025-02-15",
    status: "upcoming" as const,
    calendarSynced: false,
    airline: "American",
    flightNumber: "AA 178",
  },
  {
    id: "3",
    destination: "Miami",
    origin: "Boston",
    departureDate: "2025-02-20",
    returnDate: "2025-02-24",
    status: "upcoming" as const,
    calendarSynced: true,
    airline: "JetBlue",
    flightNumber: "B6 917",
  },
  // Completed trips
  {
    id: "4",
    destination: "Seattle",
    origin: "Los Angeles",
    departureDate: "2024-11-15",
    returnDate: "2024-11-18",
    status: "completed" as const,
    calendarSynced: true,
    airline: "Alaska",
    flightNumber: "AS 1284",
  },
  {
    id: "5",
    destination: "Denver",
    origin: "Dallas",
    departureDate: "2024-12-01",
    returnDate: "2024-12-03",
    status: "completed" as const,
    calendarSynced: true,
    airline: "Southwest",
    flightNumber: "WN 2341",
  },
  {
    id: "6",
    destination: "London",
    origin: "New York",
    departureDate: "2024-10-10",
    returnDate: "2024-10-17",
    status: "completed" as const,
    calendarSynced: true,
    airline: "British Airways",
    flightNumber: "BA 178",
  },
];

// ============================================
// Main Component
// ============================================

export default function ChatPage() {
  const {
    messages,
    isTyping,
    conversationState,
    setConversationState,
    addMessage,
    simulateTyping,
    resetConversation,
    setIsTyping,
    parseUserInput,
    updateCollectedInfo,
    getSuggestions,
    canSearch,
    getClarificationPrompt,
  } = useChatState();

  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState<React.ReactNode>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<React.ReactNode>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [undoMessage, setUndoMessage] = useState("");
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [activeRecovery, setActiveRecovery] = useState<MisunderstandingScenario | null>(null);
  const [showTrips, setShowTrips] = useState(false);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([
    "Book a Flight to New York",
    "Import from my mail",
    "Show my upcoming trips",
  ]);
  const [showEmptyState, setShowEmptyState] = useState(true);

  // Tour system
  const tour = useTour(chatTour, {
    onComplete: () => {
      toast({
        title: "Tour Complete!",
        description: "You're all set to use SkyWise.",
      });
    },
  });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Initial welcome message - only show when empty state is dismissed
  useEffect(() => {
    if (messages.length === 0 && !showEmptyState) {
      const response = generateResponse("greeting");
      addMessage("assistant", response.message, {
        suggestions: response.suggestions,
      });
      setCurrentSuggestions(response.suggestions || []);
    }
  }, [messages.length, addMessage, showEmptyState]);

  // Empty state handlers
  const handleFeatureClick = useCallback((featureId: string) => {
    setShowEmptyState(false);

    // Generate greeting first
    const response = generateResponse("greeting");
    addMessage("assistant", response.message);

    // Then handle the specific feature action
    setTimeout(() => {
      switch (featureId) {
        case "search":
          handleUserMessage("I want to find a flight");
          break;
        case "import":
          handleUserMessage("Import flights from my email");
          break;
        case "calendar":
          handleUserMessage("Show my trips");
          break;
        case "assistant":
          handleUserMessage("I need help");
          break;
      }
    }, 500);
  }, [addMessage]);

  const handleDismissEmptyState = useCallback(() => {
    setShowEmptyState(false);
    const response = generateResponse("greeting");
    addMessage("assistant", response.message, {
      suggestions: response.suggestions,
    });
    setCurrentSuggestions(response.suggestions || []);
  }, [addMessage]);

  // Panel handlers
  const showPanel = useCallback(
    (content: React.ReactNode) => {
      // Check mobile status in real-time to ensure correct panel is shown
      const isCurrentlyMobile = typeof window !== 'undefined' && window.innerWidth < 768;

      if (isCurrentlyMobile) {
        setBottomSheetContent(content);
        setBottomSheetOpen(true);
      } else {
        setSidePanelContent(content);
        setSidePanelOpen(true);
      }
    },
    []
  );

  const closePanel = useCallback(() => {
    setSidePanelOpen(false);
    setBottomSheetOpen(false);
  }, []);

  // Booking handlers
  const handleBookingConfirm = useCallback(
    (flight: FlightOption) => {
      setConversationState((prev) => ({ ...prev, step: "booking" }));

      simulateTyping(() => {
        addMessage(
          "assistant",
          `Your flight is booked! ${flight.airline} ${flight.flightNumber} to ${flight.arrivalAirport}.\n\nI've added it to your calendar and a confirmation email is on its way.`,
          { type: "success" }
        );
        setConversationState((prev) => ({ ...prev, step: "complete" }));
        closePanel();
        setUndoMessage("Flight booked & added to calendar");
        setShowUndo(true);
        setCurrentSuggestions(["Book another flight", "Show my upcoming trips", "Done"]);
      }, 2000);
    },
    [setConversationState, simulateTyping, addMessage, closePanel]
  );

  const showTripSummary = useCallback(
    (flight: FlightOption) => {
      showPanel(
        <TripSummaryCard
          origin="New York"
          destination="San Francisco"
          outbound={{
            date: flight.departureTime,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            departureAirport: flight.departureAirport,
            arrivalAirport: flight.arrivalAirport,
            airline: flight.airline,
            flightNumber: flight.flightNumber,
            duration: "6h 15m",
          }}
          returnFlight={{
            date: "2025-01-23T17:15:00",
            departureTime: "2025-01-23T17:15:00",
            arrivalTime: "2025-01-24T01:30:00",
            departureAirport: "SFO",
            arrivalAirport: "JFK",
            airline: flight.airline,
            flightNumber: flight.flightNumber.replace(/\d+/, (n) =>
              String(parseInt(n) + 1)
            ),
            duration: "5h 15m",
          }}
          totalPrice={flight.price * 2}
          calendarEvents={[
            {
              title: "Flight to San Francisco",
              start: flight.departureTime,
              end: flight.arrivalTime,
            },
            {
              title: "Flight home",
              start: "2025-01-23T17:15:00",
              end: "2025-01-24T01:30:00",
            },
          ]}
          onConfirm={() => handleBookingConfirm(flight)}
          onEdit={() => {
            closePanel();
            addMessage("assistant", "What would you like to change about your booking?");
          }}
          onCancel={() => {
            closePanel();
            setConversationState((prev) => ({ ...prev, step: "showing_options" }));
          }}
          isLoading={conversationState.step === "booking"}
        />
      );
    },
    [showPanel, handleBookingConfirm, closePanel, addMessage, conversationState.step, setConversationState]
  );

  // Flight selection handler
  const handleFlightSelect = useCallback(
    (flightId: string) => {
      const flight = mockFlightOptions.find((f) => f.id === flightId);
      if (!flight) return;

      setSelectedFlightId(flightId);

      if (flight.calendarFit === "conflict") {
        setConversationState((prev) => ({
          ...prev,
          step: "checking_conflicts",
          selectedFlight: flight,
          conflict: {
            eventTitle: "Team Standup",
            eventStart: "2025-01-21T09:00:00",
            eventEnd: "2025-01-21T09:30:00",
          },
        }));

        addMessage(
          "assistant",
          "I noticed this flight has a calendar conflict. Let me show you the details so you can decide.",
          { type: "conflict" }
        );

        showPanel(
          <ConflictCard
            flightArrivalTime={flight.arrivalTime}
            flightDepartureTime={flight.departureTime}
            conflictingEvent={{
              id: "1",
              title: "Team Standup",
              start: "2025-01-21T09:00:00",
              end: "2025-01-21T09:30:00",
            }}
            onFindAlternatives={() => {
              closePanel();
              addMessage("user", "Find flights without conflicts");
              const filteredFlights = mockFlightOptions.filter((f) => f.calendarFit === "fits");
              simulateTyping(() => {
                addMessage(
                  "assistant",
                  "Here are flights that work with your schedule:",
                  { type: "flight_options", flightOptions: filteredFlights }
                );
                setConversationState((prev) => ({
                  ...prev,
                  step: "showing_options",
                  flightOptions: filteredFlights,
                }));
              });
            }}
            onBookAnyway={() => {
              closePanel();
              addMessage("user", "Book this flight anyway");
              simulateTyping(() => {
                addMessage(
                  "assistant",
                  "Understood! I'll book this flight but won't add it to your calendar. You may want to reschedule your meeting."
                );
                setConversationState((prev) => ({
                  ...prev,
                  step: "confirming",
                  selectedFlight: flight,
                }));
                showTripSummary(flight);
              });
            }}
            onShowDetails={() => {
              toast({
                title: "Team Standup",
                description: "Daily sync meeting - 9:00 AM to 9:30 AM",
              });
            }}
          />
        );
      } else {
        setConversationState((prev) => ({
          ...prev,
          step: "confirming",
          selectedFlight: flight,
        }));

        addMessage("assistant", "Great choice! Here's your trip summary:");
        showTripSummary(flight);
      }
    },
    [setConversationState, addMessage, showPanel, closePanel, simulateTyping, showTripSummary, toast]
  );

  // Import demo - extracted flight data
  const importedFlightData = {
    airline: "Delta",
    flightNumber: "DL 1247",
    date: "April 5, 2025",
    departureTime: "8:00 AM",
    departureAirport: "JFK",
    arrivalAirport: "LAX",
  };

  // Import panel callbacks
  const handleImportAddToCalendar = useCallback((data: typeof importedFlightData) => {
    closePanel();
    addMessage("user", "Add to Calendar");
    simulateTyping(() => {
      addMessage(
        "assistant",
        `Done! Your ${data.airline} flight to ${data.arrivalAirport} is now on your calendar.`,
        { type: "success" }
      );
      setConversationState((prev) => ({ ...prev, step: "idle" }));
      setCurrentSuggestions(["Book a Flight to New York", "Import from my mail", "Show my upcoming trips"]);
      setUndoMessage("Added to calendar");
      setShowUndo(true);
    });
  }, [closePanel, addMessage, simulateTyping, setConversationState]);

  const handleImportDismiss = useCallback(() => {
    closePanel();
    addMessage("assistant", "No problem, I'll skip that email.");
    setConversationState((prev) => ({ ...prev, step: "idle" }));
    setCurrentSuggestions(["Book a Flight to New York", "Import from my mail", "Show my upcoming trips"]);
  }, [closePanel, addMessage, setConversationState]);

  // Import demo handler
  const handleImportDemo = useCallback(() => {
    addMessage("assistant", "Scanning your email for flight confirmations...", {
      type: "searching",
    });

    simulateTyping(() => {
      addMessage(
        "assistant",
        "I found a flight confirmation in your email! Here's what I extracted:",
        {
          type: "imported_trip",
          data: importedFlightData,
        }
      );

      showPanel(
        <ImportedTripCard
          source="Email from Delta Airlines"
          data={importedFlightData}
          confidence={{
            airline: "high",
            flightNumber: "high",
            date: "high",
            departureTime: "low",
            airports: "high",
          }}
          onAddToCalendar={handleImportAddToCalendar}
          onDismiss={handleImportDismiss}
        />
      );
    }, 2000);
  }, [addMessage, showPanel, simulateTyping, handleImportAddToCalendar, handleImportDismiss]);

  // Recovery handlers
  const handleRecoveryConfirm = useCallback(() => {
    const currentRecovery = activeRecovery;
    setActiveRecovery(null);

    // Special handling for Tokyo - user confirmed Narita
    if (currentRecovery?.id === "international-destination") {
      setConversationState((prev) => ({
        ...prev,
        step: "clarifying",
        collectedInfo: { ...prev.collectedInfo, destination: "Tokyo", destinationCode: "NRT" },
      }));
      simulateTyping(() => {
        addMessage("assistant", "Perfect, **Tokyo (NRT - Narita)** it is! When do you want to travel?");
        setCurrentSuggestions(["Tomorrow", "Next week", "This weekend", "Pick a date"]);
      }, 800);
      return;
    }

    // Default flow for other scenarios
    simulateTyping(() => {
      addMessage(
        "assistant",
        "Perfect! Let me search for flights with those details..."
      );
      setConversationState((prev) => ({
        ...prev,
        step: "searching",
      }));

      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "assistant",
          "I found 3 flights that fit your schedule. The prices range from $219 to $289.",
          { type: "flight_options", flightOptions: mockFlightOptions }
        );
        setConversationState((prev) => ({
          ...prev,
          step: "showing_options",
          flightOptions: mockFlightOptions,
        }));
        setCurrentSuggestions(["Sort by price", "Nonstop only", "Change dates"]);
      }, 1500);
    });
  }, [activeRecovery, addMessage, setConversationState, simulateTyping, setIsTyping]);

  const handleRecoverySelect = useCallback(
    (option: string) => {
      const currentRecovery = activeRecovery;
      setActiveRecovery(null);
      addMessage("user", option);

      // Special handling for Tokyo
      if (currentRecovery?.id === "international-destination") {
        // Determine which airport based on option
        const isHaneda = option.toLowerCase().includes("haneda");
        const airportCode = isHaneda ? "HND" : "NRT";
        const airportName = isHaneda ? "Haneda" : "Narita";

        setConversationState((prev) => ({
          ...prev,
          step: "clarifying",
          collectedInfo: { ...prev.collectedInfo, destination: "Tokyo", destinationCode: airportCode },
        }));
        simulateTyping(() => {
          addMessage("assistant", `Got it, **Tokyo (${airportCode} - ${airportName})** it is! When do you want to travel?`);
          setCurrentSuggestions(["Tomorrow", "Next week", "This weekend", "Pick a date"]);
        }, 800);
        return;
      }

      // Default flow for other scenarios
      simulateTyping(() => {
        addMessage(
          "assistant",
          `Got it! I've updated the search. Let me find flights with that correction...`
        );
        setConversationState((prev) => ({
          ...prev,
          step: "searching",
        }));

        setTimeout(() => {
          setIsTyping(false);
          addMessage(
            "assistant",
            "Here are 3 flights that match your corrected search:",
            { type: "flight_options", flightOptions: mockFlightOptions }
          );
          setConversationState((prev) => ({
            ...prev,
            step: "showing_options",
            flightOptions: mockFlightOptions,
          }));
        }, 1500);
      });
    },
    [activeRecovery, addMessage, setConversationState, simulateTyping, setIsTyping]
  );

  // Main message handler with AI integration
  const handleUserMessage = useCallback(
    (message: string) => {
      // Add user message
      addMessage("user", message);

      // Parse intent using AI
      const intent = parseUserInput(message);
      updateCollectedInfo(intent);

      // Check for misunderstanding scenarios (for demo) - skip during import flows, clarifying flows, and clear booking intents
      // Only trigger for genuinely ambiguous phrases, not clear booking requests
      const shouldCheckMisunderstanding =
        conversationState.step !== "importing_email" &&
        conversationState.step !== "reviewing_import" &&
        conversationState.step !== "clarifying" && // Skip when user is answering a clarification question
        intent.type !== "book_flight" && // Skip for clear booking intents
        intent.type !== "show_trips" &&
        intent.type !== "import_email";

      if (shouldCheckMisunderstanding) {
        const scenario = checkForMisunderstandingTrigger(message.toLowerCase());
        if (scenario && scenario.aiInterpretation.confidence < 0.85) {
          simulateTyping(() => {
            addMessage(
              "assistant",
              `I understood you want to go to ${scenario.aiInterpretation.understood}...`,
              { confidence: scenario.aiInterpretation.confidence }
            );
            setActiveRecovery(scenario);
            setConversationState((prev) => ({ ...prev, step: "clarifying" }));
            // Set destination suggestions for clarification
            setCurrentSuggestions(scenario.recoveryOptions.slice(0, 3));
          });
          return;
        }
      }

      // Handle import email flow options
      if (conversationState.step === "importing_email") {
        if (message.toLowerCase() === "automatic discovery") {
          handleImportDemo();
          return;
        } else if (message.toLowerCase() === "manual entry") {
          simulateTyping(() => {
            addMessage(
              "assistant",
              "Sure! You can paste your flight confirmation email or enter the details:\n\n• Flight number (e.g., UA 442)\n• Date and time\n• Origin and destination airports"
            );
            setConversationState((prev) => ({ ...prev, step: "reviewing_import" }));
            setCurrentSuggestions(["Book a Flight to New York", "Import from my mail", "Show my upcoming trips"]);
          }, 800);
          return;
        }
      }

      // Handle manual email entry - parse pasted email content
      if (conversationState.step === "reviewing_import") {
        // Cities with multiple airports - need clarification
        const multiAirportCities: Record<string, string[]> = {
          "new york": ["JFK", "LGA", "EWR"],
          "london": ["LHR", "LGW", "STN", "LTN"],
          "tokyo": ["NRT", "HND"],
          "chicago": ["ORD", "MDW"],
          "los angeles": ["LAX", "BUR", "SNA"],
          "san francisco": ["SFO", "OAK", "SJC"],
          "washington": ["DCA", "IAD", "BWI"],
          "paris": ["CDG", "ORY"],
          "miami": ["MIA", "FLL"],
        };

        // Try to extract flight info from pasted content
        const flightMatch = message.match(/(?:flight[:\s]*)?([A-Z]{2})\s*(\d{2,4})/i);
        const dateMatch = message.match(/(?:date[:\s]*)?(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s*(\d{4})/i);

        // Match airport codes (3 letters)
        const departureCodeMatch = message.match(/(?:departure[:\s]*)?(\d{1,2}:\d{2}\s*(?:AM|PM))\s*(?:from\s+)?([A-Z]{3})(?:\s|$|\))/i);
        const arrivalCodeMatch = message.match(/(?:arrival[:\s]*)?(\d{1,2}:\d{2}\s*(?:AM|PM))\s*(?:at\s+)?([A-Z]{3})(?:\s|$|\))/i);

        // Match city names (fallback if no airport code)
        const departureCityMatch = message.match(/(?:departure[:\s]*)?(\d{1,2}:\d{2}\s*(?:AM|PM))\s*(?:from\s+)?\(?([A-Za-z\s]+)\)?/i);
        const arrivalCityMatch = message.match(/(?:arrival[:\s]*)?(\d{1,2}:\d{2}\s*(?:AM|PM))\s*(?:at\s+)?[A-Z]{3}\s*\(([A-Za-z\s]+)\)/i);

        // Determine departure info
        let departureAirport = "Unknown";
        let departureConfidence: "high" | "medium" | "low" = "low";
        let departureTime = "Unknown";
        let departureNeedsReview = false;

        if (departureCodeMatch) {
          departureTime = departureCodeMatch[1];
          departureAirport = departureCodeMatch[2].toUpperCase();
          departureConfidence = "high";
        } else if (departureCityMatch) {
          departureTime = departureCityMatch[1];
          const cityName = departureCityMatch[2].trim().toLowerCase();
          // Check if it's a multi-airport city
          if (multiAirportCities[cityName]) {
            departureAirport = `${departureCityMatch[2].trim()} (${multiAirportCities[cityName].join("/")}?)`;
            departureConfidence = "low";
            departureNeedsReview = true;
          } else {
            departureAirport = departureCityMatch[2].trim();
            departureConfidence = "medium";
          }
        }

        // Determine arrival info
        let arrivalAirport = "Unknown";
        let arrivalConfidence: "high" | "medium" | "low" = "low";

        if (arrivalCodeMatch) {
          arrivalAirport = arrivalCodeMatch[2].toUpperCase();
          arrivalConfidence = "high";
        } else if (arrivalCityMatch) {
          const cityName = arrivalCityMatch[2].trim().toLowerCase();
          if (multiAirportCities[cityName]) {
            arrivalAirport = `${arrivalCityMatch[2].trim()} (${multiAirportCities[cityName].join("/")}?)`;
            arrivalConfidence = "low";
          } else {
            arrivalAirport = arrivalCityMatch[2].trim();
            arrivalConfidence = "medium";
          }
        }

        // Overall airports confidence
        const airportsConfidence: "high" | "medium" | "low" =
          (departureConfidence === "high" && arrivalConfidence === "high") ? "high" :
          (departureConfidence === "low" || arrivalConfidence === "low") ? "low" : "medium";

        if (flightMatch || dateMatch || departureTime !== "Unknown") {
          const extractedData = {
            airline: flightMatch ? (flightMatch[1].toUpperCase() === "UA" ? "United" : flightMatch[1].toUpperCase() === "AA" ? "American" : flightMatch[1].toUpperCase() === "DL" ? "Delta" : flightMatch[1].toUpperCase()) : "Unknown",
            flightNumber: flightMatch ? `${flightMatch[1].toUpperCase()} ${flightMatch[2]}` : "Unknown",
            date: dateMatch ? `${dateMatch[1]} ${dateMatch[2]}, ${dateMatch[3]}` : "Unknown",
            departureTime: departureTime,
            departureAirport: departureAirport,
            arrivalAirport: arrivalAirport,
          };

          const warningMessage = departureNeedsReview
            ? "I extracted the following flight details, but **I need your help** - New York has multiple airports (JFK, LGA, EWR). Please verify:"
            : "I extracted the following flight details from your email:";

          simulateTyping(() => {
            addMessage(
              "assistant",
              warningMessage,
              {
                type: "imported_trip",
                data: extractedData,
              }
            );

            showPanel(
              <ImportedTripCard
                source="Pasted email content"
                data={extractedData}
                confidence={{
                  airline: flightMatch ? "high" : "low",
                  flightNumber: flightMatch ? "high" : "low",
                  date: dateMatch ? "high" : "low",
                  departureTime: departureTime !== "Unknown" ? "high" : "low",
                  airports: airportsConfidence,
                }}
                onAddToCalendar={handleImportAddToCalendar}
                onDismiss={handleImportDismiss}
              />
            );
            setConversationState((prev) => ({ ...prev, step: "idle" }));
          }, 1500);
          return;
        }
      }

      // Handle destination/airport selection during clarifying step
      if (conversationState.step === "clarifying") {
        const lowerMessage = message.toLowerCase().trim();
        const upperMessage = message.toUpperCase().trim();

        // Airport codes
        const airportCodes = ["JFK", "LGA", "EWR", "LHR", "LGW", "STN", "NRT", "HND", "ORD", "MDW", "LAX", "BUR", "SNA", "SFO", "OAK", "SJC", "DCA", "IAD", "BWI", "CDG", "ORY", "MIA", "FLL"];

        // Multi-airport cities that need airport selection
        const multiAirportCities: Record<string, { airports: string[]; names: string[] }> = {
          "new york": { airports: ["JFK", "LGA", "EWR"], names: ["JFK - John F. Kennedy International", "LGA - LaGuardia", "EWR - Newark Liberty"] },
          "san francisco": { airports: ["SFO", "OAK", "SJC"], names: ["SFO - San Francisco International", "OAK - Oakland International", "SJC - San Jose"] },
          "chicago": { airports: ["ORD", "MDW"], names: ["ORD - O'Hare International", "MDW - Midway"] },
          "miami": { airports: ["MIA", "FLL"], names: ["MIA - Miami International", "FLL - Fort Lauderdale"] },
          "los angeles": { airports: ["LAX", "BUR", "SNA"], names: ["LAX - Los Angeles International", "BUR - Burbank", "SNA - John Wayne (Orange County)"] },
          "london": { airports: ["LHR", "LGW", "STN"], names: ["LHR - Heathrow", "LGW - Gatwick", "STN - Stansted"] },
          "tokyo": { airports: ["NRT", "HND"], names: ["NRT - Narita International", "HND - Haneda"] },
          "washington": { airports: ["DCA", "IAD", "BWI"], names: ["DCA - Reagan National", "IAD - Dulles International", "BWI - Baltimore-Washington"] },
          "paris": { airports: ["CDG", "ORY"], names: ["CDG - Charles de Gaulle", "ORY - Orly"] },
        };

        // Single-airport cities (direct to date question)
        const singleAirportCities: Record<string, string> = {
          "boston": "BOS",
          "seattle": "SEA",
          "denver": "DEN",
          "atlanta": "ATL",
          "dallas": "DFW",
          "phoenix": "PHX",
          "las vegas": "LAS",
          "orlando": "MCO",
          "houston": "IAH",
        };

        // Check if user selected an airport code
        if (airportCodes.includes(upperMessage)) {
          // Save the selected airport to state
          setConversationState((prev) => ({
            ...prev,
            step: "clarifying",
            collectedInfo: { ...prev.collectedInfo, destinationCode: upperMessage },
          }));
          simulateTyping(() => {
            addMessage("assistant", `Perfect, **${upperMessage}** it is! When do you want to travel?`);
            setCurrentSuggestions(["Tomorrow", "Next week", "This weekend", "Pick a date"]);
          }, 800);
          return;
        }

        // Special handling for Tokyo - show confirmation prompt first
        if (lowerMessage === "tokyo") {
          const tokyoScenario = checkForMisunderstandingTrigger("tokyo");
          if (tokyoScenario) {
            simulateTyping(() => {
              addMessage(
                "assistant",
                `I understood you want to go to **Tokyo** - specifically **NRT (Narita International)**...`,
                { confidence: tokyoScenario.aiInterpretation.confidence }
              );
              setActiveRecovery(tokyoScenario);
              setCurrentSuggestions(tokyoScenario.recoveryOptions.slice(0, 3));
            });
            return;
          }
        }

        // Check if user selected a multi-airport city
        if (multiAirportCities[lowerMessage]) {
          const cityData = multiAirportCities[lowerMessage];
          const cityName = message.charAt(0).toUpperCase() + message.slice(1).toLowerCase();
          // Save the city name, but we still need airport selection
          setConversationState((prev) => ({
            ...prev,
            collectedInfo: { ...prev.collectedInfo, destination: cityName },
          }));
          simulateTyping(() => {
            addMessage("assistant", `Great choice! **${cityName}** has ${cityData.airports.length} major airports:\n\n${cityData.names.map((name, i) => `• **${cityData.airports[i]}** - ${name.split(" - ")[1]}`).join("\n")}\n\nWhich airport works best for you?`);
            setCurrentSuggestions(cityData.airports);
          }, 800);
          return;
        }

        // Check if user selected a single-airport city
        if (singleAirportCities[lowerMessage]) {
          const airportCode = singleAirportCities[lowerMessage];
          const cityName = message.charAt(0).toUpperCase() + message.slice(1).toLowerCase();
          // Save the selected city and airport to state
          setConversationState((prev) => ({
            ...prev,
            step: "clarifying",
            collectedInfo: { ...prev.collectedInfo, destination: cityName, destinationCode: airportCode },
          }));
          simulateTyping(() => {
            addMessage("assistant", `Great, **${cityName}** (${airportCode}) it is! When do you want to travel?`);
            setCurrentSuggestions(["Tomorrow", "Next week", "This weekend", "Pick a date"]);
          }, 800);
          return;
        }

        // Check if user wants to pick a date from calendar
        const { collectedInfo } = conversationState;
        if (lowerMessage === "pick a date" && (collectedInfo.destinationCode || collectedInfo.destination)) {
          // Show date picker in side panel
          const dest = collectedInfo.destination || collectedInfo.destinationCode;
          const destCode = collectedInfo.destinationCode;

          const handleDateSelect = (selectedDate: Date) => {
            closePanel();
            const dateStr = selectedDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            addMessage("user", dateStr);
            setConversationState((prev) => ({ ...prev, step: "searching" }));

            simulateTyping(() => {
              addMessage(
                "assistant",
                `Searching for flights to **${dest}**${destCode && dest !== destCode ? ` (${destCode})` : ""} on **${dateStr}**...\n\nI'm also checking your calendar for conflicts.`,
                { type: "searching" }
              );

              setTimeout(() => {
                setIsTyping(false);
                addMessage(
                  "assistant",
                  `I found 3 flights to ${dest}. I've marked any calendar conflicts so you can see what fits best.`,
                  { type: "flight_options", flightOptions: mockFlightOptions }
                );
                setConversationState((prev) => ({
                  ...prev,
                  step: "showing_options",
                  flightOptions: mockFlightOptions,
                }));
                setCurrentSuggestions(["Sort by price", "Nonstop only", "Earlier flights"]);
              }, 2000);
            }, 1500);
          };

          showPanel(
            <DatePicker
              onSelect={handleDateSelect}
              onCancel={closePanel}
              minDate={new Date()}
            />
          );
          return;
        }

        // Check if user provided a date and we already have a destination
        if (collectedInfo.destinationCode || collectedInfo.destination) {
          // We have a destination, check if this is a date response
          const datePatterns = [
            /^tomorrow$/i,
            /^next\s+(?:week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i,
            /^this\s+(?:weekend|week)$/i,
            /^\d{1,2}\/\d{1,2}(?:\/\d{2,4})?$/,  // MM/DD or MM/DD/YYYY
            /^(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
          ];

          const isDateResponse = datePatterns.some(pattern => pattern.test(lowerMessage));
          if (isDateResponse || intent.entities.departureDate) {
            // User provided a date, proceed to search
            const dest = collectedInfo.destination || collectedInfo.destinationCode;
            const destCode = collectedInfo.destinationCode;
            const dateStr = intent.entities.departureDate?.toLocaleDateString() || message;

            setConversationState((prev) => ({ ...prev, step: "searching" }));

            simulateTyping(() => {
              addMessage(
                "assistant",
                `Searching for flights to **${dest}**${destCode && dest !== destCode ? ` (${destCode})` : ""} on **${dateStr}**...\n\nI'm also checking your calendar for conflicts.`,
                { type: "searching" }
              );

              setTimeout(() => {
                setIsTyping(false);
                addMessage(
                  "assistant",
                  `I found 3 flights to ${dest}. I've marked any calendar conflicts so you can see what fits best.`,
                  { type: "flight_options", flightOptions: mockFlightOptions }
                );
                setConversationState((prev) => ({
                  ...prev,
                  step: "showing_options",
                  flightOptions: mockFlightOptions,
                }));
                setCurrentSuggestions(["Sort by price", "Nonstop only", "Earlier flights"]);
              }, 2000);
            }, 1500);
            return;
          }
        }
      }

      // Handle different intent types
      switch (intent.type) {
        case "greeting":
          setConversationState((prev) => ({ ...prev, step: "idle" }));
          simulateTyping(() => {
            const response = generateResponse("greeting");
            addMessage("assistant", response.message);
            setCurrentSuggestions(response.suggestions || []);
          }, 800);
          break;

        case "help":
          setConversationState((prev) => ({ ...prev, step: "idle" }));
          simulateTyping(() => {
            const response = generateResponse("help");
            addMessage("assistant", response.message);
            setCurrentSuggestions(response.suggestions || []);
          }, 1000);
          break;

        case "show_trips": {
          const isUpcomingOnly = message.toLowerCase().includes("upcoming");
          setShowTrips(true);
          setShowUpcomingOnly(isUpcomingOnly);
          setConversationState((prev) => ({ ...prev, step: "idle" }));

          const upcomingTrips = mockTrips.filter(t => t.status === "upcoming");
          const completedTrips = mockTrips.filter(t => t.status === "completed");

          simulateTyping(() => {
            if (isUpcomingOnly) {
              addMessage("assistant", `Here are your **${upcomingTrips.length} upcoming trips**:`);
              setCurrentSuggestions(["Book a Flight to New York", "Import from my mail", "Show my trips"]);
            } else {
              addMessage("assistant", `Here are all your trips (**${upcomingTrips.length} upcoming**, **${completedTrips.length} completed**):`);
              setCurrentSuggestions(["Book a Flight to New York", "Import from my mail", "Show my upcoming trips"]);
            }
          }, 800);
          break;
        }

        case "import_email":
          setConversationState((prev) => ({ ...prev, step: "importing_email" }));
          simulateTyping(() => {
            addMessage(
              "assistant",
              "I can help you import your flight information. How would you like to proceed?\n\n• **Automatic Discovery** - I'll scan your inbox for flight confirmations\n• **Manual Entry** - You can paste or type in your flight details"
            );
            setCurrentSuggestions(["Automatic Discovery", "Manual Entry"]);
          }, 800);
          break;

        case "cancel":
          simulateTyping(() => {
            const response = generateResponse("cancel");
            addMessage("assistant", response.message);
            setConversationState((prev) => ({ ...prev, step: "idle", collectedInfo: {} }));
            setCurrentSuggestions(["Book a Flight to New York", "Import from my mail", "Show my upcoming trips"]);
          }, 800);
          break;

        case "book_flight": {
          // Cities with multiple airports - need airport selection
          const multiAirportCities: Record<string, { airports: string[]; names: string[] }> = {
            "new york": { airports: ["JFK", "LGA", "EWR"], names: ["JFK - John F. Kennedy International", "LGA - LaGuardia", "EWR - Newark Liberty"] },
            "london": { airports: ["LHR", "LGW", "STN"], names: ["LHR - Heathrow", "LGW - Gatwick", "STN - Stansted"] },
            "tokyo": { airports: ["NRT", "HND"], names: ["NRT - Narita International", "HND - Haneda"] },
            "chicago": { airports: ["ORD", "MDW"], names: ["ORD - O'Hare International", "MDW - Midway"] },
            "los angeles": { airports: ["LAX", "BUR", "SNA"], names: ["LAX - Los Angeles International", "BUR - Burbank", "SNA - John Wayne (Orange County)"] },
            "san francisco": { airports: ["SFO", "OAK", "SJC"], names: ["SFO - San Francisco International", "OAK - Oakland International", "SJC - San Jose"] },
            "washington": { airports: ["DCA", "IAD", "BWI"], names: ["DCA - Reagan National", "IAD - Dulles International", "BWI - Baltimore-Washington"] },
            "paris": { airports: ["CDG", "ORY"], names: ["CDG - Charles de Gaulle", "ORY - Orly"] },
            "miami": { airports: ["MIA", "FLL"], names: ["MIA - Miami International", "FLL - Fort Lauderdale"] },
          };

          // Check what info we have and what's missing
          if (intent.missingRequired.length > 0) {
            // Need to clarify
            setConversationState((prev) => ({ ...prev, step: "clarifying" }));

            let clarificationMessage = "";
            const destination = intent.entities.destination;
            const date = intent.entities.departureDate;

            // Check if destination is a multi-airport city
            const cityKey = destination?.toLowerCase();
            const cityAirports = cityKey ? multiAirportCities[cityKey] : null;

            if (destination && cityAirports && !date) {
              // Multi-airport city - ask for airport selection first
              clarificationMessage = `Let me confirm I understood correctly.\n\n**${destination}** has ${cityAirports.airports.length} major airports:\n\n${cityAirports.names.map((name, i) => `• **${cityAirports.airports[i]}** - ${name.split(" - ")[1]}`).join("\n")}\n\nWhich airport works best for you?`;
              setCurrentSuggestions(cityAirports.airports);
            } else if (destination && !date) {
              clarificationMessage = `Great, ${destination}! When do you want to travel?`;
              setCurrentSuggestions(["Tomorrow", "Next week", "This weekend", "Pick a date"]);
            } else if (!destination && date) {
              clarificationMessage = `Got it, ${date.toLocaleDateString()}. Where would you like to fly to?`;
              setCurrentSuggestions(["New York", "Los Angeles", "San Francisco", "Miami"]);
            } else if (destination) {
              clarificationMessage = `Got it, you want to fly to ${destination}. A few quick questions:\n\n• What date works for you?\n• Do you have an airport preference?`;
              setCurrentSuggestions(["Tomorrow morning", "Next Tuesday", "This weekend"]);
            } else {
              clarificationMessage = "I can help you book a flight! Where would you like to go?";
              setCurrentSuggestions(["San Francisco", "New York", "Miami", "Tokyo"]);
            }

            simulateTyping(() => {
              // Only show confidence indicator for multi-airport city disambiguation
              // Simple clarification questions don't need confidence display
              const showConfidenceMetadata = destination && cityAirports;
              addMessage("assistant", clarificationMessage, showConfidenceMetadata ? {
                confidence: intent.confidence,
              } : undefined);
            }, 1000);
          } else {
            // We have enough info to search
            setConversationState((prev) => ({ ...prev, step: "searching" }));

            const dest = intent.entities.destination || intent.entities.destinationCode;
            const dateStr = intent.entities.departureDate?.toLocaleDateString();

            simulateTyping(() => {
              addMessage(
                "assistant",
                `Searching for flights to ${dest}${dateStr ? ` on ${dateStr}` : ""}...\n\nI'm also checking your calendar for conflicts.`,
                { type: "searching" }
              );

              setTimeout(() => {
                setIsTyping(false);
                addMessage(
                  "assistant",
                  `I found 3 flights to ${dest}. I've marked any calendar conflicts so you can see what fits best.`,
                  { type: "flight_options", flightOptions: mockFlightOptions }
                );
                setConversationState((prev) => ({
                  ...prev,
                  step: "showing_options",
                  flightOptions: mockFlightOptions,
                }));
                setCurrentSuggestions(["Sort by price", "Nonstop only", "Earlier flights"]);
              }, 2000);
            }, 1500);
          }
          break;
        }

        default:
          // Unknown intent - provide helpful response
          setConversationState((prev) => ({ ...prev, step: "idle" }));
          simulateTyping(() => {
            addMessage(
              "assistant",
              "I can help you with:\n\n• Finding and booking flights\n• Importing trips from your email\n• Checking your calendar for conflicts\n\nJust tell me where you want to go, or try one of the suggestions below!",
              { confidence: intent.confidence }
            );
            setCurrentSuggestions(["Book a Flight to New York", "Import from my mail", "Show my upcoming trips"]);
          }, 1000);
      }
    },
    [
      addMessage,
      parseUserInput,
      updateCollectedInfo,
      simulateTyping,
      setConversationState,
      setIsTyping,
      handleImportDemo,
      conversationState.step,
      conversationState.collectedInfo,
      showPanel,
      closePanel,
    ]
  );

  // Quick reply handler
  const handleQuickReply = useCallback(
    (reply: string) => {
      handleUserMessage(reply);
    },
    [handleUserMessage]
  );

  // Undo handler
  const handleUndo = useCallback(async () => {
    setShowUndo(false);
    toast({
      title: "Action Undone",
      description: "The flight has been removed from your calendar.",
    });
    addMessage("assistant", "No problem, I've removed the flight from your calendar.");
    setConversationState((prev) => ({ ...prev, step: "idle" }));
    setCurrentSuggestions(["Book a Flight to New York", "Import from my mail", "Show my upcoming trips"]);
  }, [toast, setConversationState, addMessage]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden">
      <AppHeader />

      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden pt-20 pb-44 relative z-10 w-full min-w-0">
        <ScrollArea className="h-full w-full" ref={scrollRef}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden w-full min-w-0 box-border">
            {/* Empty State */}
            <AnimatePresence mode="wait">
              {showEmptyState && messages.length === 0 && (
                <EmptyState
                  onFeatureClick={handleFeatureClick}
                  onStartTour={() => {
                    setShowEmptyState(false);
                    handleDismissEmptyState();
                    setTimeout(() => tour.startTour(), 300);
                  }}
                  onDismiss={handleDismissEmptyState}
                />
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="space-y-1 overflow-hidden min-w-0 w-full">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                    confidence={message.metadata?.confidence}
                    showConfidence={message.metadata?.confidence !== undefined && message.metadata.confidence < 0.85}
                    messageType={message.metadata?.type}
                  >
                    {/* Flight Cards */}
                    {message.metadata?.type === "flight_options" &&
                      message.metadata?.flightOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mt-4 space-y-3 w-full max-w-full overflow-hidden"
                        >
                          {(message.metadata.flightOptions as FlightOption[]).map(
                            (flight, index) => (
                              <motion.div
                                key={flight.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                              >
                                <FlightCard
                                  {...flight}
                                  selected={selectedFlightId === flight.id}
                                  onSelect={handleFlightSelect}
                                />
                              </motion.div>
                            )
                          )}
                        </motion.div>
                      )}

                    {/* Imported Trip Card */}
                    {message.metadata?.type === "imported_trip" && !!message.metadata?.data && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 w-full max-w-full overflow-hidden"
                      >
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                              <Plane className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {(message.metadata.data as any).airline} {(message.metadata.data as any).flightNumber}
                              </p>
                              <p className="text-sm text-slate-500">From your email</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Calendar className="h-4 w-4" />
                              <span>{(message.metadata.data as any).date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock className="h-4 w-4" />
                              <span>{(message.metadata.data as any).departureTime}</span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2 text-slate-600">
                              <MapPin className="h-4 w-4" />
                              <span>{(message.metadata.data as any).departureAirport} → {(message.metadata.data as any).arrivalAirport}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Quick Reply Chips */}
                    {message.role === "assistant" &&
                      (message.content.includes("quick questions") ||
                        message.content.includes("What date") ||
                        message.content.includes("When do you")) && (
                        <div className="mt-4 w-full min-w-0 overflow-hidden box-border">
                          <QuickReplyChips
                            options={currentSuggestions.slice(0, 4)}
                            onSelect={handleQuickReply}
                          />
                        </div>
                      )}

                    {/* Recovery Prompt */}
                    {message.role === "assistant" &&
                      message.content.includes("I understood you want") &&
                      activeRecovery && (
                        <RecoveryPrompt
                          scenario={activeRecovery}
                          onConfirmOriginal={handleRecoveryConfirm}
                          onSelectOption={handleRecoverySelect}
                        />
                      )}

                    {/* Trip List */}
                    {message.role === "assistant" &&
                      (message.content.includes("upcoming trips") || message.content.includes("all your trips") || message.content.toLowerCase().includes("here are your")) &&
                      showTrips && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 space-y-2 w-full max-w-full overflow-hidden"
                        >
                          {(showUpcomingOnly
                            ? mockTrips.filter(t => t.status === "upcoming")
                            : mockTrips
                          ).map((trip, index) => (
                            <motion.div
                              key={trip.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              <TripMiniCard
                                {...trip}
                                onClick={() => {
                                  toast({
                                    title: `${trip.origin} → ${trip.destination}`,
                                    description: `${trip.airline} ${trip.flightNumber} - ${trip.departureDate}`,
                                  });
                                }}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                  </ChatMessage>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <ChatMessage role="assistant" content="" isTyping />
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        {/* Gradient Fade */}
        <div className="h-8 bg-gradient-to-t from-white to-transparent" />

        {/* Input Container */}
        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div data-tour-id="quick-replies">
              <ChatInput
                onSend={handleUserMessage}
                disabled={conversationState.step === "booking"}
                isLoading={isTyping}
                placeholder="Where do you want to fly?"
                suggestions={currentSuggestions.length > 0 ? currentSuggestions : ["Book a Flight to New York", "Import from my mail", "Show my upcoming trips"]}
                onSuggestionClick={handleQuickReply}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tour System */}
      <TourOverlay isActive={tour.isActive} step={tour.currentStepData} />
      {tour.isActive && tour.currentStepData && (
        <TourTooltip
          step={tour.currentStepData}
          currentStep={tour.currentStep}
          totalSteps={tour.totalSteps}
          onNext={tour.nextStep}
          onPrev={tour.prevStep}
          onSkip={tour.skipTour}
        />
      )}

      {/* Desktop Side Panel */}
      <SidePanel
        open={sidePanelOpen}
        onClose={closePanel}
        title="Trip Details"
      >
        {sidePanelContent}
      </SidePanel>

      {/* Mobile Bottom Sheet */}
      <BottomSheet
        open={bottomSheetOpen}
        onClose={closePanel}
        title="Trip Details"
      >
        {bottomSheetContent}
      </BottomSheet>

      {/* Undo Toast */}
      <UndoToast
        show={showUndo}
        message={undoMessage}
        onUndo={handleUndo}
        onDismiss={() => setShowUndo(false)}
        actionType="booking_confirm"
        description="Your trip has been confirmed"
      />
    </div>
  );
}
