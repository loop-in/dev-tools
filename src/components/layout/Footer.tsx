import Link from 'next/link';
import { Terminal, Github } from 'lucide-react';
import { TOOL_CATEGORIES, TOOLS } from '@/lib/tools-registry';

export function Footer() {
  const featured = TOOLS.slice(0, 8);

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              <Terminal size={18} className="text-brand-500" />
              <span style={{ fontFamily: 'var(--font-display)' }}>DevTools</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Free, fast developer utilities. No sign-up required.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <Github size={15} /> Open Source
            </a>
          </div>

          {/* Categories */}
          <div>
            <p className="section-label">Categories</p>
            <ul className="space-y-2">
              {TOOL_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/#${cat.id}`}
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular tools */}
          <div className="col-span-2 md:col-span-2">
            <p className="section-label">Popular Tools</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {featured.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()} DevTools. All rights reserved.</p>
          <p className="text-xs text-zinc-400">Built with Next.js · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
