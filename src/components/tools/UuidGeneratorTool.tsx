'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { downloadFile } from '@/lib/utils';
import { RefreshCw, Download, Trash2 } from 'lucide-react';

function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function generateUuidV1(): string {
  const now = Date.now();
  const timeHigh = Math.floor(now / 0x100000000);
  const timeLow = now & 0xffffffff;
  const clockSeq = (Math.random() * 0x3fff) | 0x8000;
  const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
  return [
    timeLow.toString(16).padStart(8, '0'),
    (timeHigh & 0xffff).toString(16).padStart(4, '0'),
    ('1' + ((timeHigh >> 16) & 0x0fff).toString(16).padStart(3, '0')),
    clockSeq.toString(16).padStart(4, '0'),
    node,
  ].join('-');
}

type Version = 'v4' | 'v1';
type Format = 'standard' | 'uppercase' | 'no-hyphens' | 'braces';

function formatUuid(uuid: string, format: Format): string {
  switch (format) {
    case 'uppercase': return uuid.toUpperCase();
    case 'no-hyphens': return uuid.replace(/-/g, '');
    case 'braces': return `{${uuid}}`;
    default: return uuid;
  }
}

export function UuidGeneratorTool() {
  const [version, setVersion] = useState<Version>('v4');
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<Format>('standard');
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = useCallback(() => {
    const gen = version === 'v4' ? generateUuidV4 : generateUuidV1;
    setUuids(Array.from({ length: Math.min(count, 100) }, () => formatUuid(gen(), format)));
  }, [version, count, format]);

  const allText = uuids.join('\n');

  return (
    <div className="space-y-5">
      {/* Options */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="section-label">Version</label>
          <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {(['v4', 'v1'] as Version[]).map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${version === v ? 'bg-brand-500 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
              >
                UUID {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="section-label">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="standard">Standard</option>
            <option value="uppercase">Uppercase</option>
            <option value="no-hyphens">No hyphens</option>
            <option value="braces">With braces</option>
          </select>
        </div>

        <div>
          <label className="section-label">Count</label>
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 font-mono"
          />
        </div>

        <Button onClick={generate}>
          <RefreshCw size={14} /> Generate
        </Button>
      </div>

      {/* Output */}
      {uuids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">{uuids.length} UUID{uuids.length > 1 ? 's' : ''}</span>
            <div className="flex items-center gap-2">
              <CopyButton text={allText} />
              <Button variant="secondary" size="sm" onClick={() => downloadFile(allText, 'uuids.txt')}>
                <Download size={13} /> Download
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setUuids([])}>
                <Trash2 size={13} />
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <span className="font-mono text-sm text-zinc-800 dark:text-zinc-200 select-all">{uuid}</span>
                <CopyButton text={uuid} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
