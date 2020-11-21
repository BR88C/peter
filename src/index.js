/* Peter by BR88C */

/* Load Modules */
const Discord = require(`discord.js`);
const DBL = require("dblapi.js");
const dotenv = require(`dotenv`).config();
const loader = require(`./modules/loader.js`)
const log = require(`./modules/log.js`);
const end = require(`./modules/end.js`);

const client = new Discord.Client();
const dbl = new DBL(process.env.DBL_TOKEN, client);


/* Load all commands, events, and variables, then authenticate with Discord */
loader.loadAll(client);
client.login(process.env.BOT_TOKEN).catch(error => end(client, false, `Failed to authenticate client with application.`));


/* Report if there is an error with DBL */
dbl.on('error', error => log(`DBL API Warning: ${error}`, `yellow`));


/* If the Bot is Stopped with Ctrl+C */
process.on(`SIGINT`, () => end(client, true));