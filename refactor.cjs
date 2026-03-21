const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file.name), arrayOfFiles);
    } else {
      if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
         arrayOfFiles.push(path.join(dirPath, file.name));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('styled-components')) continue;
  
  const regex = /^ *(?:export\s+)?const\s+[A-Za-z0-9_]+\s*=\s*(styled(?:\.[A-Za-z0-9_]+|(?:\([^)]+\)))?(?:<[^>]+>)?|css|keyframes)\s*`/gm;
  
  let match;
  let matches = [];
  while ((match = regex.exec(content)) !== null) {
    let startIndex = match.index;
    let i = startIndex + match[0].length - 1; // start of backtick
    
    let openBraces = 0;
    i++;
    
    while(i < content.length) {
       if (content[i] === '\\' && content[i+1] === '`') {
          i += 2;
          continue;
       }
       if (content[i] === '$' && content[i+1] === '{') {
          openBraces++;
          i += 2;
          continue;
       }
       if (content[i] === '{' && openBraces > 0) {
          openBraces++;
       }
       if (content[i] === '}' && openBraces > 0) {
          openBraces--;
       }
       
       if (content[i] === '`') {
          if (openBraces === 0) {
             break;
          }
       }
       i++;
    }
    
    let endIndex = i;
    // Consume trailing semicolons and whitespace
    while(endIndex + 1 < content.length && (content[endIndex+1] === ';' || content[endIndex+1] === ' ' || content[endIndex+1] === '\n' || content[endIndex+1] === '\r')) {
       endIndex++;
    }
    
    matches.push({
       start: startIndex,
       end: endIndex + 1,
       text: content.substring(startIndex, endIndex + 1).trim()
    });
  }
  
  if (matches.length > 0) {
    // Only move if there is a component logic block / other stuff *after* the first styled component
    // We can just safely move them all to the bottom.
    let newContent = content;
    let textsToAppend = [];
    for (let j = 0; j < matches.length; j++) {
       textsToAppend.push(matches[j].text);
    }
    
    for (let j = matches.length - 1; j >= 0; j--) {
       const m = matches[j];
       newContent = newContent.substring(0, m.start) + newContent.substring(m.end);
    }
    
    newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (!newContent.endsWith('\n')) newContent += '\n';
    newContent += '\n' + textsToAppend.join('\n\n') + '\n';
    
    console.log(`Refactoring ${file}`);
    fs.writeFileSync(file, newContent, 'utf8');
  }
}
console.log('Script done');
