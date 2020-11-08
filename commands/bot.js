const Discord = require(`discord.js`);

module.exports = {
	name: `bot`,
    description: `Displays information about the bot`,
    category: `Bot Info`,
	aliases: [`about`],
	async execute(client, message, args) {
        let botInfoEmbed = new Discord.MessageEmbed()
            .setColor(0xffd87d)
            .setTitle(`Information about Peter!`)
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: `**Tag**`, value: client.user.tag, inline: true },
                { name: `**Number of Commands**`, value: client.commands.size, inline: true },
                { name: `**Prefix**`, value: client.config.get('prefix'), inline: true },
                { name: `**Author**`, value: client.config.get('dev').tag, inline: true },
                { name: `**Repository**`, value: client.pjson.get('repository').url.replace(`git+`, ``), inline: true },
                { name: `**Version**`, value: client.pjson.get('version'), inline: true }
            )

        message.channel.send(botInfoEmbed);
	},
}