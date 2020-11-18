const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `pause`,
	description: `Pauses the current song.`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		// Checks if the queue exists and that the music isn't paused
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			
			let pauseEmbed = new Discord.MessageEmbed()
				.setColor(0xfff066)
				.setTitle(`⏸ Current song was paused!`);

			return message.channel.send(pauseEmbed);
		}
		// If the music is paused or nothing is playing
		return message.reply(`I can't pause if nothing is playing!`);
	},
}