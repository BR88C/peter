/* Leaves VCs if only the bot is present, or if bot is manually disconnected from vc */

const Discord = require(`discord.js`);

module.exports = (client, oldState, newState) => {
	// Create Leave Embed
	

	const serverQueue = client.queue.get(oldState.guild.id);

	// If a user leaves or changes channels
	if(oldState.channelID != newState.channelID && oldState.channelID != null) {
		const channelInfo = oldState.guild.channels.cache.get(oldState.channelID);
		const botChannelID = oldState.guild.members.cache.get(client.user.id).voice.channelID;
		const usersInVC = channelInfo.members.filter(member => !member.user.bot).size;

		// If the bot is the only user in the VC clear the queue and leave
		if(channelInfo.members.has(client.user.id) && usersInVC < 1) {
			if(serverQueue) {
				if(serverQueue.twentyFourSeven) return;

				let leaveEmbed = new Discord.MessageEmbed()
					.setColor(0xff4a4a)
					.setTitle(`👋 Left due to no other users being present in the VC.`);

				serverQueue.textChannel.send(leaveEmbed);
				if(serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.destroy();
				if(client.queue) client.queue.delete(oldState.guild.id);
			}
			channelInfo.leave();

		// If the bot is not in a VC and there is a queue, clear the queue 
		} else if(botChannelID == null && serverQueue) {
			let leaveEmbed = new Discord.MessageEmbed()
				.setColor(0xff4a4a)
				.setTitle(`👋 Left due to being manually disconnected.`);

			serverQueue.textChannel.send(leaveEmbed);
			if(client.queue) client.queue.delete(oldState.guild.id);
		}
	}
}