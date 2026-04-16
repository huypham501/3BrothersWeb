import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const cmsRoots = ['src/app/admin', 'src/components/admin'];
const fileExts = new Set(['.ts', '.tsx']);

const allowedSharedImports = new Set([
  '@/components/auth/SignOutButton',
]);

const forbiddenImportMatchers = [
  {
    type: 'forbidden-radix-import',
    regex: /from\s+['"]@radix-ui\//,
    detail: 'Radix UI is not allowed in CMS scope.',
  },
  {
    type: 'forbidden-base-ui-import',
    regex: /from\s+['"]@base-ui\/react\//,
    detail: 'Base UI is not allowed in CMS scope.',
  },
  {
    type: 'forbidden-shadcn-ui-import',
    regex: /from\s+['"]@\/components\/ui\//,
    detail: 'shadcn/ui imports are not allowed in CMS scope.',
  },
];

const forbiddenPatternMatchers = [
  {
    type: 'forbidden-tailwind-classname',
    regex: /className\s*=\s*["'{`]/,
    detail: 'Tailwind/className styling is not allowed in CMS scope. Use Antd or inline style objects.',
  },
  {
    type: 'forbidden-cn-usage',
    regex: /\bcn\s*\(/,
    detail: 'cn() utility usage is not allowed in CMS scope.',
  },
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && fileExts.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

async function main() {
  const violations = [];

  for (const root of cmsRoots) {
    const absoluteRoot = path.join(repoRoot, root);
    const files = await walk(absoluteRoot);

    for (const filePath of files) {
      const content = await fs.readFile(filePath, 'utf8');
      const relPath = toPosix(path.relative(repoRoot, filePath));

      if (content.includes('styled-components')) {
        violations.push({
          file: relPath,
          type: 'styled-components',
          detail: 'styled-components is not allowed in CMS scope.',
        });
      }

      for (const matcher of forbiddenImportMatchers) {
        if (matcher.regex.test(content)) {
          violations.push({
            file: relPath,
            type: matcher.type,
            detail: matcher.detail,
          });
        }
      }

      for (const matcher of forbiddenPatternMatchers) {
        if (matcher.regex.test(content)) {
          violations.push({
            file: relPath,
            type: matcher.type,
            detail: matcher.detail,
          });
        }
      }

      const importRegex = /from\s+['"](@\/components\/(?:auth|shared|ui)\/[^'\"]+)['"]/g;
      const matches = content.matchAll(importRegex);

      for (const match of matches) {
        const importPath = match[1];
        if (!allowedSharedImports.has(importPath)) {
          violations.push({
            file: relPath,
            type: 'forbidden-shared-import',
            detail: `Forbidden shared import: ${importPath}`,
          });
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error('CMS UI boundary check failed with violations:');
    for (const v of violations) {
      console.error(`- ${v.file} [${v.type}] ${v.detail}`);
    }
    process.exit(1);
  }

  console.log('CMS UI boundary check passed.');
}

main().catch((error) => {
  console.error('Failed to run CMS UI boundary check.');
  console.error(error);
  process.exit(1);
});
