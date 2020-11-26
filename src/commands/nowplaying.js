const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const time = require(`../utils/time.js`)
const progressbar = require(`../utils/progressbar.js`);

module.exports = {
	name: `nowplaying`,
	description: `Replies with the song currently playing`,
	category: `Music`,
	guildOnly: true,
	aliases: [`np`],
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[0]) return message.channel.send(`There is noting playing.`);


		// Sets the description field based on if the song is a livestream or not
		let description;
		if(serverQueue.songs[0].livestream) {
			description = `🔴  **LIVE**`
		} else {
			const completed = (serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.speed / 100) + serverQueue.songs[0].startTime;
			const percentComplete = completed / serverQueue.songs[0].rawTime;
			description = time(Math.round(completed)) + ` ` + progressbar(percentComplete, 35) + ` ` + serverQueue.songs[0].timestamp;
		}
		

		// Create embed
		let nowPlayingEmbed = new Discord.MessageEmbed()
			.setColor(0xb0ffe2)
			.setAuthor(`🎶 Currently playing:`)
			.setTitle(`**${serverQueue.songs[0].title}**`)
			.setURL(serverQueue.songs[0].url)
			.setDescription(description)
			.setThumbnail(serverQueue.songs[0].thumbnail)
			.setFooter(`Requested by: ${serverQueue.songs[0].requestedBy.tag}`)
			.setTimestamp(new Date());

		// Send Embed
		return message.channel.send(nowPlayingEmbed);
	},
}