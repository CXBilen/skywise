"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Calendar,
  MapPin,
  Plane,
  Shield,
  ChevronRight,
  Check,
  X,
  Trash2,
  ExternalLink,
  AlertTriangle,
  Unplug,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AIRPORTS = [
  { code: "JFK", name: "New York", fullName: "John F. Kennedy International" },
  { code: "LAX", name: "Los Angeles", fullName: "Los Angeles International" },
  { code: "ORD", name: "Chicago", fullName: "O'Hare International" },
  { code: "SFO", name: "San Francisco", fullName: "San Francisco International" },
  { code: "MIA", name: "Miami", fullName: "Miami International" },
  { code: "DFW", name: "Dallas", fullName: "Dallas/Fort Worth International" },
  { code: "BOS", name: "Boston", fullName: "Logan International" },
  { code: "SEA", name: "Seattle", fullName: "Seattle-Tacoma International" },
];

const SEAT_OPTIONS = [
  { value: "window", label: "Window", desc: "Enjoy the view and lean against the wall" },
  { value: "aisle", label: "Aisle", desc: "Easy access to move around" },
  { value: "middle", label: "Middle", desc: "Between window and aisle" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [emailConnected, setEmailConnected] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(true);
  const [autoImport, setAutoImport] = useState(true);
  const [conflictAlerts, setConflictAlerts] = useState(true);
  const [homeAirport, setHomeAirport] = useState({ code: "JFK", name: "New York" });
  const [seatPreference, setSeatPreference] = useState("window");
  const [showAirportModal, setShowAirportModal] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAirportModal || showSeatModal || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAirportModal, showSeatModal, showDeleteModal]);

  const handleDisconnect = (service: string) => {
    if (service === "email") {
      setEmailConnected(false);
    } else {
      setCalendarConnected(false);
    }
    toast({
      title: `${service === "email" ? "Email" : "Calendar"} disconnected`,
      description: `You can reconnect anytime.`,
    });
  };

  const handleConnect = (service: string) => {
    if (service === "email") {
      setEmailConnected(true);
    } else {
      setCalendarConnected(true);
    }
    toast({
      title: `${service === "email" ? "Email" : "Calendar"} connected`,
      description: `Successfully connected your ${service}.`,
      variant: "success",
    });
  };

  const isModalOpen = showAirportModal || showSeatModal || showDeleteModal;

  const handleDeleteAllData = () => {
    setShowDeleteModal(false);
    toast({
      title: "All data deleted",
      description: "Your data has been permanently removed.",
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You will be redirected to the home page.",
    });

    setTimeout(() => {
      router.push("/");
    }, 4000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50 ${isModalOpen ? "overflow-hidden h-screen" : ""}`}>
      <AppHeader showSettings={false} showLogout={true} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-500">Manage your connections and preferences</p>
          </div>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connected Accounts</CardTitle>
              <CardDescription>
                Manage your email and calendar connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">Email</p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">
                      {emailConnected ? "Read-only" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {emailConnected ? (
                    <>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Connected</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDisconnect("email")}
                        className="h-7 w-7 text-slate-400 hover:text-red-500"
                        title="Disconnect"
                      >
                        <Unplug className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect("email")} className="text-xs h-7">
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {/* Calendar */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">Calendar</p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">
                      {calendarConnected ? "Read & write" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {calendarConnected ? (
                    <>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Connected</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDisconnect("calendar")}
                        className="h-7 w-7 text-slate-400 hover:text-red-500"
                        title="Disconnect"
                      >
                        <Unplug className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect("calendar")} className="text-xs h-7">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
              <CardDescription>
                Customize your travel assistant experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">Home Airport</p>
                    <p className="text-sm text-slate-500">{homeAirport.code} - {homeAirport.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowAirportModal(true)}>
                  Change
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Plane className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">Seat Preference</p>
                    <p className="text-sm text-slate-500 capitalize">{seatPreference}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSeatModal(true)}>
                  Change
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Auto-import flights</p>
                  <p className="text-sm text-slate-500">
                    Automatically detect flight confirmations
                  </p>
                </div>
                <Switch
                  checked={autoImport}
                  onCheckedChange={setAutoImport}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Conflict alerts</p>
                  <p className="text-sm text-slate-500">
                    Notify me about calendar conflicts
                  </p>
                </div>
                <Switch
                  checked={conflictAlerts}
                  onCheckedChange={setConflictAlerts}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy & Data</CardTitle>
              <CardDescription>
                Control your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sky-900">Your data is secure</p>
                    <p className="text-sm text-sky-700 mt-1">
                      We only access flight-related emails and calendar events.
                      Your data is processed securely and never shared with third
                      parties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Privacy Policy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>

        </motion.div>
      </main>

      {/* Airport Selection Modal */}
      <AnimatePresence>
        {showAirportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
            onClick={() => setShowAirportModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Home Airport</h2>
                    <p className="text-sm text-slate-500 mt-1">Select your default departure airport</p>
                  </div>
                  <button
                    onClick={() => setShowAirportModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  {AIRPORTS.map((airport) => (
                    <button
                      key={airport.code}
                      onClick={() => {
                        setHomeAirport({ code: airport.code, name: airport.name });
                        setShowAirportModal(false);
                        toast({
                          title: "Home airport updated",
                          description: `Set to ${airport.code} - ${airport.name}`,
                          variant: "success",
                        });
                      }}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        homeAirport.code === airport.code
                          ? "bg-sky-50 border-2 border-sky-500"
                          : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{airport.code}</span>
                            <span className="text-slate-600">-</span>
                            <span className="text-slate-700">{airport.name}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{airport.fullName}</p>
                        </div>
                        {homeAirport.code === airport.code && (
                          <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seat Preference Modal */}
      <AnimatePresence>
        {showSeatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
            onClick={() => setShowSeatModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Seat Preference</h2>
                    <p className="text-sm text-slate-500 mt-1">Choose your preferred seat type</p>
                  </div>
                  <button
                    onClick={() => setShowSeatModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {SEAT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSeatPreference(option.value);
                        setShowSeatModal(false);
                        toast({
                          title: "Seat preference updated",
                          description: `Set to ${option.label}`,
                          variant: "success",
                        });
                      }}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        seatPreference === option.value
                          ? "bg-sky-50 border-2 border-sky-500"
                          : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{option.label}</p>
                          <p className="text-sm text-slate-500 mt-0.5">{option.desc}</p>
                        </div>
                        {seatPreference === option.value && (
                          <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Delete All Data</h2>
                    <p className="text-sm text-slate-500">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete all your data? This will permanently remove:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    All your saved trips and flight history
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Your preferences and settings
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Connected account information
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteAllData}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
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
