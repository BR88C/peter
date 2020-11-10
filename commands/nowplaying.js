const Discord = require(`discord.js`);

module.exports = {
	name: `nowplaying`,
	description: `Replies with the song currently playing.`,
	category: `Music`,
	guildOnly: true,
	aliases: [`np`],
	async execute(client, message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);
		
		// If the queue is empty
		if (!serverQueue) return message.channel.send(`There is nothing playing.`);

		// Create embed
		let nowPlayingEmbed = new Discord.MessageEmbed()
			.setColor(0xb0ffe2)
			.setAuthor(`🎶 Currently playing:`)
			.setTitle(`**${serverQueue.songs[0].title}**`)
			.setURL(serverQueue.songs[0].url)
			.setDescription(`Song Length: ${serverQueue.songs[0].timestamp}`)
			.setImage(serverQueue.songs[0].thumbnail)
			.setFooter(`Requested by: ${serverQueue.songs[0].requestedBy.tag}`)

		// Send Embed
		return message.channel.send(nowPlayingEmbed);
	},
}