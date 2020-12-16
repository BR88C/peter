const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `leave`,
    description: `Make the bot leave VC`,
    guildOnly: true,
    aliases: [`l`, `disconnect`, `exit`, `die`],
    async execute (client, message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);

        let emoji;
        if (message.content.slice(client.config.prefix.length).trim().split(/ +/).shift().toLowerCase() === `die`) {
            emoji = `💀`;
        } else {
            emoji = `👋`;
        }

        // If the bot is in a vc, clear the queue and leave
        if (message.guild.voice.connection) {
            if (serverQueue) {
                if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to make me leave!`);
                if (serverQueue.connection.dispatcher) {
                    if (serverQueue.connection.dispatcher.streams && serverQueue.connection.dispatcher.streams.input) await serverQueue.connection.dispatcher.streams.input.emit(`close`);
                    serverQueue.connection.dispatcher.destroy();
                }
                if (serverQueue.songs) serverQueue.songs = [];
            }
            if (message.client.queue) message.client.queue.delete(message.guild.id);
            if (message.guild.voice.connection.channel) message.guild.voice.connection.channel.leave();

            let leaveEmbed = new Discord.MessageEmbed()
                .setColor(0xff4a4a)
                .setTitle(`${emoji}  Left the VC.`);

            return message.channel.send(leaveEmbed);

        // If the bot is not in a vc, make sure the queue is cleared
        } else {
            if (serverQueue) {
                if (serverQueue.connection.dispatcher) {
                    if (message.member.voice.channelID !== serverQueue.channel.id) return message.reply(`you need to be in the same voice channel as me to make me leave!`);
                    if (serverQueue.connection.dispatcher.streams && serverQueue.connection.dispatcher.streams.input) await serverQueue.connection.dispatcher.streams.input.emit(`close`);
                    serverQueue.connection.dispatcher.destroy();
                }
                if (serverQueue.songs) serverQueue.songs = [];
            }
            if (message.client.queue) message.client.queue.delete(message.guild.id);
            return message.reply(`I can't leave if I'm not in a VC!`);
        }
    }
}