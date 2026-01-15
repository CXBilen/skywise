"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Plane,
  Calendar,
  Clock,
  MapPin,
  Check,
  AlertTriangle,
  Edit2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ConfidenceLevel = "high" | "medium" | "low";

interface ExtractedData {
  airline: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  departureAirport: string;
  arrivalAirport: string;
}

interface ConfidenceData {
  airline: ConfidenceLevel;
  flightNumber: ConfidenceLevel;
  date: ConfidenceLevel;
  departureTime: ConfidenceLevel;
  airports: ConfidenceLevel;
}

interface ImportedTripCardProps {
  source: string;
  data: ExtractedData;
  confidence: ConfidenceData;
  onAddToCalendar?: (data: ExtractedData) => void;
  onDismiss?: () => void;
  onEdit?: (data: ExtractedData) => void;
}

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return (
    <Badge
      variant={level === "high" ? "fits" : level === "medium" ? "warning" : "conflict"}
      className="text-xs"
    >
      {level === "high" && <Check className="h-2.5 w-2.5 mr-1" />}
      {level === "low" && <AlertTriangle className="h-2.5 w-2.5 mr-1" />}
      {level === "high" ? "✓" : level === "low" ? "Check this" : "Verify"}
    </Badge>
  );
}

interface EditableFieldProps {
  label: string;
  value: string;
  confidence: ConfidenceLevel;
  isEditing: boolean;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}

function EditableField({
  label,
  value,
  confidence,
  isEditing,
  onChange,
  icon,
}: EditableFieldProps) {
  return (
    <div className="flex items-center justify-between py-2 gap-2 min-w-0">
      <div className="flex items-center gap-2 text-slate-600 shrink-0">
        {icon}
        <span className="text-xs sm:text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {isEditing ? (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-7 sm:h-8 w-24 sm:w-32 text-right text-xs sm:text-sm"
          />
        ) : (
          <span className="font-medium text-slate-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">{value}</span>
        )}
        <ConfidenceBadge level={confidence} />
      </div>
    </div>
  );
}

export function ImportedTripCard({
  source,
  data: initialData,
  confidence,
  onAddToCalendar,
  onDismiss,
}: ImportedTripCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(initialData);

  const updateField = (field: keyof ExtractedData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const hasLowConfidence = Object.values(confidence).some((c) => c === "low");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full min-w-0"
    >
      <Card className="overflow-hidden border-2 border-amber-200/60 bg-gradient-to-b from-white to-amber-50/30 w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm sm:text-base">Found in your email</CardTitle>
                <p className="text-xs sm:text-sm text-slate-500 truncate">{source}</p>
              </div>
            </div>
            {hasLowConfidence && (
              <Badge variant="warning" className="text-xs shrink-0">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Review
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="divide-y divide-slate-100">
            <EditableField
              label="Airline"
              value={data.airline}
              confidence={confidence.airline}
              isEditing={isEditing}
              onChange={(v) => updateField("airline", v)}
              icon={<Plane className="h-4 w-4" />}
            />
            <EditableField
              label="Flight"
              value={data.flightNumber}
              confidence={confidence.flightNumber}
              isEditing={isEditing}
              onChange={(v) => updateField("flightNumber", v)}
              icon={<span className="text-xs font-mono">#</span>}
            />
            <EditableField
              label="Date"
              value={data.date}
              confidence={confidence.date}
              isEditing={isEditing}
              onChange={(v) => updateField("date", v)}
              icon={<Calendar className="h-4 w-4" />}
            />
            <EditableField
              label="Departure"
              value={data.departureTime}
              confidence={confidence.departureTime}
              isEditing={isEditing}
              onChange={(v) => updateField("departureTime", v)}
              icon={<Clock className="h-4 w-4" />}
            />
            <EditableField
              label="Route"
              value={`${data.departureAirport} → ${data.arrivalAirport}`}
              confidence={confidence.airports}
              isEditing={isEditing}
              onChange={(v) => {
                const [from, to] = v.split("→").map((s) => s.trim());
                updateField("departureAirport", from || data.departureAirport);
                updateField("arrivalAirport", to || data.arrivalAirport);
              }}
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>

          {hasLowConfidence && !isEditing && (
            <p className="text-xs sm:text-sm text-amber-700 bg-amber-50 p-2 sm:p-3 rounded-lg">
              I&apos;m not 100% certain about some details. Please verify before
              adding to your calendar.
            </p>
          )}

          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {onDismiss && (
                <Button
                  variant="ghost"
                  onClick={onDismiss}
                  className="text-sm"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-1.5 shrink-0" />
                  Dismiss
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm"
                size="sm"
              >
                <Edit2 className="h-4 w-4 mr-1.5 shrink-0" />
                {isEditing ? "Done" : "Edit"}
              </Button>
            </div>
            {onAddToCalendar && (
              <Button
                onClick={() => onAddToCalendar(data)}
                className="w-full"
                disabled={isEditing}
              >
                <Calendar className="h-4 w-4 mr-2 shrink-0" />
                Add to Calendar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
