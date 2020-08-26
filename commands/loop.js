const Discord = require(`discord.js`);

module.exports = {
	name: `loop`,
	description: `Specify if the current song should be looped`,
	guildOnly: true,
	usage: `[on/off]`,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		// Checks if user is in a vc
		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to loop music!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		// If the queue is empty reply with an error
		if (!serverQueue) return message.reply(`There is nothing playing that I could loop for you.`);

		// If the bot is in a vc set serverQueue.loop or report on if the bot is looping or not if no arguments are provided
		if(message.guild.voice.connection) {
			if(args[0] === undefined || args[0] === null) {
				if(serverQueue.loop === true) {
					return message.channel.send(`🔂 I am currently looping the current song.`);
				} else {
					return message.channel.send(`I am not looping any songs.`);
				}
			}
			if(args[0].toLowerCase() === `off`) {
				serverQueue.loop = false;
				return message.channel.send(`I am no longer looping any songs.`);
			}
			if(args[0].toLowerCase() === `on`) {
				serverQueue.loop = true;
				return message.channel.send(`🔂 Now looping the current song.`);
			} 
			return message.reply(`that isn't a valid argument! You must specify "on" or "off".`);
		// If the bot is not in a vc clear the queue and report an error
		} else {
			serverQueue.songs = [];
			message.client.queue.delete(message.guild.id);
			message.reply(`I'm not in a VC, so there is no music to loop!`);
		}
	},
}