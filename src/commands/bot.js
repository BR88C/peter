const Discord = require(`discord.js-light`);
const log = require(`../modules/log.js`);
const time = require(`../utils/time.js`);

module.exports = {
    name: `bot`,
    description: `Displays information about the bot`,
    category: `Bot Info`,
    aliases: [`about`, `peter`],
    async execute (client, message, args) {
        const uptime = time(Math.round(client.uptime / 1000));

        let botInfoEmbed = new Discord.MessageEmbed()
            .setColor(0xffd87d)
            .setTitle(`Information about Peter!`)
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 256 }))
            .addFields({
                name: `**Tag**`,
                value: client.user.tag,
                inline: true
            }, {
                name: `**Number of Commands**`,
                value: client.commands.size,
                inline: true
            }, {
                name: `**Prefix**`,
                value: client.config.prefix,
                inline: true
            }, {
                name: `**Author**`,
                value: client.config.devs.tags.join(`, `),
                inline: true
            }, {
                name: `**Ping**`,
                value: `${Math.round(100*client.ws.ping)/100}ms`,
                inline: true
            }, {
                name: `**Uptime**`,
                value: uptime,
                inline: true
            }, {
                name: `**Support Server**`,
                value: client.config.links.supportServer,
                inline: true
            }, {
                name: `**Website**`,
                value: client.config.links.website,
                inline: true
            }, {
                name: `**Version**`,
                value: client.pjson.version,
                inline: true
            });

        return message.channel.send(botInfoEmbed);
    },
}