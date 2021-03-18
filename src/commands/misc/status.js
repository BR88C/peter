const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `status`,
    description: `Sets the bot's status`,
    args: true,
    devOnly: true,
    hide: true,
    usage: `<statusType> <content>`,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const availableTypes = [`PLAYING`, `STREAMING`, `LISTENING`, `WATCHING`, `COMPETING`];

        const statusType = args[0].toUpperCase();
        if (!availableTypes.includes(statusType)) return message.channel.send(`Error: invalid status type`);

        const content = args.slice(1).join(` `);

        await client.user.setActivity(content, {
            type: statusType
        });
        return message.channel.send(`Status successfully updated.`);
    }
};
