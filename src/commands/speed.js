const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `speed`,
	description: `Change the speed of the music`,
	category: `Music`,
	guildOnly: true,
	aliases: [`tempo`],
	usage: `[% speed]`,
	async execute(client, message, args) {
        // If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't change the speed if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to change the music's speed!`);

		// Checks if the current song is a livestream
		if(serverQueue.songs[serverQueue.currentSong].livestream) return message.reply(`this command does not support livestreams!`);

		// Replies with the current speed if no arguments are specified
		if(!args[0]) return message.channel.send(`The current speed is: **${serverQueue.speed}%**`);
		
		// Checks to make sure the speed specified is greater or equal to 50 and less or equal to 500
		let specifiedValue = args[0];
    	if(specifiedValue.toLowerCase() === `off`) specifiedValue = 100;
    	specifiedValue = parseInt(specifiedValue);
		if(isNaN(specifiedValue)) return message.reply(`please specify an Integer!`);
		if(specifiedValue > 500 || specifiedValue < 50) return message.reply(`speed must be between 50 and 500%!`);

		// Get old speed
		const oldSpeed = serverQueue.speed;

		// Sets value
		serverQueue.speed = specifiedValue;

		// Push the song at current time
		if(!serverQueue.songs[serverQueue.currentSong].livestream) serverQueue.songs[serverQueue.currentSong].startTime = (serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.speed / 100) + serverQueue.songs[serverQueue.currentSong].startTime;
		serverQueue.songs[serverQueue.currentSong].hidden = true;
		if(serverQueue.loop !== `single`) serverQueue.currentSong--;
		serverQueue.connection.dispatcher.end();

		let speedEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🏃  Set the speed to **${specifiedValue}%**`);

		return message.channel.send(speedEmbed);
	},
}