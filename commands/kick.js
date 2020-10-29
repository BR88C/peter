const Discord = require(`discord.js`);

module.exports = {
	name: `kick`,
	description: `Kick a specified user`,
	args: true,
	guildOnly: true,
	usage: `[@user] [reason]`,
	async execute(client, message, args) {
        // Check if user can kick
        if(!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) {
            return message.reply(`you don't have permission to kick!`)
        }

        // Set up kick reason and user
        if(args.slice(1).join(' ')) {
            var kickReason = args.slice(1).join(' ');
        } else {
            var kickReason = `No reason specified`;
        }
        var user = message.mentions.users.first();
        if(!user) {
            message.reply(`please specify a user to kick!`)
            return;
        }

        // Checks to see if the message author is trying to be kicked
        if(user === message.author) {
            return message.reply('you can\'t kick yourself!');
        }

        // Makes sure the bot can kick the user
        if(!message.guild.member(user).kickable) {
            return message.reply('I do not have sufficient permissions to kick this user!');
        }

        // Create embeds
        let kickedEmbed = new Discord.MessageEmbed()
		.setColor(0xdb1226)
		.setTitle(`**You have been kicked from ${message.guild.name}!**`)
        .setDescription(`Reason: ${kickReason}`)
        
        let logKickedEmbed = new Discord.MessageEmbed()
		.setColor(0xdb1226)
		.setTitle(`**${user.tag} has been kicked**`)
        .setDescription(`Reason: ${kickReason}`)

        // Send the embeds and kick the user
        console.log(`\x1b[31m`, `${user.tag} kicked for ${kickReason}`)
        await user.send(kickedEmbed).catch(error=>{});
        await message.guild.member(user).kick({ reason: kickReason });
        message.channel.send(logKickedEmbed)
	},
}