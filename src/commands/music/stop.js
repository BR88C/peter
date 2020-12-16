const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `stop`,
    description: `Stops all music and clears the queue`,
    guildOnly: true,
    async execute (client, message, args) {
        // If the queue is empty reply with an error
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.reply(`I can't stop the music if there is no music playing!`);

        // Checks if the user is in the VC
        if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to stop the music!`);

        // If the bot is in a vc, clear the queue as normal
        if (message.guild.voice.connection) {
            if (serverQueue.connection.dispatcher) {
                if (serverQueue.connection.dispatcher.streams && serverQueue.connection.dispatcher.streams.input) await serverQueue.connection.dispatcher.streams.input.emit(`close`);
                serverQueue.connection.dispatcher.destroy();
            }
            if (serverQueue.songs) serverQueue.songs = [];
            if (message.client.queue) message.client.queue.delete(message.guild.id);

            let stopEmbed = new Discord.MessageEmbed()
                .setColor(0xff0000)
                .setTitle(`🛑  Queue cleared and Music stopped.`);

            return message.channel.send(stopEmbed);
        // If the bot is not in a vc, make sure the queue is cleared and report an error
        } else {
            if (serverQueue.connection.dispatcher) {
                if (serverQueue.connection.dispatcher.streams && serverQueue.connection.dispatcher.streams.input) await serverQueue.connection.dispatcher.streams.input.emit(`close`);
                serverQueue.connection.dispatcher.destroy();
            }
            if (serverQueue.songs) serverQueue.songs = [];
            if (message.client.queue) message.client.queue.delete(message.guild.id);
            return message.reply(`I'm not in a VC, so there is no music to stop!`);
        }
    },
}