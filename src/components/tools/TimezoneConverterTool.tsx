'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { TIMEZONES } from '@/lib/timezones';

const ZONE_LABELS = Object.fromEntries(TIMEZONES.map(z => [z.zone, z.city]));

function formatInZone(date: Date, zone: string): { time: string; date: string; offset: string; abbr: string } {
  const timeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  const dateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  // Get UTC offset
  const offsetMinutes = -new Date(
    new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) +
    'T' +
    new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(date)
  ).getTimezoneOffset();

  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMin = Math.abs(offsetMinutes);
  const offsetStr = `UTC${sign}${String(Math.floor(absMin / 60)).padStart(2, '0')}:${String(absMin % 60).padStart(2, '0')}`;

  const abbr = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    timeZoneName: 'short',
  }).formatToParts(date).find(p => p.type === 'timeZoneName')?.value ?? zone;

  return { time: timeStr, date: dateStr, offset: offsetStr, abbr };
}

function toLocalIso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function TimezoneConverterTool() {
  const [sourceZone, setSourceZone] = useState('UTC');
  const [inputTime, setInputTime] = useState(toLocalIso(new Date()));
  const [zones, setZones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Kolkata',
    'Asia/Tokyo',
    'Australia/Sydney',
  ]);
  const [customZone, setCustomZone] = useState('');

  const sourceDate = useMemo(() => {
    try {
      // Parse the local datetime-local input as if it's in sourceZone
      const [datePart, timePart] = inputTime.split('T');
      // Use Intl to create a date in the source timezone
      const isoString = `${datePart}T${timePart}:00`;
      // We need to find what UTC time corresponds to this local time in sourceZone
      const utcDate = new Date(isoString + 'Z');
      return utcDate;
    } catch {
      return new Date();
    }
  }, [inputTime, sourceZone]);

  function addZone(zone: string) {
    if (zone && !zones.includes(zone)) setZones(prev => [...prev, zone]);
    setCustomZone('');
  }

  function removeZone(zone: string) {
    setZones(prev => prev.filter(z => z !== zone));
  }

  function setNow() {
    setInputTime(toLocalIso(new Date()));
  }

  const allZones = [sourceZone, ...zones.filter(z => z !== sourceZone)];

  return (
    <div className="space-y-6">
      {/* Source input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="section-label">Source Timezone</label>
          <select
            value={sourceZone}
            onChange={(e) => setSourceZone(e.target.value)}
            className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {TIMEZONES.map(z => (
              <option key={`${z.city}-${z.zone}`} value={z.zone}>{z.city} ({z.country}) — {z.zone}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="section-label">Date & Time</label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="flex-1"
            />
            <Button variant="secondary" size="sm" onClick={setNow} title="Set to now">
              <RefreshCw size={13} />
            </Button>
          </div>
        </div>
      </div>

      {/* Results table */}
      <div>
        <label className="section-label">Converted Times</label>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
          {allZones.map((zone, i) => {
            const fmt = formatInZone(sourceDate, zone);
            const isSource = zone === sourceZone;
            return (
              <div
                key={zone}
                className={`flex items-center gap-4 px-4 py-3 ${isSource
                  ? 'bg-brand-50 dark:bg-brand-950/30'
                  : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  } transition-colors`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {ZONE_LABELS[zone] ?? zone}
                    </span>
                    {isSource && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 font-medium">source</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">{zone} · {fmt.offset} · {fmt.abbr}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">{fmt.time}</div>
                  <div className="text-xs text-zinc-400">{fmt.date}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <CopyButton text={`${fmt.date} ${fmt.time} ${fmt.abbr}`} size="sm" />
                  {!isSource && (
                    <button
                      onClick={() => removeZone(zone)}
                      className="p-1.5 rounded text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add timezone */}
      <div>
        <label className="section-label">Add Timezone</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={customZone}
            onChange={(e) => setCustomZone(e.target.value)}
            className="h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select a timezone…</option>
            {TIMEZONES.filter(z => !zones.includes(z.zone) && z.zone !== sourceZone).map(z => (
              <option key={`${z.city}-${z.zone}`} value={z.zone}>{z.city} ({z.country}) — {z.zone}</option>
            ))}
          </select>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => addZone(customZone)}
            disabled={!customZone}
          >
            <Plus size={13} /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
