const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `highpass`,
	description: `Add a highpass filter to the song`,
	category: `Music`,
	guildOnly: true,
	usage: `[highpass value]`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue) return message.reply(`I can't add a highpass filter if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to add a highpass filter!`);

		// Replies with the current highpass value if no arguments are specified
		if(!args[0]) return message.channel.send(`The current highpass level is: **+${serverQueue.highpass}%**`);
		
		// Checks to make sure the highpass value specified is greater or equal to 0 and less or equal to 100
		let specifiedValue = args[0];
        if(specifiedValue.toLowerCase() === `off`) specifiedValue = 0;
        specifiedValue = parseInt(specifiedValue);
        if(isNaN(specifiedValue)) return message.reply(`please specify an Integer!`);
		if(specifiedValue > 100 || specifiedValue < 0) return message.reply(`highpass value must be between 0 and 100%!`);

		// Sets value
		serverQueue.highpass = specifiedValue;

		// Push the song at current time
		serverQueue.songs.unshift(serverQueue.songs[0]);
		serverQueue.songs[1].startTime = (serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.speed / 100) + serverQueue.songs[0].startTime;
		serverQueue.songs[1].hidden = true;
		serverQueue.connection.dispatcher.end();

		let highpassEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`⬆️  Set the highpass level to **+${specifiedValue}%**`);

		return message.channel.send(highpassEmbed);
	},
}