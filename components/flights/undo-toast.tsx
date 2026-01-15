'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, Check, X, ChevronDown, ChevronUp, Calendar, Plane, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { UndoableAction, UndoActionType } from '@/lib/types';
import { undoGracePeriod } from '@/lib/design-tokens';

// ============================================
// Types
// ============================================

interface UndoToastProps {
  message: string;
  description?: string;
  duration?: number;
  onUndo: () => void | Promise<void>;
  onDismiss: () => void;
  show: boolean;
  actionType?: UndoActionType;
}

interface MultiUndoToastProps {
  actions: UndoableAction[];
  onUndo: (actionId: string) => void | Promise<void>;
  onUndoAll: () => void | Promise<void>;
  onDismiss: (actionId: string) => void;
  onDismissAll: () => void;
}

// ============================================
// Action Type Icons
// ============================================

const ACTION_ICONS: Record<UndoActionType, React.ElementType> = {
  calendar_add: Calendar,
  booking_confirm: Plane,
  email_import: Mail,
  trip_delete: Trash2,
  preference_change: Check,
};

const ACTION_COLORS: Record<UndoActionType, { bg: string; icon: string }> = {
  calendar_add: { bg: 'bg-emerald-500/20', icon: 'text-emerald-400' },
  booking_confirm: { bg: 'bg-sky-500/20', icon: 'text-sky-400' },
  email_import: { bg: 'bg-purple-500/20', icon: 'text-purple-400' },
  trip_delete: { bg: 'bg-red-500/20', icon: 'text-red-400' },
  preference_change: { bg: 'bg-slate-500/20', icon: 'text-slate-400' },
};

// ============================================
// Single Undo Toast
// ============================================

export function UndoToast({
  message,
  description,
  duration = undoGracePeriod.default,
  onUndo,
  onDismiss,
  show,
  actionType = 'calendar_add',
}: UndoToastProps) {
  const [progress, setProgress] = useState(100);
  const [isUndoing, setIsUndoing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pausedProgressRef = useRef(100);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const onDismissRef = useRef(onDismiss);

  // Keep onDismiss ref updated
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // Track mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Progress timer
  useEffect(() => {
    if (!show) {
      setProgress(100);
      return;
    }

    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100);
        if (newProgress <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Only call onDismiss if component is still mounted
          if (isMountedRef.current) {
            // Use setTimeout to avoid state update during render
            setTimeout(() => {
              if (isMountedRef.current) {
                onDismissRef.current();
              }
            }, 0);
          }
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [show, duration, isPaused]);

  const handleMouseEnter = useCallback(() => {
    pausedProgressRef.current = progress;
    setIsPaused(true);
  }, [progress]);

  const handleMouseLeave = useCallback(() => {
    // Extend time when unpausing (add 3 seconds)
    const extendedProgress = Math.min(
      100,
      pausedProgressRef.current + (3000 / duration) * 100
    );
    setProgress(extendedProgress);
    setIsPaused(false);
  }, [duration]);

  const handleUndo = async () => {
    setIsUndoing(true);
    try {
      await onUndo();
    } finally {
      setIsUndoing(false);
    }
  };

  const Icon = ACTION_ICONS[actionType] || Check;
  const colors = ACTION_COLORS[actionType] || ACTION_COLORS.calendar_add;
  const remainingSeconds = Math.ceil((progress / 100) * (duration / 1000));

  // For SSR safety, only render portal on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toastContent = (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-50 sm:w-full sm:max-w-md"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="alert"
          aria-live="polite"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-3 sm:p-4 flex items-start sm:items-center gap-2 sm:gap-3">
              {/* Icon */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${colors.icon}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium line-clamp-2 sm:truncate">{message}</p>
                {description && (
                  <p className="text-xs text-slate-400 truncate">{description}</p>
                )}
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                  {isPaused ? (
                    <span className="text-amber-400">⏸ Paused</span>
                  ) : (
                    <span>{remainingSeconds}s to undo</span>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={isUndoing}
                  className="text-white hover:bg-white/10 h-8 px-2 sm:px-3 text-xs sm:text-sm"
                  aria-label="Undo action"
                >
                  {isUndoing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Undo2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Undo</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDismiss}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400 hover:text-white hover:bg-white/10"
                  aria-label="Dismiss"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-1 bg-slate-700">
              <motion.div
                className={`absolute inset-y-0 left-0 ${isPaused ? 'bg-amber-500' : 'bg-sky-500'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render via portal to escape any container constraints
  if (!mounted) return null;
  return createPortal(toastContent, document.body);
}

// ============================================
// Multi-Action Undo Toast
// ============================================

export function MultiUndoToast({
  actions,
  onUndo,
  onUndoAll,
  onDismiss,
  onDismissAll,
}: MultiUndoToastProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUndoingAll, setIsUndoingAll] = useState(false);
  const [undoingIds, setUndoingIds] = useState<Set<string>>(new Set());

  if (actions.length === 0) {
    return null;
  }

  // If only one action, use single toast
  if (actions.length === 1) {
    return (
      <UndoToast
        message={actions[0].description}
        show={true}
        onUndo={() => onUndo(actions[0].id)}
        onDismiss={() => onDismiss(actions[0].id)}
        actionType={actions[0].type}
        duration={actions[0].expiresAt.getTime() - Date.now()}
      />
    );
  }

  const handleUndoAll = async () => {
    setIsUndoingAll(true);
    try {
      await onUndoAll();
    } finally {
      setIsUndoingAll(false);
    }
  };

  const handleUndoSingle = async (actionId: string) => {
    setUndoingIds((prev) => new Set(prev).add(actionId));
    try {
      await onUndo(actionId);
    } finally {
      setUndoingIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-4 right-4 z-50 w-full max-w-md"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sky-400 font-semibold text-sm">
              {actions.length}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {actions.length} actions completed
            </p>
            <p className="text-xs text-slate-400">
              Click to expand and manage
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndoAll}
              disabled={isUndoingAll}
              className="text-white hover:bg-white/10"
            >
              {isUndoingAll ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Undo2 className="h-4 w-4 mr-1" />
                  Undo All
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onDismissAll}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-700/50"
            >
              <div className="max-h-60 overflow-y-auto">
                {actions.map((action) => {
                  const Icon = ACTION_ICONS[action.type] || Check;
                  const colors = ACTION_COLORS[action.type] || ACTION_COLORS.calendar_add;
                  const isUndoing = undoingIds.has(action.id);

                  return (
                    <div
                      key={action.id}
                      className="p-3 flex items-center gap-3 border-b border-slate-700/30 last:border-0"
                    >
                      <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${colors.icon}`} />
                      </div>

                      <p className="flex-1 text-sm text-slate-300 truncate">
                        {action.description}
                      </p>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUndoSingle(action.id)}
                          disabled={isUndoing}
                          className="h-7 px-2 text-xs text-slate-400 hover:text-white hover:bg-white/10"
                        >
                          {isUndoing ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="h-3 w-3 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            'Undo'
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDismiss(action.id)}
                          className="h-7 w-7 text-slate-500 hover:text-white hover:bg-white/10"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator for first expiring action */}
        <Progress
          value={calculateFirstExpiringProgress(actions)}
          className="h-1 rounded-none bg-slate-700"
        />
      </div>
    </motion.div>
  );
}

// ============================================
// Helpers
// ============================================

function calculateFirstExpiringProgress(actions: UndoableAction[]): number {
  if (actions.length === 0) return 0;

  const now = Date.now();
  const firstExpiring = actions.reduce((earliest, action) =>
    action.expiresAt < earliest.expiresAt ? action : earliest
  );

  const totalTime = firstExpiring.expiresAt.getTime() - firstExpiring.timestamp.getTime();
  const remaining = firstExpiring.expiresAt.getTime() - now;

  return Math.max(0, (remaining / totalTime) * 100);
}

export default UndoToast;
