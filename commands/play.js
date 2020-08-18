const Discord = require(`discord.js`);
const ytdl = require(`ytdl-core`);
const yts = require(`yt-search`);

module.exports = {
	name: `play`,
	description: `Plays a song in a vc.`,
	args: true,
	guildOnly: true,
	cooldown: 3,
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
		if(await ytdl.validateURL(args.slice(0).join(" "))) songInfo = await ytdl.getInfo(args[0]);
		else {
			let pingPong = await yts(args.slice(0).join(" ")); 
			songInfo = await ytdl.getInfo(pingPong.videos[0].url);
		}
		
		const song = {
			id: songInfo.videoDetails.id,
			title: (songInfo.videoDetails.title),
			url: songInfo.videoDetails.video_url,
		}

		if (serverQueue) {
			serverQueue.songs.push(song);

			const queueAddEmbed = new Discord.MessageEmbed()
				.setColor(0x0cdf24)
				.setAuthor(`✅ "${song.title}" has been added to the queue!`)
				.setDescription(song.url)
			return message.channel.send(queueAddEmbed);
		}

		const queueConstruct = {
			textChannel: message.channel,
			channel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true
		}

		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		const play = async song => {
			const queue = message.client.queue.get(message.guild.id);

			if(!song) {
				queue.channel.leave();
				message.client.queue.delete(message.guild.id);
				return;
			}

			const dispatcher = queue.connection.play(ytdl(song.url , { quality: 'lowestaudio' }), {bitrate: 64000 /* 64kbps */})
				.on(`end`, reason => {
					if (reason === `Stream is not generating quickly enough.`) console.log(`Song ended due to stream is not generating quickly enough.`);
					else console.log(reason);
					queue.songs.shift();
					play(queue.songs[0]);
				})
				.on(`error`, error => console.error(error));
			dispatcher.setVolumeLogarithmic(queue.volume / 5);

			const playingEmbed = new Discord.MessageEmbed()
				.setColor(0x5ce6c8)
				.setAuthor(`🎶 Started playing: ${song.title}`)
				.setDescription(song.url)

			queue.textChannel.send(playingEmbed);
		};

		try {
			const connection = await channel.join();
			queueConstruct.connection = connection;
			play(queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			message.client.queue.delete(message.guild.id);
			await channel.leave();
			return message.channel.send(`I could not join the voice channel: ${error}`);
        }  
	},
};