const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);

module.exports = {
    name: `volume`,
    description: `Sets the volume for the music`,
    guildOnly: true,
    aliases: [`v`],
    usage: `[volume %]`,

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't change the volume if there is no music playing!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.voiceChannel.id) return message.reply(`you need to be in the same voice channel as me to change the volume!`);

        // Replies with the current volume if no arguments are specified.
        if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);

        // Checks to make sure the value specified is valid.
        const specifiedValue = checkValueSpecified(args[0], 0, Infinity, message, `mute`);
        if (specifiedValue === `invalid`) return;

        // Sets the volume.
        serverQueue.volume = specifiedValue;
        serverQueue.connection.dispatcher.setVolumeLogarithmic(specifiedValue / 250);

        const volumeEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`🔊  Set the volume to **${specifiedValue}%**`);

        return message.channel.send(volumeEmbed);
    }
};
