'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Calendar,
  Mail,
  MessageSquare,
  Shield,
  Undo2,
  CheckCircle2,
  AlertTriangle,
  Users,
  Target,
  Lightbulb,
  Layers,
  Smartphone,
  Monitor,
  ArrowRight,
  ExternalLink,
  Github,
  Figma,
  Sparkles,
  Quote,
  BarChart3,
  Clock,
  Zap,
  Eye,
  Heart,
  Brain,
  Plane,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// ============================================
// Types
// ============================================

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  type: 'hero' | 'content' | 'feature' | 'quote' | 'demo' | 'summary';
}

// ============================================
// Slides Data
// ============================================

const SLIDES: Slide[] = [
  { id: 'hero', title: 'SkyWise', subtitle: 'AI-Powered Travel Assistant', type: 'hero' },
  { id: 'problem', title: 'The Problem', subtitle: 'Why Travel Booking is Broken', type: 'content' },
  { id: 'users', title: 'Our Users', subtitle: 'Who We Design For', type: 'content' },
  { id: 'solution', title: 'The Solution', subtitle: 'Calendar-First AI Booking', type: 'content' },
  { id: 'feature-chat', title: 'Conversational Booking', subtitle: 'Natural Language, No Forms', type: 'feature' },
  { id: 'feature-calendar', title: 'Calendar Integration', subtitle: 'Know Conflicts Before You Search', type: 'feature' },
  { id: 'feature-email', title: 'Email Import', subtitle: 'Auto-Extract Flight Details', type: 'feature' },
  { id: 'feature-trust', title: 'Trust-First Design', subtitle: 'Undo, Confirm, Control', type: 'feature' },
  { id: 'principles', title: 'Design Principles', subtitle: 'Our Guiding Philosophy', type: 'content' },
  { id: 'demo', title: 'Live Demo', subtitle: 'See It In Action', type: 'demo' },
  { id: 'metrics', title: 'Success Metrics', subtitle: 'How We Measure Impact', type: 'content' },
  { id: 'summary', title: 'Summary', subtitle: 'Key Takeaways', type: 'summary' },
];

// ============================================
// Presentation Page Component
// ============================================

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide((s) => s + 1);
          } else {
            setIsPlaying(false);
          }
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        setIsPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const goNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((s) => s + 1);
      setProgress(0);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
      setProgress(0);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">SkyWise Case Study</h1>
            <p className="text-xs text-slate-400">Efsora Labs Presentation</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span>{currentSlide + 1}</span>
            <span>/</span>
            <span>{SLIDES.length}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:bg-white/10"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="ml-2">{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </Button>
          <Link href="/chat">
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
              Try Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-[73px] left-0 right-0 z-40 h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="pt-20 min-h-screen flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl"
          >
            {renderSlide(SLIDES[currentSlide])}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-lg border-t border-white/10">
        {/* Slide Dots */}
        <div className="hidden md:flex items-center gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'w-8 bg-sky-500'
                  : index < currentSlide
                  ? 'bg-sky-500/50'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              title={slide.title}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goNext}
            disabled={currentSlide === SLIDES.length - 1}
            className="text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Current Slide Title */}
        <div className="hidden md:block text-sm text-slate-400">
          {SLIDES[currentSlide].title}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Slide Renderers
// ============================================

function renderSlide(slide: Slide) {
  switch (slide.id) {
    case 'hero':
      return <HeroSlide />;
    case 'problem':
      return <ProblemSlide />;
    case 'users':
      return <UsersSlide />;
    case 'solution':
      return <SolutionSlide />;
    case 'feature-chat':
      return <FeatureChatSlide />;
    case 'feature-calendar':
      return <FeatureCalendarSlide />;
    case 'feature-email':
      return <FeatureEmailSlide />;
    case 'feature-trust':
      return <FeatureTrustSlide />;
    case 'principles':
      return <PrinciplesSlide />;
    case 'demo':
      return <DemoSlide />;
    case 'metrics':
      return <MetricsSlide />;
    case 'summary':
      return <SummarySlide />;
    default:
      return null;
  }
}

// ============================================
// Individual Slide Components
// ============================================

function HeroSlide() {
  return (
    <div className="text-center py-20">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-2xl shadow-sky-500/30"
      >
        <Plane className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
      >
        SkyWise
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl md:text-2xl text-slate-400 mb-8"
      >
        AI-Powered Travel Assistant
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-4 text-sm text-slate-500"
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Calendar Integration
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Import
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Conversational UI
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-slate-600"
      >
        <p>UX Design Case Study</p>
        <p className="text-sky-500 font-medium mt-1">Efsora Labs</p>
      </motion.div>
    </div>
  );
}

function ProblemSlide() {
  const problems = [
    { icon: Clock, title: '18 minutes', desc: 'Average time to book a flight' },
    { icon: AlertTriangle, title: '23%', desc: 'Business travelers with calendar conflicts' },
    { icon: Layers, title: '5+ apps', desc: 'Used during booking process' },
    { icon: Eye, title: '34%', desc: 'Drop-off due to AI distrust' },
  ];

  return (
    <div className="py-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">The Problem</h2>
      <p className="text-xl text-slate-400 text-center mb-12">Travel booking is fragmented and frustrating</p>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <problem.icon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{problem.title}</h3>
                  <p className="text-slate-400 mt-1">{problem.desc}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Card className="inline-block p-6 bg-slate-800/50 border-slate-700">
          <Quote className="w-8 h-8 text-sky-500 mx-auto mb-4" />
          <p className="text-lg text-slate-300 italic max-w-2xl">
            "I booked a flight to Chicago, only to realize I had an all-day offsite.
            Had to pay $400 to change the flight."
          </p>
          <p className="text-sm text-slate-500 mt-4">— User Interview #7, VP of Sales</p>
        </Card>
      </motion.div>
    </div>
  );
}

function UsersSlide() {
  return (
    <div className="py-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Users</h2>
      <p className="text-xl text-slate-400 text-center mb-12">Designed for busy travelers who value their time</p>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Persona 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-sky-500/10 to-transparent border-sky-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center text-3xl">
                👨‍💼
              </div>
              <div>
                <h3 className="text-xl font-bold">Marcus Chen</h3>
                <p className="text-slate-400">VP of Sales, 42</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 italic">
              "Time is money. Every minute I spend booking flights is a minute I'm not closing deals."
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Flights/month</span>
                <span className="text-white font-medium">4-6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Top need</span>
                <span className="text-sky-400 font-medium">Speed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Key feature</span>
                <span className="text-white font-medium">Calendar conflict detection</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Persona 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-3xl">
                👩‍💻
              </div>
              <div>
                <h3 className="text-xl font-bold">Emma Rodriguez</h3>
                <p className="text-slate-400">UX Designer, 29</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 italic">
              "I love planning trips, but I hate when things don't sync properly across all my apps."
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Trips/year</span>
                <span className="text-white font-medium">6-8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Top need</span>
                <span className="text-purple-400 font-medium">Organization</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Key feature</span>
                <span className="text-white font-medium">Email import</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function SolutionSlide() {
  return (
    <div className="py-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">The Solution</h2>
      <p className="text-xl text-slate-400 text-center mb-12">A calendar-first AI travel assistant you can trust</p>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Card className="p-8 bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10 border-white/10">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-500/20 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-sky-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Natural Language</h3>
                <p className="text-slate-400 text-sm">"Book me a flight to SF tomorrow"</p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Calendar-First</h3>
                <p className="text-slate-400 text-sm">Conflicts detected before you search</p>
              </div>
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Email Import</h3>
                <p className="text-slate-400 text-sm">Auto-extract with confidence scores</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl font-light text-slate-300">
            <span className="text-sky-400 font-medium">18 minutes</span> →
            <span className="text-emerald-400 font-medium"> 2 minutes</span>
          </p>
          <p className="text-slate-500 mt-2">Average booking time</p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureChatSlide() {
  return (
    <div className="py-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-sky-400" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold">Conversational Booking</h2>
      </div>
      <p className="text-xl text-slate-400 text-center mb-12">Type naturally, book instantly</p>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold">U</div>
                <div className="bg-sky-500/20 rounded-2xl rounded-tl-sm px-4 py-2 text-sm">
                  I need to fly to San Francisco next Tuesday
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                </div>
                <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-2 text-sm">
                  <p>I'll search for flights to San Francisco. Let me check your calendar for next Tuesday...</p>
                  <p className="text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> No conflicts found!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1" />
            <div>
              <h4 className="font-medium">Natural Language Understanding</h4>
              <p className="text-slate-400 text-sm">Understands "next Tuesday", "tomorrow", "Jan 21"</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1" />
            <div>
              <h4 className="font-medium">Multi-turn Conversations</h4>
              <p className="text-slate-400 text-sm">Builds context across messages</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1" />
            <div>
              <h4 className="font-medium">Smart Clarifications</h4>
              <p className="text-slate-400 text-sm">Asks for missing info naturally</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCalendarSlide() {
  return (
    <div className="py-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold">Calendar Integration</h2>
      </div>
      <p className="text-xl text-slate-400 text-center mb-12">Know conflicts before you search, not after</p>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-red-500/10 border-red-500/30">
              <h3 className="font-bold text-lg mb-4 text-red-400">Before SkyWise</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">1</span>
                  Search for flights
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">2</span>
                  Select a flight
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">3</span>
                  Enter payment info
                </div>
                <div className="flex items-center gap-2 text-red-400 font-medium">
                  <span className="w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center text-xs">4</span>
                  Realize you have a meeting!
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">5</span>
                  Start over...
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-emerald-500/10 border-emerald-500/30">
              <h3 className="font-bold text-lg mb-4 text-emerald-400">With SkyWise</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">1</span>
                  "Book a flight to Chicago"
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-xs">2</span>
                  Calendar check (auto)
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">3</span>
                  See flights with conflict badges
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">4</span>
                  Make informed choice
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-6 h-6" />
                  Done!
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureEmailSlide() {
  return (
    <div className="py-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Mail className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold">Email Import</h2>
      </div>
      <p className="text-xl text-slate-400 text-center mb-12">Auto-extract flight details with confidence scores</p>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-medium">United Airlines Confirmation</p>
                <p className="text-sm text-slate-400">unitedairlines@united.com</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-sm text-slate-400">Flight Number</p>
                  <p className="font-medium">UA442</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  98%
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-sm text-slate-400">Route</p>
                  <p className="font-medium">JFK → SFO</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  95%
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <div>
                  <p className="text-sm text-slate-400">Departure Time</p>
                  <p className="font-medium">8:30 AM</p>
                </div>
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  72% - Verify
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                Edit Details
              </Button>
              <Button className="flex-1 bg-sky-500 hover:bg-sky-600">
                Add to Calendar
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureTrustSlide() {
  return (
    <div className="py-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold">Trust-First Design</h2>
      </div>
      <p className="text-xl text-slate-400 text-center mb-12">Undo anything. Confirm everything. Stay in control.</p>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-slate-800/50 border-slate-700 h-full">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
              <Undo2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">15-Second Undo</h3>
            <p className="text-slate-400 text-sm">
              Every action can be reversed within 15 seconds. Hover to pause the timer.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-slate-800/50 border-slate-700 h-full">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Explicit Confirmations</h3>
            <p className="text-slate-400 text-sm">
              Calendar writes always require explicit approval. Never automatic.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-slate-800/50 border-slate-700 h-full">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Transparent AI</h3>
            <p className="text-slate-400 text-sm">
              See confidence scores. Know what the AI extracted. Edit anything.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function PrinciplesSlide() {
  const principles = [
    { icon: Brain, title: 'AI Suggests, User Decides', desc: 'AI recommends, never acts unilaterally' },
    { icon: CheckCircle2, title: 'No Writes Without Confirmation', desc: 'Calendar changes always require approval' },
    { icon: Undo2, title: 'Always Reversible', desc: 'Every action can be undone' },
    { icon: Eye, title: 'Show Your Work', desc: 'Confidence levels and sources visible' },
  ];

  return (
    <div className="py-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Design Principles</h2>
      <p className="text-xl text-slate-400 text-center mb-12">Our guiding philosophy for every decision</p>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {principles.map((principle, index) => (
          <motion.div
            key={principle.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-slate-800/50 border-slate-700 hover:border-sky-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <principle.icon className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{principle.title}</h3>
                  <p className="text-slate-400 mt-1">{principle.desc}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DemoSlide() {
  return (
    <div className="py-12 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Live Demo</h2>
      <p className="text-xl text-slate-400 mb-12">Experience SkyWise in action</p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-sky-500/10 to-purple-500/10 border-white/10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
            <Play className="w-10 h-10 text-white ml-1" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Try the Interactive Demo</h3>
          <p className="text-slate-400 mb-6">
            Book a flight, import from email, or see conflict detection in action
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-600 w-full sm:w-auto">
                <MessageSquare className="w-5 h-5 mr-2" />
                Open Chat Demo
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2" />
                Start Onboarding
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500"
      >
        <span className="flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Desktop
        </span>
        <span className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Mobile Responsive
        </span>
      </motion.div>
    </div>
  );
}

function MetricsSlide() {
  const metrics = [
    { label: 'Time to Book', before: '18 min', after: '2 min', improvement: '89%' },
    { label: 'Calendar Conflicts', before: '23%', after: '<5%', improvement: '78%' },
    { label: 'Booking Completion', before: '66%', after: '92%', improvement: '39%' },
    { label: 'User Satisfaction', before: '3.2/5', after: '4.7/5', improvement: '47%' },
  ];

  return (
    <div className="py-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Success Metrics</h2>
      <p className="text-xl text-slate-400 text-center mb-12">Measurable impact on user experience</p>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h3 className="font-medium text-slate-400 mb-4">{metric.label}</h3>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Before</p>
                    <p className="text-2xl font-bold text-slate-400">{metric.before}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-sky-500" />
                  <div>
                    <p className="text-sm text-slate-500">After</p>
                    <p className="text-2xl font-bold text-emerald-400">{metric.after}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Improvement</p>
                    <p className="text-2xl font-bold text-sky-400">{metric.improvement}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummarySlide() {
  return (
    <div className="py-12 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Key Takeaways</h2>
      <p className="text-xl text-slate-400 mb-12">What makes SkyWise unique</p>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 text-left mb-12"
        >
          {[
            { icon: Calendar, text: 'Calendar-first approach prevents conflicts before they happen' },
            { icon: MessageSquare, text: 'Conversational UI reduces booking time by 89%' },
            { icon: Mail, text: 'Email import with confidence scores builds user trust' },
            { icon: Shield, text: 'Trust-first design with undo, confirm, and transparency' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-slate-300">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/chat">
            <Button size="lg" className="bg-sky-500 hover:bg-sky-600 w-full sm:w-auto">
              Try the Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="https://github.com" target="_blank">
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full sm:w-auto">
              <Github className="w-5 h-5 mr-2" />
              View Source
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-slate-800"
        >
          <p className="text-slate-500">Thank you for your attention!</p>
          <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
            Questions?
          </p>
        </motion.div>
      </div>
    </div>
  );
}
