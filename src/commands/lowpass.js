const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `lowpass`,
	description: `Add a lowpass filter to the song`,
	category: `Music`,
	guildOnly: true,
	usage: `[lowpass value]`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't add a lowpass filter if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to add a lowpass filter!`);

		// Replies with the current lowpass value if no arguments are specified
		if(!args[0]) return message.channel.send(`The current lowpass level is: **+${serverQueue.lowpass}%**`);
		
		// Checks to make sure the lowpass value specified is greater or equal to 0 and less or equal to 100
		let specifiedValue = args[0];
        if(specifiedValue.toLowerCase() === `off`) specifiedValue = 0;
        specifiedValue = parseInt(specifiedValue);
        if(isNaN(specifiedValue)) return message.reply(`please specify an Integer!`);
		if(specifiedValue > 100 || specifiedValue < 0) return message.reply(`lowpass value must be between 0 and 100%!`);

		// Sets value
		serverQueue.lowpass = specifiedValue;

		// Push the song at current time
		if(!serverQueue.songs[serverQueue.currentSong].livestream) serverQueue.songs[serverQueue.currentSong].startTime = (serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.speed / 100) + serverQueue.songs[serverQueue.currentSong].startTime;
		serverQueue.songs[serverQueue.currentSong].hidden = true;
		if(serverQueue.loop !== `single`) serverQueue.currentSong--;
		serverQueue.connection.dispatcher.end();

		let lowpassEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`⬇️  Set the lowpass level to **+${specifiedValue}%**`);

		return message.channel.send(lowpassEmbed);
	},
}