/* Catch Client Errors */

const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);

module.exports = (client, error) => log(error, `red`);
