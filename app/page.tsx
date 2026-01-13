"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Mail, Calendar, Shield, Sparkles, Presentation, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Efsora Presentation Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                <Presentation className="h-5 w-5 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-white font-semibold">Efsora Labs Case Study</p>
                <p className="text-slate-400 text-sm">UX Designer (AI-Native) Position</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/presentation">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                  <Presentation className="h-4 w-4 mr-2" />
                  View Presentation
                </Button>
              </Link>
              <Link href="https://github.com/yourusername/skywise" target="_blank">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
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

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/onboarding">
              <Button size="xl" className="group">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="xl" variant="outline">
                Try Demo
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
          <div className="p-4 border-b border-slate-200/60 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-4 text-sm text-slate-400">SkyWise Chat</span>
          </div>
          <div className="p-6 md:p-8 space-y-4">
            {/* Sample conversation */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shrink-0">
                <Plane className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
                <p className="text-slate-800">
                  Hi! I&apos;m your travel assistant. I can help you find and book
                  flights that fit your schedule. What&apos;s your next trip?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-md">
                <p>I need to fly to San Francisco next Tuesday for a meeting</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shrink-0">
                <Plane className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
                <p className="text-slate-800">
                  Got it! I see you have a 9am standup on Tuesday. I&apos;ll find
                  flights that depart after that. Do you prefer SFO or Oakland?
                </p>
              </div>
            </div>
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
            { title: "UX Research", desc: "Problem framing & insights", href: "/docs/UX_RESEARCH.md" },
            { title: "User Personas", desc: "Target user profiles", href: "/docs/PERSONAS.md" },
            { title: "User Flows", desc: "Journey diagrams", href: "/docs/USER_FLOWS.md" },
            { title: "Design Decisions", desc: "Rationale & trade-offs", href: "/docs/DESIGN_DECISIONS.md" },
          ].map((doc, index) => (
            <motion.a
              key={doc.title}
              href={doc.href}
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-sky-500" />
              </div>
              <p className="text-sm text-slate-600">{doc.desc}</p>
            </motion.a>
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
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link href="/presentation" className="hover:text-sky-500 transition-colors">Presentation</Link>
              <span>•</span>
              <Link href="/chat" className="hover:text-sky-500 transition-colors">Demo</Link>
              <span>•</span>
              <span>Efsora Labs Case Study</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
