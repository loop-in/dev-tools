'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Badge } from '@/components/ui/Badge';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at noon', value: '0 12 * * *' },
  { label: 'Every Sunday at midnight', value: '0 0 * * 0' },
  { label: 'Every Monday at 9am', value: '0 9 * * 1' },
  { label: 'Every 1st of the month', value: '0 0 1 * *' },
  { label: 'Every weekday at 8am', value: '0 8 * * 1-5' },
];

const FIELDS = [
  { label: 'Minute', placeholder: '0-59', name: 'minute' },
  { label: 'Hour', placeholder: '0-23', name: 'hour' },
  { label: 'Day of Month', placeholder: '1-31', name: 'dom' },
  { label: 'Month', placeholder: '1-12', name: 'month' },
  { label: 'Day of Week', placeholder: '0-6 (Sun=0)', name: 'dow' },
];

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron expression (need 5 fields)';
  const [min, hour, dom, month, dow] = parts;

  const desc = (val: string, unit: string, opts?: string) => {
    if (val === '*') return `every ${unit}`;
    if (val.startsWith('*/')) return `every ${val.slice(2)} ${unit}s`;
    if (val.includes('-')) return `${unit}s ${val}`;
    if (val.includes(',')) return `${unit}s ${val}`;
    return `${unit} ${val}${opts ? ` (${opts})` : ''}`;
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const parts2 = [
    desc(min, 'minute'),
    desc(hour, 'hour'),
    dom !== '*' ? `on day ${dom}` : null,
    month !== '*' ? `in ${months[parseInt(month)] || month}` : null,
    dow !== '*' ? `on ${dow.split('-').map(d => days[parseInt(d)]).filter(Boolean).join('–') || 'day ' + dow}` : null,
  ].filter(Boolean);

  return 'Runs at ' + parts2.join(', ');
}

export function CronBuilderTool() {
  const [expr, setExpr] = useState('0 9 * * 1-5');

  const fields = expr.trim().split(/\s+/);
  const isValid = fields.length === 5;
  const description = useMemo(() => describeCron(expr), [expr]);

  function updateField(i: number, val: string) {
    const parts = expr.trim().split(/\s+/);
    while (parts.length < 5) parts.push('*');
    parts[i] = val || '*';
    setExpr(parts.join(' '));
  }

  return (
    <div className="space-y-6">
      {/* Full expression */}
      <div>
        <label className="section-label">Cron Expression</label>
        <div className="flex items-center gap-2">
          <Input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="font-mono w-64"
            placeholder="* * * * *"
          />
          <Badge variant={isValid ? 'success' : 'error'}>{isValid ? 'Valid' : 'Invalid'}</Badge>
          {isValid && <CopyButton text={expr} />}
        </div>
      </div>

      {/* Field breakdown */}
      {isValid && (
        <div>
          <label className="section-label">Field Editor</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {FIELDS.map((f, i) => (
              <div key={f.name}>
                <label className="text-xs text-zinc-500 mb-1 block font-medium">{f.label}</label>
                <Input
                  value={fields[i] ?? '*'}
                  onChange={(e) => updateField(i, e.target.value)}
                  placeholder={f.placeholder}
                  className="font-mono text-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {isValid && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/30 px-4 py-3">
          <p className="text-sm text-brand-800 dark:text-brand-300 font-medium">📅 {description}</p>
        </div>
      )}

      {/* Presets */}
      <div>
        <label className="section-label">Common Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setExpr(p.value)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${expr === p.value
                  ? 'border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
            >
              {p.label}
              <code className="ml-2 text-zinc-400 font-mono">{p.value}</code>
            </button>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div>
        <label className="section-label">Field Reference</label>
        <div className="rounded-lg border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>{['Field', 'Range', 'Special chars'].map(h => <th key={h} className="px-3 py-2 text-left text-zinc-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {[
                ['Minute', '0–59', '* , - /'],
                ['Hour', '0–23', '* , - /'],
                ['Day of Month', '1–31', '* , - / ? L W'],
                ['Month', '1–12 or JAN–DEC', '* , - /'],
                ['Day of Week', '0–6 (Sun=0)', '* , - / ? L #'],
              ].map(([f, r, s]) => (
                <tr key={f} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300">{f}</td>
                  <td className="px-3 py-2 font-mono text-zinc-500">{r}</td>
                  <td className="px-3 py-2 font-mono text-zinc-400">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
