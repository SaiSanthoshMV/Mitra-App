// lib/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// avoid duplicated clients during HMR (dev)
declare global {
  var __supabase_client__: SupabaseClient | undefined;
}

const globalForSupabase = globalThis as unknown as {
  __supabase_client__?: SupabaseClient;
};

export const supabase = globalForSupabase.__supabase_client__ ??=
  createClient(url, anonKey);