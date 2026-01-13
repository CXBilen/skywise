"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plane,
  Mail,
  Undo2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UndoableAction {
  id: string;
  type: "calendar_add" | "booking_confirm" | "email_import";
  title: string;
  description: string;
  timestamp: Date;
  affectedItems: string[];
  canUndo: boolean;
  expiresIn: number; // seconds
}

interface UndoActionPreviewProps {
  action: UndoableAction;
  onUndo: (id: string) => void;
  onDismiss: (id: string) => void;
  expanded?: boolean;
}

const ACTION_CONFIG = {
  calendar_add: {
    icon: Calendar,
    label: "Calendar Event Added",
    undoLabel: "Remove from calendar",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  booking_confirm: {
    icon: Plane,
    label: "Booking Confirmed",
    undoLabel: "Cancel booking",
    color: "text-sky-600",
    bgColor: "bg-sky-50",
  },
  email_import: {
    icon: Mail,
    label: "Trip Imported",
    undoLabel: "Remove imported trip",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
};

export function UndoActionPreview({
  action,
  onUndo,
  onDismiss,
  expanded = false,
}: UndoActionPreviewProps) {
  const [timeLeft, setTimeLeft] = useState(action.expiresIn);
  const [isExpanded, setIsExpanded] = useState(expanded);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss(action.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [action.id, onDismiss]);

  const config = ACTION_CONFIG[action.type];
  const Icon = config.icon;
  const progress = (timeLeft / action.expiresIn) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        "rounded-xl border overflow-hidden",
        config.bgColor,
        "border-slate-200"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              config.bgColor,
              "border border-slate-200"
            )}
          >
            <Icon className={cn("h-5 w-5", config.color)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-slate-900">{action.title}</span>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">{action.description}</p>

            {/* What can be undone */}
            <AnimatePresence>
              {isExpanded && action.affectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-2 bg-white/50 rounded-lg"
                >
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    If you undo, this will be removed:
                  </p>
                  <ul className="space-y-1">
                    {action.affectedItems.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{timeLeft}s left</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUndo(action.id)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Undo2 className="h-4 w-4 mr-1" />
              Undo
            </Button>
          </div>
        </div>

        {/* Show details toggle */}
        {action.affectedItems.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-slate-500 hover:text-slate-700"
          >
            {isExpanded ? "Hide details" : "What will be undone?"}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200">
        <motion.div
          className="h-full bg-slate-400"
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

export type { UndoableAction };
