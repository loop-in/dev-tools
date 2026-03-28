'use client';

import { useState, useMemo } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';

const FLAGS = ['g', 'i', 'm', 's'];

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']));
  const [testString, setTestString] = useState('');

  const toggleFlag = (f: string) =>
    setFlags((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });

  const result = useMemo(() => {
    if (!pattern || !testString) return null;
    try {
      const re = new RegExp(pattern, [...flags].join(''));
      const matches = [...testString.matchAll(new RegExp(pattern, 'g' + [...flags].filter(f => f !== 'g').join('')))];
      return { matches, error: null };
    } catch (e: unknown) {
      return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex' };
    }
  }, [pattern, flags, testString]);

  // Build highlighted HTML
  const highlighted = useMemo(() => {
    if (!result || result.error || !result.matches.length) return null;
    let last = 0;
    const parts: { text: string; match: boolean }[] = [];
    for (const m of result.matches) {
      if (m.index === undefined) continue;
      if (m.index > last) parts.push({ text: testString.slice(last, m.index), match: false });
      parts.push({ text: m[0], match: true });
      last = m.index + m[0].length;
    }
    if (last < testString.length) parts.push({ text: testString.slice(last), match: false });
    return parts;
  }, [result, testString]);

  return (
    <div className="space-y-5">
      {/* Pattern row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="section-label">Pattern</label>
          <div className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 focus-within:ring-2 focus-within:ring-brand-500">
            <span className="text-zinc-400 font-mono text-sm select-none">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="your pattern here"
              className="flex-1 py-2 bg-transparent font-mono text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
            />
            <span className="text-zinc-400 font-mono text-sm select-none">/{[...flags].join('')}</span>
          </div>
        </div>
        {/* Flags */}
        <div>
          <label className="section-label">Flags</label>
          <div className="flex gap-1 h-10">
            {FLAGS.map((f) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`px-3 rounded-lg font-mono text-sm font-medium border transition-colors ${flags.has(f)
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test string */}
      <div>
        <label className="section-label">Test String</label>
        <Textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against your pattern…"
          className="min-h-[140px]"
        />
      </div>

      {/* Stats */}
      {result && (
        <div className="flex items-center gap-3">
          {result.error ? (
            <Badge variant="error">{result.error}</Badge>
          ) : (
            <Badge variant={result.matches.length > 0 ? 'success' : 'warning'}>
              {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
            </Badge>
          )}
        </div>
      )}

      {/* Highlighted output */}
      {highlighted && (
        <div>
          <label className="section-label">Matches</label>
          <Card>
            <CardBody>
              <p className="font-mono text-sm leading-relaxed break-all">
                {highlighted.map((part, i) =>
                  part.match ? (
                    <mark
                      key={i}
                      className="bg-brand-200 text-brand-900 dark:bg-brand-800 dark:text-brand-100 rounded px-0.5"
                    >
                      {part.text}
                    </mark>
                  ) : (
                    <span key={i} className="text-zinc-700 dark:text-zinc-300">{part.text}</span>
                  )
                )}
              </p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Match list */}
      {result && !result.error && result.matches.length > 0 && (
        <div>
          <label className="section-label">Match Details</label>
          <div className="space-y-2">
            {result.matches.slice(0, 20).map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2">
                <span className="text-xs font-mono text-zinc-400">#{i + 1}</span>
                <code className="flex-1 text-sm font-mono text-zinc-900 dark:text-zinc-100">{m[0]}</code>
                <span className="text-xs text-zinc-400">index {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
