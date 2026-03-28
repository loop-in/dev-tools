import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Tool } from '@/types/tool';
import { TOOL_CATEGORIES } from '@/lib/tools-registry';

interface ToolShellProps {
  tool: Tool;
  children: React.ReactNode;
}

export function ToolShell({ tool, children }: ToolShellProps) {
  const category = TOOL_CATEGORIES.find((c) => c.id === tool.category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Home</Link>
        <ChevronRight size={12} />
        {category && (
          <>
            <Link href={`/#${category.id}`} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              {category.label}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-zinc-600 dark:text-zinc-300">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-zinc-900 dark:text-zinc-100"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {tool.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{tool.description}</p>
      </div>

      {/* Tool content */}
      {children}
    </div>
  );
}
