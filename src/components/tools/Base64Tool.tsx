'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { ArrowDown, ArrowUp } from 'lucide-react';

type Mode = 'encode' | 'decode';
type Variant = 'standard' | 'url';

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [variant, setVariant] = useState<Variant>('standard');

  function process() {
    setError('');
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(variant === 'url'
          ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
          : encoded
        );
      } else {
        const normalized = variant === 'url'
          ? input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + (4 - input.length % 4) % 4, '=')
          : input;
        setOutput(decodeURIComponent(escape(atob(normalized))));
      }
    } catch {
      setError(mode === 'encode' ? 'Could not encode input.' : 'Invalid Base64 string.');
      setOutput('');
    }
  }

  function swap() {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
    setInput(output);
    setOutput('');
    setError('');
  }

  return (
    <div className="space-y-5">
      {/* Mode / variant toggles */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(''); setError(''); }}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${mode === m
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>Variant:</span>
          {(['standard', 'url'] as Variant[]).map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${variant === v
                ? 'border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">{mode === 'encode' ? 'Plain Text' : 'Base64 String'}</span>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          monospace
          placeholder={mode === 'encode' ? 'Enter text to encode…' : 'Paste Base64 string to decode…'}
          className="min-h-[140px]"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button onClick={process}>
          {mode === 'encode' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </Button>
        {output && (
          <Button variant="secondary" size="sm" onClick={swap}>
            Swap ↕
          </Button>
        )}
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">{mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}</span>
          {output && <CopyButton text={output} />}
        </div>
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <pre className="tool-output min-h-[100px] whitespace-pre-wrap break-all">
            {output || <span className="text-zinc-600">Output will appear here…</span>}
          </pre>
        )}
      </div>
    </div>
  );
}
