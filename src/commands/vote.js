const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `vote`,
	description: `Returns Peter's vote link`,
	async execute(client, message, args) {
        return message.channel.send(`**Peter's Vote link:**\n${client.config.links.voteLink}`)
	},
}