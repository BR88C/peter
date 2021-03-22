const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);

module.exports = {
    name: `remove`,
    description: `Removes a song from the queue`,
    guildOnly: true,
    args: true,
    aliases: [`rm`],
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
        if (!serverQueue || !serverQueue.songs[0]) return message.reply(`I can't remove queued music if the queue is empty!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to remove music from the queue!`);

        // Checks to make sure the value specified is valid.
        const specifiedValue = checkValueSpecified(args[0], 1, serverQueue.songs.length, message);
        if (specifiedValue === `invalid`) return;

        // Checks if the song trying to be removed is the current song.
        if (specifiedValue - 1 === serverQueue.currentSong) return message.reply(`you can't remove the song currently playing!`);

        // Destroy the stream if it exists
        if (serverQueue.songs[specifiedValue - 1].stream && typeof serverQueue.songs[specifiedValue - 1].stream.destroy === `function`) serverQueue.songs[specifiedValue - 1].stream.destroy();

        // Removes the specified song from the queue.
        const song = serverQueue.songs.splice(specifiedValue - 1, 1);

        // Change the current song index if needed.
        if (specifiedValue - 1 < serverQueue.currentSong) serverQueue.currentSong--;

        const removeEmbed = new Discord.MessageEmbed()
            .setColor(0xff668a)
            .setTitle(`❌  Removed **${song[0].title}** from the queue!`);

        return message.channel.send(removeEmbed);
    }
};
