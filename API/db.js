const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Testar conexão ao iniciar
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Banco de dados conectado com sucesso!'))
  .catch(err => {
    console.error('❌ Falha na conexão com o banco:', err.message);
    process.exit(1); // Força saída se o banco não estiver acessível
  });
