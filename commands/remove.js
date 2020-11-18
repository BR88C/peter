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
		const { channel } = message.member.voice;

        // If the bot is in a vc, clear the queue and leave
		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to modify the queue!`);
		const serverQueue = message.client.queue.get(message.guild.id);

        // If the queue is empty reply with an error
		if (!serverQueue) return message.reply(`I can't modify the queue if there is nothing in the queue!`);
        
        // Checks if the argument provided is an integer
        if(isNaN(parseInt(args[0]))) return message.reply(`please specify an Integer!`);
        
        // Checks if the queue has a song tagged with the number specified
        const queueLength = (serverQueue.songs).length - 1;
        if(args[0] > queueLength || args[0] < 1 ) return message.reply(`there isnt a song in the queue with that number!`);

        // Removes the specified song from the queue
        const song = serverQueue.songs.splice(args[0], 1);

        let removeEmbed = new Discord.MessageEmbed()
            .setColor(0xff668a)
            .setTitle(`❌ Removed **${song[0].title}** from the queue!`);

        message.channel.send(removeEmbed);

	},
}