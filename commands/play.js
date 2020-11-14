const Discord = require(`discord.js`);
const ytdl = require(`discord-ytdl-core`);
const yts = require(`yt-search`);
const log = require(`../utils/log.js`);
const time = require(`../utils/time.js`);
const songhandler = require(`../utils/songhandler.js`);

module.exports = {
	name: `play`,
	description: `Plays a song in a vc.`,
	category: `Music`,
	args: true,
	guildOnly: true,
	cooldown: 5,
	aliases: [`p`],
	usage: `[search query] or [url]`,
	async execute(client, message, args) {
		// Checks if user is in vc
		const { channel } = message.member.voice;
		if(!channel) return message.reply(`you need to be in a voice channel to play music!`);

		const permissions = channel.permissionsFor(message.client.user);

		// If the bot does not have permissions
		if(!permissions.has(`CONNECT`)) return message.reply(`I cannot connect to your voice channel, make sure I have the proper permissions!`);
		if(!permissions.has(`SPEAK`)) return message.reply(`I cannot speak in this voice channel, make sure I have the proper permissions!`);

		let errorEmbed = new Discord.MessageEmbed()
                .setColor(0xff4a4a)
                .setTitle(`An unknown error occured. If the problem persists please\n report the issue on GitHub or on the support server.`);

		// Defines the server queue
		const serverQueue = message.client.queue.get(message.guild.id);

		// Define songInfo
		let songInfo;

		// Checks if the arguments provided is a url
		if(await ytdl.validateURL(args.slice(0).join(` `))) { 
			// Set songIngo
			songInfo = await ytdl.getInfo(args[0]).catch(error => {
				console.error(error);
				return message.channel.send(errorEmbed);
			});
		
		// If the arguments provided are not a url, search youtube for a video
		} else {
			const ytsResult = await yts(args.slice(0).join(` `));
			const ytsVideo = await ytsResult.videos.slice(0, 1);

			// Checks to see if video was found
			if(!ytsVideo[0]) return message.reply(`I couldn't find anything based on your query!`);

			// Set songInfo
			songInfo = await ytdl.getInfo(ytsVideo[0].url).catch(error => {
				console.error(error);
				return message.channel.send(errorEmbed);
			});
		}

		// Defines song info
		const song = {
			title: songInfo.videoDetails.title.replace(/-|\*|_|\|/g, ` `),
			url: songInfo.videoDetails.video_url,
			thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
			timestamp: time(songInfo.videoDetails.lengthSeconds),
			rawTime: songInfo.videoDetails.lengthSeconds,
			requestedBy: message.author,
			hidden: false,
			startTime: 0
		}
		
		// Adding songs to the queue
		if (serverQueue) {
			serverQueue.songs.push(song);

			let queueAddEmbed = new Discord.MessageEmbed()
				.setColor(0x0cdf24)
				.setAuthor(`✅ "${song.title}" has been added to the queue!`)
				.setImage(song.thumbnail)
				.setDescription(song.url)
				.setFooter(`Requested by: ${song.requestedBy.tag}`)
				.setTimestamp(new Date());
				
			return message.channel.send(queueAddEmbed);
		}

		// Define queue construct
		const queueConstruct = {
			textChannel: message.channel,
			channel,
			connection: null,
			songs: [],
			volume: 100,
			playing: true,
			bass: 0,
			pitch: 100,
			speed: 100,
			vibrato: 0
		}

		// Pushing and playing songs
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		// Join vc and play music
		try {
			const connection = await channel.join();
			const queue = message.client.queue.get(message.guild.id);
			queueConstruct.connection = connection;
			connection.voice.setSelfDeaf(true);
			songhandler(queueConstruct.songs[0], message);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			return message.reply(`I could not join the voice channel: ${error}`);
        }  
	},
}