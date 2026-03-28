'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Badge } from '@/components/ui/Badge';
import { safeJsonParse, downloadFile } from '@/lib/utils';
import { Minimize2, Maximize2, Download } from 'lucide-react';

type IndentSize = 2 | 4;

export function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<IndentSize>(2);

  const format = useCallback(() => {
    if (!input.trim()) return;
    const parsed = safeJsonParse(input);
    if (parsed === null) {
      setError('Invalid JSON — please check your syntax.');
      setOutput('');
    } else {
      setError('');
      setOutput(JSON.stringify(parsed, null, indent));
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    if (!input.trim()) return;
    const parsed = safeJsonParse(input);
    if (parsed === null) {
      setError('Invalid JSON — please check your syntax.');
      setOutput('');
    } else {
      setError('');
      setOutput(JSON.stringify(parsed));
    }
  }, [input]);

  const isValid = input.trim() ? safeJsonParse(input) !== null : null;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Indent:</span>
          {([2, 4] as IndentSize[]).map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={`h-7 w-10 rounded text-xs font-mono font-medium transition-colors ${indent === n
                  ? 'bg-brand-500 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="secondary" size="sm" onClick={minify}>
            <Minimize2 size={13} /> Minify
          </Button>
          <Button size="sm" onClick={format}>
            <Maximize2 size={13} /> Format
          </Button>
        </div>
      </div>

      {/* Editor row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="section-label">Input</span>
            {isValid !== null && (
              <Badge variant={isValid ? 'success' : 'error'}>
                {isValid ? 'Valid JSON' : 'Invalid JSON'}
              </Badge>
            )}
          </div>
          <Textarea
            monospace
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'{\n  "hello": "world"\n}'}
            className="min-h-[360px]"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="section-label">Output</span>
            <div className="flex items-center gap-2">
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadFile(output, 'formatted.json', 'application/json')}
                >
                  <Download size={13} /> Download
                </Button>
              )}
              {output && <CopyButton text={output} />}
            </div>
          </div>
          {error ? (
            <div className="min-h-[360px] rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">{error}</p>
            </div>
          ) : (
            <pre className="tool-output min-h-[360px] whitespace-pre-wrap break-words">
              {output || <span className="text-zinc-600">Formatted output will appear here…</span>}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
