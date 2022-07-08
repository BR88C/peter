"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_utils_1 = require("@br88c/node-utils");
const cmd_1 = require("@distype/cmd");
exports.default = new cmd_1.ChatCommand()
    .setName(`nowplaying`)
    .setDescription(`Displays the currently playing track`)
    .setDmPermission(false)
    .setExecute(async (ctx) => {
    const player = ctx.client.lavalink.players.get(ctx.guildId);
    if (!player)
        return ctx.error(`The bot must be connected to a voice channel to use this command`);
    if (!player.currentTrack)
        return ctx.error(`There are currently no tracks playing`);
    const dashCount = Math.floor((player.currentTrack.isStream ? 0 : (player.trackPosition ?? 0) / player.currentTrack.length) * 18);
    const embed = new cmd_1.Embed()
        .setColor(cmd_1.DiscordColors.ROLE_SEA_GREEN)
        .setAuthor(`Currently playing:`)
        .setTitle((0, cmd_1.cleanseMarkdown)(player.currentTrack.title))
        .setURL(player.currentTrack.uri)
        .setDescription(player.currentTrack.isStream ? `:red_circle:  **LIVE**` : `\`\`\`\n${player.paused ? `⏸` : `▶️`} ${(0, node_utils_1.timestamp)(player.trackPosition ?? 0)} ${`─`.repeat(dashCount)}🔘${`─`.repeat(18 - dashCount)} ${(0, node_utils_1.timestamp)(player.currentTrack.length)}\n\`\`\``);
    if (player.currentTrack.thumbnail(`mqdefault`))
        embed.setThumbnail(player.currentTrack.thumbnail(`mqdefault`));
    if (player.currentTrack.requester)
        embed.setFooter(`Requested by ${player.currentTrack.requester}`);
    await ctx.send(embed);
});
