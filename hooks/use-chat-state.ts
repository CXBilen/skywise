"use client";

import { useState, useCallback } from "react";
import { generateId } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    type?: "flight_options" | "trip_summary" | "conflict" | "imported_trip" | "success";
    data?: unknown;
  };
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  price: number;
  calendarFit: "fits" | "conflict" | "unknown";
  conflictDetails?: string;
}

export interface ConversationState {
  step:
    | "idle"
    | "clarifying"
    | "searching"
    | "showing_options"
    | "confirming"
    | "booking"
    | "complete"
    | "conflict_detected"
    | "importing";
  searchParams?: {
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    timePreference?: string;
    airport?: string;
  };
  selectedFlight?: FlightOption;
  flightOptions?: FlightOption[];
  conflict?: {
    eventTitle: string;
    eventStart: string;
    eventEnd: string;
  };
}

export function useChatState() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: "idle",
  });

  const addMessage = useCallback(
    (
      role: ChatMessage["role"],
      content: string,
      metadata?: ChatMessage["metadata"]
    ) => {
      const message: ChatMessage = {
        id: generateId(),
        role,
        content,
        timestamp: new Date(),
        metadata,
      };
      setMessages((prev) => [...prev, message]);
      return message;
    },
    []
  );

  const simulateTyping = useCallback(
    async (callback: () => void, delay: number = 1500) => {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, delay));
      setIsTyping(false);
      callback();
    },
    []
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setConversationState({ step: "idle" });
    setIsTyping(false);
  }, []);

  return {
    messages,
    isTyping,
    conversationState,
    setConversationState,
    addMessage,
    simulateTyping,
    resetConversation,
    setIsTyping,
  };
}
