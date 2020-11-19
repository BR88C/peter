const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: 'ping',
	description: 'Shows ping in Milliseconds.',
	category: `Bot Info`,
	async execute(client, message, args) {
		// Get ping
		ping = Math.round(100*client.ws.ping)/100;

		// Creates and sends the embed
		let pingEmbed = new Discord.MessageEmbed()
			.setColor(0x2100db)
			.setAuthor(`Pong!`)
			.setDescription(`\`\`` + ping + `ms\`\``);
			
		message.channel.send(pingEmbed);
	},
}