const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `join`,
	description: `Makes the bot join a VC`,
	category: `Music`,
	guildOnly: true,
	async execute(client, message, args) {
        // Checks if user is in vc
		const { channel } = message.member.voice;
		if(!channel) return message.reply(`you need to be in a voice channel to make me join!`);

		// Checks if the bot is in a vc
		if(message.guild.voice && message.guild.voice.connection) return message.reply(`I'm already in a VC!`);

		// Get permissions
		const permissions = channel.permissionsFor(message.client.user);

		// If the bot does not have permissions
		if(!permissions.has(`CONNECT`)) return message.reply(`I cannot connect to your voice channel, make sure I have the proper permissions!`);
		if(!permissions.has(`SPEAK`)) return message.reply(`I cannot speak in your voice channel, make sure I have the proper permissions!`);

		// Try to join
        try {
			const connection = await channel.join();
			connection.voice.setSelfDeaf(true);
			
			let joinEmbed = new Discord.MessageEmbed()
				.setColor(0xc2ffb0)
				.setTitle(`✅ Joined ${connection.channel.name}`);

			message.channel.send(joinEmbed);
		} catch (error) {
			log(`I could not join the voice channel: ${error}`, `red`);
			await channel.leave();
			return message.reply(`I could not join the voice channel: ${error}`);
        };

	},
}