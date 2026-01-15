"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SidePanel({
  open,
  onClose,
  title,
  children,
  className,
}: SidePanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="hidden md:block fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "hidden md:flex fixed top-0 right-0 z-50 h-screen w-[400px] max-w-[90vw] bg-white/95 backdrop-blur-xl border-l border-slate-200/60 flex-col shadow-2xl overflow-hidden",
              className
            )}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between p-4 border-b border-slate-200/60">
              {title && (
                <h2 className="font-semibold text-slate-900">{title}</h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="p-3 sm:p-4 w-full min-w-0 max-w-full">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
