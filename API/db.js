require('dotenv').config({ path: '../.env' });
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Verifique seu arquivo .env');
}

const sql = neon(process.env.DATABASE_URL);

module.exports = sql;
