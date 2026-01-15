"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Plane, Mail, Calendar, MapPin, Check } from "lucide-react";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import { AppHeader } from "@/components/layout/app-header";
import Link from "next/link";

type Step = "welcome" | "email" | "calendar" | "preferences" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [isLoading, setIsLoading] = useState(false);

  const steps: Step[] = ["welcome", "email", "calendar", "preferences", "complete"];
  const currentIndex = steps.indexOf(currentStep);

  const simulateConnection = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleEmailConnect = async () => {
    await simulateConnection();
    setCurrentStep("calendar");
  };

  const handleCalendarConnect = async () => {
    await simulateConnection();
    setCurrentStep("preferences");
  };

  const handlePreferencesComplete = async () => {
    await simulateConnection();
    setCurrentStep("complete");
  };

  const handleComplete = () => {
    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 flex flex-col">
      <AppHeader />

      <main className="flex-1 pt-24">
        <AnimatePresence mode="wait">
          {currentStep === "welcome" && (
          <OnboardingStep
            key="welcome"
            icon={<Plane className="h-10 w-10" />}
            title="Welcome to SkyWise"
            description="Your AI travel assistant that understands your schedule and helps you fly smarter."
            details={[
              "Search and book flights with natural language",
              "Automatically import trips from your email",
              "Detect calendar conflicts before they happen",
              "Always in control—review before any action",
            ]}
            primaryAction={{
              label: "Get Started",
              onClick: () => setCurrentStep("email"),
            }}
            currentStep={0}
            totalSteps={5}
          />
        )}

        {currentStep === "email" && (
          <OnboardingStep
            key="email"
            icon={<Mail className="h-10 w-10" />}
            title="Connect Your Email"
            description="I'll scan for flight confirmations so you don't have to copy-paste details manually."
            details={[
              "Read-only access—I can't send or delete emails",
              "Only looks for flight-related emails",
              "You review everything before it's added",
              "Disconnect anytime in settings",
            ]}
            privacyNote="Your email data is processed securely and never shared. View our privacy policy."
            primaryAction={{
              label: "Connect Email",
              onClick: handleEmailConnect,
              loading: isLoading,
            }}
            secondaryAction={{
              label: "Skip for now",
              onClick: () => setCurrentStep("calendar"),
            }}
            currentStep={1}
            totalSteps={5}
          />
        )}

        {currentStep === "calendar" && (
          <OnboardingStep
            key="calendar"
            icon={<Calendar className="h-10 w-10" />}
            title="Connect Your Calendar"
            description="I'll check for conflicts and add trips—but only with your explicit permission."
            details={[
              "See your schedule to avoid conflicts",
              "Add flight events with one-click confirmation",
              "I'll always ask before adding anything",
              "Undo any calendar change instantly",
            ]}
            privacyNote="Calendar access is used only for conflict detection and trip management."
            primaryAction={{
              label: "Connect Calendar",
              onClick: handleCalendarConnect,
              loading: isLoading,
            }}
            secondaryAction={{
              label: "Skip for now",
              onClick: () => setCurrentStep("preferences"),
            }}
            currentStep={2}
            totalSteps={5}
          />
        )}

        {currentStep === "preferences" && (
          <OnboardingStep
            key="preferences"
            icon={<MapPin className="h-10 w-10" />}
            title="Set Your Preferences"
            description="Help me find better flights for you by sharing a few preferences."
            details={[
              "Home airport for faster searches",
              "Seat preference (aisle, window, or no preference)",
              "Favorite airlines for priority results",
              "You can change these anytime in settings",
            ]}
            primaryAction={{
              label: "Save Preferences",
              onClick: handlePreferencesComplete,
              loading: isLoading,
            }}
            secondaryAction={{
              label: "Skip for now",
              onClick: () => setCurrentStep("complete"),
            }}
            currentStep={3}
            totalSteps={5}
          />
        )}

        {currentStep === "complete" && (
          <OnboardingStep
            key="complete"
            icon={<Check className="h-10 w-10" />}
            title="You're All Set!"
            description="Start planning your next trip with your AI travel assistant."
            details={[
              'Try saying "I need to fly to Chicago next week"',
              "I'll check your calendar for conflicts automatically",
              "You review and confirm before anything happens",
              "Ask me anything about your travel plans",
            ]}
            primaryAction={{
              label: "Start Chatting",
              onClick: handleComplete,
            }}
            currentStep={4}
            totalSteps={5}
          />
        )}
      </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-sky-500" />
              <span className="font-semibold text-slate-900">SkyWise</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-slate-500 text-center">
              <div className="flex items-center gap-4">
                <Link href="/presentation" className="hover:text-sky-500 transition-colors">Presentation</Link>
                <span>•</span>
                <Link href="/docs" className="hover:text-sky-500 transition-colors">Documentation</Link>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">Made for Efsora Labs by Cem Bilen</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
