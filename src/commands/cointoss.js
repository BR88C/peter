const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);

module.exports = {
    name: `cointoss`,
    description: `Flips a coin, returns heads or tails`,
    aliases: [`coin`, `coinflip`],
    async execute (client, message, args) {
        const value = Math.round(Math.random());

        if (value === 1) {
            let headsEmbed = new Discord.MessageEmbed()
                .setColor(0xd4d4d4)
                .setTitle(`The coin landed on Heads!`);

            return message.channel.send(headsEmbed);
        } else {
            let tailsEmbed = new Discord.MessageEmbed()
                .setColor(0xd4d4d4)
                .setTitle(`The coin landed on Tails!`);

            return message.channel.send(tailsEmbed);
        }
    },
}