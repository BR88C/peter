const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const currentTime = require(`../utils/currentTime.js`);
const streamhandler = require(`../modules/streamhandler.js`);

module.exports = {
	name: `vibrato`,
	description: `Add vibrato to music`,
	category: `Music`,
	guildOnly: true,
	usage: `[vibrato value]`,
	async execute(client, message, args) {
        // If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't add vibrato if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to add vibrato to the music!`);

		// Replies with the current volume if no arguments are specified
		if(!args[0]) return message.channel.send(`The current vibrato level is: **${serverQueue.vibrato}%**`);
		
		// Checks to make sure the vibrato value specified is greater or equal to 0 and less or equal to 100
		let specifiedValue = args[0];
    	if(specifiedValue.toLowerCase() === `off`) specifiedValue = 0;
    	specifiedValue = parseInt(specifiedValue);
		if(isNaN(specifiedValue)) return message.reply(`please specify an Integer!`);
		if(specifiedValue > 100 || specifiedValue < 0) return message.reply(`vibrato value must be between 0 and 100%!`);

		// Sets value
		serverQueue.vibrato = specifiedValue;

		// Restart the stream at the current time
		streamhandler.restartStream(serverQueue, currentTime(serverQueue));

		let vibratoEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🎵  Set the vibrato to **${specifiedValue}%**`);

		return message.channel.send(vibratoEmbed);
	},
}