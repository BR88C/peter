import { Constants } from '../../utils/Constants';

import { ChatCommand, DiscordColors, Embed } from '@distype/cmd';
import { LavalinkConstants } from '@distype/lavalink';
import { ChannelType } from 'discord-api-types/v10';
import { DiscordConstants, PermissionsUtils } from 'distype';

export default new ChatCommand()
    .setName(`debug`)
    .setDescription(`Troubleshoot issues`)
    .setGuildOnly(true)
    .addChannelOption(false, `channel`, `Get information about a channel`)
    .setExecute(async (ctx) => {
        if (!ctx.options.channel) {
            const guildPerms = await ctx.client.getSelfPermissions(ctx.guildId);
            const channelPerms = await ctx.client.getSelfPermissions(ctx.guildId, ctx.channelId);

            const missingGuildPerms = [...[...Object.values(LavalinkConstants.REQUIRED_PERMISSIONS), Constants.TEXT_PERMISSIONS].reduce((p, c) => new Set([...p, ...c]), new Set<keyof typeof DiscordConstants.PERMISSION_FLAGS>())].filter((perm) => !PermissionsUtils.hasPerms(guildPerms, perm)).map((perm) => `${LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_BECOME_SPEAKER.includes(perm as any) || LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_REQUEST.includes(perm as any) ? `:grey_exclamation:` : `:exclamation:`} ${perm.charAt(0)}${perm.replaceAll(`_`, ` `).toLowerCase().slice(1)}`).join(`\n`);
            const missingChannelPerms = Constants.TEXT_PERMISSIONS.filter((perm) => !PermissionsUtils.hasPerms(channelPerms, perm)).map((perm) => `:exclamation: ${perm.charAt(0)}${perm.replaceAll(`_`, ` `).toLowerCase().slice(1)}`).join(`\n`);

            await ctx.send(
                new Embed()
                    .setColor(DiscordColors.BLURPLE)
                    .setTitle(`Debug`)
                    .setDescription(`Support Server: ${process.env.SUPPORT_SERVER?.length ? process.env.SUPPORT_SERVER : `\`Support Server Unavailable\``}`)
                    .setFields(
                        {
                            name: `Server Information`,
                            value: [
                                `**ID:** \`${ctx.guildId}\``,
                                `**Permissions:** \`${Number(guildPerms)}\``,
                                ``,
                                missingGuildPerms.length ? `**MISSING PERMISSIONS**\n${missingGuildPerms}` : `*No Missing Permissions*`
                            ].join(`\n`),
                            inline: true
                        },
                        {
                            name: `This Channel`,
                            value: [
                                `**ID:** \`${ctx.channelId}\``,
                                `**Permissions:** \`${Number(channelPerms)}\``,
                                ``,
                                missingChannelPerms.length ? `**MISSING PERMISSIONS**\n${missingChannelPerms}` : `*No Missing Permissions*`
                            ].join(`\n`),
                            inline: true
                        },
                        {
                            name: `\u200b`,
                            value: `\u200b`
                        }
                    )
                    .setFooter(`❗ = Missing essential permission, ❕ = Missing non-essential permission`)
            );
        } else {
            const channelPerms = await ctx.client.getSelfPermissions(ctx.guildId, ctx.options.channel.id);

            const missingChannelPerms = [
                ...new Set(
                    (ctx.options.channel.type === ChannelType.GuildVoice
                        ? [
                            ...LavalinkConstants.REQUIRED_PERMISSIONS.VOICE,
                            ...LavalinkConstants.REQUIRED_PERMISSIONS.VOICE_MOVED
                        ]
                        : (
                            ctx.options.channel.type === ChannelType.GuildStageVoice
                                ? [
                                    ...LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_BECOME_SPEAKER,
                                    ...LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_REQUEST,
                                    ...LavalinkConstants.REQUIRED_PERMISSIONS.VOICE,
                                    ...LavalinkConstants.REQUIRED_PERMISSIONS.VOICE_MOVED
                                ]
                                : Constants.TEXT_PERMISSIONS
                        )
                    ) as Array<keyof typeof DiscordConstants.PERMISSION_FLAGS>
                )
            ].filter((perm) => !PermissionsUtils.hasPerms(channelPerms, perm)).map((perm) => `${LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_BECOME_SPEAKER.includes(perm as any) || LavalinkConstants.REQUIRED_PERMISSIONS.STAGE_REQUEST.includes(perm as any) ? `:grey_exclamation:` : `:exclamation:`} ${perm.charAt(0)}${perm.replaceAll(`_`, ` `).toLowerCase().slice(1)}`).join(`\n`);

            await ctx.send(
                new Embed()
                    .setColor(DiscordColors.BLURPLE)
                    .setTitle(`Debug`)
                    .setDescription([
                        `Support Server: ${process.env.SUPPORT_SERVER?.length ? process.env.SUPPORT_SERVER : `\`Support Server Unavailable\``}`,
                        ``,
                        `**Channel:** <#${ctx.options.channel.id}>`,
                        `**ID:** \`${ctx.options.channel.id}\``,
                        `**Permissions:** \`${Number(channelPerms)}\``,
                        ``,
                        missingChannelPerms.length ? `**MISSING PERMISSIONS**\n${missingChannelPerms}` : `*No Missing Permissions*`
                    ].join(`\n`))
                    .setFields({
                        name: `\u200b`,
                        value: `\u200b`
                    })
                    .setFooter(`❗ = Missing essential permission, ❕ = Missing non-essential permission`)
            );
        }
    });
