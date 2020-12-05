const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);
const checkValueSpecified = require(`../utils/checkValueSpecified.js`);
const currentTime = require(`../utils/currentTime.js`);
const streamhandler = require(`../modules/streamhandler.js`);

module.exports = {
    name: `speed`,
    description: `Change the speed of the music`,
    category: `Music`,
    guildOnly: true,
    aliases: [`tempo`],
    usage: `[% speed]`,
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't change the speed if there is no music playing!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to change the music's speed!`);

        // Checks if the current song is a livestream
        if (serverQueue.songs[serverQueue.currentSong].livestream) return message.reply(`this command does not support livestreams!`);

        // Replies with the current speed if no arguments are specified
        if (!args[0]) return message.channel.send(`The current speed is: **${serverQueue.speed}%**`);

        // Checks to make sure the value specified is valid
        const specifiedValue = checkValueSpecified(args[0], 50, 500, message, `off`);
        if (specifiedValue === `invalid`) return;

        // Get old speed
        const time = currentTime(serverQueue);

        // Sets value
        serverQueue.speed = specifiedValue;

        // Restart the stream at the current time
        streamhandler.restartStream(serverQueue, time);

        let speedEmbed = new Discord.MessageEmbed()
            .setColor(0xbccbd1)
            .setTitle(`🏃  Set the speed to **${specifiedValue}%**`);

        return message.channel.send(speedEmbed);
    },
}