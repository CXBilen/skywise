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
    >
      <Card className="overflow-hidden border-2 border-sky-200/60 bg-gradient-to-b from-white to-sky-50/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Trip to {destination}</CardTitle>
                <p className="text-sm text-slate-500">
                  {origin} → {destination}
                  {returnFlight && ` → ${origin}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                {formatPrice(totalPrice)}
              </p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Outbound Flight */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <Plane className="h-4 w-4" />
              <span className="font-medium">Outbound</span>
              <span>•</span>
              <span>{formatDate(outbound.date)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {formatTime(outbound.departureTime)}
                </p>
                <p className="text-sm text-slate-600">
                  {outbound.departureAirport}
                </p>
              </div>
              <div className="flex-1 px-4 flex flex-col items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-8 h-px bg-slate-300" />
                  <ChevronRight className="h-4 w-4" />
                  <div className="w-8 h-px bg-slate-300" />
                </div>
                <p className="text-xs text-slate-500 mt-1">{outbound.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">
                  {formatTime(outbound.arrivalTime)}
                </p>
                <p className="text-sm text-slate-600">
                  {outbound.arrivalAirport}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {outbound.airline} {outbound.flightNumber}
            </p>
          </div>

          {/* Return Flight */}
          {returnFlight && (
            <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <Plane className="h-4 w-4 rotate-180" />
                <span className="font-medium">Return</span>
                <span>•</span>
                <span>{formatDate(returnFlight.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-slate-900">
                    {formatTime(returnFlight.departureTime)}
                  </p>
                  <p className="text-sm text-slate-600">
                    {returnFlight.departureAirport}
                  </p>
                </div>
                <div className="flex-1 px-4 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-8 h-px bg-slate-300" />
                    <ChevronRight className="h-4 w-4" />
                    <div className="w-8 h-px bg-slate-300" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {returnFlight.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">
                    {formatTime(returnFlight.arrivalTime)}
                  </p>
                  <p className="text-sm text-slate-600">
                    {returnFlight.arrivalAirport}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {returnFlight.airline} {returnFlight.flightNumber}
              </p>
            </div>
          )}

          {/* Calendar Preview */}
          {showCalendarPreview && calendarEvents.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <Calendar className="h-4 w-4 text-sky-500" />
                  What I&apos;ll add to your calendar
                </div>
                <div className="space-y-2">
                  {calendarEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg border border-sky-100"
                    >
                      <div className="w-1 h-8 bg-sky-500 rounded-full" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {event.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatDate(event.start)} • {formatTime(event.start)} -{" "}
                          {formatTime(event.end)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          {(onConfirm || onEdit || onCancel) && (
            <>
              <Separator />
              <div className="flex gap-3">
                {onCancel && (
                  <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={onEdit}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {onConfirm && (
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
