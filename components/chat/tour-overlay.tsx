"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TourStep } from "@/lib/tour-config";

interface TourOverlayProps {
  isActive: boolean;
  step: TourStep | null;
}

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourOverlay({ isActive, step }: TourOverlayProps) {
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);

  useEffect(() => {
    if (!isActive || !step) {
      setHighlightRect(null);
      return;
    }

    const updateHighlight = () => {
      const target = document.querySelector(`[data-tour-id="${step.target}"]`);
      if (!target) {
        setHighlightRect(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const padding = step.highlightPadding || 8;

      setHighlightRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
    };

    updateHighlight();

    window.addEventListener("resize", updateHighlight);
    window.addEventListener("scroll", updateHighlight);

    return () => {
      window.removeEventListener("resize", updateHighlight);
      window.removeEventListener("scroll", updateHighlight);
    };
  }, [isActive, step]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1300] pointer-events-none"
        >
          {/* SVG mask for spotlight effect */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="tour-mask">
                {/* White = visible, black = hidden */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {highlightRect && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{
                      x: highlightRect.left,
                      y: highlightRect.top,
                      width: highlightRect.width,
                      height: highlightRect.height,
                      opacity: 1,
                    }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                    }}
                    rx="12"
                    fill="black"
                  />
                )}
              </mask>
            </defs>

            {/* Dark overlay with cutout */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(15, 23, 42, 0.6)"
              mask="url(#tour-mask)"
            />
          </svg>

          {/* Highlight border ring */}
          {highlightRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                top: highlightRect.top,
                left: highlightRect.left,
                width: highlightRect.width,
                height: highlightRect.height,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="absolute rounded-xl ring-2 ring-sky-400 ring-offset-2 ring-offset-transparent"
              style={{
                top: highlightRect.top,
                left: highlightRect.left,
                width: highlightRect.width,
                height: highlightRect.height,
                boxShadow: "0 0 0 4px rgba(14, 165, 233, 0.2), 0 0 20px rgba(14, 165, 233, 0.3)",
              }}
            />
          )}

          {/* Click blocker - allows clicking only on highlighted element */}
          <div
            className="absolute inset-0 pointer-events-auto"
            style={{
              clipPath: highlightRect
                ? `polygon(
                    0% 0%,
                    0% 100%,
                    ${highlightRect.left}px 100%,
                    ${highlightRect.left}px ${highlightRect.top}px,
                    ${highlightRect.left + highlightRect.width}px ${highlightRect.top}px,
                    ${highlightRect.left + highlightRect.width}px ${highlightRect.top + highlightRect.height}px,
                    ${highlightRect.left}px ${highlightRect.top + highlightRect.height}px,
                    ${highlightRect.left}px 100%,
                    100% 100%,
                    100% 0%
                  )`
                : undefined,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
