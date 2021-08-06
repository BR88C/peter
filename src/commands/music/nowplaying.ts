import { Constants } from '../../config/Constants';

// Import modules.
import { cleanseMarkdown, progressBar, timestamp } from '@br88c/discord-utils';
import { CommandOptions } from 'discord-rose';
import { PlayerState, Track } from '@discord-rose/lavalink';

export default {
    command: `nowplaying`,
    mustHaveConnectedPlayer: true,
    mustHaveTracksInQueue: true,
    mustBePausedOrPlaying: true,
    interaction: {
        name: `nowplaying`,
        description: `Get the current music playing.`
    },
    exec: (ctx) => {
        let description: string;
        if ((ctx.player!.currentTrack as Track).isStream) description = `🔴  **LIVE**`;
        else description = `\`\`\`\n${ctx.player!.state === PlayerState.PAUSED ? `⏸` : `▶`} ${timestamp(ctx.player!.position ?? 0)} ${progressBar((ctx.player!.position ?? 0) / (ctx.player!.currentTrack!.length ?? (ctx.player!.position ?? 0)), 25)} ${timestamp(ctx.player!.currentTrack!.length ?? (ctx.player!.position ?? 0))}\n\`\`\``;

        ctx.embed
            .color(Constants.NOW_PLAYING_EMBED_COLOR)
            .author(`Currently playing:`)
            .title(cleanseMarkdown(ctx.player!.currentTrack!.title), (ctx.player!.currentTrack! as Track).uri)
            .thumbnail((ctx.player!.currentTrack! as Track).thumbnail(`mqdefault`) ?? ``)
            .description(description)
            .footer(`Requested by ${ctx.player!.currentTrack!.requester}`)
            .send()
            .catch(() => void ctx.error(`Unable to send the response message.`));
    }
} as CommandOptions;
