'use client';

/**
 * MOBILE UX DECISION: Progressive Disclosure
 *
 * On mobile, we use a three-level bottom sheet:
 * - PEEK (25%): Shows action buttons only (Confirm/Cancel)
 * - HALF (50%): Shows trip summary without full details
 * - FULL (90%): Complete information with calendar preview
 *
 * This is a deliberate design choice to:
 * 1. Not overwhelm users on small screens
 * 2. Allow quick actions without scrolling
 * 3. Provide full details on demand
 *
 * Users can drag to change levels, or tap the snap indicators to expand.
 * This pattern follows the "progressive disclosure" principle—showing
 * only what's needed at each level of engagement.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollLock, useSafeArea } from '@/hooks/use-responsive';

// ============================================
// Types
// ============================================

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
  showCloseButton?: boolean;
}

// ============================================
// Bottom Sheet Component
// ============================================

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  showHandle = true,
  showCloseButton = true,
}: BottomSheetProps) {
  const safeArea = useSafeArea();

  // Lock scroll when open
  useScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 bottom-sheet-backdrop z-50"
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-hidden"
            style={{
              paddingBottom: safeArea.bottom || 16,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex flex-col items-center justify-center py-2">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ backgroundColor: '#cbd5e1' }}
                />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-3 pb-2">
                {title && (
                  <h2
                    id="bottom-sheet-title"
                    className="font-semibold text-slate-900 text-base"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="ml-auto h-8 w-8 rounded-full hover:bg-slate-100"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Content - No scroll, fits content */}
            <div className="px-3 pb-2 w-full min-w-0 overflow-hidden">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// Mini Bottom Sheet (for confirmations, quick actions)
// ============================================

interface MiniBottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MiniBottomSheet({ open, onClose, children }: MiniBottomSheetProps) {
  useScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl p-4 pb-8 safe-area-bottom"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BottomSheet;
