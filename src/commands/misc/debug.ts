import { Constants } from '../../config/Constants';

// Import modules.
import { Collection } from '@discordjs/collection';
import { CommandOptions, Embed, PermissionsUtils, Snowflake } from 'discord-rose';
import { Track } from '@discord-rose/lavalink';

export default {
    command: `debug`,
    interaction: {
        name: `debug`,
        description: `Used to easily troubleshoot common issues.`
    },
    exec: async (ctx) => {
        const guild = await ctx.worker.api.guilds.get(ctx.interaction.guild_id!);
        const member = await ctx.worker.api.members.get(guild.id, ctx.worker.user.id);
        const roles = guild?.roles.reduce<Collection<Snowflake, any>>((p, c) => p.set(c.id, c), new Collection()) ?? undefined;
        const textChannel = await ctx.worker.api.channels.get(ctx.interaction.channel_id).catch(() => {});

        const guildPermissions = PermissionsUtils.combine({
            guild,
            member,
            roleList: roles as any
        });
        const textChannelPermissions = textChannel
            ? PermissionsUtils.combine({
                guild,
                member,
                overwrites: textChannel.permission_overwrites,
                roleList: roles as any
            })
            : 0;

        const debugEmbed = new Embed()
            .color(Constants.DEBUG_EMBED_COLOR)
            .title(`Debug`)
            .description(`Peter's support server: ${Constants.SUPPORT_SERVER}`)
            .field(`Server`, `**ID:** \`${guild.id}\`\n**Permissions:** \`${guildPermissions}\`\n${PermissionsUtils.has(guildPermissions, `viewChannel`) ? `:white_check_mark:` : `:exclamation:`} View Channels\n${PermissionsUtils.has(guildPermissions, `connect`) ? `:white_check_mark:` : `:exclamation:`} Connect to Voice\n${PermissionsUtils.has(guildPermissions, `speak`) ? `:white_check_mark:` : `:exclamation:`} Speak\n${PermissionsUtils.has(guildPermissions, `requestToSpeak`) ? `:white_check_mark:` : `:grey_exclamation:`} Request to speak\n${PermissionsUtils.has(guildPermissions, `mute`) ? `:white_check_mark:` : `:grey_exclamation:`} Server mute\n${PermissionsUtils.has(guildPermissions, `sendMessages`) ? `:white_check_mark:` : `:exclamation:`} Send messages\n${PermissionsUtils.has(guildPermissions, `embed`) ? `:white_check_mark:` : `:exclamation:`} Embed links`, true)
            .field(`This Channel`, `**ID:** \`${ctx.interaction.channel_id}\`\n**Permissions:** \`${textChannelPermissions}\`\n${PermissionsUtils.has(textChannelPermissions, `viewChannel`) ? `:white_check_mark:` : `:exclamation:`} View Channel\n${PermissionsUtils.has(textChannelPermissions, `sendMessages`) ? `:white_check_mark:` : `:exclamation:`} Send messages\n${PermissionsUtils.has(textChannelPermissions, `embed`) ? `:white_check_mark:` : `:exclamation:`} Embed links`, true)
            .footer(`❗ = Missing essential permission, ❕ = Missing non-essential permission`);

        const player = ctx.worker.lavalink.players.get(guild.id);
        if (player) {
            const playerTextChannel = await ctx.worker.api.channels.get(player.options.textChannelId);
            const playerTextChannelPermissions = PermissionsUtils.combine({
                guild,
                member,
                overwrites: playerTextChannel.permission_overwrites,
                roleList: roles as any
            });

            const playerVoiceChannel = await ctx.worker.api.channels.get(player.options.voiceChannelId);
            const playerVoiceChannelPermissions = PermissionsUtils.combine({
                guild,
                member,
                overwrites: playerVoiceChannel.permission_overwrites,
                roleList: roles as any
            });

            debugEmbed
                .field(`Music Player`, `**Node:** ${player.node.identifier}\n**Player state:** ${player.state}\n**Node state:** ${player.node.state}\n**Text Channel ID:**: \`${player.options.textChannelId}\`\n**Text Channel Permissions:** \`${playerTextChannelPermissions}\`\n**Voice Channel ID:** \`${player.options.voiceChannelId}\`\n**Voice Channel Permissions:** \`${playerVoiceChannelPermissions}\`\n**Current song:** ${player.queuePosition !== null ? ((player.queue[player.queuePosition] as Track).uri ?? player.queue[player.queuePosition].title) : `*No song playing.*`}`, false);
        } else debugEmbed.field(`Music Player`, `*No player found.*`, false);

        ctx.send(debugEmbed).catch((error) => void ctx.error(error));
    }
} as CommandOptions;
