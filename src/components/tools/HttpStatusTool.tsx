'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';


interface StatusCode {
  code: number;
  name: string;
  description: string;
}

type BadgeVariantType = 'info' | 'success' | 'warning' | 'error' | 'default';

const STATUS_CODES: StatusCode[] = [
  // 1xx
  { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.' },
  // 2xx
  { code: 200, name: 'OK', description: 'Standard response for successful HTTP requests.' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.' },
  { code: 204, name: 'No Content', description: 'The server successfully processed the request and is not returning any content.' },
  { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header sent by the client.' },
  // 3xx
  { code: 301, name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI.' },
  { code: 302, name: 'Found', description: 'Tells the client to look at another URL. Temporary redirect.' },
  { code: 304, name: 'Not Modified', description: 'The resource has not been modified since the version specified by the request headers.' },
  { code: 307, name: 'Temporary Redirect', description: 'The request should be repeated with another URI; but future requests should still use the original URI.' },
  { code: 308, name: 'Permanent Redirect', description: 'The request and all future requests should be repeated using another URI.' },
  // 4xx
  { code: 400, name: 'Bad Request', description: 'The server cannot or will not process the request due to an apparent client error.' },
  { code: 401, name: 'Unauthorized', description: 'Similar to 403, but specifically for use when authentication is required.' },
  { code: 403, name: 'Forbidden', description: 'The request was valid, but the server is refusing action. The user might not have the necessary permissions.' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found but may be available in the future.' },
  { code: 405, name: 'Method Not Allowed', description: 'A request method is not supported for the requested resource.' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request.' },
  { code: 409, name: 'Conflict', description: 'Indicates that the request could not be processed because of conflict in the current state of the resource.' },
  { code: 410, name: 'Gone', description: 'The resource requested is no longer available and will not be available again.' },
  { code: 413, name: 'Payload Too Large', description: 'The request is larger than the server is willing or able to process.' },
  { code: 415, name: 'Unsupported Media Type', description: 'The request entity has a media type which the server or resource does not support.' },
  { code: 422, name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors.' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time (rate limiting).' },
  // 5xx
  { code: 500, name: 'Internal Server Error', description: 'A generic error message, given when an unexpected condition was encountered.' },
  { code: 501, name: 'Not Implemented', description: 'The server either does not recognize the request method, or it lacks the ability to fulfil the request.' },
  { code: 502, name: 'Bad Gateway', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, name: 'Service Unavailable', description: 'The server cannot handle the request (maintenance or overloaded).' },
  { code: 504, name: 'Gateway Timeout', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' },
];

function getVariant(code: number): BadgeVariantType {
  if (code < 200) return 'info';
  if (code < 300) return 'success';
  if (code < 400) return 'warning';
  if (code < 500) return 'error';
  return 'error';
}

function groupLabel(code: number): string {
  if (code < 200) return '1xx Informational';
  if (code < 300) return '2xx Success';
  if (code < 400) return '3xx Redirection';
  if (code < 500) return '4xx Client Errors';
  return '5xx Server Errors';
}

export function HttpStatusTool() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STATUS_CODES.filter(
      (s) =>
        s.code.toString().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [search]);

  const groups = useMemo(() => {
    const map = new Map<string, StatusCode[]>();
    for (const s of filtered) {
      const g = groupLabel(s.code);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(s);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-5">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by code, name, or description…"
      />

      <div className="space-y-8">
        {[...groups.entries()].map(([group, codes]) => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              {group}
            </h3>
            <div className="space-y-2">
              {codes.map((s) => (
                <div
                  key={s.code}
                  className="flex items-start gap-4 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                >
                  <Badge variant={getVariant(s.code)} className="mt-0.5 shrink-0 font-mono font-bold text-sm">
                    {s.code}
                  </Badge>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
