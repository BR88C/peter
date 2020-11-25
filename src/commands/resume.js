const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `resume`,
	description: `Resumes the current song`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
        // If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue) return message.reply(`I can't resume the music if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to resume the music!`);
		
		// Checks if the the music is paused
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();

			let resumeEmbed = new Discord.MessageEmbed()
				.setColor(0xb8ff9c)
				.setTitle(`▶  Current song was resumed!`);

			return message.channel.send(resumeEmbed);

		// If the music is already resumed
		} else {
			return message.channel.reply(`there is nothing to resume!`);
		}
	},
}