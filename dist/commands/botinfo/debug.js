"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../utils/Constants");
const cmd_1 = require("@distype/cmd");
const lavalink_1 = require("@distype/lavalink");
const v10_1 = require("discord-api-types/v10");
const distype_1 = require("distype");
exports.default = new cmd_1.ChatCommand()
    .setName(`debug`)
    .setDescription(`Troubleshoot issues`)
    .setDmPermission(false)
    .addChannelParameter(false, `channel`, `Get information about a channel`)
    .setExecute(async (ctx) => {
    if (!ctx.parameters.channel) {
        const guildPerms = await ctx.client.getSelfPermissions(ctx.guildId);
        const channelPerms = await ctx.client.getSelfPermissions(ctx.guildId, ctx.channelId);
        const missingGuildPerms = [...[...Object.values(lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS), Constants_1.Constants.TEXT_PERMISSIONS].reduce((p, c) => new Set([...p, ...c]), new Set())].filter((perm) => !distype_1.PermissionsUtils.hasPerms(guildPerms, perm)).map((perm) => `${lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_BECOME_SPEAKER.includes(perm) || lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_REQUEST.includes(perm) ? `:grey_exclamation:` : `:exclamation:`} ${perm.charAt(0)}${perm.replaceAll(`_`, ` `).toLowerCase().slice(1)}`).join(`\n`);
        const missingChannelPerms = Constants_1.Constants.TEXT_PERMISSIONS.filter((perm) => !distype_1.PermissionsUtils.hasPerms(channelPerms, perm)).map((perm) => `:exclamation: ${perm.charAt(0)}${perm.replaceAll(`_`, ` `).toLowerCase().slice(1)}`).join(`\n`);
        await ctx.send(new cmd_1.Embed()
            .setColor(cmd_1.DiscordColors.BLURPLE)
            .setTitle(`Debug`)
            .setDescription(`Support Server: ${process.env.SUPPORT_SERVER ?? `\`Support Server Unavailable\``}`)
            .setFields({
            name: `Server Information`,
            value: [
                `**ID:** \`${ctx.guildId}\``,
                `**Permissions:** \`${Number(guildPerms)}\``,
                ``,
                missingGuildPerms.length ? `**MISSING PERMISSIONS**\n${missingGuildPerms}` : `*No Missing Permissions*`
            ].join(`\n`),
            inline: true
        }, {
            name: `This Channel`,
            value: [
                `**ID:** \`${ctx.channelId}\``,
                `**Permissions:** \`${Number(channelPerms)}\``,
                ``,
                missingChannelPerms.length ? `**MISSING PERMISSIONS**\n${missingChannelPerms}` : `*No Missing Permissions*`
            ].join(`\n`),
            inline: true
        }, {
            name: `\u200b`,
            value: `\u200b`
        })
            .setFooter(`❗ = Missing essential permission, ❕ = Missing non-essential permission`));
    }
    else {
        const channelPerms = await ctx.client.getSelfPermissions(ctx.guildId, ctx.parameters.channel.id);
        const missingChannelPerms = [
            ...new Set((ctx.parameters.channel.type === v10_1.ChannelType.GuildVoice
                ? [
                    ...lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.VOICE,
                    ...lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.VOICE_MOVED
                ]
                : (ctx.parameters.channel.type === v10_1.ChannelType.GuildStageVoice
                    ? [
                        ...lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_BECOME_SPEAKER,
                        ...lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_REQUEST,
                        ...lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.VOICE,
                        ...lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.VOICE_MOVED
                    ]
                    : Constants_1.Constants.TEXT_PERMISSIONS)))
        ].filter((perm) => !distype_1.PermissionsUtils.hasPerms(channelPerms, perm)).map((perm) => `${lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_BECOME_SPEAKER.includes(perm) || lavalink_1.LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_REQUEST.includes(perm) ? `:grey_exclamation:` : `:exclamation:`} ${perm.charAt(0)}${perm.replaceAll(`_`, ` `).toLowerCase().slice(1)}`).join(`\n`);
        await ctx.send(new cmd_1.Embed()
            .setColor(cmd_1.DiscordColors.BLURPLE)
            .setTitle(`Debug`)
            .setDescription([
            `Support Server: ${process.env.SUPPORT_SERVER ?? `\`Support Server Unavailable\``}`,
            ``,
            `**Channel:** <#${ctx.parameters.channel.id}>`,
            `**ID:** \`${ctx.parameters.channel.id}\``,
            `**Permissions:** \`${Number(channelPerms)}\``,
            ``,
            missingChannelPerms.length ? `**MISSING PERMISSIONS**\n${missingChannelPerms}` : `*No Missing Permissions*`
        ].join(`\n`))
            .setFields({
            name: `\u200b`,
            value: `\u200b`
        })
            .setFooter(`❗ = Missing essential permission, ❕ = Missing non-essential permission`));
    }
});
