"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Sparkles,
  Mail,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { SidePanel } from "@/components/layout/side-panel";
import { BottomSheet } from "@/components/layout/bottom-sheet";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { QuickReplyChips } from "@/components/chat/quick-reply-chips";
import { FlightCard } from "@/components/flights/flight-card";
import { TripSummaryCard } from "@/components/flights/trip-summary-card";
import { ImportedTripCard } from "@/components/flights/imported-trip-card";
import { ConflictCard } from "@/components/flights/conflict-card";
import { UndoToast } from "@/components/flights/undo-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useChatState, FlightOption } from "@/hooks/use-chat-state";
import { useToast } from "@/hooks/use-toast";

// Mock flight data
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
  const [isMobile, setIsMobile] = useState(false);
  const [showImportDemo, setShowImportDemo] = useState(false);

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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage(
        "assistant",
        "Hi! I'm your travel assistant. I can help you find and book flights that fit your schedule. What's your next trip?"
      );
    }
  }, [messages.length, addMessage]);

  const showPanel = useCallback(
    (content: React.ReactNode) => {
      if (isMobile) {
        setBottomSheetContent(content);
        setBottomSheetOpen(true);
      } else {
        setSidePanelContent(content);
        setSidePanelOpen(true);
      }
    },
    [isMobile]
  );

  const closePanel = useCallback(() => {
    setSidePanelOpen(false);
    setBottomSheetOpen(false);
  }, []);

  const handleBookingConfirm = useCallback(() => {
    const flight = conversationState.selectedFlight;
    if (!flight) return;

    setConversationState({ ...conversationState, step: "booking" });

    simulateTyping(() => {
      addMessage(
        "assistant",
        `You're booked! ✈️ ${flight.airline} ${flight.flightNumber} to SFO.\n\nI've added your flight to your calendar. Confirmation email is on its way.`,
        { type: "success" }
      );
      setConversationState({ ...conversationState, step: "complete" });
      closePanel();
      setUndoMessage("Added to calendar");
      setShowUndo(true);
    }, 2000);
  }, [conversationState, setConversationState, simulateTyping, addMessage, closePanel]);

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
          onConfirm={handleBookingConfirm}
          onEdit={() => {
            closePanel();
            addMessage("assistant", "What would you like to change?");
          }}
          onCancel={() => {
            closePanel();
            setConversationState({ ...conversationState, step: "showing_options" });
          }}
          isLoading={conversationState.step === "booking"}
        />
      );
    },
    [showPanel, handleBookingConfirm, closePanel, addMessage, conversationState, setConversationState]
  );

  const handleFlightSelect = useCallback(
    (flightId: string) => {
      const flight = mockFlightOptions.find((f) => f.id === flightId);
      if (!flight) return;

      setSelectedFlightId(flightId);

      if (flight.calendarFit === "conflict") {
        setConversationState({
          ...conversationState,
          step: "conflict_detected",
          selectedFlight: flight,
          conflict: {
            eventTitle: "Team Standup",
            eventStart: "2025-01-21T09:00:00",
            eventEnd: "2025-01-21T09:30:00",
          },
        });

        addMessage(
          "assistant",
          "Heads up: This flight has a schedule conflict. Let me show you the details."
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
              addMessage("user", "Find alternative flights");
              simulateTyping(() => {
                addMessage(
                  "assistant",
                  "Here are flights that avoid your conflict:"
                );
                setConversationState({
                  ...conversationState,
                  step: "showing_options",
                  flightOptions: mockFlightOptions.filter(
                    (f) => f.calendarFit === "fits"
                  ),
                });
              });
            }}
            onBookAnyway={() => {
              closePanel();
              addMessage("user", "Book anyway, skip calendar");
              simulateTyping(() => {
                addMessage(
                  "assistant",
                  "Understood. I'll book this flight but won't add it to your calendar—you might want to reschedule your meeting first."
                );
                setConversationState({
                  ...conversationState,
                  step: "confirming",
                  selectedFlight: flight,
                });
                showTripSummary(flight);
              });
            }}
            onShowDetails={() => {
              toast({
                title: "Team Standup",
                description: "Daily sync meeting • 9:00 AM - 9:30 AM",
              });
            }}
          />
        );
      } else {
        setConversationState({
          ...conversationState,
          step: "confirming",
          selectedFlight: flight,
        });

        addMessage("assistant", "Great choice! Here's your trip summary:");
        showTripSummary(flight);
      }
    },
    [conversationState, setConversationState, addMessage, showPanel, closePanel, simulateTyping, showTripSummary, toast]
  );

  const handleImportDemo = useCallback(() => {
    setShowImportDemo(true);
    addMessage(
      "assistant",
      "I found a flight confirmation in your email. Here's what I extracted:"
    );

    showPanel(
      <ImportedTripCard
        source="Email from Delta Airlines"
        data={{
          airline: "Delta",
          flightNumber: "DL 1247",
          date: "April 5, 2025",
          departureTime: "8:00 AM",
          departureAirport: "JFK",
          arrivalAirport: "LAX",
        }}
        confidence={{
          airline: "high",
          flightNumber: "high",
          date: "high",
          departureTime: "low",
          airports: "high",
        }}
        onAddToCalendar={(data) => {
          closePanel();
          addMessage("user", "Add to Calendar");
          simulateTyping(() => {
            addMessage(
              "assistant",
              `Done! Your ${data.airline} flight to ${data.arrivalAirport} is now on your calendar.`
            );
            setUndoMessage("Added to calendar");
            setShowUndo(true);
          });
        }}
        onDismiss={() => {
          closePanel();
          addMessage("assistant", "No problem, I'll ignore that email.");
        }}
      />
    );
  }, [addMessage, showPanel, closePanel, simulateTyping]);

  const handleUserMessage = useCallback(
    (message: string) => {
      addMessage("user", message);
      const lowerMessage = message.toLowerCase();

      // Handle different intents
      if (
        lowerMessage.includes("san francisco") ||
        lowerMessage.includes("sfo") ||
        lowerMessage.includes("fly") ||
        lowerMessage.includes("flight") ||
        lowerMessage.includes("book")
      ) {
        simulateTyping(() => {
          addMessage(
            "assistant",
            "Got it—San Francisco! A few quick questions:\n\n• Do you prefer SFO or Oakland?\n• What time works best for departure?"
          );
          setConversationState({
            ...conversationState,
            step: "clarifying",
            searchParams: { destination: "San Francisco" },
          });
        });
      } else if (
        lowerMessage.includes("sfo") ||
        lowerMessage.includes("morning") ||
        lowerMessage.includes("afternoon") ||
        conversationState.step === "clarifying"
      ) {
        simulateTyping(() => {
          addMessage(
            "assistant",
            "Let me check your calendar... You have a 9am meeting on Tuesday. I'll look for flights after that.\n\nSearching for flights now..."
          );

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addMessage(
                "assistant",
                "Here are 3 options that fit your schedule:"
              );
              setConversationState({
                ...conversationState,
                step: "showing_options",
                flightOptions: mockFlightOptions,
              });
            }, 1500);
          }, 1000);
        });
      } else if (lowerMessage.includes("import") || lowerMessage.includes("email")) {
        handleImportDemo();
      } else if (lowerMessage.includes("chicago") || lowerMessage.includes("boston")) {
        simulateTyping(() => {
          addMessage(
            "assistant",
            `Got it—${lowerMessage.includes("chicago") ? "Chicago" : "Boston"}! When do you need to travel?`
          );
          setConversationState({
            ...conversationState,
            step: "clarifying",
          });
        });
      } else {
        simulateTyping(() => {
          addMessage(
            "assistant",
            "I can help you with:\n\n• Finding and booking flights\n• Importing trips from your email\n• Checking your calendar for conflicts\n\nJust tell me where you want to go!"
          );
        });
      }
    },
    [addMessage, conversationState, setConversationState, simulateTyping, setIsTyping, handleImportDemo]
  );

  const handleQuickReply = useCallback(
    (reply: string) => {
      handleUserMessage(reply);
    },
    [handleUserMessage]
  );

  const handleUndo = useCallback(async () => {
    setShowUndo(false);
    toast({
      title: "Undone",
      description: "Calendar events removed. Booking cancelled.",
      variant: "default",
    });
    setConversationState({ ...conversationState, step: "showing_options" });
  }, [toast, conversationState, setConversationState]);

  const getSuggestions = useCallback(() => {
    if (conversationState.step === "idle" && messages.length <= 1) {
      return ["Book a flight", "Import from email", "Show my trips"];
    }
    if (conversationState.step === "clarifying") {
      return ["SFO, morning", "Oakland, afternoon", "Flexible"];
    }
    return [];
  }, [conversationState.step, messages.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-1">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  >
                    {/* Show flight cards inline for showing_options step */}
                    {message.content.includes("options that fit") &&
                      conversationState.step === "showing_options" && (
                        <div className="mt-4 space-y-3">
                          {(conversationState.flightOptions || mockFlightOptions).map(
                            (flight) => (
                              <FlightCard
                                key={flight.id}
                                {...flight}
                                selected={selectedFlightId === flight.id}
                                onSelect={handleFlightSelect}
                              />
                            )
                          )}
                        </div>
                      )}

                    {/* Quick reply chips after clarifying questions */}
                    {message.role === "assistant" &&
                      message.content.includes("quick questions") && (
                        <div className="mt-4">
                          <QuickReplyChips
                            options={["SFO, morning", "Oakland, afternoon", "Flexible"]}
                            onSelect={handleQuickReply}
                          />
                        </div>
                      )}
                  </ChatMessage>
                ))}

                {isTyping && (
                  <ChatMessage role="assistant" content="" isTyping />
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm p-4">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSend={handleUserMessage}
                disabled={isTyping || conversationState.step === "booking"}
                placeholder="Where do you want to fly?"
                suggestions={getSuggestions()}
                onSuggestionClick={handleQuickReply}
              />
            </div>
          </div>
        </div>

        {/* Desktop Side Panel */}
        <div className="hidden md:block w-[400px] shrink-0">
          <SidePanel
            open={sidePanelOpen}
            onClose={closePanel}
            title="Trip Details"
          >
            {sidePanelContent}
          </SidePanel>
        </div>
      </div>

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
      />

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-24 right-4 md:bottom-8"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={resetConversation}
          className="rounded-full shadow-lg bg-white/80 backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
