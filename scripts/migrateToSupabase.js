require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Database = require('better-sqlite3');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const dbPath = path.join(__dirname, '..', 'research.db');
const db = new Database(dbPath);

async function migrateData() {
  console.log("Starting data migration from SQLite to Supabase...");

  try {
    // 1. Migrate Admins
    console.log("Migrating admins...");
    const admins = db.prepare("SELECT username, password, role FROM admins").all();
    if (admins.length > 0) {
      const { error } = await supabase.from('admins').insert(admins);
      if (error) console.error("Error migrating admins:", error.message);
      else console.log(`Successfully migrated ${admins.length} admins.`);
    }

    // 2. Migrate Hospitals
    console.log("Migrating hospitals...");
    const hospitals = db.prepare("SELECT name, lat, lng, address, phone, region, province, type FROM hospitals").all();
    
    if (hospitals.length > 0) {
      // Supabase has a limit on how many rows can be inserted at once (typically 1000 or payload size).
      // Since we have ~940 hospitals, we should be fine, but let's chunk it just in case.
      const chunkSize = 500;
      let migratedCount = 0;
      
      for (let i = 0; i < hospitals.length; i += chunkSize) {
        const chunk = hospitals.slice(i, i + chunkSize);
        const { error } = await supabase.from('hospitals').insert(chunk);
        
        if (error) {
          console.error(`Error migrating hospitals chunk ${i}-${i + chunkSize}:`, error.message);
        } else {
          migratedCount += chunk.length;
        }
      }
      console.log(`Successfully migrated ${migratedCount} hospitals.`);
    }

    console.log("Migration completed!");
  } catch (err) {
    console.error("Unexpected error during migration:", err);
  } finally {
    db.close();
  }
}

migrateData();
