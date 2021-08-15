"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../config/Constants");
const collection_1 = require("@discordjs/collection");
const discord_rose_1 = require("discord-rose");
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = {
    command: `debug`,
    allowButton: true,
    interaction: {
        name: `debug`,
        description: `Used to easily troubleshoot common issues.`,
        options: [
            {
                type: 3,
                name: `permissions`,
                description: `Get a list of permissions using a supplied bit combination.`,
                required: false
            }
        ]
    },
    exec: async (ctx) => {
        if (ctx.options.permissions) {
            let bits;
            try {
                bits = BigInt(ctx.options.permissions);
            }
            catch (error) {
                return void ctx.error(`Invalid bit combination.`);
            }
            const permissions = Object.keys(discord_rose_1.PermissionsUtils.bits).map((bit) => `${discord_rose_1.PermissionsUtils.has(bits, bit) ? `:white_check_mark:` : `:x:`} ${`${bit.charAt(0).toUpperCase()}${bit.slice(1)}`.replace(/([A-Z])/g, ` $1`).trim()}`);
            ctx.embed
                .color(Constants_1.Constants.DEBUG_EMBED_COLOR)
                .title(`Permissions Debug`)
                .field(`Permissions for \`${Number(bits)}\``, permissions.splice(0, Math.ceil(permissions.length / 2)).join(`\n`), true)
                .field(`\u200b`, permissions.join(`\n`), true)
                .footer(`Guild ID: ${ctx.interaction.guild_id}`)
                .timestamp()
                .send()
                .catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        }
        else {
            const guild = await ctx.worker.api.guilds.get(ctx.interaction.guild_id).catch((error) => discord_utils_1.logError(error));
            const member = await ctx.worker.api.members.get(ctx.interaction.guild_id, ctx.worker.user.id).catch((error) => discord_utils_1.logError(error));
            const textChannel = await ctx.worker.api.channels.get(ctx.interaction.channel_id).catch((error) => discord_utils_1.logError(error));
            if (!guild || !member || !textChannel)
                return void ctx.error(`Unable to get the bot's permissions. Please try again.`);
            const roles = guild.roles.reduce((p, c) => p.set(c.id, c), new collection_1.Collection());
            const guildPermissions = discord_rose_1.PermissionsUtils.combine({
                guild,
                member,
                roleList: roles
            });
            const textChannelPermissions = textChannel
                ? discord_rose_1.PermissionsUtils.combine({
                    guild,
                    member,
                    overwrites: textChannel.permission_overwrites,
                    roleList: roles
                })
                : 0;
            const debugEmbed = new discord_rose_1.Embed()
                .color(Constants_1.Constants.DEBUG_EMBED_COLOR)
                .title(`Debug`)
                .description(`Peter's support server: ${Constants_1.Constants.SUPPORT_SERVER}\n**Thread ID:** \`${ctx.worker.comms.id}\``)
                .field(`Server`, `**ID:** \`${guild.id}\`\n**Permissions:** \`${guildPermissions}\`\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `viewChannel`) ? `:white_check_mark:` : `:exclamation:`} View Channels\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `connect`) ? `:white_check_mark:` : `:exclamation:`} Connect To Voice\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `speak`) ? `:white_check_mark:` : `:exclamation:`} Speak\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `requestToSpeak`) ? `:white_check_mark:` : `:grey_exclamation:`} Request To Speak\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `mute`) ? `:white_check_mark:` : `:grey_exclamation:`} Server Mute\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `sendMessages`) ? `:white_check_mark:` : `:exclamation:`} Send Messages\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `embed`) ? `:white_check_mark:` : `:exclamation:`} Embed Links\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `usePublicThreads`) ? `:white_check_mark:` : `:grey_exclamation:`} Use Public Threads\n${discord_rose_1.PermissionsUtils.has(guildPermissions, `usePrivateThreads`) ? `:white_check_mark:` : `:grey_exclamation:`} Use Private Threads`, true)
                .field(`This Channel`, `**ID:** \`${ctx.interaction.channel_id}\`\n**Permissions:** \`${textChannelPermissions}\`\n${discord_rose_1.PermissionsUtils.has(textChannelPermissions, `viewChannel`) ? `:white_check_mark:` : `:exclamation:`} View Channel\n${discord_rose_1.PermissionsUtils.has(textChannelPermissions, `sendMessages`) ? `:white_check_mark:` : `:exclamation:`} Send Messages\n${discord_rose_1.PermissionsUtils.has(textChannelPermissions, `embed`) ? `:white_check_mark:` : `:exclamation:`} Embed Links\n${discord_rose_1.PermissionsUtils.has(textChannelPermissions, `usePublicThreads`) ? `:white_check_mark:` : `:grey_exclamation:`} Use Public Threads\n${discord_rose_1.PermissionsUtils.has(textChannelPermissions, `usePrivateThreads`) ? `:white_check_mark:` : `:grey_exclamation:`} Use Private Threads`, true)
                .footer(`❗ = Missing essential permission, ❕ = Missing non-essential permission`);
            const player = ctx.worker.lavalink.players.get(guild.id);
            if (player) {
                const playerTextChannel = await ctx.worker.api.channels.get(player.options.textChannelId).catch((error) => discord_utils_1.logError(error));
                if (!playerTextChannel)
                    return void ctx.error(`Unable to get the bot's permission for the music player's text channel. Please try again.`);
                const playerTextChannelPermissions = discord_rose_1.PermissionsUtils.combine({
                    guild,
                    member,
                    overwrites: playerTextChannel.permission_overwrites,
                    roleList: roles
                });
                const playerVoiceChannel = await ctx.worker.api.channels.get(player.options.voiceChannelId).catch((error) => discord_utils_1.logError(error));
                if (!playerVoiceChannel)
                    return void ctx.error(`Unable to get the bot's permission for the music player's text channel. Please try again.`);
                const playerVoiceChannelPermissions = discord_rose_1.PermissionsUtils.combine({
                    guild,
                    member,
                    overwrites: playerVoiceChannel.permission_overwrites,
                    roleList: roles
                });
                debugEmbed
                    .field(`Music Player`, `**Node:** ${player.node.identifier}\n**Player state:** ${player.state}\n**Node state:** ${player.node.state}\n**Text Channel ID:**: \`${player.options.textChannelId}\`\n**Text Channel Permissions:** \`${playerTextChannelPermissions}\`\n**Voice Channel ID:** \`${player.options.voiceChannelId}\`\n**Voice Channel Permissions:** \`${playerVoiceChannelPermissions}\`\n**Current song:** ${player.currentTrack ? (player.currentTrack.uri ?? player.currentTrack.title) : `*No song playing.*`}`, false);
            }
            else
                debugEmbed.field(`Music Player`, `*No player found.*`, false);
            ctx.send(debugEmbed).catch((error) => {
                discord_utils_1.logError(error);
                void ctx.error(`Unable to send a response message. Make sure to check the bot's permissions.`);
            });
        }
    }
};
