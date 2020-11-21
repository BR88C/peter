const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `bass`,
	description: `Bassboost the current song`,
	category: `Music`,
	guildOnly: true,
	aliases: [`bassboost`],
	usage: `<bass value>`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue) return message.reply(`I can't bassboost if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to bassboost music!`);

		// Replies with the current bass value if no arguments are specified
		if(!args[0]) return message.channel.send(`The current bass level is: **+${serverQueue.bass}%**`);
		
		// Checks to make sure the bass value specified is greater or equal to 0 and less or equal to 100
		const specifiedBass = parseInt(args[0]);
		if(isNaN(specifiedBass)) return message.reply(`please specify an Integer!`);
		if(specifiedBass > 100 || specifiedBass < 0) return message.reply(`bass value must be between 0 and 100%!`);

		// Set bass value
		serverQueue.bass = args[0];

		// Push the song at current time
		serverQueue.songs.unshift(serverQueue.songs[0]);
		serverQueue.songs[1].startTime = (serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.speed / 100) + serverQueue.songs[0].startTime;
		serverQueue.songs[1].hidden = true;
		serverQueue.connection.dispatcher.end();

		let bassEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🥁 Set the bass to **+${specifiedBass}%**`);

		return message.channel.send(bassEmbed);
	},
}