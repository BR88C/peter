const Discord = require(`discord.js`);

module.exports = {
	name: `botinfo`,
	description: `Displays information about the bot`,
	aliases: [`bot`, `about`],
	async execute(client, message, args) {
        let botInfoEmbed = new Discord.MessageEmbed()
            .setTitle(`Information about Peter!`)
            .setThumbnail(client.user.avatarURL())
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