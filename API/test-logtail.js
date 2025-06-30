require('dotenv').config();
const { Logtail } = require("@logtail/node");

const logtail = new Logtail(process.env.LOGTAIL_TOKEN, {
  endpoint: "https://in.logs.betterstack.com" // Endpoint explícito
});

logtail.info("Teste de conexão com Better Stack")
  .then(() => console.log("Log enviado!"))
  .catch(err => console.error("Erro:", err));
