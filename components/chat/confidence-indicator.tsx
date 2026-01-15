"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfidenceLevel = "high" | "medium" | "low";

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  context:
    | "destination"
    | "date"
    | "time"
    | "email_extraction"
    | "calendar_check"
    | "airport";
  value?: string;
  inline?: boolean;
  showExplanation?: boolean;
}

const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  {
    icon: typeof CheckCircle2;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  high: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  medium: {
    icon: HelpCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  low: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
};

const CONTEXT_EXPLANATIONS: Record<string, Record<ConfidenceLevel, string>> = {
  destination: {
    high: "I'm confident about this destination.",
    medium: "I found a match, but there are similar options. Is this correct?",
    low: "I'm not sure about this destination. Please clarify where you'd like to go.",
  },
  date: {
    high: "Date confirmed.",
    medium: "I interpreted this as the date. Please verify.",
    low: "I couldn't parse the date clearly. Please specify the date.",
  },
  time: {
    high: "Time preference noted.",
    medium: "I understood this as your preferred time range.",
    low: "The time wasn't clear to me. Please specify morning, afternoon, or evening.",
  },
  email_extraction: {
    high: "Extracted with high confidence from your email.",
    medium: "Detected from email (some details may need review).",
    low: "Found in email, but I'm uncertain about some fields.",
  },
  calendar_check: {
    high: "Checked your calendar—no conflicts found.",
    medium: "Your calendar might have a related event around this time.",
    low: "I couldn't fully check your calendar. Please verify manually.",
  },
  airport: {
    high: "Airport confirmed.",
    medium: "Multiple airports available. I selected the main one.",
    low: "Several airports match. Please specify which airport you prefer.",
  },
};

export function ConfidenceIndicator({
  level,
  context,
  value,
  inline = false,
  showExplanation = true,
}: ConfidenceIndicatorProps) {
  const config = CONFIDENCE_CONFIG[level];
  const Icon = config.icon;
  const explanation = CONTEXT_EXPLANATIONS[context]?.[level] || "";

  if (inline) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded",
          config.bgColor,
          config.color
        )}
        title={explanation}
      >
        <Icon className="h-3 w-3" />
        {level === "high" ? "✓" : level === "medium" ? "?" : "⚠"}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start gap-2 p-2 rounded-lg border text-sm max-w-full overflow-hidden box-border",
        config.bgColor,
        config.borderColor
      )}
      style={{ maxWidth: '100%', width: '100%' }}
    >
      <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", config.color)} />
      <div className="flex-1 min-w-0 overflow-hidden">
        {value && (
          <span className={cn("font-medium break-words", config.color)}>{value}</span>
        )}
        {showExplanation && (
          <p
            className={cn(
              "text-xs mt-0.5 break-words",
              config.color.replace("600", "700")
            )}
          >
            {explanation}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Utility function for generating microcopy
export function getConfidenceMicrocopy(
  level: ConfidenceLevel,
  context: string,
  value?: string
): string {
  const base = CONTEXT_EXPLANATIONS[context]?.[level] || "";
  if (value && level !== "high") {
    return `"${value}" — ${base}`;
  }
  return base;
}

// Utility to determine confidence level from a numeric score
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}
