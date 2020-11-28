const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const time = require(`../utils/time.js`)

module.exports = {
	name: `queue`,
	description: `Lists the queue`,
	category: `Music`,
	guildOnly: true,
	aliases: [`q`],
	async execute(client, message, args) {
		// If the queue is empty reply with an error
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue || !serverQueue.songs[0]) return message.channel.send(`There is nothing in the queue.`);

		// Gets active effects
		let activeEffects = [];
        if(serverQueue.bass !== 0) activeEffects.push(`Bass = +${serverQueue.bass}%`);
		if(serverQueue.flanger !== 0) activeEffects.push(`Flanger = ${serverQueue.flanger}%`);
		if(serverQueue.lowpass !== 0) activeEffects.push(`Lowpass = +${serverQueue.lowpass}%`);
		if(serverQueue.highpass !== 0) activeEffects.push(`Highpass = +${serverQueue.highpass}%`);
        if(serverQueue.phaser !== 0) activeEffects.push(`Phaser = ${serverQueue.phaser}%`);
        if(serverQueue.pitch !== 100) activeEffects.push(`Pitch = ${serverQueue.pitch}%`);
        if(serverQueue.speed !== 100) activeEffects.push(`Speed = ${serverQueue.speed}%`);
        if(serverQueue.treble !== 0) activeEffects.push(`Treble = +${serverQueue.treble}%`);
        if(serverQueue.vibrato !== 0) activeEffects.push(`Vibrato = ${serverQueue.vibrato}%`);
		if(activeEffects[0]) {
			activeEffects = `\`\`\`${activeEffects.join(`, `)}\`\`\``
		} else {
			activeEffects = `\`\`\`No Active effects\`\`\``
		}

		// Gets current song's time completed
		const completed = Math.round((serverQueue.connection.dispatcher.streamTime / 1000) * (serverQueue.speed / 100) + serverQueue.songs[0].startTime);

		// If the user specifies a song
		if(args.length) {
			// Checks if an integer was provided
			const songNumber = parseInt(args[0]);
			if(isNaN(songNumber)) return message.reply(`please specify an Integer!`);

			// Checks if the queue has a song tagged with the number specified
			const queueLength = (serverQueue.songs).length - 1;
			if(songNumber > queueLength || songNumber < 1 ) return message.reply(`there isnt a song in the queue with that number!`);
			
			const songsBefore = serverQueue.songs.slice(0, songNumber);

			let timeUntilPlayed = 0;
			songsBefore.forEach(song => {
				timeUntilPlayed = song.rawTime + timeUntilPlayed;
			})
			timeUntilPlayed = Math.round((timeUntilPlayed / (serverQueue.speed / 100)) - completed);

			// Creates and sends the embed
			let queueEmbed = new Discord.MessageEmbed()
				.setColor(0x1e90ff)
				.setAuthor(`Queued song number ${songNumber}:`)
				.setTitle(`**${serverQueue.songs[songNumber].title}**`)
				.addFields(
					{ name: `**Song Length**`, value: serverQueue.songs[songNumber].timestamp, inline: true },
					{ name: `**Time until Played**`, value: time(timeUntilPlayed), inline: true },
					{ name: `**URL**`, value: `[Link](${serverQueue.songs[songNumber].url})`, inline: true },
				)
				.setImage(serverQueue.songs[songNumber].thumbnail)
				.setFooter(`Requested by: ${serverQueue.songs[songNumber].requestedBy.tag}`)
				.setTimestamp(new Date());

			return message.channel.send(queueEmbed);
		}

		// Generates info for time
		const songTimeLeft = Math.round(serverQueue.songs[0].rawTime - completed);
		let totalTime = 0;
		serverQueue.songs.forEach(song => {
			totalTime = totalTime + song.rawTime;
		});
		totalTime = Math.round((totalTime / (serverQueue.speed / 100)) - completed);

		// Creates and sends the embed
		let queueEmbed = new Discord.MessageEmbed()
			.setColor(0x1e90ff)
			.setAuthor(`Song Queue`)
			.setTitle(`**Now Playing**: ${serverQueue.songs[0].title} [${time(songTimeLeft)} remaining]`)
			.setThumbnail(serverQueue.songs[0].thumbnail)
			.setDescription(`${serverQueue.songs.map((song, i) => i == 0 ? null: `**${i}.** ${song.title} [${song.timestamp}]`).join(`\n`)}`)
			.addFields(
				{ name: `\u200B`, value: `\u200B` },
				{ name: `**Approximate Time left**`, value: time(totalTime), inline: true },
				{ name: `**Queue Volume**`, value: `${serverQueue.volume}%`, inline:true },
				{ name: `**Channel**`, value: serverQueue.channel.name, inline: true },
				{ name: `**Active Effects**`, value: activeEffects }
			)
			.setTimestamp(new Date());
			
		return message.channel.send(queueEmbed);
	},
}