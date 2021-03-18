const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `unmute`,
    description: `Unmute a specified user`,
    args: true,
    guildOnly: true,
    usage: `<@user>`,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        // Check if user can mute.
        const author = await message.guild.members.fetch(message.author.id, false);
        if (!author.hasPermission(`MANAGE_ROLES`)) return message.reply(`you don't have permission to unmute! (Manage roles permission required)`);

        // Set up mute role and user.
        const mutedRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === `muted`);
        const user = message.mentions.users.first();
        if (!user) return message.reply(`please specify a user to unmute!`);

        const userGuildMember = await message.guild.members.fetch(message.mentions.users.first().id, false);

        // Checks if the muted role exists.
        if (!mutedRole) return message.reply(`I can't unmute users if a muted role does not exist! Please make sure you have a role called "Muted" to use this command!`);

        // Check if the specified user is already muted.
        if (!userGuildMember.roles.cache.has(mutedRole.id)) return message.reply(`that user isn't muted!`);

        // Makes sure the bot can unmute the user.
        if (!userGuildMember.manageable) return message.reply(`I do not have sufficient permissions to unmute this user!`);

        // Create embeds.
        const unmutedEmbed = new Discord.MessageEmbed()
            .setColor(0x57ff5c)
            .setTitle(`**You have been unmuted in ${message.guild.name}!**`);

        const logUnmutedEmbed = new Discord.MessageEmbed()
            .setColor(0x57ff5c)
            .setTitle(`**${user.tag} has been unmuted**`);

        // Send the embeds and mute the user.
        log(`${user.tag} unmuted`, `green`, message, { server: true, regex: true });
        await user.send(unmutedEmbed).catch((error) => log(error, `red`));
        await userGuildMember.roles.remove(mutedRole);
        return message.channel.send(logUnmutedEmbed);
    }
};
