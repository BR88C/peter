const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);

module.exports = {
    name: `members`,
    description: `Lists the number of members in your server`,
    category: `Utility`,
    guildOnly: true,
    aliases: [`users`],
    async execute (client, message, args) {
        let memberEmbed = new Discord.MessageEmbed()
            .setColor(0xacecb6)
            .setTitle(`**Total Guild Members:**`)
            .setDescription(await message.guild.memberCount);

        return message.channel.send(memberEmbed);
    },
}