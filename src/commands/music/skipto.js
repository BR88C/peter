const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const streamhandler = require(`../../modules/streamhandler.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);

module.exports = {
    name: `skipto`,
    description: `Skips to a specified song in the queue`,
    guildOnly: true,
    args: true,
    aliases: [`goto`],
    usage: `<Queue Number of Song>`,

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
        if (!serverQueue || !serverQueue.songs[0]) return message.reply(`I can't skip to a song if there are no songs in the queue!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.voiceChannel.id) return message.reply(`you need to be in the same voice channel as me to remove music from the queue!`);

        // Checks to make sure the value specified is valid.
        const specifiedValue = checkValueSpecified(args[0], 1, serverQueue.songs.length, message);
        if (specifiedValue === `invalid`) return;

        // Sets the starTime to 0 and hidden to false for all songs.
        for (const song of serverQueue.songs) {
            song.startTime = 0;
            song.hidden = false;
        }

        // Skips to the specified song.
        serverQueue.currentSong = specifiedValue - 1;
        if (serverQueue.connection.dispatcher) {
            if (serverQueue.loop !== `single`) serverQueue.currentSong--;
            serverQueue.connection.dispatcher.end();
        } else streamhandler.play(message);

        const skippedToEmbed = new Discord.MessageEmbed()
            .setColor(0x9cd6ff)
            .setTitle(`⏭️  Skipped to **${serverQueue.songs[specifiedValue - 1].title}**!`);

        return message.channel.send(skippedToEmbed);
    }
};
