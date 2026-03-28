'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Badge } from '@/components/ui/Badge';
import { downloadFile, formatBytes } from '@/lib/utils';
import { Download } from 'lucide-react';

function optimizeSvg(svg: string): string {
  let result = svg;

  // Remove XML declaration
  result = result.replace(/<\?xml[^>]*\?>/gi, '');

  // Remove comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  // Remove metadata, title, desc (optional but common in exports)
  result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
  result = result.replace(/<title[\s\S]*?<\/title>/gi, '');
  result = result.replace(/<desc[\s\S]*?<\/desc>/gi, '');

  // Remove editor-specific namespaces (Inkscape, Illustrator, etc.)
  result = result.replace(/\s+xmlns:(inkscape|sodipodi|dc|cc|rdf|xlink)="[^"]*"/g, '');
  result = result.replace(/\s+(inkscape|sodipodi):[a-zA-Z\-]+=("[^"]*"|'[^']*')/g, '');

  // Remove empty groups
  result = result.replace(/<g[^>]*>\s*<\/g>/g, '');

  // Remove data-* attributes
  result = result.replace(/\s+data-[a-z\-]+="[^"]*"/g, '');

  // Remove style="display:none" elements
  result = result.replace(/<[^>]+style="[^"]*display\s*:\s*none[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/g, '');

  // Collapse multiple whitespace
  result = result.replace(/\s{2,}/g, ' ');

  // Trim attributes
  result = result.replace(/\s+>/g, '>');

  // Remove whitespace between tags
  result = result.replace(/>\s+</g, '><');

  return result.trim();
}

export function SvgOptimizerTool() {
  const [input, setInput] = useState(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <!-- Icon -->
  <title>Check icon</title>
  <desc>A checkmark icon</desc>
  <g id="layer1" inkscape:label="Layer 1">
    <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`);

  const output = useMemo(() => input.trim() ? optimizeSvg(input) : '', [input]);

  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const savings = inputSize > 0 ? Math.round((1 - outputSize / inputSize) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <span className="section-label">Input SVG</span>
          <Textarea monospace value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[300px]" placeholder="Paste SVG code here…" />
          <p className="text-xs text-zinc-400 mt-1">{formatBytes(inputSize)}</p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">Optimized SVG</span>
            <div className="flex items-center gap-2">
              {output && <Badge variant={savings > 0 ? 'success' : 'default'}>{savings > 0 ? `-${savings}%` : 'No change'}</Badge>}
              {output && <CopyButton text={output} />}
              {output && (
                <Button variant="secondary" size="sm" onClick={() => downloadFile(output, 'optimized.svg', 'image/svg+xml')}>
                  <Download size={13} />
                </Button>
              )}
            </div>
          </div>
          <pre className="tool-output min-h-[300px] whitespace-pre-wrap break-all text-xs">
            {output || <span className="text-zinc-600">Optimized SVG appears here…</span>}
          </pre>
          {output && <p className="text-xs text-zinc-400 mt-1">{formatBytes(outputSize)}</p>}
        </div>
      </div>

      {/* Preview */}
      {output && (
        <div>
          <span className="section-label">Preview</span>
          <div className="flex items-center gap-6 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: output }} />
            <div className="bg-zinc-900 dark:bg-zinc-700 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: output }} />
          </div>
        </div>
      )}
    </div>
  );
}
