// Undo Manager for SkyWise
// Centralized undo management with grace periods

import { generateId } from '@/lib/utils';
import { undoGracePeriod } from '@/lib/design-tokens';
import type { UndoableAction, UndoActionType } from '@/lib/types';

// ============================================
// Types
// ============================================

interface UndoResult {
  success: boolean;
  message: string;
  action?: UndoableAction;
}

interface UndoManagerOptions {
  defaultGracePeriod?: number;
  onActionRegistered?: (action: UndoableAction) => void;
  onActionUndone?: (action: UndoableAction) => void;
  onActionExpired?: (action: UndoableAction) => void;
}

// ============================================
// Undo Handlers
// ============================================

type UndoHandler = (action: UndoableAction) => Promise<UndoResult>;

const defaultUndoHandlers: Record<UndoActionType, UndoHandler> = {
  calendar_add: async (action) => {
    // In production, this would call calendar API to remove the event
    console.log('Undoing calendar add:', action.data);
    return {
      success: true,
      message: 'Event removed from calendar',
      action,
    };
  },

  booking_confirm: async (action) => {
    // In production, this would call booking API to cancel
    console.log('Undoing booking:', action.data);
    return {
      success: true,
      message: 'Booking cancelled',
      action,
    };
  },

  email_import: async (action) => {
    // In production, this would remove the imported trip
    console.log('Undoing email import:', action.data);
    return {
      success: true,
      message: 'Imported trip removed',
      action,
    };
  },

  trip_delete: async (action) => {
    // In production, this would restore the deleted trip
    console.log('Undoing trip delete:', action.data);
    return {
      success: true,
      message: 'Trip restored',
      action,
    };
  },

  preference_change: async (action) => {
    // In production, this would revert preference changes
    console.log('Undoing preference change:', action.data);
    return {
      success: true,
      message: 'Preferences restored',
      action,
    };
  },
};

// ============================================
// Undo Manager Class
// ============================================

export class UndoManager {
  private actions: Map<string, UndoableAction> = new Map();
  private expirationTimers: Map<string, NodeJS.Timeout> = new Map();
  private undoHandlers: Record<UndoActionType, UndoHandler>;
  private options: UndoManagerOptions;

  constructor(options: UndoManagerOptions = {}) {
    this.options = {
      defaultGracePeriod: undoGracePeriod.default,
      ...options,
    };
    this.undoHandlers = { ...defaultUndoHandlers };
  }

  // Register a custom undo handler
  registerHandler(type: UndoActionType, handler: UndoHandler): void {
    this.undoHandlers[type] = handler;
  }

  // Register an undoable action
  registerAction(
    params: Omit<UndoableAction, 'id' | 'timestamp' | 'expiresAt'> & {
      gracePeriod?: number;
    }
  ): UndoableAction {
    const id = generateId();
    const timestamp = new Date();
    const gracePeriod = params.gracePeriod ?? this.options.defaultGracePeriod!;
    const expiresAt = new Date(timestamp.getTime() + gracePeriod);

    const action: UndoableAction = {
      id,
      type: params.type,
      timestamp,
      expiresAt,
      data: params.data,
      description: params.description,
      canUndo: params.canUndo,
    };

    this.actions.set(id, action);

    // Set expiration timer
    const timer = setTimeout(() => {
      this.handleExpiration(id);
    }, gracePeriod);

    this.expirationTimers.set(id, timer);

    // Notify listeners
    this.options.onActionRegistered?.(action);

    return action;
  }

  // Undo an action
  async undo(actionId: string): Promise<UndoResult> {
    const action = this.actions.get(actionId);

    if (!action) {
      return {
        success: false,
        message: 'Action not found or already expired',
      };
    }

    if (!action.canUndo) {
      return {
        success: false,
        message: 'This action cannot be undone',
      };
    }

    // Check if action has expired
    if (new Date() > action.expiresAt) {
      this.removeAction(actionId);
      return {
        success: false,
        message: 'The undo window has expired',
      };
    }

    // Execute the undo handler
    const handler = this.undoHandlers[action.type];
    if (!handler) {
      return {
        success: false,
        message: 'No undo handler registered for this action type',
      };
    }

    try {
      const result = await handler(action);

      if (result.success) {
        this.removeAction(actionId);
        this.options.onActionUndone?.(action);
      }

      return result;
    } catch (error) {
      console.error('Undo failed:', error);
      return {
        success: false,
        message: 'Failed to undo action. Please try again.',
      };
    }
  }

  // Undo all active actions
  async undoAll(): Promise<{ success: boolean; results: UndoResult[] }> {
    const activeActions = this.getActiveUndos();
    const results: UndoResult[] = [];

    for (const action of activeActions) {
      const result = await this.undo(action.id);
      results.push(result);
    }

    const allSuccessful = results.every((r) => r.success);

    return {
      success: allSuccessful,
      results,
    };
  }

  // Get all active (non-expired) undoable actions
  getActiveUndos(): UndoableAction[] {
    const now = new Date();
    return Array.from(this.actions.values())
      .filter((action) => action.canUndo && action.expiresAt > now)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Extend the grace period for an action
  extendGracePeriod(actionId: string, additionalMs: number = undoGracePeriod.extended - undoGracePeriod.default): void {
    const action = this.actions.get(actionId);
    if (!action) return;

    // Cancel existing timer
    const existingTimer = this.expirationTimers.get(actionId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Update expiration time
    action.expiresAt = new Date(action.expiresAt.getTime() + additionalMs);

    // Set new timer
    const remainingTime = action.expiresAt.getTime() - Date.now();
    const timer = setTimeout(() => {
      this.handleExpiration(actionId);
    }, remainingTime);

    this.expirationTimers.set(actionId, timer);
  }

  // Pause the grace period (e.g., when user hovers over toast)
  pauseGracePeriod(actionId: string): { remainingMs: number } | null {
    const action = this.actions.get(actionId);
    if (!action) return null;

    const remainingMs = action.expiresAt.getTime() - Date.now();

    // Cancel existing timer
    const existingTimer = this.expirationTimers.get(actionId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.expirationTimers.delete(actionId);
    }

    return { remainingMs };
  }

  // Resume the grace period
  resumeGracePeriod(actionId: string, remainingMs: number): void {
    const action = this.actions.get(actionId);
    if (!action) return;

    // Update expiration time
    action.expiresAt = new Date(Date.now() + remainingMs);

    // Set new timer
    const timer = setTimeout(() => {
      this.handleExpiration(actionId);
    }, remainingMs);

    this.expirationTimers.set(actionId, timer);
  }

  // Get time remaining for an action
  getTimeRemaining(actionId: string): number | null {
    const action = this.actions.get(actionId);
    if (!action) return null;

    const remaining = action.expiresAt.getTime() - Date.now();
    return Math.max(0, remaining);
  }

  // Get progress percentage (0-100)
  getProgress(actionId: string): number | null {
    const action = this.actions.get(actionId);
    if (!action) return null;

    const totalTime = action.expiresAt.getTime() - action.timestamp.getTime();
    const remaining = this.getTimeRemaining(actionId) || 0;

    return (remaining / totalTime) * 100;
  }

  // Dismiss an action without undoing
  dismiss(actionId: string): void {
    this.removeAction(actionId);
  }

  // Clear all actions
  clearAll(): void {
    for (const id of this.actions.keys()) {
      this.removeAction(id);
    }
  }

  // Private methods

  private handleExpiration(actionId: string): void {
    const action = this.actions.get(actionId);
    if (action) {
      this.options.onActionExpired?.(action);
      this.removeAction(actionId);
    }
  }

  private removeAction(actionId: string): void {
    this.actions.delete(actionId);

    const timer = this.expirationTimers.get(actionId);
    if (timer) {
      clearTimeout(timer);
      this.expirationTimers.delete(actionId);
    }
  }
}

// ============================================
// Singleton Instance
// ============================================

let undoManagerInstance: UndoManager | null = null;

export function getUndoManager(): UndoManager {
  if (!undoManagerInstance) {
    undoManagerInstance = new UndoManager();
  }
  return undoManagerInstance;
}

export function resetUndoManager(): void {
  if (undoManagerInstance) {
    undoManagerInstance.clearAll();
    undoManagerInstance = null;
  }
}

// ============================================
// React Hook
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseUndoOptions {
  onUndo?: (action: UndoableAction) => void;
  onExpire?: (action: UndoableAction) => void;
}

export function useUndo(options: UseUndoOptions = {}) {
  const [activeActions, setActiveActions] = useState<UndoableAction[]>([]);
  const managerRef = useRef<UndoManager | null>(null);

  useEffect(() => {
    managerRef.current = getUndoManager();

    // Set up callbacks
    const originalOnUndone = managerRef.current['options'].onActionUndone;
    const originalOnExpired = managerRef.current['options'].onActionExpired;

    managerRef.current['options'].onActionRegistered = (action) => {
      setActiveActions((prev) => [action, ...prev]);
    };

    managerRef.current['options'].onActionUndone = (action) => {
      setActiveActions((prev) => prev.filter((a) => a.id !== action.id));
      options.onUndo?.(action);
      originalOnUndone?.(action);
    };

    managerRef.current['options'].onActionExpired = (action) => {
      setActiveActions((prev) => prev.filter((a) => a.id !== action.id));
      options.onExpire?.(action);
      originalOnExpired?.(action);
    };

    // Initial state
    setActiveActions(managerRef.current.getActiveUndos());

    return () => {
      // Restore original callbacks
      if (managerRef.current) {
        managerRef.current['options'].onActionUndone = originalOnUndone;
        managerRef.current['options'].onActionExpired = originalOnExpired;
      }
    };
  }, [options.onUndo, options.onExpire]);

  const registerAction = useCallback(
    (params: Parameters<UndoManager['registerAction']>[0]) => {
      return managerRef.current?.registerAction(params);
    },
    []
  );

  const undo = useCallback(async (actionId: string) => {
    return managerRef.current?.undo(actionId);
  }, []);

  const undoAll = useCallback(async () => {
    return managerRef.current?.undoAll();
  }, []);

  const dismiss = useCallback((actionId: string) => {
    managerRef.current?.dismiss(actionId);
    setActiveActions((prev) => prev.filter((a) => a.id !== actionId));
  }, []);

  const extendGracePeriod = useCallback((actionId: string, additionalMs?: number) => {
    managerRef.current?.extendGracePeriod(actionId, additionalMs);
  }, []);

  const pauseGracePeriod = useCallback((actionId: string) => {
    return managerRef.current?.pauseGracePeriod(actionId);
  }, []);

  const resumeGracePeriod = useCallback((actionId: string, remainingMs: number) => {
    managerRef.current?.resumeGracePeriod(actionId, remainingMs);
  }, []);

  const getTimeRemaining = useCallback((actionId: string) => {
    return managerRef.current?.getTimeRemaining(actionId);
  }, []);

  const getProgress = useCallback((actionId: string) => {
    return managerRef.current?.getProgress(actionId);
  }, []);

  return {
    activeActions,
    registerAction,
    undo,
    undoAll,
    dismiss,
    extendGracePeriod,
    pauseGracePeriod,
    resumeGracePeriod,
    getTimeRemaining,
    getProgress,
    hasActiveUndos: activeActions.length > 0,
  };
}

export type { UndoResult, UndoManagerOptions, UndoHandler };
