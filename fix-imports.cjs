const fs = require('fs');
const path = require('path');
const editorsDir = path.join(__dirname, 'src', 'components', 'admin', 'cms', 'editors');
const files = fs.readdirSync(editorsDir);

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  let content = fs.readFileSync(path.join(editorsDir, file), 'utf8');
  
  // Fix button casing import
  content = content.replace(/import { Button } from '@\/components\/ui\/button';/g, "import { Button } from '@/components/ui/Button';");

  fs.writeFileSync(path.join(editorsDir, file), content, 'utf8');
}
