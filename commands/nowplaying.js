const Discord = require(`discord.js`);

module.exports = {
	name: `nowplaying`,
	description: `Replies with the song currently playing.`,
	guildOnly: true,
	aliases: [`np`],
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send(`There is nothing playing.`);
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	},
}