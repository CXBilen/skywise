"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MisunderstandingScenario } from "@/lib/ai/misunderstanding-scenarios";

interface RecoveryPromptProps {
  scenario: MisunderstandingScenario;
  onSelectOption: (option: string) => void;
  onConfirmOriginal: () => void;
}

export function RecoveryPrompt({
  scenario,
  onSelectOption,
  onConfirmOriginal,
}: RecoveryPromptProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const confidenceLevel =
    scenario.aiInterpretation.confidence > 0.8
      ? "high"
      : scenario.aiInterpretation.confidence > 0.6
        ? "medium"
        : "low";

  const confidenceStyles = {
    high: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-orange-100 text-orange-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 overflow-hidden"
    >
      {/* Header - What AI understood */}
      <div className="p-4 border-b border-amber-200/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">
              Let me confirm I understood correctly
            </p>
            <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-wide">
                  {scenario.aiInterpretation.field}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    confidenceStyles[confidenceLevel]
                  )}
                >
                  {Math.round(scenario.aiInterpretation.confidence * 100)}%
                  confident
                </span>
              </div>
              <p className="text-base font-semibold text-slate-900 mt-1">
                {scenario.aiInterpretation.understood}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-amber-700 mb-3">Is this what you meant?</p>

        {/* Confirm original interpretation */}
        <Button
          variant="outline"
          className="w-full justify-between bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700"
          onClick={onConfirmOriginal}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Yes, that's correct
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Alternative options */}
        {scenario.recoveryOptions.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-between bg-white hover:bg-slate-50"
            onClick={() => onSelectOption(option)}
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-slate-400" />
              {option}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Button>
        ))}
      </div>

      {/* Explanation toggle */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {showExplanation ? "Hide" : "Why am I asking?"}
        </button>

        <AnimatePresence>
          {showExplanation && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-amber-700 mt-2 p-2 bg-amber-100/50 rounded-lg"
            >
              {scenario.explanation}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
