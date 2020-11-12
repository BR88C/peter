const Discord = require(`discord.js`);
const log = require(`../utils/log.js`);

module.exports = {
	name: `queue`,
	description: `Lists the queue.`,
	category: `Music`,
	guildOnly: true,
	aliases: [`q`],
	async execute(client, message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);
		
		// If the queue is empty reply with an error
		if (!serverQueue) return message.channel.send(`There is nothing in the queue.`);

		// If the user specifies a song
		if(args.length) {
			// Checks if an integer was provided
			if(isNaN(parseInt(args[0]))) return message.reply(`please specify an Integer!`);
			const songNumber = parseInt(args[0]);

			// Checks if the queue has a song tagged with the number specified
			const queueLength = (serverQueue.songs).length - 1;
			if(songNumber > queueLength || songNumber < 1 ) return message.reply(`there isnt a song in the queue with that number!`);
			
			// Creates and sends the embed
			let queueEmbed = new Discord.MessageEmbed()
				.setColor(0x1e90ff)
				.setAuthor(`Queued song number ${songNumber}:`)
				.setTitle(`**${serverQueue.songs[songNumber].title}**`)
				.setURL(serverQueue.songs[songNumber].url)
				.setDescription(`Song Length: ${serverQueue.songs[songNumber].timestamp}`)
				.setImage(serverQueue.songs[songNumber].thumbnail)
				.setFooter(`Requested by: ${serverQueue.songs[songNumber].requestedBy.tag}`)
				.setTimestamp(new Date());

			return message.channel.send(queueEmbed);
		}

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