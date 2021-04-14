const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `ping`,
    description: `Shows ping in milliseconds`,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        // Get ping.
        const ping = Math.round(client.ws.ping);

        // Creates and sends the embed.
        const pingEmbed = new Discord.MessageEmbed()
            .setColor(0x2100db)
            .setTitle(`Pong!`)
            .setDescription(`\`\`\`${ping}ms\`\`\``);

        return message.channel.send(pingEmbed);
    }
};
