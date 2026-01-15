'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowRight, Plane, Home, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const DOCS = [
  {
    slug: 'INDEX',
    title: 'Documentation Index',
    description: 'Overview of all documentation and quick links',
    category: 'Overview',
  },
  {
    slug: 'UX_RESEARCH',
    title: 'UX Research',
    description: 'Problem framing, research methodology, key findings',
    category: 'Research',
  },
  {
    slug: 'PERSONAS',
    title: 'User Personas',
    description: 'Detailed user profiles with jobs-to-be-done',
    category: 'Research',
  },
  {
    slug: 'USER_FLOWS',
    title: 'User Flows',
    description: 'Visual flow diagrams for all user journeys',
    category: 'Design',
  },
  {
    slug: 'COMPETITIVE_ANALYSIS',
    title: 'Competitive Analysis',
    description: 'Market positioning and differentiation strategy',
    category: 'Research',
  },
  {
    slug: 'DESIGN_DECISIONS',
    title: 'Design Decisions',
    description: 'Rationale for key design choices and trade-offs',
    category: 'Design',
  },
  {
    slug: 'CASE_STUDY_MAPPING',
    title: 'Case Study Mapping',
    description: 'Requirements to implementation mapping',
    category: 'Planning',
  },
  {
    slug: 'ARCHITECTURE',
    title: 'Architecture',
    description: 'Technical architecture and data flows',
    category: 'Technical',
  },
];

const CATEGORIES = ['Overview', 'Research', 'Design', 'Planning', 'Technical'];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">Documentation</h1>
              <p className="text-xs text-slate-500">SkyWise Case Study</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-2 sm:px-3">
                <Home className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link href="/presentation">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-2 sm:px-3">
                <Presentation className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Presentation</span>
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

      {/* Hero */}
      <div className="px-6 py-12 pt-32 text-center bg-slate-50 border-b border-slate-200">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-xl shadow-sky-500/20 mb-6"
        >
          <Plane className="h-8 w-8 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-3"
        >
          Case Study Documentation
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-600 max-w-xl mx-auto"
        >
          Explore the UX research, design decisions, and technical architecture behind SkyWise
        </motion.p>
      </div>

      {/* Documents Grid */}
      <div className="px-6 py-12 max-w-6xl mx-auto">
        {CATEGORIES.map((category, catIndex) => {
          const categoryDocs = DOCS.filter((doc) => doc.category === category);
          if (categoryDocs.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + catIndex * 0.1 }}
              className="mb-8"
            >
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryDocs.map((doc, index) => (
                  <Link key={doc.slug} href={`/docs/${doc.slug}`}>
                    <Card className="p-5 bg-white border-slate-200 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 transition-all cursor-pointer h-full">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-sky-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{doc.title}</h3>
                          <p className="text-sm text-slate-500">{doc.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
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
