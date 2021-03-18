const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `members`,
    description: `Lists the number of members in your server`,
    guildOnly: true,
    aliases: [`users`],

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        let memberEmbed = new Discord.MessageEmbed()
            .setColor(0xacecb6)
            .setTitle(`**Total Guild Members:**`)
            .setDescription(await message.guild.memberCount);

        return message.channel.send(memberEmbed);
    }
};
