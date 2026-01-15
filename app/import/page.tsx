"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Plane,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
  Copy,
  RefreshCw,
  Shield,
  Eye,
  HelpCircle,
  Lock,
  Globe,
  Search,
  Inbox,
  Edit2,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
}

interface DiscoveredFlight {
  id: string;
  source: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  confirmationCode: string;
  confidence: {
    airline: "high" | "medium" | "low";
    flightNumber: "high" | "medium" | "low";
    date: "high" | "medium" | "low";
    departureTime: "high" | "medium" | "low";
    airports: "high" | "medium" | "low";
  };
}

interface ImportedFlight {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  confirmationCode: string;
  fields: ExtractedField[];
}

const sampleEmailText = `Subject: Your United Airlines Flight Confirmation

Confirmation Code: ABC123

Dear Traveler,

Thank you for booking with United Airlines!

Flight Details:
- Flight: UA 442
- Date: January 28, 2025
- Departure: 11:30 AM from JFK (New York)
- Arrival: 2:45 PM at SFO (San Francisco)

Passenger: John Doe
Seat: 12A (Window)

Please arrive at the airport at least 2 hours before departure.

Thank you for choosing United Airlines!`;

// Mock discovered flights from email
const mockDiscoveredFlights: DiscoveredFlight[] = [
  {
    id: "d1",
    source: "Email from Delta Airlines",
    airline: "Delta",
    flightNumber: "DL 1247",
    departureAirport: "JFK",
    arrivalAirport: "LAX",
    departureDate: "April 5, 2025",
    departureTime: "8:00 AM",
    arrivalTime: "11:30 AM",
    confirmationCode: "DL7X9K2",
    confidence: {
      airline: "high",
      flightNumber: "high",
      date: "high",
      departureTime: "medium",
      airports: "high",
    },
  },
  {
    id: "d2",
    source: "Email from American Airlines",
    airline: "American Airlines",
    flightNumber: "AA 892",
    departureAirport: "ORD",
    arrivalAirport: "MIA",
    departureDate: "April 12, 2025",
    departureTime: "2:15 PM",
    arrivalTime: "6:45 PM",
    confirmationCode: "AAXYZ12",
    confidence: {
      airline: "high",
      flightNumber: "high",
      date: "high",
      departureTime: "high",
      airports: "high",
    },
  },
  {
    id: "d3",
    source: "Email from United Airlines",
    airline: "United",
    flightNumber: "UA 556",
    departureAirport: "SFO",
    arrivalAirport: "SEA",
    departureDate: "April 20, 2025",
    departureTime: "10:00 AM",
    arrivalTime: "12:15 PM",
    confirmationCode: "UA4K8M1",
    confidence: {
      airline: "high",
      flightNumber: "high",
      date: "medium",
      departureTime: "low",
      airports: "high",
    },
  },
];

type WizardStep = "choose" | "auto-scanning" | "auto-results" | "manual-input" | "review" | "success";
type ImportMethod = "auto" | "manual" | null;

export default function ImportPage() {
  const [wizardStep, setWizardStep] = useState<WizardStep>("choose");
  const [importMethod, setImportMethod] = useState<ImportMethod>(null);
  const [emailText, setEmailText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedFlight, setImportedFlight] = useState<ImportedFlight | null>(null);
  const [discoveredFlights, setDiscoveredFlights] = useState<DiscoveredFlight[]>([]);
  const [selectedDiscoveredFlight, setSelectedDiscoveredFlight] = useState<DiscoveredFlight | null>(null);

  const handleChooseMethod = (method: ImportMethod) => {
    setImportMethod(method);
    if (method === "auto") {
      setWizardStep("auto-scanning");
      // Simulate scanning
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setDiscoveredFlights(mockDiscoveredFlights);
        setWizardStep("auto-results");
      }, 2500);
    } else {
      setWizardStep("manual-input");
    }
  };

  const handlePasteSample = () => {
    setEmailText(sampleEmailText);
  };

  const handleManualImport = async () => {
    if (!emailText.trim()) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setImportedFlight({
      id: "imp1",
      airline: "United Airlines",
      flightNumber: "UA 442",
      departureAirport: "JFK",
      arrivalAirport: "SFO",
      departureDate: "2025-01-28",
      departureTime: "11:30 AM",
      arrivalTime: "2:45 PM",
      confirmationCode: "ABC123",
      fields: [
        { label: "Airline", value: "United Airlines", confidence: 98 },
        { label: "Flight Number", value: "UA 442", confidence: 98 },
        { label: "Confirmation Code", value: "ABC123", confidence: 95 },
        { label: "Departure Airport", value: "JFK (New York)", confidence: 92 },
        { label: "Arrival Airport", value: "SFO (San Francisco)", confidence: 92 },
        { label: "Date", value: "January 28, 2025", confidence: 90 },
        { label: "Departure Time", value: "11:30 AM", confidence: 85 },
        { label: "Arrival Time", value: "2:45 PM", confidence: 85 },
        { label: "Passenger", value: "John Doe", confidence: 88 },
        { label: "Seat", value: "12A (Window)", confidence: 75 },
      ],
    });

    setIsProcessing(false);
    setWizardStep("review");
  };

  const handleSelectDiscoveredFlight = (flight: DiscoveredFlight) => {
    setSelectedDiscoveredFlight(flight);
    // Convert to ImportedFlight format for review
    setImportedFlight({
      id: flight.id,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      departureDate: flight.departureDate,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      confirmationCode: flight.confirmationCode,
      fields: [
        { label: "Airline", value: flight.airline, confidence: flight.confidence.airline === "high" ? 95 : flight.confidence.airline === "medium" ? 80 : 60 },
        { label: "Flight Number", value: flight.flightNumber, confidence: flight.confidence.flightNumber === "high" ? 98 : flight.confidence.flightNumber === "medium" ? 82 : 65 },
        { label: "Confirmation Code", value: flight.confirmationCode, confidence: 95 },
        { label: "Departure Airport", value: flight.departureAirport, confidence: flight.confidence.airports === "high" ? 92 : flight.confidence.airports === "medium" ? 78 : 55 },
        { label: "Arrival Airport", value: flight.arrivalAirport, confidence: flight.confidence.airports === "high" ? 92 : flight.confidence.airports === "medium" ? 78 : 55 },
        { label: "Date", value: flight.departureDate, confidence: flight.confidence.date === "high" ? 90 : flight.confidence.date === "medium" ? 75 : 50 },
        { label: "Departure Time", value: flight.departureTime, confidence: flight.confidence.departureTime === "high" ? 88 : flight.confidence.departureTime === "medium" ? 72 : 45 },
        { label: "Arrival Time", value: flight.arrivalTime, confidence: 85 },
      ],
    });
    setWizardStep("review");
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsProcessing(false);
    setWizardStep("success");
  };

  const handleReset = () => {
    setEmailText("");
    setImportedFlight(null);
    setImportMethod(null);
    setDiscoveredFlights([]);
    setSelectedDiscoveredFlight(null);
    setWizardStep("choose");
  };

  const handleBack = () => {
    if (wizardStep === "manual-input" || wizardStep === "auto-results") {
      setWizardStep("choose");
      setImportMethod(null);
    } else if (wizardStep === "review") {
      if (importMethod === "auto") {
        setWizardStep("auto-results");
      } else {
        setWizardStep("manual-input");
      }
      setImportedFlight(null);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-emerald-600 bg-emerald-50";
    if (confidence >= 75) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <CheckCircle2 className="w-4 h-4" />;
    if (confidence >= 75) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getConfidenceBadgeColor = (level: "high" | "medium" | "low") => {
    if (level === "high") return "text-emerald-600 bg-emerald-50";
    if (level === "medium") return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 w-full">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Import Flights</h1>
          <p className="text-slate-500 mt-2">
            {wizardStep === "choose" && "Choose how you'd like to import your flights"}
            {wizardStep === "auto-scanning" && "Scanning your email for flight confirmations..."}
            {wizardStep === "auto-results" && "We found flights in your email"}
            {wizardStep === "manual-input" && "Paste your flight confirmation email"}
            {wizardStep === "review" && "Review the extracted flight details"}
            {wizardStep === "success" && "Your flight has been imported"}
          </p>
        </div>

        {/* Progress Indicator */}
        {wizardStep !== "choose" && wizardStep !== "success" && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {["Method", importMethod === "auto" ? "Scan" : "Paste", "Review"].map((label, index) => {
              const stepIndex = wizardStep === "auto-scanning" || wizardStep === "manual-input" ? 1 :
                               wizardStep === "auto-results" ? 1 :
                               wizardStep === "review" ? 2 : 0;
              const isActive = index <= stepIndex;
              const isCurrent = index === stepIndex;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCurrent ? "bg-sky-500 text-white" : isActive ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm hidden sm:inline ${isCurrent ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                    {label}
                  </span>
                  {index < 2 && <ArrowRight className="w-4 h-4 text-slate-300" />}
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step: Choose Method */}
          {wizardStep === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Automatic Discovery */}
                <Card
                  className="p-6 bg-white border-slate-200 cursor-pointer hover:border-sky-300 hover:shadow-lg transition-all group"
                  onClick={() => handleChooseMethod("auto")}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center group-hover:from-sky-200 group-hover:to-sky-300 transition-colors">
                      <Search className="w-8 h-8 text-sky-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Automatic Discovery</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      We'll scan your connected email for flight confirmations and show you what we find.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">Recommended</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">Quick & Easy</span>
                    </div>
                  </div>
                </Card>

                {/* Manual Entry */}
                <Card
                  className="p-6 bg-white border-slate-200 cursor-pointer hover:border-sky-300 hover:shadow-lg transition-all group"
                  onClick={() => handleChooseMethod("manual")}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 transition-colors">
                      <FileText className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Manual Entry</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Paste your flight confirmation email and we'll extract the details automatically.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">Copy & Paste</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">Any Format</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Features Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    title: "AI-Powered",
                    desc: "Smart extraction with confidence scores",
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "Secure",
                    desc: "Your data is never stored permanently",
                  },
                  {
                    icon: <Calendar className="w-5 h-5" />,
                    title: "Calendar Sync",
                    desc: "Add to calendar with one click",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-white rounded-xl border border-slate-200 text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                      {item.icon}
                    </div>
                    <h3 className="font-medium text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: Auto Scanning */}
          {wizardStep === "auto-scanning" && (
            <motion.div
              key="auto-scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Card className="p-8 bg-white border-slate-200">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sky-50 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Search className="w-10 h-10 text-sky-500" />
                  </motion.div>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Scanning Your Email</h2>
                <p className="text-slate-500 mb-6">Looking for flight confirmations...</p>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-sky-500"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step: Auto Results */}
          {wizardStep === "auto-results" && (
            <motion.div
              key="auto-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <span className="text-sm text-slate-500">
                  <Inbox className="w-4 h-4 inline mr-1" />
                  {discoveredFlights.length} flights found
                </span>
              </div>

              <div className="space-y-4">
                {discoveredFlights.map((flight) => (
                  <Card key={flight.id} className="p-4 bg-white border-slate-200 hover:border-sky-300 transition-colors">
                    {/* Source Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-500">{flight.source}</span>
                    </div>

                    {/* Flight Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                          <Plane className="w-6 h-6 text-sky-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{flight.flightNumber}</p>
                          <p className="text-sm text-slate-500">{flight.airline}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">
                          {flight.departureAirport} → {flight.arrivalAirport}
                        </p>
                        <p className="text-sm text-slate-500">{flight.departureDate}</p>
                      </div>
                    </div>

                    {/* Confidence Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(flight.confidence).map(([key, value]) => (
                        <span
                          key={key}
                          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getConfidenceBadgeColor(value)}`}
                        >
                          {value === "high" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Dismiss this flight
                          setDiscoveredFlights(prev => prev.filter(f => f.id !== flight.id));
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Dismiss
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-sky-500 hover:bg-sky-600"
                        onClick={() => handleSelectDiscoveredFlight(flight)}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Add to Calendar
                      </Button>
                    </div>
                  </Card>
                ))}

                {discoveredFlights.length === 0 && (
                  <Card className="p-8 bg-white border-slate-200 text-center">
                    <Inbox className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <h3 className="font-medium text-slate-900 mb-2">No more flights to import</h3>
                    <p className="text-sm text-slate-500 mb-4">All discovered flights have been processed.</p>
                    <Button variant="outline" onClick={handleReset}>
                      Start Over
                    </Button>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {/* Step: Manual Input */}
          {wizardStep === "manual-input" && (
            <motion.div
              key="manual-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </div>

              <Card className="p-6 bg-white border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-slate-700">
                    Email Content
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePasteSample}
                    className="text-sky-600 hover:text-sky-700"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Paste Sample
                  </Button>
                </div>
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Paste your flight confirmation email here..."
                  className="w-full h-64 p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-slate-500">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    AI will extract flight details with confidence scores
                  </p>
                  <Button
                    onClick={handleManualImport}
                    disabled={!emailText.trim() || isProcessing}
                    className="bg-sky-500 hover:bg-sky-600"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Extract Details
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Tips */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: <FileText className="w-5 h-5" />,
                    title: "Include Full Email",
                    desc: "Paste the entire email for best accuracy",
                  },
                  {
                    icon: <Globe className="w-5 h-5" />,
                    title: "Any Airline",
                    desc: "Works with all major airlines worldwide",
                  },
                ].map((tip) => (
                  <div
                    key={tip.title}
                    className="flex gap-3 p-4 bg-white rounded-xl border border-slate-200"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 text-sm">{tip.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: Review */}
          {wizardStep === "review" && importedFlight && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </div>

              <Card className="p-6 bg-white border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Review Extracted Details
                  </h2>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>

                {/* Flight Summary */}
                <div className="p-4 bg-slate-50 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                        <Plane className="w-6 h-6 text-sky-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {importedFlight.flightNumber}
                        </p>
                        <p className="text-sm text-slate-500">{importedFlight.airline}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        {importedFlight.departureAirport} → {importedFlight.arrivalAirport}
                      </p>
                      <p className="text-sm text-slate-500">{importedFlight.departureDate}</p>
                    </div>
                  </div>
                </div>

                {/* Extracted Fields */}
                <div className="space-y-3">
                  {importedFlight.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-lg"
                    >
                      <div>
                        <p className="text-sm text-slate-500">{field.label}</p>
                        <p className="font-medium text-slate-900">{field.value}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getConfidenceColor(
                          field.confidence
                        )}`}
                      >
                        {getConfidenceIcon(field.confidence)}
                        <span>{field.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-sky-500 hover:bg-sky-600"
                    onClick={handleConfirm}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Add to My Trips
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step: Success */}
          {wizardStep === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <Card className="p-8 bg-white border-slate-200">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Flight Imported Successfully!
                </h2>
                <p className="text-slate-500 mb-6">
                  Your flight has been added to My Trips and synced with your calendar.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/trips">
                    <Button className="bg-sky-500 hover:bg-sky-600">
                      View My Trips
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleReset}>
                    Import Another
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-sky-500" />
              <span className="font-semibold text-slate-900">SkyWise</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-slate-500 text-center">
              <div className="flex items-center gap-4">
                <Link href="/presentation" className="hover:text-sky-500 transition-colors">
                  Presentation
                </Link>
                <span>•</span>
                <Link href="/docs" className="hover:text-sky-500 transition-colors">
                  Documentation
                </Link>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">Made for Efsora Labs by Cem Bilen</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
