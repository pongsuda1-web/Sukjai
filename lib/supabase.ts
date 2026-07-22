import { createClient } from '@supabase/supabase-js';

let supabaseUrl = 'https://aieqxcocarhxegzawovn.supabase.co';
let supabaseAnonKey = 'sb_publishable_YkUPyYLNSekpVr1IB9PtCQ_iLdGqG1T';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
