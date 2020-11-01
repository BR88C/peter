const Discord = require(`discord.js`);

module.exports = {
	name: `serverinfo`,
	description: `Get info on your server`,
	guildOnly: true,
	aliases: [`guildinfo`, `server`, `guild`],
	async execute(client, message, args) {
        // Check if server has news channel
        if(message.guild.channels.cache.filter(channel => channel.type == 'news').size > 0) {
            var newsChannel = `✅ News Channel`;
        } else {
            var newsChannel = `❌ News Channel`;
        }

        // Check if server has invite splash
        if(message.guild.splash) {
            var inviteSplash = `✅ Invite Splash`;
        } else {
            var inviteSplash = `❌ Invite Splash`;
        }

        // Check if server has banner
        if(message.guild.banner) {
            var serverBanner = `✅ Server Banner`;
        } else {
            var serverBanner = `❌ Server Banner`;
        }

        // Checks to make sure owner exists (applicable on large servers where the owner property will not be returned when the owner is offline)
        if(client.guilds.cache.get(message.guild.id).owner) {
            var serverOwner = client.guilds.cache.get(message.guild.id).owner.user.username;
        } else {
            var serverOwner = `Owner Offline`
        }


        // Create Embed
        let serverInfoEmbed = new Discord.MessageEmbed()
            .setColor(0x949fff)
            .setTitle(`Information about ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: `**Owner**`, value: serverOwner, inline: true },
                { name: `**Members**`, value: `Total Members: ${await message.guild.memberCount}\nRoles: ${await message.guild.roles.cache.size}`, inline: true },
                { name: `**Boosts**`, value: `Server Level: ${message.guild.premiumTier}\nPeople Boosting: ${message.guild.premiumSubscriptionCount}`, inline: true },
                { name: `**Channels**`, value: `Categories: ${message.guild.channels.cache.filter(channel => channel.type == 'category').size}\nText Channels: ${message.guild.channels.cache.filter(channel => channel.type == 'text').size}\nVoice Channels: ${message.guild.channels.cache.filter(channel => channel.type == 'voice').size}`, inline: true },
                { name: `**Server Features**`, value: `${newsChannel}\n${inviteSplash}\n${serverBanner}`, inline: true },
                { name: `**General Info**`, value: `Region: ${message.guild.region}\nVerification Level: ${message.guild.verificationLevel}\nCustom Emojis: ${message.guild.emojis.cache.size}`, inline: true }
            )

        // Send Embed
        message.channel.send(serverInfoEmbed);
	},
}