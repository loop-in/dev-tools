'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue = (t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    r = hue(h + 1 / 3); g = hue(h); b = hue(h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function ColorConverterTool() {
  const [hex, setHex] = useState('#22c55e');
  const [error, setError] = useState('');

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgb ? rgbToHsl(...rgb) : null, [rgb]);

  function handleHexChange(v: string) {
    setHex(v.startsWith('#') ? v : '#' + v);
    setError(hexToRgb(v.replace('#', '').padEnd(6, '0')) ? '' : 'Invalid hex color');
  }

  function handleRgbChange(channel: 0 | 1 | 2, val: string) {
    if (!rgb) return;
    const n = Math.min(255, Math.max(0, parseInt(val) || 0));
    const next: [number, number, number] = [...rgb] as [number, number, number];
    next[channel] = n;
    setHex(rgbToHex(...next));
    setError('');
  }

  function handleHslChange(channel: 0 | 1 | 2, val: string) {
    if (!hsl) return;
    const maxes = [360, 100, 100];
    const n = Math.min(maxes[channel], Math.max(0, parseInt(val) || 0));
    const next: [number, number, number] = [...hsl] as [number, number, number];
    next[channel] = n;
    setHex(rgbToHex(...hslToRgb(...next)));
    setError('');
  }

  const preview = rgb ? `rgb(${rgb.join(', ')})` : '#fff';

  const formats = rgb && hsl ? [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${rgb.join(', ')})` },
    { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
    { label: 'CSS Variable', value: `--color: ${hex};` },
    { label: 'Tailwind (approx)', value: `text-[${hex}]` },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Preview swatch */}
      <div className="flex items-center gap-4">
        <div
          className="h-20 w-20 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
          style={{ background: preview }}
        />
        <div className="flex-1 space-y-3">
          {/* HEX input */}
          <div>
            <label className="section-label">HEX</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hex.length === 7 ? hex : '#22c55e'}
                onChange={(e) => { setHex(e.target.value); setError(''); }}
                className="h-10 w-10 rounded cursor-pointer border border-zinc-200 dark:border-zinc-700 bg-transparent p-0.5"
              />
              <Input value={hex} onChange={(e) => handleHexChange(e.target.value)} className="font-mono w-36" />
              {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
          </div>
        </div>
      </div>

      {rgb && hsl && (
        <>
          {/* RGB sliders */}
          <div>
            <label className="section-label">RGB</label>
            <div className="grid grid-cols-3 gap-3">
              {(['R', 'G', 'B'] as const).map((ch, i) => (
                <div key={ch}>
                  <label className="text-xs text-zinc-500 mb-1 block">{ch}</label>
                  <Input
                    type="number"
                    min={0} max={255}
                    value={rgb[i]}
                    onChange={(e) => handleRgbChange(i as 0 | 1 | 2, e.target.value)}
                    className="font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* HSL sliders */}
          <div>
            <label className="section-label">HSL</label>
            <div className="grid grid-cols-3 gap-3">
              {[['H', '°', 360], ['S', '%', 100], ['L', '%', 100]].map(([ch, unit, max], i) => (
                <div key={ch}>
                  <label className="text-xs text-zinc-500 mb-1 block">{ch} {unit}</label>
                  <Input
                    type="number"
                    min={0} max={max as number}
                    value={hsl[i]}
                    onChange={(e) => handleHslChange(i as 0 | 1 | 2, e.target.value)}
                    className="font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* All formats */}
          <div>
            <label className="section-label">All Formats</label>
            <div className="space-y-2">
              {formats.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3">
                  <span className="text-xs text-zinc-500 w-28">{label}</span>
                  <code className="flex-1 text-sm font-mono text-zinc-800 dark:text-zinc-200">{value}</code>
                  <CopyButton text={value} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
