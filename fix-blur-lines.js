const fs = require('fs');
const path = require('path');

// Function to recursively find all JS files
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJSFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix blur lines in a file
function fixBlurLines(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remove backdrop-blur-md and backdrop-blur-sm from bg-white elements
  const patterns = [
    /bg-white\/10 backdrop-blur-md border border-white\/20/g,
    /bg-white\/8 backdrop-blur-sm border border-gray-400\/20/g,
    /bg-white\/10 backdrop-blur-sm border border-white\/20/g,
    /bg-white\/8 backdrop-blur-sm border border-white\/20/g
  ];
  
  const replacements = [
    'bg-white/10',
    'bg-white/8',
    'bg-white/10',
    'bg-white/8'
  ];
  
  patterns.forEach((pattern, index) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacements[index]);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

// Main execution
const srcDir = path.join(__dirname, 'client', 'src');
const jsFiles = findJSFiles(srcDir);

console.log('Fixing white blur lines in all components...');
jsFiles.forEach(fixBlurLines);
console.log('Done!');