// Pre-defined misunderstanding scenarios for demo/showcase
// These demonstrate graceful AI recovery when interpretation is uncertain

export interface MisunderstandingScenario {
  id: string;
  trigger: string;
  aiInterpretation: {
    field: string;
    understood: string;
    confidence: number;
  };
  correctValue: string;
  recoveryOptions: string[];
  explanation: string;
}

export const SHOWCASE_SCENARIOS: MisunderstandingScenario[] = [
  {
    id: "date-ambiguity",
    trigger: "next tuesday",
    aiInterpretation: {
      field: "date",
      understood: "January 21, 2025", // Assume this is the "wrong" Tuesday
      confidence: 0.65,
    },
    correctValue: "January 28, 2025", // User actually meant the following Tuesday
    recoveryOptions: [
      "Actually, I meant January 28",
      "The Tuesday after that",
      "Let me pick a different date",
    ],
    explanation:
      "The phrase 'next Tuesday' can mean this coming Tuesday or the Tuesday of next week. Different people interpret this differently.",
  },
  {
    id: "airport-ambiguity",
    trigger: "new york",
    aiInterpretation: {
      field: "airport",
      understood: "JFK - John F. Kennedy International",
      confidence: 0.72,
    },
    correctValue: "LGA - LaGuardia",
    recoveryOptions: [
      "Actually, LaGuardia works better for me",
      "What about Newark?",
      "Show me all NYC airports",
    ],
    explanation:
      "New York has three major airports. I selected JFK as it's the main international hub, but LaGuardia or Newark might be more convenient.",
  },
  {
    id: "destination-similar",
    trigger: "san francisco",
    aiInterpretation: {
      field: "destination",
      understood: "SFO - San Francisco International",
      confidence: 0.88,
    },
    correctValue: "OAK - Oakland International",
    recoveryOptions: [
      "Oakland would actually be closer",
      "Show me flights to both",
      "SFO is fine",
    ],
    explanation:
      "San Francisco Bay Area has two major airports. SFO is the primary one, but Oakland might be more convenient depending on your final destination.",
  },
  {
    id: "time-ambiguity",
    trigger: "morning flight",
    aiInterpretation: {
      field: "time",
      understood: "6:00 AM - 9:00 AM",
      confidence: 0.6,
    },
    correctValue: "9:00 AM - 12:00 PM",
    recoveryOptions: [
      "I meant mid-morning, around 9-10 AM",
      "Earlier is fine, before 7 AM",
      "Show me all morning options",
    ],
    explanation:
      "'Morning' can mean early morning (5-8 AM) or late morning (9-12 PM). I assumed early morning—let me know if you prefer later.",
  },
  {
    id: "city-confusion",
    trigger: "chicago",
    aiInterpretation: {
      field: "airport",
      understood: "ORD - O'Hare International",
      confidence: 0.75,
    },
    correctValue: "MDW - Chicago Midway",
    recoveryOptions: [
      "Midway would be better for me",
      "O'Hare is fine",
      "Which one has cheaper flights?",
    ],
    explanation:
      "Chicago has two major airports. O'Hare is the main hub, but Midway often has budget-friendly options with Southwest.",
  },
  {
    id: "international-destination",
    trigger: "tokyo",
    aiInterpretation: {
      field: "destination",
      understood: "NRT - Tokyo Narita International",
      confidence: 0.68,
    },
    correctValue: "HND - Tokyo Haneda",
    recoveryOptions: [
      "Yes, Narita is fine",
      "Actually, Haneda is more convenient",
      "Show me flights to both airports",
    ],
    explanation:
      "Tokyo has two major airports. Narita (NRT) is the main international hub but is farther from the city center. Haneda (HND) is closer to downtown Tokyo and may be more convenient.",
  },
];

/**
 * Check if user input contains a trigger for a misunderstanding scenario
 * Used in demo mode to showcase recovery flows
 */
export function checkForMisunderstandingTrigger(
  input: string
): MisunderstandingScenario | null {
  const normalizedInput = input.toLowerCase();

  for (const scenario of SHOWCASE_SCENARIOS) {
    if (normalizedInput.includes(scenario.trigger)) {
      return scenario;
    }
  }

  return null;
}

/**
 * Get a random scenario for demonstration purposes
 */
export function getRandomScenario(): MisunderstandingScenario {
  const randomIndex = Math.floor(Math.random() * SHOWCASE_SCENARIOS.length);
  return SHOWCASE_SCENARIOS[randomIndex];
}

/**
 * Generate a thinking message based on the scenario
 */
export function generateThinkingMessage(
  scenario: MisunderstandingScenario
): string {
  const confidencePercent = Math.round(scenario.aiInterpretation.confidence * 100);

  return `Let me make sure I understood correctly:\n\n` +
    `📍 **${scenario.aiInterpretation.field.charAt(0).toUpperCase() + scenario.aiInterpretation.field.slice(1)}**: ${scenario.aiInterpretation.understood}\n` +
    `_(${confidencePercent}% confident)_`;
}
