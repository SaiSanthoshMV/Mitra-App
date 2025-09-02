// lib/supabaseServer.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export function createServerSupabase(): SupabaseClient {
  // create a fresh client (server-side); acceptable per-request
  return createClient(url!, key!);
}