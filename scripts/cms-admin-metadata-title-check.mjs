import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const adminRoot = path.join(repoRoot, 'src/app/admin');
const routeFileRegex = /(page|loading|error|not-found)\.tsx$/;

function toPosix(value) {
  return value.split(path.sep).join('/');
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    if (entry.isFile() && routeFileRegex.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function detectRouteKind(filePath) {
  const base = path.basename(filePath);
  if (base === 'page.tsx') return 'page';
  if (base === 'loading.tsx') return 'loading';
  if (base === 'error.tsx') return 'error';
  return 'not-found';
}

function hasMetadataTitle(content) {
  const hasMetadataWithTitle = /export\s+const\s+metadata(?:\s*:\s*[^=]+)?\s*=\s*\{[\s\S]*?\btitle\s*:/m.test(content);
  const hasGenerateMetadata = /export\s+(async\s+)?function\s+generateMetadata\s*\(/.test(content);
  return hasMetadataWithTitle || hasGenerateMetadata;
}

function hasHardcodedCmsSuffixInMetadata(content) {
  return /\btitle\s*:\s*['"`][^'"`]*\|\s*CMS Admin['"`]/.test(content);
}

function hasPageLabelSource(content) {
  return content.includes('ADMIN_METADATA_PAGE_TITLE_LABELS.');
}

function hasRouteStatePattern(content, kind) {
  if (kind === 'loading' || kind === 'error') {
    return (
      content.includes('buildAdminRouteStateTitle(') ||
      new RegExp(`\\btitle\\s*:\\s*['"\`][^'"\`]*\\b${kind === 'loading' ? 'Loading' : 'Error'}\\b`).test(content)
    );
  }
  if (kind === 'not-found') {
    return (
      content.includes('buildAdminRouteStateTitle(') ||
      /\btitle\s*:\s*['"`][^'"`]*\bNot Found\b/.test(content)
    );
  }
  return true;
}

async function main() {
  const files = await walk(adminRoot);
  const violations = [];

  for (const absPath of files) {
    const relPath = toPosix(path.relative(repoRoot, absPath));
    const kind = detectRouteKind(absPath);
    const content = await fs.readFile(absPath, 'utf8');

    if (!hasMetadataTitle(content)) {
      violations.push({
        file: relPath,
        type: 'missing-metadata-title',
        detail: 'Missing metadata title declaration (metadata.title or generateMetadata).',
      });
      continue;
    }

    if (kind === 'page') {
      if (hasHardcodedCmsSuffixInMetadata(content)) {
        violations.push({
          file: relPath,
          type: 'hardcoded-cms-suffix',
          detail: 'Do not hardcode "| CMS Admin" in page metadata.title when using title.template.',
        });
      }
      if (!hasPageLabelSource(content)) {
        violations.push({
          file: relPath,
          type: 'missing-page-label-source',
          detail: 'Page metadata.title should reference ADMIN_METADATA_PAGE_TITLE_LABELS.* source-of-truth.',
        });
      }
      continue;
    }

    if (!hasRouteStatePattern(content, kind)) {
      violations.push({
        file: relPath,
        type: 'invalid-route-state-title',
        detail: `Route-state metadata.title must follow "<Page Label> ${kind === 'loading' ? 'Loading' : kind === 'error' ? 'Error' : 'Not Found'}".`,
      });
    }
  }

  if (violations.length > 0) {
    console.error('CMS admin metadata title check failed with violations:');
    for (const v of violations) {
      console.error(`- ${v.file} [${v.type}] ${v.detail}`);
    }
    process.exit(1);
  }

  console.log(`CMS admin metadata title check passed. Checked ${files.length} route files.`);
}

main().catch((error) => {
  console.error('Failed to run CMS admin metadata title check.');
  console.error(error);
  process.exit(1);
});
