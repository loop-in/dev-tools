'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est'.split(' ');

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function randomWords(n: number): string[] {
  return Array.from({ length: n }, (_, i) =>
    i === 0 ? WORDS[0] : WORDS[Math.floor(Math.random() * WORDS.length)]
  );
}

function generateSentence(): string {
  const wordCount = Math.floor(Math.random() * 12) + 6;
  const words = randomWords(wordCount);
  return capitalize(words.join(' ')) + '.';
}

function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 3;
  return Array.from({ length: sentenceCount }, generateSentence).join(' ');
}

type Type = 'paragraphs' | 'sentences' | 'words';

export function LoremIpsumTool() {
  const [type, setType] = useState<Type>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    let result = '';
    if (type === 'paragraphs') {
      const paras = Array.from({ length: count }, generateParagraph);
      if (startWithLorem) paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paras[0];
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sents = Array.from({ length: count }, generateSentence);
      if (startWithLorem) sents[0] = 'Lorem ipsum dolor sit amet.';
      result = sents.join(' ');
    } else {
      const words = randomWords(count);
      if (startWithLorem) { words[0] = 'lorem'; words[1] = 'ipsum'; }
      result = words.join(' ');
    }
    setOutput(result);
  }, [type, count, startWithLorem]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        {/* Type */}
        <div>
          <label className="section-label">Type</label>
          <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {(['paragraphs', 'sentences', 'words'] as Type[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${type === t ? 'bg-brand-500 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <label className="section-label">Count</label>
          <Input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 font-mono"
          />
        </div>

        {/* Start with lorem */}
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer pb-1">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="rounded border-zinc-300 text-brand-500 focus:ring-brand-500"
          />
          Start with "Lorem ipsum"
        </label>

        <Button onClick={generate}>Generate</Button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">Output · {output.split(' ').length} words</span>
            <CopyButton text={output} />
          </div>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            {type === 'paragraphs'
              ? output.split('\n\n').map((p, i) => (
                <p key={i} className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 last:mb-0">{p}</p>
              ))
              : <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{output}</p>
            }
          </div>
        </div>
      )}
    </div>
  );
}
