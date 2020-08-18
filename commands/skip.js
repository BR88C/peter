const Discord = require(`discord.js`);

module.exports = {
	name: `skip`,
	description: `Skips the current song.`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		if(!channel) return message.channel.send(`I'm sorry but you need to be in a voice channel to play music!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		if(!serverQueue) return message.channel.send(`There is nothing playing that I could skip for you.`);
		serverQueue.connection.dispatcher.end();
		message.channel.send(`⏩ The current song has been skipped.`)
		},
};