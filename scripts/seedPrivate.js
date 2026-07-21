const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'research.db');

const mockHospitals = [
  {
    id: 'hp-p1',
    name: 'โรงพยาบาลมนารมย์ (เอกชนเฉพาะทางจิตเวช)',
    lat: 13.6657,
    lng: 100.6015,
    address: '9 ถ.สุขุมวิท 70/3 แขวงบางนาใต้ เขตบางนา กทม. (ภาคกลาง)',
    phone: '02-725-9595',
    region: 'central',
    province: 'กรุงเทพมหานคร',
    type: 'private'
  },
  {
    id: 'hp-p2',
    name: 'Meritz Clinic (คลินิกจิตเวชเอกชน)',
    lat: 13.7367,
    lng: 100.5586,
    address: 'อาคารเทรนดี้ ชั้น 1A ซอยสุขุมวิท 13 แขวงคลองเตยเหนือ กทม. (ภาคกลาง)',
    phone: '090-975-5026',
    region: 'central',
    province: 'กรุงเทพมหานคร',
    type: 'private'
  },
  {
    id: 'hp-p3',
    name: 'คลินิกจิตแพทย์นายแพทย์อภิชาติ',
    lat: 18.7883,
    lng: 98.9853,
    address: 'ถ.ช้างม่อย อ.เมือง จ.เชียงใหม่ (ภาคเหนือ)',
    phone: '053-234-567',
    region: 'north',
    province: 'เชียงใหม่',
    type: 'private'
  },
  {
    id: 'hp-p-aeum',
    name: 'หมอเอื้อม คลินิกเวชกรรมเฉพาะทางจิตเวช',
    lat: 18.7826,
    lng: 100.7712,
    address: 'อ.เมือง จ.น่าน (ภาคเหนือ)',
    phone: '097-015-1466',
    region: 'north',
    province: 'น่าน',
    type: 'private'
  },
  {
    id: 'hp-p-veerawarangrat',
    name: 'วีระ-วรางค์รัตน์คลินิก',
    lat: 18.7850,
    lng: 100.7750,
    address: 'อ.เมือง จ.น่าน (ภาคเหนือ)',
    phone: '085-040-5055',
    region: 'north',
    province: 'น่าน',
    type: 'private'
  },
  {
    id: 'hp-p4',
    name: 'Hugjai Clinic (ฮักใจ คลินิกจิตเวช)',
    lat: 16.4322,
    lng: 102.8236,
    address: 'ถ.มิตรภาพ อ.เมือง จ.ขอนแก่น (ภาคตะวันออกเฉียงเหนือ)',
    phone: '043-111-222',
    region: 'northeast',
    province: 'ขอนแก่น',
    type: 'private'
  },
  {
    id: 'hp-p5',
    name: 'คลินิกจิตเวชโคราช (นายแพทย์สมศักดิ์)',
    lat: 14.9799,
    lng: 102.0977,
    address: 'ถ.จอมสุรางค์ยาตร อ.เมือง จ.นครราชสีมา (ภาคตะวันออกเฉียงเหนือ)',
    phone: '044-256-789',
    region: 'northeast',
    province: 'นครราชสีมา',
    type: 'private'
  },
  {
    id: 'hp-p6',
    name: 'Peace of Mind Clinic',
    lat: 7.0096,
    lng: 100.4682,
    address: 'อ.หาดใหญ่ จ.สงขลา (ภาคใต้)',
    phone: '074-888-999',
    region: 'south',
    province: 'สงขลา',
    type: 'private'
  },
  {
    id: 'hp-p7',
    name: 'คลินิกจิตเวชแพทย์หญิงลลิตา',
    lat: 7.8906,
    lng: 98.3981,
    address: 'ถ.วิชิตสงคราม อ.เมือง จ.ภูเก็ต (ภาคใต้)',
    phone: '076-222-333',
    region: 'south',
    province: 'ภูเก็ต',
    type: 'private'
  },
  {
    id: 'hp-w1',
    name: 'Knowing Mind Center',
    lat: 13.7820,
    lng: 100.5435,
    address: 'อารีย์ซอย 1 แขวงพญาไท เขตพญาไท กทม.',
    phone: '083-063-2289',
    region: 'central',
    province: 'กรุงเทพมหานคร',
    type: 'wellness'
  },
  {
    id: 'hp-w2',
    name: 'The Oasis Clinic',
    lat: 13.8055,
    lng: 100.5732,
    address: 'เขตลาดพร้าว กทม.',
    phone: '095-515-6294',
    region: 'central',
    province: 'กรุงเทพมหานคร',
    type: 'wellness'
  },
  {
    id: 'hp-w3',
    name: 'ศูนย์สุขภาวะทางจิต',
    lat: 13.7384,
    lng: 100.5321,
    address: 'คณะจิตวิทยา จุฬาลงกรณ์มหาวิทยาลัย กทม.',
    phone: '02-218-1171',
    region: 'central',
    province: 'กรุงเทพมหานคร',
    type: 'wellness'
  },
  {
    id: 'hp-w4',
    name: 'Good Mind Clinic',
    lat: 18.7953,
    lng: 98.9667,
    address: 'ถ.ศิริมังคลาจารย์ ต.สุเทพ อ.เมือง จ.เชียงใหม่',
    phone: '053-123-789',
    region: 'north',
    province: 'เชียงใหม่',
    type: 'wellness'
  },
  {
    id: 'hp-w5',
    name: 'คลินิกเวชกรรมรักษ์อุ่นใจ',
    lat: 16.4225,
    lng: 102.8156,
    address: 'ถ.ศรีจันทร์ อ.เมือง จ.ขอนแก่น',
    phone: '043-334-445',
    region: 'northeast',
    province: 'ขอนแก่น',
    type: 'wellness'
  },
  {
    id: 'hp-w6',
    name: 'Be Happy Wellness Center',
    lat: 7.0099,
    lng: 100.4688,
    address: 'ย่าน ม.อ. อ.หาดใหญ่ จ.สงขลา',
    phone: '074-112-233',
    region: 'south',
    province: 'สงขลา',
    type: 'wellness'
  }
];

const db = new Database(dbPath);

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO hospitals (id, name, province, region, type, address, phone, lat, lng)
  VALUES (@id, @name, @province, @region, @type, @address, @phone, @lat, @lng)
`);

const insertMany = db.transaction((items) => {
  for (const item of items) {
    insertStmt.run(item);
  }
});

insertMany(mockHospitals);
console.log(`Successfully seeded ${mockHospitals.length} private clinics!`);
db.close();
