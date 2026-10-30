const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '../frontend/node_modules/playwright'));

async function capturePhase25Baseline() {
  const screenshotsDir = path.join(__dirname, 'PHASE_25_UX_AUDIT', 'screenshots');
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

  console.log('Capturing mobile customer views...');
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

  // Desktop Admin View
  console.log('Capturing admin desktop views...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const adminPage = await desktopContext.newPage();
  await adminPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(400);
  await adminPage.locator('button[aria-label="관리자 화면으로 이동"]').click();
  await adminPage.waitForTimeout(600);

  // 8. 관리자 구인/채용 대시보드 (기본 탭)
  await adminPage.screenshot({ path: path.join(screenshotsDir, '08_admin_recruit_dashboard.png') });

  // 9. 관리자 구인 요청 작성
  const reqTab = adminPage.locator('button').filter({ hasText: '신규 구인 요청 작성' });
  if (await reqTab.count() > 0) {
    await reqTab.click();
    await adminPage.waitForTimeout(500);
    await adminPage.screenshot({ path: path.join(screenshotsDir, '09_admin_recruit_request.png') });
  }

  // 10. 관리자 근무자 DB
  const workersTab = adminPage.locator('button').filter({ hasText: '근무자 DB' });
  if (await workersTab.count() > 0) {
    await workersTab.click();
    await adminPage.waitForTimeout(500);
    await adminPage.screenshot({ path: path.join(screenshotsDir, '10_admin_recruit_workers.png') });
  }

  // 11. 관리자 채팅 소통
  const chatTab = adminPage.locator('button').filter({ hasText: '실시간 소통' });
  if (await chatTab.count() > 0) {
    await chatTab.click();
    await adminPage.waitForTimeout(500);
    await adminPage.screenshot({ path: path.join(screenshotsDir, '11_admin_recruit_chat.png') });
  }

  // 12. 관리자 쇼핑몰 관리
  const shopTab = adminPage.locator('button').filter({ hasText: '쇼핑몰 관리' });
  if (await shopTab.count() > 0) {
    await shopTab.click();
    await adminPage.waitForTimeout(500);
    await adminPage.screenshot({ path: path.join(screenshotsDir, '12_admin_shop_products.png') });
  }

  await desktopContext.close();

  // Mobile Admin View (375x812)
  console.log('Capturing admin mobile responsive view...');
  const mobileAdminContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2
  });
  const mAdminPage = await mobileAdminContext.newPage();
  await mAdminPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mAdminPage.waitForTimeout(400);
  await mAdminPage.locator('button[aria-label="관리자 화면으로 이동"]').click();
  await mAdminPage.waitForTimeout(600);
  await mAdminPage.screenshot({ path: path.join(screenshotsDir, '13_admin_mobile_responsive.png') });

  await mobileAdminContext.close();
  await browser.close();

  console.log(`[SUCCESS] Captured 13 baseline screenshots in ${screenshotsDir}`);
}

capturePhase25Baseline().catch(err => {
  console.error('[ERROR] Failed to capture baseline:', err);
  process.exit(1);
});
