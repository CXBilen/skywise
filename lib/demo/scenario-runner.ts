// Demo Scenario Runner for SkyWise
// Pre-scripted demo scenarios to showcase all key features

import type { DemoScenario, DemoStep, DemoStepType } from '@/lib/types';

// ============================================
// Demo Scenarios
// ============================================

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'happy-path-booking',
    name: 'Book a Flight',
    description: 'Complete booking flow with calendar check',
    estimatedDuration: 25000,
    steps: [
      {
        type: 'user_message',
        content: 'I need to fly to San Francisco next Tuesday',
        delay: 0,
      },
      {
        type: 'system_event',
        content: 'intent_parsed',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "I'll search for flights to San Francisco. Let me check your calendar for next Tuesday.",
        delay: 1500,
      },
      {
        type: 'system_event',
        content: 'checking_calendar',
        delay: 800,
      },
      {
        type: 'assistant_response',
        content: "Great news! I found 4 flights that fit perfectly with your schedule. Here are the best options:",
        delay: 2000,
      },
      {
        type: 'highlight',
        content: '.flight-card:first-child',
        delay: 500,
      },
      {
        type: 'pause',
        content: 'User reviews flight options',
        delay: 3000,
      },
      {
        type: 'user_message',
        content: "I'll take the 8:30 AM United flight",
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "Great choice! The UA442 at 8:30 AM fits perfectly with your schedule. Here's your trip summary:",
        delay: 1500,
      },
      {
        type: 'highlight',
        content: '.trip-summary-card',
        delay: 500,
      },
      {
        type: 'pause',
        content: 'User reviews trip summary',
        delay: 2000,
      },
      {
        type: 'user_message',
        content: 'Confirm booking',
        delay: 500,
      },
      {
        type: 'system_event',
        content: 'booking_in_progress',
        delay: 1000,
      },
      {
        type: 'assistant_response',
        content: "Your flight is booked! Confirmation number: ABC123. I've added it to your calendar. Have a great trip!",
        delay: 2000,
      },
      {
        type: 'highlight',
        content: '.undo-toast',
        delay: 500,
      },
      {
        type: 'pause',
        content: 'Demo complete - undo available',
        delay: 3000,
      },
    ],
  },

  {
    id: 'conflict-resolution',
    name: 'Handle Calendar Conflict',
    description: 'Book a flight that conflicts with an existing event',
    estimatedDuration: 30000,
    steps: [
      {
        type: 'user_message',
        content: 'Find me a flight to Chicago tomorrow afternoon',
        delay: 0,
      },
      {
        type: 'assistant_response',
        content: "I'll search for afternoon flights to Chicago. Checking your calendar...",
        delay: 1500,
      },
      {
        type: 'system_event',
        content: 'conflict_detected',
        delay: 1000,
      },
      {
        type: 'assistant_response',
        content: "I found some flights, but I noticed a potential scheduling conflict. You have 'Team Meeting' scheduled from 2-3 PM.",
        delay: 2000,
      },
      {
        type: 'highlight',
        content: '.conflict-card',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "Here are your options:\n1. Choose an earlier flight (11:30 AM) that avoids the conflict\n2. Book anyway and reschedule your meeting\n3. Look at flights for a different day",
        delay: 2000,
      },
      {
        type: 'pause',
        content: 'User considers options',
        delay: 3000,
      },
      {
        type: 'user_message',
        content: "I'll take the earlier flight",
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "Smart choice! The 11:30 AM flight gets you to Chicago by 12:45 PM local time, giving you plenty of buffer before your meeting.",
        delay: 1500,
      },
      {
        type: 'highlight',
        content: '.calendar-fit-indicator.fits',
        delay: 500,
      },
      {
        type: 'pause',
        content: 'User sees conflict resolved',
        delay: 2000,
      },
    ],
  },

  {
    id: 'email-import',
    name: 'Import from Email',
    description: 'Extract booking from confirmation email',
    estimatedDuration: 22000,
    steps: [
      {
        type: 'user_message',
        content: 'Import my flight from email',
        delay: 0,
      },
      {
        type: 'assistant_response',
        content: "Scanning your email for flight confirmations...",
        delay: 1500,
      },
      {
        type: 'system_event',
        content: 'scanning_email',
        delay: 2000,
      },
      {
        type: 'assistant_response',
        content: "I found 2 flight confirmations. Here's what I extracted from your United confirmation:",
        delay: 2000,
      },
      {
        type: 'highlight',
        content: '.imported-trip-card',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "Flight: UA442 - JFK to SFO\nDate: January 21, 2025\nConfirmation: ABC123\n\nConfidence: 95%",
        delay: 1000,
      },
      {
        type: 'highlight',
        content: '.confidence-indicator',
        delay: 500,
      },
      {
        type: 'pause',
        content: 'User reviews extracted data',
        delay: 3000,
      },
      {
        type: 'user_message',
        content: 'Looks correct, add to calendar',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "Done! I've added your United flight to your calendar. You can undo this within 15 seconds if needed.",
        delay: 1500,
      },
      {
        type: 'highlight',
        content: '.undo-toast',
        delay: 500,
      },
    ],
  },

  {
    id: 'natural-language',
    name: 'Natural Language Understanding',
    description: 'Shows how the AI understands various phrasings',
    estimatedDuration: 35000,
    steps: [
      {
        type: 'user_message',
        content: 'Hi!',
        delay: 0,
      },
      {
        type: 'assistant_response',
        content: "Hi! I'm your SkyWise travel assistant. Where would you like to fly today?",
        delay: 1000,
      },
      {
        type: 'user_message',
        content: 'I want to visit my mom in LA',
        delay: 1500,
      },
      {
        type: 'system_event',
        content: 'intent: book_flight, destination: Los Angeles',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "I'd love to help you visit your mom in Los Angeles! When would you like to travel?",
        delay: 1500,
      },
      {
        type: 'user_message',
        content: 'Next weekend would be perfect',
        delay: 1500,
      },
      {
        type: 'system_event',
        content: 'date parsed: Saturday, February 1',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "Got it! I'll search for flights to Los Angeles for this Saturday, February 1st. Checking your calendar...",
        delay: 1500,
      },
      {
        type: 'pause',
        content: 'AI understood natural date reference',
        delay: 2000,
      },
      {
        type: 'user_message',
        content: 'Actually, make it business class',
        delay: 1000,
      },
      {
        type: 'system_event',
        content: 'class updated: business',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "No problem! I'll look for business class options. Here are the best business class flights to LA:",
        delay: 1500,
      },
      {
        type: 'highlight',
        content: '.flight-card.business-class',
        delay: 500,
      },
    ],
  },

  {
    id: 'undo-demo',
    name: 'Undo Actions',
    description: 'Demonstrates the undo functionality',
    estimatedDuration: 18000,
    steps: [
      {
        type: 'system_event',
        content: 'Previous action: Flight added to calendar',
        delay: 0,
      },
      {
        type: 'highlight',
        content: '.undo-toast',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "I've added your flight to your calendar. Notice the undo button below - you have 15 seconds to undo if needed.",
        delay: 1000,
      },
      {
        type: 'pause',
        content: 'User sees undo toast with countdown',
        delay: 3000,
      },
      {
        type: 'ui_action',
        content: 'Hovering over undo toast pauses the timer',
        delay: 500,
      },
      {
        type: 'highlight',
        content: '.undo-toast .progress-bar.paused',
        delay: 2000,
      },
      {
        type: 'user_message',
        content: 'Undo',
        delay: 500,
      },
      {
        type: 'system_event',
        content: 'undo_triggered',
        delay: 500,
      },
      {
        type: 'assistant_response',
        content: "Done! I've removed the flight from your calendar. Would you like to search for a different flight?",
        delay: 1500,
      },
    ],
  },
];

// ============================================
// Scenario Runner Class
// ============================================

export type DemoEventCallback = (step: DemoStep, index: number) => void;

interface ScenarioRunnerOptions {
  onStepStart?: DemoEventCallback;
  onStepComplete?: DemoEventCallback;
  onScenarioComplete?: (scenario: DemoScenario) => void;
  onPause?: () => void;
  onResume?: () => void;
  speedMultiplier?: number;
}

export class ScenarioRunner {
  private currentScenario: DemoScenario | null = null;
  private currentStepIndex: number = 0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private timeoutId: NodeJS.Timeout | null = null;
  private options: ScenarioRunnerOptions;

  constructor(options: ScenarioRunnerOptions = {}) {
    this.options = {
      speedMultiplier: 1,
      ...options,
    };
  }

  start(scenarioId: string): void {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) {
      console.error(`Scenario not found: ${scenarioId}`);
      return;
    }

    this.currentScenario = scenario;
    this.currentStepIndex = 0;
    this.isRunning = true;
    this.isPaused = false;

    this.runCurrentStep();
  }

  pause(): void {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.options.onPause?.();
  }

  resume(): void {
    if (!this.isRunning || !this.isPaused) return;

    this.isPaused = false;
    this.options.onResume?.();
    this.runCurrentStep();
  }

  stop(): void {
    this.isRunning = false;
    this.isPaused = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.currentScenario = null;
    this.currentStepIndex = 0;
  }

  skip(): void {
    if (!this.isRunning || !this.currentScenario) return;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.nextStep();
  }

  getProgress(): { current: number; total: number; percentage: number } {
    if (!this.currentScenario) {
      return { current: 0, total: 0, percentage: 0 };
    }

    return {
      current: this.currentStepIndex,
      total: this.currentScenario.steps.length,
      percentage: (this.currentStepIndex / this.currentScenario.steps.length) * 100,
    };
  }

  getCurrentStep(): DemoStep | null {
    if (!this.currentScenario) return null;
    return this.currentScenario.steps[this.currentStepIndex] || null;
  }

  isActive(): boolean {
    return this.isRunning;
  }

  getPaused(): boolean {
    return this.isPaused;
  }

  private runCurrentStep(): void {
    if (!this.isRunning || this.isPaused || !this.currentScenario) return;

    const step = this.currentScenario.steps[this.currentStepIndex];
    if (!step) {
      this.completeScenario();
      return;
    }

    // Notify step start
    this.options.onStepStart?.(step, this.currentStepIndex);

    // Calculate delay with speed multiplier
    const delay = step.delay / (this.options.speedMultiplier || 1);

    // Schedule next step
    this.timeoutId = setTimeout(() => {
      this.options.onStepComplete?.(step, this.currentStepIndex);
      this.nextStep();
    }, delay);
  }

  private nextStep(): void {
    this.currentStepIndex++;
    this.runCurrentStep();
  }

  private completeScenario(): void {
    if (this.currentScenario) {
      this.options.onScenarioComplete?.(this.currentScenario);
    }
    this.stop();
  }
}

// ============================================
// Helper Functions
// ============================================

export function getScenarioById(id: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.id === id);
}

export function getAllScenarios(): DemoScenario[] {
  return DEMO_SCENARIOS;
}

export function getScenariosByTag(tag: string): DemoScenario[] {
  // Tags are implicit from scenario names/descriptions
  const tagLower = tag.toLowerCase();
  return DEMO_SCENARIOS.filter(
    (s) =>
      s.name.toLowerCase().includes(tagLower) ||
      s.description.toLowerCase().includes(tagLower)
  );
}

export function getTotalDuration(): number {
  return DEMO_SCENARIOS.reduce((sum, s) => sum + s.estimatedDuration, 0);
}

// ============================================
// Export default
// ============================================

export default ScenarioRunner;
