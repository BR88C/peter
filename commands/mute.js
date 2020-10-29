const Discord = require(`discord.js`);

module.exports = {
	name: `mute`,
	description: `Mute a specified user`,
	args: true,
	guildOnly: true,
	hide: true,
	usage: `[@user] [reason]`,
	async execute(client, message, args) {
        // Check if user can mute
        if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) {
            return message.reply(`you don\'t have permission to mute!`)
        }

        // Set up mute role, reason and user
        var mutedRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");
        if(args.slice(1).join(' ')) {
            var muteReason = args.slice(1).join(' ');
        } else {
            var muteReason = `No reason specified`;
        }
        var user = message.mentions.users.first();
        if(!user) {
            message.reply(`please specify a user to mute!`)
            return;
        }

        // Check if the specified user is already muted
        if(message.guild.member(user).roles.cache.has(mutedRole.id)) {
            message.reply(`that user is already muted!`)
            return;
        }

        // Checks to see if the message author is trying to be muted
        if(user === message.author) {
            return message.reply('you can\'t mute yourself!');
        }

        // Makes sure the bot can mute the user
        if(!message.guild.member(user).manageable) {
            return message.reply('I do not have sufficient permissions to mute this user!');
        }

        // Create embeds
        let mutedEmbed = new Discord.MessageEmbed()
		.setColor(0xffd000)
		.setTitle(`**You have been muted in ${message.guild.name}!**`)
        .setDescription(`Reason: ${muteReason}`)
        
        let logMutedEmbed = new Discord.MessageEmbed()
		.setColor(0xffd000)
		.setTitle(`**${user.tag} has been muted**`)
        .setDescription(`Reason: ${muteReason}`)

        // Send the embeds and mute the user
        console.log(`\x1b[33m`, `${user.tag} muted for ${muteReason}`)
        await user.send(mutedEmbed).catch(error=>{});
        await message.guild.member(user).roles.add(mutedRole);
        message.channel.send(logMutedEmbed)
	},
}