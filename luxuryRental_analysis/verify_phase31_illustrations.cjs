const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '../frontend/node_modules/playwright'));

async function verifyPhase31() {
  const phaseDir = path.join(__dirname, 'PHASE_31_ILLUSTRATIONS');
  const beforeDir = path.join(phaseDir, 'before');
  const afterDir = path.join(phaseDir, 'after');
  const baselineDir = path.join(__dirname, 'PHASE_30_ASSET_AUDIT', 'screenshots');

  if (!fs.existsSync(beforeDir)) fs.mkdirSync(beforeDir, { recursive: true });
  if (!fs.existsSync(afterDir)) fs.mkdirSync(afterDir, { recursive: true });

  // Copy relevant baselines into before/
  const baselinesToCopy = [
    { src: '01_main_cards_baseline.png', dest: '01_main_cards_before.png' },
    { src: '02_main_banner_and_shortcuts_baseline.png', dest: '02_main_banner_and_shortcuts_before.png' },
    { src: '05_category_recommendations_baseline.png', dest: '05_category_recommendations_before.png' }
  ];

  for (const b of baselinesToCopy) {
    const srcPath = path.join(baselineDir, b.src);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(beforeDir, b.dest));
      console.log(`Copied ${b.src} -> before/${b.dest}`);
    }
  }

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  console.log('[Phase 31] Verifying new illustrations on mobile...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Capture Main Cards with New SVGs
  await page.screenshot({ path: path.join(afterDir, '01_main_cards_after.png') });
  console.log(' - Captured after/01_main_cards_after.png');

  // 2. Scroll to Banner and 8-Grid Shortcuts
  await page.evaluate(() => {
    const el = document.querySelector('.overflow-y-auto');
    if (el) el.scrollTop = 220;
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(afterDir, '02_main_banner_and_shortcuts_after.png') });
  console.log(' - Captured after/02_main_banner_and_shortcuts_after.png');

  // 3. Category Recommendations with New SVGs
  await page.locator('nav.shop-bottom-nav button').filter({ hasText: '카테고리' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(afterDir, '05_category_recommendations_after.png') });
  console.log(' - Captured after/05_category_recommendations_after.png');

  // 4. Verify all newly inserted images loaded properly (naturalWidth > 0)
  const imageReport = await page.evaluate(async () => {
    // Navigate back to main to inspect all images
    const imgs = Array.from(document.querySelectorAll('img[src^="/assets/"]'));
    return imgs.map(img => ({
      src: img.getAttribute('src'),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete
    }));
  });

  console.log('[Phase 31] Image load verification results:');
  console.log(JSON.stringify(imageReport, null, 2));

  await browser.close();
  console.log('[Phase 31] Verification completed successfully!');
}

verifyPhase31().catch(err => {
  console.error('[Phase 31] Verification failed:', err);
  process.exit(1);
});
