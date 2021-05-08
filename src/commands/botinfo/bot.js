const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const createTimestamp = require(`../../utils/createTimestamp.js`);

module.exports = {
    name: `bot`,
    description: `Displays information about the bot`,
    aliases: [`about`, `peter`],

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const uptime = createTimestamp(Math.round(client.uptime / 1e3));

        const botInfoEmbed = new Discord.MessageEmbed()
            .setColor(0xffd87d)
            .setTitle(`Information about Peter!`)
            .setThumbnail(client.user.avatarURL({
                dynamic: true, size: 256
            }))
            .addFields({
                name: `**Tag**`,
                value: client.user.tag,
                inline: true
            }, {
                name: `**Number of Commands**`,
                value: client.commands.size,
                inline: true
            }, {
                name: `**Prefix**`,
                value: client.config.prefix,
                inline: true
            }, {
                name: `**Author**`,
                value: client.config.devs.tags.join(`, `),
                inline: true
            }, {
                name: `**Ping**`,
                value: `${Math.round(100 * client.ws.ping) / 100}ms`,
                inline: true
            }, {
                name: `**Uptime**`,
                value: uptime,
                inline: true
            }, {
                name: `**Support Server**`,
                value: client.config.links.supportServer,
                inline: true
            }, {
                name: `**Website**`,
                value: client.config.links.website,
                inline: true
            }, {
                name: `**Version**`,
                value: client.pjson.version,
                inline: true
            });

        return message.channel.send(botInfoEmbed);
    }
};
