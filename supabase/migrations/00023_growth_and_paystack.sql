ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS paystack_public_key_encrypted text,
  ADD COLUMN IF NOT EXISTS paystack_secret_key_encrypted text,
  ADD COLUMN IF NOT EXISTS paystack_webhook_secret_encrypted text,
  ADD COLUMN IF NOT EXISTS ga4_measurement_id text,
  ADD COLUMN IF NOT EXISTS ga4_client_id text,
  ADD COLUMN IF NOT EXISTS gsc_client_id text;
