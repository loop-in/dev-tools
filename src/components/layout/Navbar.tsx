'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Search, Sun, Moon, Menu, X, Terminal, Command } from 'lucide-react';
import { searchTools } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';
import type { Tool } from '@/types/tool';

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      setResults(searchTools(query).slice(0, 6));
      setShowSearch(true);
    } else {
      setResults([]);
      setShowSearch(false);
    }
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function selectTool(slug: string) {
    setQuery('');
    setShowSearch(false);
    router.push(`/tools/${slug}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
          <Terminal size={20} className="text-brand-500" />
          <span className="text-lg hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>DevTools</span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-auto">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-zinc-400 pointer-events-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              className={cn(
                'w-full h-9 pl-9 pr-16 rounded-lg border text-sm transition-colors',
                'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400',
                'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white',
                'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:focus:bg-zinc-800'
              )}
              onFocus={() => query && setShowSearch(true)}
            />
            <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
                <Command size={9} />K
              </kbd>
            </div>
          </div>

          {/* Dropdown */}
          {showSearch && results.length > 0 && (
            <div className="absolute top-full mt-1.5 w-full rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden animate-slide-in z-50">
              {results.map((tool) => (
                <button
                  key={tool.slug}
                  onClick={() => selectTool(tool.slug)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{tool.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">{tool.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
              title="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors sm:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 sm:hidden">
          <Link href="/" className="block py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            All Tools
          </Link>
          <Link href="/tools/json-formatter" className="block py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            JSON Formatter
          </Link>
          <Link href="/tools/jwt-decoder" className="block py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            JWT Decoder
          </Link>
          <Link href="/tools/regex-tester" className="block py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            Regex Tester
          </Link>
        </nav>
      )}
    </header>
  );
}
