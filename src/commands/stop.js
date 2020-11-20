const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `stop`,
	description: `Stops all music and clears the queue.`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		// Checks if user is in a vc
		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to stop music!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		// If the queue is empty reply with an error
		if (!serverQueue) return message.reply(`There is nothing playing that I could stop for you.`);

		// If the bot is in a vc, clear the queue as normal
		if(message.guild.voice.connection) {
			if(serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.destroy();
			if(serverQueue.songs) serverQueue.songs = [];
			if(message.client.queue) message.client.queue.delete(message.guild.id);

			let stopEmbed = new Discord.MessageEmbed()
				.setColor(0xff0000)
				.setTitle(`🛑 Queue cleared and Music stopped.`);

			return message.channel.send(stopEmbed);
		// If the bot is not in a vc, make sure the queue is cleared and report an error
		} else {
			if(serverQueue.songs) serverQueue.songs = [];
			if(message.client.queue) message.client.queue.delete(message.guild.id);
			return message.reply(`I'm not in a VC, so there is no music to stop!`);
		}
	},
}