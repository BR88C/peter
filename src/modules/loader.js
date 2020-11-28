/* Loads commands, events, and variables */

const Discord = require(`discord.js`);
const fs = require(`fs`);
const DBL = require("dblapi.js");
const log = require(`./log.js`);

module.exports = {
    /* Load variables and save on client */
    async loadVariables (client) {
        client.dbl = new DBL(process.env.DBL_TOKEN, client);
        client.queue = new Map();
        client.config = require(`../config.json`);
        client.pjson = require(`../../package.json`);
    },

    /* Load events */
    async loadEvents (client) {
        const eventFiles = fs.readdirSync(`./src/events`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
        eventFiles.forEach(file => {
            const event = require(`../events/${file}`);
            let eventName = file.split(".")[0];
            log(`Loaded event ${eventName}`, `yellow`);
            client.on(eventName, event.bind(null, client));
        });
    },

    /* Load commands */
    async loadCommands (client) {
        client.commands = new Discord.Collection();
        const commandFiles = fs.readdirSync(`./src/commands`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
        commandFiles.forEach(file => {
	        const command = require(`../commands/${file}`);
	        client.commands.set(command.name, command);
	        log(`Loaded command ${command.name}`, `yellow`);
        });
    },

    /* Run all methods */
    async loadAll (client) {
        await this.loadVariables(client);
        await this.loadEvents(client);
        await this.loadCommands(client);
    }
}