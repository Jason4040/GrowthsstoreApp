const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceInFiles = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInFiles(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const original = content;

      // Replace dark:bg-gray-50 dark:bg-[#something] with dark:bg-[#something]
      content = content.replace(/dark:bg-gray-50\s+(dark:bg-\[[^\]]+\]|dark:bg-black)/g, '$1');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
};

replaceInFiles(srcDir);
console.log('Theme fix script completed.');
