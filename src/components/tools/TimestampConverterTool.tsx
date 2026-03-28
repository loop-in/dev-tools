'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { RefreshCw } from 'lucide-react';

interface TimeFormat { label: string; value: string; }

function getFormats(ts: number): TimeFormat[] {
  const d = new Date(ts * 1000);
  return [
    { label: 'Unix Timestamp', value: ts.toString() },
    { label: 'ISO 8601', value: d.toISOString() },
    { label: 'UTC', value: d.toUTCString() },
    { label: 'Local Time', value: d.toLocaleString() },
    { label: 'Date (Local)', value: d.toLocaleDateString() },
    { label: 'Time (Local)', value: d.toLocaleTimeString() },
    { label: 'Relative', value: getRelative(ts) },
  ];
}

function getRelative(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  const abs = Math.abs(diff);
  const future = diff < 0;
  if (abs < 60) return future ? 'in a few seconds' : 'just now';
  if (abs < 3600) return `${future ? 'in ' : ''}${Math.floor(abs / 60)} minutes${future ? '' : ' ago'}`;
  if (abs < 86400) return `${future ? 'in ' : ''}${Math.floor(abs / 3600)} hours${future ? '' : ' ago'}`;
  return `${future ? 'in ' : ''}${Math.floor(abs / 86400)} days${future ? '' : ' ago'}`;
}

export function TimestampConverterTool() {
  const [tsInput, setTsInput] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState('');
  const [error, setError] = useState('');

  const ts = parseInt(tsInput);
  const validTs = !isNaN(ts) && ts > 0;
  const formats = validTs ? getFormats(ts) : [];

  useEffect(() => {
    if (validTs) {
      const d = new Date(ts * 1000);
      setDateInput(d.toISOString().slice(0, 16));
    }
  }, [tsInput, ts, validTs]);

  function setNow() {
    setTsInput(Math.floor(Date.now() / 1000).toString());
    setError('');
  }

  function fromDate() {
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) throw new Error('Invalid date');
      setTsInput(Math.floor(d.getTime() / 1000).toString());
      setError('');
    } catch {
      setError('Invalid date format');
    }
  }

  return (
    <div className="space-y-6">
      {/* Unix Timestamp input */}
      <div>
        <label className="section-label">Unix Timestamp (seconds)</label>
        <div className="flex items-center gap-2">
          <Input
            value={tsInput}
            onChange={(e) => { setTsInput(e.target.value); setError(''); }}
            className="font-mono w-48"
            placeholder="e.g. 1700000000"
          />
          <Button variant="secondary" size="sm" onClick={setNow}>
            <RefreshCw size={13} /> Now
          </Button>
        </div>
      </div>

      {/* Date/time input */}
      <div>
        <label className="section-label">Date & Time</label>
        <div className="flex items-center gap-2">
          <Input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-64"
          />
          <Button variant="secondary" size="sm" onClick={fromDate}>Convert →</Button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Formats */}
      {formats.length > 0 && (
        <div>
          <label className="section-label">All Formats</label>
          <div className="space-y-2">
            {formats.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
                <span className="text-xs text-zinc-500 w-36 shrink-0">{label}</span>
                <code className="flex-1 text-sm font-mono text-zinc-800 dark:text-zinc-200 truncate">{value}</code>
                <CopyButton text={value} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
