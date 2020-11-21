const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `skip`,
	description: `Skips the current song.`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue) return message.reply(`I can't skip if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to skip music!`);
		
		// Skips to the next song
		serverQueue.connection.dispatcher.end();

		let skipEmbed = new Discord.MessageEmbed()
			.setColor(0x9cd6ff)
			.setTitle(`⏭️ The current song has been skipped.`);

		return message.channel.send(skipEmbed);
	},
}