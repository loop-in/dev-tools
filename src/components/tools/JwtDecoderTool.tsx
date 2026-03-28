'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card, CardBody } from '@/components/ui/Card';

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  try {
    return decodeURIComponent(escape(atob(padded)));
  } catch {
    return atob(padded);
  }
}

function decodeJwt(token: string) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('JWT must have exactly 3 parts');
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  return { header, payload, signature: parts[2] };
}

function formatTimestamp(ts: number) {
  return new Date(ts * 1000).toLocaleString();
}

export function JwtDecoderTool() {
  const [token, setToken] = useState('');

  const result = useMemo(() => {
    if (!token.trim()) return null;
    try {
      return { data: decodeJwt(token), error: null };
    } catch (e: unknown) {
      return { data: null, error: e instanceof Error ? e.message : 'Invalid JWT' };
    }
  }, [token]);

  const isExpired = result?.data?.payload?.exp
    ? result.data.payload.exp * 1000 < Date.now()
    : null;

  return (
    <div className="space-y-5">
      <div>
        <label className="section-label">JWT Token</label>
        <Textarea
          monospace
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here…"
          className="min-h-[100px]"
        />
      </div>

      {result?.error && (
        <Badge variant="error">{result.error}</Badge>
      )}

      {result?.data && (
        <div className="space-y-4">
          {/* Status badges */}
          <div className="flex items-center gap-2">
            <Badge variant="success">Valid Structure</Badge>
            {isExpired !== null && (
              <Badge variant={isExpired ? 'error' : 'success'}>
                {isExpired ? 'Expired' : 'Not Expired'}
              </Badge>
            )}
            {result.data.header.alg && (
              <Badge variant="info">{result.data.header.alg}</Badge>
            )}
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="section-label">Header</span>
              <CopyButton text={JSON.stringify(result.data.header, null, 2)} />
            </div>
            <Card>
              <CardBody>
                <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-auto">
                  {JSON.stringify(result.data.header, null, 2)}
                </pre>
              </CardBody>
            </Card>
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="section-label">Payload</span>
              <CopyButton text={JSON.stringify(result.data.payload, null, 2)} />
            </div>
            <Card>
              <CardBody>
                <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-auto mb-4">
                  {JSON.stringify(result.data.payload, null, 2)}
                </pre>

                {/* Time fields */}
                {(result.data.payload.iat || result.data.payload.exp || result.data.payload.nbf) && (
                  <div className="mt-3 border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-2">
                    {result.data.payload.iat && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Issued At (iat)</span>
                        <span className="font-mono text-zinc-700 dark:text-zinc-300">{formatTimestamp(result.data.payload.iat)}</span>
                      </div>
                    )}
                    {result.data.payload.exp && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Expires (exp)</span>
                        <span className={`font-mono ${isExpired ? 'text-red-500' : 'text-green-600'}`}>
                          {formatTimestamp(result.data.payload.exp)}
                        </span>
                      </div>
                    )}
                    {result.data.payload.nbf && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Not Before (nbf)</span>
                        <span className="font-mono text-zinc-700 dark:text-zinc-300">{formatTimestamp(result.data.payload.nbf)}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Signature */}
          <div>
            <span className="section-label">Signature</span>
            <Card>
              <CardBody>
                <p className="font-mono text-xs text-zinc-500 break-all">{result.data.signature}</p>
                <p className="mt-2 text-xs text-zinc-400">⚠️ Signature verification requires the secret key and cannot be done client-side.</p>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
