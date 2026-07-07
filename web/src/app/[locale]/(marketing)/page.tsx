import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarketingPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border px-3 py-1 text-sm text-muted-foreground">Investor-ready growth intelligence</div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">One modern workspace for SEO, growth, and analytics.</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">Optumus Analytics helps ambitious founders, agencies, and growth teams monitor traffic, SEO health, indexing readiness, and subscriptions from one polished command center.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sign-up">
              <Button size="lg">Start free</Button>
            </Link>
            <Link href="/dashboard/settings?tab=growth">
              <Button variant="outline" size="lg">View integrations</Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>GA4 + Search Console</CardTitle><CardDescription>Unify acquisition and SEO context.</CardDescription></CardHeader>
            <CardContent>Pull traffic, conversions, impressions, clicks, and CTR into a single growth view.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>On-page SEO checks</CardTitle><CardDescription>Surface title, meta, heading, alt, and link issues.</CardDescription></CardHeader>
            <CardContent>Run fast audits on URLs and pages without leaving the product.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Paystack + Stripe</CardTitle><CardDescription>Support global subscriptions and African payments.</CardDescription></CardHeader>
            <CardContent>Offer flexible billing plus KES/M-Pesa-ready checkout flows for regional teams.</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
