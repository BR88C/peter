const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `invite`,
	description: `Returns Peter's invite link`,
	async execute(client, message, args) {
        return message.channel.send(`**Peter's Invite link:**\n${client.config.links.invite}`)
	},
}