/* Load Modules and Config */
const Discord = require(`discord.js`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();
const config = require(`./config.json`);
const pjson = require(`./package.json`);

const token = process.env.BOT_TOKEN;
const client = new Discord.Client();
client.queue = new Map();
client.config = new Map(Object.entries(config));
client.pjson = new Map(Object.entries(pjson));



/* Load events */
const eventFiles = fs.readdirSync(`./events`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
eventFiles.forEach(file => {
   	const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`\x1b[33m`, `Loaded event ${eventName}`)   
   	client.on(eventName, event.bind(null, client));
});



/* Load commands */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
commandFiles.forEach(file => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.log(`\x1b[33m`, `Loaded command ${command.name}`);
})



/* Authenticate the bot with client */
client.login(token).catch(err => console.error(`Failed to authenticate client with application.`));



/* If the Bot is Stopped with Ctrl+C */
process.on(`SIGINT`, () => {
    client.user.setPresence({activity: {name: `Restarting Bot`, type: 'PLAYING'}, status: 'dnd'}).then(() => {
        console.log(`\x1b[31m`, `\nStopped. Bot Offline.`);
        console.log(`\x1b[37m`);
        process.exit();
    }).catch(console.error)
});