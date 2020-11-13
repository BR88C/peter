const Discord = require(`discord.js`);
const log = require(`../utils/log.js`);
const randomhex = require(`../utils/randomhex.js`);

module.exports = {
	name: `avatar`,
    description: `Displays the profile picture of you or a user`,
    category: `Utility`,
	guildOnly: false,
	cooldown: 5,
    aliases: [`pfp`],
    usage: `[@user]`,
	async execute(client, message, args) {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if(!user) user = message.author;

        let avatarEmbed = new Discord.MessageEmbed()
            .setColor(randomhex(user.id))
            .setTitle(`${user.username}'s Avatar`)
            .setDescription(`Links: [128](${user.avatarURL({ dynamic: true, size: 128})}) \| [256](${user.avatarURL({ dynamic: true, size: 256})}) \| [512](${user.avatarURL({ dynamic: true, size: 512})}) \| [1024](${user.avatarURL({ dynamic: true, size: 1024})}) \| [2048](${user.avatarURL({ dynamic: true, size: 2048})}) `)
            .setImage(user.avatarURL({ dynamic: true, size: 512}));

        message.channel.send(avatarEmbed);
	},
}