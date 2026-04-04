import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TOOLS, getToolBySlug } from '@/lib/tools-registry';
import { Base64Tool } from '@/components/tools/Base64Tool';
import { BaseConverterTool } from '@/components/tools/BaseConverterTool';
import { ColorConverterTool } from '@/components/tools/ColorConverterTool';
import { CronBuilderTool } from '@/components/tools/CronBuilderTool';
import { CssGradientTool } from '@/components/tools/CssGradientTool';
import { CsvJsonTool } from '@/components/tools/CsvJsonTool';
import { CurlBuilderTool } from '@/components/tools/CurlBuilderTool';
import { DateCalculatorTool } from '@/components/tools/DateCalculatorTool';
import { DateFormatterTool } from '@/components/tools/DateFormatterTool';
import { DiffCheckerTool } from '@/components/tools/DiffCheckerTool';
import { DstCheckerTool } from '@/components/tools/DstCheckerTool';
import { GitignoreGeneratorTool } from '@/components/tools/GitignoreGeneratorTool';
import { HashGeneratorTool } from '@/components/tools/HashGeneratorTool';
import { HttpStatusTool } from '@/components/tools/HttpStatusTool';
import { JsonFormatterTool } from '@/components/tools/JsonFormatterTool';
import { JwtDecoderTool } from '@/components/tools/JwtDecoderTool';
import { LoremIpsumTool } from '@/components/tools/LoremIpsumTool';
import { MarkdownPreviewTool } from '@/components/tools/MarkdownPreviewTool';
import { ReadmeGeneratorTool } from '@/components/tools/ReadmeGeneratorTool';
import { RegexTesterTool } from '@/components/tools/RegexTesterTool';
import { SqlFormatterTool } from '@/components/tools/SqlFormatterTool';
import { SvgOptimizerTool } from '@/components/tools/SvgOptimizerTool';
import { TimestampConverterTool } from '@/components/tools/TimestampConverterTool';
import { TimezoneConverterTool } from '@/components/tools/TimezoneConverterTool';
import { ToolShell } from '@/components/tools/ToolShell';
import { UuidGeneratorTool } from '@/components/tools/UuidGeneratorTool';
import { WeekNumberTool } from '@/components/tools/WeekNumberTool';
import { WorldClockTool } from '@/components/tools/WorldClockTool';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Static params for SSG
export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

// Per-page SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'base-converter': BaseConverterTool,
  'base64': Base64Tool,
  'color-converter': ColorConverterTool,
  'cron-builder': CronBuilderTool,
  'css-gradient': CssGradientTool,
  'csv-json': CsvJsonTool,
  'curl-builder': CurlBuilderTool,
  'date-calculator': DateCalculatorTool,
  'date-formatter': DateFormatterTool,
  'diff-checker': DiffCheckerTool,
  'dst-checker': DstCheckerTool,
  'gitignore-generator': GitignoreGeneratorTool,
  'hash-generator': HashGeneratorTool,
  'http-status': HttpStatusTool,
  'json-formatter': JsonFormatterTool,
  'jwt-decoder': JwtDecoderTool,
  'lorem-ipsum': LoremIpsumTool,
  'markdown-preview': MarkdownPreviewTool,
  'readme-generator': ReadmeGeneratorTool,
  'regex-tester': RegexTesterTool,
  'sql-formatter': SqlFormatterTool,
  'svg-optimizer': SvgOptimizerTool,
  'timestamp-converter': TimestampConverterTool,
  'timezone-converter': TimezoneConverterTool,
  'uuid-generator': UuidGeneratorTool,
  'week-number': WeekNumberTool,
  'world-clock': WorldClockTool,
};

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = TOOL_COMPONENTS[tool.slug];
  if (!ToolComponent) notFound();

  return (
    <ToolShell tool={tool}>
      <ToolComponent />
    </ToolShell>
  );
}