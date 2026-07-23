const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://aieqxcocarhxegzawovn.supabase.co';
const supabaseAnonKey = 'sb_publishable_YkUPyYLNSekpVr1IB9PtCQ_iLdGqG1T';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
async function test() {
  const { data, error } = await supabase.from('admins').select('*');
  console.log('SELECT result:', data, error);
}
test();
