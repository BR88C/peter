const Discord = require(`discord.js`);

module.exports = {
	name: `members`,
	description: `Lists the number of members in your server.`,
	guildOnly: true,
	cooldown: 0,
	aliases: [`users`],
	async execute(client, message, args) {
		// Grabs needed variables
		var memberCount = message.guild.memberCount;
		var memberPeople = message.guild.members.cache.filter(member => !member.user.bot).size;
		var memberBot = message.guild.members.cache.filter(member => member.user.bot).size;
		var memberOnline = message.guild.members.cache.filter(member => member.presence.status === 'online' || member.presence.status === 'dnd').size;
		
		// Creates and sends the embed
		let memberEmbed = new Discord.MessageEmbed()
			.setColor(0xacecb6)
			.setAuthor(`Guild Member Information`)
			.setTitle(`**Total Guild Members**`)
			.setDescription(memberCount)
			.addFields(
				{ name: '**Total Bots:**', value: memberBot },
				{ name: '**Total People:**', value: memberPeople },
				{ name: '**Total Online:**', value: memberOnline },
			)
		message.channel.send(memberEmbed);
	},
}