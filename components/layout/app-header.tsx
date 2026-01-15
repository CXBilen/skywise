"use client";

import { Plane, Settings, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface AppHeaderProps {
  showSettings?: boolean;
  showLogout?: boolean;
  onLogout?: () => void;
}

export function AppHeader({ showSettings = true, showLogout = false, onLogout }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/30 transition-shadow">
              <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">SkyWise</h1>
              <p className="hidden sm:block text-xs text-slate-500 -mt-0.5">Travel Assistant</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/chat"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/import"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Import Flights
            </Link>
            <Link
              href="/trips"
              data-tour-id="nav-trips"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              My Trips
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {showSettings && (
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {showLogout && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-slate-600 hover:text-red-600"
                onClick={onLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200"
          >
            <nav className="px-4 py-4 space-y-2">
              <Link
                href="/chat"
                className="block px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Chat
              </Link>
              <Link
                href="/import"
                className="block px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Import Flights
              </Link>
              <Link
                href="/trips"
                className="block px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              {showSettings && (
                <Link
                  href="/settings"
                  className="block px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
              )}
              {showLogout && (
                <button
                  className="block w-full text-left px-4 py-2 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout?.();
                  }}
                >
                  Logout
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
