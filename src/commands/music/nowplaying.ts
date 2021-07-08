import { Constants } from '../../config/Constants';
import { ExtendedPlayer } from '../../managers/LavalinkManager';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { progressBar, timestamp } from '../../utils/Time';
import { cleanseMarkdown } from '../../utils/StringUtils';

export default {
    command: `nowplaying`,
    interaction: {
        name: `nowplaying`,
        description: `Get information on the current song playing.`
    },
    exec: (ctx) => {
        const player: ExtendedPlayer | undefined = ctx.worker.lavalink.players.get(ctx.interaction.guild_id) as any;
        if (!player || !player.queue.length) return void ctx.error(`Unable to get the current song; there is no music in the queue.`);
        if (!player.queue.current) return void ctx.error(`Unable to get the current song; there is no music playing.`);

        let description: string;
        if (player.queue.current.isStream) description = `🔴  **LIVE**`;
        else description = `\`\`\`\n${player.paused ? `⏸` : `▶`} ${timestamp(player.position)} ${progressBar(player.position / (player.queue.current.duration ?? player.position), 25)} ${timestamp(player.queue.current.duration ?? player.position)}\n\`\`\``;

        ctx.embed
            .color(Constants.NOW_PLAYING_EMBED_COLOR)
            .author(`Currently playing:`)
            .title(cleanseMarkdown(player.queue.current.title), player.queue.current.uri)
            .thumbnail(player.queue.current.displayThumbnail ? (player.queue.current.displayThumbnail(`mqdefault`) ?? ``) : ``)
            .description(description)
            .footer(`Requested by ${player.queue.current.requester}`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
