const db = require('../db');
async function main() {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS products (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      brand VARCHAR(120) NOT NULL DEFAULT '',
      type ENUM('RENT', 'BUY') NOT NULL DEFAULT 'RENT',
      price DECIMAL(12, 2) UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('상품 테이블 준비 완료 (기존 데이터 유지)');
  } finally { await db.end(); }
}
main().catch(error => { console.error('DB 초기화 실패:', error.message); process.exitCode = 1; });
