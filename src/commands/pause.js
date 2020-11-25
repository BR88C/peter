const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `pause`,
	description: `Pauses the current song`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
        // If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue) return message.reply(`I can't pause the music if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to pause the music!`);

		// Checks if the music isn't paused
		if (serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			
			let pauseEmbed = new Discord.MessageEmbed()
				.setColor(0xfff066)
				.setTitle(`⏸  Current song was paused!`);

			return message.channel.send(pauseEmbed);

		// If the music is already paused
		} else {
		return message.channel.reply(`there is nothing to pause!`);
		}
	},
}