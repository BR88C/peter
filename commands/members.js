const Discord = require(`discord.js`);

module.exports = {
	name: `members`,
	description: `Lists the number of members in your server.`,
	guildOnly: true,
	cooldown: 0,
	aliases: [`users`],
	async execute(client, message, args) {
		let memberEmbed = new Discord.MessageEmbed()
			.setColor(0xacecb6)
			.setAuthor(`Guild Member Information`)
			.setTitle(`**Total Guild Members**`)
			.setDescription(message.guild.memberCount)

		message.channel.send(memberEmbed);
	},
}