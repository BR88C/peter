const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `skip`,
    description: `Skips the current song`,
    guildOnly: true,
    aliases: [`s`],

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't skip if there is no music playing!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to skip music!`);

        // Sets the starTime to 0 and hidden to false for next song.
        if (serverQueue.loop === `single`) {
            serverQueue.songs[serverQueue.currentSong].startTime = 0;
            serverQueue.songs[serverQueue.currentSong].hidden = false;
        } else if (serverQueue.songs[serverQueue.currentSong + 1]) {
            serverQueue.songs[serverQueue.currentSong + 1].startTime = 0;
            serverQueue.songs[serverQueue.currentSong + 1].hidden = false;
        } else if (serverQueue.loop === `queue`) {
            serverQueue.songs[0].startTime = 0;
            serverQueue.songs[0].hidden = false;
        }

        // Skips to the next song.
        serverQueue.connection.dispatcher.end();

        const skipEmbed = new Discord.MessageEmbed()
            .setColor(0x9cd6ff)
            .setTitle(`⏭️  The current song has been skipped.`);

        return message.channel.send(skipEmbed);
    }
};
