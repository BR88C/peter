const Discord = require(`discord.js`);
const config = require("../config.json");

module.exports = {
	name: `volume`,
	description: `Sets the volume for the music`,
	args: true,
	guildOnly: true,
	aliases: [`v`],
	usage: `[volume %]`,
	async execute(client, message, args) {
		const { channel } = message.member.voice;
		if(!channel) return message.channel.send(`I'm sorry but you need to be in a voice channel to change volume!`);

		const serverQueue = message.client.queue.get(message.guild.id);

		if(!serverQueue) return message.channel.send(`There is nothing playing.`);
		if(!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		
		if((config.BR88C.id !== message.author.id) && parseInt(args[0]) > 10000 || parseInt(args[0]) <= 0) {
			return message.reply(`volume must be between 1 and 10,000%!`);
		}

		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolume(parseInt(args[0]) / 500);

		return message.channel.send(`🔊 Set the volume to: **${args[0]}%**`);
	},
};