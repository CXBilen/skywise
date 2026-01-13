'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo, useAnimation } from 'framer-motion';
import { X, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useScrollLock, useSafeArea, useKeyboard } from '@/hooks/use-responsive';
import { components } from '@/lib/design-tokens';

// ============================================
// Types
// ============================================

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  defaultSnapPoint?: number;
  showHandle?: boolean;
  showCloseButton?: boolean;
  onSnapChange?: (snapPoint: number) => void;
}

// ============================================
// Default snap points (percentage of viewport height)
// ============================================

const DEFAULT_SNAP_POINTS = [0.25, 0.5, 0.9];

// ============================================
// Bottom Sheet Component
// ============================================

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  snapPoints = DEFAULT_SNAP_POINTS,
  defaultSnapPoint,
  showHandle = true,
  showCloseButton = true,
  onSnapChange,
}: BottomSheetProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const controls = useAnimation();
  const [currentSnapIndex, setCurrentSnapIndex] = useState(
    defaultSnapPoint !== undefined
      ? snapPoints.indexOf(defaultSnapPoint)
      : Math.floor(snapPoints.length / 2)
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  const safeArea = useSafeArea();
  const keyboard = useKeyboard();

  // Lock scroll when open
  useScrollLock(open);

  // Update viewport height
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Handle keyboard
  useEffect(() => {
    if (keyboard.isOpen && open) {
      // Snap to highest point when keyboard opens
      const highestIndex = snapPoints.length - 1;
      setCurrentSnapIndex(highestIndex);
      controls.start({ y: getSnapY(highestIndex) });
    }
  }, [keyboard.isOpen, open, snapPoints.length, controls]);

  const getSnapY = useCallback((index: number) => {
    const snapPoint = snapPoints[index] || 0.5;
    return viewportHeight * (1 - snapPoint);
  }, [snapPoints, viewportHeight]);

  const findClosestSnapPoint = useCallback((y: number): number => {
    let closestIndex = 0;
    let closestDistance = Infinity;

    snapPoints.forEach((_, index) => {
      const snapY = getSnapY(index);
      const distance = Math.abs(y - snapY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [snapPoints, getSnapY]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentY = getSnapY(currentSnapIndex) + info.offset.y;
      const velocity = info.velocity.y;

      // Fast swipe down to close
      if (velocity > 500 && currentSnapIndex === 0) {
        onClose();
        return;
      }

      // Fast swipe down to go to lower snap point
      if (velocity > 300 && currentSnapIndex > 0) {
        const newIndex = currentSnapIndex - 1;
        setCurrentSnapIndex(newIndex);
        controls.start({ y: getSnapY(newIndex) });
        onSnapChange?.(snapPoints[newIndex]);
        return;
      }

      // Fast swipe up to go to higher snap point
      if (velocity < -300 && currentSnapIndex < snapPoints.length - 1) {
        const newIndex = currentSnapIndex + 1;
        setCurrentSnapIndex(newIndex);
        controls.start({ y: getSnapY(newIndex) });
        onSnapChange?.(snapPoints[newIndex]);
        return;
      }

      // Find closest snap point
      const closestIndex = findClosestSnapPoint(currentY);

      // If dragged below the lowest snap point significantly, close
      if (currentY > viewportHeight * 0.9) {
        onClose();
        return;
      }

      setCurrentSnapIndex(closestIndex);
      controls.start({ y: getSnapY(closestIndex) });
      onSnapChange?.(snapPoints[closestIndex]);
    },
    [currentSnapIndex, getSnapY, findClosestSnapPoint, controls, onClose, snapPoints, onSnapChange, viewportHeight]
  );

  // Animate to current snap point when opening
  useEffect(() => {
    if (open) {
      const initialIndex = defaultSnapPoint !== undefined
        ? snapPoints.indexOf(defaultSnapPoint)
        : Math.floor(snapPoints.length / 2);

      setCurrentSnapIndex(initialIndex >= 0 ? initialIndex : Math.floor(snapPoints.length / 2));
      controls.start({ y: getSnapY(initialIndex >= 0 ? initialIndex : Math.floor(snapPoints.length / 2)) });
    }
  }, [open, defaultSnapPoint, snapPoints, controls, getSnapY]);

  const currentSnapPoint = snapPoints[currentSnapIndex] || 0.5;
  const sheetHeight = viewportHeight * currentSnapPoint;

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
            ref={constraintsRef}
            initial={{ y: viewportHeight }}
            animate={controls}
            exit={{ y: viewportHeight }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: getSnapY(snapPoints.length - 1), bottom: viewportHeight }}
            dragElastic={{ top: 0.1, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-hidden touch-none"
            style={{
              height: viewportHeight,
              paddingBottom: safeArea.bottom,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div
                className="flex flex-col items-center justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div
                  className="w-12 h-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: '#cbd5e1' }}
                />
                <span className="sr-only">Drag to resize</span>
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-200/60">
                {title && (
                  <h2
                    id="bottom-sheet-title"
                    className="font-semibold text-slate-900 text-lg"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="ml-auto h-9 w-9 rounded-full hover:bg-slate-100"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}

            {/* Snap Point Indicator */}
            <div className="flex justify-center gap-1.5 py-2">
              {snapPoints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSnapIndex(index);
                    controls.start({ y: getSnapY(index) });
                    onSnapChange?.(snapPoints[index]);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSnapIndex
                      ? 'bg-sky-500'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Snap to ${Math.round(snapPoints[index] * 100)}%`}
                />
              ))}
            </div>

            {/* Content */}
            <ScrollArea
              className="h-full"
              style={{
                maxHeight: `calc(${sheetHeight}px - ${showHandle ? '48px' : '0px'} - ${title || showCloseButton ? '56px' : '0px'} - 32px - ${safeArea.bottom}px)`,
              }}
            >
              <div className="p-4 pb-8">
                {children}
              </div>
            </ScrollArea>
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
