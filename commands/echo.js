const Discord = require(`discord.js`)

module.exports = {
	name: `echo`,
	description: `Says a custom message.`,
	devOnly: true,
	hide: true,
	usage: `[message]`,
	async execute(client, message, args) {
        var customMessage = args.slice(0).join(" ")
        await message.delete().catch(O_o=>{});
        message.channel.send(customMessage)
	},
};