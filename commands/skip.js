const Discord = require(`discord.js`);
const log = require(`../utils/log.js`);

module.exports = {
	name: `skip`,
	description: `Skips the current song.`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		// Checks if user is in a vc
		if(!channel) return message.channel.send(`I'm sorry but you need to be in a voice channel to play music!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		// If the queue is empty reply with an error
		if(!serverQueue) return message.channel.send(`There is nothing playing that I could skip for you.`);
		
		// Skips to the next song
		serverQueue.connection.dispatcher.end();

		let skipEmbed = new Discord.MessageEmbed()
			.setColor(0x9cd6ff)
			.setTitle(`⏭️ The current song has been skipped.`);

		message.channel.send(skipEmbed);
	},
}