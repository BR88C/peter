const Discord = require(`discord.js`);
const ytdl = require(`discord-ytdl-core`);
const log = require(`../utils/log.js`);

module.exports = (song, message) => {
    const play = async (song) => {
        const queue = message.client.queue.get(message.guild.id);
        const serverQueue = message.client.queue.get(message.guild.id);

        if(!song) {
            return message.client.queue.delete(message.guild.id);
        }

        const stream = ytdl(song.url, {
            seek: song.startTime,
            filter: "audioonly",
            opusEncoded: true,
            //highWaterMark: 1<<25,
            encoderArgs: [`-af`, `bass=g=${queue.bass / 3}, vibrato=d=${queue.vibrato / 100}, atempo=${queue.speed / 100}, rubberband=pitch=${queue.pitch / 100}`]
        })

        const dispatcher = queue.connection.play(stream, { type: `opus`, bitrate: 64 /* 64kbps */ })
            // When the song ends
            .on(`finish`, reason => {
                if (reason === `Stream is not generating quickly enough.`) log(`Song ended due to stream is not generating quickly enough.`, `red`);
                queue.songs.shift();
                play(queue.songs[0]);
            })
            // If there is an error leave the vc and report to the user
            .on(`error`, error => {
                console.error(error);

                let errorEmbed = new Discord.MessageEmbed()
                    .setColor(0xff4a4a)
                    .setTitle(`An unknown error occured. If the problem persists please\n report the issue on GitHub or on the support server.`)

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
        dispatcher.setVolumeLogarithmic(queue.volume / 150);

        let playingEmbed = new Discord.MessageEmbed()
            .setColor(0x5ce6c8)
            .setAuthor(`🎶 Started playing: ${song.title}`)
            .setImage(song.thumbnail)
            .setDescription(song.url)
            .setFooter(`Requested by: ${song.requestedBy.tag}`)
            .setTimestamp(new Date());

        if(!queue.songs[0].hidden) {
            queue.textChannel.send(playingEmbed);
        }
    };
    play(song);
}