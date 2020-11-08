const Discord = require(`discord.js`);

module.exports = {
	name: `unmute`,
	description: `Unmute a specified user`,
	args: true,
	guildOnly: true,
	usage: `[@user]`,
	async execute(client, message, args) {
        // Check if user can mute
        if(!message.guild.member(message.author).hasPermission('MANAGE_ROLES')) {
            return message.reply(`you don't have permission to unmute! (Manage roles permission required)`);
        }

        // Set up mute role and user
        const mutedRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted');
        const user = message.mentions.users.first();
        if(!user) {
            return message.reply(`please specify a user to unmute!`);
        }

        // Checks if the muted role exists
        if(!mutedRole) {
            return message.reply(`I can't unmute users if a muted role does not exist! Please make sure you have a role called "Muted" to use this command!`);
        }

        // Check if the specified user is already muted
        if(!message.guild.member(user).roles.cache.has(mutedRole.id)) {
            return message.reply(`that user isn't muted!`);
        }

        // Makes sure the bot can unmute the user
        if(!message.guild.member(user).manageable) {
            return message.reply(`I do not have sufficient permissions to unmute this user!`);
        }

        // Create embeds
        let unmutedEmbed = new Discord.MessageEmbed()
		    .setColor(0x57ff5c)
		    .setTitle(`**You have been unmuted in ${message.guild.name}!**`)
        
        let logUnmutedEmbed = new Discord.MessageEmbed()
		    .setColor(0x57ff5c)
		    .setTitle(`**${user.tag} has been unmuted**`)

        // Send the embeds and mute the user
        console.log(`\x1b[32m`, `${user.tag} unmuted in ${message.guild.name}`);
        await user.send(unmutedEmbed).catch(error=>{});
        await message.guild.member(user).roles.remove(mutedRole);
        message.channel.send(logUnmutedEmbed);
	},
}