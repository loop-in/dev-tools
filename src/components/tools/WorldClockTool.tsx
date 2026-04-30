'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';
import { TIMEZONES } from '@/lib/timezones';

function getHourProgress(date: Date, zone: string): number {
  const h = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', hour12: false }).format(date));
  const m = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: zone, minute: 'numeric' }).format(date));
  return ((h * 60 + m) / (24 * 60)) * 100;
}

function isDaytime(date: Date, zone: string): boolean {
  const h = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', hour12: false }).format(date));
  return h >= 6 && h < 20;
}

function formatCityTime(date: Date, zone: string) {
  return {
    time: new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(date),
    date: new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short', month: 'short', day: 'numeric' }).format(date),
    abbr: new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' }).formatToParts(date).find(p => p.type === 'timeZoneName')?.value ?? '',
  };
}

export function WorldClockTool() {
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = TIMEZONES.filter(c => {
    if (!search) {
      return c.fav;
    }

    return c.city.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter cities…"
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(({ city, country, zone, flag }) => {
          const { time, date, abbr } = formatCityTime(now, zone);
          const progress = getHourProgress(now, zone);
          const day = isDaytime(now, zone);

          return (
            <div
              key={`${city}-${zone}`}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{flag}</span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">{city}</p>
                    {country && <p className="text-xs text-zinc-400">{country}</p>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${day
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  }`}>
                  {day ? '☀️ Day' : '🌙 Night'}
                </span>
              </div>

              <div>
                <div className="font-mono text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-none">
                  {time}
                </div>
                <div className="text-xs text-zinc-400 mt-1">{date} · {abbr}</div>
              </div>

              {/* Day progress bar */}
              <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${day ? 'bg-amber-400' : 'bg-indigo-400'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
