'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card, CardBody } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getISOWeekYear(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  return date.getUTCFullYear();
}

function getWeekDates(year: number, week: number): Date[] {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1);
  const start = new Date(startOfWeek1);
  start.setUTCDate(startOfWeek1.getUTCDate() + (week - 1) * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return d;
  });
}

function getWeeksInYear(year: number): number {
  const dec28 = new Date(Date.UTC(year, 11, 28));
  return getISOWeek(dec28);
}

function toDateInput(d: Date) {
  return d.toISOString().split('T')[0];
}

export function WeekNumberTool() {
  const [selectedDate, setSelectedDate] = useState(toDateInput(new Date()));
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const date = useMemo(() => {
    const d = new Date(selectedDate + 'T12:00:00Z');
    return isNaN(d.getTime()) ? null : d;
  }, [selectedDate]);

  const weekNum = date ? getISOWeek(date) : null;
  const weekYear = date ? getISOWeekYear(date) : null;
  const weekDates = weekNum && weekYear ? getWeekDates(weekYear, weekNum) : null;
  const today = toDateInput(new Date());
  const todayWeek = getISOWeek(new Date());

  const totalWeeks = getWeeksInYear(calYear);
  const calWeeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Date input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="section-label">Date</label>
          <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
      </div>

      {/* Result cards */}
      {date && weekNum && weekYear && weekDates && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'ISO Week', value: `W${String(weekNum).padStart(2, '0')}` },
              { label: 'Week Year', value: String(weekYear) },
              { label: 'Day of Year', value: String(Math.ceil((date.getTime() - new Date(Date.UTC(date.getUTCFullYear(), 0, 0)).getTime()) / 86400000)) },
              { label: 'Quarter', value: `Q${Math.ceil((date.getUTCMonth() + 1) / 3)}` },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardBody className="text-center py-4">
                  <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums">{value}</p>
                  <p className="text-xs text-zinc-400 mt-1">{label}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Week dates */}
          <div>
            <label className="section-label">Week {weekNum} · {weekYear}</label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map((day, i) => {
                const d = weekDates[i];
                const iso = toDateInput(d);
                const isToday = iso === today;
                const isSelected = iso === selectedDate;
                const isWeekend = i >= 5;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(iso)}
                    className={`rounded-lg p-2 text-center transition-colors border ${isSelected
                        ? 'border-brand-400 bg-brand-500 text-white'
                        : isToday
                          ? 'border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                          : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700'
                      }`}
                  >
                    <p className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-zinc-400'}`}>{day}</p>
                    <p className={`text-sm font-bold tabular-nums mt-0.5 ${isSelected ? 'text-white' : isWeekend ? 'text-blue-500 dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-200'
                      }`}>
                      {d.getUTCDate()}
                    </p>
                    <p className={`text-xs tabular-nums ${isSelected ? 'text-white/60' : 'text-zinc-400'}`}>
                      {d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2">
              <CopyButton text={`${weekYear}-W${String(weekNum).padStart(2, '0')}`} />
              <span className="text-xs text-zinc-400 self-center font-mono">{weekYear}-W{String(weekNum).padStart(2, '0')}</span>
            </div>
          </div>
        </>
      )}

      {/* Year overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="section-label m-0">All Weeks in {calYear}</label>
          <div className="flex items-center gap-1">
            <button onClick={() => setCalYear(y => y - 1)} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"><ChevronLeft size={14} /></button>
            <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400 px-1">{calYear}</span>
            <button onClick={() => setCalYear(y => y + 1)} className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {calWeeks.map(w => {
            const isCurrentWeek = calYear === new Date().getFullYear() && w === todayWeek;
            const isSelectedWeek = weekYear === calYear && w === weekNum;
            const dates = getWeekDates(calYear, w);
            return (
              <button
                key={w}
                title={`W${w}: ${dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })} – ${dates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`}
                onClick={() => setSelectedDate(toDateInput(dates[0]))}
                className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition-colors border ${isSelectedWeek
                    ? 'bg-brand-500 text-white border-brand-500'
                    : isCurrentWeek
                      ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                      : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-200 dark:hover:border-zinc-700'
                  }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
