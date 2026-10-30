import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

let supabaseAdmin: SupabaseClient | null = null;

if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('✅ Supabase Admin client initialized successfully');
} else {
  console.warn(
    '⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined. Server will operate with demo/unconfigured auth state.'
  );
}

export { supabaseAdmin };
