const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'luxury_rental',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 연결 테스트
pool.getConnection((err, connection) => {
  if (err) {
    console.warn('⚠️  MySQL 연결 대기 중 (DB 서버 상태 확인 필요):', err.message);
  } else {
    console.log('✅ MySQL 연결 성공:', process.env.DB_NAME || 'luxury_rental');
    connection.release();
  }
});

module.exports = pool.promise();
