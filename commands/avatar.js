const Discord = require(`discord.js`);

module.exports = {
	name: `avatar`,
	description: `Displays the profile picture of you or a user`,
	guildOnly: false,
	cooldown: 5,
    aliases: [`pfp`],
    usage: `[@user]`,
	async execute(client, message, args) {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
          
        const user = message.mentions.users.first() || message.author;

        let avatarEmbed = new Discord.MessageEmbed()
            .setColor(getRandomInt(1,16777215))
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.avatarURL({ dynamic: true, size: 512 }));

        message.channel.send(avatarEmbed);
	},
}