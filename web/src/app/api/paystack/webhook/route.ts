import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { decryptSecret } from '@/lib/agent/key-encryption';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature') || '';
    if (!signature) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    let payload: { event?: string; data?: { reference?: string } } = {};
    try {
      payload = JSON.parse(body || '{}');
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    if (!payload?.event) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    const { data: organizations } = await supabaseAdmin
      .from('organizations')
      .select('id, paystack_webhook_secret_encrypted')
      .not('paystack_webhook_secret_encrypted', 'is', null);

    const matchingOrg = organizations?.find((org) => {
      const secret = decryptSecret(org.paystack_webhook_secret_encrypted);
      if (!secret || !signature) return false;
      const expectedSignature = createHmac('sha512', secret).update(body).digest('hex');
      const expectedBuffer = Buffer.from(expectedSignature);
      const providedBuffer = Buffer.from(signature);
      if (expectedBuffer.length !== providedBuffer.length) return false;
      return timingSafeEqual(expectedBuffer, providedBuffer);
    });

    if (!matchingOrg) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (payload.event === 'charge.success' || payload.event === 'subscription.create') {
      await supabaseAdmin
        .from('organizations')
        .update({ subscription_status: 'active' })
        .eq('id', matchingOrg.id);
    }

    return NextResponse.json({ ok: true, event: payload.event, reference: payload.data?.reference ?? null });
  } catch (error) {
    console.error('[paystack/webhook]', error);
    return NextResponse.json({ ok: false, error: 'Webhook failed' }, { status: 500 });
  }
}
