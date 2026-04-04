import Link from 'next/link';
import {
  Braces, Regex, Binary, Hash, GitCompare, FileText,
  KeyRound, Terminal, ServerCrash, Table, Pipette, Clock,
  CalendarClock, Calculator, Fingerprint, AlignLeft, Database,
  GitBranch, BookOpen, Blend, ImageDown, ArrowRight,
  Globe2, Clock4, CalendarRange, SunMedium, CalendarCheck, CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types/tool';

const ICON_MAP: Record<string, React.ElementType> = {
  Braces, Regex, Binary, Hash, GitCompare, FileText,
  KeyRound, Terminal, ServerCrash, Table, Pipette, Clock,
  CalendarClock, Calculator, Fingerprint, AlignLeft, Database,
  GitBranch, BookOpen, Blend, ImageDown,
  Globe2, Clock4, CalendarRange, SunMedium, CalendarCheck, CalendarDays,
};

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = ICON_MAP[tool.icon] ?? Braces;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 transition-all',
        'hover:border-brand-300 hover:shadow-md hover:shadow-brand-100',
        'dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-brand-700 dark:hover:shadow-brand-950',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
          <Icon size={20} />
        </div>
        <ArrowRight
          size={16}
          className="text-zinc-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all dark:text-zinc-600"
        />
      </div>
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
          {tool.name}
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
