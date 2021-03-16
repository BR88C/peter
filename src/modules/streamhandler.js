/* Handles creating and running a stream for a specified song, restarting streams, and pushing the queue when a song ends */

const Discord = require(`discord.js-light`);
const ytdl = require(`ytdl-core`);
const {
    FFmpeg,
    opus
} = require(`prism-media`);
const {
    pipeline
} = require(`stream`);
const log = require(`./log.js`);
const requestHeaders = require(`./requestHeaders.js`);
const randomInt = require(`../utils/randomInt.js`);

const streamhandler = {
    /**
     * Stream a song to a VC
     * 
     * @param {object} song Song object to play
     * @param {object} message Message sent that queued song
     */
    async play (song, message) {
        const serverQueue = message.client.queue.get(message.guild.id);

        // Return if song isn't defined, unless the queue is being looped
        if (!song) {
            if (serverQueue && serverQueue.loop === `queue` && serverQueue.songs[0]) {
                for (const song of serverQueue.songs) {
                    song.startTime = 0;
                    song.hidden = false;
                }
                serverQueue.currentSong = 0;
                song = serverQueue.songs[0];
            } else {
                return;
            }
        }

        // If server queue is not defined, return
        if (!serverQueue) return;

        // Create ytdl stream
        const ytdlStream = ytdl(song.url, {
            highWaterMark: 1 << 19,
            quality: song.format,
            requestOptions: requestHeaders.checkHeaders() ? requestHeaders.getHeaders() : undefined
        });

        // Create ffmpeg encoder arguments
        const ffmpegArgs = [
            `-ss`, song.startTime.toString(),
            `-analyzeduration`, `0`,
            `-loglevel`, `0`,
            `-f`, `s16le`,
            `-ar`, `48000`,
            `-ac`, `2`
        ];
        let sfxArgs = serverQueue.effectsString(`ffmpeg`);

        // Create ffmpeg transcoder
        const transcoder = new FFmpeg({
            args: sfxArgs.length !== 0 ? ffmpegArgs.concat([`-af`, sfxArgs]) : ffmpegArgs,
            shell: false
        });

        // Create opus transcoder
        const opusTranscoder = new opus.Encoder({
            rate: 48000,
            channels: 2,
            frameSize: 960
        });

        // Create stream
        const stream = pipeline(ytdlStream, transcoder, opusTranscoder, (error) => {
            if (error && error.message !== `Premature close`) log(error, `red`);
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
                    .setTitle(`An unknown error occured. If the problem persists please report the issue in the support server.`)
                    .setDescription(`Link: ${message.client.config.links.supportServer}`);

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
        const nowPlayingEmojis = [message.client.config.emojis.nowPlaying, message.client.config.emojis.conga, message.client.config.emojis.catjam, message.client.config.emojis.pepedance, message.client.config.emojis.pepejam, message.client.config.emojis.peepojam]
        const nowPlayingEmoji = await emojiGuild.emojis.fetch(nowPlayingEmojis[randomInt(0, nowPlayingEmojis.length - 1)]);

        let playingEmbed = new Discord.MessageEmbed()
            .setColor(0x5ce6c8)
            .setTitle(`${nowPlayingEmoji}  Started playing: ${song.title}`)
            .setImage(song.thumbnail)
            .setDescription(`**Link:** ${song.url}`)
            .setFooter(`Requested by: ${song.requestedBy}`)
            .setTimestamp(new Date());

        if (!serverQueue.songs[serverQueue.currentSong].hidden) serverQueue.textChannel.send(playingEmbed);
    },

    /**
     * Restarts a stream at a specified time
     * 
     * @param {object} serverQueue Server queue object
     * @param {number} startTime Time to start stream at
     */
    async restartStream (serverQueue, startTime) {
        if (!serverQueue.songs[serverQueue.currentSong].livestream) serverQueue.songs[serverQueue.currentSong].startTime = startTime;
        serverQueue.songs[serverQueue.currentSong].hidden = true;
        if (serverQueue.loop !== `single`) serverQueue.currentSong--;
        serverQueue.connection.dispatcher.end();
    }
};

module.exports = streamhandler;