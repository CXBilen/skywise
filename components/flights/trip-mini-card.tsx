"use client";

import { motion } from "framer-motion";
import { Plane, Calendar, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TripMiniCardProps {
  id: string;
  destination: string;
  origin: string;
  departureDate: string;
  returnDate?: string;
  airline: string;
  flightNumber: string;
  status: "upcoming" | "completed" | "cancelled";
  calendarSynced: boolean;
  onClick?: () => void;
}

export function TripMiniCard({
  destination,
  origin,
  departureDate,
  returnDate,
  airline,
  flightNumber,
  status,
  calendarSynced,
  onClick,
}: TripMiniCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="p-3 cursor-pointer hover:border-sky-300 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shrink-0">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900 text-sm truncate">
                {origin} → {destination}
              </p>
              {status === "upcoming" && (
                <span className="text-xs bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded shrink-0">
                  Upcoming
                </span>
              )}
              {status === "completed" && (
                <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                  Completed
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{airline} {flightNumber}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(departureDate)}
                {returnDate && ` - ${formatDate(returnDate)}`}
              </span>
            </div>
          </div>
          {calendarSynced && (
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
          )}
        </div>
      </Card>
    </motion.div>
  );
}
