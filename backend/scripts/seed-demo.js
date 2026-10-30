const db = require('../db');
const items = [
 ['샤넬','클래식 플랩 숄더백','RENT',49000], ['디올','레이디 스타일 미니 토트백','RENT',39000],
 ['생로랑','블랙 레더 호보백','RENT',22000], ['셀린느','트리오페 크로스백','RENT',29000],
 ['루이비통','모노그램 토트백','RENT',35000], ['구찌','홀스빗 숄더백','RENT',27000],
 ['프라다','나일론 미니백','BUY',890000], ['발렌시아가','시티 스몰 숄더백','BUY',1250000],
 ['보테가 베네타','위빙 카드지갑','BUY',320000], ['에르메스','실크 스카프','RENT',12000],
 ['까르띠에','클래식 스타일 시계','RENT',45000], ['불가리','펜던트 목걸이','RENT',19000]
];
async function seed() {
 const connection = await db.getConnection();
 try {
  await connection.beginTransaction();
  let added = 0;
  for (const [brand, name, type, price] of items) {
   const title = `[데모] ${name}`;
   const [existing] = await connection.execute('SELECT id FROM products WHERE brand = ? AND title = ? LIMIT 1', [brand, title]);
   if (!existing.length) {
    await connection.execute('INSERT INTO products (brand, title, type, price) VALUES (?, ?, ?, ?)', [brand, title, type, price]);
    added++;
   }
  }
  await connection.commit();
  console.log(`데모 상품 ${added}개 추가 (렌트 가격은 1일 기준, 실제 판매 상품 아님)`);
 } catch (error) { await connection.rollback(); throw error; }
 finally { connection.release(); await db.end(); }
}
seed().catch(error => { console.error(error.message); process.exitCode = 1; });
