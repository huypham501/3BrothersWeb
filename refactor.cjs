const fs = require('fs');
const path = require('path');

const editorsDir = path.join(__dirname, 'src', 'components', 'admin', 'cms', 'editors');

const files = fs.readdirSync(editorsDir);

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  
  const filePath = path.join(editorsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace imports
  content = content.replace(/import\s+{\s*Form,\s*FormControl,\s*FormField,\s*FormItem,\s*FormLabel,\s*FormMessage\s*}\s*from\s*['"]\.\.\/\.\.\/ui\/Form['"];?/g, "import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';");
  
  content = content.replace(/import\s+{\s*Input(\s*,\s*Textarea)?\s*}\s*from\s*['"]\.\.\/\.\.\/ui\/Input['"];?/g, (match, hasTextarea) => {
    let res = "import { Input } from '@/components/ui/input';";
    if (hasTextarea) res += "\nimport { Textarea } from '@/components/ui/textarea';";
    return res;
  });
  
  content = content.replace(/import\s+{\s*Button\s*}\s*from\s*['"]\.\.\/\.\.\/ui\/Button['"];?/g, "import { Button } from '@/components/ui/button';");
  
  content = content.replace(/import\s+{\s*Switch\s*}\s*from\s*['"]\.\.\/\.\.\/ui\/Switch['"];?/g, "import { Switch } from '@/components/ui/switch';");
  
  content = content.replace(/import\s+{\s*Alert(?:,\s*AlertDescription)?(?:,\s*AlertTitle)?\s*}\s*from\s*['"]\.\.\/\.\.\/ui\/Alert['"];?/g, "import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';");

  content = content.replace(/import\s+styled\s+from\s*['"]styled-components['"];?\n?/g, '');

  // Remove styled components definitions
  content = content.replace(/const\s+FormGrid\s*=\s*styled\.div`[\s\S]*?`;\n?/g, '');
  content = content.replace(/const\s+HeaderRow\s*=\s*styled\.div`[\s\S]*?`;\n?/g, '');
  content = content.replace(/const\s+ArrayItemGrid\s*=\s*styled\.div`[\s\S]*?`;\n?/g, '');

  // Replace JSX Tags
  content = content.replace(/<FormGrid>/g, '<div className="grid grid-cols-1 md:grid-cols-2 gap-6">');
  content = content.replace(/<\/FormGrid>/g, '</div>');

  content = content.replace(/<HeaderRow>/g, '<div className="flex justify-between items-center mb-6">');
  content = content.replace(/<\/HeaderRow>/g, '</div>');

  content = content.replace(/<ArrayItemGrid([^>]*)>/g, '<div className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border border-slate-200 rounded-lg mb-4 bg-slate-50 items-end"$1>');
  content = content.replace(/<\/ArrayItemGrid>/g, '</div>');

  // Inline forms formatting
  content = content.replace(/style=\{\{\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*'24px'\s*\}\}/g, 'className="flex flex-col gap-6"');
  content = content.replace(/style=\{\{\s*marginBottom:\s*0,\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'12px'\s*\}\}/g, 'className="flex items-center gap-3 space-y-0"');
  content = content.replace(/style=\{\{\s*marginBottom:\s*0\s*\}\}/g, 'className="col-span-full md:col-span-6"');
  content = content.replace(/<FormLabel style=\{\{\s*marginBottom:\s*0\s*\}\}>/g, '<FormLabel>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
}
