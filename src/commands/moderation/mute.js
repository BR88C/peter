const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `mute`,
    description: `Mute a specified user`,
    args: true,
    guildOnly: true,
    usage: `<@user> [reason]`,
    async execute (client, message, args) {
        // Check if user can mute
        const author = await message.guild.members.fetch(message.author.id, false);
        if (!author.hasPermission('MANAGE_ROLES')) return message.reply(`you don't have permission to mute! (Manage roles permission required)`);

        // Set up mute role, reason and user
        const mutedRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted');
        let muteReason;
        if (args.slice(1).join(' ')) {
            muteReason = args.slice(1).join(' ');
        } else {
            muteReason = `No reason specified`;
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply(`please specify a user to mute!`);

        const userGuildMember = await message.guild.members.fetch(message.mentions.users.first().id, false);

        // Checks if the muted role exists
        if (!mutedRole) return message.reply(`I can't mute users if a muted role does not exist! Please make sure you have a role called "Muted" to use this command!`);

        // Check if the specified user is already muted
        if (userGuildMember.roles.cache.has(mutedRole.id)) return message.reply(`that user is already muted!`);

        // Checks to see if the message author is trying to be muted
        if (user === message.author) return message.reply(`you can't mute yourself!`);

        // Makes sure the bot can mute the user
        if (!userGuildMember.manageable) return message.reply(`I do not have sufficient permissions to mute this user!`);

        // Create embeds
        let mutedEmbed = new Discord.MessageEmbed()
            .setColor(0xffd000)
            .setTitle(`**You have been muted in ${message.guild.name}!**`)
            .setDescription(`Reason: ${muteReason}`);

        let logMutedEmbed = new Discord.MessageEmbed()
            .setColor(0xffd000)
            .setTitle(`**${user.tag} has been muted**`)
            .setDescription(`Reason: ${muteReason}`);

        // Send the embeds and mute the user
        log(`${user.tag} muted for ${muteReason}`, `yellow`, message, { server: true, regex: true });
        await user.send(mutedEmbed).catch((error) => log(error, `red`));
        await userGuildMember.roles.add(mutedRole);
        return message.channel.send(logMutedEmbed);
    },
}