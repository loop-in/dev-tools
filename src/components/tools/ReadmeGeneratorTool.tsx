'use client';

import { useState, useMemo } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { Button } from '@/components/ui/Button';
import { downloadFile } from '@/lib/utils';
import { Download } from 'lucide-react';

interface Field { id: string; label: string; placeholder: string; multiline?: boolean; }

const FIELDS: Field[] = [
  { id: 'name', label: 'Project Name', placeholder: 'My Awesome Project' },
  { id: 'description', label: 'Description', placeholder: 'A brief description of what this project does.' },
  { id: 'install', label: 'Installation', placeholder: 'npm install\nnpm run dev', multiline: true },
  { id: 'usage', label: 'Usage', placeholder: 'npm start', multiline: true },
  { id: 'features', label: 'Features (one per line)', placeholder: 'Fast and lightweight\nDark mode support\nMobile friendly', multiline: true },
  { id: 'tech', label: 'Built With (comma-separated)', placeholder: 'Next.js, TypeScript, Tailwind CSS' },
  { id: 'license', label: 'License', placeholder: 'MIT' },
  { id: 'author', label: 'Author', placeholder: 'Your Name' },
];

function generateReadme(data: Record<string, string>): string {
  const { name, description, install, usage, features, tech, license, author } = data;
  const sections: string[] = [];

  if (name) sections.push(`# ${name}\n`);
  if (description) sections.push(`${description}\n`);

  if (tech) {
    const techs = tech.split(',').map(t => t.trim()).filter(Boolean);
    sections.push(`\n## 🛠 Built With\n\n${techs.map(t => `- ${t}`).join('\n')}`);
  }

  if (features) {
    const featureList = features.split('\n').filter(Boolean);
    sections.push(`\n## ✨ Features\n\n${featureList.map(f => `- ${f}`).join('\n')}`);
  }

  if (install) {
    sections.push(`\n## 🚀 Getting Started\n\n### Installation\n\n\`\`\`bash\n${install}\n\`\`\``);
  }

  if (usage) {
    sections.push(`\n## 📖 Usage\n\n\`\`\`bash\n${usage}\n\`\`\``);
  }

  sections.push(`\n## 🤝 Contributing\n\nContributions, issues and feature requests are welcome!`);

  if (license) {
    sections.push(`\n## 📄 License\n\nThis project is [${license}](./LICENSE) licensed.`);
  }

  if (author) {
    sections.push(`\n## 👤 Author\n\n**${author}**`);
  }

  return sections.join('\n');
}

export function ReadmeGeneratorTool() {
  const [data, setData] = useState<Record<string, string>>({
    name: 'My Project',
    description: 'A modern web application built with cutting-edge technologies.',
    tech: 'Next.js, TypeScript, Tailwind CSS',
    license: 'MIT',
  });

  const output = useMemo(() => generateReadme(data), [data]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          {FIELDS.map(({ id, label, placeholder, multiline }) => (
            <div key={id}>
              <label className="section-label">{label}</label>
              {multiline ? (
                <Textarea
                  value={data[id] ?? ''}
                  onChange={(e) => setData(prev => ({ ...prev, [id]: e.target.value }))}
                  placeholder={placeholder}
                  className="min-h-[80px]"
                />
              ) : (
                <Input
                  value={data[id] ?? ''}
                  onChange={(e) => setData(prev => ({ ...prev, [id]: e.target.value }))}
                  placeholder={placeholder}
                />
              )}
            </div>
          ))}
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="section-label">README.md Preview</span>
            <div className="flex items-center gap-2">
              <CopyButton text={output} />
              <Button variant="secondary" size="sm" onClick={() => downloadFile(output, 'README.md')}>
                <Download size={13} /> Download
              </Button>
            </div>
          </div>
          <pre className="tool-output whitespace-pre-wrap min-h-[400px] max-h-[600px] overflow-y-auto text-xs leading-relaxed">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
