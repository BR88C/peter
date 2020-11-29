const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const currentTime = require(`../utils/currentTime.js`);
const streamhandler = require(`../modules/streamhandler.js`);

module.exports = {
	name: `bass`,
	description: `Bassboost the current song`,
	category: `Music`,
	guildOnly: true,
	aliases: [`bassboost`],
	usage: `[bass value]`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't bassboost if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to bassboost music!`);

		// Replies with the current bass value if no arguments are specified
		if(!args[0]) return message.channel.send(`The current bass level is: **+${serverQueue.bass}%**`);
		
		// Checks to make sure the bass value specified is greater or equal to 0 and less or equal to 100
		let specifiedValue = args[0];
		if(specifiedValue.toLowerCase() === `off`) specifiedValue = 0;
		specifiedValue = parseInt(specifiedValue);
		if(isNaN(specifiedValue)) return message.reply(`please specify an Integer!`);
		if(specifiedValue > 100 || specifiedValue < 0) return message.reply(`bass value must be between 0 and 100%!`);

		// Sets value
		serverQueue.bass = specifiedValue;

		// Restart the stream at the current time
		streamhandler.restartStream(serverQueue, currentTime(serverQueue));

		let bassEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🥁  Set the bass to **+${specifiedValue}%**`);

		return message.channel.send(bassEmbed);
	},
}