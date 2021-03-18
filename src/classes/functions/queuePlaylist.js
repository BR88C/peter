const Discord = require(`discord.js-light`);
const ytdl = require(`ytdl-core`);
const log = require(`../../modules/log.js`);
const Song = require(`../Song.js`);
const requestHeaders = require(`../../modules/requestHeaders.js`);

/**
 * Adds songs within a playlist to the queue
 *
 * @param {object} playlist Playlist object from ytpl to queue
 * @param {object} message The message that requested the playlist
 * @param {object} serverQueue Server queue object (this)
 */
const queuePlaylist = async (playlist, message, serverQueue) => {
    let attemptingToQueueEmbed = new Discord.MessageEmbed()
        .setColor(0xdbbe00)
        .setTitle(`Attempting to queue ${playlist.items.length + 1} songs...`);

    let queueDeletedEmbed = new Discord.MessageEmbed()
        .setColor(0xff4a4a)
        .setTitle(`Stopped queuing playlist due to server queue being deleted.`);

    let songsAdded = 0;
    let lastEdit = 0;
    let success = true;
    await message.channel.send(attemptingToQueueEmbed).then(async msg => {
        for (const video of playlist.items) {
            if (!message.client.queue.get(message.guild.id)) {
                message.channel.send(queueDeletedEmbed);
                await msg.delete().catch((error) => log(error, `red`));
                return success = false;
            }

            const songInfo = await ytdl.getInfo(video.id, {
                requestOptions: requestHeaders.checkHeaders() ? requestHeaders.getHeaders() : undefined
            }).catch((error) => log(error, `red`));

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

            if (Date.now() - lastEdit > 1e3) {
                lastEdit = Date.now();
                msg.edit(attemptingToQueueEmbed);
            }
        }

        await msg.delete().catch((error) => log(error, `red`));
    });

    if (success) {
        let successfullyQueuedEmbed = new Discord.MessageEmbed()
            .setColor(0x57ff5c)
            .setTitle(`Successfully queued ${songsAdded + 1} songs!`);

        message.channel.send(successfullyQueuedEmbed);
    }
};

module.exports = queuePlaylist;
