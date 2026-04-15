import fs from 'node:fs';

function readEnvFile(path) {
  if (!fs.existsSync(path)) return {};
  const raw = fs.readFileSync(path, 'utf8');
  const out = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}

function hasMarker(html, marker) {
  return html.includes(marker);
}

async function fetchJson(url, key) {
  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) ${url}`);
  }

  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) ${url}`);
  }
  return res.text();
}

function buildMatrix(rows) {
  return rows.map((row) => {
    const expectation = row.published_enabled === true
      ? 'published_content'
      : row.enabled
        ? 'fallback content'
        : 'hidden';

    return {
      schema_key: row.schema_key,
      enabled: row.enabled,
      published_enabled: row.published_enabled,
      expected_render_source: expectation,
    };
  });
}

function writeReport(reportPath, data) {
  const lines = [];
  lines.push('# CMS Phase 7 Verification Report');
  lines.push('');
  lines.push(`Generated at: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Runtime Render Checks');
  lines.push(`- URL: ${data.runtime.url}`);
  lines.push(`- Header marker: ${data.runtime.markers.header ? 'PASS' : 'FAIL'}`);
  lines.push(`- Hero marker: ${data.runtime.markers.hero ? 'PASS' : 'FAIL'}`);
  lines.push(`- Footer marker: ${data.runtime.markers.footer ? 'PASS' : 'FAIL'}`);
  lines.push(`- Metadata title marker: ${data.runtime.markers.metadataTitle ? 'PASS' : 'FAIL'}`);
  lines.push('');
  lines.push('## Home Page Publish Matrix (page_sections)');
  lines.push('');
  lines.push('| schema_key | enabled | published_enabled | expected_render_source |');
  lines.push('|---|---:|---:|---|');
  for (const row of data.pageSectionMatrix) {
    lines.push(`| ${row.schema_key} | ${String(row.enabled)} | ${String(row.published_enabled)} | ${row.expected_render_source} |`);
  }
  lines.push('');
  lines.push('## Shared Sections Matrix');
  lines.push('');
  lines.push('| schema_key | enabled | published_enabled | expected_render_source |');
  lines.push('|---|---:|---:|---|');
  for (const row of data.sharedMatrix) {
    lines.push(`| ${row.schema_key} | ${String(row.enabled)} | ${String(row.published_enabled)} | ${row.expected_render_source} |`);
  }
  lines.push('');
  lines.push('## Global Settings Matrix');
  lines.push('');
  lines.push('| schema_key | enabled | published_enabled | expected_render_source |');
  lines.push('|---|---:|---:|---|');
  for (const row of data.globalMatrix) {
    lines.push(`| ${row.schema_key} | ${String(row.enabled)} | ${String(row.published_enabled)} | ${row.expected_render_source} |`);
  }
  lines.push('');
  lines.push('## Metadata Snapshot (home page row)');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(data.pageMetaSnapshot, null, 2));
  lines.push('```');
  lines.push('');

  fs.writeFileSync(reportPath, lines.join('\n'));
}

async function main() {
  const envLocal = readEnvFile('.env.local');
  const supabaseUrl = envLocal.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = envLocal.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env.local');
  }

  const runtimeUrl = process.env.CMS_VERIFY_URL || 'http://localhost:3001/';
  const restBase = `${supabaseUrl}/rest/v1`;

  const pageRows = await fetchJson(
    `${restBase}/pages?slug=eq.home&select=id,slug,status,seo_title,published_seo_title,seo_description,published_seo_description,keywords,published_keywords`,
    publishableKey
  );

  const home = pageRows[0] ?? null;
  if (!home) {
    throw new Error('Home page row not found in pages table.');
  }

  const sections = await fetchJson(
    `${restBase}/page_sections?page_id=eq.${home.id}&select=schema_key,enabled,published_enabled&order=sort_order.asc`,
    publishableKey
  );

  const shared = await fetchJson(
    `${restBase}/shared_sections?select=schema_key,enabled,published_enabled&order=schema_key.asc`,
    publishableKey
  );

  const globals = await fetchJson(
    `${restBase}/global_settings?select=schema_key,enabled,published_enabled&order=schema_key.asc`,
    publishableKey
  );

  const html = await fetchText(runtimeUrl);

  const report = {
    runtime: {
      url: runtimeUrl,
      markers: {
        header: hasMarker(html, 'HeaderV2__HeaderContainer'),
        hero: hasMarker(html, 'HeroSectionV2__HeroContainer'),
        footer: hasMarker(html, 'FooterV2__FooterContainer'),
        metadataTitle: hasMarker(html, '<title>3BROTHERS NETWORK | The Leading Creator Economy Platform</title>'),
      },
    },
    pageSectionMatrix: buildMatrix(sections),
    sharedMatrix: buildMatrix(shared),
    globalMatrix: buildMatrix(globals),
    pageMetaSnapshot: home,
  };

  const reportPath = 'docs/cms_phase7_verification_report.md';
  writeReport(reportPath, report);

  console.log(`Phase 7 verification report written to ${reportPath}`);
}

main().catch((error) => {
  console.error('[cms:verify:phase7] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
