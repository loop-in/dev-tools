'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { downloadFile } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Download, Eye, Code } from 'lucide-react';
import DOMPurify from 'dompurify';

const DEFAULT_MD = `# Welcome to Markdown Preview

Write **bold**, _italic_, or ~~strikethrough~~ text.

## Features
- Live preview
- Syntax highlighted code blocks
- Tables support

## Code Example

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet('World'));
\`\`\`

## Table

| Name    | Role      | Status |
|---------|-----------|--------|
| Alice   | Dev       | ✅ Active |
| Bob     | Designer  | ✅ Active |

> Blockquotes look great too!

---
Made with DevUtils 🚀
`;

export function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [html, setHtml] = useState('');
  const [view, setView] = useState<'split' | 'preview' | 'source'>('split');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import('marked').then(({ marked }) => {
      if (!cancelled) setHtml(DOMPurify.sanitize(marked(markdown) as string));
    });
    return () => { cancelled = true; };
  }, [markdown]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {(['split', 'source', 'preview'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium capitalize flex items-center gap-1.5 transition-colors ${view === v
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
            >
              {v === 'source' && <Code size={12} />}
              {v === 'preview' && <Eye size={12} />}
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={markdown} size="sm" />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => downloadFile(markdown, 'document.md')}
          >
            <Download size={13} /> Download
          </Button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className={`grid gap-4 ${view === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {(view === 'split' || view === 'source') && (
          <div>
            <span className="section-label">Markdown</span>
            <Textarea
              monospace
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[480px]"
            />
          </div>
        )}

        {(view === 'split' || view === 'preview') && (
          <div>
            <span className="section-label">Preview</span>
            <div
              ref={previewRef}
              className="min-h-[480px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 overflow-auto prose prose-zinc dark:prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 { font-family: var(--font-display); font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.2; }
        .prose h1 { font-size: 2.25em; }
        .prose h2 { font-size: 1.5em; }
        .prose h3 { font-size: 1.25em; }
        .prose h4 { font-size: 1em; }
        .prose p { margin-top: 0; margin-bottom: 1em; }
        .prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .prose ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .prose li { margin-bottom: 0.25em; }
        .prose strong { font-weight: 600; }
        .prose a { color: #3b82f6; text-decoration: underline; }
        .prose hr { margin: 2em 0; border: 0; border-top: 1px solid #e4e4e7; }
        .dark .prose hr { border-top-color: #3f3f46; }
        .prose pre { background: #18181b; color: #e4e4e7; border-radius: 8px; padding: 1rem; overflow: auto; font-size: 0.75rem; margin-bottom: 1em; }
        .prose code:not(pre code) { background: #f4f4f5; color: #be123c; border-radius: 4px; padding: 2px 5px; font-size: 0.8em; }
        .dark .prose code:not(pre code) { background: #27272a; color: #fb7185; }
        .prose table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
        .prose th, .prose td { border: 1px solid #e4e4e7; padding: 6px 12px; text-align: left; font-size: 0.8rem; }
        .dark .prose th, .dark .prose td { border-color: #3f3f46; }
        .prose th { background: #f4f4f5; font-weight: 600; }
        .dark .prose th { background: #27272a; }
        .prose blockquote { border-left: 3px solid #22c55e; padding-left: 1rem; margin: 0 0 1em 0; color: #71717a; font-style: italic; }
      `}</style>
    </div>
  );
}
