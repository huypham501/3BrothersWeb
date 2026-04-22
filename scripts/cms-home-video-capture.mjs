import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import process from 'node:process';
import { chromium } from 'playwright';

const DEFAULT_SCENARIO = 'home_public_recursive_then_cms';
const DEFAULT_MAX_PAGES = 30;
const DEFAULT_EXCLUDE_PATTERNS = ['/admin', '/auth/callback', '/login', '/forbidden'];
const DEFAULT_BASE_URL = process.env.CMS_CAPTURE_BASE_URL || 'http://localhost:3000';

const STABLE_WAIT_TIMEOUT_MS = 10000;
const SECTION_DWELL_MS = 1000;
const SMOOTH_SCROLL_DURATION_MS = 800;
const CMS_ACTION_PAUSE_MS = 1200;
const CMS_TYPING_DELAY_MS = 60;
const PUBLIC_VERIFY_TIMEOUT_MS = 120000;
const PUBLIC_VERIFY_POLL_MS = 4000;

const DEFAULT_LOGIN_EMAIL =
  process.env.CMS_CAPTURE_LOGIN_EMAIL || process.env.CMS_E2E_CONTENT_ADMIN_EMAIL || '';
const DEFAULT_LOGIN_PASSWORD =
  process.env.CMS_CAPTURE_LOGIN_PASSWORD || process.env.CMS_E2E_CONTENT_ADMIN_PASSWORD || '';

function nowIso() {
  return new Date().toISOString();
}

function createPublishMarker() {
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AUTO VIDEO ${ts}-${rand}`;
}

function readArgValue(argv, index, inlineValue) {
  if (inlineValue !== undefined) return { value: inlineValue, consumed: 0 };
  return { value: argv[index + 1], consumed: 1 };
}

function parseArgs(argv) {
  const args = {
    scenario: DEFAULT_SCENARIO,
    baseUrl: DEFAULT_BASE_URL,
    headed: false,
    authMode: 'password',
    loginEmail: DEFAULT_LOGIN_EMAIL,
    loginPassword: DEFAULT_LOGIN_PASSWORD,
    maxPages: DEFAULT_MAX_PAGES,
    excludePatterns: [...DEFAULT_EXCLUDE_PATTERNS],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;

    const [rawKey, inlineValue] = arg.slice(2).split('=');
    const key = rawKey.trim();

    switch (key) {
      case 'scenario': {
        const { value, consumed } = readArgValue(argv, i, inlineValue);
        args.scenario = value;
        i += consumed;
        break;
      }
      case 'base-url': {
        const { value, consumed } = readArgValue(argv, i, inlineValue);
        args.baseUrl = value;
        i += consumed;
        break;
      }
      case 'headed': {
        args.headed = true;
        break;
      }
      case 'auth-mode': {
        const { value, consumed } = readArgValue(argv, i, inlineValue);
        args.authMode = value;
        i += consumed;
        break;
      }
      case 'max-pages': {
        const { value, consumed } = readArgValue(argv, i, inlineValue);
        args.maxPages = Number.parseInt(value, 10);
        i += consumed;
        break;
      }
      case 'exclude-patterns': {
        const { value, consumed } = readArgValue(argv, i, inlineValue);
        args.excludePatterns = String(value)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        i += consumed;
        break;
      }
      case 'email': {
        const { value, consumed } = readArgValue(argv, i, inlineValue);
        args.loginEmail = value;
        i += consumed;
        break;
      }
      case 'password': {
        const { value, consumed } = readArgValue(argv, i, inlineValue);
        args.loginPassword = value;
        i += consumed;
        break;
      }
      default:
        break;
    }
  }

  if (args.scenario !== DEFAULT_SCENARIO) {
    throw new Error(`Unsupported scenario: ${args.scenario}`);
  }

  if (!Number.isFinite(args.maxPages) || args.maxPages < 1) {
    throw new Error(`Invalid --max-pages value: ${args.maxPages}`);
  }

  if (args.authMode !== 'password') {
    throw new Error(`Unsupported --auth-mode: ${args.authMode}. Only password is supported.`);
  }

  if (!args.loginEmail || !args.loginPassword) {
    throw new Error(
      'Missing login credentials. Set CMS_CAPTURE_LOGIN_EMAIL and CMS_CAPTURE_LOGIN_PASSWORD, ' +
        'or pass --email and --password.'
    );
  }

  return args;
}

function getGitSha() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function toAbsoluteUrl(baseUrl, maybeRelative) {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return null;
  }
}

function canonicalizeUrl(urlString) {
  try {
    const url = new URL(urlString);
    url.hash = '';
    url.search = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return null;
  }
}

function isExcludedUrl(urlString, baseOrigin, excludePatterns) {
  try {
    const url = new URL(urlString);
    if (url.origin !== baseOrigin) return true;
    return excludePatterns.some((pattern) => url.pathname.includes(pattern));
  } catch {
    return true;
  }
}

async function waitForPageStable(page) {
  await page.waitForLoadState('domcontentloaded', { timeout: STABLE_WAIT_TIMEOUT_MS });
  try {
    await page.waitForLoadState('networkidle', { timeout: STABLE_WAIT_TIMEOUT_MS });
  } catch {
    // Continue when networkidle cannot be reached due to long polling.
  }
  await page.waitForTimeout(350);
}

async function scrollBySections(page) {
  const plan = await page.evaluate(() => {
    const scrollingElement = document.scrollingElement || document.documentElement;
    const maxY = Math.max(scrollingElement.scrollHeight - window.innerHeight, 0);
    const sectionSelectors = ['main section', 'section', '[data-section]', 'article', 'main > div'];

    const candidates = new Set([0, maxY]);
    for (const selector of sectionSelectors) {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const absoluteTop = Math.max(Math.floor(window.scrollY + rect.top - 40), 0);
        candidates.add(Math.min(absoluteTop, maxY));
      });
    }

    const stops = Array.from(candidates)
      .sort((a, b) => a - b)
      .filter((value, index, arr) => index === 0 || value - arr[index - 1] >= 120);

    return {
      maxY,
      stops,
      viewportHeight: window.innerHeight,
      scrollHeight: scrollingElement.scrollHeight,
    };
  });

  for (const y of plan.stops) {
    await page.mouse.move(220 + Math.floor(Math.random() * 360), 180 + Math.floor(Math.random() * 260), {
      steps: 8,
    });

    await page.evaluate(
      async ({ top, duration }) => {
        const startY = window.scrollY;
        const distance = top - startY;
        const start = performance.now();
        const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

        await new Promise((resolve) => {
          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOut(progress);
            window.scrollTo(0, Math.round(startY + distance * eased));

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              resolve();
            }
          };

          requestAnimationFrame(tick);
        });
      },
      { top: y, duration: SMOOTH_SCROLL_DURATION_MS }
    );

    await page.waitForTimeout(SECTION_DWELL_MS);
  }

  const finalY = await page.evaluate(() => window.scrollY);
  return {
    scrollHeight: plan.scrollHeight,
    viewportHeight: plan.viewportHeight,
    maxY: plan.maxY,
    scrollY: finalY,
    reachedBottom: finalY >= plan.maxY,
    sectionStops: plan.stops.length,
    dwellMsPerSection: SECTION_DWELL_MS,
  };
}

async function clickInternalLinkIfPossible(page, targetUrl) {
  const clicked = await page.evaluate((destination) => {
    const normalize = (raw) => {
      try {
        const url = new URL(raw, window.location.origin);
        url.hash = '';
        url.search = '';
        if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1);
        }
        return url.toString();
      } catch {
        return null;
      }
    };

    const target = normalize(destination);
    if (!target) return false;

    const anchors = Array.from(document.querySelectorAll('a[href]'));
    const candidate = anchors.find((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href) return false;
      const normalized = normalize(href);
      if (!normalized || normalized !== target) return false;

      const rect = anchor.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    if (!candidate) return false;

    candidate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    candidate.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    candidate.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    candidate.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    candidate.click();
    return true;
  }, targetUrl);

  if (!clicked) return false;
  await page.waitForLoadState('domcontentloaded', { timeout: STABLE_WAIT_TIMEOUT_MS });
  return true;
}

async function extractLinksBySelector(page, selector, baseOrigin, excludePatterns) {
  const hrefs = await page.evaluate((selectorValue) => {
    const anchors = Array.from(document.querySelectorAll(selectorValue));
    return anchors
      .map((anchor) => anchor.getAttribute('href'))
      .filter(Boolean);
  }, selector);

  const links = [];
  const seen = new Set();

  for (const href of hrefs) {
    const absolute = toAbsoluteUrl(page.url(), href);
    const canonical = absolute ? canonicalizeUrl(absolute) : null;
    if (!canonical) continue;
    if (seen.has(canonical)) continue;
    if (isExcludedUrl(canonical, baseOrigin, excludePatterns)) continue;
    seen.add(canonical);
    links.push(canonical);
  }

  return links;
}

async function extractMenuLinksFromRoot(page, baseOrigin, excludePatterns) {
  const headerLinks = await extractLinksBySelector(
    page,
    'header a[href], nav a[href]',
    baseOrigin,
    excludePatterns
  );
  const footerLinks = await extractLinksBySelector(page, 'footer a[href]', baseOrigin, excludePatterns);
  return Array.from(new Set([...headerLinks, ...footerLinks]));
}

async function extractFirstDeepItem(page, baseOrigin, excludePatterns, parentPath) {
  const links = await extractLinksBySelector(page, 'a[href]', baseOrigin, excludePatterns);
  const match = links.find((url) => {
    const pathname = new URL(url).pathname;
    return pathname.startsWith(`${parentPath}/`) && pathname !== parentPath;
  });
  return match || null;
}

async function discoverPublicRoutesFromSource(baseOrigin, excludePatterns) {
  const appDir = path.resolve('src', 'app');
  const routes = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(abs);
        continue;
      }

      if (!entry.isFile() || entry.name !== 'page.tsx') continue;

      const relativeDir = path.relative(appDir, path.dirname(abs));
      const routePath = relativeDir ? `/${relativeDir.split(path.sep).join('/')}` : '/';
      if (routePath.includes('[')) continue;

      const absolute = toAbsoluteUrl(baseOrigin, routePath);
      const canonical = absolute ? canonicalizeUrl(absolute) : null;
      if (!canonical) continue;
      if (isExcludedUrl(canonical, baseOrigin, excludePatterns)) continue;
      routes.push(canonical);
    }
  }

  await walk(appDir);
  return Array.from(new Set(routes)).sort((a, b) => a.localeCompare(b));
}

async function visitPage(page, targetUrl, reason, visited, metadata, options = {}) {
  if (visited.has(targetUrl)) return null;

  const preferClick = Boolean(options.preferClick);
  let navigatedBy = 'goto';

  if (preferClick) {
    const clicked = await clickInternalLinkIfPossible(page, targetUrl);
    if (clicked) {
      navigatedBy = 'click';
    } else {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    }
  } else {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  }

  await waitForPageStable(page);
  const scroll = await scrollBySections(page);

  const resolved = canonicalizeUrl(page.url()) || targetUrl;
  if (visited.has(resolved)) {
    metadata.public.redirected_duplicates.push({
      candidate_url: targetUrl,
      resolved_url: resolved,
      visitedAt: nowIso(),
      reason,
    });
    console.log(`[public] redirected duplicate: ${targetUrl} -> ${resolved} | reason=${reason}`);
    return null;
  }

  visited.add(resolved);
  console.log(
    `[public] visited ${visited.size}/${metadata.public.target_max_pages}: ${resolved} | reachedBottom=${scroll.reachedBottom} | sections=${scroll.sectionStops}`
  );

  metadata.public.pages.push({
    url: resolved,
    candidate_url: targetUrl,
    reason,
    navigated_by: navigatedBy,
    visitedAt: nowIso(),
    scroll,
  });

  return resolved;
}

async function runPublicRecursiveStage(page, options, metadata) {
  const stageStart = Date.now();
  const baseCanonical = canonicalizeUrl(options.baseUrl);
  if (!baseCanonical) {
    throw new Error(`Invalid base URL: ${options.baseUrl}`);
  }

  const baseOrigin = new URL(baseCanonical).origin;
  const visited = new Set();

  metadata.public.target_max_pages = options.maxPages;
  metadata.public.strategy = 'root -> menu -> first deep item for blogs/careers -> source routes';

  const rootResolved = await visitPage(page, baseCanonical, 'root', visited, metadata);
  if (!rootResolved) {
    throw new Error('Failed to visit root page for public stage.');
  }

  const menuLinks = await extractMenuLinksFromRoot(page, baseOrigin, options.excludePatterns);
  metadata.public.menu_links = menuLinks;

  for (const menuUrl of menuLinks) {
    if (visited.size >= options.maxPages) break;

    const resolved = await visitPage(page, menuUrl, 'menu', visited, metadata, {
      preferClick: true,
    });
    if (!resolved) continue;

    const pathname = new URL(resolved).pathname;
    if (pathname === '/blogs' || pathname === '/careers') {
      const deepItem = await extractFirstDeepItem(
        page,
        baseOrigin,
        options.excludePatterns,
        pathname
      );

      if (deepItem && visited.size < options.maxPages) {
        await visitPage(page, deepItem, `${pathname.slice(1)}_first_item`, visited, metadata, {
          preferClick: true,
        });
      }
    }
  }

  const sourceRoutes = await discoverPublicRoutesFromSource(baseOrigin, options.excludePatterns);
  metadata.public.source_routes = sourceRoutes;

  for (const sourceUrl of sourceRoutes) {
    if (visited.size >= options.maxPages) break;
    await visitPage(page, sourceUrl, 'source_unlinked', visited, metadata);
  }

  metadata.public.visited_urls = Array.from(visited);
  metadata.public.skipped_due_to_max_pages = sourceRoutes.filter((url) => !visited.has(url));
  metadata.stages.stage_public_recursive = {
    started_at: new Date(stageStart).toISOString(),
    finished_at: nowIso(),
    duration_ms: Date.now() - stageStart,
    visited_count: visited.size,
    redirected_duplicate_count: metadata.public.redirected_duplicates.length,
    max_pages: options.maxPages,
  };
}

async function ensureLoggedInWithPassword(page, options, metadata) {
  const loginUrl = `${options.baseUrl}/login?next=${encodeURIComponent('/admin/content/pages/home')}`;
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
  await waitForPageStable(page);

  const emailInput = page.locator('input[name="email"]').first();
  const passwordInput = page.locator('input[name="password"]').first();
  const submitButton = page.locator('button[type="submit"]').first();

  await emailInput.waitFor({ state: 'visible', timeout: 15000 });
  await passwordInput.waitFor({ state: 'visible', timeout: 15000 });

  await emailInput.fill(options.loginEmail);
  await passwordInput.fill(options.loginPassword);
  await submitButton.click();

  const leftLoginPage = await page
    .waitForFunction(() => window.location.pathname !== '/login', { timeout: 30000 })
    .then(() => true)
    .catch(() => false);

  if (!leftLoginPage) {
    const maybeError = await page
      .locator('text=/Unable|invalid|failed|error|lỗi|không có quyền|Authentication required/i')
      .first()
      .textContent()
      .catch(() => null);

    throw new Error(
      `Password login did not leave /login for ${options.loginEmail}.${
        maybeError ? ` Message: ${maybeError}` : ''
      }`
    );
  }

  await waitForPageStable(page);

  if (page.url().includes('/login')) {
    const maybeError = await page
      .locator('text=/Unable|invalid|failed|error|lỗi|không có quyền|Authentication required/i')
      .first()
      .textContent()
      .catch(() => null);

    throw new Error(
      `Password login still on /login for ${options.loginEmail}.${
        maybeError ? ` Message: ${maybeError}` : ''
      }`
    );
  }

  if (page.url().includes('/forbidden')) {
    throw new Error(
      `Password login succeeded for ${options.loginEmail} but account has no CMS permission (redirected to /forbidden).`
    );
  }

  if (!page.url().includes('/admin/content/pages/home')) {
    await page.goto(`${options.baseUrl}/admin/content/pages/home`, {
      waitUntil: 'domcontentloaded',
    });
    await waitForPageStable(page);
  }

  await page.waitForSelector('text=Home CMS Editor', { timeout: 20000 });
  metadata.cms.auth_detection = {
    method: 'password_form',
    detected_at: nowIso(),
    email: options.loginEmail,
  };
}

async function openHeroAccordion(page) {
  const heroPanel = page.locator('.ant-collapse-item').filter({ hasText: 'Hero' }).first();
  await heroPanel.waitFor({ state: 'visible', timeout: 15000 });

  const isActive = await heroPanel.evaluate((el) => el.classList.contains('ant-collapse-item-active'));
  if (!isActive) {
    const heroHeader = heroPanel.locator('.ant-collapse-header').first();
    await heroHeader.waitFor({ state: 'visible', timeout: 15000 });
    await heroHeader.click();
  }

  await heroPanel
    .locator('.ant-collapse-content-box')
    .first()
    .waitFor({ state: 'visible', timeout: 15000 });

  await page.waitForTimeout(CMS_ACTION_PAUSE_MS);
  return heroPanel;
}

async function typeLikeHuman(locator, value) {
  await locator.click({ clickCount: 3 });
  await locator.press('Backspace');
  await locator.type(value, { delay: CMS_TYPING_DELAY_MS });
}

async function findVisibleHeroInputByLabel(heroPanel, labelText) {
  const labeledInput = heroPanel
    .locator('.ant-collapse-content-box .ant-form-item')
    .filter({ hasText: labelText })
    .locator('textarea, input')
    .first();

  if (await labeledInput.isVisible().catch(() => false)) {
    return labeledInput;
  }

  return null;
}

async function updateHeroContent(heroPanel, marker) {
  const titleInput =
    (await findVisibleHeroInputByLabel(heroPanel, 'Title')) ||
    heroPanel.locator('.ant-collapse-content-box textarea').first();

  const titleVisible = await titleInput.isVisible().catch(() => false);
  if (!titleVisible) {
    throw new Error('Unable to find visible Hero Title input after opening Hero panel.');
  }

  const currentTitle = (await titleInput.inputValue().catch(() => '')).trim();
  const nextTitle = currentTitle === marker ? `${marker} X` : marker;

  await typeLikeHuman(titleInput, nextTitle);
  await titleInput.blur();
  await heroPanel.page().waitForTimeout(CMS_ACTION_PAUSE_MS);

  const subtextInput = await findVisibleHeroInputByLabel(heroPanel, 'Subtext');
  if (subtextInput) {
    const currentSubtext = (await subtextInput.inputValue().catch(() => '')).trim();
    const nextSubtext = `${currentSubtext.replace(/\s+/g, ' ').trim()} [${nextTitle}]`.trim();
    await typeLikeHuman(subtextInput, nextSubtext.slice(0, 300));
    await subtextInput.blur();
    await heroPanel.page().waitForTimeout(CMS_ACTION_PAUSE_MS);
  }

  return nextTitle;
}

async function saveHeroSection(heroPanel) {
  const saveButton = heroPanel.getByRole('button', { name: /Save Section|Saving.../ }).first();
  await saveButton.waitFor({ state: 'visible', timeout: 10000 });
  await heroPanel.page().waitForTimeout(CMS_ACTION_PAUSE_MS);
  await saveButton.click();

  await heroPanel
    .locator('text=Hero section saved successfully.')
    .first()
    .waitFor({ timeout: 20000 });

  await heroPanel.page().waitForTimeout(CMS_ACTION_PAUSE_MS);
}

async function publishHome(page, metadata) {
  let publishDialogMessage = null;
  const onDialog = async (dialog) => {
    publishDialogMessage = dialog.message();
    await dialog.accept();
  };

  page.on('dialog', onDialog);
  try {
    const publishButton = page.getByRole('button', { name: 'Publish Home' }).first();
    await publishButton.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(CMS_ACTION_PAUSE_MS);
    await publishButton.click();

    await page.waitForTimeout(1200);
    await page.waitForSelector('text=Đã publish', { timeout: 45000 });
    await page.waitForTimeout(CMS_ACTION_PAUSE_MS);
  } finally {
    page.off('dialog', onDialog);
  }

  metadata.cms.publish = {
    dialog_message: publishDialogMessage,
    published_at: nowIso(),
  };
}

async function clickLikeUser(page, locator, pauseMs = CMS_ACTION_PAUSE_MS) {
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  await locator.scrollIntoViewIfNeeded();

  const box = await locator.boundingBox();
  if (box) {
    const x = box.x + Math.max(8, Math.floor(box.width * 0.42));
    const y = box.y + Math.max(8, Math.floor(box.height * 0.52));
    await page.mouse.move(x, y, { steps: 12 });
    await page.waitForTimeout(180);
    await page.mouse.down();
    await page.waitForTimeout(70);
    await page.mouse.up();
  } else {
    await locator.click();
  }

  await page.waitForTimeout(pauseMs);
}

async function goToPublishCenterFromMenu(page) {
  const sidebar = page.locator('aside').first();
  await sidebar.waitFor({ state: 'visible', timeout: 15000 });

  const toolsSubmenu = sidebar.locator('.ant-menu-submenu').filter({ hasText: 'Tools' }).first();
  await toolsSubmenu.waitFor({ state: 'visible', timeout: 15000 });

  const isOpen = await toolsSubmenu.evaluate((el) => el.classList.contains('ant-menu-submenu-open'));
  if (!isOpen) {
    const toolsTitle = toolsSubmenu.locator('.ant-menu-submenu-title').first();
    await clickLikeUser(page, toolsTitle, CMS_ACTION_PAUSE_MS);
  }

  const publishCenterLink = sidebar.locator('a').filter({ hasText: 'Publish Center' }).first();
  await clickLikeUser(page, publishCenterLink, CMS_ACTION_PAUSE_MS);

  await page.waitForURL((url) => url.pathname.startsWith('/admin/publish'), {
    timeout: 20000,
  });
  await waitForPageStable(page);
}

async function publishAllChangesInCenter(page, metadata) {
  await page.waitForSelector('text=Publish Center', { timeout: 20000 });
  await page.waitForSelector('text=Publish tất cả thay đổi', { timeout: 20000 });

  const publishAllButton = page
    .getByRole('button', { name: /Publish tất cả thay đổi|Đang publish.../ })
    .first();

  await clickLikeUser(page, publishAllButton, CMS_ACTION_PAUSE_MS);
  await page.waitForSelector('text=Publish thành công!', { timeout: 120000 });
  await page.waitForTimeout(CMS_ACTION_PAUSE_MS);

  metadata.cms.publish_center = {
    published_at: nowIso(),
    success: true,
  };
}

async function verifyPublicHome(page, options, expectedTitle) {
  const startedAt = Date.now();
  const expectedNormalized = expectedTitle.trim().toLowerCase();
  let lastSeenSnippet = '';

  while (Date.now() - startedAt < PUBLIC_VERIFY_TIMEOUT_MS) {
    const bust = `capture_verify=${Date.now()}`;
    const verifyUrl = `${options.baseUrl}${options.baseUrl.includes('?') ? '&' : '?'}${bust}`;

    await page.goto(verifyUrl, { waitUntil: 'domcontentloaded' });
    await waitForPageStable(page);
    await page.waitForTimeout(CMS_ACTION_PAUSE_MS);

    const bodyText = await page.evaluate(() => (document.body?.innerText || '').toLowerCase());
    if (bodyText.includes(expectedNormalized)) {
      await page.waitForTimeout(CMS_ACTION_PAUSE_MS);
      return;
    }

    lastSeenSnippet = bodyText.slice(0, 400);
    await page.waitForTimeout(PUBLIC_VERIFY_POLL_MS);
  }

  throw new Error(
    `Public verify timeout after ${PUBLIC_VERIFY_TIMEOUT_MS / 1000}s: token "${expectedTitle}" not found on Home. ` +
      `Last text sample: ${JSON.stringify(lastSeenSnippet)}`
  );
}

async function runCmsStage(page, options, metadata) {
  const stageStart = Date.now();

  await page.goto(`${options.baseUrl}/admin/content/pages/home`, { waitUntil: 'domcontentloaded' });
  await waitForPageStable(page);

  if (page.url().includes('/login')) {
    await ensureLoggedInWithPassword(page, options, metadata);
  } else {
    metadata.cms.auth_detection = {
      method: 'existing_session',
      detected_at: nowIso(),
      email: options.loginEmail || null,
    };
  }

  await page.goto(`${options.baseUrl}/admin/content/pages/home`, { waitUntil: 'domcontentloaded' });
  await waitForPageStable(page);
  await page.waitForSelector('text=Home CMS Editor', { timeout: 20000 });

  const heroPanel = await openHeroAccordion(page);
  const runToken = createPublishMarker();

  const appliedToken = await updateHeroContent(heroPanel, runToken);
  await saveHeroSection(heroPanel);
  await publishHome(page, metadata);
  await goToPublishCenterFromMenu(page);
  await publishAllChangesInCenter(page, metadata);
  await verifyPublicHome(page, options, appliedToken);

  metadata.cms.hero_title_value = appliedToken;
  metadata.stages.stage_cms_home_happy = {
    started_at: new Date(stageStart).toISOString(),
    finished_at: nowIso(),
    duration_ms: Date.now() - stageStart,
    verified_public_home: true,
  };
}

async function maybeConvertToMp4(inputVideoPath, outputDir) {
  const outputMp4 = path.join(outputDir, 'video.mp4');

  try {
    execSync('command -v ffmpeg', { stdio: 'ignore' });
    execSync(
      `ffmpeg -y -i ${JSON.stringify(inputVideoPath)} -c:v libx264 -pix_fmt yuv420p ${JSON.stringify(outputMp4)}`,
      { stdio: 'ignore' }
    );

    return {
      format: 'mp4',
      file: outputMp4,
      converted_with_ffmpeg: true,
    };
  } catch {
    const outputWebm = path.join(outputDir, 'video.webm');
    await fs.copyFile(inputVideoPath, outputWebm);

    return {
      format: 'webm',
      file: outputWebm,
      converted_with_ffmpeg: false,
      warning: 'ffmpeg not found; exported webm instead of mp4',
    };
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function createMetadata(options, outputDir, runId) {
  return {
    scenario: options.scenario,
    base_url: options.baseUrl,
    run_id: runId,
    started_at: nowIso(),
    finished_at: null,
    git_sha: getGitSha(),
    timezone: 'Asia/Ho_Chi_Minh',
    locale: 'vi-VN',
    auth_mode: options.authMode,
    auth_email: options.loginEmail,
    result: 'running',
    artifacts_dir: outputDir,
    video: null,
    public: {
      target_max_pages: options.maxPages,
      strategy: null,
      menu_links: [],
      source_routes: [],
      visited_urls: [],
      skipped_due_to_max_pages: [],
      redirected_duplicates: [],
      pages: [],
    },
    cms: {
      auth_detection: null,
      publish: null,
      publish_center: null,
      hero_title_value: null,
    },
    stages: {},
    error: null,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const runId = `${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const outputDir = path.resolve('artifacts', 'cms-capture', runId);

  await ensureDir(outputDir);
  const metadata = createMetadata(options, outputDir, runId);

  const browser = await chromium.launch({ headless: !options.headed });
  const context = await browser.newContext({
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 },
    },
  });
  const page = await context.newPage();

  let finalVideoPath = null;

  try {
    console.log(`[run] scenario=${options.scenario} baseUrl=${options.baseUrl} runId=${runId}`);
    // await runPublicRecursiveStage(page, options, metadata);
    await runCmsStage(page, options, metadata);
    metadata.result = 'ok';
  } catch (error) {
    metadata.result = 'failed';
    metadata.error = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
      at: nowIso(),
    };
    throw error;
  } finally {
    metadata.finished_at = nowIso();

    const videoRef = page.video();
    await context.close();
    await browser.close();

    if (videoRef) {
      const sourceVideoPath = await videoRef.path();
      const video = await maybeConvertToMp4(sourceVideoPath, outputDir);
      metadata.video = video;
      finalVideoPath = video.file;
    }

    const metadataPath = path.join(outputDir, 'run-metadata.json');
    await writeJson(metadataPath, metadata);

    console.log(`[run] metadata: ${metadataPath}`);
    if (finalVideoPath) {
      console.log(`[run] video: ${finalVideoPath}`);
    }
  }
}

main().catch((error) => {
  console.error(`[error] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
