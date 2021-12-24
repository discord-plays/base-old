// Load .env file
// Its not at the top of bot.js, fuck you! 😋🤡
require('dotenv').config();
module.exports = process.env.DEBUG == "yes";
