const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '../frontend/node_modules/playwright'));

async function capturePhase28After() {
  const screenshotsDir = path.join(__dirname, 'PHASE_28_ADMIN_UX', 'after');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  // Desktop 1440x900
  console.log('Capturing admin desktop views (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await desktopContext.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Navigate to ShopAdmin
  await page.locator('button[aria-label="관리자 화면으로 이동"]').click();
  await page.waitForTimeout(500);

  // 1. Recruit Dashboard with refined stats cards
  await page.screenshot({ path: path.join(screenshotsDir, '08_admin_recruit_dashboard.png') });

  // 2. Recruit Request Form with time presets
  await page.locator('button').filter({ hasText: '신규 구인 요청 작성' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '09_admin_recruit_request.png') });

  // 3. Worker DB with select all & search
  await page.locator('button').filter({ hasText: '근무자 DB' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '10_admin_recruit_workers.png') });

  // 4. Live Chat with quick response chips
  await page.locator('button').filter({ hasText: '실시간 소통' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '11_admin_recruit_chat.png') });

  // 5. Shop Management Tab
  await page.locator('button').filter({ hasText: '쇼핑몰 관리' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '12_admin_shop_products.png') });

  // Open Product Creation Modal
  await page.locator('button').filter({ hasText: '신규 상품 등록' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '12b_admin_product_modal.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  await desktopContext.close();

  // 6 Responsive Viewports Test (320px, 375px, 430px, 768px, 1366px, 1920px)
  const viewports = [
    { name: 'viewport_320px', width: 320, height: 600 },
    { name: 'viewport_375px', width: 375, height: 812 },
    { name: 'viewport_430px', width: 430, height: 932 },
    { name: 'viewport_768px', width: 768, height: 1024 },
    { name: 'viewport_1366px', width: 1366, height: 768 },
    { name: 'viewport_1920px', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    console.log(`Checking admin on ${vp.name} (${vp.width}x${vp.height})...`);
    const vpContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });
    const vpPage = await vpContext.newPage();
    await vpPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await vpPage.waitForTimeout(300);
    await vpPage.locator('button[aria-label="관리자 화면으로 이동"]').click();
    await vpPage.waitForTimeout(400);

    await vpPage.screenshot({ path: path.join(screenshotsDir, `${vp.name}.png`) });
    await vpContext.close();
  }

  await browser.close();
  console.log(`[SUCCESS] Captured all Phase 28 after screenshots in ${screenshotsDir}`);
}

capturePhase28After().catch(err => {
  console.error('[ERROR] Failed Phase 28 capture:', err);
  process.exit(1);
});
