const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '../frontend/node_modules/playwright'));

async function capturePhase26After() {
  const screenshotsDir = path.join(__dirname, 'PHASE_26_CUSTOMER_UI', 'after');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const mobileContext = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2
  });

  const page = await mobileContext.newPage();

  console.log('Capturing polished customer views for Phase 26 after...');
  // 1. 고객용 메인 페이지 상단
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotsDir, '01_main_page_top.png') });

  // 2. 고객용 메인 페이지 스크롤 (카탈로그 & 배너)
  await page.evaluate(() => {
    const el = document.querySelector('.overflow-y-auto');
    if (el) el.scrollTop = 450;
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '02_main_page_scrolled.png') });

  // 3. 카테고리 화면
  await page.locator('nav.shop-bottom-nav button').filter({ hasText: '카테고리' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '03_category_page.png') });

  // 4. 브랜드 탐색 화면
  await page.locator('button').filter({ hasText: '브랜드' }).first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '04_brand_page.png') });

  // 5. 내 상품 판매 화면
  await page.locator('nav.shop-bottom-nav button').filter({ hasText: '내 상품 판매' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '05_sell_brand_page.png') });

  // 6. 상품 검색 화면
  await page.locator('nav.shop-bottom-nav button').filter({ hasText: '홈' }).click();
  await page.waitForTimeout(400);
  await page.locator('button[aria-label="상품 검색 열기"]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '06_search_overlay.png') });

  // 7. 로그인 화면
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await page.locator('button').filter({ hasText: '간편 로그인하기' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '07_login_overlay.png') });

  await mobileContext.close();
  await browser.close();

  console.log(`[SUCCESS] Captured 7 polished customer screenshots in ${screenshotsDir}`);
}

capturePhase26After().catch(err => {
  console.error('[ERROR] Failed to capture Phase 26 after screenshots:', err);
  process.exit(1);
});
