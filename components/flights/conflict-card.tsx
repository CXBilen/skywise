"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime, formatDate } from "@/lib/utils";

interface ConflictEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

interface ConflictCardProps {
  flightArrivalTime: string;
  flightDepartureTime?: string;
  conflictingEvent: ConflictEvent;
  onFindAlternatives?: () => void;
  onBookAnyway?: () => void;
  onShowDetails?: () => void;
  isLoadingAlternatives?: boolean;
}

export function ConflictCard({
  flightArrivalTime,
  flightDepartureTime,
  conflictingEvent,
  onFindAlternatives,
  onBookAnyway,
  onShowDetails,
  isLoadingAlternatives,
}: ConflictCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full min-w-0"
    >
      <Card className="overflow-hidden border-2 border-orange-200/60 bg-gradient-to-b from-white to-orange-50/30 w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base text-orange-800">
                Schedule Conflict Detected
              </CardTitle>
              <p className="text-xs sm:text-sm text-orange-600">
                This flight overlaps with an existing event
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Timeline Visualization */}
          <div className="relative bg-white rounded-xl p-3 sm:p-4 border border-orange-200">
            <div className="space-y-3">
              {/* Flight Time */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-900">
                    Flight {flightDepartureTime ? "departs" : "arrives"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatTime(flightDepartureTime || flightArrivalTime)}
                  </p>
                </div>
              </div>

              {/* Overlap indicator */}
              <div className="ml-1 w-0.5 h-6 bg-gradient-to-b from-sky-500 via-orange-500 to-red-500" />

              {/* Conflict Event */}
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-50 rounded-lg min-w-0">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-orange-800 truncate">
                    {conflictingEvent.title}
                  </p>
                  <p className="text-xs text-orange-600">
                    {formatTime(conflictingEvent.start)} -{" "}
                    {formatTime(conflictingEvent.end)}
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-orange-400 shrink-0" />
              </div>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-xs sm:text-sm text-slate-600">
            {flightDepartureTime ? (
              <>
                Your flight departs at {formatTime(flightDepartureTime)}, but you
                have &quot;{conflictingEvent.title}&quot; scheduled from{" "}
                {formatTime(conflictingEvent.start)} to{" "}
                {formatTime(conflictingEvent.end)}.
              </>
            ) : (
              <>
                Your flight lands at {formatTime(flightArrivalTime)}, which
                overlaps with &quot;{conflictingEvent.title}&quot; (
                {formatTime(conflictingEvent.start)} -{" "}
                {formatTime(conflictingEvent.end)}).
              </>
            )}
          </p>

          {/* Actions */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              What would you like to do?
            </p>
            <div className="space-y-2">
              {(onBookAnyway || onShowDetails) && (
                <div className="grid grid-cols-2 gap-2">
                  {onShowDetails && (
                    <Button
                      variant="ghost"
                      onClick={onShowDetails}
                      className="text-sm"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-1.5 shrink-0" />
                      Details
                    </Button>
                  )}
                  {onBookAnyway && (
                    <Button
                      variant="outline"
                      onClick={onBookAnyway}
                      className="text-sm"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-1.5 shrink-0" />
                      Book Anyway
                    </Button>
                  )}
                </div>
              )}
              {onFindAlternatives && (
                <Button
                  variant="default"
                  onClick={onFindAlternatives}
                  disabled={isLoadingAlternatives}
                  className="w-full"
                >
                  {isLoadingAlternatives ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2 shrink-0" />
                      Find Alternatives
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
