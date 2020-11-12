const Discord = require(`discord.js`);
const ytdl = require(`discord-ytdl-core`);
const log = require(`../utils/log.js`);

module.exports = {
	name: `speed`,
	description: `Change the speed of the music`,
	category: `Music`,
	guildOnly: true,
	aliases: [`tempo`],
	usage: `<% speed>`,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		
		// If the queue is empty reply with an error
		if (!serverQueue) return message.channel.send(`There is nothing in the queue.`);

		// Replies with the current speed if no arguments are specified
		if(!args[0]) return message.channel.send(`The current speed is: **${serverQueue.speed}%**`);
		
		// Checks to make sure the speed specified is greater or equal to 0 and less or equal to 100
		if(isNaN(parseInt(args[0]))) return message.reply(`please specify an Integer!`);
		const specifiedSpeed = parseInt(args[0]);
		if(specifiedSpeed > 500 || specifiedSpeed < 50) {
			return message.reply(`speed must be between 50 and 500%!`);
		}

		// Set speed
		serverQueue.speed = args[0]

		// Push the song at current time
		serverQueue.songs.unshift(serverQueue.songs[0])
		serverQueue.songs[1].startTime = serverQueue.connection.dispatcher.streamTime/1000;
		serverQueue.songs[1].hidden = true;
		serverQueue.connection.dispatcher.end();

		let speedEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🏃 Set the speed to **${specifiedSpeed}%**`) 

		return message.channel.send(speedEmbed);
	},
}