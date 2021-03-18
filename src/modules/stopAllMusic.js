const Discord = require(`discord.js-light`);

/**
 * Stop all music playing within a client
 *
 * @param {Object} client Client object
 * @returns {Promise} Promise
 */
const stopAllMusic = (client) => new Promise((resolve) => {
    if (client.queue.size === 0) resolve();

    let guildIndex = 0;
    client.queue.forEach(async (serverQueue) => {
        if (serverQueue.songs) {
            for (const song of serverQueue.songs) {
                if (song.stream !== null) {
                    if (typeof song.stream.destroy === `function`) song.stream.destroy();
                    song.stream = null;
                }
            }
        }

        if (serverQueue.connection && serverQueue.connection.channel) serverQueue.connection.channel.leave();

        if (serverQueue.textChannel) {
            const emojiGuild = client.guilds.forge(client.config.emojiGuild);
            const loadingEmoji = await emojiGuild.emojis.fetch(client.config.emojis.loading);

            let leaveEmbed = new Discord.MessageEmbed()
                .setColor(0xff4a4a)
                .setTitle(`${loadingEmoji}  Peter is currently restarting. Music stopped.`);

            await serverQueue.textChannel.send(leaveEmbed);
        }

        guildIndex++;
        if (guildIndex >= client.queue.size) resolve();
    });
});

module.exports = stopAllMusic;
