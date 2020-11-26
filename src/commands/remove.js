const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `remove`,
    description: `Removes a song from the queue`,
    category: `Music`,
    guildOnly: true,
    args: true,
    aliases: [`rm`],
    usage: `<Queue Number of Song>`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[0]) return message.reply(`I can't remove queued music if the queue is empty!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to remove music from the queue!`);
        
        // Checks if the argument provided is an integer
        if(isNaN(parseInt(args[0]))) return message.reply(`please specify an Integer!`);
        
        // Checks if the queue has a song tagged with the number specified
        const queueLength = (serverQueue.songs).length - 1;
        if(args[0] > queueLength || args[0] < 1 ) return message.reply(`there isnt a song in the queue with that number!`);

        // Removes the specified song from the queue
        const song = serverQueue.songs.splice(args[0], 1);

        let removeEmbed = new Discord.MessageEmbed()
            .setColor(0xff668a)
            .setTitle(`❌  Removed **${song[0].title}** from the queue!`);

        return message.channel.send(removeEmbed);
	},
}