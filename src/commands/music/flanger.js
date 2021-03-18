const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);
const currentTime = require(`../../utils/currentTime.js`);
const streamhandler = require(`../../modules/streamhandler.js`);

module.exports = {
    name: `flanger`,
    description: `Adds a flanger effect to the song`,
    guildOnly: true,
    usage: `[flanger value]`,

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't add a flanger effect if there is no music playing!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to add a flanger effect!`);

        // Replies with the current flanger value if no arguments are specified
        if (!args[0]) return message.channel.send(`The current flanger level is: **${serverQueue.effects.flanger}%**`);

        // Checks to make sure the value specified is valid
        const specifiedValue = checkValueSpecified(args[0], 0, 100, message, `off`);
        if (specifiedValue === `invalid`) return;

        // Sets value
        serverQueue.effects.flanger = specifiedValue;

        // Restart the stream at the current time
        streamhandler.restartStream(serverQueue, currentTime(serverQueue));

        let flangerEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`🎸  Set the flanger value to **${specifiedValue}%**`);

        return message.channel.send(flangerEmbed);
    }
};
