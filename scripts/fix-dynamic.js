const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('route.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const apiDir = path.join(__dirname, '../app/api');
const files = walk(apiDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('export const dynamic')) {
    content = `export const dynamic = 'force-dynamic';\n` + content;
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
