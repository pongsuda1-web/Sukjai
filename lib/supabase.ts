import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://dummy.supabase.co';
}
if (!supabaseAnonKey) {
  supabaseAnonKey = 'dummy_key';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
