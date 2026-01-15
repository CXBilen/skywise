"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourStep } from "@/lib/tour-config";
import { cn } from "@/lib/utils";

interface TourTooltipProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

interface Position {
  top: number;
  left: number;
  arrowPosition: "top" | "bottom" | "left" | "right";
}

export function TourTooltip({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}: TourTooltipProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePosition = () => {
      const target = document.querySelector(`[data-tour-id="${step.target}"]`);
      if (!target || !tooltipRef.current) return;

      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const padding = step.highlightPadding || 8;
      const offset = 16; // Distance from target

      let top = 0;
      let left = 0;
      let arrowPosition: "top" | "bottom" | "left" | "right" = "top";

      switch (step.placement) {
        case "top":
          top = targetRect.top - tooltipRect.height - offset - padding;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          arrowPosition = "bottom";
          break;
        case "bottom":
          top = targetRect.bottom + offset + padding;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          arrowPosition = "top";
          break;
        case "left":
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.left - tooltipRect.width - offset - padding;
          arrowPosition = "right";
          break;
        case "right":
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.right + offset + padding;
          arrowPosition = "left";
          break;
      }

      // Keep tooltip within viewport
      const viewportPadding = 16;
      left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tooltipRect.width - viewportPadding));
      top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tooltipRect.height - viewportPadding));

      setPosition({ top, left, arrowPosition });
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(calculatePosition, 50);

    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition);
    };
  }, [step]);

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={tooltipRef}
        key={step.id}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          top: position?.top ?? 0,
          left: position?.left ?? 0,
        }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
        className={cn(
          "fixed z-[1700] w-80 p-4 rounded-xl",
          "bg-white shadow-xl shadow-slate-900/10",
          "border border-slate-200"
        )}
        style={{
          top: position?.top ?? -9999,
          left: position?.left ?? -9999,
          visibility: position ? "visible" : "hidden",
        }}
      >
        {/* Arrow */}
        <div
          className={cn(
            "absolute w-3 h-3 bg-white border-slate-200 rotate-45",
            position?.arrowPosition === "top" && "-top-1.5 left-1/2 -translate-x-1/2 border-l border-t",
            position?.arrowPosition === "bottom" && "-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b",
            position?.arrowPosition === "left" && "-left-1.5 top-1/2 -translate-y-1/2 border-l border-b",
            position?.arrowPosition === "right" && "-right-1.5 top-1/2 -translate-y-1/2 border-r border-t"
          )}
        />

        {/* Close button */}
        <button
          onClick={onSkip}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === currentStep
                  ? "w-4 bg-sky-500"
                  : "w-1.5 bg-slate-200"
              )}
            />
          ))}
          <span className="ml-2 text-xs text-slate-400">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-slate-800 mb-1.5">{step.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          {step.content}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                className="gap-1 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            <Button
              size="sm"
              onClick={onNext}
              className={cn(
                "gap-1",
                "bg-sky-500 hover:bg-sky-600 text-white"
              )}
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
