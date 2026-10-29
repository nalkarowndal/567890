const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 헬스체크 라우트
app.get('/', (req, res) => {
  res.json({ message: 'LuxuryRental 백엔드 서버가 정상 실행 중입니다.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 상품 목록 예시 라우트
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('상품 목록 조회 오류:', error.message);
    res.status(500).json({ message: '데이터베이스 조회 중 오류가 발생했습니다.', error: error.message });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 포트 ${PORT}에서 실행 중입니다: http://localhost:${PORT}`);
});
