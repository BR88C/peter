/* Leaves VCs if only the bot is present, or if bot is manually disconnected from vc */

const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);

module.exports = async (client, oldState, newState) => {
    // If a user leaves
    if (oldState && !newState) {
        const serverQueue = client.queue.get(oldState.guild.id);

        const oldChannelInfo = await oldState.guild.channels.fetch(oldState.channelID, false).catch((error) => {
            log(error, `red`);
            return;
        });
        if (!oldChannelInfo) return;
        const newChannelInfo = await client.channels.fetch(oldChannelInfo.id, false).catch((error) => {
            log(error, `red`);
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

                if (serverQueue.songs) {
                    for (const song of serverQueue.songs) {
                        if (song.stream !== null) {
                            if (typeof song.stream.destroy === `function`) song.stream.destroy();
                            song.stream = null;
                        }
                    };
                    serverQueue.songs = [];
                }
            }
            if (client.queue) client.queue.delete(oldState.guild.id);
            if (oldState.guild.voice.connection.channel) oldState.guild.voice.connection.channel.leave();

            // If the bot is not in a VC and there is a queue, clear the queue 
        } else if (!newChannelInfo.members.has(client.user.id) && serverQueue && oldState.channelID.toString() === serverQueue.channel.id.toString()) {
            let leaveEmbed = new Discord.MessageEmbed()
                .setColor(0xff4a4a)
                .setTitle(`👋 Left due to being manually disconnected.`);

            serverQueue.textChannel.send(leaveEmbed);

            if (serverQueue.songs) {
                for (const song of serverQueue.songs) {
                    if (song.stream !== null) {
                        if (typeof song.stream.destroy === `function`) song.stream.destroy();
                        song.stream = null;
                    }
                };
                serverQueue.songs = [];
            }

            if (client.queue) client.queue.delete(oldState.guild.id);
        }
    }
}