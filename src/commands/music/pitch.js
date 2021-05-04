const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);
const currentTime = require(`../../utils/currentTime.js`);
const streamhandler = require(`../../modules/streamhandler.js`);

module.exports = {
    name: `pitch`,
    description: `Change the pitch of the current song`,
    guildOnly: true,
    usage: `[pitch value]`,

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't change the pitch if there is no music playing!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to bassboost music!`);

        // Replies with the current pitch value if no arguments are specified.
        if (!args[0]) return message.channel.send(`The current pitch is: **${serverQueue.effects.pitch}%**`);

        // Checks to make sure the value specified is valid.
        const specifiedValue = checkValueSpecified(args[0], 25, 250, message, `off`);
        if (specifiedValue === `invalid`) return;

        // Sets value.
        serverQueue.effects.pitch = specifiedValue;

        // Restart the stream at the current time.
        streamhandler.restartStream(serverQueue, message, currentTime(serverQueue));

        const pitchEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`👂  Set the pitch to **${specifiedValue}%**`);

        return message.channel.send(pitchEmbed);
    }
};
