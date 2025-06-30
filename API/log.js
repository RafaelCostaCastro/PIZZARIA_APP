const { Logtail } = require("@logtail/node");

const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

module.exports = logtail;
