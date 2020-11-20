/* Peter by BR88C */

/* Load Modules */
const Discord = require(`discord.js`);
const DBL = require("dblapi.js");
const dotenv = require(`dotenv`).config();
const loader = require(`./modules/loader.js`)
const log = require(`./modules/log.js`);

const client = new Discord.Client();
const dbl = new DBL(process.env.DBL_TOKEN, client);


/* Load all commands, events, and variables, then authenticate with Discord */
loader.loadAll(client);
client.login(process.env.BOT_TOKEN).catch(error => {
    log(`\nFailed to authenticate client with application.`, `red`)
    log(``, `white`);
    process.exit();
});


/* Report if there is an error with DBL */
dbl.on('error', error => {
    log(`Error with DBL API: ${error}`, `red`);
})


/* If the Bot is Stopped with Ctrl+C */
process.on(`SIGINT`, () => {
    client.user.setPresence({activity: {name: `Restarting Bot`, type: 'PLAYING'}, status: 'dnd'}).then(() => {
        log(`\nStopped. Bot Offline.`, `red`);
        log(``, `white`);
        process.exit();
    }).catch(console.error)
});