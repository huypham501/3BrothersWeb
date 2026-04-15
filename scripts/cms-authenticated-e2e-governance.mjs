import { chromium } from 'playwright';

const BASE_URL = process.env.CMS_E2E_BASE_URL || 'http://localhost:3000';

const ROLE_CREDENTIALS = {
  super_admin: {
    email: process.env.CMS_E2E_SUPER_ADMIN_EMAIL,
    password: process.env.CMS_E2E_SUPER_ADMIN_PASSWORD,
  },
  content_admin: {
    email: process.env.CMS_E2E_CONTENT_ADMIN_EMAIL,
    password: process.env.CMS_E2E_CONTENT_ADMIN_PASSWORD,
  },
  editor: {
    email: process.env.CMS_E2E_EDITOR_EMAIL,
    password: process.env.CMS_E2E_EDITOR_PASSWORD,
  },
  viewer: {
    email: process.env.CMS_E2E_VIEWER_EMAIL,
    password: process.env.CMS_E2E_VIEWER_PASSWORD,
  },
};

const ADMIN_ROUTES = [
  '/admin/content/pages/home',
  '/admin/content/pages/for-creators',
  '/admin/content/shared/exclusive-talents',
  '/admin/content/shared/contact-cta',
  '/admin/content/settings/header',
  '/admin/content/settings/footer',
  '/admin/content/settings/seo-defaults',
  '/admin/content/settings/site-metadata',
  '/admin/content/audit',
];

function checkCredentials() {
  const missing = [];
  for (const [role, cred] of Object.entries(ROLE_CREDENTIALS)) {
    if (!cred.email) missing.push(`CMS_E2E_${role.toUpperCase()}_EMAIL`);
    if (!cred.password) missing.push(`CMS_E2E_${role.toUpperCase()}_PASSWORD`);
  }

  if (missing.length) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n` +
        'Provide confirmed Supabase Auth users for all four roles before running this script.'
    );
  }
}

async function login(page, { email, password }) {
  await page.goto(`${BASE_URL}/login?next=%2Fadmin%2Fcontent`, { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForLoadState('networkidle');

  const current = page.url();
  if (current.includes('/login')) {
    const error = await page.locator('text=/Email not confirmed|Invalid login credentials|Authentication required/i').first().textContent().catch(() => null);
    throw new Error(`Login failed for ${email}. URL=${current}${error ? ` | ${error}` : ''}`);
  }
}

async function checkRouteAccess(page, role) {
  const results = [];
  for (const route of ADMIN_ROUTES) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    const currentUrl = page.url();
    const status = currentUrl.includes('/login')
      ? 'redirect_login'
      : currentUrl.includes('forbidden=1')
      ? 'forbidden'
      : 'ok';

    results.push({ role, route, status, currentUrl });
  }
  return results;
}

async function main() {
  checkCredentials();

  const browser = await chromium.launch({ headless: true });
  const allResults = [];

  try {
    for (const [role, cred] of Object.entries(ROLE_CREDENTIALS)) {
      const context = await browser.newContext();
      const page = await context.newPage();

      await login(page, cred);
      const roleResults = await checkRouteAccess(page, role);
      allResults.push(...roleResults);

      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ baseUrl: BASE_URL, results: allResults }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
