const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `vote`,
    description: `Returns Peter's vote link`,
    aliases: [`votelink`],

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const voteEmbed = new Discord.MessageEmbed()
            .setColor(0xaca6ff)
            .setTitle(`Peter's Vote link:`)
            .setDescription(client.config.links.voteLink);

        return message.channel.send(voteEmbed);
    }
};
