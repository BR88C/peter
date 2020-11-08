const Discord = require(`discord.js`);

module.exports = {
	name: `warn`,
	description: `Warn a specified user`,
	args: true,
	guildOnly: true,
	usage: `[@user] [reason]`,
	async execute(client, message, args) {
        // Check if user can warn
        if(!message.guild.member(message.author).hasPermission('MANAGE_MESSAGES')) {
            return message.reply(`you don't have permission to warn! (Manage messages permission required)`);
        }

        // Set up reason and user
        var warnReason;
        if(args.slice(1).join(' ')) {
            warnReason = args.slice(1).join(' ');
        } else {
            warnReason = `No reason specified`;
        }
        const user = message.mentions.users.first();
        if(!user) {
            return message.reply(`please specify a user to warn!`);
        }

        // Create embeds
        let warnEmbed = new Discord.MessageEmbed()
		    .setColor(0xffd000)
		    .setTitle(`**You have been warned in ${message.guild.name}!**`)
            .setDescription(`Reason: ${warnReason}`)
        
        let logWarnEmbed = new Discord.MessageEmbed()
		    .setColor(0xffd000)
		    .setTitle(`**${user.tag} has been warned**`)
            .setDescription(`Reason: ${warnReason}`)

        // Send the embeds and warn the user
        console.log(`\x1b[33m`, `${user.tag} warned for ${warnReason}`);
        await user.send(warnEmbed).catch(error=>{});
        message.channel.send(logWarnEmbed);
	},
}