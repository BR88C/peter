/* Catch Client Warns */

const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);

module.exports = (client, info) => log(info, `red`);
