const Discord = require(`discord.js-light`);

module.exports = {
    name: `loop`,
    description: `Specify if the current song should be looped`,
    guildOnly: true,
    usage: `[off, single, or queue]`,

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
        if (!serverQueue || !serverQueue.songs[serverQueue.currentSong]) return message.reply(`I can't loop if if there is no music playing!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.voiceChannel.id) return message.reply(`you need to be in the same voice channel as me to loop the current song!`);

        // Checks if the current song is a livestream.
        if (serverQueue.songs[serverQueue.currentSong].livestream) return message.reply(`this command does not support livestreams!`);

        // Sets the type of loop based on arguments provided.
        if (args.length && args[0].toLowerCase() === `off`) {
            serverQueue.loop = `off`;

            const loopEmbed = new Discord.MessageEmbed()
                .setColor(0x9cd6ff)
                .setTitle(`Looping has been turned off.`);

            return message.channel.send(loopEmbed);
        } else if (args.length && args[0].toLowerCase() === `single`) {
            serverQueue.loop = `single`;

            const loopEmbed = new Discord.MessageEmbed()
                .setColor(0x9cd6ff)
                .setTitle(`🔂  Now looping the current song.`);

            return message.channel.send(loopEmbed);
        } else {
            serverQueue.loop = `queue`;

            const loopEmbed = new Discord.MessageEmbed()
                .setColor(0x9cd6ff)
                .setTitle(`🔁  Now looping the queue.`);

            return message.channel.send(loopEmbed);
        }
    }
};
