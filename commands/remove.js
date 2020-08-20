const Discord = require(`discord.js`);

module.exports = {
	name: `remove`,
	description: `Removes a song from the queue`,
    guildOnly: true,
    args: true,
    usage: `[Queue Number of Song]`,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to modify the queue!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) return message.reply(`I can't modify the queue if there is nothing in the queue!`);
        
        if(isNaN(parseInt(args[0]))) return message.reply(`please specify an Integer!`);
        
        const queueLength = (serverQueue.songs).length - 1;
        console.log(queueLength)
        if(args[0] > queueLength || args[0] < 1 ) return message.reply(`there isnt a song in the queue with that number!`);

        console.log(serverQueue.songs)
        const song = serverQueue.songs.splice(args[0], 1)
        serverQueue.songs = serverQueue.songs.splice(args[0], 1, '');
        console.log(song)
        console.log(serverQueue.songs)
        console.log(`done`)

	},
};