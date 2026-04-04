'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card, CardBody } from '@/components/ui/Card';

type TabId = 'difference' | 'add-subtract';

function formatDuration(days: number) {
  const abs = Math.abs(days);
  const years = Math.floor(abs / 365);
  const months = Math.floor((abs % 365) / 30);
  const remDays = abs % 30;
  const parts = [];
  if (years) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  if (months) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (remDays || parts.length === 0) parts.push(`${remDays} day${remDays !== 1 ? 's' : ''}`);
  return parts.join(', ');
}

function toDateInput(d: Date) {
  return d.toISOString().split('T')[0];
}

const today = toDateInput(new Date());

export function DateCalculatorTool() {
  const [tab, setTab] = useState<TabId>('difference');

  // Difference tab
  const [dateA, setDateA] = useState(today);
  const [dateB, setDateB] = useState(toDateInput(new Date(Date.now() + 30 * 86400000)));

  // Add/subtract tab
  const [baseDate, setBaseDate] = useState(today);
  const [op, setOp] = useState<'add' | 'subtract'>('add');
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(30);

  const diffResult = useMemo(() => {
    if (!dateA || !dateB) return null;
    const a = new Date(dateA), b = new Date(dateB);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
    const diffMs = b.getTime() - a.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    const diffWeeks = Math.floor(Math.abs(diffDays) / 7);
    const diffHours = Math.round(Math.abs(diffMs) / 3600000);
    const diffMinutes = Math.round(Math.abs(diffMs) / 60000);
    const isFuture = diffDays > 0;
    return { diffDays, diffWeeks, diffHours, diffMinutes, isFuture };
  }, [dateA, dateB]);

  const addResult = useMemo(() => {
    if (!baseDate) return null;
    const d = new Date(baseDate);
    if (isNaN(d.getTime())) return null;
    const sign = op === 'add' ? 1 : -1;
    d.setFullYear(d.getFullYear() + sign * years);
    d.setMonth(d.getMonth() + sign * months);
    d.setDate(d.getDate() + sign * days);
    return d;
  }, [baseDate, op, years, months, days]);

  const TABS: { id: TabId; label: string }[] = [
    { id: 'difference', label: 'Date Difference' },
    { id: 'add-subtract', label: 'Add / Subtract' },
  ];

  return (
    <div className="space-y-5">
      {/* Tab toggle */}
      <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'bg-brand-500 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Difference */}
      {tab === 'difference' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="section-label">Start Date</label>
              <Input type="date" value={dateA} onChange={e => setDateA(e.target.value)} />
            </div>
            <div>
              <label className="section-label">End Date</label>
              <Input type="date" value={dateB} onChange={e => setDateB(e.target.value)} />
            </div>
          </div>

          {diffResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Days', value: Math.abs(diffResult.diffDays).toLocaleString() },
                { label: 'Weeks', value: diffResult.diffWeeks.toLocaleString() },
                { label: 'Hours', value: diffResult.diffHours.toLocaleString() },
                { label: 'Minutes', value: diffResult.diffMinutes.toLocaleString() },
              ].map(({ label, value }) => (
                <Card key={label}>
                  <CardBody className="text-center py-4">
                    <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">{value}</p>
                    <p className="text-xs text-zinc-400 mt-1">{label}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {diffResult && (
            <div className={`rounded-lg border px-4 py-3 ${diffResult.diffDays === 0
                ? 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800'
                : diffResult.isFuture
                  ? 'border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/30'
                  : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
              }`}>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {diffResult.diffDays === 0
                  ? 'The two dates are the same day.'
                  : `${new Date(dateB).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} is ${formatDuration(diffResult.diffDays)} ${diffResult.isFuture ? 'after' : 'before'} ${new Date(dateA).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add / Subtract */}
      {tab === 'add-subtract' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="section-label">Base Date</label>
              <Input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)} />
            </div>
            <div>
              <label className="section-label">Operation</label>
              <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden h-10">
                {(['add', 'subtract'] as const).map(o => (
                  <button
                    key={o}
                    onClick={() => setOp(o)}
                    className={`flex-1 text-sm font-medium capitalize transition-colors ${op === o ? 'bg-brand-500 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                  >
                    {o === 'add' ? '+ Add' : '− Subtract'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Years', value: years, set: setYears },
              { label: 'Months', value: months, set: setMonths },
              { label: 'Days', value: days, set: setDays },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="section-label">{label}</label>
                <Input
                  type="number"
                  min={0}
                  value={value}
                  onChange={e => set(Math.max(0, parseInt(e.target.value) || 0))}
                  className="font-mono"
                />
              </div>
            ))}
          </div>

          {addResult && (
            <div className="rounded-lg border border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/30 px-4 py-4">
              <p className="text-xs text-brand-600 dark:text-brand-400 mb-1 font-medium uppercase tracking-wide">Result</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-brand-800 dark:text-brand-200" style={{ fontFamily: 'var(--font-display)' }}>
                  {addResult.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <CopyButton text={addResult.toISOString().split('T')[0]} />
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-mono">{addResult.toISOString().split('T')[0]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
