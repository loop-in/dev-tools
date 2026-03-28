'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';

type Base = 2 | 8 | 10 | 16;

const BASES: { base: Base; label: string; prefix: string; chars: string }[] = [
  { base: 2, label: 'Binary', prefix: '0b', chars: '01' },
  { base: 8, label: 'Octal', prefix: '0o', chars: '0-7' },
  { base: 10, label: 'Decimal', prefix: '', chars: '0-9' },
  { base: 16, label: 'Hexadecimal', prefix: '0x', chars: '0-9 A-F' },
];

export function BaseConverterTool() {
  const [value, setValue] = useState('255');
  const [sourceBase, setSourceBase] = useState<Base>(10);
  const [error, setError] = useState('');

  const decimal = useMemo(() => {
    if (!value.trim()) return null;
    try {
      const n = parseInt(value, sourceBase);
      if (isNaN(n)) throw new Error('Invalid');
      return n;
    } catch {
      return null;
    }
  }, [value, sourceBase]);

  function handleInput(v: string) {
    setValue(v);
    const n = parseInt(v, sourceBase);
    setError(v && isNaN(n) ? `Invalid ${BASES.find(b => b.base === sourceBase)?.label} number` : '');
  }

  const conversions = decimal !== null ? BASES.map(b => ({
    ...b,
    result: decimal.toString(b.base).toUpperCase(),
  })) : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="section-label">Input</label>
          <Input
            value={value}
            onChange={(e) => handleInput(e.target.value)}
            className="font-mono"
            placeholder="Enter a number…"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div>
          <label className="section-label">Input Base</label>
          <div className="flex gap-2">
            {BASES.map(({ base, label }) => (
              <button
                key={base}
                onClick={() => { setSourceBase(base); setError(''); }}
                className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${sourceBase === base
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {conversions.length > 0 && (
        <div>
          <label className="section-label">Conversions</label>
          <div className="space-y-2">
            {conversions.map(({ base, label, prefix, chars, result }) => (
              <div key={base} className={`flex items-center gap-4 rounded-lg border px-4 py-3 ${sourceBase === base
                ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/30'
                : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                }`}>
                <div className="w-32 shrink-0">
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</p>
                  <p className="text-xs text-zinc-400 font-mono">Base {base} · {chars}</p>
                </div>
                <code className="flex-1 font-mono text-sm text-zinc-800 dark:text-zinc-200 break-all">
                  {prefix}{result}
                </code>
                <CopyButton text={prefix + result} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bit visualization */}
      {decimal !== null && decimal >= 0 && decimal <= 255 && (
        <div>
          <label className="section-label">8-bit Visualization</label>
          <div className="flex gap-1">
            {decimal.toString(2).padStart(8, '0').split('').map((bit, i) => (
              <div
                key={i}
                className={`flex-1 h-10 rounded flex items-center justify-center font-mono text-sm font-bold ${bit === '1'
                  ? 'bg-brand-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
              >
                {bit}
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-1">
            {[128, 64, 32, 16, 8, 4, 2, 1].map((n) => (
              <div key={n} className="flex-1 text-center text-xs text-zinc-400 font-mono">{n}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
