const Discord = require(`discord.js`);

module.exports = {
	name: `leave`,
	description: `Leaves the voice channel.`,
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		if (!channel) return message.channel.send(`I'm sorry but you need to be in a voice channel to disconnect me!`);

        message.client.queue.delete(message.guild.id);
        message.member.voice.channel.leave();
        message.channel.send(`👋 Left the VC.`);
        
	},
};