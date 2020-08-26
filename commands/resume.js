const Discord = require(`discord.js`);

module.exports = {
	name: `resume`,
	description: `Resumes the current song.`,
	guildOnly: true,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		// Checks if the queue exists and that the music is paused
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Current song was resumed!');
		}
		// If nothing is playing
		return message.channel.send('There is nothing playing.');
	},
}