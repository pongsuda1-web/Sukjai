const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'research.db');
const db = new Database(dbPath);
const outputPath = path.join(__dirname, '..', 'seed_supabase.sql');

try {
  let sqlContent = '-- Supabase Data Migration Seed\n\n';

  // 1. Admins
  const admins = db.prepare("SELECT username, password, role FROM admins").all();
  if (admins.length > 0) {
    sqlContent += '-- Migrate Admins\n';
    admins.forEach(admin => {
      const u = admin.username.replace(/'/g, "''");
      const p = admin.password.replace(/'/g, "''");
      const r = admin.role.replace(/'/g, "''");
      sqlContent += `INSERT INTO admins (username, password, role) VALUES ('${u}', '${p}', '${r}');\n`;
    });
    sqlContent += '\n';
  }

  // 2. Hospitals
  const hospitals = db.prepare("SELECT name, lat, lng, address, phone, region, province, type FROM hospitals").all();
  if (hospitals.length > 0) {
    sqlContent += '-- Migrate Hospitals\n';
    hospitals.forEach(h => {
      const n = (h.name || '').replace(/'/g, "''");
      const a = (h.address || '').replace(/'/g, "''");
      const p = (h.phone || '').replace(/'/g, "''");
      const r = (h.region || '').replace(/'/g, "''");
      const pv = (h.province || '').replace(/'/g, "''");
      const t = (h.type || '').replace(/'/g, "''");
      sqlContent += `INSERT INTO hospitals (name, lat, lng, address, phone, region, province, type) VALUES ('${n}', ${h.lat}, ${h.lng}, '${a}', '${p}', '${r}', '${pv}', '${t}');\n`;
    });
  }

  fs.writeFileSync(outputPath, sqlContent, 'utf-8');
  console.log(`Successfully generated SQL seed file at ${outputPath}`);
} catch (error) {
  console.error("Error generating SQL:", error);
} finally {
  db.close();
}
