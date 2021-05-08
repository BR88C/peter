const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const progressBar = require(`../../utils/progressBar.js`);
const currentTime = require(`../../utils/currentTime.js`);
const randomInt = require(`../../utils/randomInt.js`);
const createTimestamp = require("../../utils/createTimestamp.js");

module.exports = {
    name: `nowplaying`,
    description: `Replies with the song currently playing`,
    guildOnly: true,
    aliases: [`np`],

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        // If the queue is empty reply with an error.
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.channel.send(`There is nothing playing.`);

        // Sets the description field based on if the song is a livestream or not.
        let description;
        if (serverQueue.songs[serverQueue.currentSong].livestream) {
            description = `🔴  **LIVE**`;
        } else {
            const completed = currentTime(serverQueue);
            const percentComplete = completed / serverQueue.songs[serverQueue.currentSong].videoLength;

            const playingEmoji = serverQueue.paused ? `⏸`  : `▶`;
            const timestamp = serverQueue.songs[serverQueue.currentSong].livestream ? `LIVE` : createTimestamp(serverQueue.songs[serverQueue.currentSong].videoLength);

            description = `\`\`\`${playingEmoji} ${createTimestamp(completed)} ${progressBar(percentComplete, 25)} ${timestamp}\`\`\``;
        }

        // Get emojis.
        const emojiGuild = message.client.guilds.forge(message.client.config.emojiGuild);
        const nowPlayingEmojis = [message.client.config.emojis.notes, message.client.config.emojis.conga, message.client.config.emojis.catjam, message.client.config.emojis.pepedance, message.client.config.emojis.pepejam, message.client.config.emojis.peepojam];
        const nowPlayingEmoji = await emojiGuild.emojis.fetch(nowPlayingEmojis[randomInt(0, nowPlayingEmojis.length - 1)]);

        // Create embed.
        const nowPlayingEmbed = new Discord.MessageEmbed()
            .setColor(0xb0ffe2)
            .setAuthor(`🎶 Currently playing:`)
            .setTitle(`${nowPlayingEmoji}  **${serverQueue.songs[serverQueue.currentSong].title}**  ${nowPlayingEmoji}`)
            .setURL(serverQueue.songs[serverQueue.currentSong].url)
            .setDescription(description)
            .setThumbnail(serverQueue.songs[serverQueue.currentSong].thumbnail)
            .setFooter(`Requested by: ${serverQueue.songs[serverQueue.currentSong].requestedBy}`)
            .setTimestamp(new Date());

        // Send Embed.
        return message.channel.send(nowPlayingEmbed);
    }
};
