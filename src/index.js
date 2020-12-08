/* Peter by BR88C */

/* Load Modules */
const Discord = require(`discord.js-light`);
const dotenv = require(`dotenv`).config();
const loader = require(`./modules/loader.js`)
const log = require(`./modules/log.js`);
const end = require(`./modules/end.js`);

const client = new Discord.Client({
    cacheChannels: false,
    cacheGuilds: true,
    cachePresences: false,
    cacheRoles: true,
    cacheOverwrites: false,
    cacheEmojis: false,
    disabledEvents: [],
    messageEditHistoryMaxSize: 1
});


/* Load all commands, events, and variables, then authenticate with Discord */
loader.loadAll(client);
client.login(process.env.BOT_TOKEN).catch(error => end(client, false, `Failed to authenticate client with application.`));


/* Report if there is an error with DBL */
client.dbl.on('error', error => log(`DBL API Warning: ${error}`, `yellow`));


/* If the Bot is Stopped with Ctrl+C */
process.on('SIGINT', () => end(client, true));