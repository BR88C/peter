const Discord = require(`discord.js`);

module.exports = {
	name: `ban`,
    description: `Ban a specified user`,
    category: `Moderation`,
	args: true,
	guildOnly: true,
	usage: `[@user] [reason]`,
	async execute(client, message, args) {
        // Check if user can ban
        if(!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
            return message.reply(`you don't have permission to ban!`);
        }

        // Set up ban reason and user
        var banReason;
        if(args.slice(1).join(' ')) {
            banReason = args.slice(1).join(' ');
        } else {
            banReason = `No reason specified`;
        }
        const user = message.mentions.users.first();
        if(!user) {
            return message.reply(`please specify a user to ban!`);
        }

        // Checks to see if the message author is trying to be banned
        if(user === message.author) {
            return message.reply(`you can't ban yourself!`);
        }

        // Makes sure the bot can ban the user
        if(!message.guild.member(user).bannable) {
            return message.reply(`I do not have sufficient permissions to ban this user!`);
        }

        // Create embeds
        let bannedEmbed = new Discord.MessageEmbed()
		    .setColor(0xdb1226)
		    .setTitle(`**You have been banned from ${message.guild.name}!**`)
            .setDescription(`Reason: ${banReason}`)
        
        let logBannedEmbed = new Discord.MessageEmbed()
		    .setColor(0xdb1226)
		    .setTitle(`**${user.tag} has been banned**`)
            .setDescription(`Reason: ${banReason}`)

        // Send the embeds and ban the user
        console.log(`\x1b[31m`, `${user.tag} banned for ${banReason} in ${message.guild.name}`);
        await user.send(bannedEmbed).catch(error=>{});
        await message.guild.member(user).ban({ reason: banReason });
        message.channel.send(logBannedEmbed);
	},
}