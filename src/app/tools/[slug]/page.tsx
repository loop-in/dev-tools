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
import { DiffCheckerTool } from '@/components/tools/DiffCheckerTool';
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
import { ToolShell } from '@/components/tools/ToolShell';
import { UuidGeneratorTool } from '@/components/tools/UuidGeneratorTool';

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
  'json-formatter': JsonFormatterTool,
  'regex-tester': RegexTesterTool,
  'base64': Base64Tool,
  'hash-generator': HashGeneratorTool,
  'diff-checker': DiffCheckerTool,
  'markdown-preview': MarkdownPreviewTool,
  'jwt-decoder': JwtDecoderTool,
  'curl-builder': CurlBuilderTool,
  'http-status': HttpStatusTool,
  'csv-json': CsvJsonTool,
  'color-converter': ColorConverterTool,
  'timestamp-converter': TimestampConverterTool,
  'cron-builder': CronBuilderTool,
  'base-converter': BaseConverterTool,
  'uuid-generator': UuidGeneratorTool,
  'lorem-ipsum': LoremIpsumTool,
  'sql-formatter': SqlFormatterTool,
  'gitignore-generator': GitignoreGeneratorTool,
  'readme-generator': ReadmeGeneratorTool,
  'css-gradient': CssGradientTool,
  'svg-optimizer': SvgOptimizerTool,
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
