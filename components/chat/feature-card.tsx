"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  variant?: "default" | "highlight";
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  onClick,
  variant = "default",
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative w-full p-3 sm:p-5 rounded-xl sm:rounded-2xl text-left",
        "transition-all duration-300",
        "border border-slate-200/80",
        "bg-white/80 backdrop-blur-sm",
        "hover:bg-gradient-to-br hover:from-sky-50/80 hover:to-white",
        "hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50",
        variant === "highlight" && [
          "bg-gradient-to-br from-sky-50 to-blue-50",
          "border-sky-200",
          "shadow-md shadow-sky-100/30",
        ]
      )}
    >
      {/* Icon Container */}
      <motion.div
        className={cn(
          "w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4",
          "bg-gradient-to-br from-sky-100 to-sky-50",
          "group-hover:from-sky-200 group-hover:to-sky-100",
          "transition-all duration-300",
          variant === "highlight" && "from-sky-200 to-sky-100"
        )}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className={cn(
          "w-4 h-4 sm:w-6 sm:h-6 text-sky-600",
          "group-hover:text-sky-700 transition-colors"
        )} />
      </motion.div>

      {/* Content */}
      <h3 className={cn(
        "font-semibold text-slate-800 mb-0.5 sm:mb-1.5 text-sm sm:text-base",
        "group-hover:text-sky-900 transition-colors"
      )}>
        {title}
      </h3>

      <p className={cn(
        "text-xs sm:text-sm text-slate-500 leading-snug sm:leading-relaxed line-clamp-2",
        "group-hover:text-slate-600 transition-colors"
      )}>
        {description}
      </p>

      {/* Hover Arrow */}
      <motion.div
        className="absolute top-3 right-3 sm:top-5 sm:right-5 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: -5 }}
        whileHover={{ x: 0 }}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.div>

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-400/0 to-blue-400/0 group-hover:from-sky-400/5 group-hover:to-blue-400/5 transition-all duration-300 pointer-events-none" />
    </motion.button>
  );
}
