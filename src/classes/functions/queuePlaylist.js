/* Function to queue a provided playlist */

const Discord = require(`discord.js-light`);
const ytdl = require(`ytdl-core`);
const Song = require(`../Song.js`);

const queuePlaylist = async (playlist, message, serverQueue) => {
    let attemptingToQueueEmbed = new Discord.MessageEmbed()
        .setColor(0xdbbe00)
        .setTitle(`Attempting to queue ${playlist.items.length + 1} songs...`);

    let queueDeletedEmbed = new Discord.MessageEmbed()
        .setColor(0xff4a4a)
        .setTitle(`Stopped queuing playlist due to server queue being deleted.`);

    let songsAdded = 0;
    let success = true;
    await message.channel.send(attemptingToQueueEmbed).then(async msg => {
        for (const video of playlist.items) {
            if (!message.client.queue.get(message.guild.id)) {
                message.channel.send(queueDeletedEmbed);
                await msg.delete();
                return success = false;
            }

            const songInfo = await ytdl.getInfo(video.id, {
                requestOptions: !process.env.COOKIE || !process.env.YOUTUBE_IDENTITY_TOKEN ? undefined : {
                    headers: {
                        cookie: process.env.COOKIE,
                        'x-youtube-identity-token': process.env.YOUTUBE_IDENTITY_TOKEN
                    }
                }
            }).catch(error => {
                log(error, `red`);
            });

            if (!songInfo) {
                message.channel.send(`*Error adding "${video.title}" to the queue!*`);
                continue;
            }

            const song = new Song(songInfo, message.author);
            if (!song) {
                message.channel.send(`*Error adding "${video.title}" to the queue!*`);
                continue;
            }

            await serverQueue.songs.push(song);

            songsAdded++;

            let attemptingToQueueEmbed = new Discord.MessageEmbed()
                .setColor(0xdbbe00)
                .setTitle(`Queued ${songsAdded}/${playlist.items.length + 1} songs...`);

            await msg.edit(attemptingToQueueEmbed);
        }

        await msg.delete();
    });

    if (success) {
        let successfullyQueuedEmbed = new Discord.MessageEmbed()
            .setColor(0x57ff5c)
            .setTitle(`Successfully queued ${songsAdded + 1} songs!`);

        message.channel.send(successfullyQueuedEmbed);
    }

    return;
};

module.exports = queuePlaylist;