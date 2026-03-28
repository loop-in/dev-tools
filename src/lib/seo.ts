import { Metadata } from 'next';

const SITE_NAME = 'DevTools';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devtools.app';
const SITE_DESCRIPTION =
  'A comprehensive suite of free developer tools — JSON formatter, regex tester, JWT decoder, UUID generator, and 20+ more utilities.';

interface PageMetaOptions {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = '',
  keywords = [],
}: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = path ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — ${title}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      'developer tools',
      'online tools',
      'dev utilities',
      'free tools',
      ...keywords,
    ].join(', '),
    authors: [{ name: SITE_NAME }],
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export { SITE_NAME, SITE_URL, SITE_DESCRIPTION };
