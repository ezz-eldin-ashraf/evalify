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
  
  // Replace background colors with theme-aware classes
  let newContent = content.replace(/\bbg-white\b/g, 'bg-bg-surface');
  newContent = newContent.replace(/bg-\[\#F8FAFC\]/g, 'bg-bg-main');
  
  // Replace hardcoded grays
  newContent = newContent.replace(/\btext-gray-400\b/g, 'text-text-muted');
  newContent = newContent.replace(/\btext-gray-500\b/g, 'text-text-secondary');
  newContent = newContent.replace(/\bhover:bg-gray-50\b/g, 'hover:bg-bg-input');
  newContent = newContent.replace(/\bhover:bg-gray-100\b/g, 'hover:bg-bg-input');
  newContent = newContent.replace(/\bhover:bg-gray-200\b/g, 'hover:bg-border');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
    total++;
  }
});
console.log('Total updated:', total);
