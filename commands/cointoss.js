const Discord = require(`discord.js`);
const log = require(`../modules/log.js`);

module.exports = {
	name: `cointoss`,
	description: `Flips a coin, returns heads or tails.`,
	aliases: [`coin`, `coinflip`],
	async execute(client, message, args) {
        const value = Math.round(Math.random());

        if(value === 1) {
            message.channel.send("The coin landed on Heads!");
        } else {
            message.channel.send("The coin landed on Tails!");
        }
	},
}