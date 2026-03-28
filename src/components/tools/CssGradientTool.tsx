'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';

type GradientType = 'linear' | 'radial';

const PRESETS = [
  { name: 'Emerald', stops: [{ color: '#22c55e', pos: 0 }, { color: '#0891b2', pos: 100 }] },
  { name: 'Sunset', stops: [{ color: '#f97316', pos: 0 }, { color: '#ec4899', pos: 100 }] },
  { name: 'Night', stops: [{ color: '#1e1b4b', pos: 0 }, { color: '#312e81', pos: 50 }, { color: '#0c0a09', pos: 100 }] },
  { name: 'Ocean', stops: [{ color: '#06b6d4', pos: 0 }, { color: '#3b82f6', pos: 50 }, { color: '#8b5cf6', pos: 100 }] },
  { name: 'Lava', stops: [{ color: '#ef4444', pos: 0 }, { color: '#f97316', pos: 50 }, { color: '#eab308', pos: 100 }] },
];

interface Stop { color: string; pos: number; }

export function CssGradientTool() {
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: '#22c55e', pos: 0 },
    { color: '#0891b2', pos: 100 },
  ]);

  const css = useMemo(() => {
    const stopsStr = stops
      .sort((a, b) => a.pos - b.pos)
      .map(s => `${s.color} ${s.pos}%`)
      .join(', ');
    return type === 'linear'
      ? `linear-gradient(${angle}deg, ${stopsStr})`
      : `radial-gradient(circle, ${stopsStr})`;
  }, [type, angle, stops]);

  function updateStop(i: number, field: keyof Stop, val: string | number) {
    setStops(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }

  function addStop() {
    setStops(prev => [...prev, { color: '#ffffff', pos: 50 }]);
  }

  function removeStop(i: number) {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div
        className="h-36 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-inner"
        style={{ background: css }}
      />

      {/* Type toggle */}
      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {(['linear', 'radial'] as GradientType[]).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${type === t ? 'bg-brand-500 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        {type === 'linear' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-500">Angle</label>
            <input
              type="range"
              min={0} max={360}
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400 w-12">{angle}°</span>
          </div>
        )}
      </div>

      {/* Color stops */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="section-label">Color Stops</span>
          <button onClick={addStop} className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium">
            + Add Stop
          </button>
        </div>
        <div className="space-y-2">
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(i, 'color', e.target.value)}
                className="h-9 w-9 rounded cursor-pointer border border-zinc-200 dark:border-zinc-700 bg-transparent p-0.5"
              />
              <Input
                value={stop.color}
                onChange={(e) => updateStop(i, 'color', e.target.value)}
                className="font-mono w-32"
              />
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min={0} max={100}
                  value={stop.pos}
                  onChange={(e) => updateStop(i, 'pos', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-mono text-zinc-500 w-10">{stop.pos}%</span>
              </div>
              {stops.length > 2 && (
                <button onClick={() => removeStop(i)} className="text-zinc-400 hover:text-red-500 text-sm transition-colors">✕</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <span className="section-label">Presets</span>
        <div className="flex gap-2 flex-wrap mt-1">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setStops(p.stops)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{ background: `linear-gradient(90deg, ${p.stops.map(s => `${s.color} ${s.pos}%`).join(', ')})` }}
              />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* CSS output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">CSS Output</span>
          <CopyButton text={`background: ${css};`} />
        </div>
        <pre className="tool-output text-xs whitespace-pre-wrap">
          {`background: ${css};`}
        </pre>
      </div>
    </div>
  );
}
