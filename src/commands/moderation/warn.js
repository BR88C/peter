const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `warn`,
    description: `Warn a specified user`,
    args: true,
    guildOnly: true,
    usage: `<@user> [reason]`,
    async execute (client, message, args) {
        // Check if user can warn
        const author = await message.guild.members.fetch(message.author.id, false);
        if (!author.hasPermission('MANAGE_MESSAGES')) return message.reply(`you don't have permission to warn! (Manage messages permission required)`);

        // Set up reason and user
        let warnReason;
        if (args.slice(1).join(' ')) {
            warnReason = args.slice(1).join(' ');
        } else {
            warnReason = `No reason specified`;
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply(`please specify a user to warn!`);

        // Create embeds
        let warnEmbed = new Discord.MessageEmbed()
            .setColor(0xffd000)
            .setTitle(`**You have been warned in ${message.guild.name}!**`)
            .setDescription(`Reason: ${warnReason}`);

        let logWarnEmbed = new Discord.MessageEmbed()
            .setColor(0xffd000)
            .setTitle(`**${user.tag} has been warned**`)
            .setDescription(`Reason: ${warnReason}`);

        // Send the embeds and warn the user
        log(`${user.tag} warned for ${warnReason}`, `yellow`, message, { server: true, regex: true });
        await user.send(warnEmbed).catch(error => {});
        return message.channel.send(logWarnEmbed);
    },
}