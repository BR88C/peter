const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);
const currentTime = require(`../../utils/currentTime.js`);
const streamhandler = require(`../../modules/streamhandler.js`);

module.exports = {
    name: `vibrato`,
    description: `Add vibrato to music`,
    guildOnly: true,
    usage: `[vibrato value]`,
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't add vibrato if there is no music playing!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to add vibrato to the music!`);

        // Replies with the current volume if no arguments are specified
        if (!args[0]) return message.channel.send(`The current vibrato level is: **${serverQueue.vibrato}%**`);

        // Checks to make sure the value specified is valid
        const specifiedValue = checkValueSpecified(args[0], 0, 100, message, `off`);
        if (specifiedValue === `invalid`) return;

        // Sets value
        serverQueue.vibrato = specifiedValue;

        // Restart the stream at the current time
        streamhandler.restartStream(serverQueue, currentTime(serverQueue));

        let vibratoEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`🎵  Set the vibrato to **${specifiedValue}%**`);

        return message.channel.send(vibratoEmbed);
    },
}