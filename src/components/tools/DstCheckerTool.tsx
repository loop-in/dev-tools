'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { TIMEZONES } from '@/lib/timezones';

function getUtcOffset(date: Date, zone: string): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: zone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

function getDstTransitions(zone: string, year: number): { start: Date | null; end: Date | null; stdOffset: number; dstOffset: number } {
  // Sample every day of the year to find offset changes
  let transitions: { date: Date; offset: number }[] = [];
  let prevOffset: number | null = null;

  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const d = new Date(year, month, day, 12, 0, 0);
      const offset = getUtcOffset(d, zone);
      if (prevOffset !== null && offset !== prevOffset) {
        // Binary search for the exact day
        transitions.push({ date: d, offset });
      }
      prevOffset = offset;
    }
  }

  if (transitions.length < 2) {
    const stdOffset = getUtcOffset(new Date(year, 0, 15), zone);
    return { start: null, end: null, stdOffset, dstOffset: stdOffset };
  }

  const offsets = transitions.map(t => t.offset);
  const dstOffset = Math.max(...offsets);
  const stdOffset = Math.min(...offsets);

  // DST starts when offset increases (in northern hemisphere) 
  const startTrans = transitions.find(t => t.offset === dstOffset);
  const endTrans = transitions.find(t => t.offset === stdOffset);

  return {
    start: startTrans?.date ?? null,
    end: endTrans?.date ?? null,
    stdOffset,
    dstOffset,
  };
}

export function DstCheckerTool() {
  const [zone, setZone] = useState('America/New_York');
  const [year, setYear] = useState(new Date().getFullYear());

  const now = new Date();
  const currentOffset = useMemo(() => getUtcOffset(now, zone), [zone]);
  const dst = useMemo(() => getDstTransitions(zone, year), [zone, year]);

  const observesDst = dst.start !== null;
  const currentlyInDst = observesDst && currentOffset === dst.dstOffset;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="section-label">Timezone</label>
          <select
            value={zone}
            onChange={e => setZone(e.target.value)}
            className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {TIMEZONES.map(z => <option key={`${z.city}-${z.zone}`} value={z.zone}>{z.city} ({z.country})</option>)}
          </select>
        </div>
        <div>
          <label className="section-label">Year</label>
          <input
            type="number"
            value={year}
            min={2000}
            max={2050}
            onChange={e => setYear(parseInt(e.target.value) || new Date().getFullYear())}
            className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 font-mono text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Status card */}
      <div className={`rounded-xl border p-5 ${observesDst
        ? 'border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/20'
        : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50'
        }`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>
              {zone}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Current offset: <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">{formatOffset(currentOffset)}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={observesDst ? 'warning' : 'default'}>
              {observesDst ? '🕐 Observes DST' : '✓ No DST'}
            </Badge>
            {observesDst && (
              <Badge variant={currentlyInDst ? 'success' : 'info'}>
                {currentlyInDst ? '☀️ Currently DST' : '🍂 Currently Standard'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* DST details */}
      {observesDst ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardBody>
              <p className="section-label">DST Starts (clocks forward)</p>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                {dst.start ? dst.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
              </p>
              <p className="text-xs text-zinc-400 font-mono mt-1">{formatOffset(dst.stdOffset)} → {formatOffset(dst.dstOffset)}</p>
              <p className="text-xs text-zinc-400 mt-1">Clocks move forward 1 hour · lose 1 hour of sleep</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="section-label">DST Ends (clocks back)</p>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
                {dst.end ? dst.end.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
              </p>
              <p className="text-xs text-zinc-400 font-mono mt-1">{formatOffset(dst.dstOffset)} → {formatOffset(dst.stdOffset)}</p>
              <p className="text-xs text-zinc-400 mt-1">Clocks move back 1 hour · gain 1 hour of sleep</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="section-label">Standard Time Offset</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">{formatOffset(dst.stdOffset)}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="section-label">DST Offset</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-zinc-100">{formatOffset(dst.dstOffset)}</p>
              <p className="text-xs text-zinc-400 mt-1">+1 hour from standard</p>
            </CardBody>
          </Card>
        </div>
      ) : (
        <Card>
          <CardBody>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              <strong className="text-zinc-700 dark:text-zinc-300">{zone}</strong> does not observe Daylight Saving Time. The UTC offset stays at <span className="font-mono">{formatOffset(currentOffset)}</span> year-round.
            </p>
          </CardBody>
        </Card>
      )}

      {/* Developer note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800/50 dark:bg-blue-950/20 px-4 py-3">
        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          <strong>Dev tip:</strong> Always store timestamps in UTC in your database and convert to local time in the UI. Use <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">Intl.DateTimeFormat</code> or a library like <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">date-fns-tz</code> to handle DST transitions automatically.
        </p>
      </div>
    </div>
  );
}
