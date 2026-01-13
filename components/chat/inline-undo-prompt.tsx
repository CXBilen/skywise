"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Undo2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InlineUndoPromptProps {
  action: string;
  description: string;
  onUndo: () => void;
  onConfirm: () => void;
  timeRemaining: number;
  undoExplanation?: string;
}

export function InlineUndoPrompt({
  action,
  description,
  onUndo,
  onConfirm,
  timeRemaining: initialTime,
  undoExplanation,
}: InlineUndoPromptProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onConfirm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium text-slate-700">{action}</span>
        </div>
        <span className="text-xs text-slate-400">
          {isPaused ? (
            <span className="text-amber-500">Paused</span>
          ) : (
            `${timeRemaining}s to change`
          )}
        </span>
      </div>

      <p className="text-xs text-slate-500 mt-1">{description}</p>

      {undoExplanation && (
        <p className="text-xs text-slate-400 mt-1 italic">
          Undo will: {undoExplanation}
        </p>
      )}

      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          className="flex-1 text-xs"
        >
          <Undo2 className="h-3 w-3 mr-1" />
          Undo this
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onConfirm}
          className="text-xs text-slate-500"
        >
          Keep it
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${isPaused ? "bg-amber-400" : "bg-slate-400"}`}
          initial={{ width: "100%" }}
          animate={{ width: `${(timeRemaining / initialTime) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
