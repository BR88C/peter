const Discord = require(`discord.js`);

module.exports = {
	name: `stop`,
	description: `Stops all music and clears the queue.`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to stop music!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) return message.reply(`There is nothing playing that I could stop for you.`);

		if(message.guild.voice.connection) {
			serverQueue.connection.dispatcher.destroy();
			serverQueue.songs = [];
			message.client.queue.delete(message.guild.id);
			message.channel.send(`Queue cleared and Music stopped. 🛑`);
		} else {
			serverQueue.songs = [];
			message.client.queue.delete(message.guild.id);
			message.reply(`I'm not in a VC, so there is no music to stop!`);
		}
	},
};