/* Leaves VCs if only the bot is present, or if bot is manually disconnected from vc */

const Discord = require(`discord.js-light`);

module.exports = async (client, oldState, newState) => {
    // If a user leaves
    if (oldState && !newState) {
        const serverQueue = client.queue.get(oldState.guild.id);

        const oldChannelInfo = await oldState.guild.channels.fetch(oldState.channelID, false).catch(error => {
            return;
        });
        if (!oldChannelInfo) return;
        const newChannelInfo = await client.channels.fetch(oldChannelInfo.id, false).catch(error => {
            return;
        });
        if (!newChannelInfo) return;

        const usersInVC = oldChannelInfo.members.filter(member => !member.user.bot).size;

        // If the bot is the only user in the VC clear the queue and leave
        if (oldChannelInfo.members.has(client.user.id) && usersInVC < 1) {
            if (serverQueue) {
                if (serverQueue.twentyFourSeven) return;

                let leaveEmbed = new Discord.MessageEmbed()
                    .setColor(0xff4a4a)
                    .setTitle(`👋 Left due to no other users being present in the VC.`);

                serverQueue.textChannel.send(leaveEmbed);

                if (serverQueue.connection.dispatcher) {
                    if (serverQueue.connection.dispatcher.streams && serverQueue.connection.dispatcher.streams.input) await serverQueue.connection.dispatcher.streams.input.emit(`close`);
                    serverQueue.connection.dispatcher.destroy();
                }
                if (serverQueue.songs) serverQueue.songs = [];
            }
            if (client.queue) client.queue.delete(oldState.guild.id);
            if (oldState.guild.voice.connection.channel) oldState.guild.voice.connection.channel.leave();

            // If the bot is not in a VC and there is a queue, clear the queue 
        } else if (!newChannelInfo.members.has(client.user.id) && serverQueue && oldState.channelID === serverQueue.channel.id) {
            let leaveEmbed = new Discord.MessageEmbed()
                .setColor(0xff4a4a)
                .setTitle(`👋 Left due to being manually disconnected.`);

            serverQueue.textChannel.send(leaveEmbed);
            if (client.queue) client.queue.delete(oldState.guild.id);
        }
    }
}