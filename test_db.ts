import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function main() {
  const { data, error } = await supabase.from('projects').select('*').limit(5);
  console.log("Projects:", JSON.stringify(data, null, 2));
  console.log("Error:", error);
}

main();
