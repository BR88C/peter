const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const executeCommand = require(`../../modules/executeCommand.js`);
const streamhandler = require(`../../modules/streamhandler.js`);

module.exports = {
    name: `effects`,
    description: `View / manage effects`,
    guildOnly: true,
    aliases: [`effect`, `eff`, `sfx`],
    usage: `[An effects command, off, or clear]`,

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
        if (!serverQueue || !serverQueue.songs[0]) return message.reply(`I can't manage effects if the queue is empty!`);

        // Checks if the user is in the VC.
        if (message.member.voice.channelID !== serverQueue.voiceChannel.id) return message.reply(`you need to be in the same voice channel as me to manage effects!`);

        if (args.length && (args[0].toLowerCase() === `off` || args[0].toLowerCase() === `clear`)) {
            // Set all effects to default values.
            serverQueue.effects = {
                bass: 0,
                flanger: 0,
                highpass: 0,
                lowpass: 0,
                phaser: 0,
                pitch: 100,
                speed: 100,
                treble: 0,
                vibrato: 0,
                volume: 100
            };

            // Restart the stream at the current time.
            streamhandler.restartStream(serverQueue, message, serverQueue.currentTime());

            // Create embed.
            const effectsEmbed = new Discord.MessageEmbed()
                .setColor(0xff642b)
                .setTitle(`🧹  Cleared all effects!`);

            // Send embed.
            return message.channel.send(effectsEmbed);
        } else if (args.length) {
            const effectCommands = [`bass`, `bassboost`, `flanger`, `highpass`, `lowpass`, `phaser`, `pitch`, `speed`, `treble`, `vibrato`, `volume`, `v`];

            if (effectCommands.indexOf(args[0].toLowerCase()) > -1) {
                // Get command name and shift args.
                const commandName = args.shift().toLowerCase();

                // Execute the command.
                return executeCommand(commandName, args, client, message);
            } else return message.reply(`please specify a valid argument!`);
        } else {
            // Create embed.
            const effectsEmbed = new Discord.MessageEmbed()
                .setColor(0x1e90ff)
                .setTitle(`Active Effects:`)
                .setDescription(serverQueue.effectsString(`formatted`));

            // Send embed.
            return message.channel.send(effectsEmbed);
        }
    }
};
