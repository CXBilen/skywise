"use client";

import { useState, useCallback, useRef } from "react";
import { generateId } from "@/lib/utils";
import { parseIntent, generateClarificationPrompt } from "@/lib/ai/intent-parser";
import { generateResponse, generateResponseForIntent, getSmartSuggestions } from "@/lib/ai/response-generator";
import type { ParsedIntent, IntentEntities, ConversationStep, MessageMetadata } from "@/lib/types";

// ============================================
// Types
// ============================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    type?: "flight_options" | "trip_summary" | "conflict" | "imported_trip" | "success" | "error" | "searching";
    intent?: ParsedIntent;
    suggestions?: string[];
    confidence?: number;
    data?: unknown;
    flightOptions?: FlightOption[];
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
  step: ConversationStep;
  currentIntent?: ParsedIntent;
  collectedInfo: Partial<IntentEntities>;
  searchParams?: {
    destination?: string;
    destinationCode?: string;
    origin?: string;
    originCode?: string;
    departureDate?: string;
    returnDate?: string;
    timePreference?: string;
    passengers?: number;
  };
  selectedFlight?: FlightOption;
  flightOptions?: FlightOption[];
  conflict?: {
    eventTitle: string;
    eventStart: string;
    eventEnd: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// ============================================
// Hook
// ============================================

export function useChatState() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: "idle",
    collectedInfo: {},
  });
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add a message to the conversation
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

  // Parse user input and return intent
  const parseUserInput = useCallback((input: string): ParsedIntent => {
    return parseIntent(input);
  }, []);

  // Update collected info from intent
  const updateCollectedInfo = useCallback((intent: ParsedIntent) => {
    setConversationState((prev) => ({
      ...prev,
      currentIntent: intent,
      collectedInfo: {
        ...prev.collectedInfo,
        ...intent.entities,
      },
      searchParams: {
        ...prev.searchParams,
        destination: intent.entities.destination || prev.searchParams?.destination,
        destinationCode: intent.entities.destinationCode || prev.searchParams?.destinationCode,
        origin: intent.entities.origin || prev.searchParams?.origin,
        originCode: intent.entities.originCode || prev.searchParams?.originCode,
        departureDate: intent.entities.departureDate?.toISOString() || prev.searchParams?.departureDate,
        returnDate: intent.entities.returnDate?.toISOString() || prev.searchParams?.returnDate,
        passengers: intent.entities.passengers || prev.searchParams?.passengers,
      },
    }));
  }, []);

  // Simulate typing with customizable delay
  const simulateTyping = useCallback(
    async (callback: () => void, delay: number = 1500) => {
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      setIsTyping(true);

      return new Promise<void>((resolve) => {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          callback();
          resolve();
        }, delay);
      });
    },
    []
  );

  // Generate assistant response based on intent and state
  const generateAssistantResponse = useCallback(
    (intent: ParsedIntent, step: ConversationStep) => {
      const response = generateResponseForIntent(intent.type, step, {
        destination: intent.entities.destination,
        date: intent.entities.departureDate?.toLocaleDateString(),
      });
      return response;
    },
    []
  );

  // Get smart suggestions based on current context
  const getSuggestions = useCallback(() => {
    const context = {
      sessionId: "current",
      currentIntent: conversationState.currentIntent,
      collectedInfo: conversationState.collectedInfo as any,
      previousMessages: messages as any,
      userPreferences: {},
      lastActivity: new Date(),
    };
    return getSmartSuggestions(context);
  }, [conversationState, messages]);

  // Check if we have enough info to search
  const canSearch = useCallback(() => {
    const { collectedInfo } = conversationState;
    return !!(collectedInfo.destination || collectedInfo.destinationCode) && collectedInfo.departureDate;
  }, [conversationState]);

  // Get missing fields for clarification
  const getMissingFields = useCallback(() => {
    const { currentIntent } = conversationState;
    if (!currentIntent) return [];
    return currentIntent.missingRequired;
  }, [conversationState]);

  // Generate clarification prompt
  const getClarificationPrompt = useCallback(() => {
    const missing = getMissingFields();
    const context = conversationState.collectedInfo;
    return generateClarificationPrompt(missing, context);
  }, [getMissingFields, conversationState.collectedInfo]);

  // Reset the conversation
  const resetConversation = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setMessages([]);
    setConversationState({ step: "idle", collectedInfo: {} });
    setIsTyping(false);
  }, []);

  // Set conversation step
  const setStep = useCallback((step: ConversationStep) => {
    setConversationState((prev) => ({ ...prev, step }));
  }, []);

  // Set error state
  const setError = useCallback((code: string, message: string) => {
    setConversationState((prev) => ({
      ...prev,
      step: "error",
      error: { code, message },
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setConversationState((prev) => ({
      ...prev,
      step: "idle",
      error: undefined,
    }));
  }, []);

  return {
    // State
    messages,
    isTyping,
    conversationState,

    // Setters
    setMessages,
    setIsTyping,
    setConversationState,
    setStep,
    setError,
    clearError,

    // Actions
    addMessage,
    simulateTyping,
    resetConversation,

    // AI Functions
    parseUserInput,
    updateCollectedInfo,
    generateAssistantResponse,
    getSuggestions,
    canSearch,
    getMissingFields,
    getClarificationPrompt,
  };
}
