const Discord = require(`discord.js`);

module.exports = {
	name: `resume`,
	description: `Resumes the current song.`,
	guildOnly: true,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Current song was resumed!');
		}
		return message.channel.send('There is nothing playing.');
	},
};