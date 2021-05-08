const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `247`,
    description: `Makes the queue continue to play even if no users are in VC (If loop is not enabled, the queue will automatically be looped)`,
    guildOnly: true,
    voteLocked: true,
    aliases: [`24/7`, `twentyfourseven`],
    usage: `[on/off]`,

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't make the music 24/7 if there is no music playing!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.voiceChannel.id) return message.reply(`you need to be in the same voice channel as me to make the music 24/7!`);

        // Sets the queue's 24/7 status based on arguments.
        if (!args[0] || args[0].toLowerCase() === `on`) {
            serverQueue.twentyFourSeven = true;
            if (serverQueue.loop === `off`) serverQueue.loop = `queue`;

            const twentyFourSevenEmbed = new Discord.MessageEmbed()
                .setColor(0x9cd6ff)
                .setTitle(`🕐  The music is now 24/7.`);

            return message.channel.send(twentyFourSevenEmbed);
        } else if (args[0].toLowerCase() === `off`) {
            serverQueue.twentyFourSeven = false;

            const twentyFourSevenEmbed = new Discord.MessageEmbed()
                .setColor(0x9cd6ff)
                .setTitle(`The queue is no longer 24/7.`);

            return message.channel.send(twentyFourSevenEmbed);
        } else {
            return message.reply(`that isn't a valid argument! You must specify "on" or "off".`);
        }
    }
};
