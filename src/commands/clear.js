const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `clear`,
	description: `Clears the queue without removing the song currently playing`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || serverQueue.songs[0]) return message.reply(`I can't clear the queue if the queue is empty!`);
		if(!serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't clear the queue if no music is playing!`)

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to clear the queue!`);

		// Clears the queue without removing the song currently playing
		serverQueue.songs = [serverQueue.songs[serverQueue.currentSong]];
		serverQueue.currentSong = 0;
		
		// Create embed
		let clearEmbed = new Discord.MessageEmbed()
		 	.setColor(0xff642b)
			.setTitle(`🧹  Cleared the Queue!`);

		// Send embed
        return message.channel.send(clearEmbed);
	},
}