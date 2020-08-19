const Discord = require(`discord.js`);

module.exports = {
	name: `stop`,
	description: `Stops all music and clears the queue.`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		if (!channel) return message.channel.send(`I'm sorry but you need to be in a voice channel to stop music!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) return message.channel.send(`There is nothing playing that I could stop for you.`);

		if(channel) serverQueue.connection.dispatcher.destroy();
		serverQueue.songs = [];
		message.client.queue.delete(message.guild.id);
		message.channel.send(`🛑 Music stopped.`);
	},
};