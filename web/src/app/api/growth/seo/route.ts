import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeSeoHtml } from '@/lib/seo/audit';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { url, html } = body as { url?: string; html?: string };
    if (!url || !html) {
      return NextResponse.json({ error: 'url and html are required' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, audit: analyzeSeoHtml(html, url) });
  } catch (error) {
    console.error('[growth/seo]', error);
    return NextResponse.json({ error: 'SEO analysis failed' }, { status: 500 });
  }
}
