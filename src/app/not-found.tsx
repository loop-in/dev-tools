import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/50 mb-6">
        <Terminal size={32} className="text-brand-500" />
      </div>
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        404
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6">
        This tool or page could not be found.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
      >
        ← Back to all tools
      </Link>
    </div>
  );
}
