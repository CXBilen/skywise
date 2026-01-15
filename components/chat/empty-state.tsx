"use client";

import { motion } from "framer-motion";
import { Search, Mail, Calendar, Sparkles, Play } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  onFeatureClick?: (feature: string) => void;
  onStartTour?: () => void;
  onDismiss?: () => void;
}

const features = [
  {
    id: "assistant",
    icon: Sparkles,
    title: "AI Assistant",
    description: "Chat naturally and get instant responses for all your travel needs.",
    example: "I need help",
  },
  {
    id: "search",
    icon: Search,
    title: "Find Flights",
    description: "Tell me where you want to go, and I'll find the best flights for you.",
    example: "Find a flight to San Francisco tomorrow",
  },
  {
    id: "calendar",
    icon: Calendar,
    title: "Calendar Sync",
    description: "Sync your trips with your calendar and see conflicts instantly.",
    example: "Show my upcoming trips",
  },
  {
    id: "import",
    icon: Mail,
    title: "Import from Email",
    description: "Automatically detect and save flight confirmations from your emails.",
    example: "Import flights from my email",
  },
];

export function EmptyState({
  onFeatureClick,
  onStartTour,
  onDismiss,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-start pt-4 sm:pt-8 sm:justify-center sm:min-h-[50vh]"
    >
      {/* Feature Cards Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-2xl mb-4 sm:mb-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            onClick={() => onFeatureClick?.(feature.id)}
            delay={0.1 + index * 0.1}
            variant="default"
          />
        ))}
      </div>

      {/* Tour Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <Button
          onClick={onStartTour}
          variant="outline"
          className={cn(
            "group gap-2 px-6 py-5 rounded-xl",
            "border-sky-200 hover:border-sky-300",
            "hover:bg-sky-50 transition-all"
          )}
        >
          <Play className="w-4 h-4 text-sky-600 group-hover:text-sky-700" />
          <span className="text-slate-700 group-hover:text-slate-800">
            Take a Quick Tour
          </span>
        </Button>

        <button
          onClick={onDismiss}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Skip and start
        </button>
      </motion.div>
    </motion.div>
  );
}
