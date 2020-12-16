const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const checkValueSpecified = require(`../../utils/checkValueSpecified.js`);
const currentTime = require(`../../utils/currentTime.js`);
const streamhandler = require(`../../modules/streamhandler.js`);

module.exports = {
    name: `bass`,
    description: `Bassboost the current song`,
    guildOnly: true,
    aliases: [`bassboost`],
    usage: `[bass value]`,
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't bassboost if there is no music playing!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to bassboost music!`);

        // Replies with the current bass value if no arguments are specified
        if (!args[0]) return message.channel.send(`The current bass level is: **+${serverQueue.bass}%**`);

        // Checks to make sure the value specified is valid
        const specifiedValue = checkValueSpecified(args[0], 0, 100, message, `off`);
        if (specifiedValue === `invalid`) return;

        // Sets value
        serverQueue.bass = specifiedValue;

        // Restart the stream at the current time
        streamhandler.restartStream(serverQueue, currentTime(serverQueue));

        let bassEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`🥁  Set the bass to **+${specifiedValue}%**`);

        return message.channel.send(bassEmbed);
    },
}