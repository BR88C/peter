const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);
const streamhandler = require(`../../modules/streamhandler.js`);

module.exports = {
    name: `vibrato`,
    description: `Add vibrato to music`,
    guildOnly: true,
    usage: `[vibrato value]`,

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't add vibrato if there is no music playing!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.voiceChannel.id) return message.reply(`you need to be in the same voice channel as me to add vibrato to the music!`);

        // Replies with the current volume if no arguments are specified.
        if (!args[0]) return message.channel.send(`The current vibrato level is: **${serverQueue.effects.vibrato}%**`);

        // Checks to make sure the value specified is valid.
        const specifiedValue = checkValueSpecified(args[0], 0, 100, message, `off`);
        if (specifiedValue === `invalid`) return;

        // Sets value.
        serverQueue.effects.vibrato = specifiedValue;

        // Restart the stream at the current time.
        streamhandler.restartStream(serverQueue, message, serverQueue.currentTime());

        const vibratoEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`🎵  Set the vibrato to **${specifiedValue}%**`);

        return message.channel.send(vibratoEmbed);
    }
};
