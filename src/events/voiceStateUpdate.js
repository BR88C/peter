/* Leaves VCs if only the bot is present, or if bot is manually disconnected from vc */

const Discord = require(`discord.js-light`);

module.exports = async (client, oldState, newState) => {
    // If a user leaves
    if (oldState && !newState) {
        const serverQueue = client.queue.get(oldState.guild.id);
        const channelInfo = await oldState.guild.channels.fetch(oldState.channelID, false).catch(error => {
            return;
        });
        if (!channelInfo) return;
        const usersInVC = channelInfo.members.filter(member => !member.user.bot).size;

        // If the bot is the only user in the VC clear the queue and leave
        if (channelInfo.members.has(client.user.id) && usersInVC < 1) {
            if (serverQueue) {
                if (serverQueue.twentyFourSeven) return;

                let leaveEmbed = new Discord.MessageEmbed()
                    .setColor(0xff4a4a)
                    .setTitle(`👋 Left due to no other users being present in the VC.`);

                serverQueue.textChannel.send(leaveEmbed);
                if (serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.destroy();
                if (client.queue) client.queue.delete(oldState.guild.id);
            }
            channelInfo.leave();

            // If the bot is not in a VC and there is a queue, clear the queue 
        } else if (oldState.guild.voiceStates.cache.filter(id => id == client.user.id) && serverQueue) {
            let leaveEmbed = new Discord.MessageEmbed()
                .setColor(0xff4a4a)
                .setTitle(`👋 Left due to being manually disconnected.`);

            serverQueue.textChannel.send(leaveEmbed);
            if (client.queue) client.queue.delete(oldState.guild.id);
        }
    }
}