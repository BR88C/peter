const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `volume`,
	description: `Sets the volume for the music`,
	category: `Music`,
	guildOnly: true,
	aliases: [`v`],
	usage: `[volume %]`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue) return message.reply(`I can't change the volume if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to change the volume!`);

		// Replies with the current volume if no arguments are specified
		if(!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		
		// Checks to make sure the volume specified is greater or equal to 0 and less or equal to 1,000,000
		const specifiedVolume = parseInt(args[0]);
		if(isNaN(specifiedVolume)) return message.reply(`please specify an Integer!`);
		if(specifiedVolume > 100000 || specifiedVolume < 0) return message.reply(`volume must be between 0 and 100,000%!`);

		// Sets the volume
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(specifiedVolume / 250);

		let volumeEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🔊 Set the volume to **${specifiedVolume}%**`);

		return message.channel.send(volumeEmbed);
	},
}