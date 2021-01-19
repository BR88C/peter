/* Function to queue a provided playlist */

const Discord = require(`discord.js-light`);
const ytdl = require(`ytdl-core`);
const Song = require(`../Song.js`);

const queuePlaylist = async (playlist, message, serverQueue) => {
    let attemptingToQueueEmbed = new Discord.MessageEmbed()
        .setColor(0xdbbe00)
        .setTitle(`Attempting to queue ${playlist.items.length + 1} songs...`);

    let songsAdded = 0;
    await message.channel.send(attemptingToQueueEmbed).then(async msg => {
        for (const video of playlist.items) {
            const songInfo = await ytdl.getInfo(video.id).catch(error => {
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

    let successfullyQueuedEmbed = new Discord.MessageEmbed()
        .setColor(0x57ff5c)
        .setTitle(`Successfully queued ${songsAdded + 1} songs!`);

    return message.channel.send(successfullyQueuedEmbed);
};

module.exports = queuePlaylist;