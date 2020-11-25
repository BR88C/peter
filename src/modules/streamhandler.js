/* Handles creating and running a stream for a specified song, as well as pushing the queue and handling errors */

const Discord = require(`discord.js`);
const ytdl = require(`discord-ytdl-core`);
const log = require(`./log.js`);

module.exports = (songToPlay, message) => {
    async function play (song) {
        const queue = message.client.queue.get(message.guild.id);
        const serverQueue = message.client.queue.get(message.guild.id);

        // Return if song isn't defined
        if(!song) return queue.songs = [];

        // Create ffmpeg encoder arguments
        let sfxArgs = [];
        if(queue.bass !== 0) sfxArgs.push(`bass=g=${queue.bass / 2}`);
        if(queue.highpass !== 0) sfxArgs.push(`highpass=f=${queue.highpass * 25}, volume=${queue.highpass / 15}`);
        if(queue.pitch !== 100) sfxArgs.push(`rubberband=pitch=${queue.pitch / 100}`);
        if(queue.speed !== 100) sfxArgs.push(`atempo=${queue.speed / 100}`);
        if(queue.treble !== 0) sfxArgs.push(`treble=g=${queue.treble / 3}`);
        if(queue.vibrato !== 0) sfxArgs.push(`vibrato=d=${queue.vibrato / 100}`);


        // Create stream
        let stream;
        if(sfxArgs[0] && !song.livestream) {
            stream = ytdl(song.url, {
                seek: song.startTime,
                opusEncoded: true,
                highWaterMark: 1<<25,
                quality: song.format,
                encoderArgs: [`-af`, sfxArgs.join(`, `)]
            });
        } else {
            stream = ytdl(song.url, {
                seek: song.startTime,
                opusEncoded: true,
                highWaterMark: 1<<25,
                quality: song.format
            });
        }

        // Play the stream
        const dispatcher = queue.connection.play(stream, { type: `opus`, bitrate: 64 /* 64kbps */ })
            // When the song ends
            .on(`finish`, reason => {
                if(serverQueue.loop) {
                    queue.songs[0].startTime = 0;
                    queue.songs[0].hidden = false;
                    play(queue.songs[0]);
                } else {
                    queue.songs.shift();
                    play(queue.songs[0]);
                }
            })
            // If there is an error leave the vc and report to the user
            .on(`error`, error => {
                log(error, `red`);

                let errorEmbed = new Discord.MessageEmbed()
                    .setColor(0xff4a4a)
                    .setTitle(`An unknown error occured. If the problem persists please\n report the issue on GitHub or on the support server.`);

                if(serverQueue) queue.textChannel.send(errorEmbed);

                if(message.guild.voice.connection) {
                    if(serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.destroy();
                    if(message.client.queue) message.client.queue.delete(message.guild.id);
                    message.member.voice.channel.leave();
                } else {
                    if(serverQueue.songs) serverQueue.songs = [];
                    if(message.client.queue) message.client.queue.delete(message.guild.id);
                }
            });
            
        // Setting volume
        dispatcher.setVolumeLogarithmic(queue.volume / 250);

        let playingEmbed = new Discord.MessageEmbed()
            .setColor(0x5ce6c8)
            .setTitle(`🎶  Started playing: ${song.title}`)
            .setImage(song.thumbnail)
            .setDescription(song.url)
            .setFooter(`Requested by: ${song.requestedBy.tag}`)
            .setTimestamp(new Date());

        if(!queue.songs[0].hidden) queue.textChannel.send(playingEmbed);
    }

    play(songToPlay);
}