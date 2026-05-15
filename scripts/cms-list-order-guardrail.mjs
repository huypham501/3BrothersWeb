import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const policyFile = path.join(repoRoot, 'src/lib/cms/ux/list-order-policy.ts');

function extractRules(tsSource) {
  const objectRegex = /\{\s*id:\s*'([^']+)'\s*,[\s\S]*?policy:\s*'(required|optional|forbidden)'\s*,[\s\S]*?editorPath:\s*'([^']+)'\s*,[\s\S]*?\}/g;
  const rules = [];
  let match;
  while ((match = objectRegex.exec(tsSource)) !== null) {
    rules.push({
      id: match[1],
      policy: match[2],
      editorPath: match[3],
    });
  }
  return rules;
}

function hasReorderCapability(content) {
  const markers = [
    'CmsSortableList',
    '.move(',
    'moveSelected(',
    'movePosition(',
    'updateJobPositionSortOrder',
    'ArrowUpOutlined',
    'ArrowDownOutlined',
  ];
  return markers.some((marker) => content.includes(marker));
}

async function main() {
  const policyContent = await fs.readFile(policyFile, 'utf8');
  const rules = extractRules(policyContent);
  const violations = [];

  for (const rule of rules) {
    if (rule.policy === 'optional') continue;

    const targetPath = path.join(repoRoot, rule.editorPath);
    let content = '';
    try {
      content = await fs.readFile(targetPath, 'utf8');
    } catch (error) {
      violations.push({
        id: rule.id,
        policy: rule.policy,
        editorPath: rule.editorPath,
        detail: `Cannot read editor file: ${(error && error.message) || 'unknown error'}`,
      });
      continue;
    }

    const hasReorder = hasReorderCapability(content);
    if (rule.policy === 'required' && !hasReorder) {
      violations.push({
        id: rule.id,
        policy: rule.policy,
        editorPath: rule.editorPath,
        detail: 'Missing reorder capability markers.',
      });
    }
    if (rule.policy === 'forbidden' && hasReorder) {
      violations.push({
        id: rule.id,
        policy: rule.policy,
        editorPath: rule.editorPath,
        detail: 'Forbidden rule contains reorder capability markers.',
      });
    }
  }

  if (violations.length > 0) {
    console.error('CMS list-order guardrail failed with violations:');
    for (const violation of violations) {
      console.error(`- ${violation.id} [${violation.policy}] ${violation.editorPath}: ${violation.detail}`);
    }
    process.exit(1);
  }

  console.log(`CMS list-order guardrail passed. Checked ${rules.length} policy rules.`);
}

main().catch((error) => {
  console.error('Failed to run CMS list-order guardrail.');
  console.error(error);
  process.exit(1);
});
