'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FileCode2, Palette, FileJson, Play, Terminal, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

/** Defense-in-depth CSP for the sandboxed iframe (Chrome/Edge only). */
const IFRAME_CSP = "default-src 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:; font-src *; style-src 'unsafe-inline' *;";

/**
 * Injected into the iframe to intercept console calls and runtime errors,
 * forwarding them to the parent page via postMessage.
 */
const CONSOLE_INTERCEPT_SCRIPT = `
(function() {
  var orig = { log: console.log, warn: console.warn, error: console.error, info: console.info };
  function send(level, args) {
    var msg = Array.prototype.map.call(args, function(a) {
      try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
      catch(e) { return String(a); }
    }).join(' ');
    parent.postMessage({ type: 'playground-console', level: level, message: msg }, '*');
  }
  console.log   = function() { send('log',   arguments); orig.log.apply(console, arguments); };
  console.warn  = function() { send('warn',  arguments); orig.warn.apply(console, arguments); };
  console.error = function() { send('error', arguments); orig.error.apply(console, arguments); };
  console.info  = function() { send('info',  arguments); orig.info.apply(console, arguments); };

  window.onerror = function(msg, src, line, col) {
    var detail = msg + (line ? ' (line ' + line + (col ? ':' + col : '') + ')' : '');
    parent.postMessage({ type: 'playground-console', level: 'error', message: detail }, '*');
    return true;
  };
  window.addEventListener('unhandledrejection', function(e) {
    var reason = e.reason && e.reason.message ? e.reason.message : String(e.reason || 'Unknown');
    parent.postMessage({ type: 'playground-console', level: 'error', message: 'Unhandled Promise: ' + reason }, '*');
  });
})();
`;

type Tab = 'html' | 'css' | 'js';

interface ConsoleEntry {
  id: number;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
}

/** HTML void elements that never need a closing tag. */
const VOID_ELEMENTS = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr',
]);

/**
 * Lightweight HTML tag validator.
 * Checks for unclosed, mismatched, and unexpected closing tags.
 */
function validateHtml(html: string): string[] {
  const warnings: string[] = [];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
  const stack: string[] = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const full = match[0];
    const tag = match[1].toLowerCase();

    // Skip void elements and self-closing tags (e.g. <br/>, <img />)
    if (VOID_ELEMENTS.has(tag) || full.endsWith('/>')) continue;

    if (full.startsWith('</')) {
      // Closing tag
      if (stack.length === 0) {
        warnings.push(`Unexpected closing tag </${tag}>`);
      } else if (stack[stack.length - 1] !== tag) {
        warnings.push(`Mismatched tag: expected </${stack[stack.length - 1]}>, found </${tag}>`);
        stack.pop();
      } else {
        stack.pop();
      }
    } else {
      stack.push(tag);
    }
  }

  for (const unclosed of stack.reverse()) {
    warnings.push(`Unclosed tag <${unclosed}>`);
  }

  return warnings;
}

let entryIdCounter = 0;

export function FrontendPlaygroundTool() {
  const [html, setHtml] = useState('<div class="box">\n  Hello World!\n</div>');
  const [css, setCss] = useState('.box {\n  color: white;\n  background: linear-gradient(45deg, #3b82f6, #8b5cf6);\n  padding: 20px;\n  border-radius: 8px;\n  text-align: center;\n  font-family: system-ui, sans-serif;\n  font-weight: 600;\n}');
  const [js, setJs] = useState('console.log("Playground loaded!");');
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('html');
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [showConsole, setShowConsole] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Set the non-standard `csp` attribute on the iframe (not in React's type defs)
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.setAttribute('csp', IFRAME_CSP);
    }
  }, []);

  // Listen for console messages from the sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our playground iframe
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== 'playground-console') return;

      const VALID_LEVELS = ['log', 'warn', 'error', 'info'] as const;
      const level = VALID_LEVELS.includes(event.data.level) ? event.data.level : 'log';
      const message = typeof event.data.message === 'string'
        ? event.data.message.slice(0, 10_000) // Cap length to prevent memory abuse
        : String(event.data.message ?? '');

      setConsoleEntries(prev => [...prev, { id: ++entryIdCounter, level, message }]);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Auto-scroll console to bottom on new entries (without scrolling the page)
  useEffect(() => {
    const el = consoleEndRef.current?.parentElement;
    if (el) el.scrollTop = el.scrollHeight;
  }, [consoleEntries]);

  const runCode = useCallback(() => {
    // Escape closing tags to prevent premature tag termination
    const escapeClosingTags = (s: string) => s.replace(/<\/(style|script)/gi, '<\\/$1');

    // Validate HTML and surface warnings in the console
    const htmlWarnings: ConsoleEntry[] = validateHtml(html).map(msg => ({
      id: ++entryIdCounter,
      level: 'warn' as const,
      message: `[HTML] ${msg}`,
    }));
    setConsoleEntries(htmlWarnings);

    setSrcDoc(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>${escapeClosingTags(css)}</style>
      </head>
      <body>
        ${escapeClosingTags(html)}
        <script>${escapeClosingTags(CONSOLE_INTERCEPT_SCRIPT)}<\/script>
        <script>${escapeClosingTags(js)}<\/script>
      </body>
      </html>
    `);
  }, [html, css, js]);

  // Run on initial mount
  useEffect(() => {
    runCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runCode]);

  const errorCount = consoleEntries.filter(e => e.level === 'error').length;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[800px] lg:h-[600px]">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 overflow-hidden shadow-sm">
        {/* Tab Header */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <button
            onClick={() => setActiveTab('html')}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'html' ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/20' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
          >
            <FileCode2 size={16} /> HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'css' ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/20' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
          >
            <Palette size={16} /> CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'js' ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/20' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
          >
            <FileJson size={16} /> JS
          </button>
        </div>

        {/* Textarea Container */}
        <div className="flex-1 p-4">
          <Textarea
            value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
            onChange={(e) => {
              if (activeTab === 'html') setHtml(e.target.value);
              if (activeTab === 'css') setCss(e.target.value);
              if (activeTab === 'js') setJs(e.target.value);
            }}
            monospace
            className="w-full h-full min-h-full resize-none border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-inner"
            placeholder={`Write ${activeTab.toUpperCase()} here...`}
          />
        </div>

        {/* Run Button */}
        <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Button
            onClick={runCode}
            className="w-full shadow-sm"
          >
            <Play size={15} className="fill-current" /> Run
            <span className="opacity-70 text-xs font-normal ml-1">⌘ Enter</span>
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <Play size={16} className="text-brand-500" /> Preview
          </div>
        </div>

        {/* We add bg-white to iframe container so previews aren't ruined by dark mode */}
        <div className="flex-1 relative bg-white">
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="Preview"
            sandbox="allow-scripts"
            className="absolute inset-0 w-full h-full border-none"
          />
        </div>

        {/* Console Panel */}
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          {/* Console Header */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="w-full flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <Terminal size={13} />
              Console
              {errorCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-[10px] font-bold tabular-nums">
                  {errorCount} {errorCount === 1 ? 'error' : 'errors'}
                </span>
              )}
              {consoleEntries.length > 0 && errorCount === 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-[10px] font-bold tabular-nums">
                  {consoleEntries.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {consoleEntries.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); setConsoleEntries([]); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setConsoleEntries([]); } }}
                  className="p-0.5 rounded transition-colors text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-700"
                  title="Clear console"
                >
                  <Trash2 size={12} />
                </span>
              )}
              {showConsole ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
          </button>

          {/* Console Entries */}
          {showConsole && (
            <div className="max-h-[160px] overflow-y-auto bg-white dark:bg-zinc-950 font-mono text-xs border-t border-zinc-200 dark:border-zinc-800">
              {consoleEntries.length === 0 ? (
                <div className="px-4 py-3 text-zinc-500 dark:text-zinc-500 italic">No console output yet. Click Run to execute your code.</div>
              ) : (
                consoleEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`px-4 py-1.5 border-b border-zinc-100 dark:border-zinc-900/50 flex items-start gap-2 ${
                      entry.level === 'error'
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                        : entry.level === 'warn'
                        ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20 dark:text-yellow-400'
                        : entry.level === 'info'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className={`shrink-0 mt-0.5 text-[10px] uppercase font-bold ${
                      entry.level === 'error'
                        ? 'text-red-500'
                        : entry.level === 'warn'
                        ? 'text-yellow-500'
                        : entry.level === 'info'
                        ? 'text-blue-500'
                        : 'text-zinc-400 dark:text-zinc-600'
                    }`}>
                      {entry.level === 'log' ? '›' : entry.level === 'error' ? '✕' : entry.level === 'warn' ? '⚠' : 'ℹ'}
                    </span>
                    <span className="whitespace-pre-wrap break-all">{entry.message}</span>
                  </div>
                ))
              )}
              <div ref={consoleEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
