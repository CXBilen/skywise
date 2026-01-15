"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  onSelect: (date: Date) => void;
  onCancel?: () => void;
  minDate?: Date;
  selectedDate?: Date;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function DatePicker({ onSelect, onCancel, minDate, selectedDate }: DatePickerProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());
  const [selected, setSelected] = useState<Date | null>(selectedDate ?? null);

  const effectiveMinDate = minDate ?? today;

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const compareMin = new Date(effectiveMinDate.getFullYear(), effectiveMinDate.getMonth(), effectiveMinDate.getDate());
    return compareDate < compareMin;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      day === selected.getDate() &&
      currentMonth === selected.getMonth() &&
      currentYear === selected.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    if (!isDateDisabled(date)) {
      setSelected(date);
    }
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Quick select options
  const quickOptions = [
    { label: "Tomorrow", date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) },
    { label: "Next Week", date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7) },
    { label: "In 2 Weeks", date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14) },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Select Options */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">Quick Select</p>
        <div className="flex flex-wrap gap-2">
          {quickOptions.map((option) => (
            <Button
              key={option.label}
              variant="outline"
              size="sm"
              onClick={() => {
                setSelected(option.date);
                setCurrentMonth(option.date.getMonth());
                setCurrentYear(option.date.getFullYear());
              }}
              className={cn(
                "text-sm",
                selected?.toDateString() === option.date.toDateString() &&
                  "bg-sky-50 border-sky-300 text-sky-700"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-slate-200">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-slate-900">
            {MONTHS[currentMonth]} {currentYear}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-slate-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 p-2 gap-1">
          {/* Empty cells for days before first day of month */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentYear, currentMonth, day);
            const disabled = isDateDisabled(date);

            return (
              <motion.button
                key={day}
                whileHover={!disabled ? { scale: 1.1 } : undefined}
                whileTap={!disabled ? { scale: 0.95 } : undefined}
                onClick={() => handleDayClick(day)}
                disabled={disabled}
                className={cn(
                  "h-9 w-full rounded-lg text-sm font-medium transition-colors",
                  disabled && "text-slate-300 cursor-not-allowed",
                  !disabled && "hover:bg-slate-100 cursor-pointer",
                  isToday(day) && !isSelected(day) && "bg-sky-50 text-sky-600",
                  isSelected(day) && "bg-sky-500 text-white hover:bg-sky-600"
                )}
              >
                {day}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Display */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-sky-50 rounded-lg border border-sky-200"
        >
          <Calendar className="h-5 w-5 text-sky-600" />
          <div>
            <p className="text-sm text-slate-600">Selected Date</p>
            <p className="font-semibold text-slate-900">
              {selected.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          disabled={!selected}
          className="flex-1 bg-sky-500 hover:bg-sky-600"
        >
          Confirm Date
        </Button>
      </div>
    </div>
  );
}
