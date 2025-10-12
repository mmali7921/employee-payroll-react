const fs = require('fs');
const path = require('path');

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix imports from @/lib/utils
  content = content.replace(/from ['"]@\/lib\/utils\.js['"]/g, 'from "../../lib/utils.js"');
  content = content.replace(/from ['"]@\/lib\/utils['"]/g, 'from "../../lib/utils.js"');
  
  // Fix imports from @/lib/mysql
  content = content.replace(/from ['"]@\/lib\/mysql\.js['"]/g, 'from "../../lib/mysql.js"');
  content = content.replace(/from ['"]@\/lib\/mysql['"]/g, 'from "../../lib/mysql.js"');
  
  // Fix imports from @/hooks/
  content = content.replace(/from ['"]@\/hooks\/([^'"]+)\.js['"]/g, 'from "../../hooks/$1.js"');
  content = content.replace(/from ['"]@\/hooks\/([^'"]+)['"]/g, 'from "../../hooks/$1.js"');
  
  // Fix imports from @/components/ui/ (but not already with .jsx)
  content = content.replace(/from ['"]@\/components\/ui\/([^'"]+)(?!\.jsx)['"]/g, 'from "./$1.jsx"');
  
  // Fix imports from @/components/ (but not already with .jsx)
  content = content.replace(/from ['"]@\/components\/([^'"]+)(?!\.jsx)['"]/g, 'from "../$1.jsx"');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed imports in ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  });
}

// Start from the src directory
walkDir(path.join(__dirname, 'src'));

console.log('All imports fixed!');
