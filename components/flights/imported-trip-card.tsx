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
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-32 text-right"
          />
        ) : (
          <span className="font-medium text-slate-900">{value}</span>
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
    >
      <Card className="overflow-hidden border-2 border-amber-200/60 bg-gradient-to-b from-white to-amber-50/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">Found in your email</CardTitle>
                <p className="text-sm text-slate-500">{source}</p>
              </div>
            </div>
            {hasLowConfidence && (
              <Badge variant="warning" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Review needed
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
            <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              I&apos;m not 100% certain about some details. Please verify before
              adding to your calendar.
            </p>
          )}

          <div className="flex gap-2 pt-2">
            {onDismiss && (
              <Button variant="ghost" onClick={onDismiss} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? "Done editing" : "Edit"}
            </Button>
            {onAddToCalendar && (
              <Button
                onClick={() => onAddToCalendar(data)}
                className="flex-1"
                disabled={isEditing}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
