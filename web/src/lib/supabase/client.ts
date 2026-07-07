import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  };
}

export function createClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient<Database>(url, anonKey);
}
