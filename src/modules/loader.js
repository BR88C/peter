/* Loads commands, events, and variables */

const Discord = require(`discord.js-light`);
const fs = require(`fs`);
const config = require(`../config/config.js`);
const DBL = require(`dblapi.js`);
const log = require(`./log.js`);
const requestHeaders = require(`./requestHeaders.js`);
const logHeader = require(`../utils/logHeader.js`);

const loader = {
    /**
     * Initiates the DB
     *
     * @param {Object} client Client object.
     * @returns {Void} Void.
     */
    initDB: (client) => {
        
    },

    /**
     * Load variables and save on client.
     *
     * @param {Object} client Client object.
     * @returns {Void} Void.
     */
    loadVariables: (client) => {
        if (process.env.DBL_TOKEN) {
            client.dbl = new DBL(process.env.DBL_TOKEN, client);
            log(`Initialized DBL API!`, `green`);
        } else log(`No DBL token specified, stopped DBL API initialization.`, `yellow`);
        client.queue = new Map();
        client.config = config;
        client.pjson = require(`../../package.json`);
    },

    /**
     * Load events.
     *
     * @param {Object} client Client object.
     * @returns {Void} Void.
     */
    loadEvents: (client) => {
        const eventFiles = fs.readdirSync(`./src/events`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            const eventName = file.split(`.`)[0];
            log(`Loaded event ${eventName}.`, `yellow`);
            client.on(eventName, event.bind(null, client));
        }
        log(`Finished loading events!`, `green`);
    },

    /**
     * Load directories and commands.
     *
     * @param {Object} client Client object.
     * @returns {Void} Void.
     */
    loadCommands: (client) => {
        client.commands = new Discord.Collection();
        client.directories = new Discord.Collection();
        const dirConfigs = fs.readdirSync(`./src/config/cmddirectories`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
        for (const config of dirConfigs) {
            const directory = require(`../config/cmddirectories/${config}`);
            if (directory.ignore) continue;
            client.directories.set(directory.name, directory);
            log(`Loading directory "${directory.name}"...`, `cyan`);
            const cmdFiles = fs.readdirSync(`./src/commands/${directory.name}`).filter(file => file.endsWith(`.js`) && !file.startsWith(`_`));
            for (const file of cmdFiles) {
                const command = require(`../commands/${directory.name}/${file}`);
                command.directory = directory.name;
                client.commands.set(command.name, command);
                log(`Loaded command ${command.name}.`, `yellow`);
            }
        }
        log(`Finished loading commands!`, `green`);
    },

    /**
     * Starts the bot by running all loader methods.
     *
     * @param {Object} client Client object.
     * @returns {Void} Void.
     */
    start: (client) => {
        logHeader();
        // loader.initDB(client);
        loader.loadVariables(client);
        loader.loadEvents(client);
        loader.loadCommands(client);
        if (requestHeaders.checkHeaders()) log(`Request headers are properly defined!`, `green`);
    }
};

module.exports = loader;
