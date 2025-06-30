const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API da Pizzaria',
      version: '1.0.0',
      description: 'Documentação dos endpoints da pizzaria',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' }
    ],
  },
  apis: [path.join(__dirname, 'index.js')], // <-- CORRETO PARA SUA NOVA ESTRUTURA!
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
