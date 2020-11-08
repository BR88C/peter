/* Leaves VCs if only the bot is present, or if bot is manually disconnected from vc */

const Discord = require(`discord.js`);

module.exports = (client, oldState, newState) => {
	// If a user leaves or changes channels
	if(oldState.channelID != newState.channelID && oldState.channelID != null) {
		const channelInfo = oldState.guild.channels.cache.get(oldState.channelID);
		// If the bot is the only user in the VC clear the queue and leave
		if(channelInfo.members.has(client.user.id) && channelInfo.members.size == 1) {
			const serverQueue = client.queue.get(oldState.guild.id);
			if(serverQueue) {
				serverQueue.connection.dispatcher.destroy();
				client.queue.delete(oldState.guild.id);
			}
			channelInfo.leave();
		// If the bot is manually disconnected clear the queue
		} else if(!channelInfo.members.has(client.user.id)) {
			const serverQueue = client.queue.get(oldState.guild.id);
			if(serverQueue) {
				client.queue.delete(oldState.guild.id);
			}
		}
	}
}