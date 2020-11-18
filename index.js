/* Peter by BR88C */

/* Load Modules and Config */
const Discord = require(`discord.js`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();
const config = require(`./config.json`);
const pjson = require(`./package.json`);
const DBL = require("dblapi.js");
const log = require(`./utils/log.js`);

const client = new Discord.Client();
const dbl = new DBL(process.env.DBL_TOKEN, client);
client.queue = new Map();
client.config = new Map(Object.entries(config));
client.pjson = new Map(Object.entries(pjson));



/* Load events */
const eventFiles = fs.readdirSync(`./events`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
eventFiles.forEach(file => {
   	const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    log(`Loaded event ${eventName}`, `yellow`);
   	client.on(eventName, event.bind(null, client));
});



/* Load commands */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
commandFiles.forEach(file => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	log(`Loaded command ${command.name}`, `yellow`);
})



/* Authenticate the bot with client */
client.login(process.env.BOT_TOKEN).catch(error => {
    log(`\nFailed to authenticate client with application.`, `red`)
    log(``, `white`);
    process.exit();
});



/* Post server count on top.gg */
dbl.on('posted', () => {})
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