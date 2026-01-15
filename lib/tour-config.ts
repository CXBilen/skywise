export interface TourStep {
  id: string;
  target: string; // data-tour-id attribute value
  title: string;
  content: string;
  placement: "top" | "bottom" | "left" | "right";
  highlightPadding?: number;
}

export interface TourConfig {
  id: string;
  name: string;
  steps: TourStep[];
}

export const chatTour: TourConfig = {
  id: "chat-tour",
  name: "Chat Usage Tour",
  steps: [
    {
      id: "quick-replies",
      target: "quick-replies",
      title: "Quick Actions",
      content:
        "Click these buttons to quickly search for flights, import from email, or view your trips.",
      placement: "top",
      highlightPadding: 8,
    },
    {
      id: "chat-input",
      target: "chat-input",
      title: "Message Input",
      content:
        "Type anything here. For example: 'Find a flight to NYC tomorrow' or 'Show my upcoming trips'.",
      placement: "top",
      highlightPadding: 4,
    },
    {
      id: "send-button",
      target: "send-button",
      title: "Send",
      content:
        "Click this button to send your message, or press Enter on your keyboard.",
      placement: "left",
      highlightPadding: 4,
    },
    {
      id: "nav-trips",
      target: "nav-trips",
      title: "My Trips",
      content:
        "View all your trips here, including past and upcoming flights.",
      placement: "bottom",
      highlightPadding: 4,
    },
  ],
};

// Storage keys
export const TOUR_STORAGE_KEY = "skywise-completed-tours";

// Helper to check if tour was completed
export function isTourCompleted(tourId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) return false;
    const tours: string[] = JSON.parse(completed);
    return tours.includes(tourId);
  } catch {
    return false;
  }
}

// Helper to mark tour as completed
export function markTourCompleted(tourId: string): void {
  if (typeof window === "undefined") return;

  try {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    const tours: string[] = completed ? JSON.parse(completed) : [];
    if (!tours.includes(tourId)) {
      tours.push(tourId);
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tours));
    }
  } catch {
    // Ignore localStorage errors
  }
}

// Helper to reset tour (for testing)
export function resetTour(tourId: string): void {
  if (typeof window === "undefined") return;

  try {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) return;
    const tours: string[] = JSON.parse(completed);
    const filtered = tours.filter((id) => id !== tourId);
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Ignore localStorage errors
  }
}
