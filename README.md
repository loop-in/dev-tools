# DevUtils — Developer Utilities Web App

A comprehensive, production-ready Next.js web application featuring 28 developer tools with dark mode, SEO, and mobile support.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tools Included

### Format & Validate
- **JSON Formatter** — Format, validate, and minify JSON with syntax highlighting
- **SQL Formatter** — Beautify and format SQL queries for readability
- **Diff Checker** — Compare two blocks of text and highlight differences
- **Regex Tester** — Test regular expressions with live match highlighting
- **Markdown Preview** — Write Markdown and preview the rendered output live

### Date, Time & Scheduling
- **Timezone Converter** — Convert a time across multiple timezones simultaneously
- **Unix Timestamp Converter** — Convert between Unix timestamps and human-readable dates
- **Cron Expression Builder** — Build and explain cron expressions visually
- **World Clock** — See the current time across major cities and timezones at a glance
- **Date Calculator** — Add or subtract days from a date and find the difference between two dates
- **DST Checker** — Check if a timezone observes Daylight Saving Time and when it changes
- **Date Formatter** — Format dates in ISO 8601, RFC 2822, and other standards used in APIs
- **Week Number** — Find the ISO week number for any date and browse weeks in a year

### Security & Encoders
- **Base64 Encoder / Decoder** — Encode and decode Base64 and URL-safe Base64 strings
- **Hash Generator** — Generate MD5, SHA-1, SHA-256, SHA-512 hashes
- **JWT Decoder** — Decode and inspect JSON Web Token header, payload, and signature

### Web & Network
- **cURL Command Builder** — Build cURL commands visually with headers, body, and auth
- **HTTP Status Codes** — Reference guide for all HTTP status codes with descriptions

### Generators
- **UUID Generator** — Generate UUIDs (v1, v4) and random strings in bulk
- **Lorem Ipsum Generator** — Generate placeholder text for UI mockups and prototypes
- **.gitignore Generator** — Generate .gitignore templates for popular languages and frameworks
- **README Generator** — Generate professional README.md templates for your projects

### Design & UI
- **HTML/CSS/JS Playground** — Simulate, write, and preview HTML, CSS, and JavaScript in real-time
- **Color Converter** — Convert between HEX, RGB, HSL, and HSV color formats
- **CSS Gradient Builder** — Build and preview CSS linear and radial gradients visually
- **SVG Optimizer** — Optimize SVG code by removing unnecessary markup and whitespace

### Data & Math
- **CSV ↔ JSON Converter** — Convert between CSV and JSON formats bidirectionally
- **Number Base Converter** — Convert between binary, octal, decimal, and hexadecimal

## 🏗 Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── tools/[slug]/       # Dynamic tool pages
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── not-found.tsx       # 404 page
│   ├── page.tsx            # Homepage
│   ├── robots.ts           # robots.txt
│   ├── sitemap.ts          # Auto-generated sitemap
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── tools/              # Individual tool components
│   └── ui/                 # Button, Input, Card, Badge, CopyButton
├── hooks/
│   ├── useCopy.ts          # Clipboard hook
│   └── useLocalStorage.ts  # Persistent state hook
├── lib/
│   ├── seo.ts              # SEO metadata helpers
│   ├── shell.ts            # Shell utilities
│   ├── timezones.ts        # Timezone data
│   ├── tools-registry.ts   # Central tool metadata registry
│   └── utils.ts            # Helper utilities
├── styles/                 # Global styles
├── tests/                  # Unit tests
└── types/
    └── tool.ts             # TypeScript types
```

## ✨ Features

- **Dark Mode** — System-aware via `next-themes`, zero flash
- **SEO** — Per-page metadata, Open Graph, sitemap, robots.txt
- **Static Generation** — All tool pages pre-rendered at build time
- **Cmd+K Search** — Instant tool search from the navbar
- **Copy to Clipboard** — One-click copy on all outputs
- **Download** — Export outputs as files where applicable
- **Mobile Responsive** — Fully functional on all screen sizes
- **Security Headers** — CSP, X-Frame-Options, XSS protection
- **Client-Side Only** — No data sent to any server

## 🛠 Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, SSG
- [TypeScript](https://www.typescriptlang.org/) — Strict mode
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [next-themes](https://github.com/pacocoursey/next-themes) — Dark mode
- [lucide-react](https://lucide.dev/) — Icons
- [marked](https://marked.js.org/) — Markdown parsing

