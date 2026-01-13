'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Plane, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motionVariants } from '@/lib/design-tokens';
import type { ClarificationPromptProps } from '@/lib/types';

// ============================================
// Field Configuration
// ============================================

interface FieldConfig {
  icon: React.ElementType;
  label: string;
  placeholder: string;
  description: string;
}

const FIELD_CONFIG: Record<string, FieldConfig> = {
  destination: {
    icon: MapPin,
    label: 'Destination',
    placeholder: 'Where to?',
    description: "Enter a city or airport code (e.g., 'San Francisco' or 'SFO')",
  },
  origin: {
    icon: Plane,
    label: 'Departure City',
    placeholder: 'From where?',
    description: "Enter your departure city or airport code",
  },
  date: {
    icon: Calendar,
    label: 'Travel Date',
    placeholder: 'When?',
    description: "Select your preferred travel date",
  },
  passengers: {
    icon: Users,
    label: 'Passengers',
    placeholder: 'How many?',
    description: "Number of travelers (1-9)",
  },
};

// ============================================
// Popular Destinations
// ============================================

const POPULAR_DESTINATIONS = [
  { city: 'San Francisco', code: 'SFO' },
  { city: 'Los Angeles', code: 'LAX' },
  { city: 'New York', code: 'JFK' },
  { city: 'Miami', code: 'MIA' },
  { city: 'Chicago', code: 'ORD' },
  { city: 'Seattle', code: 'SEA' },
];

// ============================================
// Quick Date Options
// ============================================

function getQuickDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return [
    { label: 'Tomorrow', value: tomorrow, display: formatDate(tomorrow) },
    { label: 'Next Week', value: nextWeek, display: formatDate(nextWeek) },
    { label: 'Next Month', value: nextMonth, display: formatDate(nextMonth) },
  ];
}

// ============================================
// Clarification Prompt Component
// ============================================

export function ClarificationPrompt({
  missingFields,
  partialData,
  onFieldProvided,
  suggestions,
}: ClarificationPromptProps) {
  type FieldType = 'destination' | 'date' | 'origin' | 'passengers';

  const [activeField, setActiveField] = useState<FieldType | null>(
    missingFields.length > 0 ? missingFields[0] : null
  );
  const [inputValue, setInputValue] = useState('');

  if (missingFields.length === 0) {
    return null;
  }

  const handleSuggestionClick = (field: FieldType, value: unknown) => {
    onFieldProvided(field, value);

    // Move to next missing field
    const currentIndex = missingFields.indexOf(field);
    if (currentIndex < missingFields.length - 1) {
      setActiveField(missingFields[currentIndex + 1]);
    } else {
      setActiveField(null);
    }
    setInputValue('');
  };

  const handleSubmit = (field: FieldType) => {
    if (inputValue.trim()) {
      onFieldProvided(field, inputValue.trim());
      setInputValue('');

      const currentIndex = missingFields.indexOf(field);
      if (currentIndex < missingFields.length - 1) {
        setActiveField(missingFields[currentIndex + 1]);
      } else {
        setActiveField(null);
      }
    }
  };

  const quickDates = getQuickDates();

  return (
    <motion.div
      {...motionVariants.fadeInUp}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span className="text-sm text-slate-600">
            {missingFields.length === 1
              ? 'Just one more thing...'
              : `${missingFields.length} details needed`
            }
          </span>
        </div>

        {/* Field tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {missingFields.map((field) => {
            const config = FIELD_CONFIG[field];
            const Icon = config?.icon || MapPin;
            const isActive = activeField === field;
            const isCompleted = partialData[field as keyof typeof partialData];

            return (
              <button
                key={field}
                onClick={() => setActiveField(field)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-150 whitespace-nowrap
                  ${isActive
                    ? 'bg-sky-500 text-white shadow-md'
                    : isCompleted
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {config?.label || field}
                {isCompleted && (
                  <span className="text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active field content */}
        <AnimatePresence mode="wait">
          {activeField && (
            <motion.div
              key={activeField}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {/* Field description */}
              <p className="text-sm text-slate-500">
                {FIELD_CONFIG[activeField]?.description}
              </p>

              {/* Input field */}
              <div className="relative">
                <input
                  type={activeField === 'date' ? 'date' : activeField === 'passengers' ? 'number' : 'text'}
                  min={activeField === 'passengers' ? 1 : undefined}
                  max={activeField === 'passengers' ? 9 : undefined}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(activeField);
                    }
                  }}
                  placeholder={FIELD_CONFIG[activeField]?.placeholder}
                  className="
                    w-full px-4 py-3 pr-12 rounded-lg
                    border border-slate-200 bg-white
                    text-slate-900 placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500
                    transition-all duration-150
                  "
                />
                <Button
                  size="sm"
                  onClick={() => handleSubmit(activeField)}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick suggestions */}
              {activeField === 'destination' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-medium">Popular destinations</p>
                  <div className="flex flex-wrap gap-2">
                    {(suggestions?.destination || POPULAR_DESTINATIONS.map(d => d.city)).slice(0, 6).map((dest) => (
                      <button
                        key={typeof dest === 'string' ? dest : dest}
                        onClick={() => handleSuggestionClick('destination', dest)}
                        className="
                          px-3 py-1.5 rounded-full text-sm
                          bg-slate-100 text-slate-700
                          hover:bg-sky-100 hover:text-sky-700
                          transition-colors duration-150
                        "
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeField === 'date' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-medium">Quick options</p>
                  <div className="flex flex-wrap gap-2">
                    {quickDates.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => handleSuggestionClick('date', option.value)}
                        className="
                          px-3 py-1.5 rounded-full text-sm
                          bg-slate-100 text-slate-700
                          hover:bg-sky-100 hover:text-sky-700
                          transition-colors duration-150
                        "
                      >
                        {option.label}
                        <span className="text-slate-400 ml-1">({option.display})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeField === 'passengers' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSuggestionClick('passengers', num)}
                      className="
                        flex-1 py-2 rounded-lg text-sm font-medium
                        bg-slate-100 text-slate-700
                        hover:bg-sky-100 hover:text-sky-700
                        transition-colors duration-150
                      "
                    >
                      {num} {num === 1 ? 'traveler' : 'travelers'}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collected info summary */}
        {Object.keys(partialData).length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2">Your trip so far:</p>
            <div className="flex flex-wrap gap-2">
              {partialData.origin && (
                <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                  From: {partialData.origin}
                </span>
              )}
              {partialData.destination && (
                <span className="px-2 py-1 bg-sky-100 rounded text-xs text-sky-700">
                  To: {partialData.destination}
                </span>
              )}
              {partialData.departureDate && (
                <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                  {partialData.departureDate.toLocaleDateString()}
                </span>
              )}
              {partialData.passengers && (
                <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                  {partialData.passengers} {partialData.passengers === 1 ? 'traveler' : 'travelers'}
                </span>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default ClarificationPrompt;
