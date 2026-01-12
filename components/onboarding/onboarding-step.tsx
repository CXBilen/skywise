"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details?: string[];
  primaryAction: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  privacyNote?: string;
  currentStep: number;
  totalSteps: number;
}

export function OnboardingStep({
  icon,
  title,
  description,
  details,
  primaryAction,
  secondaryAction,
  privacyNote,
  currentStep,
  totalSteps,
}: OnboardingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
    >
      {/* Progress Dots */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === currentStep
                ? "w-8 bg-sky-500"
                : i < currentStep
                ? "bg-sky-300"
                : "bg-slate-200"
            )}
          />
        ))}
      </div>

      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-2xl shadow-sky-500/30 mb-6"
      >
        <div className="text-white">{icon}</div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
      >
        {title}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-slate-600 max-w-md mb-6"
      >
        {description}
      </motion.p>

      {/* Details */}
      {details && details.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-50 rounded-2xl p-4 mb-6 max-w-md w-full"
        >
          <ul className="text-left text-sm text-slate-600 space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Privacy Note */}
      {privacyNote && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs text-slate-400 mb-6 max-w-sm"
        >
          {privacyNote}
        </motion.p>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
      >
        <Button
          onClick={primaryAction.onClick}
          disabled={primaryAction.loading}
          size="lg"
          className="flex-1"
        >
          {primaryAction.loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            primaryAction.label
          )}
        </Button>
        {secondaryAction && (
          <Button
            variant="ghost"
            onClick={secondaryAction.onClick}
            size="lg"
            className="flex-1"
          >
            {secondaryAction.label}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
