import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { PostHogProvider } from '@/components/providers/posthog-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://app.optumusanalytics.com'),
  title: {
    default: 'Optumus Analytics',
    template: '%s | Optumus Analytics',
  },
  description:
    'Monitor SEO growth, traffic, and conversion performance from one investor-ready analytics suite.',
  openGraph: {
    title: 'Optumus Analytics',
    description:
      'Bring SEO, website growth, and acquisition intelligence together in a polished analytics workspace.',
    url: '/',
    siteName: 'Optumus Analytics',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Optumus Analytics',
    description:
      'Bring SEO, website growth, and acquisition intelligence together in a polished analytics workspace.',
  },
  // The product app at app.optumusanalytics.com should not appear in search results;
  // optumusanalytics.com is the indexable surface.
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jakarta.variable}`}
    >
      <body suppressHydrationWarning className="font-sans antialiased">
        <PostHogProvider />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
