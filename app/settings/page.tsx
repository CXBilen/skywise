"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function SettingsPage() {
  const { toast } = useToast();
  const [emailConnected, setEmailConnected] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(true);
  const [autoImport, setAutoImport] = useState(true);
  const [conflictAlerts, setConflictAlerts] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <AppHeader showSettings={false} />

      <main className="max-w-2xl mx-auto px-4 py-8">
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
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-500">
                      {emailConnected ? "Read-only access" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {emailConnected ? (
                    <>
                      <Badge variant="fits">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect("email")}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect("email")}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              {/* Calendar */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Calendar</p>
                    <p className="text-sm text-slate-500">
                      {calendarConnected ? "Read & write access" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {calendarConnected ? (
                    <>
                      <Badge variant="fits">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect("calendar")}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect("calendar")}>
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
                    <p className="text-sm text-slate-500">JFK - New York</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
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
                    <p className="text-sm text-slate-500">Window</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
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
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back to Chat */}
          <div className="flex justify-center pt-4">
            <Link href="/chat">
              <Button variant="outline">Back to Chat</Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
