import { timestamp } from '@br88c/node-utils';
import { ChatCommand, cleanseMarkdown, DiscordColors, Embed } from '@distype/cmd';

export default new ChatCommand()
    .setName(`nowplaying`)
    .setDescription(`Displays the currently playing track`)
    .setExecute(async (ctx) => {
        if (!ctx.guildId) return ctx.error(`This command only works in servers`);

        const player = ctx.client.lavalink.players.get(ctx.guildId);
        if (!player) return ctx.error(`The bot must be connected to a voice channel to use this command`);

        if (!player.currentTrack) return ctx.error(`There are currently no tracks playing`);

        const dashCount = Math.floor((player.currentTrack.isStream ? 0 : (player.trackPosition ?? 0) / player.currentTrack.length) * 18);

        const embed = new Embed()
            .setColor(DiscordColors.ROLE_SEA_GREEN)
            .setAuthor(`Currently playing:`)
            .setTitle(cleanseMarkdown(player.currentTrack.title))
            .setURL(player.currentTrack.uri)
            .setDescription(player.currentTrack.isStream ? `:red_circle:  **LIVE**` : `\`\`\`\n${player.paused ? `⏸` : `▶️`} ${timestamp(player.trackPosition ?? 0)} ${`─`.repeat(dashCount)}🔘${`─`.repeat(18 - dashCount)} ${timestamp(player.currentTrack.length)}\n\`\`\``);

        if (player.currentTrack.thumbnail(`mqdefault`)) embed.setThumbnail(player.currentTrack.thumbnail(`mqdefault`)!);
        if (player.currentTrack.requester) embed.setFooter(`Requested by ${player.currentTrack.requester}`);

        await ctx.send(embed);
    });
