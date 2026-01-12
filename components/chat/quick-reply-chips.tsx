"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuickReplyChipsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
  variant?: "default" | "compact";
}

export function QuickReplyChips({
  options,
  onSelect,
  disabled,
  variant = "default",
}: QuickReplyChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => !disabled && onSelect(option)}
          disabled={disabled}
          className={cn(
            "transition-all duration-200",
            variant === "default"
              ? "px-4 py-2.5 text-sm bg-white/80 backdrop-blur-sm border-2 border-sky-200 rounded-xl text-sky-700 hover:bg-sky-50 hover:border-sky-400 shadow-sm font-medium"
              : "px-3 py-1.5 text-xs bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
}
