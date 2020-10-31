const Discord = require(`discord.js`);

module.exports = {
	name: `queue`,
	description: `Lists the queue.`,
	guildOnly: true,
	aliases: [`q`],
	async execute(client, message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);
		
		// If the queue is empty reply with an error
		if (!serverQueue) return message.channel.send(`There is nothing in the queue.`);

		// Creates and sends the embed
		let queueEmbed = new Discord.MessageEmbed()
			.setAuthor(`Song Queue`)
			.setColor(0x1e90ff)
			.setDescription(`
			**Now Playing**: ${serverQueue.songs[0].title} [${serverQueue.songs[0].timestamp}]
			${serverQueue.songs.map((song, i) => i == 0 ? null: `\`${i}\`. ${song.title} [${song.timestamp}]`).join(`\n`)}
			`)
			.setTimestamp(new Date());
			
		return message.channel.send(queueEmbed);
	},
}