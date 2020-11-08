const Discord = require(`discord.js`);

module.exports = {
	name: `leave`,
	description: `Leaves the voice channel.`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		// Checks if user is in a vc
		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to disconnect me!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		// If the bot is in a vc, clear the queue and leave
		if(message.guild.voice.connection) {
			if(serverQueue) serverQueue.connection.dispatcher.destroy();
			message.client.queue.delete(message.guild.id);
			message.member.voice.channel.leave();

			let leaveEmbed = new Discord.MessageEmbed()
				.setColor(0xff4a4a)
				.setTitle(`👋 Left the VC.`)

			message.channel.send(leaveEmbed);

		// If the bot is not in a vc, make sure the queue is cleared and report an error
		} else {
			if(serverQueue.songs) serverQueue.songs = [];
			message.client.queue.delete(message.guild.id);
			message.reply(`I can't leave if I'm not in a VC!`);
		}
	}
}