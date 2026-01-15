import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { FileText, ArrowLeft, Home, Presentation, ArrowRight, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const DOCS_MAP: Record<string, { title: string; prev?: string; next?: string }> = {
  INDEX: { title: 'Documentation Index', next: 'UX_RESEARCH' },
  UX_RESEARCH: { title: 'UX Research', prev: 'INDEX', next: 'PERSONAS' },
  PERSONAS: { title: 'User Personas', prev: 'UX_RESEARCH', next: 'USER_FLOWS' },
  USER_FLOWS: { title: 'User Flows', prev: 'PERSONAS', next: 'COMPETITIVE_ANALYSIS' },
  COMPETITIVE_ANALYSIS: { title: 'Competitive Analysis', prev: 'USER_FLOWS', next: 'DESIGN_DECISIONS' },
  DESIGN_DECISIONS: { title: 'Design Decisions', prev: 'COMPETITIVE_ANALYSIS', next: 'CASE_STUDY_MAPPING' },
  CASE_STUDY_MAPPING: { title: 'Case Study Mapping', prev: 'DESIGN_DECISIONS', next: 'ARCHITECTURE' },
  ARCHITECTURE: { title: 'Architecture', prev: 'CASE_STUDY_MAPPING' },
};

export function generateStaticParams() {
  return Object.keys(DOCS_MAP).map((slug) => ({ slug }));
}

async function getDocContent(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'docs', `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch {
    return null;
  }
}

function parseMarkdown(content: string): string {
  // Step 1: Extract code blocks and replace with placeholders
  const codeBlocks: string[] = [];
  let processedContent = content.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const html = `<pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800 font-mono whitespace-pre">${escaped}</code></pre>`;
    codeBlocks.push(html);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Step 2: Process the rest of the markdown
  let html = processedContent
    // Escape HTML (outside code blocks)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-slate-900 mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-200">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-slate-900 mt-8 mb-6">$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold italic">$1</strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sky-600 text-sm">$1</code>')
    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean);
      const isHeader = cells.some(cell => cell.includes('---'));
      if (isHeader) return '';
      const cellHtml = cells.map(cell =>
        `<td class="px-4 py-2 border border-slate-200">${cell.trim()}</td>`
      ).join('');
      return `<tr class="hover:bg-slate-50">${cellHtml}</tr>`;
    })
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-slate-200 my-8" />')
    // Blockquotes
    .replace(/^&gt; (.*$)/gm, '<blockquote class="border-l-4 border-sky-500 pl-4 my-4 italic text-slate-600">$1</blockquote>')
    // Lists with checkboxes
    .replace(/^- \[x\] (.*$)/gm, '<li class="flex items-start gap-2 my-1"><span class="text-emerald-500">✓</span><span>$1</span></li>')
    .replace(/^- \[ \] (.*$)/gm, '<li class="flex items-start gap-2 my-1"><span class="text-slate-400">○</span><span>$1</span></li>')
    // Unordered lists
    .replace(/^- (.*$)/gm, '<li class="ml-4 my-1 list-disc list-inside text-slate-700">$1</li>')
    .replace(/^  - (.*$)/gm, '<li class="ml-8 my-1 list-circle list-inside text-slate-600">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 my-1 list-decimal list-inside text-slate-700">$1</li>')
    // Links - internal docs
    .replace(/\[([^\]]+)\]\(\.\/([^)]+)\.md\)/g, '<a href="/docs/$2" class="text-sky-600 hover:text-sky-700 underline underline-offset-2">$1</a>')
    // Links - internal routes
    .replace(/\[([^\]]+)\]\(\/([^)]+)\)/g, '<a href="/$2" class="text-sky-600 hover:text-sky-700 underline underline-offset-2">$1</a>')
    // Links - external
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-600 hover:text-sky-700 underline underline-offset-2">$1 ↗</a>')
    // Links - relative paths
    .replace(/\[([^\]]+)\]\(\.\.\/([^)]+)\)/g, '<span class="text-slate-500">$1</span>')
    // Paragraphs
    .replace(/^(?!<[h|l|p|b|c|t|u|d|a|s|hr|_])((?!^\s*$).+)$/gm, '<p class="text-slate-700 my-3 leading-relaxed">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="[^"]*"><\/p>/g, '')
    // Wrap tables
    .replace(/(<tr[^>]*>[\s\S]*?<\/tr>)+/g, '<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 text-sm">$&</table></div>');

  // Step 3: Restore code blocks
  codeBlocks.forEach((block, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return html;
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const docInfo = DOCS_MAP[slug];

  if (!docInfo) {
    notFound();
  }

  const content = await getDocContent(slug);

  if (!content) {
    notFound();
  }

  const htmlContent = parseMarkdown(content);

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
              <h1 className="font-bold text-xs sm:text-lg text-slate-900 whitespace-nowrap">{docInfo.title}</h1>
              <p className="hidden sm:block text-xs text-slate-500">SkyWise Documentation</p>
            </div>
            <Link href="/docs">
              <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-2 sm:px-3">
                <Home className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link href="/presentation" className="hidden sm:block">
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 pt-32">
        <article
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-slate-200">
          <div className="flex justify-start">
            {docInfo.prev ? (
              <Link href={`/docs/${docInfo.prev}`}>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs sm:text-sm">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">{DOCS_MAP[docInfo.prev]?.title}</span>
                </Button>
              </Link>
            ) : null}
          </div>
          <div className="flex justify-end">
            {docInfo.next ? (
              <Link href={`/docs/${docInfo.next}`}>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs sm:text-sm">
                  <span className="truncate">{DOCS_MAP[docInfo.next]?.title}</span>
                  <ArrowRight className="w-4 h-4 ml-1 sm:ml-2 flex-shrink-0" />
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </main>

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
