import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Running migration: add_multilingual_content_blocks.sql');
  
  const migrationSQL = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/add_multilingual_content_blocks.sql'),
    'utf-8'
  );

  const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

  if (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  console.log('Migration completed successfully!');
  console.log('Added columns: content_en, links_en, client_quote_en, client_review_title_en');
}

runMigration();
