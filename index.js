/* Node Modules and Config */
const Discord = require(`discord.js`);
const fs = require(`fs`);
const dotenv = require(`dotenv`).config();
const GphApiClient = require('giphy-js-sdk-core');

const config = require(`./config.json`);
const pjson = require(`./package.json`);
const token = process.env.BOT_TOKEN;
const giphyToken = process.env.GIPHY_TOKEN;
const giphy = GphApiClient(giphyToken);
const client = new Discord.Client();
const ytdl = require(`ytdl-core`);
const yts = require(`yt-search`);

client.queue = new Map();
client.config = new Map(Object.entries(config));
client.pjson = new Map(Object.entries(pjson));



/* Load events */
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
    	const event = require(`./events/${file}`);
    	let eventName = file.split(".")[0];
    	client.on(eventName, event.bind(null, client));
    });
});



/* Load commands */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.log('\x1b[33m',`Loaded command ${command.name}`);
}



/* Authenticate the bot with client */
client.login(token).catch(err => console.error(`Failed to authenticate client with application.`));



/* If the Bot is Stopped with Ctrl+C */
process.on(`SIGINT`, () => {
    console.log(`\x1b[31m`, `\nStopped. Bot Offline.`);
    console.log(`\x1b[37m`);
    process.exit();
});