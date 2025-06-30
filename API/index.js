require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { logtail, logStream } = require('./logStream');
const { Pool } = require('pg'); // Alterado para pg
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express();

// Configuração do pool do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(bodyParser.json());

// Morgan configurado para usar o stream personalizado
app.use(morgan("combined", { stream: logStream }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         descricao:
 *           type: string
 *           example: Pizza Margherita
 *         status:
 *           type: string
 *           example: disponível
 */

// Helper para execução de queries
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 */
app.get('/produtos', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM "PIZZARIA_APP".produtos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Obtém um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
app.get('/produtos/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const result = await query('SELECT * FROM "PIZZARIA_APP".produtos WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: Pizza Portuguesa
 *               status:
 *                 type: string
 *                 example: disponível
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Descrição obrigatória
 */
app.post('/produtos', async (req, res, next) => {
  try {
    const { descricao, status } = req.body;
    if (!descricao) return res.status(400).json({ error: "Descrição obrigatória" });
    
    const result = await query(
      'INSERT INTO "PIZZARIA_APP".produtos (descricao, status) VALUES ($1, $2) RETURNING *',
      [descricao, status || 'disponível']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: Pizza Portuguesa
 *               status:
 *                 type: string
 *                 example: disponível
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
app.put('/produtos/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { descricao, status } = req.body;
    
    // Verifica se o produto existe
    const checkResult = await query('SELECT * FROM "PIZZARIA_APP".produtos WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    
    const result = await query(
      `UPDATE "PIZZARIA_APP".produtos 
       SET descricao = COALESCE($1, descricao),
           status = COALESCE($2, status)
       WHERE id = $3
       RETURNING *`,
      [descricao, status, id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
app.delete('/produtos/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    
    // Verifica se o produto existe
    const checkResult = await query('SELECT * FROM "PIZZARIA_APP".produtos WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    
    await query('DELETE FROM "PIZZARIA_APP".produtos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  // Log de erro no BetterStack
  logtail.error(`[${new Date().toISOString()}] Erro na requisição ${req.method} ${req.originalUrl}: ${err.message}`, {
    stack: err.stack,
    status: err.status || 500
  });
  
  console.error(`[${new Date().toISOString()}] Erro na requisição ${req.method} ${req.originalUrl}:`, err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API da Pizzaria rodando na porta ${PORT}`);
  // Log de inicialização
  logtail.info(`API da Pizzaria iniciada na porta ${PORT}`);
});

module.exports = app;
