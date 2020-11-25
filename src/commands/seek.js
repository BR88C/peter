const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const time = require(`../utils/time.js`);

module.exports = {
	name: `seek`,
	description: `Seek to a specified time in a song`,
    category: `Music`,
    args: true,
	guildOnly: true,
	usage: `<time (seconds)>`,
	async execute(client, message, args) {
        // If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue) return message.reply(`I can't seek if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to seek!`);

		// Checks if the current song is a livestream
		if(serverQueue.songs[0].livestream) return message.reply(`this command does not support livestreams!`);

		// Checks to make sure the bass value is an integer
		let specifiedTime = parseInt(args[0]);
		if(isNaN(specifiedTime)) return message.reply(`please specify an Integer!`);

        // If time specified is longer than the video, seek to the last 2 seconds of the video
        if(specifiedTime >= serverQueue.songs[0].rawTime) specifiedTime = serverQueue.songs[0].rawTime - 2;

		// Push the song at current time
		serverQueue.songs.unshift(serverQueue.songs[0]);
		serverQueue.songs[1].startTime = specifiedTime;
		serverQueue.songs[1].hidden = true;
		serverQueue.connection.dispatcher.end();

		let seekEmbed = new Discord.MessageEmbed()
			.setColor(0xbccbd1)
			.setTitle(`⏩  Seeked to **${time(specifiedTime)}**`);

		return message.channel.send(seekEmbed);
	},
}