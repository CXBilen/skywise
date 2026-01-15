"use client";

import { motion } from "framer-motion";
import {
  Plane,
  Calendar,
  ChevronRight,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";

interface FlightLeg {
  date: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  airline: string;
  flightNumber: string;
  duration: string;
}

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
}

interface TripSummaryCardProps {
  origin: string;
  destination: string;
  outbound: FlightLeg;
  returnFlight?: FlightLeg;
  totalPrice: number;
  calendarEvents: CalendarEvent[];
  onConfirm?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  showCalendarPreview?: boolean;
}

export function TripSummaryCard({
  origin,
  destination,
  outbound,
  returnFlight,
  totalPrice,
  calendarEvents,
  onConfirm,
  onEdit,
  onCancel,
  isLoading,
  showCalendarPreview = true,
}: TripSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full min-w-0"
    >
      <Card className="overflow-hidden border border-sky-200/60 bg-gradient-to-b from-white to-sky-50/30 w-full">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0">
                <Plane className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm truncate">Trip to {destination}</CardTitle>
                <p className="text-xs text-slate-500 truncate">
                  {origin} → {destination}
                  {returnFlight && ` → ${origin}`}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-slate-900">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-0 space-y-2">
          {/* Outbound Flight */}
          <div className="p-2 bg-white rounded-lg border border-slate-200/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
              <Plane className="h-3 w-3 shrink-0" />
              <span className="font-medium">Outbound</span>
              <span>•</span>
              <span className="truncate">{formatDate(outbound.date)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="shrink-0">
                <p className="text-base font-bold text-slate-900">
                  {formatTime(outbound.departureTime)}
                </p>
                <p className="text-xs text-slate-600">
                  {outbound.departureAirport}
                </p>
              </div>
              <div className="flex-1 px-1 flex flex-col items-center min-w-0">
                <div className="flex items-center gap-1 text-slate-400">
                  <div className="w-3 h-px bg-slate-300" />
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  <div className="w-3 h-px bg-slate-300" />
                </div>
                <p className="text-[10px] text-slate-500">{outbound.duration}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-slate-900">
                  {formatTime(outbound.arrivalTime)}
                </p>
                <p className="text-xs text-slate-600">
                  {outbound.arrivalAirport}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {outbound.airline} {outbound.flightNumber}
            </p>
          </div>

          {/* Return Flight */}
          {returnFlight && (
            <div className="p-2 bg-white rounded-lg border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                <Plane className="h-3 w-3 rotate-180 shrink-0" />
                <span className="font-medium">Return</span>
                <span>•</span>
                <span className="truncate">{formatDate(returnFlight.date)}</span>
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="shrink-0">
                  <p className="text-base font-bold text-slate-900">
                    {formatTime(returnFlight.departureTime)}
                  </p>
                  <p className="text-xs text-slate-600">
                    {returnFlight.departureAirport}
                  </p>
                </div>
                <div className="flex-1 px-1 flex flex-col items-center min-w-0">
                  <div className="flex items-center gap-1 text-slate-400">
                    <div className="w-3 h-px bg-slate-300" />
                    <ChevronRight className="h-3 w-3 shrink-0" />
                    <div className="w-3 h-px bg-slate-300" />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {returnFlight.duration}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-slate-900">
                    {formatTime(returnFlight.arrivalTime)}
                  </p>
                  <p className="text-xs text-slate-600">
                    {returnFlight.arrivalAirport}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {returnFlight.airline} {returnFlight.flightNumber}
              </p>
            </div>
          )}

          {/* Calendar Preview - Hidden on mobile for compact view */}
          {showCalendarPreview && calendarEvents.length > 0 && (
            <div className="hidden sm:block">
              <Separator className="my-2" />
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-2">
                  <Calendar className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span>Adding to calendar</span>
                </div>
                <div className="space-y-1.5">
                  {calendarEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-sky-50 rounded-lg border border-sky-100 min-w-0"
                    >
                      <div className="w-0.5 h-6 bg-sky-500 rounded-full shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 text-xs truncate">
                          {event.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {formatDate(event.start)} • {formatTime(event.start)} - {formatTime(event.end)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {(onConfirm || onEdit || onCancel) && (
            <div className="pt-2 space-y-1.5">
              {onConfirm && (
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="w-full h-9 text-sm"
                  size="sm"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              )}
              {(onCancel || onEdit) && (
                <div className="grid grid-cols-2 gap-1.5">
                  {onCancel && (
                    <Button
                      variant="ghost"
                      onClick={onCancel}
                      disabled={isLoading}
                      className="text-xs h-8"
                      size="sm"
                    >
                      <X className="h-3.5 w-3.5 mr-1 shrink-0" />
                      Cancel
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="outline"
                      onClick={onEdit}
                      disabled={isLoading}
                      className="text-xs h-8"
                      size="sm"
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1 shrink-0" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
