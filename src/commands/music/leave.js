const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `leave`,
    description: `Make the bot leave VC`,
    guildOnly: true,
    aliases: [`l`, `disconnect`, `exit`, `dc`, `stop`, `die`],

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        const serverQueue = message.client.queue.get(message.guild.id);

        let emoji;
        if (message.content.slice(client.config.prefix.length).trim().split(/ +/).shift().toLowerCase() === `die`) {
            emoji = `💀`;
        } else {
            emoji = `👋`;
        }

        if (message.guild.voice && message.guild.voice.connection) { // If the bot is in a VC, clear the queue and leave.
            if (serverQueue) {
                if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to make me leave!`);

                if (serverQueue.songs) {
                    for (const song of serverQueue.songs) {
                        if (song.stream !== null) {
                            if (typeof song.stream.destroy === `function`) song.stream.destroy();
                            song.stream = null;
                        }
                    }
                    serverQueue.songs = [];
                }
            }
            message.client.queue.delete(message.guild.id);
            if (message.guild.voice.connection.channel) message.guild.voice.connection.channel.leave();

            const leaveEmbed = new Discord.MessageEmbed()
                .setColor(0xff4a4a)
                .setTitle(`${emoji}  Left the VC.`);

            return message.channel.send(leaveEmbed);
        } else { // If the bot is not in a VC, make sure the queue is cleared.
            if (serverQueue) {
                if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to make me leave!`);

                if (serverQueue.songs) {
                    for (const song of serverQueue.songs) {
                        if (song.stream !== null) {
                            if (typeof song.stream.destroy === `function`) song.stream.destroy();
                            song.stream = null;
                        }
                    }
                    serverQueue.songs = [];
                }
            }
            if (message.client.queue) message.client.queue.delete(message.guild.id);
            return message.reply(`I can't leave if I'm not in a VC!`);
        }
    }
};
