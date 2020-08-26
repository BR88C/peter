const Discord = require(`discord.js`);

module.exports = {
	name: `pause`,
	description: `Pauses the current song.`,
	guildOnly: true,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		// Checks if the queue exists and that the music isn't paused
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Current song was paused!');
		}
		// If the music is paused or nothing is playing
		return message.channel.send('There is nothing playing.');
	},
}