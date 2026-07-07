'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface GrowthSettings {
  paystackPublicKey: string;
  paystackSecretKey: string;
  paystackWebhookSecret: string;
  ga4MeasurementId: string;
  ga4ClientId: string;
  gscClientId: string;
}

export function GrowthSection() {
  const [settings, setSettings] = useState<GrowthSettings>({
    paystackPublicKey: '',
    paystackSecretKey: '',
    paystackWebhookSecret: '',
    ga4MeasurementId: '',
    ga4ClientId: '',
    gscClientId: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/settings/growth');
        if (!res.ok) throw new Error('Failed to load settings');
        const json = await res.json();
        setSettings((prev) => ({ ...prev, ...json }));
      } catch {
        toast.error('Unable to load growth settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Unable to save settings');
      toast.success('Growth settings saved');
    } catch {
      toast.error('Unable to save growth settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Growth & SEO connectors</CardTitle>
          <CardDescription>Configure Paystack, Google Analytics 4, and Search Console access for your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="paystack-public-key">Paystack public key</Label>
              <Input id="paystack-public-key" value={settings.paystackPublicKey} onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })} placeholder="pk_test_..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paystack-secret-key">Paystack secret key</Label>
              <Input id="paystack-secret-key" value={settings.paystackSecretKey} onChange={(e) => setSettings({ ...settings, paystackSecretKey: e.target.value })} placeholder="sk_test_..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paystack-webhook-secret">Paystack webhook secret</Label>
            <Input id="paystack-webhook-secret" value={settings.paystackWebhookSecret} onChange={(e) => setSettings({ ...settings, paystackWebhookSecret: e.target.value })} placeholder="whsec_..." />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ga4-measurement-id">GA4 measurement ID</Label>
              <Input id="ga4-measurement-id" value={settings.ga4MeasurementId} onChange={(e) => setSettings({ ...settings, ga4MeasurementId: e.target.value })} placeholder="G-XXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ga4-client-id">GA4 client ID</Label>
              <Input id="ga4-client-id" value={settings.ga4ClientId} onChange={(e) => setSettings({ ...settings, ga4ClientId: e.target.value })} placeholder="client-id" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gsc-client-id">Search Console client ID</Label>
            <Input id="gsc-client-id" value={settings.gscClientId} onChange={(e) => setSettings({ ...settings, gscClientId: e.target.value })} placeholder="client-id" />
          </div>
          <Textarea readOnly value="Secrets are encrypted at rest and are never displayed after save." />
          <Button onClick={handleSave} disabled={saving || loading}>{saving ? 'Saving…' : 'Save growth settings'}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
