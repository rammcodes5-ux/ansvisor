import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { decryptSecret } from '@/lib/agent/key-encryption';

const DEFAULT_AMOUNT_BY_PLAN: Record<string, number> = {
  starter: 10000,
  growth: 25000,
  scale: 50000,
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { planId, organizationId, email, amount } = body as {
      planId?: string;
      organizationId?: string;
      email?: string;
      amount?: number | string;
    };

    if (!planId || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('paystack_public_key_encrypted, paystack_secret_key_encrypted')
      .eq('id', organizationId)
      .single();

    if (!org?.paystack_secret_key_encrypted) {
      return NextResponse.json({ error: 'Paystack is not configured for this organization' }, { status: 400 });
    }

    const secret = decryptSecret(org.paystack_secret_key_encrypted);
    const publicKey = decryptSecret(org.paystack_public_key_encrypted);
    if (!secret || !publicKey) {
      return NextResponse.json({ error: 'Paystack credentials are not usable' }, { status: 400 });
    }

    const amountInKobo = Number(amount ?? DEFAULT_AMOUNT_BY_PLAN[planId] ?? 10000);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const reference = `optumus_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || user.email || 'team@optumusanalytics.com',
        amount: Number.isFinite(amountInKobo) ? Math.round(amountInKobo) : 10000,
        currency: 'NGN',
        reference,
        callback_url: `${baseUrl}/dashboard/settings?tab=billing`,
        metadata: {
          planId,
          organizationId,
          userId: user.id,
        },
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.data?.authorization_url) {
      return NextResponse.json(
        { error: payload?.message || 'Paystack initialization failed' },
        { status: response.status || 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      publicKey,
      provider: 'paystack',
      authorizationUrl: payload.data.authorization_url,
      accessCode: payload.data.access_code,
      reference: payload.data.reference,
      checkoutUrl: `${baseUrl}/dashboard/settings?tab=billing`,
    });
  } catch (error) {
    console.error('[paystack/checkout]', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
