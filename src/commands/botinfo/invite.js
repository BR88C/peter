const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `invite`,
    description: `Returns Peter's invite link`,
    aliases: [`invitelink`, `addbot`],

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const inviteEmbed = new Discord.MessageEmbed()
            .setColor(0x5eff97)
            .setTitle(`Peter's Invite link:`)
            .setDescription(client.config.links.invite);

        return message.channel.send(inviteEmbed);
    }
};
