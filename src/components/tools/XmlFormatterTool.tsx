'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Badge } from '@/components/ui/Badge';
import { downloadFile } from '@/lib/utils';
import { Minimize2, Maximize2, Download } from 'lucide-react';

type IndentSize = 2 | 4;

export function formatXml(xml: string, indentSize: number = 2, keepComments: boolean = true): string {
  const indent = ' '.repeat(indentSize);
  let formatted = '';
  let depth = 0;

  // Split by comments, CDATA, or tags
  const tokenRegex = /(<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\/?[^>]+>)/g;
  const tokens = xml.split(tokenRegex);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (token.startsWith('<!--')) {
      if (keepComments) {
        formatted += indent.repeat(depth) + token + '\n';
      }
    } else if (token.startsWith('<?') && token.endsWith('?>')) {
      // Processing instruction
      formatted += indent.repeat(depth) + token + '\n';
    } else if (token.startsWith('<![CDATA[')) {
      formatted += indent.repeat(depth) + token + '\n';
    } else if (token.startsWith('<!')) {
      // DOCTYPE or other declaration
      formatted += indent.repeat(depth) + token + '\n';
    } else if (token.startsWith('</')) {
      // Closing tag
      depth = Math.max(0, depth - 1);
      formatted += indent.repeat(depth) + token + '\n';
    } else if (token.startsWith('<') && (token.endsWith('/>') || token.endsWith('/ >') || /\/\s*>$/.test(token))) {
      // Self-closing tag
      formatted += indent.repeat(depth) + token + '\n';
    } else if (token.startsWith('<')) {
      // Opening tag
      const nextToken = tokens[i + 1]?.trim() || '';
      const nextNextToken = tokens[i + 2]?.trim() || '';

      const tagNameMatch = token.match(/^<([a-zA-Z0-9_\-:]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1] : '';

      if (tagName && nextToken === `</${tagName}>`) {
        formatted += indent.repeat(depth) + token + nextToken + '\n';
        i += 1;
      } else if (tagName && nextNextToken === `</${tagName}>` && !nextToken.startsWith('<')) {
        formatted += indent.repeat(depth) + token + nextToken + nextNextToken + '\n';
        i += 2;
      } else {
        formatted += indent.repeat(depth) + token + '\n';
        depth++;
      }
    } else {
      // Text node
      formatted += indent.repeat(depth) + token + '\n';
    }
  }

  return formatted.trim();
}

export function minifyXml(xml: string, keepComments: boolean = false): string {
  let minified = xml;
  if (!keepComments) {
    minified = minified.replace(/<!--[\s\S]*?-->/g, '');
  }

  const tagRegex = /(<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\/?[^>]+>)/g;
  const parts = minified.split(tagRegex);

  let result = '';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('<')) {
      result += part.trim();
    } else {
      const trimmed = part.trim();
      if (trimmed) {
        result += part.replace(/\s+/g, ' ');
      }
    }
  }

  return result;
}

export function validateXml(xml: string): string | null {
  if (!xml.trim()) return null;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return parserError.textContent || 'Invalid XML structure';
    }
    return null;
  } catch (err: unknown) {
    return err instanceof Error ? err.message : 'XML validation failed';
  }
}

export function XmlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<IndentSize>(2);
  const [keepComments, setKeepComments] = useState(true);

  const handleFormat = useCallback(() => {
    if (!input.trim()) return;
    const validationError = validateXml(input);
    if (validationError) {
      setError(validationError);
      setOutput('');
    } else {
      setError('');
      setOutput(formatXml(input, indent, keepComments));
    }
  }, [input, indent, keepComments]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    const validationError = validateXml(input);
    if (validationError) {
      setError(validationError);
      setOutput('');
    } else {
      setError('');
      setOutput(minifyXml(input, keepComments));
    }
  }, [input, keepComments]);

  const isValid = input.trim() ? validateXml(input) === null : null;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Indent:</span>
          {([2, 4] as IndentSize[]).map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={`h-7 w-10 rounded text-xs font-mono font-medium transition-colors ${indent === n
                  ? 'bg-brand-500 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
          <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepComments}
              onChange={(e) => setKeepComments(e.target.checked)}
              className="rounded border-zinc-300 text-brand-500 focus:ring-brand-500 h-3.5 w-3.5"
            />
            Keep comments
          </label>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Button variant="secondary" size="sm" onClick={handleMinify}>
            <Minimize2 size={13} /> Minify
          </Button>
          <Button size="sm" onClick={handleFormat}>
            <Maximize2 size={13} /> Format
          </Button>
        </div>
      </div>

      {/* Editor row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="section-label">Input XML</span>
            {isValid !== null && (
              <Badge variant={isValid ? 'success' : 'error'}>
                {isValid ? 'Valid XML' : 'Invalid XML'}
              </Badge>
            )}
          </div>
          <Textarea
            monospace
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don\'t forget me this weekend!</body>\n</note>'}
            className="min-h-[360px]"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="section-label">Formatted Output</span>
            <div className="flex items-center gap-2">
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadFile(output, 'formatted.xml', 'application/xml')}
                >
                  <Download size={13} /> Download
                </Button>
              )}
              {output && <CopyButton text={output} />}
            </div>
          </div>
          {error ? (
            <div className="min-h-[360px] rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap">{error}</p>
            </div>
          ) : (
            <pre className="tool-output min-h-[360px] whitespace-pre-wrap break-words">
              {output || <span className="text-zinc-600">Formatted XML will appear here…</span>}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
