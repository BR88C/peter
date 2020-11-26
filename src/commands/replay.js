const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const streamhandler = require(`../modules/streamhandler.js`);

module.exports = {
	name: `replay`,
	description: `Replays the current song from the beginning`,
	category: `Music`,
	guildOnly: true,
	aliases: [`beginning`, `restart`],
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue && !serverQueue.songs) return message.reply(`I can't replay the song music if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to replay the current song!`);

		// Checks if the current song is a livestream
		if(serverQueue.songs[0].livestream) return message.reply(`this command does not support livestreams!`);
		
		// Plays the song from the beginning
		serverQueue.songs[0].startTime = 0;
    	serverQueue.songs[0].hidden = false;
		streamhandler.play(serverQueue.songs[0], message);
		
		let replayEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`🔁  Restarted the song`);

		return message.channel.send(replayEmbed);
	},
}