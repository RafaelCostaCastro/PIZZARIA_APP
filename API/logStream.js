const { Logtail } = require("@logtail/node");

const logtail = new Logtail(process.env.LOGTAIL_TOKEN, {
  endpoint: "https://s1364135.eu-nbg-2.betterstackdata.com" 
});

// Stream para Morgan ou outros usos
const logStream = {
  write: (message) => logtail.info(message.trim())
};

module.exports = { logtail, logStream };
