const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const checkValueSpecified = require(`../utils/checkValueSpecified.js`);

module.exports = {
	name: `skipto`,
    description: `Skips to a specified song in the queue`,
    category: `Music`,
    guildOnly: true,
    args: true,
    aliases: [`goto`],
    usage: `<Queue Number of Song>`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[0]) return message.reply(`I can't skip to a song if there are no songs in the queue!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to remove music from the queue!`);
        
        // Checks to make sure the value specified is valid
		const specifiedValue = checkValueSpecified(args[0], 1, serverQueue.songs.length, message);
        if(specifiedValue === `invalid`) return;

        // Skips to the specified song
        serverQueue.currentSong = specifiedValue - 1;
        if(serverQueue.loop !== `single`) serverQueue.currentSong--;
		serverQueue.connection.dispatcher.end();

        let skippedToEmbed = new Discord.MessageEmbed()
            .setColor(0x9cd6ff)
            .setTitle(`⏭️  Skipped to **${serverQueue.songs[specifiedValue - 1].title}**!`);

        return message.channel.send(skippedToEmbed);
	},
}