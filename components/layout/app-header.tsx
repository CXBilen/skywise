"use client";

import { Plane, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface AppHeaderProps {
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export function AppHeader({ showSettings = true, onSettingsClick }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/30 transition-shadow">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900">SkyWise</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Travel Assistant</p>
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
              href="/trips"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              My Trips
            </Link>
            <Link
              href="/import"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Import
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {showSettings && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="hidden md:flex"
              >
                <Settings className="h-5 w-5" />
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
                href="/trips"
                className="block px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link
                href="/import"
                className="block px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Import
              </Link>
              {showSettings && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSettingsClick?.();
                  }}
                  className="w-full text-left px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Settings
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
