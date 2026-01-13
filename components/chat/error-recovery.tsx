'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  RefreshCw,
  Edit3,
  RotateCcw,
  Plane,
  Calendar,
  Mail,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motionVariants, colors } from '@/lib/design-tokens';
import type { ErrorCode } from '@/lib/types';

// ============================================
// Error Configuration
// ============================================

interface ErrorConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  suggestions: string[];
  actions: Array<{
    label: string;
    action: 'retry' | 'modify' | 'start_over' | 'help';
    primary?: boolean;
  }>;
}

const ERROR_CONFIGS: Record<ErrorCode, ErrorConfig> = {
  NO_FLIGHTS_FOUND: {
    icon: Plane,
    title: 'No Flights Available',
    description: "We couldn't find any flights matching your search. This could be due to limited availability or the route not being serviced.",
    color: colors.warning.main,
    bgColor: colors.warning.light,
    suggestions: [
      'Try nearby airports (e.g., EWR instead of JFK)',
      'Check flights a day before or after',
      'Consider connecting flights',
    ],
    actions: [
      { label: 'Modify Search', action: 'modify', primary: true },
      { label: 'Try Different Dates', action: 'modify' },
      { label: 'Start Over', action: 'start_over' },
    ],
  },

  INVALID_ROUTE: {
    icon: AlertCircle,
    title: 'Route Not Found',
    description: "The route you requested doesn't seem to exist. Please check the airport codes or city names.",
    color: colors.error.main,
    bgColor: colors.error.light,
    suggestions: [
      'Verify the destination city spelling',
      'Use airport codes (e.g., LAX, JFK, SFO)',
      'Check if there are multiple airports in the city',
    ],
    actions: [
      { label: 'Fix Route', action: 'modify', primary: true },
      { label: 'Start Over', action: 'start_over' },
    ],
  },

  DATE_UNAVAILABLE: {
    icon: Calendar,
    title: 'Date Not Available',
    description: "Flights aren't available for the selected date. Airlines may not have opened bookings yet or the date is too far out.",
    color: colors.warning.main,
    bgColor: colors.warning.light,
    suggestions: [
      'Try dates within the next 330 days',
      'Check if the airline flies on that day',
      'Look at adjacent dates for availability',
    ],
    actions: [
      { label: 'Choose Different Date', action: 'modify', primary: true },
      { label: 'Start Over', action: 'start_over' },
    ],
  },

  DATE_IN_PAST: {
    icon: Calendar,
    title: 'Invalid Date',
    description: "The date you selected has already passed. Please choose a future date for your travel.",
    color: colors.error.main,
    bgColor: colors.error.light,
    suggestions: [
      'Select a date from today onwards',
      'Consider booking for next week',
    ],
    actions: [
      { label: 'Pick New Date', action: 'modify', primary: true },
      { label: 'Start Over', action: 'start_over' },
    ],
  },

  SERVICE_ERROR: {
    icon: RefreshCw,
    title: 'Service Temporarily Unavailable',
    description: "We're having trouble connecting to our flight search service. This is usually temporary.",
    color: colors.neutral[500],
    bgColor: colors.neutral[100],
    suggestions: [
      'Wait a moment and try again',
      'Check your internet connection',
      'Try a different search',
    ],
    actions: [
      { label: 'Try Again', action: 'retry', primary: true },
      { label: 'Start Over', action: 'start_over' },
    ],
  },

  CALENDAR_ERROR: {
    icon: Calendar,
    title: 'Calendar Access Issue',
    description: "We couldn't access your calendar. Please check your permissions and try again.",
    color: colors.warning.main,
    bgColor: colors.warning.light,
    suggestions: [
      'Reconnect your calendar in Settings',
      'Check calendar permissions',
      'Continue without calendar check',
    ],
    actions: [
      { label: 'Retry', action: 'retry', primary: true },
      { label: 'Skip Calendar Check', action: 'modify' },
      { label: 'Go to Settings', action: 'help' },
    ],
  },

  EMAIL_PARSE_ERROR: {
    icon: Mail,
    title: 'Email Import Failed',
    description: "We had trouble reading the flight details from that email. The format might not be recognized.",
    color: colors.warning.main,
    bgColor: colors.warning.light,
    suggestions: [
      'Forward the confirmation email again',
      'Make sure it\'s a valid booking confirmation',
      'Try importing a different email',
    ],
    actions: [
      { label: 'Try Again', action: 'retry', primary: true },
      { label: 'Book Manually', action: 'start_over' },
    ],
  },

  BOOKING_FAILED: {
    icon: AlertCircle,
    title: 'Booking Failed',
    description: "We couldn't complete your booking. The flight may no longer be available at this price.",
    color: colors.error.main,
    bgColor: colors.error.light,
    suggestions: [
      'Search again for updated availability',
      'Try a different flight option',
      'Check if the price has changed',
    ],
    actions: [
      { label: 'Search Again', action: 'retry', primary: true },
      { label: 'Choose Different Flight', action: 'modify' },
      { label: 'Start Over', action: 'start_over' },
    ],
  },

  CONFLICT_UNRESOLVED: {
    icon: Calendar,
    title: 'Calendar Conflict',
    description: "There's a scheduling conflict that needs to be resolved before booking.",
    color: colors.warning.main,
    bgColor: colors.warning.light,
    suggestions: [
      'Choose a different flight time',
      'Modify your calendar event',
      'Book anyway if the conflict is minor',
    ],
    actions: [
      { label: 'View Conflict', action: 'modify', primary: true },
      { label: 'Choose Different Flight', action: 'modify' },
      { label: 'Book Anyway', action: 'retry' },
    ],
  },

  UNKNOWN_ERROR: {
    icon: HelpCircle,
    title: 'Something Went Wrong',
    description: "An unexpected error occurred. Please try again or start a new search.",
    color: colors.neutral[500],
    bgColor: colors.neutral[100],
    suggestions: [
      'Refresh and try again',
      'Start a new search',
      'Contact support if the issue persists',
    ],
    actions: [
      { label: 'Try Again', action: 'retry', primary: true },
      { label: 'Start Over', action: 'start_over' },
    ],
  },
};

// ============================================
// Error Recovery Component Props
// ============================================

interface ErrorRecoveryProps {
  errorType: ErrorCode;
  context?: string;
  onRetry: () => void;
  onModify: () => void;
  onStartOver: () => void;
  onHelp?: () => void;
}

// ============================================
// Error Recovery Component
// ============================================

export function ErrorRecovery({
  errorType,
  context,
  onRetry,
  onModify,
  onStartOver,
  onHelp,
}: ErrorRecoveryProps) {
  const config = ERROR_CONFIGS[errorType] || ERROR_CONFIGS.UNKNOWN_ERROR;
  const Icon = config.icon;

  const handleAction = (action: string) => {
    switch (action) {
      case 'retry':
        onRetry();
        break;
      case 'modify':
        onModify();
        break;
      case 'start_over':
        onStartOver();
        break;
      case 'help':
        onHelp?.();
        break;
    }
  };

  return (
    <motion.div
      {...motionVariants.fadeInUp}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-lg">
        {/* Header */}
        <div
          className="p-4 flex items-start gap-3"
          style={{ backgroundColor: config.bgColor }}
        >
          <div
            className="p-2 rounded-full"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: config.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{config.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{config.description}</p>
          </div>
        </div>

        {/* Context info if provided */}
        {context && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1">Details:</p>
            <p className="text-sm text-slate-700">{context}</p>
          </div>
        )}

        {/* Suggestions */}
        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-2">
            What you can try:
          </p>
          <ul className="space-y-2">
            {config.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            {config.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.primary ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleAction(action.action)}
                className={action.primary ? 'bg-sky-500 hover:bg-sky-600' : ''}
              >
                {action.action === 'retry' && <RefreshCw className="w-4 h-4 mr-1" />}
                {action.action === 'modify' && <Edit3 className="w-4 h-4 mr-1" />}
                {action.action === 'start_over' && <RotateCcw className="w-4 h-4 mr-1" />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ============================================
// Inline Error Banner
// ============================================

interface ErrorBannerProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorBanner({
  message,
  type = 'error',
  onDismiss,
  action,
}: ErrorBannerProps) {
  const colorMap = {
    error: {
      bg: colors.error.light,
      border: colors.error.main,
      text: colors.error.dark,
    },
    warning: {
      bg: colors.warning.light,
      border: colors.warning.main,
      text: colors.warning.dark,
    },
    info: {
      bg: colors.primary[100],
      border: colors.primary[500],
      text: colors.primary[700],
    },
  };

  const colors_config = colorMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      className="overflow-hidden"
    >
      <div
        className="px-4 py-3 rounded-lg flex items-center justify-between gap-3"
        style={{
          backgroundColor: colors_config.bg,
          borderLeft: `3px solid ${colors_config.border}`,
        }}
      >
        <div className="flex items-center gap-2">
          <AlertCircle
            className="w-4 h-4 flex-shrink-0"
            style={{ color: colors_config.border }}
          />
          <p className="text-sm" style={{ color: colors_config.text }}>
            {message}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="text-xs"
            >
              {action.label}
            </Button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ErrorRecovery;
