import type { Metadata } from 'next';
import { TOOLS_BY_CATEGORY } from '@/lib/tools-registry';
import { SITE_DESCRIPTION } from '@/lib/seo';
import { ToolCard } from '@/components/tools/ToolCard';
import {
  Code2, Globe, ArrowLeftRight, Wand2, Palette, CalendarDays,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'DevUtils — Free Developer Utilities',
  description: SITE_DESCRIPTION,
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'code-text': Code2,
  'api-network': Globe,
  'data-conversion': ArrowLeftRight,
  'code-generation': Wand2,
  'design-frontend': Palette,
  'datetime': CalendarDays,
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        {/* Background grid decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Developer Utilities,
            <br />
            <span className="text-brand-500">All in One Place</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-zinc-500 dark:text-zinc-400">
            Format JSON, decode JWTs, build cURL commands, generate UUIDs — fast, free, and client-side.
          </p>
        </div>
      </section>

      {/* Tool categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-14">
        {TOOLS_BY_CATEGORY.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] ?? Code2;
          return (
            <div key={cat.id} id={cat.id}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                  <Icon size={18} />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {cat.label}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{cat.description}</p>
                </div>
              </div>

              {/* Tool cards grid */}
              <div className="grid-tool-cards">
                {cat.tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}