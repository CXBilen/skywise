"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";

interface QuickReplyChipsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
  variant?: "default" | "compact" | "highlight";
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
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 w-full min-w-0 max-w-[calc(100vw-4rem)] sm:max-w-full box-border"
    >
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.2 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => !disabled && onSelect(option)}
          disabled={disabled}
          className={cn(
            "group relative transition-all duration-200 flex-shrink-0 whitespace-nowrap",
            variant === "default" &&
              "px-4 py-2.5 text-sm bg-white/90 backdrop-blur-sm border border-sky-200/80 rounded-xl text-sky-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:border-sky-400 shadow-sm hover:shadow-md hover:shadow-sky-100/50 font-medium",
            variant === "compact" &&
              "px-3 py-1.5 text-xs bg-slate-100/80 rounded-full text-slate-600 hover:bg-slate-200",
            variant === "highlight" &&
              "px-4 py-2.5 text-sm bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 font-medium",
            disabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:y-0"
          )}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            {index === 0 && variant === "default" && (
              <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            )}
            {option}
            {variant === "highlight" && (
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            )}
          </span>

          {/* Hover glow effect */}
          {variant === "default" && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/0 via-sky-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}
