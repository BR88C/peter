const Discord = require(`discord.js`);

module.exports = {
	name: `play`,
	description: `Plays a song in a vc.`,
	args: true,
	guildOnly: true,
	cooldown: 3,
	aliases: [`p`],
	usage: `[search query] or [url]`,
	async execute(client, message, args) {

	},
};