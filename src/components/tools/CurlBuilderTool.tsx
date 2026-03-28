'use client';

import { useState, useMemo } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Plus, Trash2 } from 'lucide-react';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
interface Header { key: string; value: string; }

export function CurlBuilderTool() {
  const [url, setUrl] = useState('https://api.example.com/users');
  const [method, setMethod] = useState<Method>('GET');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer <token>' },
  ]);
  const [body, setBody] = useState('');
  const [followRedirects, setFollowRedirects] = useState(true);
  const [verbose, setVerbose] = useState(false);

  const addHeader = () => setHeaders((h) => [...h, { key: '', value: '' }]);
  const removeHeader = (i: number) => setHeaders((h) => h.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: 'key' | 'value', val: string) =>
    setHeaders((h) => h.map((hdr, idx) => idx === i ? { ...hdr, [field]: val } : hdr));

  const curl = useMemo(() => {
    const parts = ['curl'];
    if (verbose) parts.push('-v');
    if (followRedirects) parts.push('-L');
    parts.push(`-X ${method}`);
    for (const h of headers) {
      if (h.key.trim()) parts.push(`-H '${h.key}: ${h.value}'`);
    }
    if (body.trim() && !['GET', 'HEAD', 'DELETE'].includes(method)) {
      parts.push(`-d '${body.replace(/'/g, "\\'")}'`);
    }
    parts.push(`'${url}'`);
    return parts.join(' \\\n  ');
  }, [url, method, headers, body, followRedirects, verbose]);

  const METHODS: Method[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  const methodColors: Record<Method, string> = {
    GET: 'text-green-600', POST: 'text-blue-600', PUT: 'text-amber-600',
    PATCH: 'text-purple-600', DELETE: 'text-red-600', HEAD: 'text-zinc-600', OPTIONS: 'text-zinc-600',
  };

  return (
    <div className="space-y-6">
      {/* URL + method */}
      <div className="flex gap-2">
        <div className="w-36">
          <label className="section-label">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
            className={`w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 ${methodColors[method]}`}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="section-label">URL</label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/endpoint" />
        </div>
      </div>

      {/* Headers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">Headers</span>
          <Button variant="ghost" size="sm" onClick={addHeader}>
            <Plus size={13} /> Add Header
          </Button>
        </div>
        <div className="space-y-2">
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={h.key}
                onChange={(e) => updateHeader(i, 'key', e.target.value)}
                placeholder="Header name"
                className="w-48"
              />
              <Input
                value={h.value}
                onChange={(e) => updateHeader(i, 'value', e.target.value)}
                placeholder="Header value"
                className="flex-1"
              />
              <button
                onClick={() => removeHeader(i)}
                className="px-2 text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      {!['GET', 'HEAD'].includes(method) && (
        <div>
          <label className="section-label">Request Body</label>
          <Textarea
            monospace
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={'{\n  "key": "value"\n}'}
            className="min-h-[120px]"
          />
        </div>
      )}

      {/* Options */}
      <div className="flex items-center gap-4">
        {[
          { label: 'Follow Redirects (-L)', checked: followRedirects, set: setFollowRedirects },
          { label: 'Verbose (-v)', checked: verbose, set: setVerbose },
        ].map(({ label, checked, set }) => (
          <label key={label} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => set(e.target.checked)}
              className="rounded border-zinc-300 text-brand-500 focus:ring-brand-500"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">cURL Command</span>
          <CopyButton text={curl} />
        </div>
        <pre className="tool-output whitespace-pre-wrap">{curl}</pre>
      </div>
    </div>
  );
}
