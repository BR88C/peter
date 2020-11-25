/* Manages getting song info and pushing songs to the queue */

const Discord = require(`discord.js`);
const ytdl = require(`discord-ytdl-core`);
const time = require(`../utils/time.js`);

module.exports = {
	/* Gets info for a song to be added to the queue */
    async getSongInfo (songInfo, message) {
		// Sets format and timestamp based on if video is a livestream
		let format;
		let timestamp;
        if(songInfo.videoDetails.isLive) {
			format = ytdl.chooseFormat(songInfo.formats, { isHLS: true }).itag.toString();
			timestamp = `LIVE`
        } else {
			const audioFormats = ytdl.filterFormats(songInfo.formats, `audioonly`);
			format = ytdl.chooseFormat(audioFormats, { quality: `highestaudio` }).itag.toString();
			timestamp = time(songInfo.videoDetails.lengthSeconds);
        }

        return {
			title: songInfo.videoDetails.title.replace(/-|\*|_|\|/g, ` `),
			livestream: songInfo.videoDetails.isLive,
			format,
			url: songInfo.videoDetails.video_url,
			thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
			timestamp,
			rawTime: songInfo.videoDetails.lengthSeconds,
			requestedBy: message.author,
			hidden: false,
			startTime: 0
        };
    },



	/* Adds a song to the queue */
	async queueSong (song, message) {
		const serverQueue = message.client.queue.get(message.guild.id);

		serverQueue.songs.push(song);

		let queueAddEmbed = new Discord.MessageEmbed()
			.setColor(0x0cdf24)
			.setTitle(`✅  "${song.title}" has been added to the queue!`)
			.setImage(song.thumbnail)
			.setDescription(song.url)
			.setFooter(`Requested by: ${song.requestedBy.tag}`)
			.setTimestamp(new Date());
				
		return message.channel.send(queueAddEmbed);
	},



	/* Creates the queue */
	async createQueue (song, message) {
		const { channel } = message.member.voice;

		// Create queue construct
		const queueConstruct = {
			textChannel: message.channel,
			channel,
			connection: null,
			songs: [],
			volume: 100,
			playing: true,
			loop: false,
			bass: 0,
			highpass: 0,
			pitch: 100,
			speed: 100,
			treble: 0,
			vibrato: 0
		}

		// Pushing and playing songs
		message.client.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		// Return queue construct
		return queueConstruct;
	},


	/* Adds a playlist to the queue */
	async queuePlaylist (playlist, message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		
		message.channel.send(`Attempting to queue ${playlist.videos.length + 1} songs...`)

		let songsAdded = 0;
		for(const video of playlist.videos) {
			const songInfo = await ytdl.getInfo(`${video.videoId}`).catch(error => {
				log(error, `red`);
				return message.channel.send(`Error adding ${video.title} to the queue`);
			});

			const song = await this.getSongInfo(songInfo, message);
			await serverQueue.songs.push(song);

			songsAdded++
		}

		message.channel.send(`Successfully queued ${songsAdded + 1} songs!`)
	}
}