const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let total = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Revert back the exact string we added
  let newContent = content.replace(/bg-gradient-to-br from-white to-primary\/5 backdrop-blur-md border border-white\/40/g, 'bg-white');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Reverted', file);
    total++;
  }
});
console.log('Total reverted:', total);
