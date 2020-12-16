const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `ban`,
    description: `Ban a specified user`,
    args: true,
    guildOnly: true,
    usage: `<@user> [reason]`,
    async execute (client, message, args) {
        // Check if user can ban
        const author = await message.guild.members.fetch(message.author.id, false);
        if (!author.hasPermission('BAN_MEMBERS')) return message.reply(`you don't have permission to ban!`);

        // Set up ban reason and user
        let banReason;
        if (args.slice(1).join(' ')) {
            banReason = args.slice(1).join(' ');
        } else {
            banReason = `No reason specified`;
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply(`please specify a user to ban!`);

        const userGuildMember = await message.guild.members.fetch(message.mentions.users.first().id, false);

        // Checks to see if the message author is trying to be banned
        if (user === message.author) return message.reply(`you can't ban yourself!`);

        // Makes sure the bot can ban the user
        if (!userGuildMember.bannable) return message.reply(`I do not have sufficient permissions to ban this user!`);

        // Create embeds
        let bannedEmbed = new Discord.MessageEmbed()
            .setColor(0xdb1226)
            .setTitle(`**You have been banned from ${message.guild.name}!**`)
            .setDescription(`Reason: ${banReason}`);

        let logBannedEmbed = new Discord.MessageEmbed()
            .setColor(0xdb1226)
            .setTitle(`**${user.tag} has been banned**`)
            .setDescription(`Reason: ${banReason}`);

        // Send the embeds and ban the user
        log(`${user.tag} banned for ${banReason}`, `red`, message, { server: true, regex: true });
        await user.send(bannedEmbed).catch(error => {});
        await userGuildMember.ban({ reason: banReason });
        return message.channel.send(logBannedEmbed);
    },
}