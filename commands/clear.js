const Discord = require(`discord.js`);

module.exports = {
	name: `clear`,
	description: `Clears the queue.`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		if (!channel) return message.reply(`I'm sorry but you need to be in a voice channel to clear the queue!`);
		const serverQueue = message.client.queue.get(message.guild.id);

		if (!serverQueue) return message.reply(`I can't clear the queue if there is nothing in the queue!`);

        const currentSong = serverQueue.songs[0]
        serverQueue.songs = [serverQueue.songs[0]];
        message.channel.send(`Cleared the Queue!`)
	},
};