"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "h-full bg-white/80 backdrop-blur-xl border-l border-slate-200/60 flex flex-col",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
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
          <ScrollArea className="flex-1">
            <div className="p-4">{children}</div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
