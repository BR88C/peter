const Discord = require(`discord.js`);

module.exports = {
	name: `ban`,
	description: `Ban a specified user`,
	args: true,
	guildOnly: true,
	hide: true,
	usage: `[@user] [reason]`,
	async execute(client, message, args) {
        // Check if user can ban
        if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) {
            return message.reply(`you don\'t have permission to ban!`)
        }

        // Set up ban reason and user
        if(args.slice(1).join(' ')) {
            var banReason = args.slice(1).join(' ');
        } else {
            var banReason = `No reason specified`;
        }
        var user = message.mentions.users.first();
        if(!user) {
            message.reply(`please specify a user to ban!`)
            return;
        }

        // Checks to see if the message author is trying to be banned
        if(user === message.author) {
            return message.reply('you can\'t ban yourself!');
        }

        // Makes sure the bot can ban the user
        if(!message.guild.member(user).bannable) {
            return message.reply('I do not have sufficient permissions to ban this user!');
        }

        // Create embeds
        let bannedEmbed = new Discord.MessageEmbed()
		.setColor(0xdb1226)
		.setTitle(`**You have been banned from the Carp Tank!**`)
        .setDescription(`Reason: ${banReason}`)
        
        let logBannedEmbed = new Discord.MessageEmbed()
		.setColor(0xdb1226)
		.setTitle(`**${user.tag} has been banned**`)
        .setDescription(`Reason: ${banReason}`)

        // Send the embeds and ban the user
        console.log(`\x1b[31m`, `${user.tag} banned for ${banReason}`)
        await user.send(bannedEmbed).catch(error=>{});
        await message.guild.member(user).ban({ reason: banReason });
        message.channel.send(logBannedEmbed)
        client.channels.cache.get(client.config.get('loggingChannel')).send(logBannedEmbed);
	},
}