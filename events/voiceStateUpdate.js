/* Leaves VCs if only the bot is present, or if bot is manually disconnected from vc */

const Discord = require(`discord.js`);

module.exports = (client, oldState, newState) => {
	// Create Leave Embed
	let leaveEmbed = new Discord.MessageEmbed()
		.setColor(0xff4a4a)
		.setTitle(`👋 Left due to no other users being present in\nthe VC, or due to being manually disconnected.`)

	// If a user leaves or changes channels
	if(oldState.channelID != newState.channelID && oldState.channelID != null) {
		const channelInfo = oldState.guild.channels.cache.get(oldState.channelID);
		// If the bot is the only user in the VC clear the queue and leave
		if(channelInfo.members.has(client.user.id) && channelInfo.members.size == 1) {
			const serverQueue = client.queue.get(oldState.guild.id);
			if(serverQueue) {
				serverQueue.textChannel.send(leaveEmbed);
				if(serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.destroy();
				if(client.queue) client.queue.delete(oldState.guild.id);
			}
			channelInfo.leave();
		// If the bot is manually disconnected clear the queue
		} else if(!channelInfo.members.has(client.user.id)) {
			const serverQueue = client.queue.get(oldState.guild.id);
			if(serverQueue) {
				serverQueue.textChannel.send(leaveEmbed);
				if(client.queue) client.queue.delete(oldState.guild.id);
			}
		}
	}
}