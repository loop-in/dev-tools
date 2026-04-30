'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type LineType = 'unchanged' | 'added' | 'removed';
interface DiffChunk { type: 'unchanged' | 'added' | 'removed'; text: string; }
interface DiffLine { type: LineType; text: string; lineA?: number; lineB?: number; chunks?: DiffChunk[]; }

function computeDiffChars(a: string, b: string): DiffChunk[] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const result: DiffChunk[] = [];
  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && a[i] === b[j]) {
      let text = '';
      while (i < m && j < n && a[i] === b[j]) { text += a[i++]; j++; }
      result.push({ type: 'unchanged', text });
    } else {
      let moveA = false;
      if (i < m && j < n) {
        moveA = dp[i + 1][j] >= dp[i][j + 1];
      } else if (i < m) {
        moveA = true;
      }

      if (moveA) {
        let text = '';
        while (i < m && (j >= n || dp[i + 1][j] >= (j < n ? dp[i][j + 1] : -1))) {
          if (j < n && a[i] === b[j]) break;
          text += a[i++];
        }
        result.push({ type: 'removed', text });
      } else {
        let text = '';
        while (j < n && (i >= m || dp[i][j + 1] > (i < m ? dp[i + 1][j] : -1))) {
          if (i < m && a[i] === b[j]) break;
          text += b[j++];
        }
        result.push({ type: 'added', text });
      }
    }
  }
  return result;
}

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const result: DiffLine[] = [];

  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = linesA[i] === linesB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  let i = 0, j = 0, lineACount = 1, lineBCount = 1;
  while (i < m || j < n) {
    if (i < m && j < n && linesA[i] === linesB[j]) {
      result.push({ type: 'unchanged', text: linesA[i], lineA: lineACount++, lineB: lineBCount++ });
      i++; j++;
    } else {
      const removed: string[] = [];
      const added: string[] = [];
      
      // Group contiguous changes into a single block
      while (i < m || j < n) {
        if (i < m && j < n && linesA[i] === linesB[j]) break;
        
        let moveA = false;
        if (i < m && j < n) {
          moveA = dp[i + 1][j] >= dp[i][j + 1];
        } else if (i < m) {
          moveA = true;
        }

        if (moveA) {
          removed.push(linesA[i++]);
        } else {
          added.push(linesB[j++]);
        }
      }

      const minLen = Math.min(removed.length, added.length);
      const tempDiffs: DiffLine[] = [];
      
      // Pair removed and added lines for character diff
      for (let k = 0; k < minLen; k++) {
        const charDiff = computeDiffChars(removed[k], added[k]);
        tempDiffs.push({
          type: 'removed',
          text: removed[k],
          lineA: lineACount++,
          chunks: charDiff.filter((c: DiffChunk) => c.type !== 'added')
        });
      }
      for (let k = minLen; k < removed.length; k++) {
        tempDiffs.push({ type: 'removed', text: removed[k], lineA: lineACount++ });
      }
      for (let k = 0; k < minLen; k++) {
        const charDiff = computeDiffChars(removed[k], added[k]);
        tempDiffs.push({
          type: 'added',
          text: added[k],
          lineB: lineBCount++,
          chunks: charDiff.filter((c: DiffChunk) => c.type !== 'removed')
        });
      }
      for (let k = minLen; k < added.length; k++) {
        tempDiffs.push({ type: 'added', text: added[k], lineB: lineBCount++ });
      }
      result.push(...tempDiffs);
    }
  }
  return result;
}

export function DiffCheckerTool() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [compared, setCompared] = useState(false);

  const diff = useMemo(() => {
    if (!compared) return null;
    return computeDiff(textA, textB);
  }, [textA, textB, compared]);

  const stats = useMemo(() => {
    if (!diff) return null;
    const added = diff.filter(l => l.type === 'added').length;
    const removed = diff.filter(l => l.type === 'removed').length;
    return { added, removed };
  }, [diff]);

  const lineClasses: Record<LineType, string> = {
    unchanged: 'text-zinc-700 dark:text-zinc-300',
    added: 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300',
    removed: 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 opacity-80',
  };

  const linePrefix: Record<LineType, string> = {
    unchanged: '  ',
    added: '+ ',
    removed: '- ',
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="section-label">Original (A)</label>
          <Textarea
            value={textA}
            onChange={(e) => { setTextA(e.target.value); setCompared(false); }}
            placeholder="Paste original text here…"
            className="min-h-[240px]"
          />
        </div>
        <div>
          <label className="section-label">Modified (B)</label>
          <Textarea
            value={textB}
            onChange={(e) => { setTextB(e.target.value); setCompared(false); }}
            placeholder="Paste modified text here…"
            className="min-h-[240px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => setCompared(true)} disabled={!textA || !textB}>
          Compare
        </Button>
        {stats && (
          <>
            <Badge variant="success">+{stats.added} added</Badge>
            <Badge variant="error">-{stats.removed} removed</Badge>
          </>
        )}
      </div>

      {diff && (
        <div>
          <label className="section-label">Diff Output</label>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-auto">
            <table className="w-full text-xs font-mono">
              <tbody>
                {diff.map((line, i) => (
                  <tr key={i} className={lineClasses[line.type]}>
                    <td className="w-10 px-2 py-0.5 text-right text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 select-none">
                      {line.lineA ?? ''}
                    </td>
                    <td className="w-10 px-2 py-0.5 text-right text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 select-none">
                      {line.lineB ?? ''}
                    </td>
                    <td className="w-6 px-2 py-0.5 text-center select-none font-bold">
                      {linePrefix[line.type]}
                    </td>
                    <td className="px-3 py-0.5 whitespace-pre-wrap">
                      {line.chunks ? (
                        line.chunks.map((chunk: DiffChunk, j: number) => (
                          <span
                            key={j}
                            className={
                              chunk.type === 'added' 
                                ? 'bg-green-200 dark:bg-green-700/50 rounded-sm' 
                                : chunk.type === 'removed' 
                                  ? 'bg-red-200 dark:bg-red-700/50 rounded-sm' 
                                  : ''
                            }
                          >
                            {chunk.text}
                          </span>
                        ))
                      ) : (
                        line.text || ' '
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
