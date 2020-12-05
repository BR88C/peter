const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);

module.exports = {
    name: `invite`,
    description: `Returns Peter's invite link`,
    aliases: [`invitelink`],
    async execute (client, message, args) {
        let inviteEmbed = new Discord.MessageEmbed()
            .setColor(0x5eff97)
            .setTitle(`Peter's Invite link:`)
            .setDescription(client.config.links.invite);

        return message.channel.send(inviteEmbed)
    },
}