const Discord = require(`discord.js`);
const log = require(`../utils/log.js`);

module.exports = {
	name: `invite`,
	description: `Returns Peter's invite link`,
	async execute(client, message, args) {
        message.channel.send(`**Peter's Invite link:**\n${client.config.get('links').invite}`)
	},
}