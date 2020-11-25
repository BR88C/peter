const Discord = require(`discord.js`);

module.exports = {
	name: `loop`,
	description: `Specify if the current song should be looped`,
	category: `Music`,
	guildOnly: true,
	usage: `[on/off]`,
	async execute(client, message, args) {
        // If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue) return message.reply(`I can't loop the current song if the queue is empty!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to loop the current song!`);

		if(!args[0] || args[0].toLowerCase() === `on`) {
			serverQueue.loop = true;

			let loopEmbed = new Discord.MessageEmbed()
			.setColor(0x9cd6ff)
			.setTitle(`🔂  Now looping the current song.`);

			return message.channel.send(loopEmbed);

		} else if(args[0].toLowerCase() === `off`) {
			serverQueue.loop = false;

			let loopEmbed = new Discord.MessageEmbed()
			.setColor(0x9cd6ff)
			.setTitle(`Looping has been turned off.`);

			return message.channel.send(loopEmbed);

		} else {
			return message.reply(`that isn't a valid argument! You must specify "on" or "off".`);
		}
	},
} 