const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const time = require(`../../utils/time.js`);
const streamhandler = require(`../../modules/streamhandler.js`);

module.exports = {
    name: `seek`,
    description: `Seek to a specified time in a song`,
    args: true,
    guildOnly: true,
    usage: `<time (seconds)>`,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't seek if there is no music playing!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to seek!`);

        // Checks if the current song is a livestream
        if (serverQueue.songs[serverQueue.currentSong].livestream) return message.reply(`this command does not support livestreams!`);

        // Checks to make sure the bass value is an integer
        let specifiedTime = parseInt(args[0]);
        if (isNaN(specifiedTime)) return message.reply(`please specify an Integer!`);

        // If the time specified is less than 0
        if (specifiedTime < 0) return message.reply(`you can't seek to a negative time!`);

        // If time specified is longer than the video, seek to the last 2 seconds of the video
        if (specifiedTime >= serverQueue.songs[serverQueue.currentSong].rawTime) specifiedTime = serverQueue.songs[serverQueue.currentSong].rawTime - 2;

        // Restart the stream at the specified time
        streamhandler.restartStream(serverQueue, specifiedTime);

        let seekEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`⏩  Seeked to **${time(specifiedTime)}**`);

        return message.channel.send(seekEmbed);
    }
};
