# DevUtils — Developer Utilities Web App

A comprehensive, production-ready Next.js web application featuring 27 developer tools with dark mode, SEO, and mobile support.

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

### Code & Text
- **JSON Formatter** — Format, validate, and minify JSON
- **Regex Tester** — Live regex matching with match highlighting
- **Base64 Encoder/Decoder** — Standard and URL-safe Base64
- **Hash Generator** — MD5, SHA-1, SHA-256, SHA-512
- **Diff Checker** — Side-by-side text comparison
- **Markdown Preview** — Live Markdown rendering

### API & Network
- **JWT Decoder** — Decode and inspect JSON Web Tokens
- **cURL Builder** — Visual cURL command generator
- **HTTP Status Codes** — Searchable reference guide

### Data & Conversion
- **CSV ↔ JSON Converter** — Bidirectional data format conversion
- **Color Converter** — HEX, RGB, HSL conversion
- **Unix Timestamp Converter** — Human-readable date utilities
- **Cron Expression Builder** — Visual cron scheduler
- **Number Base Converter** — Binary, Octal, Decimal, Hex

### Code Generation
- **UUID Generator** — v1 and v4 UUIDs in bulk
- **Lorem Ipsum Generator** — Placeholder text
- **SQL Formatter** — Beautify SQL queries
- **.gitignore Generator** — Templates for popular stacks
- **README Generator** — Project documentation templates

### Design & Frontend
- **CSS Gradient Builder** — Visual gradient creator
- **SVG Optimizer** — Remove unnecessary SVG markup

### Date & Time
- **Date Calculator** — Calculate future/past dates
- **Date Formatter** — Format dates in various formats
- **DST Checker** — Check for Daylight Saving Time
- **Timezone Converter** — Convert between timezones
- **Week Number** - Get week number of a date
- **World Clock** - See the current time across cities

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

