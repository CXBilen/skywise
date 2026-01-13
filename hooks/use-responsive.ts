'use client';

import { useState, useEffect, useCallback } from 'react';
import { breakpoints } from '@/lib/design-tokens';

// ============================================
// Types
// ============================================

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isTouchDevice: boolean;
}

interface MediaQueryHookOptions {
  defaultState?: boolean;
}

// ============================================
// Media Query Hook
// ============================================

export function useMediaQuery(
  query: string,
  options: MediaQueryHookOptions = {}
): boolean {
  const { defaultState = false } = options;
  const [matches, setMatches] = useState(defaultState);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

// ============================================
// Responsive Hook
// ============================================

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLargeDesktop: false,
    width: 1024,
    height: 768,
    orientation: 'landscape',
    isTouchDevice: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isMobile: width < parseInt(breakpoints.md),
        isTablet: width >= parseInt(breakpoints.md) && width < parseInt(breakpoints.lg),
        isDesktop: width >= parseInt(breakpoints.lg),
        isLargeDesktop: width >= parseInt(breakpoints.xl),
        width,
        height,
        orientation: width > height ? 'landscape' : 'portrait',
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      });
    };

    updateState();

    window.addEventListener('resize', updateState);
    window.addEventListener('orientationchange', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
      window.removeEventListener('orientationchange', updateState);
    };
  }, []);

  return state;
}

// ============================================
// Breakpoint Hooks
// ============================================

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${parseInt(breakpoints.md) - 1}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.lg})`);
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.xl})`);
}

// ============================================
// Safe Area Hook
// ============================================

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof CSS === 'undefined') return;

    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);

      setInsets({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0') || 0,
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0') || 0,
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0') || 0,
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0') || 0,
      });
    };

    // Set CSS variables for safe area
    document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');
    document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');

    // Delay to allow CSS to be computed
    requestAnimationFrame(updateInsets);

    window.addEventListener('resize', updateInsets);
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}

// ============================================
// Keyboard Hook
// ============================================

interface KeyboardState {
  isOpen: boolean;
  height: number;
}

export function useKeyboard(): KeyboardState {
  const [state, setState] = useState<KeyboardState>({
    isOpen: false,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use Visual Viewport API if available
    if ('visualViewport' in window && window.visualViewport) {
      const viewport = window.visualViewport;

      const handleResize = () => {
        const keyboardHeight = window.innerHeight - viewport.height;
        setState({
          isOpen: keyboardHeight > 100, // Threshold to detect keyboard
          height: Math.max(0, keyboardHeight),
        });
      };

      viewport.addEventListener('resize', handleResize);
      return () => viewport.removeEventListener('resize', handleResize);
    }

    // Fallback for browsers without Visual Viewport API
    let initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialHeight - currentHeight;

      // On iOS, the viewport shrinks when keyboard opens
      if (heightDiff > 100) {
        setState({ isOpen: true, height: heightDiff });
      } else if (heightDiff < 50) {
        setState({ isOpen: false, height: 0 });
        initialHeight = currentHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}

// ============================================
// Window Size Hook
// ============================================

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// ============================================
// Scroll Lock Hook
// ============================================

export function useScrollLock(lock: boolean = false): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const originalStyle = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    if (lock) {
      // Get scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [lock]);
}

// ============================================
// Orientation Hook
// ============================================

export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight
      ? 'landscape'
      : 'portrait'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientationChange = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
}

// ============================================
// Touch Device Detection
// ============================================

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - For legacy support
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  return isTouch;
}

// ============================================
// Export default
// ============================================

export default useResponsive;
