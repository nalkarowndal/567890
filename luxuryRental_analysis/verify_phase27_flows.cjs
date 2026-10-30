const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '../frontend/node_modules/playwright'));

async function verifyPhase27Flows() {
  const screenshotsDir = path.join(__dirname, 'PHASE_27_CORE_UX', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
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

  console.log('1. Testing Rental Flow...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Click on the first product card (렌트 상품)
  const productCards = page.locator('li[data-testid="product-card"]');
  await productCards.first().waitFor({ state: 'visible', timeout: 5000 });
  await productCards.first().click();
  await page.waitForTimeout(500);

  // Take screenshot of Rental Product Detail Modal
  await page.screenshot({ path: path.join(screenshotsDir, '01_rental_detail_modal.png') });

  // Select 7 days
  console.log('Selecting 7 days rental...');
  await page.locator('button').filter({ hasText: '7일' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotsDir, '02_rental_7days_calculated.png') });

  // Click 7일 렌탈 예약하기
  await page.locator('button').filter({ hasText: '7일 렌탈 예약하기' }).click();
  await page.waitForTimeout(500);

  console.log('2. Testing Sell Consignment Flow...');
  // Go to 내 상품 판매
  await page.locator('nav.shop-bottom-nav button').filter({ hasText: '내 상품 판매' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '03_sell_brand_selection.png') });

  // Select 루이비통
  await page.locator('button').filter({ hasText: '루이비통' }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '04_sell_step1_category.png') });

  // Step 1: Click 다음
  await page.locator('button').filter({ hasText: '다음: 상태 및 구성품 확인' }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '05_sell_step2_condition.png') });

  // Step 2: Click 예상 견적 확인 및 신청하기
  await page.locator('button').filter({ hasText: '예상 견적 확인 및 신청하기' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '06_sell_step3_complete.png') });

  await context.close();
  await browser.close();

  console.log(`[SUCCESS] Verified Phase 27 workflows and captured screenshots in ${screenshotsDir}`);
}

verifyPhase27Flows().catch(err => {
  console.error('[ERROR] Failed Phase 27 flow verification:', err);
  process.exit(1);
});
