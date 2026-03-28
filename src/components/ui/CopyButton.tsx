'use client';

import { Check, Copy } from 'lucide-react';
import { useCopy } from '@/hooks/useCopy';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ text, className, size = 'sm' }: CopyButtonProps) {
  const { copied, copy } = useCopy();

  return (
    <button
      onClick={() => copy(text)}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm',
        copied
          ? 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300'
          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700',
        className
      )}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
