const Discord = require(`discord.js`);

module.exports = {
	name: `leave`,
	description: `Leaves the voice channel.`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		// Checks if user is in a vc
		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to disconnect me!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		// If the bot is in a vc, clear the queue and leave
		if(message.guild.voice.connection) {
			if(serverQueue) serverQueue.connection.dispatcher.destroy();
			message.client.queue.delete(message.guild.id);
			message.member.voice.channel.leave();
			message.channel.send(`👋 Left the VC.`);
		// If the bot is not in a vc, clear the queue and reply with an error
		} else {
			serverQueue.songs = [];
			message.client.queue.delete(message.guild.id);
			message.reply(`I can't leave if I'm not in a VC!`);
		}
	}
}