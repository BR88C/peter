const Discord = require(`discord.js`);
const ytdl = require(`ytdl-core`);
const ytsr = require(`ytsr`);

module.exports = {
	name: `play`,
	description: `Plays a song in a vc.`,
	args: true,
	guildOnly: true,
	cooldown: 2,
	aliases: [`p`],
	usage: `[search query] or [url]`,
	async execute(client, message, args) {
		const { channel } = message.member.voice;
		if(!channel) return message.channel.send(`I'm sorry but you need to be in a voice channel to play music!`);

		const permissions = channel.permissionsFor(message.client.user);

		if(!permissions.has(`CONNECT`)) return message.channel.send(`I cannot connect to your voice channel, make sure I have the proper permissions!`);
		if(!permissions.has(`SPEAK`)) return message.channel.send(`I cannot speak in this voice channel, make sure I have the proper permissions!`);

		const serverQueue = message.client.queue.get(message.guild.id);
		let songInfo;
		if(await ytdl.validateURL(args.slice(0).join(` `))) songInfo = await ytdl.getInfo(args[0]);
		else {
			let ytsrResult = await ytsr(args.slice(0).join(` `), {limit: 1}); 
			songInfo = await ytdl.getInfo(ytsrResult.items[0].link);
		}
		
		const song = {
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
			thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url
		}
		
		if (serverQueue) {
			serverQueue.songs.push(song);

			const queueAddEmbed = new Discord.MessageEmbed()
				.setColor(0x0cdf24)
				.setAuthor(`✅ "${song.title}" has been added to the queue!`)
				.setImage(song.thumbnail)
				.setDescription(song.url)
			return message.channel.send(queueAddEmbed);
		}

		const queueConstruct = {
			textChannel: message.channel,
			channel,
			connection: null,
			songs: [],
			volume: 100,
			playing: true
		}

		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);

			if(!song) {
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection.play(ytdl(song.url , { type: 'opus' }), {bitrate: 64 /* 64kbps */}, { highWaterMark : 50 })
				.on(`finish`, reason => {
					if (reason === `Stream is not generating quickly enough.`) console.log(`Song ended due to stream is not generating quickly enough.`);
					queue.songs.shift();
					play(queue.songs[0]);
				})
				.on(`error`, error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 250);

			const playingEmbed = new Discord.MessageEmbed()
				.setColor(0x5ce6c8)
				.setAuthor(`🎶 Started playing: ${song.title}`)
				.setImage(song.thumbnail)
				.setDescription(song.url)

			queue.textChannel.send(playingEmbed);
		};

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
};