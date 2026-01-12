"use client";

import { motion } from "framer-motion";
import {
  Plane,
  Clock,
  ArrowRight,
  Check,
  AlertTriangle,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatPrice, formatDuration, formatTime } from "@/lib/utils";

interface FlightCardProps {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  price: number;
  calendarFit: "fits" | "conflict" | "unknown";
  conflictDetails?: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
  compact?: boolean;
}

const airlineColors: Record<string, string> = {
  united: "from-blue-600 to-blue-700",
  delta: "from-red-600 to-red-700",
  american: "from-sky-600 to-sky-700",
  jetblue: "from-sky-500 to-blue-600",
  southwest: "from-amber-500 to-orange-600",
  alaska: "from-teal-600 to-teal-700",
  default: "from-slate-600 to-slate-700",
};

export function FlightCard({
  id,
  airline,
  flightNumber,
  departureAirport,
  arrivalAirport,
  departureTime,
  arrivalTime,
  duration,
  stops,
  price,
  calendarFit,
  conflictDetails,
  selected,
  onSelect,
  compact,
}: FlightCardProps) {
  const airlineKey = airline.toLowerCase().replace(/\s+/g, "");
  const gradientClass = airlineColors[airlineKey] || airlineColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 cursor-pointer",
          selected
            ? "ring-2 ring-sky-500 shadow-lg shadow-sky-500/20"
            : "hover:shadow-lg hover:shadow-slate-900/10",
          compact && "p-3"
        )}
        onClick={() => onSelect?.(id)}
      >
        <div className={cn("p-4", compact && "p-0")}>
          {/* Airline Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  gradientClass
                )}
              >
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{airline}</p>
                <p className="text-sm text-slate-500">{flightNumber}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold text-slate-900">
                {formatPrice(price)}
              </p>
              <Badge
                variant={
                  calendarFit === "fits"
                    ? "fits"
                    : calendarFit === "conflict"
                    ? "conflict"
                    : "secondary"
                }
                className="mt-1"
              >
                {calendarFit === "fits" && (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Fits calendar
                  </>
                )}
                {calendarFit === "conflict" && (
                  <>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Conflict
                  </>
                )}
                {calendarFit === "unknown" && "Checking..."}
              </Badge>
            </div>
          </div>

          {/* Flight Times */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {formatTime(departureTime)}
              </p>
              <p className="text-sm font-medium text-slate-600">
                {departureAirport}
              </p>
            </div>

            <div className="flex-1 px-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-slate-200" />
                </div>
                <div className="relative flex flex-col items-center bg-white px-2">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">
                      {formatDuration(duration)}
                    </span>
                  </div>
                  {stops > 0 ? (
                    <span className="text-xs text-slate-400 mt-0.5">
                      {stops} stop{stops > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium mt-0.5">
                      Nonstop
                    </span>
                  )}
                </div>
                <Plane className="absolute right-0 h-4 w-4 text-sky-500 transform translate-x-1" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {formatTime(arrivalTime)}
              </p>
              <p className="text-sm font-medium text-slate-600">
                {arrivalAirport}
              </p>
            </div>
          </div>

          {/* Conflict Details */}
          {calendarFit === "conflict" && conflictDetails && (
            <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-sm text-orange-800">{conflictDetails}</p>
            </div>
          )}

          {/* Select Button */}
          {onSelect && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(id);
                }}
                variant={selected ? "default" : "outline"}
                className="w-full"
              >
                {selected ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  "Select this flight"
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
