'use client';

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/lib/utils';

interface UseCopyReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Hook that copies text to clipboard and briefly sets `copied` to true.
 * @param resetMs - how long (ms) to keep copied=true (default 2000)
 */
export function useCopy(resetMs = 2000): UseCopyReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyToClipboard(text);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), resetMs);
      }
    },
    [resetMs]
  );

  return { copied, copy };
}