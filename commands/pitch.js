const Discord = require(`discord.js`);
const log = require(`../utils/log.js`);

module.exports = {
	name: `pitch`,
	description: `Change the pitch of the current song`,
	category: `Music`,
	guildOnly: true,
	usage: `<pitch value>`,
	async execute(client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);
		
		// If the queue is empty reply with an error
		if (!serverQueue) return message.channel.send(`There is nothing in the queue.`);

		// Replies with the current pitch value if no arguments are specified
		if(!args[0]) return message.channel.send(`The current pitch is: **${serverQueue.pitch}%**`);
		
        // Checks to make sure the pitch value specified is greater or equal to 10 and less or equal to 250
        const specifiedPitch = parseInt(args[0]);
		if(isNaN(specifiedPitch)) return message.reply(`please specify an Integer!`);
		if(specifiedPitch > 250 || specifiedPitch < 25) return message.reply(`pitch value must be between 25 and 250%!`);

		// Set bass value
		serverQueue.pitch = args[0];

		// Push the song at current time
		serverQueue.songs.unshift(serverQueue.songs[0]);
		serverQueue.songs[1].startTime = serverQueue.connection.dispatcher.streamTime/1000;
		serverQueue.songs[1].hidden = true;
		serverQueue.connection.dispatcher.end();

		let pitchEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`👂 Set the pitch to **${specifiedPitch}%**`);

		return message.channel.send(pitchEmbed);
	},
}