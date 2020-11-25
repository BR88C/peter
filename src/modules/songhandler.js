/* Manages getting song info and pushing songs to the queue */

const Discord = require(`discord.js`);
const ytdl = require(`discord-ytdl-core`);
const time = require(`../utils/time.js`);

module.exports = {
    async getSongInfo (songInfo, message) {
		// Sets format based on if video is a livestream
		let format;
        if(songInfo.videoDetails.isLive) {
			format = ytdl.chooseFormat(songInfo.formats, { isHLS: true }).itag.toString();
			console.log(format)
        } else {
			const audioFormats = ytdl.filterFormats(songInfo.formats, `audioonly`);
            format = ytdl.chooseFormat(audioFormats, { quality: `highest` });
        }

        return {
			title: songInfo.videoDetails.title.replace(/-|\*|_|\|/g, ` `),
			livestream: songInfo.videoDetails.isLive,
			format,
			url: songInfo.videoDetails.video_url,
			thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
			timestamp: time(songInfo.videoDetails.lengthSeconds),
			rawTime: songInfo.videoDetails.lengthSeconds,
			requestedBy: message.author,
			hidden: false,
			startTime: 0
        };
    },

	async queueSong (song, message, serverQueue) {
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

	async createQueue (message, channel, song) {
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
	}
}