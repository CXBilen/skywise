"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Plus,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Trip {
  id: string;
  destination: string;
  origin: string;
  departureDate: string;
  returnDate?: string;
  status: "upcoming" | "completed" | "cancelled";
  flights: {
    id: string;
    airline: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureAirport: string;
    arrivalAirport: string;
  }[];
  calendarSynced: boolean;
}

const mockTrips: Trip[] = [
  {
    id: "1",
    destination: "San Francisco",
    origin: "New York",
    departureDate: "2025-01-28",
    returnDate: "2025-01-31",
    status: "upcoming",
    calendarSynced: true,
    flights: [
      {
        id: "f1",
        airline: "United",
        flightNumber: "UA 442",
        departureTime: "11:30",
        arrivalTime: "14:45",
        departureAirport: "JFK",
        arrivalAirport: "SFO",
      },
      {
        id: "f2",
        airline: "United",
        flightNumber: "UA 891",
        departureTime: "18:00",
        arrivalTime: "02:15+1",
        departureAirport: "SFO",
        arrivalAirport: "JFK",
      },
    ],
  },
  {
    id: "2",
    destination: "Chicago",
    origin: "New York",
    departureDate: "2025-02-15",
    status: "upcoming",
    calendarSynced: false,
    flights: [
      {
        id: "f3",
        airline: "American",
        flightNumber: "AA 178",
        departureTime: "09:00",
        arrivalTime: "11:15",
        departureAirport: "JFK",
        arrivalAirport: "ORD",
      },
    ],
  },
  {
    id: "3",
    destination: "Miami",
    origin: "Boston",
    departureDate: "2025-02-20",
    returnDate: "2025-02-24",
    status: "upcoming",
    calendarSynced: true,
    flights: [
      {
        id: "f5",
        airline: "JetBlue",
        flightNumber: "B6 917",
        departureTime: "06:45",
        arrivalTime: "10:30",
        departureAirport: "BOS",
        arrivalAirport: "MIA",
      },
      {
        id: "f6",
        airline: "JetBlue",
        flightNumber: "B6 622",
        departureTime: "19:15",
        arrivalTime: "22:45",
        departureAirport: "MIA",
        arrivalAirport: "BOS",
      },
    ],
  },
  {
    id: "4",
    destination: "Seattle",
    origin: "Los Angeles",
    departureDate: "2025-03-05",
    status: "upcoming",
    calendarSynced: false,
    flights: [
      {
        id: "f7",
        airline: "Alaska",
        flightNumber: "AS 1284",
        departureTime: "14:20",
        arrivalTime: "17:05",
        departureAirport: "LAX",
        arrivalAirport: "SEA",
      },
    ],
  },
  {
    id: "5",
    destination: "Denver",
    origin: "Dallas",
    departureDate: "2025-03-12",
    returnDate: "2025-03-14",
    status: "upcoming",
    calendarSynced: true,
    flights: [
      {
        id: "f8",
        airline: "Southwest",
        flightNumber: "WN 2341",
        departureTime: "08:00",
        arrivalTime: "09:15",
        departureAirport: "DFW",
        arrivalAirport: "DEN",
      },
      {
        id: "f9",
        airline: "Southwest",
        flightNumber: "WN 1876",
        departureTime: "16:30",
        arrivalTime: "19:40",
        departureAirport: "DEN",
        arrivalAirport: "DFW",
      },
    ],
  },
  {
    id: "6",
    destination: "Los Angeles",
    origin: "New York",
    departureDate: "2025-01-10",
    returnDate: "2025-01-12",
    status: "completed",
    calendarSynced: true,
    flights: [
      {
        id: "f10",
        airline: "Delta",
        flightNumber: "DL 456",
        departureTime: "07:30",
        arrivalTime: "10:45",
        departureAirport: "JFK",
        arrivalAirport: "LAX",
      },
    ],
  },
  {
    id: "7",
    destination: "Austin",
    origin: "Phoenix",
    departureDate: "2025-01-05",
    returnDate: "2025-01-07",
    status: "completed",
    calendarSynced: true,
    flights: [
      {
        id: "f11",
        airline: "American",
        flightNumber: "AA 2156",
        departureTime: "10:15",
        arrivalTime: "14:30",
        departureAirport: "PHX",
        arrivalAirport: "AUS",
      },
      {
        id: "f12",
        airline: "American",
        flightNumber: "AA 1089",
        departureTime: "17:45",
        arrivalTime: "18:50",
        departureAirport: "AUS",
        arrivalAirport: "PHX",
      },
    ],
  },
  {
    id: "8",
    destination: "Orlando",
    origin: "Atlanta",
    departureDate: "2024-12-20",
    returnDate: "2024-12-27",
    status: "completed",
    calendarSynced: true,
    flights: [
      {
        id: "f13",
        airline: "Delta",
        flightNumber: "DL 1923",
        departureTime: "09:00",
        arrivalTime: "10:45",
        departureAirport: "ATL",
        arrivalAirport: "MCO",
      },
      {
        id: "f14",
        airline: "Delta",
        flightNumber: "DL 2087",
        departureTime: "18:30",
        arrivalTime: "20:10",
        departureAirport: "MCO",
        arrivalAirport: "ATL",
      },
    ],
  },
  {
    id: "9",
    destination: "Las Vegas",
    origin: "San Francisco",
    departureDate: "2024-12-31",
    returnDate: "2025-01-02",
    status: "completed",
    calendarSynced: false,
    flights: [
      {
        id: "f15",
        airline: "Spirit",
        flightNumber: "NK 345",
        departureTime: "16:00",
        arrivalTime: "17:30",
        departureAirport: "SFO",
        arrivalAirport: "LAS",
      },
      {
        id: "f16",
        airline: "Spirit",
        flightNumber: "NK 512",
        departureTime: "21:00",
        arrivalTime: "22:35",
        departureAirport: "LAS",
        arrivalAirport: "SFO",
      },
    ],
  },
];

export default function TripsPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const filteredTrips = mockTrips.filter((trip) => {
    if (filter === "all") return true;
    return trip.status === filter;
  });

  const upcomingCount = mockTrips.filter((t) => t.status === "upcoming").length;
  const completedCount = mockTrips.filter((t) => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Trips</h1>
            <p className="text-slate-500 mt-1">
              {upcomingCount} upcoming · {completedCount} completed
            </p>
          </div>
          <Link href="/chat">
            <Button className="bg-sky-500 hover:bg-sky-600">
              <Plus className="w-4 h-4 mr-2" />
              New Trip
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { key: "all", label: "All Trips" },
            { key: "upcoming", label: "Upcoming" },
            { key: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-sky-500 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {filteredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-5 bg-white border-slate-200 hover:border-sky-400 hover:shadow-lg transition-all cursor-pointer ${
                  trip.status === "completed" ? "opacity-75" : ""
                }`}
                onClick={() => setSelectedTrip(selectedTrip === trip.id ? null : trip.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        trip.status === "upcoming"
                          ? "bg-sky-100 text-sky-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Plane className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {trip.origin} → {trip.destination}
                        </h3>
                        {trip.status === "upcoming" && (
                          <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                            Upcoming
                          </span>
                        )}
                        {trip.status === "completed" && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="whitespace-nowrap">
                            {new Date(trip.departureDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            {trip.returnDate && (
                              <>
                                {" - "}
                                {new Date(trip.returnDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </>
                            )}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          {trip.flights.length} flight{trip.flights.length > 1 ? "s" : ""}
                        </span>
                        {trip.calendarSynced && (
                          <span className="flex items-center gap-1 text-emerald-600 whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span className="hidden sm:inline">Calendar synced</span>
                            <span className="sm:hidden">Synced</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      selectedTrip === trip.id ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {/* Expanded Flight Details */}
                {selectedTrip === trip.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-100"
                  >
                    <div className="space-y-3">
                      {trip.flights.map((flight) => (
                        <div
                          key={flight.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-xl gap-2"
                        >
                          <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
                            <div className="text-center shrink-0">
                              <p className="text-sm sm:text-lg font-semibold text-slate-900">
                                {flight.departureTime}
                              </p>
                              <p className="text-[10px] sm:text-xs text-slate-500">{flight.departureAirport}</p>
                            </div>
                            <div className="flex items-center gap-1 px-1 sm:px-4 flex-1 min-w-0 justify-center">
                              <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-slate-300 shrink-0" />
                              <div className="flex-1 max-w-[20px] sm:max-w-[64px] h-px bg-slate-300" />
                              <Plane className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                              <div className="flex-1 max-w-[20px] sm:max-w-[64px] h-px bg-slate-300" />
                              <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-slate-300 shrink-0" />
                            </div>
                            <div className="text-center shrink-0">
                              <p className="text-sm sm:text-lg font-semibold text-slate-900">
                                {flight.arrivalTime}
                              </p>
                              <p className="text-[10px] sm:text-xs text-slate-500">{flight.arrivalAirport}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs sm:text-base font-medium text-slate-900">{flight.flightNumber}</p>
                            <p className="text-[10px] sm:text-sm text-slate-500">{flight.airline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      {trip.status === "upcoming" ? (
                        <>
                          <Button variant="outline" size="sm" className="text-slate-600">
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Cancel Trip
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm" className="text-slate-600 hover:bg-slate-100">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove from History
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Plane className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No trips found</h3>
            <p className="text-slate-500 mb-4">
              {filter === "upcoming"
                ? "You don't have any upcoming trips."
                : filter === "completed"
                ? "You haven't completed any trips yet."
                : "Start planning your next adventure!"}
            </p>
            <Link href="/chat">
              <Button className="bg-sky-500 hover:bg-sky-600">
                <Plus className="w-4 h-4 mr-2" />
                Plan a Trip
              </Button>
            </Link>
          </div>
        )}
      </main>

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
