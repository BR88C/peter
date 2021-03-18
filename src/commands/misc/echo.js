const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `echo`,
    description: `Says a custom message`,
    args: true,
    devOnly: true,
    hide: true,
    usage: `<message>`,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const customMessage = args.slice(0).join(` `);
        await message.delete().catch((error) => log(error, `red`));
        return message.channel.send(customMessage);
    }
};
