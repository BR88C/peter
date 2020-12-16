const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `vote`,
    description: `Returns Peter's vote link`,
    aliases: [`votelink`],
    async execute (client, message, args) {
        let voteEmbed = new Discord.MessageEmbed()
            .setColor(0xaca6ff)
            .setTitle(`Peter's Vote link:`)
            .setDescription(client.config.links.voteLink);

        return message.channel.send(voteEmbed)
    },
}