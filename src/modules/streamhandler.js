/* Handles creating and running a stream for a specified song, restarting streams, and pushing the queue when a song ends */

const Discord = require(`discord.js-light`);
const ytdl = require(`discord-ytdl-core`);
const log = require(`./log.js`);

module.exports = {
    async play (song, message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        // Return if song isn't defined, unless the queue is being looped
        if (!song) {
            if (serverQueue && serverQueue.loop === `queue` && serverQueue.songs[0]) {
                serverQueue.songs.forEach(song => {
                    song.startTime = 0;
                    song.hidden = false
                });
                serverQueue.currentSong = 0;
                song = serverQueue.songs[0];
            } else {
                return;
            }
        }

        if (!serverQueue) return;


        // Create ffmpeg encoder arguments
        let sfxArgs = [];
        if (serverQueue.bass !== 0) sfxArgs.push(`bass=g=${serverQueue.bass / 2}`);
        if (serverQueue.flanger !== 0) sfxArgs.push(`flanger=depth=${serverQueue.flanger / 10}`);
        if (serverQueue.highpass !== 0) sfxArgs.push(`highpass=f=${serverQueue.highpass * 25}`);
        if (serverQueue.lowpass !== 0) sfxArgs.push(`lowpass=f=${2000 - serverQueue.lowpass * 16}`);
        if (serverQueue.phaser !== 0) sfxArgs.push(`aphaser=decay=${serverQueue.phaser / 200}`);
        if (serverQueue.pitch !== 100) sfxArgs.push(`rubberband=pitch=${serverQueue.pitch / 100}`);
        if (serverQueue.speed !== 100 && !song.livestream) sfxArgs.push(`atempo=${serverQueue.speed / 100}`);
        if (serverQueue.treble !== 0) sfxArgs.push(`treble=g=${serverQueue.treble / 3}`);
        if (serverQueue.vibrato !== 0) sfxArgs.push(`vibrato=d=${serverQueue.vibrato / 100}`);


        // Create stream
        const stream = ytdl(song.url, {
            seek: song.startTime,
            opusEncoded: true,
            highWaterMark: 1 << 20,
            quality: song.format,
            encoderArgs: sfxArgs[0] ? [`-af`, sfxArgs.join(`, `)] : undefined,
            requestOptions: {
                headers: {
                    cookie: process.env.COOKIE
                }
            }
        });


        // Play the stream
        const dispatcher = serverQueue.connection.play(stream, {
                type: `opus`,
                bitrate: serverQueue.bitrate
            })
            // When the song ends
            .on(`finish`, reason => {
                if (stream) stream.emit(`close`);
                if (serverQueue.loop === `single` && !serverQueue.songs[serverQueue.currentSong].livestream) {
                    serverQueue.songs[serverQueue.currentSong].startTime = 0;
                    serverQueue.songs[serverQueue.currentSong].hidden = false;
                    this.play(serverQueue.songs[serverQueue.currentSong], message);
                } else {
                    serverQueue.currentSong++;
                    this.play(serverQueue.songs[serverQueue.currentSong], message);
                }
            })
            // If there is an error leave the vc and report to the user
            .on(`error`, async error => {
                log(error, `red`);

                let errorEmbed = new Discord.MessageEmbed()
                    .setColor(0xff4a4a)
                    .setTitle(`An unknown error occured. If the problem persists please\n report the issue on GitHub or on the support server.`);

                if (serverQueue) {
                    serverQueue.textChannel.send(errorEmbed);
                    if (serverQueue.connection.dispatcher) {
                        if (serverQueue.connection.dispatcher.streams && serverQueue.connection.dispatcher.streams.input) await serverQueue.connection.dispatcher.streams.input.emit(`close`);
                        serverQueue.connection.dispatcher.destroy();
                    }
                    if (serverQueue.songs) serverQueue.songs = [];
                }
                if (message.client.queue) message.client.queue.delete(message.guild.id);
                if (message.guild.voice.connection.channel) message.guild.voice.connection.channel.leave();
            });


        serverQueue.connection.on(`disconnect`, () => {
            if (stream) stream.emit(`close`);
        });

        // Setting volume
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 250);

        // Get emojis
        const emojiGuild = message.client.guilds.forge(message.client.config.emojiGuild);
        const nowPlaying = await emojiGuild.emojis.fetch(message.client.config.emojis.nowPlaying);

        let playingEmbed = new Discord.MessageEmbed()
            .setColor(0x5ce6c8)
            .setTitle(`${nowPlaying}  Started playing: ${song.title}`)
            .setImage(song.thumbnail)
            .setDescription(`**Link:** ${song.url}`)
            .setFooter(`Requested by: ${song.requestedBy.tag}`)
            .setTimestamp(new Date());

        if (!serverQueue.songs[serverQueue.currentSong].hidden) serverQueue.textChannel.send(playingEmbed);
    },

    /* Restarts a stream at a specified time */
    async restartStream (serverQueue, startTime) {
        if (!serverQueue.songs[serverQueue.currentSong].livestream) serverQueue.songs[serverQueue.currentSong].startTime = startTime;
        serverQueue.songs[serverQueue.currentSong].hidden = true;
        if (serverQueue.loop !== `single`) serverQueue.currentSong--;
        serverQueue.connection.dispatcher.end();
    }
}