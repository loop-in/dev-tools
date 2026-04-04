'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 16);
}

interface FormatRow {
  label: string;
  standard?: string;
  value: string;
  description: string;
}

function getFormats(d: Date, zone: string): FormatRow[] {
  const inZone = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-US', { ...opts, timeZone: zone }).format(d);

  const pad = (n: number, l = 2) => String(n).padStart(l, '0');
  const utc = new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }));
  const local = new Date(d.toLocaleString('en-US', { timeZone: zone }));

  // Manual ISO in target zone
  const offsetMs = local.getTime() - utc.getTime();
  const offsetMin = Math.round(offsetMs / 60000);
  const offSign = offsetMin >= 0 ? '+' : '-';
  const offAbs = Math.abs(offsetMin);
  const offStr = `${offSign}${pad(Math.floor(offAbs / 60))}:${pad(offAbs % 60)}`;

  const isoLocal = `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}:${pad(local.getSeconds())}${offStr}`;

  return [
    {
      label: 'ISO 8601 (UTC)',
      standard: 'ISO 8601',
      value: d.toISOString(),
      description: 'Standard format for data interchange. Used in JSON APIs, databases.',
    },
    {
      label: 'ISO 8601 (Local)',
      standard: 'ISO 8601',
      value: isoLocal,
      description: 'ISO 8601 with local timezone offset.',
    },
    {
      label: 'RFC 2822',
      standard: 'RFC 2822',
      value: d.toUTCString().replace('GMT', '+0000'),
      description: 'Used in HTTP headers (Date, Last-Modified) and email headers.',
    },
    {
      label: 'Unix Timestamp (s)',
      standard: 'POSIX',
      value: Math.floor(d.getTime() / 1000).toString(),
      description: 'Seconds since Jan 1, 1970 UTC. Common in APIs and databases.',
    },
    {
      label: 'Unix Timestamp (ms)',
      standard: 'JS',
      value: d.getTime().toString(),
      description: 'Milliseconds since epoch. Used in JavaScript Date.now().',
    },
    {
      label: 'Date only',
      value: inZone({ year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'),
      description: 'YYYY-MM-DD — for date-only fields in forms and databases.',
    },
    {
      label: 'Time only',
      value: inZone({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      description: 'HH:MM:SS in the selected timezone.',
    },
    {
      label: 'HTTP Date (UTC)',
      standard: 'RFC 7231',
      value: d.toUTCString(),
      description: 'Used in HTTP headers like Cache-Control and Expires.',
    },
    {
      label: 'SQL DATETIME',
      value: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`,
      description: 'MySQL / PostgreSQL DATETIME format in UTC.',
    },
    {
      label: 'Relative (approx)',
      value: (() => {
        const diff = Math.floor((Date.now() - d.getTime()) / 1000);
        const abs = Math.abs(diff);
        const future = diff < 0;
        if (abs < 60) return future ? 'in a few seconds' : 'just now';
        if (abs < 3600) return `${future ? 'in ' : ''}${Math.floor(abs / 60)} minutes${future ? '' : ' ago'}`;
        if (abs < 86400) return `${future ? 'in ' : ''}${Math.floor(abs / 3600)} hours${future ? '' : ' ago'}`;
        return `${future ? 'in ' : ''}${Math.floor(abs / 86400)} days${future ? '' : ' ago'}`;
      })(),
      description: 'Human-friendly relative time string.',
    },
  ];
}

const ZONES = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney'];

export function DateFormatterTool() {
  const [inputVal, setInputVal] = useState(toDateInputValue(new Date()));
  const [zone, setZone] = useState('UTC');

  const date = useMemo(() => {
    const d = new Date(inputVal);
    return isNaN(d.getTime()) ? null : d;
  }, [inputVal]);

  const formats = useMemo(() => date ? getFormats(date, zone) : [], [date, zone]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="section-label">Date & Time</label>
          <div className="flex gap-2">
            <Input type="datetime-local" value={inputVal} onChange={e => setInputVal(e.target.value)} className="flex-1" />
            <Button variant="secondary" size="sm" onClick={() => setInputVal(toDateInputValue(new Date()))}>
              <RefreshCw size={13} /> Now
            </Button>
          </div>
        </div>
        <div>
          <label className="section-label">Reference Timezone</label>
          <select
            value={zone}
            onChange={e => setZone(e.target.value)}
            className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>

      {!date && (
        <p className="text-sm text-red-500">Invalid date input.</p>
      )}

      {formats.length > 0 && (
        <div className="space-y-2">
          {formats.map(({ label, standard, value, description }) => (
            <div key={label} className="rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 shrink-0">{label}</span>
                  {standard && <Badge variant="info" className="shrink-0">{standard}</Badge>}
                </div>
                <CopyButton text={value} />
              </div>
              <p className="font-mono text-sm text-zinc-800 dark:text-zinc-200 mt-1.5 break-all">{value}</p>
              <p className="text-xs text-zinc-400 mt-1">{description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
