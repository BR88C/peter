const Discord = require(`discord.js`);

module.exports = {
	name: `avatar`,
	description: `Displays the profile picture of you or a user`,
	guildOnly: false,
	cooldown: 5,
    aliases: [`pfp`],
    usage: `[@user]`,
	async execute(client, message, args) {
        const user = message.mentions.users.first() || message.author;

        let avatarEmbed = new Discord.MessageEmbed()
            .setColor(0xfb94ff)
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.avatarURL());

        message.channel.send(avatarEmbed);
	},
}