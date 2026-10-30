const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '../frontend/node_modules/playwright'));

async function capturePhase30Baseline() {
  const screenshotsDir = path.join(__dirname, 'PHASE_30_ASSET_AUDIT', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  // Mobile Context
  const mobileContext = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2
  });

  const page = await mobileContext.newPage();

  console.log('[Phase 30] Capturing mobile baseline screenshots...');

  // 1. 고객용 메인 페이지 상단 (이모지 카드 👗, 👜, 🤝)
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotsDir, '01_main_cards_baseline.png') });
  console.log(' - Saved 01_main_cards_baseline.png');

  // 2. 고객용 메인 페이지 이벤트 배너 및 8-Grid 바로가기 (이모지 🎁 및 8개 이모지)
  await page.evaluate(() => {
    const el = document.querySelector('.overflow-y-auto');
    if (el) el.scrollTop = 220;
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '02_main_banner_and_shortcuts_baseline.png') });
  console.log(' - Saved 02_main_banner_and_shortcuts_baseline.png');

  // 3. 상품 카탈로그 (쇼핑백 아이콘 플레이스홀더)
  await page.evaluate(() => {
    const el = document.querySelector('.overflow-y-auto');
    if (el) el.scrollTop = 620;
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '03_catalog_placeholders_baseline.png') });
  console.log(' - Saved 03_catalog_placeholders_baseline.png');

  // 4. 상품 상세 모달 (빈 이미지 영역 및 쇼핑백 아이콘)
  const productCard = page.locator('[data-testid="product-card"]').first();
  if (await productCard.count() > 0) {
    await productCard.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '04_product_detail_modal_baseline.png') });
    console.log(' - Saved 04_product_detail_modal_baseline.png');
    // 모달 닫기
    await page.locator('button[aria-label="닫기"]').first().click();
    await page.waitForTimeout(300);
  }

  // 5. 카테고리 탭 (추천 카드 이모지 👞, 💍, 🧥)
  await page.locator('nav.shop-bottom-nav button').filter({ hasText: '카테고리' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '05_category_recommendations_baseline.png') });
  console.log(' - Saved 05_category_recommendations_baseline.png');

  // 6. 검색 오버레이 (쇼핑백 플레이스홀더 검색 결과)
  await page.locator('nav.shop-bottom-nav button').filter({ hasText: '홈' }).click();
  await page.waitForTimeout(300);
  await page.locator('button[aria-label="상품 검색 열기"]').click();
  await page.waitForTimeout(400);
  await page.locator('input[aria-label="브랜드 또는 상품 검색"]').fill('백');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '06_search_results_baseline.png') });
  console.log(' - Saved 06_search_results_baseline.png');

  // 검색 닫기
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // Desktop Context for Admin Dashboard
  const desktopContext = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1
  });
  const adminPage = await desktopContext.newPage();
  await adminPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(400);

  // 관리자 이동: 관리자 버튼 클릭 (헤더 설정 아이콘)
  await adminPage.locator('button[aria-label="관리자 화면으로 이동"]').click();
  await adminPage.waitForTimeout(600);

  // 쇼핑몰 상품 관리 탭 클릭
  await adminPage.locator('button').filter({ hasText: '쇼핑몰 관리' }).first().click();
  await adminPage.waitForTimeout(400);
  await adminPage.screenshot({ path: path.join(screenshotsDir, '07_admin_product_list_baseline.png') });
  console.log(' - Saved 07_admin_product_list_baseline.png');

  // 관리자 상품 등록 모달 열기
  await adminPage.locator('button').filter({ hasText: '신규 상품 등록' }).click();
  await adminPage.waitForTimeout(500);
  await adminPage.screenshot({ path: path.join(screenshotsDir, '08_admin_new_product_modal_baseline.png') });
  console.log(' - Saved 08_admin_new_product_modal_baseline.png');

  await browser.close();
  console.log('[Phase 30] Baseline capture completed successfully!');
}

capturePhase30Baseline().catch(err => {
  console.error('[Phase 30] Capture failed:', err);
  process.exit(1);
});
