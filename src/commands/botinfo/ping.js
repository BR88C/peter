const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `ping`,
    description: `Shows ping in milliseconds`,
    async execute (client, message, args) {
        // Get ping
        const ping = Math.round(client.ws.ping);

        // Creates and sends the embed
        let pingEmbed = new Discord.MessageEmbed()
            .setColor(0x2100db)
            .setTitle(`Pong!`)
            .setDescription(`\`\`\`${ping}ms\`\`\``);

        return message.channel.send(pingEmbed);
    },
}