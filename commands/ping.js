const Discord = require(`discord.js`);

module.exports = {
	name: 'ping',
	description: 'Shows ping in Milliseconds.',
	guildOnly: true,
	cooldown: 3,
	async execute(client, message, args) {
		// Grabs ping
		actualping = client.ws.ping;

		// Rounds ping to nearest hundreth
		ping = Math.round(100*actualping)/100;

		// Creates and sends the embed
		let pingEmbed = new Discord.MessageEmbed()
			.setColor(0x2100db)
			.setAuthor(`Pong!`)
			.setDescription(`\`\`` + ping + `ms\`\``)
		message.channel.send(pingEmbed);
	},
}