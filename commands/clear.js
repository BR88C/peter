const Discord = require(`discord.js`);

module.exports = {
	name: `clear`,
	description: `Clears the queue without removing the song currently playing.`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		// Checks if user is in a vc
		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to clear the queue!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		// If the queue is empty reply with an error
		if (!serverQueue) return message.reply(`I can't clear the queue if there is nothing in the queue!`);

		// Clears the queue without removing the song currently playing
		serverQueue.songs = [serverQueue.songs[0]];
		
		// Create embed
		let clearEmbed = new Discord.MessageEmbed()
		 	.setColor(0xff642b)
			.setTitle(`Cleared the Queue!`)

		// Send embed
        message.channel.send(clearEmbed);
	},
}