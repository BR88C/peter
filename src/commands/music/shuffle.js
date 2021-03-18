const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const shuffleArray = require(`../../utils/shuffleArray.js`);

module.exports = {
    name: `shuffle`,
    description: `Shuffles the queue`,
    guildOnly: true,

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
        if (!serverQueue || !serverQueue.songs[0]) return message.reply(`I can't shuffle the queue if there are no songs in the queue!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to shuffle the queue!`);

        // Sets the starTime to 0 and hidden to false for all songs.
        for (const song of serverQueue.songs) {
            song.startTime = 0;
            song.hidden = false;
        }

        // Shuffle the queue.
        serverQueue.currentSong = 0;
        if (serverQueue.loop !== `single`) serverQueue.currentSong--;
        serverQueue.songs = shuffleArray(serverQueue.songs);
        serverQueue.connection.dispatcher.end();

        const shuffleEmbed = new Discord.MessageEmbed()
            .setColor(0x9cd6ff)
            .setTitle(`🔀  Shuffled the queue`);

        return message.channel.send(shuffleEmbed);
    }
};
