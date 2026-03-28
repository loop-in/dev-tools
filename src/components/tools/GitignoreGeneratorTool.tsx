'use client';

import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { downloadFile } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Download, X } from 'lucide-react';

const TEMPLATES: Record<string, string> = {
  Node: `# Dependencies\nnode_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n\n# Build\ndist/\nbuild/\n.next/\n.nuxt/\n\n# Environment\n.env\n.env.local\n.env.*.local\n\n# Logs\nlogs/\n*.log\n\n# OS\n.DS_Store\nThumbs.db`,
  Python: `# Byte-compiled / optimized\n__pycache__/\n*.py[cod]\n*$py.class\n*.pyc\n\n# Distribution\ndist/\nbuild/\n*.egg-info/\n\n# Virtual envs\n.env\n.venv\nvenv/\nenv/\n\n# IDE\n.idea/\n*.swp\n\n# OS\n.DS_Store`,
  Java: `# Compiled\n*.class\n*.jar\n*.war\n*.ear\n\n# Build\ntarget/\nbuild/\nout/\n\n# IDE\n.idea/\n*.iml\n.eclipse/\n*.classpath\n*.project\n\n# OS\n.DS_Store\nThumbs.db`,
  Go: `# Binaries\n*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n\n# Test binary\n*.test\n\n# Go workspace\ngo.work\ngo.work.sum\n\n# Output\ndist/\nbuild/\n\n# OS\n.DS_Store`,
  Rust: `# Generated\n/target/\nCargo.lock\n\n# Backup files\n**/*.rs.bk\n\n# OS\n.DS_Store\nThumbs.db`,
  React: `# Dependencies\nnode_modules/\n\n# Build\nbuild/\ndist/\n.next/\n\n# Testing\ncoverage/\n\n# Env\n.env\n.env.local\n.env.development.local\n.env.test.local\n.env.production.local\n\n# Debug\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n\n# OS\n.DS_Store`,
  'Vue/Nuxt': `# Dependencies\nnode_modules/\n\n# Build\ndist/\n.nuxt/\n.output/\n\n# Env\n.env\n.env.local\n\n# Cache\n.eslintcache\n.cache/\n\n# OS\n.DS_Store`,
  Docker: `# Docker\n*.log\n.dockerignore\n\n# Environment\n.env\n.env.*\n!.env.example\n\n# OS\n.DS_Store\nThumbs.db\n\n# IDE\n.idea/\n.vscode/`,
  macOS: `.DS_Store\n.AppleDouble\n.LSOverride\nIcon\n._*\n.DocumentRevisions-V100\n.fseventsd\n.Spotlight-V100\n.TemporaryItems\n.Trashes\n.VolumeIcon.icns\n.com.apple.timemachine.donotpresent`,
  Windows: `Thumbs.db\nThumbs.db:encryptable\nehthumbs.db\nehthumbs_vista.db\n*.tmp\n*.bak\n*.swp\n*~.nib\ndesktop.ini\n$RECYCLE.BIN/\n*.cab\n*.msi\n*.msix\n*.msm\n*.msp\n*.lnk`,
  VSCode: `.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n*.code-workspace\n.history/`,
  JetBrains: `.idea/\n*.iml\n*.iws\n.idea_modules/\natlas.json\n.idea/shelf/\nout/`,
};

const CATEGORIES = [
  { label: 'Languages', items: ['Node', 'Python', 'Java', 'Go', 'Rust'] },
  { label: 'Frameworks', items: ['React', 'Vue/Nuxt'] },
  { label: 'Tools', items: ['Docker', 'VSCode', 'JetBrains'] },
  { label: 'OS', items: ['macOS', 'Windows'] },
];

export function GitignoreGeneratorTool() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['Node', 'macOS', 'VSCode']));

  const toggle = (item: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(item) ? next.delete(item) : next.add(item);
    return next;
  });

  const output = useMemo(() => {
    const parts = [...selected].map(s =>
      `# ─── ${s} ─────────────────────────────────────────────\n${TEMPLATES[s] ?? ''}`
    );
    return parts.join('\n\n');
  }, [selected]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {CATEGORIES.map(({ label, items }) => (
          <div key={label}>
            <span className="section-label">{label}</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => toggle(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${selected.has(item)
                      ? 'border-brand-400 bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-700'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                >
                  {selected.has(item) && <X size={11} />}
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected.size > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">.gitignore · {selected.size} template{selected.size > 1 ? 's' : ''}</span>
            <div className="flex items-center gap-2">
              <CopyButton text={output} />
              <Button variant="secondary" size="sm" onClick={() => downloadFile(output, '.gitignore')}>
                <Download size={13} /> Download
              </Button>
            </div>
          </div>
          <pre className="tool-output whitespace-pre-wrap max-h-[480px] overflow-y-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}
