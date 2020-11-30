const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);
const time = require(`../utils/time.js`)
const progressbar = require(`../utils/progressbar.js`);
const currentTime = require(`../utils/currentTime.js`);

module.exports = {
    name: `nowplaying`,
    description: `Replies with the song currently playing`,
    category: `Music`,
    guildOnly: true,
    aliases: [`np`],
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.channel.send(`There is noting playing.`);


        // Sets the description field based on if the song is a livestream or not
        let description;
        if (serverQueue.songs[serverQueue.currentSong].livestream) {
            description = `🔴  **LIVE**`
        } else {
            const completed = currentTime(serverQueue);
            const percentComplete = completed / serverQueue.songs[serverQueue.currentSong].rawTime;

            let playingEmoji;
            if (serverQueue.playing) {
                playingEmoji = `▶`;
            } else {
                playingEmoji = `⏸`;
            }

            description = `\`\`\`${playingEmoji} ${time(completed)} ${progressbar(percentComplete, 25)} ${serverQueue.songs[serverQueue.currentSong].timestamp}\`\`\``;
        }


        // Create embed
        let nowPlayingEmbed = new Discord.MessageEmbed()
            .setColor(0xb0ffe2)
            .setAuthor(`🎶 Currently playing:`)
            .setTitle(`**${serverQueue.songs[serverQueue.currentSong].title}**`)
            .setURL(serverQueue.songs[serverQueue.currentSong].url)
            .setDescription(description)
            .setThumbnail(serverQueue.songs[serverQueue.currentSong].thumbnail)
            .setFooter(`Requested by: ${serverQueue.songs[serverQueue.currentSong].requestedBy.tag}`)
            .setTimestamp(new Date());

        // Send Embed
        return message.channel.send(nowPlayingEmbed);
    },
}