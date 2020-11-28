const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `247`,
	description: `Makes the queue continue to play even if no users are in vc (Reminder, if loop is not enabled, Peter will go through the queue normally and may run out of music to play)`,
	category: `Music`,
	guildOnly: true,
	aliases: [`24/7`, `twentyfourseven`],
	usage: `[on/off]`,
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue || !serverQueue.songs[0]) return message.reply(`I can't make the music 24/7 if there is no music playing!`);

		// Checks if the user is in the VC
        if(message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to make the music 24/7!`);

        // Checks if the user has voted
        let voteEmbed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle(`You must vote to use this command!`)
            .setDescription(`To vote for Peter, go to his top.gg page [here](https://top.gg/bot/744694015630245949) and click the vote button.\nReminder that your vote status is reset every 12 hours.`)

        await client.dbl.hasVoted(message.author.id).then(voted => {
			if(!voted) return message.channel.send(voteEmbed);
		});

		// Sets the queue's 24/7 status based on arguments
		if(!args[0] || args[0].toLowerCase() === `on`) {
			serverQueue.twentyFourSeven = true;

			let twentyFourSevenEmbed = new Discord.MessageEmbed()
			.setColor(0x9cd6ff)
			.setTitle(`🕐  The music is now 24/7.`);

			return message.channel.send(twentyFourSevenEmbed);

		} else if(args[0].toLowerCase() === `off`) {
			serverQueue.twentyFourSeven = false;

			let twentyFourSevenEmbed = new Discord.MessageEmbed()
			.setColor(0x9cd6ff)
			.setTitle(`The queue is no longer 24/7.`);

			return message.channel.send(twentyFourSevenEmbed);

		} else {
			return message.reply(`that isn't a valid argument! You must specify "on" or "off".`);
		}
	},
}