const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `resume`,
    description: `Resumes the current song`,
    guildOnly: true,
    aliases: [`unpause`],

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't resume the music if there is no music playing!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to resume the music!`);

        // Checks if the current song is a livestream
        if (serverQueue.songs[serverQueue.currentSong].livestream) return message.reply(`this command does not support livestreams!`);

        // Checks if the the music is paused
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();

            let resumeEmbed = new Discord.MessageEmbed()
                .setColor(0xb8ff9c)
                .setTitle(`▶  Current song was resumed!`);

            return message.channel.send(resumeEmbed);

            // If the music is already resumed
        } else {
            return message.reply(`there is nothing to resume!`);
        }
    }
};
