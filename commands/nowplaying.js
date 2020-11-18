const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const time = require(`../utils/time.js`)
const progressbar = require(`../utils/progressbar.js`);

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

		const percentComplete = (serverQueue.connection.dispatcher.streamTime / 1000) / serverQueue.songs[0].rawTime;

		// Create embed
		let nowPlayingEmbed = new Discord.MessageEmbed()
			.setColor(0xb0ffe2)
			.setAuthor(`🎶 Currently playing:`)
			.setTitle(`**${serverQueue.songs[0].title}**`)
			.setURL(serverQueue.songs[0].url)
			.setDescription(time(Math.round(serverQueue.connection.dispatcher.streamTime / 1000)) + ` ` + progressbar(percentComplete, 35) + ` ` + serverQueue.songs[0].timestamp)
			.setThumbnail(serverQueue.songs[0].thumbnail)
			.setFooter(`Requested by: ${serverQueue.songs[0].requestedBy.tag}`)
			.setTimestamp(new Date());

		// Send Embed
		return message.channel.send(nowPlayingEmbed);
	},
}