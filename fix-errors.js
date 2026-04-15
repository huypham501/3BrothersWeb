const fs = require('fs');
const path = require('path');
const editorsDir = path.join(__dirname, 'src', 'components', 'admin', 'cms', 'editors');
const files = fs.readdirSync(editorsDir);

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  let content = fs.readFileSync(path.join(editorsDir, file), 'utf8');
  
  // Fix Alert success variant
  content = content.replace(/<Alert variant="success">/g, '<Alert variant="default" className="border-green-500 text-green-600 bg-green-50">');
  
  // Fix Input type warnings: value=null -> value={... || ""}
  content = content.replace(/<Input \.\.\.field \/>/g, '<Input {...field} value={field.value ?? ""} />');
  content = content.replace(/<Textarea \.\.\.field \/>/g, '<Textarea {...field} value={field.value ?? ""} />');

  fs.writeFileSync(path.join(editorsDir, file), content, 'utf8');
}
