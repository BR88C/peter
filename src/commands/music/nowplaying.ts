import { cleanseMarkdown } from '../../utils/StringUtils';
import { Constants } from '../../config/Constants';

// Import modules.
import { CommandOptions } from 'discord-rose';
import { PlayerState, Track } from '@discord-rose/lavalink';
import { progressBar, timestamp } from '../../utils/Time';

export default {
    command: `nowplaying`,
    interaction: {
        name: `nowplaying`,
        description: `Get information on the current track playing.`
    },
    exec: (ctx) => {
        const player = ctx.worker.lavalink.players.get(ctx.interaction.guild_id!);
        if (!player || player.state < PlayerState.CONNECTED) return void ctx.error(`Unable to get the current track; the bot is not connected to the VC.`)
        if (!player.queue.length) return void ctx.error(`Unable to get the current track; there are no tracks in the queue.`);
        if (player.queuePosition === null || player.state < PlayerState.PAUSED) return void ctx.error(`Unable to get the current track; there are no tracks playing.`);

        let description: string;
        if ((player.queue[player.queuePosition] as Track).isStream) description = `🔴  **LIVE**`;
        else description = `\`\`\`\n${player.state === PlayerState.PAUSED ? `⏸` : `▶`} ${timestamp(player.position ?? 0)} ${progressBar((player.position ?? 0) / (player.queue[player.queuePosition].length ?? (player.position ?? 0)), 25)} ${timestamp(player.queue[player.queuePosition].length ?? (player.position ?? 0))}\n\`\`\``;

        ctx.embed
            .color(Constants.NOW_PLAYING_EMBED_COLOR)
            .author(`Currently playing:`)
            .title(cleanseMarkdown((player.queue[player.queuePosition] as Track).title), (player.queue[player.queuePosition] as Track).uri)
            .thumbnail((player.queue[player.queuePosition] as Track).thumbnail(`mqdefault`) ?? ``)
            .description(description)
            .footer(`Requested by ${player.queue[player.queuePosition].requester}`)
            .send()
            .catch((error) => void ctx.error(error));
    }
} as CommandOptions;
