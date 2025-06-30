// API/test-db.js
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    const result = await sql`SELECT NOW() as agora`;
    console.log('Conexão bem-sucedida com Neon! Horário do banco:', result[0].agora);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao conectar ao Neon:', err);
    process.exit(1);
  }
})();
