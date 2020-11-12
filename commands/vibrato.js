const Discord = require(`discord.js`);
const ytdl = require(`discord-ytdl-core`);
const log = require(`../utils/log.js`);

module.exports = {
	name: `vibrato`,
	description: `Add vibrato to music`,
	category: `Music`,
	guildOnly: true,
	usage: `<vibrato value>`,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		
		// If the queue is empty reply with an error
		if (!serverQueue) return message.channel.send(`There is nothing in the queue.`);

		// Replies with the current volume if no arguments are specified
		if(!args[0]) return message.channel.send(`The current vibrato level is: **${serverQueue.vibrato}%**`);
		
		// Checks to make sure the vibrato value specified is greater or equal to 0 and less or equal to 100
		if(isNaN(parseInt(args[0]))) return message.reply(`please specify an Integer!`);
		const specifiedVibrato = parseInt(args[0]);
		if(specifiedVibrato > 100 || specifiedVibrato < 0) {
			return message.reply(`vibrato value must be between 0 and 100%!`);
		}

		// Set vibrato value
		serverQueue.vibrato = args[0]

		// Push the song at current time
		serverQueue.songs.unshift(serverQueue.songs[0])
		serverQueue.songs[1].startTime = serverQueue.connection.dispatcher.streamTime/1000;
		serverQueue.songs[1].hidden = true;
		serverQueue.connection.dispatcher.end();

		let vibratoEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🎵 Set the vibrato to **${specifiedVibrato}%**`) 

		return message.channel.send(vibratoEmbed);
	},
}