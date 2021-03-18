const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: ``,
    description: ``,
    args: false,
    guildOnly: false,
    voteLocked: false,
    devOnly: false,
    hide: false,
    aliases: [],
    usage: ``,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {}
};
