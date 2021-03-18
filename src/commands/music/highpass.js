const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);
const currentTime = require(`../../utils/currentTime.js`);
const streamhandler = require(`../../modules/streamhandler.js`);

module.exports = {
    name: `highpass`,
    description: `Add a highpass filter to the song`,
    guildOnly: true,
    usage: `[highpass value]`,

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't add a highpass filter if there is no music playing!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to add a highpass filter!`);

        // Replies with the current highpass value if no arguments are specified.
        if (!args[0]) return message.channel.send(`The current highpass level is: **+${serverQueue.effects.highpass}%**`);

        // Checks to make sure the value specified is valid.
        const specifiedValue = checkValueSpecified(args[0], 0, 100, message, `off`);
        if (specifiedValue === `invalid`) return;

        // Sets value.
        serverQueue.effects.highpass = specifiedValue;

        // Restart the stream at the current time.
        streamhandler.restartStream(serverQueue, currentTime(serverQueue));

        let highpassEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`⬆️  Set the highpass level to **+${specifiedValue}%**`);

        return message.channel.send(highpassEmbed);
    }
};
