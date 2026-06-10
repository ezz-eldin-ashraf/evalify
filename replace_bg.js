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
  
  // We want to replace "bg-white" with "bg-gradient-to-br from-white to-primary/5 backdrop-blur-md" 
  // ONLY if the class string also contains "rounded" or "shadow" to ensure it's a card/container.
  // We match className="..." and className={`...`}
  
  let newContent = content.replace(/(className=(["']))(.*?)\2/g, (match, prefix, quote, innerClass) => {
    if (innerClass.includes('bg-white') && (innerClass.includes('rounded') || innerClass.includes('shadow'))) {
      const updatedClass = innerClass.replace(/\bbg-white\b/g, 'bg-gradient-to-br from-white to-primary/5 backdrop-blur-md border border-white/40');
      return `${prefix}${updatedClass}${quote}`;
    }
    return match;
  });

  newContent = newContent.replace(/(className=\{`)(.*?)(`\})/g, (match, prefix, innerClass, suffix) => {
    if (innerClass.includes('bg-white') && (innerClass.includes('rounded') || innerClass.includes('shadow'))) {
      const updatedClass = innerClass.replace(/\bbg-white\b/g, 'bg-gradient-to-br from-white to-primary/5 backdrop-blur-md border border-white/40');
      return `${prefix}${updatedClass}${suffix}`;
    }
    return match;
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
    total++;
  }
});
console.log('Total updated:', total);
