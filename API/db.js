require('dotenv').config({ path: '../.env' });
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Verifique seu arquivo .env ou as variáveis de ambiente do Docker Compose.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Para uso local, não use SSL
});

module.exports = pool;
