const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `devstats`,
    description: `Gets stats about the bot`,
    devOnly: true,
    hide: true,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const guilds = client.guilds.cache;

        let totalUsers = 0;
        guilds.forEach((guild) => totalUsers += guild.memberCount);

        const statsEmbed = new Discord.MessageEmbed()
            .setTitle(`Bot stats`)
            .addFields({
                name: `Guilds`,
                value: guilds.size,
                inline: true
            }, {
                name: `Total Users`,
                value: totalUsers,
                inline: true
            })
            .setTimestamp();

        message.channel.send(statsEmbed);
    }
};
