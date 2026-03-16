import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('Running migration: add_multilingual_projects.sql');
    
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', 'add_multilingual_projects.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Note: Supabase JS client doesn't support running raw SQL directly
    // You need to run this migration manually in Supabase SQL Editor
    console.log('\n=== MIGRATION SQL ===\n');
    console.log(migrationSQL);
    console.log('\n=== END MIGRATION SQL ===\n');
    console.log('\nPlease copy the SQL above and run it in your Supabase SQL Editor:');
    console.log(`${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/editor/sql`);
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigration();
