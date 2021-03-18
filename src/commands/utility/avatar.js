const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);
const randomHex = require(`../../utils/randomHex.js`);

module.exports = {
    name: `avatar`,
    description: `Displays the profile picture of you or a user`,
    guildOnly: false,
    aliases: [`pfp`],
    usage: `[@user]`,

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        let user = message.mentions.users.first();
        if (!user) user = message.author;

        let avatarEmbed = new Discord.MessageEmbed()
            .setColor(randomHex(user.id))
            .setTitle(`${user.username}'s Avatar`)
            .setDescription(`Links: [128](${user.avatarURL({ dynamic: true, size: 128 })}) \| [256](${user.avatarURL({ dynamic: true, size: 256 })}) \| [512](${user.avatarURL({ dynamic: true, size: 512 })}) \| [1024](${user.avatarURL({ dynamic: true, size: 1024 })}) \| [2048](${user.avatarURL({ dynamic: true, size: 2048 })}) `)
            .setImage(user.avatarURL({ dynamic: true, size: 512 }));

        return message.channel.send(avatarEmbed);
    }
};
