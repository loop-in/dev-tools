import { Tool, ToolCategoryMeta } from '@/types/tool';

export const TOOL_CATEGORIES: ToolCategoryMeta[] = [
  {
    id: 'format-validate',
    label: 'Format & Validate',
    description: 'Format, prettify, and validate code and text',
    icon: 'CheckSquare',
  },
  {
    id: 'datetime',
    label: 'Date, Time & Scheduling',
    description: 'Timezone conversion, date math, and scheduling tools',
    icon: 'CalendarDays',
  },
  {
    id: 'encode-decode',
    label: 'Security & Encoders',
    description: 'Encode, decode, and hash strings and tokens',
    icon: 'Shield',
  },
  {
    id: 'api-network',
    label: 'Web & Network',
    description: 'Tools for APIs, HTTP requests, and network debugging',
    icon: 'Globe',
  },
  {
    id: 'generators',
    label: 'Generators',
    description: 'Generate boilerplate, UUIDs, and placeholders',
    icon: 'Wand2',
  },
  {
    id: 'design-ui',
    label: 'Design & UI',
    description: 'Colors, CSS utilities, and frontend helpers',
    icon: 'Palette',
  },
  {
    id: 'data-math',
    label: 'Data & Math',
    description: 'Convert between data formats and numerical bases',
    icon: 'ArrowLeftRight',
  },
];

export const TOOLS: Tool[] = [
  // Format & Validate
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON with syntax highlighting',
    category: 'format-validate',
    icon: 'Braces',
    keywords: ['json', 'format', 'validate', 'pretty print', 'minify'],
    isPopular: true,
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Beautify and format SQL queries for readability',
    category: 'format-validate',
    icon: 'Database',
    keywords: ['sql', 'format', 'query', 'beautify', 'database'],
  },
  {
    slug: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two blocks of text and highlight differences',
    category: 'format-validate',
    icon: 'GitCompare',
    keywords: ['diff', 'compare', 'difference', 'text'],
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with live match highlighting',
    category: 'format-validate',
    icon: 'Regex',
    keywords: ['regex', 'regexp', 'pattern', 'match', 'test'],
    isPopular: true,
  },
  {
    slug: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Write Markdown and preview the rendered output live',
    category: 'format-validate',
    icon: 'FileText',
    keywords: ['markdown', 'md', 'preview', 'render'],
  },

  // Date, Time & Scheduling
  {
    slug: 'timezone-converter',
    name: 'Timezone Converter',
    description: 'Convert a time across multiple timezones simultaneously',
    category: 'datetime',
    icon: 'Globe2',
    keywords: ['timezone', 'time zone', 'convert', 'utc', 'gmt', 'dst'],
    isPopular: true,
  },
  {
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    category: 'datetime',
    icon: 'Clock',
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'time', 'convert'],
  },
  {
    slug: 'cron-builder',
    name: 'Cron Expression Builder',
    description: 'Build and explain cron expressions visually',
    category: 'datetime',
    icon: 'CalendarClock',
    keywords: ['cron', 'schedule', 'expression', 'job', 'task'],
  },
  {
    slug: 'world-clock',
    name: 'World Clock',
    description: 'See the current time across major cities and timezones at a glance',
    category: 'datetime',
    icon: 'Clock4',
    keywords: ['world clock', 'timezone', 'cities', 'current time', 'global'],
  },
  {
    slug: 'date-calculator',
    name: 'Date Calculator',
    description: 'Add or subtract days from a date and find the difference between two dates',
    category: 'datetime',
    icon: 'CalendarRange',
    keywords: ['date', 'calculator', 'difference', 'add days', 'subtract', 'duration'],
  },
  {
    slug: 'dst-checker',
    name: 'DST Checker',
    description: 'Check if a timezone observes Daylight Saving Time and when it changes',
    category: 'datetime',
    icon: 'SunMedium',
    keywords: ['dst', 'daylight saving', 'summer time', 'timezone', 'clock change'],
  },
  {
    slug: 'date-formatter',
    name: 'Date Formatter',
    description: 'Format dates in ISO 8601, RFC 2822, and other standards used in APIs',
    category: 'datetime',
    icon: 'CalendarCheck',
    keywords: ['date format', 'iso 8601', 'rfc 2822', 'strftime', 'moment', 'dayjs'],
  },
  {
    slug: 'week-number',
    name: 'Week Number',
    description: 'Find the ISO week number for any date and browse weeks in a year',
    category: 'datetime',
    icon: 'CalendarDays',
    keywords: ['week number', 'iso week', 'week of year', 'calendar week'],
  },

  // Security & Encoders
  {
    slug: 'base64',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode and decode Base64 and URL-safe Base64 strings',
    category: 'encode-decode',
    icon: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'url'],
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes',
    category: 'encode-decode',
    icon: 'Hash',
    keywords: ['hash', 'md5', 'sha', 'sha256', 'sha512', 'checksum'],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Token header, payload, and signature',
    category: 'encode-decode',
    icon: 'KeyRound',
    keywords: ['jwt', 'token', 'decode', 'json web token', 'auth'],
    isPopular: true,
  },

  // Web & Network
  {
    slug: 'curl-builder',
    name: 'cURL Command Builder',
    description: 'Build cURL commands visually with headers, body, and auth',
    category: 'api-network',
    icon: 'Terminal',
    keywords: ['curl', 'http', 'request', 'api', 'command'],
    isPopular: true,
  },
  {
    slug: 'http-status',
    name: 'HTTP Status Codes',
    description: 'Reference guide for all HTTP status codes with descriptions',
    category: 'api-network',
    icon: 'ServerCrash',
    keywords: ['http', 'status', '404', '200', '500', 'response', 'codes'],
  },

  // Generators
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUIDs (v1, v4) and random strings in bulk',
    category: 'generators',
    icon: 'Fingerprint',
    keywords: ['uuid', 'guid', 'random', 'unique', 'id', 'generate'],
    isPopular: true,
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for UI mockups and prototypes',
    category: 'generators',
    icon: 'AlignLeft',
    keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy'],
  },
  {
    slug: 'gitignore-generator',
    name: '.gitignore Generator',
    description: 'Generate .gitignore templates for popular languages and frameworks',
    category: 'generators',
    icon: 'GitBranch',
    keywords: ['gitignore', 'git', 'ignore', 'template'],
  },
  {
    slug: 'readme-generator',
    name: 'README Generator',
    description: 'Generate professional README.md templates for your projects',
    category: 'generators',
    icon: 'BookOpen',
    keywords: ['readme', 'markdown', 'template', 'documentation', 'github'],
  },

  // Design & UI
  {
    slug: 'frontend-playground',
    name: 'HTML/CSS/JS Playground',
    description: 'Simulate, write, and preview HTML, CSS, and JavaScript in real-time',
    category: 'design-ui',
    icon: 'MonitorPlay',
    keywords: ['html', 'css', 'javascript', 'js', 'playground', 'preview', 'editor', 'simulate'],
    isPopular: true,
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, and HSV color formats',
    category: 'design-ui',
    icon: 'Pipette',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'convert'],
    isPopular: true,
  },
  {
    slug: 'css-gradient',
    name: 'CSS Gradient Builder',
    description: 'Build and preview CSS linear and radial gradients visually',
    category: 'design-ui',
    icon: 'Blend',
    keywords: ['css', 'gradient', 'linear', 'radial', 'color', 'background'],
  },
  {
    slug: 'svg-optimizer',
    name: 'SVG Optimizer',
    description: 'Optimize SVG code by removing unnecessary markup and whitespace',
    category: 'design-ui',
    icon: 'ImageDown',
    keywords: ['svg', 'optimize', 'minify', 'vector', 'compress'],
  },

  // Data & Math
  {
    slug: 'csv-json',
    name: 'CSV ↔ JSON Converter',
    description: 'Convert between CSV and JSON formats bidirectionally',
    category: 'data-math',
    icon: 'Table',
    keywords: ['csv', 'json', 'convert', 'table', 'data'],
  },
  {
    slug: 'base-converter',
    name: 'Number Base Converter',
    description: 'Convert between binary, octal, decimal, and hexadecimal',
    category: 'data-math',
    icon: 'Calculator',
    keywords: ['binary', 'hex', 'decimal', 'octal', 'base', 'convert'],
  },
];

export const TOOLS_BY_CATEGORY = TOOL_CATEGORIES.map((cat) => ({
  ...cat,
  tools: TOOLS.filter((t) => t.category === cat.id),
}));

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return TOOLS;
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q))
  );
}
