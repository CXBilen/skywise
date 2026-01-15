"use client";

import { useState, useCallback, useEffect } from "react";
import {
  TourConfig,
  TourStep,
  isTourCompleted,
  markTourCompleted,
} from "@/lib/tour-config";

interface UseTourOptions {
  onComplete?: () => void;
  onSkip?: () => void;
  autoStart?: boolean;
}

interface UseTourReturn {
  isActive: boolean;
  currentStep: number;
  currentStepData: TourStep | null;
  totalSteps: number;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  goToStep: (step: number) => void;
  isCompleted: boolean;
}

export function useTour(
  config: TourConfig,
  options: UseTourOptions = {}
): UseTourReturn {
  const { onComplete, onSkip, autoStart = false } = options;

  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check if tour was already completed on mount
  useEffect(() => {
    const completed = isTourCompleted(config.id);
    setIsCompleted(completed);

    // Auto-start if not completed and autoStart is true
    if (autoStart && !completed) {
      setIsActive(true);
    }
  }, [config.id, autoStart]);

  const totalSteps = config.steps.length;
  const currentStepData = isActive ? config.steps[currentStep] : null;

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Last step - complete the tour
      markTourCompleted(config.id);
      setIsCompleted(true);
      setIsActive(false);
      onComplete?.();
    }
  }, [currentStep, totalSteps, config.id, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    onSkip?.();
  }, [onSkip]);

  const completeTour = useCallback(() => {
    markTourCompleted(config.id);
    setIsCompleted(true);
    setIsActive(false);
    onComplete?.();
  }, [config.id, onComplete]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  return {
    isActive,
    currentStep,
    currentStepData,
    totalSteps,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    goToStep,
    isCompleted,
  };
}
