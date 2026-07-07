'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { toast } from 'sonner';
import type { SeoAuditResult } from '@/lib/seo/audit';

export default function GrowthPage() {
  const [url, setUrl] = useState('https://example.com/seo-page');
  const [html, setHtml] = useState(`<html><head><title>Example page</title><meta name="description" content="This is a sample page for the Optumus SEO audit workflow." /></head><body><h1>Example page</h1><h2>Why it matters</h2><p>Use this workspace to inspect core on-page SEO signals.</p><img src="/hero.png" /><a href="/about">About us</a></body></html>`);
  const [result, setResult] = useState<SeoAuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/growth/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, html }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'SEO analysis failed');
      setResult(payload.audit);
      toast.success('SEO audit completed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'SEO analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Growth Studio</h1>
          <p className="text-sm text-muted-foreground">Track SEO health, indexing readiness, traffic, and acquisition from one dashboard.</p>
        </div>
        <Link href="/dashboard/settings?tab=growth">
          <Button>Connect integrations</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>GA4 Overview</CardTitle>
            <CardDescription>Traffic and conversion snapshots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">+18.4%</div>
            <p className="text-sm text-muted-foreground">Weekly growth trend</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Search Console</CardTitle>
            <CardDescription>Impressions and CTR signals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">84.2k</div>
            <p className="text-sm text-muted-foreground">Estimated clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>SEO health</CardTitle>
            <CardDescription>On-page checks and issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">92</div>
            <p className="text-sm text-muted-foreground">Audit score</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO audit workflow</CardTitle>
          <CardDescription>Submit a page URL and HTML snippet for instant on-page checks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audit-url">Page URL</Label>
            <Input id="audit-url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/page" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audit-html">HTML snippet</Label>
            <Textarea id="audit-html" value={html} onChange={(event) => setHtml(event.target.value)} rows={12} className="font-mono text-sm" />
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>{isAnalyzing ? 'Analyzing…' : 'Run SEO audit'}</Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Audit results</CardTitle>
            <CardDescription>Instant feedback from the on-page checker.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-semibold">{result.score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="text-2xl font-semibold">{result.titleLength}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meta</p>
                <p className="text-2xl font-semibold">{result.metaDescriptionLength}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Headings</p>
                <p className="text-2xl font-semibold">{result.headingCount}</p>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Issues</p>
              {result.issues.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {result.issues.map((issue) => (
                    <li key={`${issue.type}-${issue.message}`}>{issue.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No issues detected.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
