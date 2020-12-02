/* Manages getting song info and pushing songs to the queue */

const Discord = require(`discord.js`);
const ytdl = require(`discord-ytdl-core`);
const currentTime = require(`../utils/currentTime.js`);
const time = require(`../utils/time.js`);

module.exports = {
    /* Gets info for a song to be added to the queue */
    async getSongInfo (songInfo, message) {
        // Sets format and timestamp based on if video is a livestream
        let format;
        let timestamp;
        if (songInfo.videoDetails.isLive) {
            format = ytdl.chooseFormat(songInfo.formats, {
                isHLS: true
            }).itag.toString();

            timestamp = `LIVE`
        } else {
            const audioFormats = ytdl.filterFormats(songInfo.formats, `audioonly`);
            format = ytdl.chooseFormat(audioFormats, {
                quality: `highestaudio`
            }).itag.toString();
            timestamp = time(songInfo.videoDetails.lengthSeconds);
        }

        return {
            title: songInfo.videoDetails.title.replace(/-|\*|_|\|/g, ` `),
            livestream: songInfo.videoDetails.isLive,
            format,
            url: songInfo.videoDetails.video_url,
            thumbnail: songInfo.videoDetails.thumbnail.thumbnails[0].url,
            timestamp,
            rawTime: parseInt(songInfo.videoDetails.lengthSeconds),
            requestedBy: message.author,
            hidden: false,
            startTime: 0
        };
    },



    /* Adds a song to the queue */
    async queueSong (song, message, hidden) {
        const serverQueue = message.client.queue.get(message.guild.id);

        serverQueue.songs.push(song);

        const songIndex = serverQueue.songs.indexOf(song);
        const songsBefore = serverQueue.songs.slice(serverQueue.currentSong, songIndex);

        const completed = currentTime(serverQueue);
        let timeUntilPlayed = 0;
        songsBefore.forEach(song => {
            timeUntilPlayed += song.rawTime;
        })
        timeUntilPlayed = Math.round((timeUntilPlayed / (serverQueue.speed / 100)) - completed);

        if (!hidden) {
            let queueAddEmbed = new Discord.MessageEmbed()
                .setColor(0x0cdf24)
                .setTitle(`✅  "${song.title}" has been added to the queue!`)
                .setImage(song.thumbnail)
                .addFields({
                    name: `**Position in Queue**`,
                    value: songsBefore.length,
                    inline: true
                }, {
                    name: `**Time until Played**`,
                    value: time(timeUntilPlayed),
                    inline: true
                }, {
                    name: `**URL**`,
                    value: `[Link](${song.url})`,
                    inline: true
                }, )
                .setFooter(`Requested by: ${song.requestedBy.tag}`)
                .setTimestamp(new Date());

            // Send the message and add reation options
            return message.channel.send(queueAddEmbed).then(async msg => {
                await msg.react(`⏭️`);
                await msg.react(`❌`);

                const filter = (reaction, user) => [`⏭️`, `❌`].includes(reaction.emoji.name) && user.id !== msg.author.id;

                msg.awaitReactions(filter, {
                    max: 1,
                    time: 30000,
                    errors: [`time`]
                }).then(async collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === `⏭️`) {
                        serverQueue.currentSong = songIndex;
                        if (serverQueue.loop !== `single`) serverQueue.currentSong--;
                        serverQueue.connection.dispatcher.end();

                        let skippedToEmbed = new Discord.MessageEmbed()
                            .setColor(0x9cd6ff)
                            .setTitle(`⏭️  Skipped to **${serverQueue.songs[songIndex].title}**!`);

                        msg.delete();
                        return message.channel.send(skippedToEmbed);

                    } else if (reaction.emoji.name === `❌`) {
                        const song = serverQueue.songs.splice(songIndex, 1);

                        let removeEmbed = new Discord.MessageEmbed()
                            .setColor(0xff668a)
                            .setTitle(`❌  Removed **${song[0].title}** from the queue!`);

                        msg.delete();
                        return message.channel.send(removeEmbed);
                    }
                }).catch(error => {
                    msg.reactions.removeAll();
                });
            });
        }

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
            currentSong: 0,
            volume: 100,
            playing: true,
            loop: `off`,
            twentyFourSeven: false,
            bass: 0,
            flanger: 0,
            highpass: 0,
            lowpass: 0,
            phaser: 0,
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

        let attemptingToQueueEmbed = new Discord.MessageEmbed()
            .setColor(0xdbbe00)
            .setTitle(`Attempting to queue ${playlist.videos.length + 1} songs...`);

        message.channel.send(attemptingToQueueEmbed);

        let songsAdded = 0;
        for (const video of playlist.videos) {
            const songInfo = await ytdl.getInfo(`${video.videoId}`).catch(error => {
                log(error, `red`);
                return message.channel.send(`Error adding ${video.title} to the queue`);
            });

            const song = await this.getSongInfo(songInfo, message);
            await serverQueue.songs.push(song);

            songsAdded++
        }

        let successfullyQueuedEmbed = new Discord.MessageEmbed()
            .setColor(0x57ff5c)
            .setTitle(`Successfully queued ${songsAdded + 1} songs!`);

        return message.channel.send(successfullyQueuedEmbed);
    }
}