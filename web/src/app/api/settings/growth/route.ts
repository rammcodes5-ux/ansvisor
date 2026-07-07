import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { encryptSecret, decryptSecret } from '@/lib/agent/key-encryption';

async function getCallerAndOrg() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' as const };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, organization_id')
    .eq('id', user.id)
    .single();

  if (!profile?.organization_id) return { error: 'No organization' as const };

  return {
    user,
    profile: profile as { id: string; role: string; organization_id: string },
  };
}

export async function GET() {
  const ctx = await getCallerAndOrg();
  if ('error' in ctx) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.error === 'Unauthorized' ? 401 : 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('organizations')
    .select('paystack_public_key_encrypted, paystack_secret_key_encrypted, paystack_webhook_secret_encrypted, ga4_measurement_id, ga4_client_id, gsc_client_id')
    .eq('id', ctx.profile.organization_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    paystackPublicKey: '',
    paystackSecretKey: '',
    paystackWebhookSecret: '',
    ga4MeasurementId: data?.ga4_measurement_id ?? '',
    ga4ClientId: data?.ga4_client_id ?? '',
    gscClientId: data?.gsc_client_id ?? '',
  });
}

export async function POST(req: Request) {
  const ctx = await getCallerAndOrg();
  if ('error' in ctx) {
    return NextResponse.json({ error: ctx.error }, { status: ctx.error === 'Unauthorized' ? 401 : 400 });
  }
  if (ctx.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can manage growth integrations' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const paystackPublicKey = String(body.paystackPublicKey ?? '').trim();
  const paystackSecretKey = String(body.paystackSecretKey ?? '').trim();
  const paystackWebhookSecret = String(body.paystackWebhookSecret ?? '').trim();
  const ga4MeasurementId = String(body.ga4MeasurementId ?? '').trim();
  const ga4ClientId = String(body.ga4ClientId ?? '').trim();
  const gscClientId = String(body.gscClientId ?? '').trim();

  const encryptedPaystackPublicKey = paystackPublicKey ? encryptSecret(paystackPublicKey) : null;
  const encryptedPaystackSecretKey = paystackSecretKey ? encryptSecret(paystackSecretKey) : null;
  const encryptedPaystackWebhookSecret = paystackWebhookSecret ? encryptSecret(paystackWebhookSecret) : null;

  const { error } = await supabaseAdmin
    .from('organizations')
    .update({
      paystack_public_key_encrypted: encryptedPaystackPublicKey,
      paystack_secret_key_encrypted: encryptedPaystackSecretKey,
      paystack_webhook_secret_encrypted: encryptedPaystackWebhookSecret,
      ga4_measurement_id: ga4MeasurementId || null,
      ga4_client_id: ga4ClientId || null,
      gsc_client_id: gscClientId || null,
    })
    .eq('id', ctx.profile.organization_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
