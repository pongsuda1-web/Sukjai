const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'research.db');

// Basic Region Mapping Logic
const getRegion = (provinceName) => {
  const north = ['เชียงใหม่', 'เชียงราย', 'แม่ฮ่องสอน', 'ลำปาง', 'ลำพูน', 'พะเยา', 'แพร่', 'น่าน', 'อุตรดิตถ์', 'ตาก', 'สุโขทัย', 'พิษณุโลก', 'พิจิตร', 'กำแพงเพชร', 'เพชรบูรณ์', 'นครสวรรค์', 'อุทัยธานี'];
  const northeast = ['เลย', 'หนองคาย', 'บึงกาฬ', 'หนองบัวลำภู', 'อุดรธานี', 'สกลนคร', 'นครพนม', 'มุกดาหาร', 'ขอนแก่น', 'กาฬสินธุ์', 'มหาสารคาม', 'ร้อยเอ็ด', 'ยโสธร', 'อำนาจเจริญ', 'อุบลราชธานี', 'ศรีสะเกษ', 'สุรินทร์', 'บุรีรัมย์', 'นครราชสีมา', 'ชัยภูมิ'];
  const south = ['ชุมพร', 'ระนอง', 'สุราษฎร์ธานี', 'พังงา', 'ภูเก็ต', 'กระบี่', 'นครศรีธรรมราช', 'ตรัง', 'พัทลุง', 'สตูล', 'สงขลา', 'ปัตตานี', 'ยะลา', 'นราธิวาส'];
  // The rest defaults to central/east/west
  
  if (north.includes(provinceName)) return 'north';
  if (northeast.includes(provinceName)) return 'northeast';
  if (south.includes(provinceName)) return 'south';
  return 'central';
};

async function seed() {
  const db = new Database(dbPath);

  // Create table
  db.exec(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      province TEXT NOT NULL,
      region TEXT NOT NULL,
      type TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      lat REAL,
      lng REAL
    )
  `);

  console.log('Fetching Thai province data...');
  try {
    const resProv = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api/latest/province.json');
    const provinces = await resProv.json();

    const resDist = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api/latest/district.json');
    const districts = await resDist.json();

    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO hospitals (id, name, province, region, type, address, phone, lat, lng)
      VALUES (@id, @name, @province, @region, @type, @address, @phone, @lat, @lng)
    `);

    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertStmt.run(item);
      }
    });

    let count = 0;
    const itemsToInsert = [];

    provinces.forEach(prov => {
      const pName = prov.name_th.replace(/^จังหวัด/, '');
      const region = getRegion(pName);

      // Insert Provincial Hospital
      const provId = 'prov-' + prov.id;
      itemsToInsert.push({
        id: provId,
        name: 'โรงพยาบาล' + pName,
        province: pName,
        region: region,
        type: 'provincial',
        address: `อ.เมือง จ.${pName}`,
        phone: '1669', // Mock emergency
        lat: 0, lng: 0
      });
      count++;

      // Find districts for this province
      const provDistricts = districts.filter(d => d.province_id === prov.id);

      // Insert Community Hospitals
      provDistricts.forEach(dist => {
        const dName = dist.name_th;
        if (!dName.includes('เมือง')) {
          const distId = 'comm-' + dist.id;
          itemsToInsert.push({
            id: distId,
            name: 'โรงพยาบาล' + dName,
            province: pName,
            region: region,
            type: 'community',
            address: `อ.${dName} จ.${pName}`,
            phone: '1669',
            lat: 0, lng: 0
          });
          count++;
        }
      });
    });

    insertMany(itemsToInsert);
    console.log(`Successfully seeded ${count} hospitals across ${provinces.length} provinces!`);

  } catch (error) {
    console.error('Failed to seed:', error);
  } finally {
    db.close();
  }
}

seed();
