const Discord = require(`discord.js`);

module.exports = {
	name: `pause`,
	description: `Pauses the current song.`,
	guildOnly: true,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Current song was paused!');
		}
		return message.channel.send('There is nothing playing.');
	},
}