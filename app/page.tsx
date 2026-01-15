"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, ArrowRight, Mail, Calendar, Shield, Sparkles, Presentation, FileText, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CHAT_FLOWS = [
  {
    id: 'booking',
    messages: [
      { type: 'assistant', text: "Hi! I'm your travel assistant. I can help you find and book flights that fit your schedule. What's your next trip?" },
      { type: 'user', text: "I need to fly to San Francisco next Tuesday for a meeting" },
      { type: 'assistant', text: "Got it! I see you have a 9am standup on Tuesday. I'll find flights that depart after that. Do you prefer SFO or Oakland?" },
    ]
  },
  {
    id: 'conflict',
    messages: [
      { type: 'assistant', text: "I found 3 flights to Chicago on March 15th. Let me check your calendar for conflicts..." },
      { type: 'assistant', text: "⚠️ Heads up! You have 'Q1 Planning' from 2-4pm that day. I'll highlight flights that work around it.", badge: 'conflict' },
      { type: 'user', text: "Show me morning flights only" },
    ]
  },
  {
    id: 'email',
    messages: [
      { type: 'user', text: "I just got a confirmation email from United Airlines" },
      { type: 'assistant', text: "I found your flight! UA442 from JFK to LAX on Jan 28th, departing 8:30 AM. Want me to add it to your calendar?", badge: 'import' },
      { type: 'user', text: "Yes, add it" },
    ]
  },
  {
    id: 'undo',
    messages: [
      { type: 'assistant', text: "✅ Done! I've added your SFO trip to your calendar for next Tuesday." },
      { type: 'assistant', text: "Changed your mind? You can undo this action within 15 seconds.", badge: 'undo' },
      { type: 'user', text: "Actually, make it Wednesday instead" },
    ]
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [currentFlow, setCurrentFlow] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCurrentFlow((prev) => (prev + 1) % CHAT_FLOWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-x-hidden scrollbar-hide">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
          className="absolute top-20 -left-20 w-96 h-96 bg-sky-400 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-lg text-white whitespace-nowrap">Efsora Case Study</h1>
              <p className="hidden sm:block text-xs text-slate-400">UX Designer (AI-Native) Position</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/presentation">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-white/10 hover:text-white px-2 sm:px-3">
                <Presentation className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Presentation</span>
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-white/10 hover:text-white px-2 sm:px-3">
                <FileText className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Docs</span>
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white px-2 sm:px-3">
                <span className="hidden sm:inline">Try Demo</span>
                <span className="sm:hidden">Demo</span>
                <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32">
        <div className="text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-2xl shadow-sky-500/30 mb-8"
          >
            <Plane className="h-10 w-10 text-white" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-4"
          >
            Fly smarter,{" "}
            <span className="gradient-text">not harder</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
          >
            Your AI travel assistant that understands your schedule, reads your
            confirmation emails, and helps you book, manage, and protect your
            travel plans—with you always in control.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-16"
          >
            <Link href="/onboarding">
              <Button size="xl" className="group">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "AI-Powered Search",
                description:
                  "Natural language flight search that understands your schedule",
              },
              {
                icon: <Mail className="h-6 w-6" />,
                title: "Email Integration",
                description:
                  "Automatically extract flight details from confirmation emails",
              },
              {
                icon: <Calendar className="h-6 w-6" />,
                title: "Calendar Sync",
                description:
                  "Detect conflicts and add trips with one-click confirmation",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "You're in Control",
                description:
                  "Review before any action, undo anytime, full transparency",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-900/5 text-left hover:shadow-xl hover:shadow-slate-900/10 transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Demo Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-900/10 overflow-hidden">
          <div className="p-4 border-b border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-4 text-sm text-slate-400">SkyWise Chat</span>
            </div>
            <div className="flex items-center gap-1">
              {CHAT_FLOWS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFlow(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentFlow ? 'w-6 bg-sky-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-4 min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFlow}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {CHAT_FLOWS[currentFlow].messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shrink-0">
                        <Plane className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 max-w-md ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-tr-md'
                        : 'bg-slate-100 rounded-tl-md'
                    }`}>
                      <p className={message.type === 'user' ? '' : 'text-slate-800'}>
                        {message.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Case Study Documentation Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Case Study Documentation</h2>
          <p className="text-slate-600">Explore the UX research and design process</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "UX Research", desc: "Problem framing & insights", href: "/docs/UX_RESEARCH" },
            { title: "User Personas", desc: "Target user profiles", href: "/docs/PERSONAS" },
            { title: "User Flows", desc: "Journey diagrams", href: "/docs/USER_FLOWS" },
            { title: "Design Decisions", desc: "Rationale & trade-offs", href: "/docs/DESIGN_DECISIONS" },
          ].map((doc, index) => (
            <Link
              key={doc.title}
              href={doc.href}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors group cursor-pointer h-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-sky-500" />
                </div>
                <p className="text-sm text-slate-600">{doc.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-sky-500" />
              <span className="font-semibold text-slate-900">SkyWise</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-slate-500 text-center">
              <div className="flex items-center gap-4">
                <Link href="/presentation" className="hover:text-sky-500 transition-colors">Presentation</Link>
                <span>•</span>
                <Link href="/docs" className="hover:text-sky-500 transition-colors">Documentation</Link>
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
