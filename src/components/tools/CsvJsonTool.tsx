'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeftRight } from 'lucide-react';

function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
  return JSON.stringify(rows, null, 2);
}

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error('JSON must be an array of objects.');
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = data.map((row) => headers.map((h) => escape(row[h])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

type Mode = 'csv-to-json' | 'json-to-csv';

export function CsvJsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('csv-to-json');

  function convert() {
    setError('');
    try {
      setOutput(mode === 'csv-to-json' ? csvToJson(input) : jsonToCsv(input));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Conversion failed.');
      setOutput('');
    }
  }

  const placeholder = mode === 'csv-to-json'
    ? 'name,age,city\nAlice,30,NYC\nBob,25,LA'
    : '[{"name":"Alice","age":30},{"name":"Bob","age":25}]';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {(['csv-to-json', 'json-to-csv'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(''); setError(''); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${mode === m
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
            >
              {m === 'csv-to-json' ? 'CSV → JSON' : 'JSON → CSV'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <span className="section-label">{mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}</span>
          <Textarea monospace value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} className="min-h-[300px]" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">{mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}</span>
            {output && <CopyButton text={output} />}
          </div>
          {error
            ? <div className="min-h-[300px] rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-4"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>
            : <pre className="tool-output min-h-[300px] whitespace-pre-wrap break-words">{output || <span className="text-zinc-600">Output appears here…</span>}</pre>
          }
        </div>
      </div>

      <Button onClick={convert}>
        <ArrowLeftRight size={14} /> Convert
      </Button>
    </div>
  );
}
