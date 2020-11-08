const Discord = require(`discord.js`);
const ytdl = require(`ytdl-core`);
const yts = require(`yt-search`);

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
		if(!channel) return message.channel.send(`I'm sorry but you need to be in a voice channel to play music!`);

		const permissions = channel.permissionsFor(message.client.user);

		// If the bot does not have permissions
		if(!permissions.has(`CONNECT`)) return message.channel.send(`I cannot connect to your voice channel, make sure I have the proper permissions!`);
		if(!permissions.has(`SPEAK`)) return message.channel.send(`I cannot speak in this voice channel, make sure I have the proper permissions!`);

		// Defines the server queue
		const serverQueue = message.client.queue.get(message.guild.id);
		let songInfo;
		// Checks if the arguments provided is a url
		if(await ytdl.validateURL(args.slice(0).join(` `))) { 
			songInfo = await ytdl.getInfo(args[0]);
		// If the arguments provided are not a url, search youutbe for a video
		} else {
			const ytsResult = await yts(args.slice(0).join(` `));
			const ytsVideo = await ytsResult.videos.slice( 0, 1 );
			// Checks to see if video was found
			if(!ytsVideo[0]) {
				return message.reply(`I couldn't find anything based on your query!`);
			}
			songInfo = await ytdl.getInfo(ytsVideo[0].url);
		}
		
		// Get time
		const hours = Math.floor(songInfo.videoDetails.lengthSeconds / 60 / 60);
		const minutes = Math.floor(songInfo.videoDetails.lengthSeconds / 60) - (hours * 60);
		const seconds = songInfo.videoDetails.lengthSeconds % 60;
		var videoTime;
		if(hours > 0) {
			videoTime = hours.toString() + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
		} else {
			videoTime = minutes.toString()+ ':' + seconds.toString().padStart(2, '0');
		}

		// Defines song info
		const song = {
			title: songInfo.videoDetails.title.replace(/-|\*|_|\|/g, ` `),
			url: songInfo.videoDetails.video_url,
			thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
			timestamp: videoTime
		}
		
		// Adding songs to the queue
		if (serverQueue) {
			serverQueue.songs.push(song);

			let queueAddEmbed = new Discord.MessageEmbed()
				.setColor(0x0cdf24)
				.setAuthor(`✅ "${song.title}" has been added to the queue!`)
				.setImage(song.thumbnail)
				.setDescription(song.url)
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
			loop: false
		}

		// Pushing and playing songs
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);
		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);

			if(!song) {
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection.play(ytdl(song.url, { type: `opus` }, {filter: `audioonly`}, { highWaterMark: 1<<25 }), { bitrate: 64 /* 64kbps */ })
				// When the song ends
				.on(`finish`, reason => {
					if (reason === `Stream is not generating quickly enough.`) console.log(`Song ended due to stream is not generating quickly enough.`);
					// Checks if song needs to be looped
					if(queue.loop === false) {
						queue.songs.shift();
						play(queue.songs[0]);
					} else if(queue.loop === true) {
						play(queue.songs[0]);
					}
				})
				.on(`error`, error => console.error(error));
			// Setting volume
			dispatcher.setVolumeLogarithmic(queue.volume / 250);

			// Now playing embed
			let playingEmbed = new Discord.MessageEmbed()
				.setColor(0x5ce6c8)
				.setAuthor(`🎶 Started playing: ${song.title}`)
				.setImage(song.thumbnail)
				.setDescription(song.url)

			queue.textChannel.send(playingEmbed);
		};

		// Join vc and play music
		try {
			const connection = await channel.join();
			queueConstruct.connection = connection;
			connection.voice.setSelfDeaf(true);
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			return message.channel.send(`I could not join the voice channel: ${error}`);
        }  
	},
}