const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `phaser`,
	description: `Adds a phaser effect to the song`,
	category: `Music`,
	guildOnly: true,
	usage: `[phaser value]`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't add a phaser effect if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to add a phaser effect!`);

		// Replies with the current phaser value if no arguments are specified
		if(!args[0]) return message.channel.send(`The current phaser level is: **${serverQueue.phaser}%**`);
		
		// Checks to make sure the phaser value specified is greater or equal to 0 and less or equal to 100
		let specifiedValue = args[0];
		if(specifiedValue.toLowerCase() === `off`) specifiedValue = 0;
		specifiedValue = parseInt(specifiedValue);
		if(isNaN(specifiedValue)) return message.reply(`please specify an Integer!`);
		if(specifiedValue > 100 || specifiedValue < 0) return message.reply(`phaser value must be between 0 and 100%!`);

		// Sets value
		serverQueue.phaser = specifiedValue;

		// Push the song at current time
		if(!serverQueue.songs[serverQueue.currentSong].livestream) serverQueue.songs[serverQueue.currentSong].startTime = (serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.speed / 100) + serverQueue.songs[serverQueue.currentSong].startTime;
		serverQueue.songs[serverQueue.currentSong].hidden = true;
		if(serverQueue.loop !== `single`) serverQueue.currentSong--;
		serverQueue.connection.dispatcher.end();

		let phaserEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🌊  Set the phaser value to **${specifiedValue}%**`);

		return message.channel.send(phaserEmbed);
	},
}