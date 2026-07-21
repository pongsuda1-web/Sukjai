import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aieqxcocarhxegzawovn.supabase.co';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YkUPyYLNSekpVr1IB9PtCQ_iLdGqG1T';

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://dummy.supabase.co';
}
if (!supabaseAnonKey) {
  supabaseAnonKey = 'dummy_key';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
