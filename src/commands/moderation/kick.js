const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `kick`,
    description: `Kick a specified user`,
    args: true,
    guildOnly: true,
    usage: `<@user> [reason]`,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        // Check if user can kick
        const author = await message.guild.members.fetch(message.author.id, false);
        if (!author.hasPermission(`KICK_MEMBERS`)) return message.reply(`you don't have permission to kick!`);

        // Set up kick reason and user
        let kickReason;
        if (args.slice(1).join(` `)) {
            kickReason = args.slice(1).join(` `);
        } else {
            kickReason = `No reason specified`;
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply(`please specify a user to kick!`);

        const userGuildMember = await message.guild.members.fetch(message.mentions.users.first().id, false);

        // Checks to see if the message author is trying to be kicked
        if (user === message.author) return message.reply(`you can't kick yourself!`);

        // Makes sure the bot can kick the user
        if (!userGuildMember.kickable) return message.reply(`I do not have sufficient permissions to kick this user!`);

        // Create embeds
        let kickedEmbed = new Discord.MessageEmbed()
            .setColor(0xdb1226)
            .setTitle(`**You have been kicked from ${message.guild.name}!**`)
            .setDescription(`Reason: ${kickReason}`);

        let logKickedEmbed = new Discord.MessageEmbed()
            .setColor(0xdb1226)
            .setTitle(`**${user.tag} has been kicked**`)
            .setDescription(`Reason: ${kickReason}`);

        // Send the embeds and kick the user
        log(`${user.tag} kicked for ${kickReason}`, `red`, message, { server: true, regex: true });
        await user.send(kickedEmbed).catch((error) => log(error, `red`));
        await userGuildMember.kick({ reason: kickReason });
        return message.channel.send(logKickedEmbed);
    }
};
