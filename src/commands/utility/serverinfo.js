const Discord = require(`discord.js-light`);
const log = require(`../../modules/log.js`);

module.exports = {
    name: `serverinfo`,
    description: `Get info on your server`,
    guildOnly: true,
    aliases: [`guildinfo`, `server`, `guild`],

    /**
     * Execute the command.
     *
     * @param {Object} client Client object.
     * @param {Object} message Message object that executed the command.
     * @param {Array} args Parsed arguments.
     * @returns {Void} Void.
     */
    execute: async (client, message, args) => {
        // Check if server has invite splash.
        let inviteSplash;
        if (message.guild.splash) inviteSplash = `✅ Invite Splash`;
        else inviteSplash = `❌ Invite Splash`;

        // Check if server has banner.
        let serverBanner;
        if (message.guild.banner) serverBanner = `✅ Server Banner`;
        else serverBanner = `❌ Server Banner`;

        // Checks to make sure owner exists (applicable on large servers where the owner property will not be returned when the owner is offline).
        let serverOwner;
        if (message.guild.ownerID) {
            const serverOwnerUser = await client.users.fetch(message.guild.ownerID, false);
            serverOwner = `${serverOwnerUser.username}#${serverOwnerUser.discriminator}`;
        } else {
            serverOwner = `Error getting owner`;
        }

        // Create Embed.
        const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor(0x949fff)
            .setTitle(`Information about ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL({
                dynamic: true,
                size: 256
            }))
            .addFields({
                name: `**Owner**`,
                value: serverOwner,
                inline: true
            }, {
                name: `**Creation Date**`,
                value: new Date(message.guild.createdAt).toUTCString(),
                inline: true
            }, {
                name: `**Members**`,
                value: await message.guild.memberCount,
                inline: true
            }, {
                name: `**Boosts**`,
                value: `Server Level: ${message.guild.premiumTier}\nPeople Boosting: ${message.guild.premiumSubscriptionCount}`,
                inline: true
            }, {
                name: `**Server Features**`,
                value: `${inviteSplash}\n${serverBanner}`,
                inline: true
            }, {
                name: `**General Info**`,
                value: `Region: ${message.guild.region}\nVerification Level: ${message.guild.verificationLevel}\n[Icon URL](${message.guild.iconURL({ dynamic: true, size: 256 })})`,
                inline: true
            });

        // Send Embed.
        return message.channel.send(serverInfoEmbed);
    }
};
