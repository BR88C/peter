const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);
const checkValueSpecified = require(`../utils/checkValueSpecified.js`);
const currentTime = require(`../utils/currentTime.js`);
const streamhandler = require(`../modules/streamhandler.js`);

module.exports = {
    name: `treble`,
    description: `Add treble to the current song`,
    category: `Music`,
    guildOnly: true,
    usage: `[treble value]`,
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't add treble if there is no music playing!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to add treble to the music!`);

        // Replies with the current treble value if no arguments are specified
        if (!args[0]) return message.channel.send(`The current treble level is: **+${serverQueue.treble}%**`);

        // Checks to make sure the value specified is valid
        const specifiedValue = checkValueSpecified(args[0], 0, 100, message, `off`);
        if (specifiedValue === `invalid`) return;

        // Sets value
        serverQueue.treble = specifiedValue;

        // Restart the stream at the current time
        streamhandler.restartStream(serverQueue, currentTime(serverQueue));

        let trebleEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`🎼  Set the treble to **+${specifiedValue}%**`);

        return message.channel.send(trebleEmbed);
    },
}