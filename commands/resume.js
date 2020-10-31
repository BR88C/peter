const Discord = require(`discord.js`);

module.exports = {
	name: `resume`,
	description: `Resumes the current song.`,
	guildOnly: true,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		// Checks if the queue exists and that the music is paused
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();

			let resumeEmbed = new Discord.MessageEmbed()
				.setColor(0xb8ff9c)
				.setTitle(`▶ Current song was resumed!`)

			return message.channel.send(resumeEmbed);
		}
		// If nothing is playing
		return message.channel.send(`There is nothing playing.`);
	},
}