const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `pause`,
    description: `Pauses the current song`,
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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't pause the music if there is no music playing!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.voiceChannel.id) return message.reply(`you need to be in the same voice channel as me to pause the music!`);

        // Checks if the current song is a livestream.
        if (serverQueue.songs[serverQueue.currentSong].livestream) return message.reply(`this command does not support livestreams!`);

        if (!serverQueue.paused) { // Checks if the music isn't paused.
            serverQueue.paused = true;
            serverQueue.pausedSince = Date.now();
            serverQueue.connection.dispatcher.pause();

            const pauseEmbed = new Discord.MessageEmbed()
                .setColor(0xfff066)
                .setTitle(`⏸  Current song was paused!`);

            return message.channel.send(pauseEmbed);
        } else { // If the music is already paused.
            return message.reply(`there is nothing to pause!`);
        }
    }
};
