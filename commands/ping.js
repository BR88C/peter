const Discord = require(`discord.js`)

module.exports = {
	name: 'ping',
	description: 'Shows ping in Milliseconds!',
	guildOnly: true,
	cooldown: 3,
	async execute(client, message, args) {
		actualping = client.ws.ping
		ping = Math.round(100*actualping)/100;
		let pingEmbed = new Discord.MessageEmbed()
			.setColor(0x2100db)
			.setAuthor(`Pong!`)
			.setDescription(`\`\`` + ping + `ms\`\``)
		message.channel.send(pingEmbed)
	},
};