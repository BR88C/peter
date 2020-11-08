const Discord = require(`discord.js`);
const config = require("../config.json");

module.exports = {
	name: `volume`,
	description: `Sets the volume for the music`,
	category: `Music`,
	guildOnly: true,
	aliases: [`v`],
	usage: `[volume %]`,
	async execute(client, message, args) {
		const { channel } = message.member.voice;
		
		// Checks if user is in a vc
		if(!channel) return message.channel.send(`I'm sorry but you need to be in a voice channel to change volume!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		// If the queue is empty reply with an error
		if(!serverQueue) return message.channel.send(`There is nothing playing.`);

		// Replies with the current volume if no arguments are specified
		if(!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		
		// Checks to make sure the volume specified is greater or equal to 0 and less or equal to 10,000
		if((config.dev.id !== message.author.id) && parseInt(args[0]) > 10000 || parseInt(args[0]) <= 0) {
			return message.reply(`volume must be between 1 and 10,000%!`);
		}

		// Sets the volume
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolume(parseInt(args[0]) / 500);

		let volumeEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🔊 Set the volume to **${args[0]}%**`) 

		return message.channel.send(volumeEmbed);
	},
}