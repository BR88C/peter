const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

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
        
        // Set specified index
        const specifiedIndex = parseInt(args[0]);

        // Checks if the argument provided is an integer
        if(isNaN(specifiedIndex)) return message.reply(`please specify an Integer!`);

        // Checks if the queue has a song tagged with the number specified
        const queueLength = (serverQueue.songs).length;
        if(specifiedIndex > queueLength || specifiedIndex < 1 ) return message.reply(`there isnt a song in the queue with that number!`);

        // Skips to the specified song
        serverQueue.currentSong = specifiedIndex - 1;
        if(serverQueue.loop !== `single`) serverQueue.currentSong--;
		serverQueue.connection.dispatcher.end();

        let skippedToEmbed = new Discord.MessageEmbed()
            .setColor(0x9cd6ff)
            .setTitle(`⏭️  Skipped to **${serverQueue.songs[specifiedIndex - 1].title}**!`);

        return message.channel.send(skippedToEmbed);
	},
}